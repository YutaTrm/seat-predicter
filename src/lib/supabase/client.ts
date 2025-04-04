import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import getConfig from 'next/config'

// シングルトンインスタンスを保持する変数
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * クライアントサイドのSupabaseクライアントを作成（シングルトンパターン）
 */
export const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const { publicRuntimeConfig } = getConfig() || {}

  // 環境変数の取得を試みる
  const supabaseUrl = publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Runtime Config URL:', supabaseUrl);
  console.log('Runtime Config KEY:', supabaseAnonKey);

  // 値が存在することを確認
  if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') {
    throw new Error('Missing environment variables for Supabase client')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}