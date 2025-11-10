import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found in middleware')
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options) {
        response.cookies.delete({ name, ...options })
      }
    }
  })

  const { data: { session } } = await supabase.auth.getSession()

  // /adminパスへのアクセス（ただし /admin/login は除外）
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      // 未認証の場合、管理者ログインページにリダイレクト
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback'
  ]
}