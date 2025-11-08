import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const res = NextResponse.next()

  // Supabaseクライアントを作成
  const supabase = createMiddlewareClient<Database>({ req: request, res })

  // セッションをリフレッシュして最新の状態を取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

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

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback'
  ]
}