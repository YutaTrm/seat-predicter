'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { fetchAllTicketsWithUsers, fetchAllArtistsAndTours, AdminTicket } from '@/utils/adminTicketUtils'
import { deleteTicketAction } from './actions'
import AdminHeader from '@/app/components/admin/AdminHeader'

type SortKey = 'artist_name' | 'tour_name' | 'user_email' | 'block' | 'ticket_created_at'
type SortOrder = 'asc' | 'desc'

const ITEMS_PER_PAGE = 100

/**
 * 管理者用チケット一覧ページ
 */
function AdminTicketPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tickets, setTickets] = useState<AdminTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<AdminTicket[]>([])
  const [paginatedTickets, setPaginatedTickets] = useState<AdminTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortKey, setSortKey] = useState<SortKey>((searchParams.get('sort') as SortKey) || 'ticket_created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams.get('order') as SortOrder) || 'desc')
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [filterArtist, setFilterArtist] = useState(searchParams.get('artist') || '')
  const [filterTour, setFilterTour] = useState(searchParams.get('tour') || '')
  const [allArtists, setAllArtists] = useState<Array<{ id: number; name: string }>>([])
  const [allTours, setAllTours] = useState<Array<{ id: number; name: string; artist_id: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // チケット一覧を取得
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        // セッションチェック
        const session = await getSession()
        if (!session) {
          router.push('/admin/login')
          return
        }

        // チケット一覧とアーティスト・ツアー情報を並行取得
        const [allTickets, { artists, tours }] = await Promise.all([
          fetchAllTicketsWithUsers(),
          fetchAllArtistsAndTours()
        ])

        if (mounted) {
          setTickets(allTickets)
          setAllArtists(artists)
          setAllTours(tours)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('データ取得エラー:', err)
        if (mounted) {
          setError('チケット情報を取得できませんでした。管理者権限があるか確認してください。')
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [router])

  // 検索、フィルター、ソート
  useEffect(() => {
    let result = [...tickets]

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(ticket => {
        const artistName = ticket.artist_name?.toLowerCase() || ''
        const tourName = ticket.tour_name?.toLowerCase() || ''
        const userName = ticket.user_name?.toLowerCase() || ''
        const userFullName = ticket.user_full_name?.toLowerCase() || ''
        const userEmail = ticket.user_email?.toLowerCase() || ''
        const block = `${ticket.block}${ticket.block_number}`.toLowerCase()

        return artistName.includes(query) ||
               tourName.includes(query) ||
               userName.includes(query) ||
               userFullName.includes(query) ||
               userEmail.includes(query) ||
               block.includes(query)
      })
    }

    // カラムフィルター
    if (filterArtist) {
      result = result.filter(ticket => ticket.artist_name === filterArtist)
    }
    if (filterTour) {
      result = result.filter(ticket => ticket.tour_name === filterTour)
    }

    // ソート
    result.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortKey) {
        case 'artist_name':
          aValue = a.artist_name || ''
          bValue = b.artist_name || ''
          break
        case 'tour_name':
          aValue = a.tour_name || ''
          bValue = b.tour_name || ''
          break
        case 'user_email':
          aValue = a.user_email || ''
          bValue = b.user_email || ''
          break
        case 'block':
          aValue = `${a.block}${a.block_number}`
          bValue = `${b.block}${b.block_number}`
          break
        case 'ticket_created_at':
          aValue = new Date(a.ticket_created_at).getTime()
          bValue = new Date(b.ticket_created_at).getTime()
          break
        default:
          aValue = ''
          bValue = ''
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredTickets(result)
    setCurrentPage(1) // フィルター変更時は1ページ目に戻る
  }, [tickets, searchQuery, filterArtist, filterTour, sortKey, sortOrder])

  // ページネーション
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedTickets(filteredTickets.slice(startIndex, endIndex))
  }, [filteredTickets, currentPage])

  // ソート処理
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

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

    router.push(`/admin/ticket?${newParams.toString()}`, { scroll: false })
  }

  // URLパラメータ同期
  useEffect(() => {
    updateUrlParams({
      search: searchQuery,
      sort: sortKey,
      order: sortOrder,
      page: currentPage.toString(),
      artist: filterArtist,
      tour: filterTour
    })
  }, [searchQuery, sortKey, sortOrder, currentPage, filterArtist, filterTour])

  // チケット削除処理
  const handleDeleteTicket = async () => {
    if (!selectedTicket) return

    const message = `以下のチケットを削除してもよろしいですか？\n\n【${selectedTicket.artist_name}】\n${selectedTicket.tour_name}\n座席: ${selectedTicket.block}${selectedTicket.block_number}ブロック ${selectedTicket.column}列 ${selectedTicket.number}番\n${selectedTicket.day ? `day${selectedTicket.day}\n` : ''}\n投稿者: ${selectedTicket.user_email}\n\nこの操作は取り消せません。`

    const confirmed = confirm(message)
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteTicketAction(selectedTicket.ticket_id)

      if (result.success) {
        // 削除成功したらチケット一覧を更新
        const updatedTickets = tickets.filter(t => t.ticket_id !== selectedTicket.ticket_id)
        setTickets(updatedTickets)
        setSelectedTicket(null)
        alert('チケットを削除しました')
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

  // フィルター用のプルダウン（全てのアーティスト、ID昇順）
  const uniqueArtists = allArtists.map(a => a.name)

  // ツアーのプルダウン（選択されたアーティストに紐づいたツアーのみ表示、ID昇順）
  const uniqueTours = filterArtist
    ? allTours
        .filter(tour => {
          const artist = allArtists.find(a => a.name === filterArtist)
          return artist ? tour.artist_id === artist.id : false
        })
        .map(tour => tour.name)
    : allTours.map(tour => tour.name)

  // ページネーション情報
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE)
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)

  // ローディング中
  if (isLoading) {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6">
      <AdminHeader />

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 選択されたチケットの詳細 */}
      {selectedTicket && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6 w-full">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">チケット詳細</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteTicket}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '削除中...' : '削除'}
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 投稿者情報 */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">投稿者</h3>
              <div className="flex items-center gap-3 mb-3">
                {selectedTicket.user_avatar_url ? (
                  <img
                    src={selectedTicket.user_avatar_url}
                    alt={selectedTicket.user_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    {selectedTicket.user_name || selectedTicket.user_full_name || '名前なし'}
                  </p>
                  <p className="text-sm text-gray-500">{selectedTicket.user_email || 'メールなし'}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>ユーザーID: {selectedTicket.user_id}</p>
                <p>登録日: {selectedTicket.user_created_at ? new Date(selectedTicket.user_created_at).toLocaleDateString('ja-JP') : '-'}</p>
              </div>
            </div>

            {/* チケット情報 */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">座席情報</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">アーティスト:</span>
                  <span className="font-medium">{selectedTicket.artist_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ツアー:</span>
                  <span className="font-medium">{selectedTicket.tour_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">抽選枠:</span>
                  <span className="font-medium">{selectedTicket.lottery_slots_name}</span>
                </div>
                {selectedTicket.day && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">公演日:</span>
                    <span className="font-medium">day{selectedTicket.day}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">座席:</span>
                  <span className="font-medium text-rose-600">
                    {selectedTicket.block}{selectedTicket.block_number}ブロック {selectedTicket.column}列 {selectedTicket.number}番
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">投稿日時:</span>
                  <span className="font-medium">{new Date(selectedTicket.ticket_created_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 検索ボックスとフィルター */}
      <div className="mb-4 bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="アーティスト名、ツアー名、ユーザー名、メールアドレス、ブロックで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* フィルター */}
        <div className="flex flex-wrap gap-2 mt-4">
          <select
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="">全アーティスト</option>
            {uniqueArtists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>

          <select
            value={filterTour}
            onChange={(e) => setFilterTour(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="">全ツアー</option>
            {uniqueTours.map(tour => (
              <option key={tour} value={tour}>{tour}</option>
            ))}
          </select>

          {(filterArtist || filterTour) && (
            <button
              onClick={() => {
                setFilterArtist('')
                setFilterTour('')
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              フィルタークリア
            </button>
          )}
        </div>
      </div>

      {/* 件数表示 */}
      <div className="mb-2 text-sm text-gray-600">
        {filteredTickets.length > 0 ? (
          <>
            {startItem}〜{endItem}件 / 全<span className="font-medium text-rose-500">{filteredTickets.length}</span>件
            {(searchQuery || filterArtist || filterTour) && (
              <span className="text-gray-400 ml-2">(全{tickets.length}件中)</span>
            )}
          </>
        ) : (
          <>全<span className="font-medium text-rose-500">0</span>件</>
        )}
      </div>

      {/* チケット一覧テーブル */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('artist_name')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-1">
                    アーティスト
                    {sortKey === 'artist_name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    ツアー
                    {sortKey === 'tour_name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('block')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-1">
                    座席(day)
                    {sortKey === 'block' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  チケット種別
                </th>
                <th
                  onClick={() => handleSort('user_email')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-1">
                    投稿者
                    {sortKey === 'user_email' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ticket_created_at')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-1">
                    投稿日時
                    {sortKey === 'ticket_created_at' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {searchQuery || filterArtist || filterTour ? '検索結果がありません' : 'チケットがありません'}
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedTicket?.ticket_id === ticket.ticket_id ? 'bg-rose-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-rose-600">{ticket.artist_name}</div>
                      <div className="text-xs text-gray-900">{ticket.tour_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ticket.block}{ticket.block_number} {ticket.column}列 {ticket.number}番
                        {ticket.day && <span className="ml-1 text-xs text-gray-500">(day{ticket.day})</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ticket.lottery_slots_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {ticket.user_avatar_url ? (
                          <img
                            src={ticket.user_avatar_url}
                            alt={ticket.user_name || 'User'}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.user_name || ticket.user_full_name || '名前なし'}
                          </div>
                          <div className="text-xs text-gray-500">{ticket.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(ticket.ticket_created_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            最初
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === pageNum
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            最後
          </button>
        </div>
      )}
    </main>
  )
}

export default function AdminTicketPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="flex items-center justify-center min-h-[50vh]"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div><p className="mt-4 text-gray-600">読み込み中...</p></div></div></div>}>
      <AdminTicketPageContent />
    </Suspense>
  )
}
