import { createServerSupabaseClient } from './utils'

// 現在のセッションを取得
export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('セッション取得エラー:', error)
    return null
  }
  return session
}
