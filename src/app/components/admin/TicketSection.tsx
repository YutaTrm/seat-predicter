'use client'

import { TicketSectionProps } from '../../../types/admin'

/**
 * チケット一覧セクションコンポーネント
 */
export default function TicketSection({
  tours,
  tickets,
  selectedArtistId,
  selectedTourId,
  onTourSelect
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
            {tours.find(t => t.id === Number(selectedTourId))?.name}の登録済み座席{' '}
            <span className="text-gray-500 text-sm">({filteredTickets.length}件)</span>
          </>
        ) : (
          '登録済み座席'
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
                    <th className="border p-2 text-left">ブロック</th>
                    <th className="border p-2 text-center">列</th>
                    <th className="border p-2 text-center">番号</th>
                    <th className="border p-2 text-center">種別</th>
                    <th className="border p-2 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="border-b">
                      <td className="border p-2">{ticket.block}</td>
                      <td className="border p-2 text-center">{ticket.column}</td>
                      <td className="border p-2 text-center">{ticket.number}</td>
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