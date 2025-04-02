'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Artist, Tour, Ticket, HomePageProps } from '../../types/ticket'
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
  fetchTours
}: HomePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [artists] = useState<Artist[]>(initialArtists)
  const [tours, setTours] = useState<Tour[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<number | null>(null)
  const [showTickets, setShowTickets] = useState<boolean>(false)

  /**
   * フォームをリセットする関数
   */
  const handleReset = () => {
    setSelectedArtist(null)
    setSelectedTour(null)
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
  const handleSubmitTicket = async (block: string, column: number, seatNumber: number) => {
    if (!selectedArtist || !selectedTour) return

    const result = await submitTicket(
      selectedArtist,
      selectedTour,
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

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="container mx-auto h-screen relative">
        <h1 className="text-2xl text-gray-800 font-bold text-center mb-4">ライブ座席予想(β版)</h1>

        <TicketForm
          artists={artists}
          tours={tours}
          selectedArtist={selectedArtist}
          selectedTour={selectedTour}
          onArtistChange={setSelectedArtist}
          onTourChange={setSelectedTour}
          onSubmit={handleSubmitTicket}
          onReset={handleReset}
          onShowTickets={handleShowTickets}
        />

        <section className="mt-8">
          <h2 className="text-xl text-gray-600 font-bold mb-2">ツアーチケット一覧</h2>
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