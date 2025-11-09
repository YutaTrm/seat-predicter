'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

/**
 * クライアントサイドのSupabase認証ヘルパー関数
 */

// Supabaseクライアントを取得
export const getSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

/**
 * Xアカウントでサインイン
 */
export const signInWithTwitter = async (redirectTo?: string) => {
  const supabase = getSupabaseClient()

  // リダイレクト先のURLを構築（コールバック後の最終的な遷移先）
  const finalRedirectUrl = redirectTo || window.location.origin
  const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(finalRedirectUrl)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: callbackUrl,
      // X OAuth 2.0のスコープを明示的に指定
      scopes: 'tweet.read users.read offline.access'
    }
  })

  if (error) {
    console.error('Twitter sign in error:', error)
    throw error
  }

  return data
}

/**
 * メールアドレスとパスワードでサインイン
 */
export const signInWithPassword = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Password sign in error:', error)
    throw error
  }

  return data
}

/**
 * サインアウト
 */
export const signOut = async () => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * 現在のセッションを取得
 */
export const getSession = async () => {
  const supabase = getSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Get session error:', error)
    return null
  }

  return session
}

/**
 * 現在のユーザーを取得
 */
export const getUser = async () => {
  const supabase = getSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Get user error:', error)
    return null
  }

  return user
}

/**
 * 認証状態の変更を監視
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const supabase = getSupabaseClient()
  return supabase.auth.onAuthStateChange(callback)
}
