import HomePage from './components/HomePage'
import { Suspense } from 'react'

// ダイナミックレンダリングを強制
export const dynamic = 'force-dynamic'

export default async function Page() {
  // JSON-LDの定義
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '座席予想掲示板',
    description: '座席予想掲示板は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。',
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
        <HomePage />
      </Suspense>
    </>
  )
}
