'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { fetchAllUsers, AdminUser } from '@/utils/adminUtils'
import { fetchUserTickets, UserTicket } from '@/utils/myPageUtils'
import type { Session } from '@supabase/supabase-js'
import SectionHeader from '../../components/common/SectionHeader'

/**
 * 管理者用ユーザー管理ページ
 */
type SortKey = 'name' | 'email' | 'created_at' | 'last_sign_in_at' | 'ticket_count'
type SortOrder = 'asc' | 'desc'

export default function AdminUserPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userTickets, setUserTickets] = useState<UserTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const router = useRouter()

  // セッションとユーザー一覧を取得
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const currentSession = await getSession()

        if (!mounted) return

        if (!currentSession) {
          // ログインしていない場合は管理者ログインページにリダイレクト
          router.push('/admin/login')
          return
        }

        setSession(currentSession)

        // 全ユーザー一覧を取得
        const allUsers = await fetchAllUsers()
        if (mounted) {
          setUsers(allUsers)
          setFilteredUsers(allUsers)
          setIsLoading(false)

          // ユーザーが取得できなかった場合のエラーメッセージ
          if (allUsers.length === 0) {
            setError('ユーザー情報を取得できませんでした。管理者権限があるか確認してください。')
          }
        }
      } catch (error) {
        console.error('データ取得エラー:', error)
        if (mounted) {
          setError('データの取得に失敗しました: ' + (error as Error).message)
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [router])

  // 検索とソートを適用
  useEffect(() => {
    let result = [...users]

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(user => {
        const name = user.raw_user_meta_data?.name?.toLowerCase() || ''
        const fullName = user.raw_user_meta_data?.full_name?.toLowerCase() || ''
        const userName = user.raw_user_meta_data?.user_name?.toLowerCase() || ''
        const email = user.email?.toLowerCase() || ''

        return name.includes(query) ||
               fullName.includes(query) ||
               userName.includes(query) ||
               email.includes(query)
      })
    }

    // ソート
    result.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortKey) {
        case 'name':
          aValue = a.raw_user_meta_data?.name || a.raw_user_meta_data?.full_name || ''
          bValue = b.raw_user_meta_data?.name || b.raw_user_meta_data?.full_name || ''
          break
        case 'email':
          aValue = a.email || ''
          bValue = b.email || ''
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'last_sign_in_at':
          aValue = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0
          bValue = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0
          break
        case 'ticket_count':
          aValue = a.ticket_count
          bValue = b.ticket_count
          break
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredUsers(result)
  }, [users, searchQuery, sortKey, sortOrder])

  // ソートハンドラー
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // 同じキーをクリックした場合は昇順/降順を切り替え
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 別のキーをクリックした場合は新しいキーで降順
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  // ユーザー選択時にチケット一覧を取得
  const handleUserSelect = async (user: AdminUser) => {
    setSelectedUser(user)
    setIsLoadingTickets(true)

    try {
      const tickets = await fetchUserTickets(user.id)
      setUserTickets(tickets)
    } catch (error) {
      console.error('チケット取得エラー:', error)
    } finally {
      setIsLoadingTickets(false)
    }
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

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8">
      {/* ヘッダー */}
      <h1 className="text-2xl font-bold">ユーザー一覧</h1>

      <div className="mb-4">
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-rose-500 hover:text-rose-700 transition-colors"
        >
          ← 管理者ページに戻る
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">エラー</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">
            ブラウザのコンソール（F12）を開いて、詳細なエラーログを確認してください。
          </p>
        </div>
      )}

      {/* 選択中のユーザー情報 */}
      {selectedUser && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">選択中のユーザー</h2>
              <div className="flex items-start gap-4">
                {/* ユーザーアバター */}
                {(selectedUser.raw_user_meta_data?.avatar_url ||
                  selectedUser.raw_user_meta_data?.picture ||
                  selectedUser.raw_user_meta_data?.profile_image_url) && (
                  <img
                    src={
                      selectedUser.raw_user_meta_data?.avatar_url ||
                      selectedUser.raw_user_meta_data?.picture ||
                      selectedUser.raw_user_meta_data?.profile_image_url
                    }
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                )}

                <div className="space-y-1 text-sm flex-1">
                  <p className="text-gray-600">
                    <span className="font-medium">ユーザーID:</span> {selectedUser.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">名前:</span> {
                      selectedUser.raw_user_meta_data?.name ||
                      selectedUser.raw_user_meta_data?.full_name ||
                      'なし'
                    }
                  </p>
                  {selectedUser.raw_user_meta_data?.user_name && (
                    <p className="text-gray-600">
                      <span className="font-medium">ユーザー名:</span> @{selectedUser.raw_user_meta_data.user_name}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">メール:</span> {selectedUser.email || 'なし'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">登録日:</span> {new Date(selectedUser.created_at).toLocaleString('ja-JP')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">最終ログイン:</span> {
                      selectedUser.last_sign_in_at
                        ? new Date(selectedUser.last_sign_in_at).toLocaleString('ja-JP')
                        : 'なし'
                    }
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">投稿チケット数:</span> <span className="text-rose-500 font-bold">{selectedUser.ticket_count}</span>件
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null)
                setUserTickets([])
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* ユーザーのチケット一覧 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-700 mb-3">投稿したチケット</h3>
            {isLoadingTickets ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent"></div>
              </div>
            ) : userTickets.length === 0 ? (
              <p className="text-gray-500 text-center py-4">チケットがありません</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 rounded p-3 text-sm border border-gray-200"
                  >
                    <p className="font-bold text-gray-800 truncate">{ticket.artist_name}</p>
                    <p className="text-xs text-gray-600 truncate mb-2">{ticket.tour_name}</p>
                    <p className="text-gray-700">
                      <span className="font-medium text-rose-600">
                        {ticket.block}{ticket.block_number}
                      </span>ブロック{' '}
                      <span className="font-medium text-rose-600">{ticket.column}</span>列{' '}
                      <span className="font-medium text-rose-600">{ticket.number}</span>番
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ticket.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ユーザー一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-700">
              登録ユーザー一覧 <span className="text-sm"><span className="text-rose-500">{users.length}</span>人</span>
              {searchQuery && (
                <span className="text-sm text-gray-600 ml-2">
                  （{filteredUsers.length}件表示中）
                </span>
              )}
            </h2>
          </div>

          {/* 検索ボックス */}
          <div className="relative">
            <input
              type="text"
              placeholder="名前、ユーザー名、メールアドレスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '検索条件に一致するユーザーがいません' : 'ユーザーがいません'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      名前
                      {sortKey === 'name' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      メール
                      {sortKey === 'email' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('created_at')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      登録日
                      {sortKey === 'created_at' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('last_sign_in_at')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      最終ログイン
                      {sortKey === 'last_sign_in_at' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('ticket_count')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      投稿数
                      {sortKey === 'ticket_count' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-rose-50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        {user.raw_user_meta_data?.name || user.raw_user_meta_data?.full_name || '-'}
                      </div>
                      {user.raw_user_meta_data?.user_name && (
                        <div className="text-xs text-gray-500">@{user.raw_user_meta_data.user_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString('ja-JP')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className="text-rose-500 font-bold">{user.ticket_count}</span>件
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="text-rose-600 hover:text-rose-800 text-sm font-medium transition-colors"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
