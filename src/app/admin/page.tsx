'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const [artists, setArtists] = useState<string>('')
  const [selectedArtistId, setSelectedArtistId] = useState<string>('')
  const [tourName, setTourName] = useState<string>('')
  const [artistList, setArtistList] = useState<{ id: number; name: string }[]>([])
  const [tourList, setTourList] = useState<{ id: number; name: string; artist_id: number }[]>([])
  const [ticketList, setTicketList] = useState<{ id: number; artist_id: number; tour_id: number; block: string; column: number; number: number; }[]>([])
  const [editingArtist, setEditingArtist] = useState<{ id: number; name: string } | null>(null)
  const [editingTour, setEditingTour] = useState<{ id: number; name: string } | null>(null)
  const [selectedTourId, setSelectedTourId] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabaseClient()

      // アーティスト取得
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .order('name')

      if (artistError) {
        console.error('アーティスト取得エラー:', artistError)
      } else {
        setArtistList(artistData || [])
      }

      // ツアー取得
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .order('name')

      if (tourError) {
        console.error('ツアー取得エラー:', tourError)
      } else {
        setTourList(tourData || [])
      }

      // チケット取得
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')

      if (ticketError) {
        console.error('チケット取得エラー:', ticketError)
      } else {
        setTicketList(ticketData || [])
      }
    }
    fetchData()
  }, [])

  // アーティスト選択時のハンドラー
  const handleArtistSelect = (artistId: string) => {
    setSelectedArtistId(artistId)
    setSelectedTourId('') // アーティストが変更されたらツアー選択をリセット
  }

  // アーティスト追加ハンドラー
  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artists.trim()) return

    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('artists')
      .insert({ name: artists })
      .select()

    if (error) {
      console.error('アーティスト追加エラー:', error)
      alert('アーティストの追加に失敗しました')
    } else {
      setArtistList([...artistList, data[0]])
      setArtists('')
      alert('アーティストを追加しました')
    }
  }

  // アーティスト編集ハンドラー
  const handleEditArtist = async (id: number, newName: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .update({ name: newName })
      .eq('id', id)

    if (error) {
      console.error('アーティスト編集エラー:', error)
      alert('アーティストの編集に失敗しました')
    } else {
      setArtistList(artistList.map(artist =>
        artist.id === id ? { ...artist, name: newName } : artist
      ))
      setEditingArtist(null)
      alert('アーティストを編集しました')
    }
  }

  // アーティスト削除ハンドラー
  const handleDeleteArtist = async (id: number) => {
    if (!confirm('このアーティストを削除してもよろしいですか？')) return

    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('アーティスト削除エラー:', error)
      alert('アーティストの削除に失敗しました')
    } else {
      setArtistList(artistList.filter(artist => artist.id !== id))
      if (selectedArtistId === id.toString()) {
        setSelectedArtistId('')
        setSelectedTourId('')
      }
      alert('アーティストを削除しました')
    }
  }

  // ツアー追加ハンドラー
  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArtistId || !tourName.trim()) return

    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({
        artist_id: Number(selectedArtistId),
        name: tourName
      })
      .select()

    if (error) {
      console.error('ツアー追加エラー:', error)
      alert('ツアーの追加に失敗しました')
    } else {
      setTourList([...tourList, data[0]])
      setTourName('')
      alert('ツアーを追加しました')
    }
  }

  // ツアー編集ハンドラー
  const handleEditTour = async (id: number, newName: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .update({ name: newName })
      .eq('id', id)

    if (error) {
      console.error('ツアー編集エラー:', error)
      alert('ツアーの編集に失敗しました')
    } else {
      setTourList(tourList.map(tour =>
        tour.id === id ? { ...tour, name: newName } : tour
      ))
      setEditingTour(null)
      alert('ツアーを編集しました')
    }
  }

  // ツアー削除ハンドラー
  const handleDeleteTour = async (id: number) => {
    if (!confirm('このツアーを削除してもよろしいですか？')) return

    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('ツアー削除エラー:', error)
      alert('ツアーの削除に失敗しました')
    } else {
      setTourList(tourList.filter(tour => tour.id !== id))
      if (selectedTourId === id.toString()) {
        setSelectedTourId('')
      }
      alert('ツアーを削除しました')
    }
  }

  // 選択されたアーティストのツアーをフィルタリング
  const filteredTours = selectedArtistId
    ? tourList.filter(tour => tour.artist_id === Number(selectedArtistId))
    : []

  // 選択されたツアーのチケットをフィルタリング
  const filteredTickets = selectedTourId
    ? ticketList.filter(ticket => ticket.tour_id === Number(selectedTourId))
    : []

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">管理画面</h1>

        <div className="flex gap-4 text-sm">
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-2/6">
            <h2 className="text-xl font-semibold mb-4">アーティスト追加</h2>
            <form onSubmit={handleAddArtist} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={artists}
                  onChange={(e) => setArtists(e.target.value)}
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

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">アーティスト一覧</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">アーティスト名</th>
                    <th className="border p-2 text-center w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {artistList.map(artist => (
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
                              onClick={() => handleEditArtist(artist.id, editingArtist.name)}
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
                              onClick={() => handleDeleteArtist(artist.id)}
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

          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-3/6">
            <h2 className="text-xl font-semibold mb-4">ツアー追加</h2>
            <form onSubmit={handleAddTour} className="mb-4">
              <select
                value={selectedArtistId}
                onChange={(e) => handleArtistSelect(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">アーティストを選択</option>
                {artistList.map(artist => (
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

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">ツアー一覧</h3>
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
                                  onClick={() => handleEditTour(tour.id, editingTour.name)}
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
                                  onClick={() => handleDeleteTour(tour.id)}
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

          <div className="mb-6 bg-white p-6 rounded-lg shadow-md w-1/6">
            <h2 className="text-xl font-semibold mb-4">チケット一覧</h2>
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