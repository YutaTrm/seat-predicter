'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Artist, Tour, Ticket, LotterySlot, AdminPageProps } from '../../types/admin'
import { fetchArtistTours } from '../../utils/tourUtils'
import { ARTIST_XSHARE_WORDS } from '@/constants/artist'
import ArtistSection from './admin/ArtistSection'
import TourSection from './admin/TourSection'
import TicketSection from './admin/TicketSection'
import LotterySlotSection from './admin/LotterySlotSection'
import AdminHeader from './admin/AdminHeader'

/**
 * 管理画面コンポーネント
 */
export default function AdminPage({
  initialArtists,
  initialTours,
  initialTickets,
  initialLotterySlots,
  handleAddArtist,
  handleEditArtist,
  handleDeleteArtist,
  handleAddTour,
  handleEditTour,
  handleDeleteTour,
  handleFetchTours,
  handleAddLotterySlot,
  handleEditLotterySlot,
  handleDeleteLotterySlot,
  handleFetchLotterySlots,
  handleFetchTickets
}: AdminPageProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [tours, setTours] = useState<Tour[]>(initialTours)
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [lotterySlots, setLotterySlots] = useState<LotterySlot[]>(initialLotterySlots)
  const [selectedArtistId, setSelectedArtistId] = useState('')
  const [selectedTourId, setSelectedTourId] = useState('')

  /**
   * アーティスト選択時のハンドラー
   */
  const handleArtistSelect = async (artistId: string) => {
    setSelectedArtistId(artistId)
    setSelectedTourId('') // アーティストが変更されたらツアー選択をリセット

    if (artistId) {
      try {
        const newTours = await fetchArtistTours(artistId, handleFetchTours)
        setTours(newTours)

        const formData = new FormData()
        formData.append('artist_id', artistId)
        const { lotterySlots: newLotterySlots } = await handleFetchLotterySlots(formData)
        setLotterySlots(newLotterySlots)
      } catch (err) {
        console.error('データ取得エラー:', err)
        alert('データの取得に失敗しました')
        setTours([])
        setLotterySlots([])
      }
    } else {
      setTours([])
      setLotterySlots([])
    }
  }

  /**
   * アーティスト追加時のハンドラー
   */
  const handleArtistAdd = (artist: Artist) => {
    setArtists([...artists, artist])
  }

  /**
   * アーティスト編集時のハンドラー
   */
  const handleArtistEdit = (id: number, newName: string) => {
    setArtists(artists.map(artist =>
      artist.id === id ? { ...artist, name: newName } : artist
    ))
  }

  /**
   * アーティスト削除時のハンドラー
   */
  const handleArtistDelete = (id: number) => {
    setArtists(artists.filter(artist => artist.id !== id))
    if (selectedArtistId === id.toString()) {
      setSelectedArtistId('')
      setSelectedTourId('')
    }
  }

  /**
   * ツアー追加時のハンドラー
   */
  const handleTourAdd = (tour: Tour) => {
    setTours([...tours, tour])
  }

  /**
   * ツアー編集時のハンドラー
   */
  const handleTourEdit = (id: number, newName: string) => {
    setTours(tours.map(tour =>
      tour.id === id ? { ...tour, name: newName } : tour
    ))
  }

  /**
   * ツアー削除時のハンドラー
   */
  const handleTourDelete = (id: number) => {
    setTours(tours.filter(tour => tour.id !== id))
    if (selectedTourId === id.toString()) {
      setSelectedTourId('')
    }
  }

  /**
   * 抽選枠追加時のハンドラー
   */
  const handleLotterySlotAdd = (lotterySlot: LotterySlot) => {
    setLotterySlots([...lotterySlots, lotterySlot])
  }

  /**
   * 抽選枠編集時のハンドラー
   */
  const handleLotterySlotEdit = (id: number, newName: string) => {
    setLotterySlots(lotterySlots.map(slot =>
      slot.id === id ? { ...slot, name: newName } : slot
    ))
  }

  /**
   * 抽選枠削除時のハンドラー
   */
  const handleLotterySlotDelete = (id: number) => {
    setLotterySlots(lotterySlots.filter(slot => slot.id !== id))
  }

  const router = useRouter()

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      <AdminHeader />
      <div className="">
        {selectedArtistId && selectedTourId && (
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={() => {
                const url = `https://zasekiyosou.com/?artist=${selectedArtistId}&tour=${selectedTourId}`

                // アーティスト名、ツアー名、シェアワードを取得
                const artist = artists.find(a => a.id === parseInt(selectedArtistId))
                const tour = tours.find(t => t.id === parseInt(selectedTourId))
                const shareWords = ARTIST_XSHARE_WORDS[parseInt(selectedArtistId) - 7] || [] // セブチのアーティストIDが7だから

                // シェアテキストを生成
                const text = `${artist?.name} ${tour?.name} ${shareWords.join(' ')}\n${url}`

                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
              }}
              className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              でシェア
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 text-sm lg:flex-row lg:gap-4">
          <ArtistSection
            artists={artists}
            onArtistAdd={handleArtistAdd}
            onArtistEdit={handleArtistEdit}
            onArtistDelete={handleArtistDelete}
            handleAddArtist={handleAddArtist}
            handleEditArtist={handleEditArtist}
            handleDeleteArtist={handleDeleteArtist}
          />

          <TourSection
            artists={artists}
            tours={tours}
            selectedArtistId={selectedArtistId}
            onArtistSelect={handleArtistSelect}
            onTourAdd={handleTourAdd}
            onTourEdit={handleTourEdit}
            onTourDelete={handleTourDelete}
            handleAddTour={handleAddTour}
            handleEditTour={handleEditTour}
            handleDeleteTour={handleDeleteTour}
          />

          <LotterySlotSection
            artists={artists}
            lotterySlots={lotterySlots}
            selectedArtistId={selectedArtistId}
            onArtistSelect={handleArtistSelect}
            onLotterySlotAdd={handleLotterySlotAdd}
            onLotterySlotEdit={handleLotterySlotEdit}
            onLotterySlotDelete={handleLotterySlotDelete}
            handleAddLotterySlot={handleAddLotterySlot}
            handleEditLotterySlot={handleEditLotterySlot}
            handleDeleteLotterySlot={handleDeleteLotterySlot}
          />

          <TicketSection
            artists={artists}
            tours={tours}
            tickets={tickets}
            selectedArtistId={selectedArtistId}
            selectedTourId={selectedTourId}
            onTourSelect={async (tourId: string) => {
              setSelectedTourId(tourId)
              if (tourId && selectedArtistId) {
                try {
                  const formData = new FormData()
                  formData.append('artist_id', selectedArtistId)
                  formData.append('tour_id', tourId)
                  const { tickets: newTickets } = await handleFetchTickets(formData)
                  setTickets(newTickets)
                } catch (err) {
                  console.error('チケット取得エラー:', err)
                  alert('チケットの取得に失敗しました')
                  setTickets([])
                }
              } else {
                setTickets([])
              }
            }}
          />
        </div>
      </div>
    </main>
  )
}