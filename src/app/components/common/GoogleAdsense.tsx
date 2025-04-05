import Script from 'next/script'

/**
 * Google AdSenseスクリプトを管理するコンポーネント
 * 本番環境でのみ広告を表示する
 */
export const GoogleAdsense = () => {
  // 本番環境でない場合は何も表示しない
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
      />
    </>
  )
}