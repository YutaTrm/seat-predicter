'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'

/**
 * 管理者専用ヘッダーメニューコンポーネント
 */
export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseClient()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="mb-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          {/* 左側: タイトル＋メニュー */}
          <div>
            <h1 className="text-2xl font-bold text-rose-600 mb-4">管理者画面</h1>
            <nav className="flex gap-4 flex-wrap">
              <Link
                href="/admin"
                className={`text-sm transition-colors ${
                  isActive('/admin')
                    ? 'text-rose-700 font-bold'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
              >
                アーティスト管理
              </Link>
              <Link
                href="/admin/user"
                className={`text-sm transition-colors ${
                  isActive('/admin/user')
                    ? 'text-rose-700 font-bold'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
              >
                ユーザー管理
              </Link>
              <Link
                href="/admin/ticket"
                className={`text-sm transition-colors ${
                  isActive('/admin/ticket')
                    ? 'text-rose-700 font-bold'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
              >
                チケット管理
              </Link>
              <Link
                href="/admin/venue"
                className={`text-sm transition-colors ${
                  isActive('/admin/venue')
                    ? 'text-rose-700 font-bold'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
              >
                会場管理
              </Link>
            </nav>
          </div>

          {/* 右側: ログアウトボタン */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
