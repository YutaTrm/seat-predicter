'use client'

import { createSupabaseClient } from '@/lib/supabase/client'

/**
 * ユーザー情報の型定義
 */
export interface AdminUser {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at: string | null
  raw_user_meta_data: {
    name?: string
    full_name?: string
    user_name?: string
    avatar_url?: string
    picture?: string
    profile_image_url?: string
  }
  ticket_count: number
}

/**
 * 全ユーザー一覧を取得する関数
 */
export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const supabase = createSupabaseClient()

  // PostgreSQL関数を使用してauth.usersテーブルから全ユーザーを取得
  const { data: authUsers, error: authError } = await supabase
    .rpc('get_all_users')

  if (authError) {
    console.error('ユーザー取得エラー:', authError)
    console.error('エラー詳細:', JSON.stringify(authError, null, 2))
    return []
  }

  if (!authUsers) {
    return []
  }

  // 各ユーザーのチケット数を取得
  const usersWithTicketCount = await Promise.all(
    authUsers.map(async (user: any) => {
      const { count, error: countError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (countError) {
        console.error(`チケット数取得エラー (${user.id}):`, countError)
      }

      return {
        id: user.id,
        email: user.email || null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at || null,
        raw_user_meta_data: user.raw_user_meta_data || {},
        ticket_count: count || 0
      }
    })
  )

  return usersWithTicketCount
}

/**
 * 特定ユーザーの詳細情報を取得する関数
 */
export const fetchUserDetail = async (userId: string) => {
  const supabase = createSupabaseClient()

  // PostgreSQL関数を使用してauth.usersテーブルから特定ユーザーを取得
  const { data: users, error: userError } = await supabase
    .rpc('get_user_by_id', { user_id: userId })

  if (userError || !users || users.length === 0) {
    console.error('ユーザー取得エラー:', userError)
    return null
  }

  const user = users[0]

  return {
    id: user.id,
    email: user.email || null,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at || null,
    raw_user_meta_data: user.raw_user_meta_data || {}
  }
}
