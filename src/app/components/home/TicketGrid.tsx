'use client'

import React from 'react'
import { Ticket } from '@/types/ticket'

interface TicketGridProps {
  tickets: Ticket[]
}

/**
 * チケット情報を方眼状に表示するコンポーネント
 * @param tickets チケット情報の配列
 */
const TicketGrid: React.FC<TicketGridProps> = ({ tickets }) => {
  // 最大のブロック情報を取得
  const maxBlock = tickets.reduce(
    (max, ticket) => ({
      block: ticket.block > max.block ? ticket.block : max.block,
      block_number:
        ticket.block_number > max.block_number
          ? ticket.block_number
          : max.block_number,
      column: ticket.column > max.column ? ticket.column : max.column,
      number: ticket.number > max.number ? ticket.number : max.number,
    }),
    { block: 'A', block_number: 1, column: 1, number: 1 }
  )

  // アルファベットの配列を生成（A から maxBlock.block まで）
  const blockLetters = Array.from(
    { length: maxBlock.block.charCodeAt(0) - 'A'.charCodeAt(0) + 1 },
    (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)
  )

  /**
   * 特定の座標にチケットが存在するかチェック
   */
  const hasTicket = (blockLetter: string, blockNumber: number, row: number, col: number) => {
    return tickets.some(
      (ticket) =>
        ticket.block === blockLetter &&
        ticket.block_number === blockNumber &&
        ticket.column === col &&
        ticket.number === row
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        {/* ブロックごとのグリッドを縦に配置 */}
        {blockLetters.map((letter) => (
          <div key={letter} className="mb-1">
            <div className="flex gap-1">
              {/* 各ブロック番号のグリッドを横に配置 */}
              {Array.from({ length: maxBlock.block_number }, (_, i) => i + 1).map(
                (blockNumber) => (
                  <div key={`${letter}${blockNumber}`} className="relative">
                    <div className="text-xs text-gray-500 text-center">{letter}{blockNumber}</div>
                    <div className={`grid gap-[1px]`} style={{ gridTemplateColumns: `repeat(${maxBlock.number}, 5px)` }}>
                      {/* 動的なサイズのグリッドを作成（列と行を入れ替え） */}
                      {Array.from({ length: maxBlock.column }, (_, row) =>
                        Array.from({ length: maxBlock.number }, (_, col) => (
                          <div
                            key={`${letter}${blockNumber}-${row}-${col}`}
                            className={`w-[5px] h-[5px] ${
                              hasTicket(letter, blockNumber, col + 1, row + 1)
                                ? 'bg-rose-500'
                                : 'bg-gray-200'
                            }`}
                            title={`${letter}${blockNumber} (${row + 1},${col + 1})`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TicketGrid