'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import type { Session } from '@supabase/supabase-js'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * ユーザーメニューコンポーネント
 * ログイン状態を表示し、ログイン/ログアウトボタンを提供
 */
export default function UserMenu() {
  const { t } = useLanguage()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // 初期セッションを取得
    const loadSession = async () => {
      try {
        const currentSession = await getSession()
        if (mounted) {
          setSession(currentSession)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading session:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadSession()

    // 開発モードの場合は認証状態の監視をスキップ（本番環境では実行される）
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      return () => {
        mounted = false
      }
    }

    // 認証状態の変更を監視（本番環境の既存コード）
    const setupAuthListener = async () => {
      const { getSupabaseClient } = await import('@/lib/supabase/auth')
      const supabase = getSupabaseClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
          setSession(session)
          setIsLoading(false)

          // サインインイベントの場合、少し待ってから再度セッションを取得
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              router.refresh()
              loadSession()
            }, 100)
          }
        }
      })
      return subscription
    }

    const subscriptionPromise = setupAuthListener()

    // ページが表示されたときにセッションを再取得（ブラウザバック対応）
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      subscriptionPromise.then(subscription => subscription.unsubscribe())
    }
  }, [router])

  const handleMyPageClick = () => {
    router.push('/mypage')
  }

  const handleTwitterSignIn = async () => {
    try {
      const { signInWithTwitter } = await import('@/lib/supabase/auth')
      await signInWithTwitter('/')
    } catch (error) {
      console.error('Twitter sign in error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <button
        onClick={handleTwitterSignIn}
        className="bg-gray-900 hover:bg-gray-700 text-white px-2 py-[2px] rounded text-sm transition-colors flex items-center"
        title={`X${t('userMenu.loginWithX')}`}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {t('userMenu.loginWithX')}
      </button>
    )
  }

  // ユーザー情報を取得
  const user = session.user
  const userMetadata = user.user_metadata

  // Xからの情報を取得（複数の可能性を確認）
  const displayName =
    userMetadata?.name ||
    userMetadata?.full_name ||
    userMetadata?.user_name ||
    userMetadata?.preferred_username ||
    user.email?.split('@')[0] ||
    t('userMenu.user')

  // Xのプロフィール画像を取得（複数のフィールドを確認）
  const avatarUrl =
    userMetadata?.avatar_url ||
    userMetadata?.picture ||
    userMetadata?.profile_image_url ||
    userMetadata?.picture_url

  return (
    <button
      onClick={handleMyPageClick}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      title={t('userMenu.myPage')}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            // 画像の読み込みに失敗した場合はXアイコンを表示
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white ${avatarUrl ? 'hidden' : ''}`}
      >
        {/* Xアイコン */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
        {displayName}
      </span>
    </button>
  )
}
