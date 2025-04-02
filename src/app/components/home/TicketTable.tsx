'use client'

import { Ticket } from '../../../types/ticket'

type TicketTableProps = {
  tickets: Ticket[]
  showTickets: boolean
}

/**
 * チケット一覧テーブルコンポーネント
 */
export default function TicketTable({ tickets, showTickets }: TicketTableProps) {
  if (!showTickets) {
    return (
      <p className="text-sm text-center bg-yellow-50 text-yellow-600 rounded-lg p-2">
        「一覧」を押すかチケット登録をすると一覧が表示されます
      </p>
    )
  }

  if (tickets.length === 0) {
    return (
      <p className="text-sm text-center bg-yellow-50 text-yellow-600 rounded-lg p-2">
        登録されているチケットはありません
      </p>
    )
  }

  /**
   * ブロックごとのチケット数を集計する
   */
  const blockCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.block] = (acc[ticket.block] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border text-sm mb-3">
        <thead>
          <tr className="bg-gray-600 text-gray-100">
            <th className="px-3 py-1 border-b text-center font-semibold">ブロック</th>
            <th className="px-3 py-1 border-b text-center font-semibold">列</th>
            <th className="px-3 py-1 border-b text-center font-semibold">席番号</th>
            <th className="px-3 py-1 border-b text-center font-semibold">抽選枠</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            // ブロックごとに背景色を変える（A-Zの26色）
            const blockIndex = ticket.block.charCodeAt(0) - 65
            // 黄金角（137.5度）を使用して、隣接するブロックの色が離れるようにする
            const hue = (blockIndex * 137.5) % 360
            const backgroundColor = `hsl(${hue}, 80%, 80%)`//（色相・彩度・輝度）

            return (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50"
                style={{ backgroundColor }}
              >
                <td className="px-3 py-1 border-b text-right">{ticket.block}</td>
                <td className="px-3 py-1 border-b text-right">{ticket.column}</td>
                <td className="px-3 py-1 border-b text-right">{ticket.number}</td>
                <td className="px-3 py-1 border-b text-right text-xs">{ticket.lottery_slots_name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* ブロックごとのレコード数を表示 */}
      <h3 className="text-gray-600 font-bold mb-2">ブロックごとの集計数</h3>
      <table className="mb-4">
        <tbody>
          {Object.entries(blockCounts).map(([block, count]) => (
            <tr key={block} className="text-sm p-2 rounded">
              <td className="font-bold">{block}ブロック:{count}件</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}