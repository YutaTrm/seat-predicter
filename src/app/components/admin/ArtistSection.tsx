'use client'

import { useState } from 'react'
import { Artist, ArtistSectionProps } from '../../../types/admin'
import { addArtist, editArtist, deleteArtist } from '../../../utils/artistUtils'
import { isCancelError } from '../../../utils/adminHelpers'
import Icon from '../common/Icon'

/**
 * アーティスト管理セクションコンポーネント
 */
export default function ArtistSection({
  artists,
  onArtistAdd,
  onArtistEdit,
  onArtistDelete,
  handleAddArtist,
  handleEditArtist,
  handleDeleteArtist
}: ArtistSectionProps) {
  const [artistName, setArtistName] = useState('')
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artistName.trim()) return

    try {
      const artist = await addArtist(artistName, handleAddArtist)
      onArtistAdd(artist)
      setArtistName('')
      alert('アーティストを追加しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'アーティストの追加に失敗しました')
    }
  }

  const handleEdit = async (id: number, newName: string) => {
    try {
      await editArtist(id, newName, handleEditArtist)
      onArtistEdit(id, newName)
      setEditingArtist(null)
      alert('アーティストを編集しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'アーティストの編集に失敗しました')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteArtist(id, handleDeleteArtist)
      onArtistDelete(id)
      alert('アーティストを削除しました')
    } catch (err) {
      if (isCancelError(err)) return
      alert(err instanceof Error ? err.message : 'アーティストの削除に失敗しました')
    }
  }

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md lg:w-2/6  lg:p-4">
      <h2 className="text-xl font-semibold mb-4">アーティスト追加</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="アーティスト名"
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-rose-500 text-white p-2 rounded-r"
          >
            追加
          </button>
        </div>
      </form>
      <hr/>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          アーティスト一覧 <span className="text-gray-500 text-sm">({artists.length}件)</span>
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">アーティスト名</th>
              <th className="border p-2 text-center w-[5em]">操作</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist.id} className="border-b">
                <td className="border p-2">
                  {editingArtist?.id === artist.id ? (
                    <input
                      type="text"
                      value={editingArtist.name}
                      onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    artist.name
                  )}
                </td>
                <td className="border p-2 text-center">
                  {editingArtist?.id === artist.id ? (
                    <>
                      <button
                        onClick={() => handleEdit(artist.id, editingArtist.name)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingArtist(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingArtist(artist)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Icon type='edit'/>
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
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
      </div>
    </div>
  )
}