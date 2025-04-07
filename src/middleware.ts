import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /adminパスへのアクセスに管理者認証を適用
  if (pathname.startsWith('/admin')) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // ユーザー情報を取得
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // 未認証の場合、ログインページにリダイレクト
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 管理者権限チェック
    if (!user.user_metadata.role || user.user_metadata.role !== 'admin') {
      // 管理者権限がない場合、トップページにリダイレクト
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}