import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /adminパスへのアクセスにBasic認証を適用
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '認証が必要です' }),
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const [username, password] = Buffer.from(
      authHeader.split(' ')[1],
      'base64'
    ).toString().split(':')

    // 環境変数から認証情報を取得（本番環境では安全に管理）
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'password'

    if (
      username !== validUsername ||
      password !== validPassword
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '認証に失敗しました' }),
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}