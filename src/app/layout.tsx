import type { Metadata } from 'next'
import { M_PLUS_1p } from 'next/font/google'
import './globals.css'

const mplus = M_PLUS_1p({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: "座席予想掲示板(β)",
    template: "%s | 座席予想掲示板(β)"
  },
  description: "座席予想掲示板(β)は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。",
  appleWebApp: true,
  openGraph: {
    title: "座席予想掲示板(β)",
    description: "座席予想掲示板(β)は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリ",
    type: "website",
    url: "https://cast-finder.vercel.app",
    siteName: "座席予想掲示板(β)",
    images: [
      {
        url: "/images/icon.png", // OG画像のパスを適切に設定
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "座席予想掲示板(β)",
    description: "チケット番号を登録/一覧化し、ブロックの情報を可視化するアプリ",
    images: ["/images/icon.png"], // Twitter Card画像のパスを適切に設定
  },
  icons: {
    icon: "images/favicon.ico",
    apple: "images/icon.png",
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
  return (
    <html lang="ja">
      <body className={mplus.className}>
        {children}
      </body>
    </html>
  )
}
