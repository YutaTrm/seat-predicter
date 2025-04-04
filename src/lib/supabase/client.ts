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

  const supabaseUrl = publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Runtime Config URL:', publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Runtime Config KEY:', publicRuntimeConfig?.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('Process env URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Process env KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing environment variables for Supabase client')
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}