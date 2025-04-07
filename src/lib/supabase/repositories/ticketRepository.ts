import { Database } from '../../../types/database.types'
import { createServerSupabaseClient, handleError } from '../utils'
import { requireAuth } from '../auth'

// チケット一覧を取得
export async function fetchTickets(artistId: number, tourId: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
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
    .order('column')
    .order('number')

  if (error) {
    console.error('チケット取得エラー:', error)
    return []
  }

  return data
}

// チケットを作成
export async function createTicket(ticket: Database['public']['Tables']['tickets']['Insert']) {
  return requireAuth(async () => {
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
  })
}