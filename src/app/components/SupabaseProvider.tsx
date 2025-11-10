'use client'

import { useState } from 'react'
import { setSupabaseCredentials } from '@/lib/supabase/client'

interface SupabaseProviderProps {
  supabaseUrl: string
  supabaseKey: string
  children: React.ReactNode
}

/**
 * Supabase認証情報をグローバルに設定するProvider
 */
export default function SupabaseProvider({ supabaseUrl, supabaseKey, children }: SupabaseProviderProps) {
  // useState初期値で同期的に実行
  const [isInitialized] = useState(() => {
    if (supabaseUrl && supabaseKey) {
      setSupabaseCredentials(supabaseUrl, supabaseKey)
      return true
    }
    return false
  })

  // 初期化が完了するまで何も表示しない
  if (!isInitialized) {
    return null
  }

  return <>{children}</>
}
