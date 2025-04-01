'use client'

import { useState } from 'react'
import type { Database } from '@/types/database.types'

type Artist = Database['public']['Tables']['artists']['Row']
type Tour = Database['public']['Tables']['tours']['Row']
type Ticket = Database['public']['Tables']['tickets']['Row']

type AdminPageProps = {
  initialArtists: Artist[]
  initialTours: Tour[]
  initialTickets: Ticket[]
  handleAddArtist: (formData: FormData) => Promise<{ artist: Artist }>
  handleEditArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleAddTour: (formData: FormData) => Promise<{ tour: Tour }>
  handleEditTour: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteTour: (formData: FormData) => Promise<{ success: boolean }>
}

export default function AdminPage({
  initialArtists,
  initialTours,
  initialTickets,
  handleAddArtist,
  handleEditArtist,
  handleDeleteArtist,
  handleAddTour,
  handleEditTour,
  handleDeleteTour
}: AdminPageProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [tours, setTours] = useState<Tour[]>(initialTours)
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [artistName, setArtistName] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState('')
  const [tourName, setTourName] = useState('')
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [selectedTourId, setSelectedTourId] = useState('')

  // アーティスト選択時のハンドラー
  const handleArtistSelect = (artistId: string) => {
    setSelectedArtistId(artistId)
    setSelectedTourId('') // アーティストが変更されたらツアー選択をリセット
  }

  // アーティスト追加フォームのサブミット
  const handleArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artistName.trim()) return

    const formData = new FormData()
    formData.append('name', artistName)

    try {
      const { artist } = await handleAddArtist(formData)
      setArtists([...artists, artist])
      setArtistName('')
      alert('アーティストを追加しました')
    } catch (error) {
      alert('アーティストの追加に失敗しました')
    }
  }

  // アーティスト編集の実行
  const submitArtistEdit = async (id: number, newName: string) => {
    const formData = new FormData()
    formData.append('id', id.toString())
    formData.append('name', newName)

    try {
      await handleEditArtist(formData)
      setArtists(artists.map(artist =>
        artist.id === id ? { ...artist, name: newName } : artist
      ))
      setEditingArtist(null)
      alert('アーティストを編集しました')
    } catch (error) {
      alert('アーティストの編集に失敗しました')
    }
  }

  // アーティスト削除の実行
  const submitArtistDelete = async (id: number) => {
    if (!confirm('このアーティストを削除してもよろしいですか？')) return

    const formData = new FormData()
    formData.append('id', id.toString())

    try {
      await handleDeleteArtist(formData)
      setArtists(artists.filter(artist => artist.id !== id))
      if (selectedArtistId === id.toString()) {
        setSelectedArtistId('')
        setSelectedTourId('')
      }
      alert('アーティストを削除しました')
    } catch (error) {
      alert('アーティストの削除に失敗しました')
    }
  }

  // ツアー追加フォームのサブミット
  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArtistId || !tourName.trim()) return

    const formData = new FormData()
    formData.append('artistId', selectedArtistId)
    formData.append('name', tourName)

    try {
      const { tour } = await handleAddTour(formData)
      setTours([...tours, tour])
      setTourName('')
      alert('ツアーを追加しました')
    } catch (error) {
      alert('ツアーの追加に失敗しました')
    }
  }

  // ツアー編集の実行
  const submitTourEdit = async (id: number, newName: string) => {
    const formData = new FormData()
    formData.append('id', id.toString())
    formData.append('name', newName)

    try {
      await handleEditTour(formData)
      setTours(tours.map(tour =>
        tour.id === id ? { ...tour, name: newName } : tour
      ))
      setEditingTour(null)
      alert('ツアーを編集しました')
    } catch (error) {
      alert('ツアーの編集に失敗しました')
    }
  }

  // ツアー削除の実行
  const submitTourDelete = async (id: number) => {
    if (!confirm('このツアーを削除してもよろしいですか？')) return

    const formData = new FormData()
    formData.append('id', id.toString())

    try {
      await handleDeleteTour(formData)
      setTours(tours.filter(tour => tour.id !== id))
      if (selectedTourId === id.toString()) {
        setSelectedTourId('')
      }
      alert('ツアーを削除しました')
    } catch (error) {
      alert('ツアーの削除に失敗しました')
    }
  }

  // 選択されたアーティストのツアーをフィルタリング
  const filteredTours = selectedArtistId
    ? tours.filter(tour => tour.artist_id === Number(selectedArtistId))
    : []

  // 選択されたツアーのチケットをフィルタリング
  const filteredTickets = selectedTourId
    ? tickets.filter(ticket => ticket.tour_id === Number(selectedTourId))
    : []

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">管理画面</h1>

        <div className="flex gap-4 text-sm">
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-2/6">
            <h2 className="text-xl font-semibold mb-4">アーティスト追加</h2>
            <form onSubmit={handleArtistSubmit} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="アーティスト名"
                  className="flex-grow p-2 border rounded-l"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-r"
                >
                  追加
                </button>
              </div>
            </form>
            <hr/>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                アーティスト一覧 <span className="text-gray-500 text-sm">({artists.length}件)</span>
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">アーティスト名</th>
                    <th className="border p-2 text-center w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map(artist => (
                    <tr key={artist.id} className="border-b">
                      <td className="border p-2">
                        {editingArtist?.id === artist.id ? (
                          <input
                            type="text"
                            value={editingArtist.name}
                            onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          artist.name
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {editingArtist?.id === artist.id ? (
                          <>
                            <button
                              onClick={() => submitArtistEdit(artist.id, editingArtist.name)}
                              className="text-green-500 hover:text-green-700 mr-2"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingArtist(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              キャンセル
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingArtist(artist)}
                              className="text-blue-500 hover:text-blue-700 mr-2"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => submitArtistDelete(artist.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              削除
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-2/6">
            <h2 className="text-xl font-semibold mb-4">ツアー追加</h2>
            <form onSubmit={handleTourSubmit} className="mb-4">
              <select
                value={selectedArtistId}
                onChange={(e) => handleArtistSelect(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">アーティストを選択</option>
                {artists.map(artist => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
              <div className="flex">
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="ツアー名"
                  className="flex-grow p-2 border rounded-l"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-r"
                >
                  追加
                </button>
              </div>
            </form>
            <hr/>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                {selectedArtistId ? (
                  <>
                    {artists.find(a => a.id === Number(selectedArtistId))?.name}のツアー一覧{' '}
                    <span className="text-gray-500 text-sm">({filteredTours.length}件)</span>
                  </>
                ) : (
                  'ツアー一覧'
                )}
              </h3>
              {selectedArtistId ? (
                filteredTours.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-left">ツアー名</th>
                        <th className="border p-2 text-center w-24">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTours.map(tour => (
                        <tr key={tour.id} className="border-b">
                          <td className="border p-2">
                            {editingTour?.id === tour.id ? (
                              <input
                                type="text"
                                value={editingTour.name}
                                onChange={(e) => setEditingTour({ ...editingTour, name: e.target.value })}
                                className="w-full p-1 border rounded"
                              />
                            ) : (
                              tour.name
                            )}
                          </td>
                          <td className="border p-2 text-center">
                            {editingTour?.id === tour.id ? (
                              <>
                                <button
                                  onClick={() => submitTourEdit(tour.id, editingTour.name)}
                                  className="text-green-500 hover:text-green-700 mr-2"
                                >
                                  保存
                                </button>
                                <button
                                  onClick={() => setEditingTour(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  キャンセル
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingTour(tour)}
                                  className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                  編集
                                </button>
                                <button
                                  onClick={() => submitTourDelete(tour.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  削除
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">このアーティストのツアーはありません</p>
                )
              ) : (
                <p className="text-gray-500">アーティストを選択してください</p>
              )}
            </div>
          </div>

          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-2/6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedTourId ? (
                <>
                  {tours.find(t => t.id === Number(selectedTourId))?.name}のチケット一覧{' '}
                  <span className="text-gray-500 text-sm">({filteredTickets.length}件)</span>
                </>
              ) : (
                'チケット一覧'
              )}
            </h2>
            {selectedArtistId ? (
              <>
                <select
                  value={selectedTourId}
                  onChange={(e) => setSelectedTourId(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="">ツアーを選択</option>
                  {filteredTours.map(tour => (
                    <option key={tour.id} value={tour.id}>
                      {tour.name}
                    </option>
                  ))}
                </select>

                {selectedTourId ? (
                  filteredTickets.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border p-2 text-left">ブロック</th>
                          <th className="border p-2 text-center">列</th>
                          <th className="border p-2 text-center">番号</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map(ticket => (
                          <tr key={ticket.id} className="border-b">
                            <td className="border p-2">{ticket.block}</td>
                            <td className="border p-2 text-center">{ticket.column}</td>
                            <td className="border p-2 text-center">{ticket.number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">このツアーのチケットはありません</p>
                  )
                ) : (
                  <p className="text-gray-500">ツアーを選択してください</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">アーティストを選択してください</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}