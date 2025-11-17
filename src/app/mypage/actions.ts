'use server'

import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

/**
 * ユーザーアカウントを削除するServer Action
 * チケットは自動的に削除されます
 */
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    // 現在のセッションを取得
    const session = await getSession()

    if (!session || !session.user) {
      return { success: false, error: 'ユーザーが見つかりません' }
    }

    // サービスロールクライアントでユーザーを削除
    const supabaseAdmin = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(session.user.id)

    if (deleteError) {
      console.error('ユーザー削除エラー:', deleteError)
      return { success: false, error: 'アカウントの削除に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('退会処理エラー:', error)
    return { success: false, error: '退会処理に失敗しました' }
  }
}
