'use client'

import Link from "next/link";
import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

type Ticket = {
  id: number
  artist_id: number
  tour_id: number
  block: string
  column: number
  number: number
  created_at: string
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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [artists, setArtists] = useState<Artist[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<number | null>(null)
  const [block, setBlock] = useState<string>('')
  const [column, setColumn] = useState<number | null>(null)
  const [seatNumber, setSeatNumber] = useState<number | null>(null)
  const [showTickets, setShowTickets] = useState<boolean>(false)

  // URLパラメータを更新する関数
  const updateUrlParams = (artistId: number | null, tourId: number | null) => {
    const params = new URLSearchParams()
    if (artistId) params.set('artist', artistId.toString())
    if (tourId) params.set('tour', tourId.toString())
    router.push(`?${params.toString()}`)
  }

  // フォームをリセットする関数
  const handleReset = () => {
    setSelectedArtist(null)
    setSelectedTour(null)
    setBlock('')
    setColumn(null)
    setSeatNumber(null)
    setTickets([])
    setShowTickets(false)
    updateUrlParams(null, null)
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

  // アーティスト一覧を取得
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

  // URLパラメータから初期値を設定
  useEffect(() => {
    async function initializeFromUrl() {
      const artistId = searchParams.get('artist')
      const tourId = searchParams.get('tour')

      if (artistId) {
        const supabase = createSupabaseClient()
        const { data: artistData } = await supabase
          .from('artists')
          .select('*')
          .eq('id', parseInt(artistId))
          .single()

        if (artistData) {
          setSelectedArtist(artistData.id)

          if (tourId) {
            const { data: tourData } = await supabase
              .from('tours')
              .select('*')
              .eq('id', parseInt(tourId))
              .eq('artist_id', artistData.id)
              .single()

            if (tourData) {
              setSelectedTour(tourData.id)
            }
          }
        }
      }
    }
    initializeFromUrl()
  }, [searchParams])

  // 選択されたアーティストに基づいてツアーを取得
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
      } else {
        setTours([])
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
      setShowTickets(true)
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="container mx-auto h-screen relative">
        <h1 className="text-2xl text-gray-800 font-bold text-center mb-4">ライブ座席予想(β版)</h1>

        {/* チケット情報入力 */}
        <section>
          <h2 className="text-xl text-gray-600 font-bold mb-2">チケット情報入力</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedArtist || ''}
              onChange={(e) => {
                const value = Number(e.target.value)
                setSelectedArtist(value || null)
                setSelectedTour(null)
                updateUrlParams(value || null, null)
              }}
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
              onChange={(e) => {
                const value = Number(e.target.value)
                setSelectedTour(value || null)
                updateUrlParams(selectedArtist, value || null)
              }}
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
                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(b => (
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
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                一覧
              </button>

              <button
                type="submit"
                className="w-1/3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </section>

        {/* チケット一覧結果 */}
        <section className="mt-8">
        <h2 className="text-xl text-gray-600 font-bold mb-2">ツアーチケット一覧</h2>
          {!showTickets ? (
            <p className="text-sm text-center bg-yellow-50 text-yellow-600 rounded-lg p-2">「一覧」を押すかチケット登録をすると一覧が表示されます</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-center bg-yellow-50 text-yellow-600 rounded-lg p-2">登録されているチケットはありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border text-sm mb-3">
                <thead>
                  <tr className="bg-gray-600 text-gray-100">
                    <th className="px-3 py-1 border-b text-center font-semibold">ブロック</th>
                    <th className="px-3 py-1 border-b text-center font-semibold">列</th>
                    <th className="px-3 py-1 border-b text-center font-semibold">席番号</th>
                    <th className="px-3 py-1 border-b text-center font-semibold">投稿日時</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => {
                    // ブロックごとに背景色を変える（A-Zの26色）
                    const blockIndex = ticket.block.charCodeAt(0) - 65
                    // 黄金角（137.5度）を使用して、隣接するブロックの色が離れるようにする
                    const hue = (blockIndex * 137.5) % 360
                    const backgroundColor = `hsl(${hue}, 80%, 80%)`//（色相・彩度・輝度）
                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-gray-50"
                        style={{ backgroundColor }}
                      >
                        <td className="px-3 py-1 border-b text-right">{ticket.block}</td>
                        <td className="px-3 py-1 border-b text-right">{ticket.column}</td>
                        <td className="px-3 py-1 border-b text-right">{ticket.number}</td>
                        <td className="px-3 py-1 border-b text-right">
                          {new Date(ticket.created_at).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* ブロックごとのレコード数を表示 */}
              <h3 className="text-gray-600 font-bold mb-2">ブロックごとの集計数</h3>
              <table className="mb-4">
                <tbody>
                  {Object.entries(
                    tickets.reduce((acc, ticket) => {
                      acc[ticket.block] = (acc[ticket.block] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([block, count]) => (
                    <tr key={block} className="text-sm p-2 rounded">
                      <td className="font-bold">{block}ブロック:{count}件</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-sm text-gray-700 w-full mt-8">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center space-x-6">
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              アプリについて
            </Link>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header" className="text-gray-700 hover:text-gray-900 transition-colors" target="_blank">
              問い合わせ
            </a>
          </div>
        </footer>
      </section>
    </main>
  )
}
