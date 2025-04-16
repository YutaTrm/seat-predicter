'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useArtistData } from '@/hooks/useArtistData'
import { useTourData } from '@/hooks/useTourData'
import { useLotterySlotData } from '@/hooks/useLotterySlotData'
import { Ticket } from '../../types/ticket'
import { fetchTickets, submitTicket } from '../../utils/ticketUtils'
import TicketForm from './home/TicketForm'
import TicketTable from './home/TicketTable'
import TicketGrid from './home/TicketGrid'
import Footer from './common/Footer'
import AdmaxAds from './common/AdmaxAds'
import Modal from '@/app/components/common/Modal'

/**
 * ホームページコンポーネント
 */
interface HomePageProps {
  supabaseUrl: string;
  supabaseKey: string;
}

export default function HomePage({
  supabaseUrl,
  supabaseKey
}: HomePageProps) {
  // 状態管理
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<number | null>(null)
  const [selectedLotterySlot, setSelectedLotterySlot] = useState<number | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showTickets, setShowTickets] = useState<boolean>(false)
  const [showGridHelp, setShowGridHelp] = useState<boolean>(false)

  const searchParams = useSearchParams()

  // データを取得
  const { artists, isLoading: isLoadingArtists, error: artistsError } = useArtistData(supabaseUrl, supabaseKey)
  const { tours, isLoading: isLoadingTours, error: toursError } = useTourData(supabaseUrl, supabaseKey, selectedArtist)
  const { lotterySlots, isLoading: isLoadingLotterySlots, error: lotterySlotsError } = useLotterySlotData(supabaseUrl, supabaseKey, selectedArtist)

  // 選択中のアーティストとツアーの名前を取得
  const selectedArtistName = selectedArtist
    ? artists.find(a => a.id === selectedArtist)?.name
    : ''
  const selectedTourName = selectedTour
    ? tours.find(t => t.id === selectedTour)?.name
    : ''

  /**
   * Xにポストする文字列を生成する関数
   */
  const generatePostText = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const currentUrl = `${baseUrl}/?artist=${selectedArtist}&tour=${selectedTour}`
    return `${selectedArtistName}\n『${selectedTourName}』\nのチケット情報を集計しています。\n${currentUrl}`
  }

  /**
   * Xにポストする関数
   */
  const postToX = () => {
    const text = generatePostText()
    const encodedText = encodeURIComponent(text)
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}&hashtags=座席予想`, '_blank')
  }

  /**
   * フォームをリセットする関数
   */
  const handleReset = () => {
    setSelectedArtist(null)
    setSelectedTour(null)
    setSelectedLotterySlot(null)
    setTickets([])
    setShowTickets(false)
  }

  /**
   * チケット一覧を表示する関数
   */
  const handleShowTickets = async () => {
    if (selectedArtist && selectedTour) {
      const newTickets = await fetchTickets(selectedArtist, selectedTour)
      setTickets(newTickets)
      setShowTickets(true)
    }
  }

  /**
   * チケットを登録する関数
   */
  const handleSubmitTicket = async (block: string, blockNumber: number, column: number, seatNumber: number, lotterySlotId: number) => {
    if (!selectedArtist || !selectedTour) return

    const result = await submitTicket(
      selectedArtist,
      selectedTour,
      lotterySlotId,
      block,
      blockNumber,
      column,
      seatNumber
    )

    if (result.success) {
      alert('チケットを登録しました')
      // チケット登録後に一覧を更新
      const updatedTickets = await fetchTickets(selectedArtist, selectedTour)
      setTickets(updatedTickets)
      setShowTickets(true)
    } else {
      alert(result.error || 'チケットの登録に失敗しました')
    }
  }

  // URLパラメータから初期値を設定
  useEffect(() => {
    const artistId = searchParams.get('artist')
    const tourId = searchParams.get('tour')

    if (artistId) {
      const parsedArtistId = parseInt(artistId)
      const artist = artists.find(a => a.id === parsedArtistId)

      if (artist) {
        setSelectedArtist(artist.id)

        if (tourId) {
          const parsedTourId = parseInt(tourId)
          const tour = tours.find(t => t.id === parsedTourId)

          if (tour) {
            setSelectedTour(tour.id)
          }
        }
      }
    }
  }, [searchParams, artists, tours])

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8 lg:width-[100%]">
      <h1 className="text-2xl text-rose-500 font-bold text-center">座席予想掲示板</h1>
      <p className="text-xs text-rose-300 text-center mb-8">みんなのチケット情報を集計して座席構成を予想しよう</p>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <h2 className="text-xl text-gray-600 font-bold mb-2">チケット情報入力</h2>
          {/* ローディング状態の表示 */}
          {(isLoadingArtists || isLoadingTours || isLoadingLotterySlots) && (
            <span className="inline-block animate-spin rounded-full h-[1em] w-[1em] border-4 border-rose-500 border-t-transparent -mt-2" />
          )}
        </div>

        {/* エラー状態の表示 */}
        {(artistsError || toursError || lotterySlotsError) && (
          <div className="text-center text-red-600 text-xs mb-4">
            データの取得に失敗しました。ページを再更新してください。
          </div>
        )}

        <TicketForm
          artists={artists}
          tours={tours}
          lotterySlots={lotterySlots}
          selectedArtist={selectedArtist}
          selectedTour={selectedTour}
          selectedLotterySlot={selectedLotterySlot}
          onArtistChange={setSelectedArtist}
          onTourChange={setSelectedTour}
          onLotterySlotChange={setSelectedLotterySlot}
          onSubmit={handleSubmitTicket}
          onReset={handleReset}
          onShowTickets={handleShowTickets}
        />
      </section>

      <section className="mt-12">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl text-gray-600 font-bold">チケット一覧 <span className='text-sm'><span className='text-rose-500'>{tickets.length}</span>件</span></h2>
          {selectedArtist && selectedTour && (
            <button
              onClick={postToX}
              className="bg-gray-900 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              でシェア
            </button>
          )}
        </div>

        <TicketTable
          tickets={tickets}
          showTickets={showTickets}
        />

        {showTickets && tickets.length > 0 && (
          <>
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl text-gray-600 font-bold">座席分布</h2>
                <button
                  onClick={() => setShowGridHelp(true)}
                  className="text-sm text-rose-500 hover:text-rose-700"
                >
                  分布について
                </button>
              </div>
              <p className='text-xs text-gray-400 mb-4'>
                登録済みチケットから算出した分布
              </p>
              <TicketGrid tickets={tickets} />
            </div>

            {/* モーダル要素 */}
            <Modal
              isOpen={showGridHelp}
              onClose={() => setShowGridHelp(false)}
              title="分布について"
            >
              <div className="space-y-4">
                <p>
                  同じアルファベットのブロックを横一列に並べています。
                </p>
                <p>
                  各ブロックの横と幅は、ブロック内のチケットの最大位置に合わせて自動調整しています。
                </p>
                <p>
                  チケットが無いブロックも、無いことがわかるように5x5で配置しています。
                </p>
                <p>
                  ブロック全体は横方向中央に寄せて表示しています。
                </p>
              </div>
            </Modal>
          </>
        )}

        {/* 広告の表示 */}
        <div className="mt-4 text-center">
          <AdmaxAds code="6320491eb1d6b1456841a6bf9a04cb19"/>
        </div>
      </section>
      <Footer />
    </main>
  )
}