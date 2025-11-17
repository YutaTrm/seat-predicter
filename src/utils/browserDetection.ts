/**
 * アプリ内ブラウザ（WebView）を検出するユーティリティ
 */

/**
 * アプリ内ブラウザかどうかを判定
 */
export const isInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()

  // 各種アプリ内ブラウザを検出
  const inAppBrowserPatterns = [
    'twitter',      // Twitter/X
    'instagram',    // Instagram
    'line',         // LINE
    'fbav',         // Facebook App
    'fban',         // Facebook App
    'fb_iab',       // Facebook In-App Browser
  ]

  return inAppBrowserPatterns.some(pattern => userAgent.includes(pattern))
}

/**
 * どのアプリ内ブラウザかを取得（デバッグ用）
 */
export const getInAppBrowserName = (): string | null => {
  if (typeof window === 'undefined') return null

  const userAgent = window.navigator.userAgent.toLowerCase()

  if (userAgent.includes('twitter')) return 'Twitter/X'
  if (userAgent.includes('instagram')) return 'Instagram'
  if (userAgent.includes('line')) return 'LINE'
  if (userAgent.includes('fbav') || userAgent.includes('fban') || userAgent.includes('fb_iab')) return 'Facebook'

  return null
}
