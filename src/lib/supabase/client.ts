import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// シングルトンインスタンスを保持する変数
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * クライアントサイドのSupabaseクライアントを作成（シングルトンパターン）
 */
export const createSupabaseClient = () => {
  console.log('★NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 初期化時の環境変数の確認
  console.log('★Initialization from Config URL:', supabaseUrl);
  console.log('★Initialization from Config KEY:', supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing environment variables for Supabase client')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}