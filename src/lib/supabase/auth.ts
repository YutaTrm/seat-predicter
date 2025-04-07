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

// 認証を必要とする関数のラッパー
export async function requireAuth<T>(
  callback: () => Promise<T>
): Promise<T> {
  const session = await getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }
  return callback()
}

// 管理者権限を必要とする関数のラッパー
export async function requireAdminAuth<T>(
  callback: () => Promise<T>
): Promise<T> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('認証が必要です')
  }

  // 管理者権限チェック
  if (!user.user_metadata.role || user.user_metadata.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  return callback()
}