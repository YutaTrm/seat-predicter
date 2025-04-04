'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Artist, Tour, Ticket, LotterySlot, AdminPageProps } from '../../types/admin'
import { fetchArtistTours } from '../../utils/tourUtils'
import ArtistSection from './admin/ArtistSection'
import TourSection from './admin/TourSection'
import TicketSection from './admin/TicketSection'
import LotterySlotSection from './admin/LotterySlotSection'

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
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">管理画面</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            ログアウト
          </button>
        </div>

        <div className="flex gap-4 text-sm">
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
    </div>
  )
}