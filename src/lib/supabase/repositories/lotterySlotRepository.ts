import { Database } from '../../../types/database.types'
import { createServerSupabaseClient, createAdminSupabaseClient, handleAdminError } from '../utils'
import { requireAdminAuth } from '../auth'

// 抽選枠一覧を取得
export async function fetchLotterySlots(artistId: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('lottery_slots')
    .select('*')
    .eq('artist_id', artistId)
    .order('id')

  if (error) {
    console.error('抽選枠取得エラー:', error)
    return []
  }

  return data
}

// 抽選枠を追加
export async function addLotterySlot(artistId: number, name: string) {
  return requireAdminAuth(async () => {
    try {
      const supabase = createAdminSupabaseClient()
      const { data, error } = await supabase
        .from('lottery_slots')
        .insert({
          artist_id: artistId,
          name
        } as Database['public']['Tables']['lottery_slots']['Insert'])
        .select()

      if (error || !data) {
        handleAdminError(error)
      }

      return data![0]
    } catch (error) {
      handleAdminError(error)
    }
  })
}

// 抽選枠を更新
export async function updateLotterySlot(id: number, name: string) {
  return requireAdminAuth(async () => {
    try {
      const supabase = createAdminSupabaseClient()
      const { error } = await supabase
        .from('lottery_slots')
        .update({ name } as Database['public']['Tables']['lottery_slots']['Update'])
        .eq('id', id)

      if (error) {
        handleAdminError(error)
      }

      return true
    } catch (error) {
      handleAdminError(error)
    }
  })
}

// 抽選枠を削除
export async function deleteLotterySlot(id: number) {
  return requireAdminAuth(async () => {
    try {
      const supabase = createAdminSupabaseClient()
      const { error } = await supabase
        .from('lottery_slots')
        .delete()
        .eq('id', id)

      if (error) {
        handleAdminError(error)
      }

      return true
    } catch (error) {
      handleAdminError(error)
    }
  })
}