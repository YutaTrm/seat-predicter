import { Ticket } from '@/types/ticket'
import { DEFAULT_SIZE } from '@/constants/ticketGrid'
import { BlockSize } from '../types'

/**
 * ブロックレターとブロック番号でチケットをグループ化
 */
export const groupTickets = (tickets: Ticket[]): Record<string, Ticket[]> => {
  const grouped = tickets.reduce<Record<string, Ticket[]>>((acc, t) => {
    // ブロックレターとナンバーを正規化
    const key = `${t.block.toUpperCase()}${t.block_number}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(t)
    return acc
  }, {})

  return grouped
}

/**
 * ブロックレターの配列を取得
 */
export const getBlockLetters = (tickets: Ticket[]): string[] => {
  return Array.from(new Set(tickets.map(t => t.block))).sort()
}

/**
 * ブロックレターごとの最大ブロック番号を取得
 */
/**
 * ブロックレターごとの最大ブロック番号を取得
 */
export const getMaxBlockNumbers = (tickets: Ticket[], blockLetters: string[]): Record<string, number> => {
  return blockLetters.reduce<Record<string, number>>((acc, letter) => {
    // 大文字に正規化してから比較
    const letterTickets = tickets.filter(t => t.block.toUpperCase() === letter.toUpperCase())
    if (letterTickets.length > 0) {
      acc[letter] = Math.max(...letterTickets.map(t => t.block_number))
    } else {
      acc[letter] = DEFAULT_SIZE
    }
    return acc
  }, {})
}

/**
 * 全ブロックキーを生成
 */
export const getAllBlockKeys = (blockLetters: string[], maxBlockNumbers: Record<string, number>): string[] => {
  return blockLetters.flatMap(letter => {
    // 1からmaxBlockNumbersまでの全てのブロックを生成
    return Array.from({ length: maxBlockNumbers[letter] }, (_, i) => `${letter}${i + 1}`)
  })
}

/**
 * ブロック番号ごとの最大幅を計算
 */
export const calculateBlockNumberMaxWidths = (tickets: Ticket[]): Record<string, number> => {
  // 全てのブロック番号に対してデフォルトサイズを設定
  const maxBlockNumber = Math.max(...tickets.map(t => t.block_number), 0)
  const result: Record<string, number> = {}

  // 1からmaxBlockNumberまでの全てのブロック番号に対してデフォルトサイズを設定
  for (let i = 1; i <= maxBlockNumber; i++) {
    result[i] = DEFAULT_SIZE
  }

  // 実際のチケットデータで上書き
  tickets.forEach(ticket => {
    const currentMax = result[ticket.block_number] || DEFAULT_SIZE
    result[ticket.block_number] = Math.max(currentMax, ticket.number)
  })

  return result
}

/**
 * ブロックレターごとの最大高さを計算
 */
export const calculateBlockMaxHeights = (tickets: Ticket[], blockLetters: string[]): Record<string, number> => {
  return blockLetters.reduce<Record<string, number>>((acc, letter) => {
    // 大文字に正規化してから比較
    const letterTickets = tickets.filter(t => t.block.toUpperCase() === letter.toUpperCase())
    if (letterTickets.length > 0) {
      acc[letter] = Math.max(...letterTickets.map(t => t.column))
    } else {
      acc[letter] = DEFAULT_SIZE
    }
    return acc
  }, {})
}

/**
 * 各ブロックのサイズを設定
 */
export const calculateBlockSizes = (
  allBlockKeys: string[],
  grouped: Record<string, Ticket[]>,
  blockNumberMaxWidths: Record<string, number>,
  blockMaxHeights: Record<string, number>
): Record<string, BlockSize> => {
  return allBlockKeys.reduce<Record<string, BlockSize>>((acc, blockKey) => {
    const blockTickets = grouped[blockKey] || []
    const match = blockKey.match(/([A-Z]+)(\d+)/)
    if (!match) {
      console.warn(`Invalid block key format: ${blockKey}`)
      return acc
    }

    const [, letter, blockNumberStr] = match
    const blockNumber = parseInt(blockNumberStr)

    acc[blockKey] = {
      width: blockNumberMaxWidths[blockNumber] || DEFAULT_SIZE,
      height: blockMaxHeights[letter] || DEFAULT_SIZE,
      count: blockTickets.length
    }
    return acc
  }, {})
}