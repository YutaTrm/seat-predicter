import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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

  console.log('=== Auth Callback ===')
  console.log('URL:', requestUrl.toString())
  console.log('Code:', code ? 'present' : 'missing')
  console.log('Error:', error)
  console.log('Error Description:', error_description)

  // OAuthプロバイダーからのエラー
  if (error) {
    console.error('OAuth provider error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    )
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    try {
      console.log('Exchanging code for session...')
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
      if (data.session) {
        console.log('✓ Session established successfully')
        console.log('User ID:', data.user?.id)
        console.log('User Email:', data.user?.email)
        console.log('User Metadata:', data.user?.user_metadata)
      } else {
        console.error('✗ No session created')
        return NextResponse.redirect(
          new URL('/auth/login?error=no_session_created', request.url)
        )
      }
    } catch (error) {
      console.error('Unexpected error in callback:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected_error', request.url)
      )
    }
  } else {
    console.error('No code provided in callback')
    return NextResponse.redirect(
      new URL('/auth/login?error=no_code', request.url)
    )
  }

  // 認証成功後のリダイレクト先
  // 相対パスの場合は絶対URLに変換
  const redirectUrl = next.startsWith('http') ? next : new URL(next, requestUrl.origin).toString()

  console.log('Redirecting to:', redirectUrl)
  console.log('=== End Auth Callback ===')

  // リダイレクトレスポンスを作成
  const response = NextResponse.redirect(redirectUrl)

  // キャッシュを無効化してセッション情報を確実に更新
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
}
