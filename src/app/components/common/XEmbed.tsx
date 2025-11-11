'use client'

import { useEffect, useState, useRef } from 'react'

// Twitter Widgets API の型定義
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void
      }
    }
  }
}

interface XEmbedProps {
  url: string
}

// グローバルにスクリプトの読み込み状態を管理
let twitterScriptLoading = false
let twitterScriptLoaded = false

/**
 * X（Twitter）のポストをembedするコンポーネント
 */
export default function XEmbed({ url }: XEmbedProps) {
  const [embedHtml, setEmbedHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  // oEmbed APIからHTMLを取得
  useEffect(() => {
    const fetchEmbed = async () => {
      try {
        setIsLoading(true)
        setError('')
        setEmbedHtml('')

        const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
        const response = await fetch(oembedUrl)

        if (!response.ok) {
          throw new Error('Failed to fetch embed')
        }

        const data = await response.json()
        setEmbedHtml(data.html)
      } catch (err) {
        console.error('Error fetching embed:', err)
        setError('ポストの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (url) {
      fetchEmbed()
    }
  }, [url])

  // embedHTMLが設定されたらTwitter Widgetを読み込む
  useEffect(() => {
    if (!embedHtml || !containerRef.current) return

    // コンテナをクリアしてHTMLを挿入
    const container = containerRef.current
    container.innerHTML = embedHtml

    const loadWidget = () => {
      if (window.twttr?.widgets && container) {
        window.twttr.widgets.load(container)
      }
    }

    // スクリプトが既に読み込まれている場合
    if (twitterScriptLoaded || window.twttr) {
      twitterScriptLoaded = true
      // 少し遅延してwidgetを読み込む
      const timer = setTimeout(loadWidget, 300)
      return () => clearTimeout(timer)
    }

    // スクリプトの読み込み中の場合は待つ
    if (twitterScriptLoading) {
      const checkInterval = setInterval(() => {
        if (window.twttr) {
          clearInterval(checkInterval)
          twitterScriptLoaded = true
          loadWidget()
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    // スクリプトを初めて読み込む
    twitterScriptLoading = true
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onload = () => {
      twitterScriptLoaded = true
      twitterScriptLoading = false
      loadWidget()
    }
    script.onerror = () => {
      twitterScriptLoading = false
      console.error('Failed to load Twitter widgets script')
    }
    document.body.appendChild(script)
  }, [embedHtml])

  if (isLoading) {
    return (
      <div className="text-gray-500 text-center py-4">
        読み込み中...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-gray-500 text-center py-4">
        {error}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center"
    />
  )
}
