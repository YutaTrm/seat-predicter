'use client'

import { useState, useMemo, useCallback } from 'react'
import { Artist, Tour, LotterySlot } from '../../../types/ticket'
import { SubmitResult } from '../../../types/ticket'
import { updateUrlParams } from '../../../utils/ticketUtils'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * 制限に使う定数
 */
const MAX_BLOCK_NUMBER = 20
const MAX_COLUMN_NUMBER = 30
const MAX_SEAT_NUMBER = 20
const MAX_DAY = 4

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
  onSubmit: (block: string, blockNumber: number, column: number, seatNumber: number, day: number, lotterySlotId: number) => Promise<SubmitResult>
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
  const { t } = useLanguage()
  const router = useRouter()
  const [block, setBlock] = useState<string>('')
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [column, setColumn] = useState<number | null>(null)
  const [seatNumber, setSeatNumber] = useState<number | null>(null)
  const [day, setDay] = useState<number | null>(null)
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

      if (!block || !blockNumber || !column || !seatNumber || !day || !selectedLotterySlot) {
        setError(t('form.fillAllFields'))
        return
      }

      const confirmMessage = t('form.confirmRegister')
        .replace('{day}', String(day))
        .replace('{block}', block)
        .replace('{blockNumber}', String(blockNumber))
        .replace('{column}', String(column))
        .replace('{seatNumber}', String(seatNumber))

      const confirmed = confirm(confirmMessage)
      if (confirmed) {
        const result = await onSubmit(block, blockNumber, column, seatNumber, day, selectedLotterySlot)
        if (result.success) {
          // 連続いたずら登録防止
          // setBlock('')
          // setBlockNumber(null)
          // setColumn(null)
          setSeatNumber(null)
          setDay(null)
        } else if (result.error) {
          setError(result.error)
        }
      }
    },
    [block, blockNumber, column, seatNumber, day, selectedLotterySlot, onSubmit, setError, setBlock, setBlockNumber, setColumn, setSeatNumber, setDay, t]
  )

  const handleReset = useCallback(
    async () => {
      await Promise.all([
        new Promise<void>(resolve => {
          setBlock('')
          setBlockNumber(null)
          setColumn(null)
          setSeatNumber(null)
          setDay(null)
          onReset()
          resolve()
        }),
        router.replace("/")
      ])
    },
    [router, setBlock, setBlockNumber, setColumn, setSeatNumber, setDay, onReset]
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
        <option value="">{t('form.selectArtist')}</option>
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
        <option value="">{t('form.selectTour')}</option>
        {tours.map(tour => (
          <option key={tour.id} value={tour.id}>
            {tour.name}
          </option>
        ))}
      </select>

      <div className="flex gap-1">
        <select
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          className="p-1 border rounded bg-white text-right w-2/6"
        >
          <option value="">{t('form.block')}</option>
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
          placeholder={t('form.blockNumber')}
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
          placeholder={t('form.row')}
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
          placeholder={t('form.seat')}
          className="p-1 px-2 border rounded bg-white text-right w-1/6"
          step="1"
          min="0"
          max="20"
        />
      </div>

      <div className="flex gap-1">
        <select
          value={selectedLotterySlot || ''}
          onChange={(e) => {
            const value = Number(e.target.value)
            onLotterySlotChange(value || null)
          }}
          disabled={!selectedArtist}
          className="w-full p-1 border rounded  bg-white"
        >
          <option value="">{t('form.lotterySlot')}</option>
          {lotterySlots.map(slot => (
            <option key={slot.id} value={slot.id}>
              {slot.name}
            </option>
          ))}
        </select>

        <select
          value={day || ''}
          onChange={(e) => {
            const value = Number(e.target.value)
            setDay(value || null)
          }}
          disabled={!selectedTour}
          className="w-full p-1 border rounded bg-white"
        >
          <option value="">{t('form.showDate')}</option>
          {Array.from({ length: MAX_DAY }, (_, i) => i + 1).map(dayNum => (
            <option key={dayNum} value={dayNum}>
              day{dayNum}
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
          {t('form.reset')}
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
          {t('form.list')}
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
          {t('form.register')}
        </button>
      </div>

      {(!isLoggedIn && selectedTour && isPrintable &&
        <p className='text-xs text-rose-500 text-right'>
          {t('form.loginToRegister')}
        </p>
      )}

      {(!isPrintable && selectedTour &&
        <p className='text-xs text-rose-500 text-right'>
          {t('form.availableAfterPrint')}
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