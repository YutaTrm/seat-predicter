'use client'

import { useState } from 'react'
import { Artist, Tour, Ticket, AdminPageProps } from '../../types/admin'
import { fetchArtistTours } from '../../utils/tourUtils'
import ArtistSection from './admin/ArtistSection'
import TourSection from './admin/TourSection'
import TicketSection from './admin/TicketSection'

/**
 * 管理画面コンポーネント
 */
export default function AdminPage({
  initialArtists,
  initialTours,
  initialTickets,
  handleAddArtist,
  handleEditArtist,
  handleDeleteArtist,
  handleAddTour,
  handleEditTour,
  handleDeleteTour,
  handleFetchTours
}: AdminPageProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [tours, setTours] = useState<Tour[]>(initialTours)
  const [tickets] = useState<Ticket[]>(initialTickets)
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
      } catch (err) {
        console.error('ツアー取得エラー:', err)
        alert('ツアーの取得に失敗しました')
        setTours([])
      }
    } else {
      setTours([])
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">管理画面</h1>

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

          <TicketSection
            artists={artists}
            tours={tours}
            tickets={tickets}
            selectedArtistId={selectedArtistId}
            selectedTourId={selectedTourId}
            onTourSelect={setSelectedTourId}
          />
        </div>
      </div>
    </div>
  )
}