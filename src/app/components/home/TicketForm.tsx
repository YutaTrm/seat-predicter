'use client'

import { useState, useMemo, useCallback } from 'react'
import { Artist, Tour, LotterySlot } from '../../../types/ticket'
import { SubmitResult } from '../../../types/ticket'
import { updateUrlParams } from '../../../utils/ticketUtils'
import { useRouter } from 'next/navigation'

/**
 * 制限に使う定数
 */
const MAX_BLOCK_NUMBER = 20
const MAX_COLUMN_NUMBER = 30
const MAX_SEAT_NUMBER = 20

/**
 * チケット発券可能かどうかを判定する関数
 * @param printStartDate 発券開始日（nullの場合は発券不可）
 */
const isTourPrintable = (printStartDate: string | null): boolean => {
  if (!printStartDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(printStartDate)
  startDate.setHours(0, 0, 0, 0)
  return today >= startDate
}

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
  onSubmit: (block: string, blockNumber: number, column: number, seatNumber: number, lotterySlotId: number) => Promise<SubmitResult>
  onReset: () => void
  onShowTickets: () => void
  isLoggedIn: boolean
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
  onShowTickets,
  isLoggedIn
}: TicketFormProps) {
  const router = useRouter()
  const [block, setBlock] = useState<string>('')
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [column, setColumn] = useState<number | null>(null)
  const [seatNumber, setSeatNumber] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 選択されたツアーの情報を取得（メモ化）
  const selectedTourInfo = useMemo(() => {
    if (!selectedTour) return null
    return tours.find(tour => tour.id === selectedTour)
  }, [selectedTour, tours])

  // 印刷可能かどうかを判定（メモ化）
  const isPrintable = useMemo(() => {
    if (!selectedTourInfo) return false
    return isTourPrintable(selectedTourInfo.print_start_date)
  }, [selectedTourInfo])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!block || !blockNumber || !column || !seatNumber || !selectedLotterySlot) {
        setError('すべての情報を入力してください')
        return
      }

      const confirmed = confirm(`【${block}${blockNumber}ブロック ${column}列 ${seatNumber}番】を登録します。お間違いありませんか？`)
      if (confirmed) {
        const result = await onSubmit(block, blockNumber, column, seatNumber, selectedLotterySlot)
        if (result.success) {
          // 連続いたずら登録防止
          // setBlock('')
          // setBlockNumber(null)
          // setColumn(null)
          setSeatNumber(null)
        } else if (result.error) {
          setError(result.error)
        }
      }
    },
    [block, blockNumber, column, seatNumber, selectedLotterySlot, onSubmit, setError, setBlock, setBlockNumber, setColumn, setSeatNumber]
  )

  const handleReset = useCallback(
    async () => {
      await Promise.all([
        new Promise<void>(resolve => {
          setBlock('')
          setBlockNumber(null)
          setColumn(null)
          setSeatNumber(null)
          onReset()
          resolve()
        }),
        router.replace("/")
      ])
    },
    [router, setBlock, setBlockNumber, setColumn, setSeatNumber, onReset]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <select
        value={selectedArtist || ''}
        onChange={(e) => {
          const value = Number(e.target.value)
          onArtistChange(value || null)
          updateUrlParams(router, value || null, null)
        }}
        className="w-full p-1 border rounded bg-white"
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
        className="w-full p-1 border rounded bg-white"
      >
        <option value="">ツアーを選択</option>
        {tours.map(tour => (
          <option key={tour.id} value={tour.id}>
            {tour.name}
          </option>
        ))}
      </select>

      <select
        value={selectedLotterySlot || ''}
        onChange={(e) => {
          const value = Number(e.target.value)
          onLotterySlotChange(value || null)
        }}
        disabled={!selectedArtist}
        className="w-full p-1 border rounded  bg-white"
      >
        <option value="">抽選枠</option>
        {lotterySlots.map(slot => (
          <option key={slot.id} value={slot.id}>
            {slot.name}
          </option>
        ))}
      </select>

      <div className="flex gap-1">
        <select
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          className="p-1 border rounded bg-white text-right w-2/6"
        >
          <option value="">ブロック</option>
          {Array.from({ length: 12 }, (_, i) => { //全アルファベットじゃなくて Lまで
            const char = String.fromCharCode(65 + i);
            return <option key={char} value={char}>{char}</option>;
          }).flat()}
          <option key="P" value="P">P</option>
          <option key="AL" value="AL">AL</option>
          <option key="AR" value="AR">AR</option>
        </select>

        <input
          type="number"
          value={blockNumber || ''}
          onChange={(e) => {
            const value = Math.floor(Number(e.target.value));
            setBlockNumber(value >= 0 && value <= MAX_BLOCK_NUMBER ? value : null);
          }}
          placeholder="ブロック番号"
          className="p-1 px-2 border rounded bg-white text-right w-2/6"
          step="1"
          min="0"
          max="20"
        />

        <input
          type="number"
          value={column || ''}
          onChange={(e) => {
            const value = Math.floor(Number(e.target.value));
            setColumn(value >= 0 && value <= MAX_COLUMN_NUMBER ? value : null);
          }}
          placeholder="列"
          className="p-1 px-2 border rounded bg-white text-right w-1/6"
          step="1"
          min="0"
          max="30"
        />

        <input
          type="number"
          value={seatNumber || ''}
          onChange={(e) => {
            const value = Math.floor(Number(e.target.value));
            setSeatNumber(value >= 0 && value <= MAX_SEAT_NUMBER ? value : null);
          }}
          placeholder="席"
          className="p-1 px-2 border rounded bg-white text-right w-1/6"
          step="1"
          min="0"
          max="20"
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
          onClick={onShowTickets}
          disabled={!selectedTour || !isPrintable}
          className={`w-1/3 p-2 text-white rounded ${
            selectedTour && isPrintable
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          一覧
        </button>

        <button
          type="submit"
          disabled={!isPrintable || !isLoggedIn}
          className={`w-1/3 p-2 text-white rounded ${
            isPrintable && isLoggedIn
              ? 'bg-rose-500 hover:bg-rose-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          登録
        </button>
      </div>

      {(!isLoggedIn && selectedTour && isPrintable &&
        <p className='text-xs text-rose-500 text-right'>
          ログインするとチケットを登録できます
        </p>
      )}

      {(!isPrintable && selectedTour &&
        <p className='text-xs text-rose-500 text-right'>
          チケット発券日から押せるようになります
        </p>
      )}

      {error && (
        <p className='text-xs text-rose-500 text-right mt-2'>
          {error}
        </p>
      )}
    </form>
  )
}