import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import getConfig from 'next/config'

// シングルトンインスタンスを保持する変数
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * クライアントサイドのSupabaseクライアントを作成（シングルトンパターン）
 */
export const createSupabaseClient = () => {
  const { publicRuntimeConfig } = getConfig()

  // クライアントサイドでの環境変数の確認
  if (typeof window !== 'undefined') {
    console.log('★Client-side Config:', publicRuntimeConfig);
  }

  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = publicRuntimeConfig.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = publicRuntimeConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 初期化時の環境変数の確認
  console.log('★Initialization from Config URL:', supabaseUrl);
  console.log('★Initialization from Config KEY:', supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing environment variables for Supabase client')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}