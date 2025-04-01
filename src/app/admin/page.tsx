'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const [artists, setArtists] = useState<string>('')
  const [tours, setTours] = useState<{ artist: string; name: string }>({ artist: '', name: '' })
  const [artistList, setArtistList] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    async function fetchArtists() {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name')

      if (error) {
        console.error('アーティスト取得エラー:', error)
      } else {
        setArtistList(data || [])
      }
    }
    fetchArtists()
  }, [])

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

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tours.artist || !tours.name.trim()) return

    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({
        artist_id: Number(tours.artist),
        name: tours.name
      })
      .select()

    if (error) {
      console.error('ツアー追加エラー:', error)
      alert('ツアーの追加に失敗しました')
    } else {
      setTours({ artist: '', name: '' })
      alert('ツアーを追加しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">管理画面</h1>

        <div className="flex gap-4">
          <form onSubmit={handleAddArtist} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">アーティスト追加</h2>
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

          <form onSubmit={handleAddTour} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">ツアー追加</h2>
            <select
              value={tours.artist}
              onChange={(e) => setTours({...tours, artist: e.target.value})}
              className="w-full p-2 border rounded mb-2"
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
                value={tours.name}
                onChange={(e) => setTours({...tours, name: e.target.value})}
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

          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">チケット一覧</h2>
          </div>
          </div>
      </div>
    </div>
  )
}