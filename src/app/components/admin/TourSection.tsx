'use client'

import { useState, useMemo } from 'react'
import { Tour, TourSectionProps } from '../../../types/admin'
import { addTour, editTour, deleteTour } from '../../../utils/tourUtils'
import Icon from '../common/Icon'

/**
 * ツアーが終了しているかどうかを判定する関数
 */
const isTourEnded = (endDate: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tourEndDate = new Date(endDate)
  tourEndDate.setHours(0, 0, 0, 0)
  return tourEndDate < today
}

/**
 * ツアー管理セクションコンポーネント
 */
export default function TourSection({
  artists,
  tours,
  selectedArtistId,
  onArtistSelect,
  onTourAdd,
  onTourEdit,
  onTourDelete,
  handleAddTour,
  handleEditTour,
  handleDeleteTour
}: TourSectionProps) {
  const [tourName, setTourName] = useState('')
  const [tourEndDate, setTourEndDate] = useState('')
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingEndDate, setEditingEndDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArtistId || !tourName.trim() || !tourEndDate) return

    try {
      const tour = await addTour(selectedArtistId, tourName, tourEndDate, handleAddTour)
      onTourAdd(tour)
      setTourName('')
      setTourEndDate('')
      alert('ツアーを追加しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'ツアーの追加に失敗しました')
    }
  }

  const handleEdit = async (id: number, newName: string, newEndDate: string) => {
    try {
      await editTour(id, newName, newEndDate, handleEditTour)
      onTourEdit(id, newName)
      setEditingTour(null)
      alert('ツアーを編集しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'ツアーの編集に失敗しました')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTour(id, handleDeleteTour)
      onTourDelete(id)
      alert('ツアーを削除しました')
    } catch (err) {
      if (err instanceof Error && err.message === 'キャンセルされました') return
      alert(err instanceof Error ? err.message : 'ツアーの削除に失敗しました')
    }
  }

  // 選択されたアーティストのツアーをフィルタリング（メモ化）
  const filteredTours = useMemo(() => {
    if (!selectedArtistId) return []
    return tours.filter(tour => tour.artist_id === Number(selectedArtistId))
  }, [selectedArtistId, tours])

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md lg:w-2/6 lg:p-4">
      <h2 className="text-xl font-semibold mb-4">ツアー追加</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <select
          value={selectedArtistId}
          onChange={(e) => onArtistSelect(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">アーティストを選択</option>
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <div className="space-y-2">
          <input
            type="text"
            value={tourName}
            onChange={(e) => setTourName(e.target.value)}
            placeholder="ツアー名"
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              value={tourEndDate}
              onChange={(e) => setTourEndDate(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              追加
            </button>
          </div>
        </div>
      </form>
      <hr/>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          {selectedArtistId ? (
            <>
              {artists.find(a => a.id === Number(selectedArtistId))?.name}のツアー一覧{' '}
              <span className="text-gray-500 text-sm">({filteredTours.length}件)</span>
            </>
          ) : (
            'ツアー一覧'
          )}
        </h3>
        {selectedArtistId ? (
          filteredTours.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">ツアー名</th>
                  {/* <th className="border p-2 text-left">終了日</th> */}
                  <th className="border p-2 text-center w-[5em]">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map(tour => (
                  <tr
                    key={tour.id}
                    className={`border-b ${isTourEnded(tour.end_date) ? 'bg-gray-100' : ''}`}
                  >
                    <td className="border p-2">
                      {editingTour?.id === tour.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        tour.name
                      )}
                      <br/>【終了日】
                      {editingTour?.id === tour.id ? (
                        <input
                          type="date"
                          value={editingEndDate}
                          onChange={(e) => setEditingEndDate(e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        new Date(tour.end_date).toLocaleDateString('ja-JP')
                      )}
                    </td>
                    {/* <td className="border p-2">
                      {editingTour?.id === tour.id ? (
                        <input
                          type="date"
                          value={editingTour.end_date}
                          onChange={(e) => setEditingTour({ ...editingTour, end_date: e.target.value })}
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        new Date(tour.end_date).toLocaleDateString('ja-JP')
                      )}
                    </td> */}
                    <td className="border p-2 text-center">
                      {editingTour?.id === tour.id ? (
                        <>
                          <button
                            onClick={() => handleEdit(tour.id, editingName, editingEndDate)}
                            className="text-green-500 hover:text-green-700 mr-2"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingTour(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            キャンセル
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingTour(tour)
                              setEditingName(tour.name)
                              setEditingEndDate(tour.end_date.split('T')[0])
                            }}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <Icon type='edit'/>
                          </button>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Icon type='delete'/>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">このアーティストのツアーはありません</p>
          )
        ) : (
          <p className="text-gray-500">アーティストを選択してください</p>
        )}
      </div>
    </div>
  )
}