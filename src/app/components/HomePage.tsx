'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Artist, Tour, Ticket, LotterySlot, HomePageProps } from '../../types/ticket'
import { fetchTickets, submitTicket } from '../../utils/ticketUtils'
import TicketForm from './home/TicketForm'
import TicketTable from './home/TicketTable'
import Footer from './common/Footer'

/**
 * ホームページコンポーネント
 */
export default function HomePage({
  artists: initialArtists,
  handleTicketSubmit,
  fetchTourTickets,
  fetchTours,
  fetchLotterySlots
}: HomePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [artists] = useState<Artist[]>(initialArtists)
  const [tours, setTours] = useState<Tour[]>([])
  const [lotterySlots, setLotterySlots] = useState<LotterySlot[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<number | null>(null)
  const [selectedLotterySlot, setSelectedLotterySlot] = useState<number | null>(null)
  const [showTickets, setShowTickets] = useState<boolean>(false)

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
    return `${selectedArtistName}\n『${selectedTourName}』\nの座席予想をしています。\n${currentUrl}`
  }

  /**
   * Xにポストする関数
   */
  const postToX = () => {
    const text = generatePostText()
    const encodedText = encodeURIComponent(text)
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank')
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
      const newTickets = await fetchTickets(selectedArtist, selectedTour, fetchTourTickets)
      setTickets(newTickets)
      setShowTickets(true)
    }
  }

  /**
   * チケットを登録する関数
   */
  const handleSubmitTicket = async (block: string, column: number, seatNumber: number, lotterySlotId: number) => {
    if (!selectedArtist || !selectedTour) return

    const result = await submitTicket(
      selectedArtist,
      selectedTour,
      lotterySlotId,
      block,
      column,
      seatNumber,
      handleTicketSubmit
    )

    if (result.success) {
      alert('チケットを登録しました')
      // チケット登録後に一覧を更新
      const updatedTickets = await fetchTickets(selectedArtist, selectedTour, fetchTourTickets)
      setTickets(updatedTickets)
      setShowTickets(true)
    } else {
      alert(result.error || 'チケットの登録に失敗しました')
    }
  }

  // URLパラメータから初期値を設定
  useEffect(() => {
    async function initializeFromUrl() {
      const artistId = searchParams.get('artist')
      const tourId = searchParams.get('tour')

      if (artistId) {
        const parsedArtistId = parseInt(artistId)
        const artist = artists.find(a => a.id === parsedArtistId)

        if (artist) {
          setSelectedArtist(artist.id)

          if (tourId) {
            const formData = new FormData()
            formData.append('artist_id', artist.id.toString())
            const { tours: artistTours } = await fetchTours(formData)

            const parsedTourId = parseInt(tourId)
            const tour = artistTours.find(t => t.id === parsedTourId)

            if (tour) {
              setSelectedTour(tour.id)
              setTours(artistTours)
            }
          }
        }
      }
    }
    initializeFromUrl()
  }, [searchParams, artists, fetchTours])

  // 選択されたアーティストに基づいてツアーを取得
  useEffect(() => {
    async function loadTours() {
      if (selectedArtist) {
        const formData = new FormData()
        formData.append('artist_id', selectedArtist.toString())
        const { tours: newTours } = await fetchTours(formData)
        setTours(newTours)
      } else {
        setTours([])
      }
    }
    loadTours()
  }, [selectedArtist, fetchTours])

  // 選択されたアーティストに基づいて抽選枠を取得
  useEffect(() => {
    async function loadLotterySlots() {
      if (selectedArtist) {
        const formData = new FormData()
        formData.append('artist_id', selectedArtist.toString())
        const { lotterySlots: newLotterySlots } = await fetchLotterySlots(formData)
        setLotterySlots(newLotterySlots)
      } else {
        setLotterySlots([])
      }
    }
    loadLotterySlots()
  }, [selectedArtist, fetchLotterySlots])

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="container mx-auto h-screen relative">
        <h1 className="text-2xl text-gray-800 font-bold text-center mb-4">ライブ座席予想(β版)</h1>

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

        <section className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl text-gray-600 font-bold">ツアーチケット一覧</h2>
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
        </section>

        <Footer />
      </section>
    </main>
  )
}