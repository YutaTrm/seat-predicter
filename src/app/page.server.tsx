import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import HomePage from './page'

export default async function Page() {
  const supabase = createServerSupabaseClient(cookies())
  const { data: artists, error } = await supabase
    .from('artists')
    .select('*')
    .order('name')

  if (error) {
    console.error('アーティスト取得エラー:', error)
    return <div>アーティスト情報の読み込みに失敗しました</div>
  }

  return <HomePage artists={artists || []} />
}