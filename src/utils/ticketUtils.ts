'use client'

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Ticket } from '../types/ticket'
import { createSupabaseClient } from '@/lib/supabase/client'

/**
 * URLパラメータを更新する関数
 */
export const updateUrlParams = (
  router: AppRouterInstance,
  artistId: number | null,
  tourId: number | null
) => {
  const params = new URLSearchParams()
  if (artistId) params.set('artist', artistId.toString())
  if (tourId) params.set('tour', tourId.toString())
  router.push(`?${params.toString()}`)
}

/**
 * チケット一覧を取得する関数
 */
export const fetchTickets = async (
  selectedArtist: number,
  selectedTour: number
): Promise<Ticket[]> => {
  const supabase = createSupabaseClient()

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      lottery_slots (
        name
      )
    `)
    .eq('artist_id', selectedArtist)
    .eq('tour_id', selectedTour)
    .order('block')
    .order('block_number')

  if (error) {
    console.error('チケット取得エラー:', error)
    return []
  }

  return tickets.map(ticket => ({
    ...ticket,
    lottery_slots_name: ticket.lottery_slots?.name || null
  }))
}

/**
 * チケットを登録する関数
 */
export const submitTicket = async (
  selectedArtist: number,
  selectedTour: number,
  selectedLotterySlot: number,
  block: string,
  blockNumber: number,
  column: number,
  seatNumber: number
) => {
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('tickets')
    .insert({
      artist_id: selectedArtist,
      tour_id: selectedTour,
      lottery_slots_id: selectedLotterySlot,
      block,
      block_number: blockNumber,
      column,
      number: seatNumber
    })

  if (error) {
    console.error('チケット登録エラー:', error)
    return { success: false, error: 'チケットの登録に失敗しました' }
  }

  return { success: true }
}