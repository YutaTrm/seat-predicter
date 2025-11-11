'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// サポートする言語
export const locales = ['ja', 'ko', 'zh-cn', 'zh-tw'] as const
export type Locale = (typeof locales)[number]

// 言語名の表示
export const localeNames: Record<Locale, string> = {
  'ja': '日本語',
  'ko': '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文'
}

type Messages = Record<string, string | Record<string, string>>

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ja')
  const [messages, setMessages] = useState<Messages>({})

  // 翻訳メッセージを読み込む
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await import(`../../messages/${locale}.json`)
        setMessages(msgs.default)
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error)
      }
    }
    loadMessages()
  }, [locale])

  // 初回ロード時にクッキーまたはブラウザ言語から言語を設定
  useEffect(() => {
    // クッキーから言語を取得
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined

    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
      return
    }

    // ブラウザ言語を検出
    const browserLang = navigator.language.toLowerCase()

    if (browserLang.startsWith('ko')) {
      setLocaleState('ko')
    } else if (browserLang.startsWith('zh-cn') || browserLang === 'zh' || browserLang === 'zh-hans') {
      setLocaleState('zh-cn')
    } else if (browserLang.startsWith('zh-tw') || browserLang === 'zh-hant') {
      setLocaleState('zh-tw')
    } else {
      setLocaleState('ja') // デフォルトは日本語
    }
  }, [])

  // 言語を変更してクッキーに保存
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    // クッキーに1年間保存
    document.cookie = `locale=${newLocale}; max-age=${60 * 60 * 24 * 365}; path=/`
  }

  // 翻訳関数
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: string | Record<string, string | Record<string, string>> | undefined = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // キーが見つからない場合はキー自体を返す
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// カスタムフック
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
