// SWR共通キャッシュ設定
const CACHE_DURATION_MS = 15 * 60 * 1000 // 15分

export const SWR_CACHE_OPTIONS = {
  dedupingInterval: CACHE_DURATION_MS,
  focusThrottleInterval: CACHE_DURATION_MS,
}
