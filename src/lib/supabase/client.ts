import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// シングルトンインスタンスを保持する変数
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * クライアントサイドのSupabaseクライアントを作成（シングルトンパターン）
 */
export const createSupabaseClient = (url?: string, key?: string) => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // サーバーサイドから渡された値を使用
  const supabaseUrl = url
  const supabaseAnonKey = key

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials are required')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}