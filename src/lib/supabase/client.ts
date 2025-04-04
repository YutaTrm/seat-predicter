import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// シングルトンインスタンスを保持する変数
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * クライアントサイドのSupabaseクライアントを作成（シングルトンパターン）
 */
export const createSupabaseClient = () => {
  console.log('★SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing environment variables for Supabase client')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}