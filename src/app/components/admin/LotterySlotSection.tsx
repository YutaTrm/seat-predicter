'use client'

import { useState } from 'react'
import { LotterySlot, LotterySlotSectionProps } from '../../../types/admin'
import { addLotterySlot, editLotterySlot, deleteLotterySlot } from '../../../utils/lotterySlotUtils'
import Icon from '../common/Icon'

/**
 * 抽選枠管理セクションコンポーネント
 */
export default function LotterySlotSection({
  artists,
  lotterySlots,
  selectedArtistId,
  onArtistSelect,
  onLotterySlotAdd,
  onLotterySlotEdit,
  onLotterySlotDelete,
  handleAddLotterySlot,
  handleEditLotterySlot,
  handleDeleteLotterySlot
}: LotterySlotSectionProps) {
  const [lotterySlotName, setLotterySlotName] = useState('')
  const [editingLotterySlot, setEditingLotterySlot] = useState<LotterySlot | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArtistId || !lotterySlotName.trim()) return

    try {
      const lotterySlot = await addLotterySlot(selectedArtistId, lotterySlotName, handleAddLotterySlot)
      onLotterySlotAdd(lotterySlot)
      setLotterySlotName('')
      alert('抽選枠を追加しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '抽選枠の追加に失敗しました')
    }
  }

  const handleEdit = async (id: number, newName: string) => {
    try {
      await editLotterySlot(id, newName, handleEditLotterySlot)
      onLotterySlotEdit(id, newName)
      setEditingLotterySlot(null)
      alert('抽選枠を編集しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '抽選枠の編集に失敗しました')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteLotterySlot(id, handleDeleteLotterySlot)
      onLotterySlotDelete(id)
      alert('抽選枠を削除しました')
    } catch (err) {
      if (err instanceof Error && err.message === 'キャンセルされました') return
      alert(err instanceof Error ? err.message : '抽選枠の削除に失敗しました')
    }
  }

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md lg:w-2/6 lg:p-4">
      <h2 className="text-xl font-semibold mb-4">抽選枠管理</h2>
      <div className="mb-4">
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

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={lotterySlotName}
            onChange={(e) => setLotterySlotName(e.target.value)}
            placeholder="抽選枠名"
            className="flex-grow p-2 border rounded-l"
            disabled={!selectedArtistId}
          />
          <button
            type="submit"
            className="bg-rose-500 text-white p-2 rounded-r"
            disabled={!selectedArtistId}
          >
            追加
          </button>
        </form>
      </div>
      <hr/>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          抽選枠一覧 <span className="text-gray-500 text-sm">({lotterySlots.length}件)</span>
        </h3>
      </div>
      {selectedArtistId ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">抽選枠名</th>
              <th className="border p-2 text-center w-[5em]">操作</th>
            </tr>
          </thead>
          <tbody>
            {lotterySlots.map(slot => (
              <tr key={slot.id} className="border-b">
                <td className="border p-2">
                  {editingLotterySlot?.id === slot.id ? (
                    <input
                      type="text"
                      value={editingLotterySlot.name}
                      onChange={(e) => setEditingLotterySlot({ ...editingLotterySlot, name: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    slot.name
                  )}
                </td>
                <td className="border p-2 text-center">
                  {editingLotterySlot?.id === slot.id ? (
                    <>
                      <button
                        onClick={() => handleEdit(slot.id, editingLotterySlot.name)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingLotterySlot(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingLotterySlot(slot)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Icon type='edit'/>
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-red-500 hover:text-red-700 hidden"
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
        <p className="text-gray-500">アーティストを選択してください</p>
      )}
    </div>
  )
}