'use client'

import Script from 'next/script'

interface AdmaxAdsProps {
  code: string;
}

/**
 * Admax広告を表示するコンポーネント
 */
export default function AdmaxAds({ code }: AdmaxAdsProps) {
  // 本番環境でない場合は何も表示しない
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  return (
    <>
      <div
        className="admax-ads"
        data-admax-id={code}
        style={{ display: 'inline-block' }}
      />
      <Script id="admax-init">
        {`
          (admaxads = window.admaxads || []).push({
            admax_id: ${code},
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