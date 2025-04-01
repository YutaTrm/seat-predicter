import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "ライブ座席予想(β版)",
    template: "%s | ライブ座席予想(β版)"
  },
  description: "ライブ座席予想(β版)は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。",
  keywords: ["座席予想", "ライブ", "コンサート", "オタ活", "チケット情報", "チケット一覧","座席一覧","ブロック予想"],
  appleWebApp: true,
  openGraph: {
    title: "ライブ座席予想(β版)",
    description: "映ライブ座席予想(β版)は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリ",
    type: "website",
    url: "https://cast-finder.vercel.app",
    siteName: "ライブ座席予想(β版)",
    // images: [
    //   {
    //     url: "/images/og-image.png", // OG画像のパスを適切に設定
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
  },
  twitter: {
    // card: "summary_large_image",
    title: "ライブ座席予想(β版)",
    description: "チケット番号を登録/一覧化し、ブロックの情報を可視化するアプリ",
    // images: ["/images/twitter-image.png"], // Twitter Card画像のパスを適切に設定
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
