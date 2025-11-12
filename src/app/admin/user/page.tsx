'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { fetchAllUsers, AdminUser } from '@/utils/adminUtils'
import { fetchUserTickets, UserTicket } from '@/utils/myPageUtils'
import type { Session } from '@supabase/supabase-js'
import AdminHeader from '@/app/components/admin/AdminHeader'

/**
 * 管理者用ユーザー管理ページ
 */
type SortKey = 'name' | 'email' | 'created_at' | 'last_sign_in_at' | 'ticket_count'
type SortOrder = 'asc' | 'desc'

function AdminUserPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userTickets, setUserTickets] = useState<UserTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortKey, setSortKey] = useState<SortKey>((searchParams.get('sort') as SortKey) || 'created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams.get('order') as SortOrder) || 'desc')

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
      let aValue: string | number
      let bValue: string | number

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
        default:
          aValue = ''
          bValue = ''
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredUsers(result)
  }, [users, searchQuery, sortKey, sortOrder])

  // URLパラメータを更新
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    router.push(`/admin/user?${newParams.toString()}`, { scroll: false })
  }

  // URLパラメータ同期
  useEffect(() => {
    updateUrlParams({
      search: searchQuery,
      sort: sortKey,
      order: sortOrder
    })
  }, [searchQuery, sortKey, sortOrder])

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
      // 管理画面ではダミーデータを使用しない（skipDevMode = true）
      const tickets = await fetchUserTickets(user.id, true)
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
      <AdminHeader />

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="relative border rounded-lg overflow-hidden bg-white"
                  >
                    {/* チケット上部の飾り */}
                    <div className="absolute top-0 left-0 right-0 h-2 from-rose-400 via-pink-400 to-rose-400"></div>

                    {/* チケット内容 */}
                    <div className="p-4">
                      {/* アーティスト名 */}
                      <h3 className="text-lg font-bold text-rose-600 mb-1 truncate">
                        {ticket.artist_name}
                      </h3>

                      {/* ツアー名とday*/}
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {ticket.tour_name}
                        {ticket.day && (
                          <span className="font-medium text-gray-400"> (day{ticket.day})</span>
                        )}
                      </p>

                      {/* 区切り線 */}
                      <div className="border-t-2 border-dashed border-rose-200 my-2"></div>

                      {/* 座席情報 */}
                      <div className="space-y-2 mb-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">抽選枠</span>
                          <span className="text-gray-600">{ticket.lottery_slots_name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">座席</span>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-rose-600 text-xl">
                              {ticket.block}{ticket.block_number}
                            </span>
                            <span className="text-gray-400 text-sm">ブロック</span>
                            <span className="font-bold text-rose-600 text-xl">
                              {ticket.column}
                            </span>
                            <span className="text-gray-400 text-sm">列</span>
                            <span className="font-bold text-rose-600 text-xl">
                              {ticket.number}
                            </span>
                            <span className="text-gray-400 text-sm">番</span>
                          </div>
                        </div>
                      </div>

                      {/* 区切り線 */}
                      <div className="border-t-2 border-dashed border-rose-200 my-2"></div>

                      {/* 投稿日時 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          投稿日:
                          {new Date(ticket.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* チケット右側の切り取り線風装飾 */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around items-center bg-white">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      ))}
                    </div>
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

export default function AdminUserPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="flex items-center justify-center min-h-[50vh]"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div><p className="mt-4 text-gray-600">読み込み中...</p></div></div></div>}>
      <AdminUserPageContent />
    </Suspense>
  )
}
