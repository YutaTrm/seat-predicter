'use client'

import { createSupabaseClient } from './client'

/**
 * クライアントサイドのSupabase認証ヘルパー関数
 */

// Supabaseクライアントを取得
export const getSupabaseClient = () => {
  return createSupabaseClient()
}

/**
 * Xアカウントでサインイン
 */
export const signInWithTwitter = async (redirectTo?: string) => {
  const supabase = getSupabaseClient()

  // 本番環境のURLを取得
  // localhost以外（本番環境）では常にhttps://zasekiyosou.comを使用
  // const isLocalhost = typeof window !== 'undefined' &&
  //   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  // const siteUrl = isLocalhost ? window.location.origin : 'https://zasekiyosou.com'
  const siteUrl = 'https://zasekiyosou.com'

  // リダイレクト先のURLを構築（コールバック後の最終的な遷移先）
  const finalRedirectUrl = redirectTo || siteUrl
  const callbackUrl = `${siteUrl}/auth/callback?redirect=${encodeURIComponent(finalRedirectUrl)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: callbackUrl,
      // X OAuth 2.0のスコープを明示的に指定
      scopes: 'tweet.read users.read offline.access',
      queryParams: {
        prompt: 'login',
      },
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
export const onAuthStateChange = (callback: (event: string, session: { access_token: string; refresh_token: string } | null) => void) => {
  const supabase = getSupabaseClient()
  return supabase.auth.onAuthStateChange(callback)
}
