'use client'

import Cookies from 'js-cookie'

// Cookie名: ticket_post_limit
const COOKIE_NAME = 'x9z2y8w4'
const POST_LIMIT = 4 //4件まで可能
const TIME_LIMIT = 1 * 60 * 60 * 1000 // 1時間

interface PostLimitData {
  // count
  c: number
  // firstPostTime
  t: number
  // token
  k: string
}

/**
 * Cookieから制限データを取得
 */
const getPostLimitData = (): PostLimitData | null => {
  const data = Cookies.get(COOKIE_NAME)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * 制限データをCookieに保存
 */
const setPostLimitData = (data: PostLimitData) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: 1 })
}

/**
 * トークン生成
 */
const generateToken = () => {
  return Math.random().toString(36).substring(2)
}

/**
 * 投稿制限チェック
 */
export const checkPostLimit = (): { success: boolean } => {
  const data = getPostLimitData()

  if (!data) {
    setPostLimitData({
      c: 1,
      t: Date.now(),
      k: generateToken()
    })
    return { success: true }
  }

  if (data.c < POST_LIMIT) {
    setPostLimitData({
      ...data,
      c: data.c + 1
    })
    return { success: true }
  }

  const elapsed = Date.now() - data.t
  if (elapsed >= TIME_LIMIT) {
    setPostLimitData({
      c: 1,
      t: Date.now(),
      k: generateToken()
    })
    return { success: true }
  }

  return { success: false }
}