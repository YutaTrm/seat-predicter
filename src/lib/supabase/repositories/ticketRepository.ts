import { Database } from '../../../types/database.types'
import { createServerSupabaseClient, handleError } from '../utils'

// チケット一覧を取得
export async function fetchTickets(artistId: number, tourId: number) {
  const supabase = await createServerSupabaseClient()
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      lottery_slots (
        name
      )
    `)
    .eq('artist_id', artistId)
    .eq('tour_id', tourId)
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

// チケットを作成
export async function createTicket(ticket: Database['public']['Tables']['tickets']['Insert']) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('tickets')
      .insert(ticket)

    if (error) {
      handleError(error, 'チケットの登録に失敗しました')
    }

    return true
  } catch (error) {
    handleError(error, 'チケットの登録に失敗しました')
  }
}