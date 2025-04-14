'use client'

import Script from 'next/script'

/**
 * Admax広告を表示するコンポーネント
 */
export default function AdmaxAds() {
  // 本番環境でない場合は何も表示しない
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  return (
    <>
      <div
        className="admax-ads"
        data-admax-id="3e6bd2d29e9a3eacb2b94ce7200c3c3a"
        style={{ display: 'inline-block' }}
      />
      <Script id="admax-init">
        {`
          (admaxads = window.admaxads || []).push({
            admax_id: "3e6bd2d29e9a3eacb2b94ce7200c3c3a",
            type: "banner"
          });
        `}
      </Script>
      <Script
        src="https://adm.shinobi.jp/st/t.js"
        strategy="afterInteractive"
      />
    </>
  )
}