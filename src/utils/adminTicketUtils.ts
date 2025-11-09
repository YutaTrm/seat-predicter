'use client'

import { createSupabaseClient } from '@/lib/supabase/client'

/**
 * チケット情報（投稿者情報付き）の型定義
 */
export interface AdminTicket {
  ticket_id: number
  artist_id: number
  tour_id: number
  lottery_slots_id: number
  block: string
  block_number: number
  column: number
  number: number
  day: number | null
  ticket_created_at: string
  ticket_updated_at: string
  user_id: string | null
  user_email: string | null
  user_name: string | null
  user_full_name: string | null
  user_avatar_url: string | null
  user_created_at: string | null
  // 追加フィールド（JOINで取得）
  artist_name?: string
  tour_name?: string
  lottery_slots_name?: string
}

/**
 * 全チケット一覧を投稿者情報付きで取得する関数
 */
export const fetchAllTicketsWithUsers = async (): Promise<AdminTicket[]> => {
  const supabase = createSupabaseClient()

  // PostgreSQL関数を使用してチケットとユーザー情報を取得
  const { data: tickets, error: ticketsError } = await supabase
    .rpc('get_all_tickets_with_users')

  if (ticketsError) {
    console.error('チケット取得エラー:', ticketsError)
    console.error('エラー詳細:', JSON.stringify(ticketsError, null, 2))
    return []
  }

  if (!tickets) {
    return []
  }

  // アーティスト、ツアー、抽選枠の名前を取得
  const artistIds = [...new Set(tickets.map((t: any) => t.artist_id))]
  const tourIds = [...new Set(tickets.map((t: any) => t.tour_id))]
  const lotterySlotIds = [...new Set(tickets.map((t: any) => t.lottery_slots_id))]

  // 並列で名前を取得
  const [artistsData, toursData, lotterySlotsData] = await Promise.all([
    supabase.from('artists').select('id, name').in('id', artistIds),
    supabase.from('tours').select('id, name').in('id', tourIds),
    supabase.from('lottery_slots').select('id, name').in('id', lotterySlotIds)
  ])

  const artistsMap = new Map(artistsData.data?.map((a: any) => [a.id, a.name]) || [])
  const toursMap = new Map(toursData.data?.map((t: any) => [t.id, t.name]) || [])
  const lotterySlotsMap = new Map(lotterySlotsData.data?.map((l: any) => [l.id, l.name]) || [])

  // 名前を追加
  return tickets.map((ticket: any) => ({
    ...ticket,
    artist_name: artistsMap.get(ticket.artist_id) || '',
    tour_name: toursMap.get(ticket.tour_id) || '',
    lottery_slots_name: lotterySlotsMap.get(ticket.lottery_slots_id) || ''
  }))
}

/**
 * 全てのアーティストとツアーを取得する関数
 */
export const fetchAllArtistsAndTours = async (): Promise<{
  artists: Array<{ id: number; name: string }>
  tours: Array<{ id: number; name: string; artist_id: number }>
}> => {
  const supabase = createSupabaseClient()

  const [artistsData, toursData] = await Promise.all([
    supabase.from('artists').select('id, name').order('id', { ascending: true }),
    supabase.from('tours').select('id, name, artist_id').order('id', { ascending: true })
  ])

  return {
    artists: artistsData.data || [],
    tours: toursData.data || []
  }
}

/**
 * チケットを削除する関数（管理者のみ）
 */
export const deleteTicket = async (ticketId: number): Promise<{ success: boolean; error?: string }> => {
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId)

  if (error) {
    console.error('チケット削除エラー:', error)
    return { success: false, error: 'チケットの削除に失敗しました' }
  }

  return { success: true }
}
