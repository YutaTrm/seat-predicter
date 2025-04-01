'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

type Ticket = {
  id: number
  artist_id: number
  tour_id: number
  block: string
  column: number
  number: number
}

type Artist = {
  id: number
  name: string
}

type Tour = {
  id: number
  artist_id: number
  name: string
}

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<number | null>(null)
  const [block, setBlock] = useState<string>('')
  const [column, setColumn] = useState<number | null>(null)
  const [seatNumber, setSeatNumber] = useState<number | null>(null)
  const [showTickets, setShowTickets] = useState<boolean>(false)

  // フォームをリセットする関数
  const handleReset = () => {
    setSelectedArtist(null)
    setSelectedTour(null)
    setBlock('')
    setColumn(null)
    setSeatNumber(null)
    setTickets([])
    setShowTickets(false)
  }

  // チケット一覧を表示する関数
  const handleShowTickets = async () => {
    if (selectedArtist && selectedTour) {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('artist_id', selectedArtist)
        .eq('tour_id', selectedTour)
        .order('block')
        .order('column')
        .order('number')

      if (error) {
        console.error('チケット取得エラー:', error)
        setTickets([])
      } else {
        setTickets(data || [])
        setShowTickets(true)
      }
    }
  }

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
        setArtists(data || [])
      }
    }
    fetchArtists()
  }, [])

  useEffect(() => {
    async function fetchTours() {
      if (selectedArtist) {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .eq('artist_id', selectedArtist)
          .order('name')

        if (error) {
          console.error('ツアー取得エラー:', error)
          setTours([])
        } else {
          setTours(data || [])
        }
      }
    }
    fetchTours()
  }, [selectedArtist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArtist || !selectedTour || !block || !column || !seatNumber) {
      alert('すべての情報を入力してください')
      return
    }

    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        artist_id: selectedArtist,
        tour_id: selectedTour,
        block,
        column,
        number: seatNumber
      })

    if (error) {
      console.error('チケット登録エラー:', error)
      alert('チケットの登録に失敗しました')
    } else {
      alert('チケットを登録しました')
      // チケット登録後に一覧を更新
      const { data: updatedTickets } = await supabase
        .from('tickets')
        .select('*')
        .eq('artist_id', selectedArtist)
        .eq('tour_id', selectedTour)
        .order('block')
        .order('column')
        .order('number')

      setTickets(updatedTickets || [])
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="container mx-auto h-screen relative">
        <h1 className="text-2xl mb-4 text-center">
          <b className="leading-none">ライブ座席予想</b><br/>
          <small className="leading-none">seat-predicter</small>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedArtist || ''}
            onChange={(e) => setSelectedArtist(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">アーティストを選択</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTour || ''}
            onChange={(e) => setSelectedTour(Number(e.target.value))}
            disabled={!selectedArtist}
            className="w-full p-2 border rounded"
          >
            <option value="">ツアーを選択</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>
                {tour.name}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-1/3 p-2 border rounded"
            >
              <option value="">ブロック</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <input
              type="number"
              value={column || ''}
              onChange={(e) => setColumn(Number(e.target.value))}
              placeholder="列番号"
              className="w-1/3 p-2 border rounded"
            />

            <input
              type="number"
              value={seatNumber || ''}
              onChange={(e) => setSeatNumber(Number(e.target.value))}
              placeholder="席番号"
              className="w-1/3 p-2 border rounded"
            />
          </div>
          <div className="flex space-x-2 text-sm">
            <button
              type="button"
              onClick={handleReset}
              className="w-1/3 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              リセット
            </button>

            <button
              type="button"
              onClick={handleShowTickets}
              disabled={!selectedTour}
              className={`w-1/3 p-2 text-white rounded ${
                selectedTour
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              一覧を見る
            </button>

            <button
              type="submit"
              className="w-1/3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              チケットを登録
            </button>
          </div>
        </form>

        <div className="mt-8">
          {!showTickets ? (
            <p className="text-center text-red-600">ツアーを選択してください</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-600">登録されているチケットはありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 border-b text-left">ブロック</th>
                    <th className="px-6 py-3 border-b text-left">列</th>
                    <th className="px-6 py-3 border-b text-left">席番号</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b">{ticket.block}</td>
                      <td className="px-6 py-4 border-b">{ticket.column}</td>
                      <td className="px-6 py-4 border-b">{ticket.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


        <footer className="mt-8 text-center">
          <a href="/about" className="mr-4 text-blue-500">アプリについて</a>
          <a href="/request" className="text-blue-500">要望</a>
        </footer>
      </div>
    </main>
  )
}
