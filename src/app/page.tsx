import HomePage from './components/HomePage'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient(cookieStore)
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
