import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '../../types/database.types'

// Supabaseの認証情報を取得
export function getSupabaseCredentials() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}

// 通常のサーバーサイドのSupabaseクライアントを作成
export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  const cookieString = await Promise.resolve(cookieStore.toString())
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      },
      global: {
        headers: {
          Cookie: cookieString
        }
      }
    }
  )
}

// 管理者用のSupabaseクライアントを作成
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// エラーハンドリング用のユーティリティ
export function handleError(error: unknown, message: string = '操作に失敗しました') {
  console.error('Operation error:', error)
  throw new Error(message)
}

// 管理者操作用のエラーハンドリング
export function handleAdminError(error: unknown) {
  console.error('Admin operation error:', error)
  throw new Error('操作に失敗しました')
}