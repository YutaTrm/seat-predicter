import { Ticket } from '@/types/ticket'
import { DEFAULT_SIZE } from '@/constants/ticketGrid'
import { BlockSize } from '../types'

/**
 * ブロックレターとブロック番号でチケットをグループ化
 */
export const groupTickets = (tickets: Ticket[]): Record<string, Ticket[]> => {
  return tickets.reduce<Record<string, Ticket[]>>((acc, t) => {
    const key = `${t.block}${t.block_number}`
    acc[key] = acc[key] || []
    acc[key].push(t)
    return acc
  }, {})
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
export const getMaxBlockNumbers = (tickets: Ticket[], blockLetters: string[]): Record<string, number> => {
  return blockLetters.reduce<Record<string, number>>((acc, letter) => {
    acc[letter] = Math.max(...tickets.filter(t => t.block === letter).map(t => t.block_number))
    return acc
  }, {})
}

/**
 * 全ブロックキーを生成
 */
export const getAllBlockKeys = (blockLetters: string[], maxBlockNumbers: Record<string, number>): string[] => {
  return blockLetters.flatMap(letter => {
    return Array.from({ length: maxBlockNumbers[letter] }, (_, i) => `${letter}${i + 1}`)
  })
}

/**
 * ブロック番号ごとの最大幅を計算
 */
export const calculateBlockNumberMaxWidths = (tickets: Ticket[]): Record<string, number> => {
  const uniqueBlockNumbers = Array.from(new Set(tickets.map(t => t.block_number)))
  return uniqueBlockNumbers.reduce<Record<string, number>>((acc, blockNumber) => {
    const sameNumberTickets = tickets.filter(t => t.block_number === blockNumber)
    acc[blockNumber] = Math.max(...sameNumberTickets.map(t => t.number)) || DEFAULT_SIZE
    return acc
  }, {})
}

/**
 * ブロックレターごとの最大高さを計算
 */
export const calculateBlockMaxHeights = (tickets: Ticket[], blockLetters: string[]): Record<string, number> => {
  return blockLetters.reduce<Record<string, number>>((acc, letter) => {
    const letterTickets = tickets.filter(t => t.block === letter)
    acc[letter] = Math.max(...letterTickets.map(t => t.column)) || DEFAULT_SIZE
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
    const letter = blockKey[0]
    const blockNumber = parseInt(blockKey.slice(1))

    acc[blockKey] = {
      width: blockNumberMaxWidths[blockNumber],
      height: blockMaxHeights[letter],
      count: blockTickets.length
    }
    return acc
  }, {})
}