'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signOut } from '@/lib/supabase/auth'
import { fetchUserTickets, deleteUserTicket, UserTicket } from '@/utils/myPageUtils'
import { deleteUserAccount } from './actions'
import type { Session } from '@supabase/supabase-js'
import SectionHeader from '../components/common/SectionHeader'
import Footer from '../components/common/Footer'
import Icon from '../components/common/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
// import { GoogleAdsense } from '../components/common/GoogleAdsense'

/**
 * マイページコンポーネント
 */
type SortOption = 'created_at_desc' | 'created_at_asc' | 'artist_name_asc' | 'artist_name_desc'

export default function MyPage() {
  const { t } = useLanguage()
  const [session, setSession] = useState<Session | null>(null)
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [sortedTickets, setSortedTickets] = useState<UserTicket[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('created_at_desc')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
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

  // チケット一覧をソート
  useEffect(() => {
    const sorted = [...tickets]

    switch (sortOption) {
      case 'created_at_desc':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'created_at_asc':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'artist_name_asc':
        sorted.sort((a, b) => a.artist_name.localeCompare(b.artist_name, 'ja'))
        break
      case 'artist_name_desc':
        sorted.sort((a, b) => b.artist_name.localeCompare(a.artist_name, 'ja'))
        break
    }

    setSortedTickets(sorted)
  }, [tickets, sortOption])

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

  // 退会処理
  const handleDeleteAccount = async () => {
    if (!session?.user?.id) {
      alert('ユーザー情報が取得できません')
      return
    }

    const confirmed = confirm('退会すると登録したチケットは削除されます。本当に退会しますか？')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteUserAccount(session.user.id)

      if (result.success) {
        alert('退会が完了しました')
        router.push('/')
        router.refresh()
      } else {
        alert(result.error || '退会処理に失敗しました')
      }
    } catch (error) {
      console.error('退会エラー:', error)
      alert('退会処理に失敗しました')
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  // チケット削除処理
  const handleDeleteClick = async (ticket: UserTicket) => {
    if (!session) return

    // 確認ダイアログ（ツアー名と座席情報を表示）
    const message = t('mypage.deleteConfirm')
      .replace('{artist}', ticket.artist_name)
      .replace('{tour}', ticket.tour_name)
      .replace('{block}', ticket.block)
      .replace('{blockNumber}', String(ticket.block_number))
      .replace('{column}', String(ticket.column))
      .replace('{number}', String(ticket.number))

    const confirmed = confirm(message)
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteUserTicket(ticket.id, session.user.id)

      if (result.success) {
        // 削除成功したらチケット一覧を更新
        const updatedTickets = await fetchUserTickets(session.user.id)
        setTickets(updatedTickets)
      } else {
        alert(result.error || t('mypage.deleteError'))
      }
    } catch (error) {
      console.error('削除エラー:', error)
      alert(t('mypage.deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">{t('mypage.loading')}</p>
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
    t('mypage.user')

  const avatarUrl =
    userMetadata?.avatar_url ||
    userMetadata?.picture ||
    userMetadata?.profile_image_url ||
    userMetadata?.picture_url

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      {/* 将来的に広告を表示する場合は下記のコメントを外してください */}
      {/* <GoogleAdsense /> */}

      {/* ヘッダー */}
      <SectionHeader title={t('mypage.title')} />
      <div className="mb-8">
        {/* ユーザー情報カード */}
        <div className="bg-white border rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
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
                <h2 className="font-bold text-gray-600">{displayName}</h2>
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 flex-1 rounded transition-colors"
            >
              {t('mypage.logout')}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="h-full bg-white hover:bg-red-100 text-red-300 px-4 py-2 border-red-300 border rounded transition-colors"
              >
                <Icon type="menu" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg z-20 min-w-[120px]">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? '処理中...' : '退会'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* チケット一覧 */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-700 font-bold">
            {t('mypage.myTickets')} <span className='text-sm'><span className='text-rose-500'>{tickets.length}</span>{t('home.count')}</span>
          </h2>

          {tickets.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-1 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="created_at_desc">{t('mypage.sortNewest')}</option>
                <option value="created_at_asc">{t('mypage.sortOldest')}</option>
                <option value="artist_name_asc">{t('mypage.sortArtistAsc')}</option>
                <option value="artist_name_desc">{t('mypage.sortArtistDesc')}</option>
              </select>
            </div>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">{t('mypage.noTickets')}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded transition-colors"
            >
              {t('mypage.postTicket')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTickets.map((ticket) => (
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
                      <span className="text-gray-500">{t('mypage.lotterySlot')}</span>
                      <span className="text-gray-600">{ticket.lottery_slots_name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{t('mypage.seat')}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-rose-600 text-xl">
                          {ticket.block}{ticket.block_number}
                        </span>
                        <span className="text-gray-400 text-sm">{t('mypage.block')}</span>
                        <span className="font-bold text-rose-600 text-xl">
                          {ticket.column}
                        </span>
                        <span className="text-gray-400 text-sm">{t('mypage.row')}</span>
                        <span className="font-bold text-rose-600 text-xl">
                          {ticket.number}
                        </span>
                        <span className="text-gray-400 text-sm">{t('mypage.number')}</span>
                      </div>
                    </div>
                  </div>

                  {/* 区切り線 */}
                  <div className="border-t-2 border-dashed border-rose-200 my-2"></div>

                  {/* 投稿日時と削除ボタン */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {t('mypage.postedOn')}:
                      {new Date(ticket.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                    <button
                      onClick={() => handleDeleteClick(ticket)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-600 transition-colors gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
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

      {/* フッター */}
      <div className="mt-12 mb-8">
        <Footer />
      </div>
    </main>
  )
}
