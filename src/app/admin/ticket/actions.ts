'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'

/**
 * チケットを削除する（管理者のみ）
 */
export async function deleteTicketAction(ticketId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)

    if (error) {
      console.error('チケット削除エラー:', error)
      return { success: false, error: 'チケットの削除に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('削除処理エラー:', error)
    return { success: false, error: 'チケットの削除に失敗しました' }
  }
}
