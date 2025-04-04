import HomePage from './components/HomePage'
import { fetchArtists } from '@/lib/supabase/server'
import { Suspense } from 'react'

// ダイナミックレンダリングを強制
export const dynamic = 'force-dynamic'

export default async function Page() {
  const artists = await fetchArtists()

  if (!artists || artists.length === 0) {
    console.error('アーティスト情報の取得に失敗しました')
    return <div>アーティスト情報の読み込みに失敗しました</div>
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto">
          <h1 className="text-2xl text-gray-800 font-bold text-center mb-4">読み込み中...</h1>
        </div>
      </div>
    }>
      <HomePage artists={artists} />
    </Suspense>
  )
}
