import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '座席予想掲示板',
    short_name: '座席予想',
    description: 'チケット情報を集計して可視化！みんなで座席構成を予想しよう',
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