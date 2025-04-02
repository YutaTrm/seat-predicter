'use client'

import { useState } from 'react'
import { Artist, Tour, LotterySlot } from '../../../types/ticket'
import { updateUrlParams } from '../../../utils/ticketUtils'
import { useRouter } from 'next/navigation'

type TicketFormProps = {
  artists: Artist[]
  tours: Tour[]
  lotterySlots: LotterySlot[]
  selectedArtist: number | null
  selectedTour: number | null
  selectedLotterySlot: number | null
  onArtistChange: (artistId: number | null) => void
  onTourChange: (tourId: number | null) => void
  onLotterySlotChange: (lotterySlotId: number | null) => void
  onSubmit: (block: string, column: number, seatNumber: number, lotterySlotId: number) => void
  onReset: () => void
  onShowTickets: () => void
}

/**
 * チケット情報入力フォームコンポーネント
 */
export default function TicketForm({
  artists,
  tours,
  lotterySlots,
  selectedArtist,
  selectedTour,
  selectedLotterySlot,
  onArtistChange,
  onTourChange,
  onLotterySlotChange,
  onSubmit,
  onReset,
  onShowTickets
}: TicketFormProps) {
  const router = useRouter()
  const [block, setBlock] = useState<string>('')
  const [column, setColumn] = useState<number | null>(null)
  const [seatNumber, setSeatNumber] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!block || !column || !seatNumber || !selectedLotterySlot) {
      alert('すべての情報を入力してください')
      return
    }
    onSubmit(block, column, seatNumber, selectedLotterySlot)
  }

  const handleReset = () => {
    router.replace("/");
    setBlock('')
    setColumn(null)
    setSeatNumber(null)
    onReset()
  }

  return (
    <section>
      <h2 className="text-xl text-gray-600 font-bold mb-2">チケット情報入力</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <select
          value={selectedArtist || ''}
          onChange={(e) => {
            const value = Number(e.target.value)
            onArtistChange(value || null)
            updateUrlParams(router, value || null, null)
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
            onTourChange(value || null)
            updateUrlParams(router, selectedArtist, value || null)
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
            className="w-2/6 p-2 border rounded"
          >
            <option value="">ブロック</option>
            {Array.from({ length: 16 }, (_, i) => { //全アルファベットじゃなくて途中まで
              const char = String.fromCharCode(65 + i);
              if (char === 'P') {
                // P1からP20までのオプションを生成
                return Array.from({ length: 20 }, (_, j) => (
                  <option key={`P${j + 1}`} value={`P${j + 1}`}>P{j + 1}</option>
                ));
              }
              return <option key={char} value={char}>{char}</option>;
            }).flat()}
          </select>

          <input
            type="number"
            value={column || ''}
            onChange={(e) => setColumn(Number(e.target.value))}
            placeholder="列番"
            className="w-1/6 p-2 border rounded"
          />

          <input
            type="number"
            value={seatNumber || ''}
            onChange={(e) => setSeatNumber(Number(e.target.value))}
            placeholder="席番"
            className="w-1/6 p-2 border rounded"
          />

          <select
            value={selectedLotterySlot || ''}
            onChange={(e) => {
              const value = Number(e.target.value)
              onLotterySlotChange(value || null)
            }}
            disabled={!selectedArtist}
            className="w-2/6 p-2 border rounded"
          >
            <option value="">抽選枠</option>
            {lotterySlots.map(slot => (
              <option key={slot.id} value={slot.id}>
                {slot.name}
              </option>
            ))}
          </select>
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
            onClick={onShowTickets}
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
  )
}