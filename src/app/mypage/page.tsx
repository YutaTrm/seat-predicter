'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signOut } from '@/lib/supabase/auth'
import { fetchUserTickets, deleteUserTicket, UserTicket } from '@/utils/myPageUtils'
import type { Session } from '@supabase/supabase-js'
import Modal from '@/app/components/common/Modal'

/**
 * マイページコンポーネント
 */
export default function MyPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  // セッションとチケット一覧を取得
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const currentSession = await getSession()

        if (!mounted) return

        if (!currentSession) {
          // ログインしていない場合はホームページにリダイレクト
          router.push('/')
          return
        }

        setSession(currentSession)

        // ユーザーのチケット一覧を取得
        const userTickets = await fetchUserTickets(currentSession.user.id)
        if (mounted) {
          setTickets(userTickets)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('データ取得エラー:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [router])

  // ログアウト処理
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  // 削除確認ダイアログを表示
  const handleDeleteClick = (ticketId: number) => {
    setDeleteTargetId(ticketId)
    setShowDeleteConfirm(true)
  }

  // チケット削除処理
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || !session) return

    setIsDeleting(true)
    try {
      const result = await deleteUserTicket(deleteTargetId, session.user.id)

      if (result.success) {
        // 削除成功したらチケット一覧を更新
        const updatedTickets = await fetchUserTickets(session.user.id)
        setTickets(updatedTickets)
        setShowDeleteConfirm(false)
        setDeleteTargetId(null)
      } else {
        alert(result.error || 'チケットの削除に失敗しました')
      }
    } catch (error) {
      console.error('削除エラー:', error)
      alert('チケットの削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  // 削除キャンセル
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setDeleteTargetId(null)
  }

  // ローディング中
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    )
  }

  // ログインしていない場合（リダイレクト前の表示）
  if (!session) {
    return null
  }

  // ユーザー情報を取得
  const user = session.user
  const userMetadata = user.user_metadata
  const displayName =
    userMetadata?.name ||
    userMetadata?.full_name ||
    userMetadata?.user_name ||
    userMetadata?.preferred_username ||
    user.email?.split('@')[0] ||
    'ユーザー'

  const avatarUrl =
    userMetadata?.avatar_url ||
    userMetadata?.picture ||
    userMetadata?.profile_image_url ||
    userMetadata?.picture_url

  return (
    <main className="container mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl text-rose-500 font-bold text-center mb-6">マイページ</h1>

        {/* ユーザー情報カード */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : null}
              <div
                className={`w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white ${avatarUrl ? 'hidden' : ''}`}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{displayName}</h2>
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* チケット一覧 */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-700 font-bold">
            投稿したチケット <span className="text-rose-500">({tickets.length}件)</span>
          </h2>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-rose-500 hover:text-rose-700 transition-colors"
          >
            ← ホームに戻る
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">まだチケットを投稿していません</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded transition-colors"
            >
              チケットを投稿する
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アーティスト
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ツアー
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      抽選枠
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ブロック
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      列
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      番号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      投稿日時
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.artist_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.tour_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.lottery_slots_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.block}-{ticket.block_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.column}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ticket.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteClick(ticket.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        title="チケット削除確認"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            このチケットを削除してもよろしいですか？
          </p>
          <p className="text-sm text-gray-500">
            この操作は取り消せません。
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              削除する
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
