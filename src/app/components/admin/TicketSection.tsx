'use client'

import { TicketSectionProps } from '../../../types/admin'
import { deleteTicket } from '../../../utils/ticketUtils'
import Icon from '../common/Icon'

/**
 * チケット一覧セクションコンポーネント
 */
export default function TicketSection({
  tours,
  tickets,
  selectedArtistId,
  selectedTourId,
  onTourSelect,
  onTicketDelete,
  handleDeleteTicket
}: TicketSectionProps) {
  // 選択されたツアーのチケットをフィルタリング
  const filteredTickets = selectedTourId
    ? tickets.filter(ticket => ticket.tour_id === Number(selectedTourId))
    : []

  // 選択されたアーティストのツアーをフィルタリング
  const filteredTours = selectedArtistId
    ? tours.filter(tour => tour.artist_id === Number(selectedArtistId))
    : []

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md lg:w-2/6 lg:p-4">
      <h2 className="text-xl font-semibold mb-4">
        {selectedTourId ? (
          <>
            {tours.find(t => t.id === Number(selectedTourId))?.name}のチケット一覧{' '}
            <span className="text-gray-500 text-sm">({filteredTickets.length}件)</span>
          </>
        ) : (
          'チケット一覧'
        )}
      </h2>
      {selectedArtistId ? (
        <>
          <select
            value={selectedTourId}
            onChange={(e) => onTourSelect(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">ツアーを選択</option>
            {filteredTours.map(tour => (
              <option key={tour.id} value={tour.id}>
                {tour.name}
              </option>
            ))}
          </select>

          {selectedTourId ? (
            filteredTickets.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">ブロ</th>
                    <th className="border p-2 text-center">列</th>
                    <th className="border p-2 text-center">席</th>
                    <th className="border p-2 text-right">種別</th>
                    <th className="border p-2 text-center w-12">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="border-b text-xs">
                      <td className="border p-2">{ticket.block}{ticket.block_number}</td>
                      <td className="border p-2 text-center">{ticket.column}</td>
                      <td className="border p-2 text-center">{ticket.number}</td>
                      <td className="border p-2 text-right">{ticket.lottery_slots_name}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={async () => {
                            try {
                              await deleteTicket(ticket.id, handleDeleteTicket)
                              onTicketDelete(ticket.id)
                              alert('チケットを削除しました')
                            } catch (err) {
                              if (err instanceof Error && err.message === 'キャンセルされました') return
                              alert(err instanceof Error ? err.message : 'チケットの削除に失敗しました')
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon type='delete'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">このツアーのチケットはありません</p>
            )
          ) : (
            <p className="text-gray-500">ツアーを選択してください</p>
          )}
        </>
      ) : (
        <p className="text-gray-500">アーティストを選択してください</p>
      )}
    </div>
  )
}