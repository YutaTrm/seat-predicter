import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

/**
 * クライアントサイドのSupabaseクライアントを作成
 * 認証セッションのクッキーを自動的に読み取ります
 */
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}