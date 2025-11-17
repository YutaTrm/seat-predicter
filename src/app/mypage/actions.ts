'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

/**
 * ユーザーアカウントを削除するServer Action
 * チケットは自動的に削除されます
 */
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    // 現在のユーザーセッションを取得
    const cookieStore = await cookies()
    const cookieString = cookieStore.toString()

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        },
        global: {
          headers: {
            Cookie: cookieString
          }
        }
      }
    )

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

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
