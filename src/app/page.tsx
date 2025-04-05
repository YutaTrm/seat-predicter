import HomePage from './components/HomePage'
import { fetchArtists, getSupabaseCredentials } from '@/lib/supabase/server'
import { Suspense } from 'react'

// ダイナミックレンダリングを強制
export const dynamic = 'force-dynamic'

export default async function Page() {
  const artists = await fetchArtists()
  const { url: supabaseUrl, key: supabaseKey } = getSupabaseCredentials()

  if (!artists || artists.length === 0) {
    console.error('アーティスト情報の取得に失敗しました')
    return <div>アーティスト情報の読み込みに失敗しました</div>
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase認証情報の取得に失敗しました')
    return <div>認証情報の読み込みに失敗しました</div>
  }

  // JSON-LDの定義
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '座席予想掲示板(β)',
    description: '座席予想掲示板(β)は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。',
    url: 'https://zasekiyosou.com'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen px-4 py-8">
          <div className="container mx-auto">
            <h1 className="text-2xl text-rose-500 font-bold text-center mb-4">読み込み中...</h1>
          </div>
        </div>
      }>
        <HomePage
          artists={artists}
          supabaseUrl={supabaseUrl}
          supabaseKey={supabaseKey}
        />
      </Suspense>
    </>
  )
}
