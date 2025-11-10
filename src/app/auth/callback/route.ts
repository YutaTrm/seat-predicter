import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('redirect') || '/'

  // OAuthプロバイダーからのエラー
  if (error) {
    console.error('OAuth provider error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    )
  }

  if (code) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not found in callback route')
      return NextResponse.redirect(new URL('/auth/login?error=config_error', request.url))
    }

    const cookieStore = await cookies()
    const redirectUrl = next.startsWith('http') ? next : new URL(next, requestUrl.origin).toString()
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          response.cookies.delete({ name, ...options })
        }
      }
    })

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Error exchanging code for session:', {
          message: exchangeError.message,
          status: exchangeError.status,
          name: exchangeError.name
        })
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      // セッションが正常に確立されたか確認
      if (!data.session) {
        console.error('✗ No session created')
        return NextResponse.redirect(
          new URL('/auth/login?error=no_session_created', request.url)
        )
      }

      // キャッシュを無効化してセッション情報を確実に更新
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')

      return response
    } catch (error) {
      console.error('Unexpected error in callback:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected_error', request.url)
      )
    }
  }

  return NextResponse.redirect(
    new URL('/auth/login?error=no_code', request.url)
  )
}
