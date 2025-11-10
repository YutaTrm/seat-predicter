import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

// グローバル変数でクレデンシャルを保持
let _supabaseUrl: string | undefined
let _supabaseKey: string | undefined

/**
 * Supabaseクレデンシャルを設定（サーバーコンポーネントから呼ばれる）
 */
export function setSupabaseCredentials(url: string, key: string) {
  _supabaseUrl = url
  _supabaseKey = key
}

/**
 * クライアントサイドのSupabaseクライアントを作成
 */
export const createSupabaseClient = () => {
  const supabaseUrl = _supabaseUrl
  const supabaseKey = _supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not set. Call setSupabaseCredentials first.')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}