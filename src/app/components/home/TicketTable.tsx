'use client'

import { useState } from 'react'
import { Ticket } from '../../../types/ticket'
import TicketRow from './TicketRow'

type TicketTableProps = {
  tickets: Ticket[]
  showTickets: boolean
}

type SortField = 'block' | 'column' | 'number' | 'lottery_slots_name'
type SortDirection = 'asc' | 'desc'

/**
 * チケット一覧テーブルコンポーネント
 */
export default function TicketTable({ tickets, showTickets }: TicketTableProps) {
  const [sortField, setSortField] = useState<SortField>('block')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

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
   * ソート方向を切り替える関数
   */
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  /**
   * ソートアイコンを表示する関数
   */
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <span className="ml-1">↕</span>
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  /**
   * チケットをソートする関数
   */
  const sortTickets = (tickets: Ticket[]) => {
    return [...tickets].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'block':
          comparison = a.block.localeCompare(b.block)
          break
        case 'column':
          comparison = a.column - b.column
          break
        case 'number':
          comparison = a.number - b.number
          break
        case 'lottery_slots_name':
          comparison = (a.lottery_slots_name || '').localeCompare(b.lottery_slots_name || '')
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }

  /**
   * ブロックごとのチケット数を集計する
   */
  const blockCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.block] = (acc[ticket.block] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sortedTickets = sortTickets(tickets)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border mb-3">
        <thead>
          <tr className="bg-gray-600 text-gray-100 text-xs">
            <th
              className="px-2 py-1 border-b text-center font-semibold cursor-pointer hover:bg-gray-500"
              onClick={() => toggleSort('block')}
            >
              ブロック{renderSortIcon('block')}
            </th>
            <th
              className="px-2 py-1 border-b text-center font-semibold cursor-pointer hover:bg-gray-500"
              onClick={() => toggleSort('column')}
            >
              列{renderSortIcon('column')}
            </th>
            <th
              className="px-2 py-1 border-b text-center font-semibold cursor-pointer hover:bg-gray-500"
              onClick={() => toggleSort('number')}
            >
              席{renderSortIcon('number')}
            </th>
            <th
              className="px-2 py-1 border-b text-center font-semibold cursor-pointer hover:bg-gray-500"
              onClick={() => toggleSort('lottery_slots_name')}
            >
              抽選枠{renderSortIcon('lottery_slots_name')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} />
          ))}
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