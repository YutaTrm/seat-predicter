'use client'

import { createSupabaseClient } from '@/lib/supabase/client'

/**
 * ユーザーのチケット情報の型定義
 */
export interface UserTicket {
  id: number
  artist_id: number
  artist_name: string
  tour_id: number
  tour_name: string
  lottery_slots_id: number
  lottery_slots_name: string
  block: string
  block_number: number
  column: number
  number: number
  day: number | null
  created_at: string
}

/**
 * ユーザーが投稿したチケット一覧を取得する関数
 */
export const fetchUserTickets = async (userId: string): Promise<UserTicket[]> => {
  const supabase = createSupabaseClient()

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      artists (
        name
      ),
      tours (
        name
      ),
      lottery_slots (
        name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('ユーザーチケット取得エラー:', error)
    return []
  }

  return tickets.map(ticket => ({
    id: ticket.id,
    artist_id: ticket.artist_id,
    artist_name: ticket.artists?.name || '',
    tour_id: ticket.tour_id,
    tour_name: ticket.tours?.name || '',
    lottery_slots_id: ticket.lottery_slots_id,
    lottery_slots_name: ticket.lottery_slots?.name || '',
    block: ticket.block,
    block_number: ticket.block_number,
    column: ticket.column,
    number: ticket.number,
    day: ticket.day,
    created_at: ticket.created_at
  }))
}

/**
 * チケットを削除する関数
 * 所有者チェックを含む
 */
export const deleteUserTicket = async (
  ticketId: number,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createSupabaseClient()

  // まず、チケットが存在し、ユーザーが所有者であることを確認
  const { data: ticket, error: fetchError } = await supabase
    .from('tickets')
    .select('user_id')
    .eq('id', ticketId)
    .single()

  if (fetchError || !ticket) {
    console.error('チケット取得エラー:', fetchError)
    return { success: false, error: 'チケットが見つかりません' }
  }

  // 所有者チェック
  if (ticket.user_id !== userId) {
    return { success: false, error: '削除権限がありません' }
  }

  // チケットを削除
  const { error: deleteError } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId)

  if (deleteError) {
    console.error('チケット削除エラー:', deleteError)
    return { success: false, error: 'チケットの削除に失敗しました' }
  }

  return { success: true }
}
