import { useState, useMemo } from 'react'
import { Ticket } from '@/types/ticket'
import { MAX_BLOCK_NUMBER, MAX_COLUMN, MAX_NUMBER } from '@/constants/ticketGrid'
import { filterOutliers } from '@/utils/outlierDetection'
import { ProcessedData, OutlierStats } from '../types'

export const useOutlierDetection = (tickets: Ticket[]) => {
  const [enableOutlierDetection, setEnableOutlierDetection] = useState(false)
  const [outlierStats, setOutlierStats] = useState<OutlierStats>({
    outliers: 0,
    outlierTickets: []
  })

  const processedData = useMemo<ProcessedData>(() => {
    // 基本的なバリデーション（ブロック名が大文字アルファベット1文字）
    const validTickets = tickets.filter(t => /^[A-Z]$/.test(t.block))

    // ブロックごとの列番と席番の異常値を検出
    const blockGroups = validTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
      const key = t.block
      acc[key] = acc[key] || []
      acc[key].push(t)
      return acc
    }, {})

    // 各ブロックで異常値を検出と除外
    return Object.entries(blockGroups).reduce((acc, [block, blockTickets]) => {
      // 列番と席番の配列を取得
      const columns = blockTickets.map(t => t.column)
      const numbers = blockTickets.map(t => t.number)

      // 異常値を除外した有効な値の範囲を取得
      const validColumns = new Set(filterOutliers(columns, MAX_COLUMN))
      const validNumbers = new Set(filterOutliers(numbers, MAX_NUMBER))

      // 有効な値の範囲を保存
      acc.validRanges[block] = {
        columns: validColumns,
        numbers: validNumbers
      }

      // 異常値判定が有効な場合のみ除外処理を行う
      if (enableOutlierDetection) {
        // 除外されたチケットを記録
        const excluded = blockTickets.filter(t => {
          const isValid = t.block_number <= MAX_BLOCK_NUMBER &&
            validColumns.has(t.column) &&
            validNumbers.has(t.number)

          if (!isValid) {
            acc.outlierTickets.push(`${t.block}${t.block_number}-${t.column}-${t.number}`)
          }
          return !isValid
        })

        // 除外されたチケット数を記録
        acc.outliers += excluded.length

        // 有効なチケットのみを追加
        acc.filteredTickets.push(...blockTickets.filter(t => !excluded.includes(t)))
      } else {
        // 異常値判定が無効の場合は全てのチケットを使用
        acc.filteredTickets.push(...blockTickets)
      }

      return acc
    }, {
      filteredTickets: [] as Ticket[],
      outliers: 0,
      outlierTickets: [] as string[],
      validRanges: {} as Record<string, { columns: Set<number>, numbers: Set<number> }>
    })
  }, [tickets, enableOutlierDetection])

  // 除外チケット情報を更新
  useEffect(() => {
    setOutlierStats({
      outliers: processedData.outliers,
      outlierTickets: processedData.outlierTickets
    })
  }, [processedData])

  return {
    enableOutlierDetection,
    setEnableOutlierDetection,
    outlierStats,
    processedData
  }
}

import { useEffect } from 'react'