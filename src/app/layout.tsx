import type { Metadata } from 'next'
import { M_PLUS_1p } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import SupabaseProvider from './components/SupabaseProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const mplus = M_PLUS_1p({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: "座席予想掲示板",
    template: "%s | 座席予想掲示板"
  },
  description: "座席予想掲示板は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。",
  keywords: ["座席予想", "チケット", "コンサート", "ライブ", "座席", "ブロック", "可視化"],
  appleWebApp: true,
  metadataBase: new URL('https://zasekiyosou.com'),
  alternates: {
    canonical: '/',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "座席予想掲示板",
    description: "みんなのチケット情報を集計して座席構成を予想しよう",
    type: "website",
    url: "https://zasekiyosou.com/",
    siteName: "座席予想掲示板",
    locale: 'ja_JP',
    images: [
      {
        url: "/images/icon.png",
        width: 320,
        height: 320,
        alt: "座席予想掲示板のロゴ",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@seat_predicter",
    title: "座席予想掲示板",
    description: "みんなのチケット情報を集計して座席構成を予想しよう",
    images: ["/images/icon.png"],
  },
  icons: {
    icon: "/images/favicon.ico",
    apple: "/images/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // サーバーサイドで環境変数を取得（開発・本番両対応）
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return (
    <html lang="ja">
      <body className={mplus.className}>
        <SupabaseProvider supabaseUrl={supabaseUrl} supabaseKey={supabaseKey}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SupabaseProvider>
        {gaId && (
          <GoogleAnalytics gaId={gaId} />
        )}
      </body>
    </html>
  )
}
