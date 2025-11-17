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
 * dayを区別せず、同じ座席（tour_id, block, block_number, column, number）なら1件として返す
 */
export const fetchTickets = async (
  selectedArtist: number,
  selectedTour: number
): Promise<{ tickets: Ticket[], totalCount: number }> => {
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
    .order('lottery_slots_id')
    .order('block')
    .order('block_number')

  if (error) {
    console.error('チケット取得エラー:', error)
    return { tickets: [], totalCount: 0 }
  }

  // 総チケット数を保存
  const totalCount = tickets.length

  // dayを区別せず、同じ座席を1件にまとめる
  // Supabaseのレスポンスには lottery_slots が含まれるため、型拡張
  type TicketWithLotterySlots = Ticket & { lottery_slots?: { name: string } | null }
  const seatMap = new Map<string, TicketWithLotterySlots>()

  tickets.forEach(ticket => {
    // tour_id, block, block_number, column, numberで一意のキーを作成
    const key = `${ticket.tour_id}-${ticket.block}-${ticket.block_number}-${ticket.column}-${ticket.number}`

    // 既に同じ座席が存在しない場合のみ追加
    if (!seatMap.has(key)) {
      seatMap.set(key, ticket as TicketWithLotterySlots)
    }
  })

  // Map から配列に変換
  const uniqueTickets = Array.from(seatMap.values())

  return {
    tickets: uniqueTickets.map(ticket => ({
      ...ticket,
      lottery_slots_name: ticket.lottery_slots?.name || undefined
    })),
    totalCount
  }
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
  seatNumber: number,
  day: number
) => {
  const supabase = createSupabaseClient()

  // 現在のユーザーを取得
  const { data: { user } } = await supabase.auth.getUser()

  // ログインチェック
  if (!user) {
    return {
      success: false,
      error: 'ログインが必要です'
    }
  }

  const ticketData = {
    artist_id: selectedArtist,
    tour_id: selectedTour,
    lottery_slots_id: selectedLotterySlot,
    block,
    block_number: blockNumber,
    column,
    number: seatNumber,
    day,
    user_id: user.id
  }

  const { error } = await supabase
    .from('tickets')
    .insert(ticketData)

  if (error) {
    return { success: false, error: 'チケットの登録に失敗しました' }
  }

  return { success: true }
}