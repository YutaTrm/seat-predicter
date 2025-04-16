'use client'

import { memo } from 'react'
import { Ticket } from '../../../types/ticket'

type TicketRowProps = {
  ticket: Ticket
}

/**
 * チケット一覧の行コンポーネント
 */
const TicketRow = ({ ticket }: TicketRowProps) => {
  // ブロックごとに背景色を変える（A-Zの26色）
  const blockIndex = ticket.block.charCodeAt(0) - 65
  // 黄金角（137.5度）を使用して、隣接するブロックの色が離れるようにする
  const hue = (blockIndex * 137.5) % 360
  const backgroundColor = `hsl(${hue}, 80%, 80%)`//（色相・彩度・輝度）

  return (
    <tr
      className="hover:bg-gray-50 text-sm"
      style={{ backgroundColor }}
    >
      <td className="px-3 py-1 border-b text-right">{ticket.block}{ticket.block_number}</td>
      <td className="px-3 py-1 border-b text-right">{ticket.column}</td>
      <td className="px-3 py-1 border-b text-right">{ticket.number}</td>
      <td className="px-3 py-1 border-b text-right text-xs">{ticket.lottery_slots_name}</td>
    </tr>
  )
}

export default memo(TicketRow)