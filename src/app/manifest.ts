import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '座席予想掲示板',
    short_name: '座席予想',
    description: '座席予想掲示板は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff1f2',
    theme_color: '#fff1f2',
    icons: [
      {
        src: '/images/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'images/icon.png',
        sizes: '320x320',
        type: 'image/png',
      },
    ],
  }
}