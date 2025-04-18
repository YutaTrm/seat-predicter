/**
 * 改良版の異常値検出
 * @param values 検証する値の配列
 * @param maxValue 許容される最大値
 * @returns 異常でない値の配列
 */
export const filterOutliers = (values: number[], maxValue: number): number[] => {
  if (values.length === 0) return []

  // 基本的なバリデーション（1以上maxValue以下）
  const validValues = values.filter(v => v >= 1 && v <= maxValue)
  if (validValues.length === 0) return []

  // サンプル数が少ない場合は基本的なバリデーションのみ
  if (validValues.length < MIN_SAMPLES) {
    return validValues
  }

  // 値の出現回数をカウント
  const frequency: Record<number, number> = {}
  validValues.forEach(v => {
    frequency[v] = (frequency[v] || 0) + 1
  })

  // 値の統計情報を計算
  const sortedValues = [...validValues].sort((a, b) => a - b)
  const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)]

  // 異常値の判定
  // 1. 出現回数が1回
  // 2. 中央値からの距離が大きい（Q3よりも大きい）
  return validValues.filter(v => {
    const freq = frequency[v]
    if (freq > 1) return true // 複数回出現する値は正常とみなす
    return v <= q3 * 1.5 // 1回しか出現しない値は、Q3の1.5倍までを許容
  })
}

import { MIN_SAMPLES } from '@/constants/ticketGrid'