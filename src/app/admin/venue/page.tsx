'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/lib/supabase/auth'
import { fetchAllVenues, addVenueAction, updateVenueAction, deleteVenueAction, Venue } from './actions'
import AdminHeader from '@/app/components/admin/AdminHeader'

export const dynamic = 'force-dynamic'

export default function AdminVenuePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // 編集・追加用のstate
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    scale: '',
    capacity: '',
    image_url: ''
  })

  // 初期データ取得
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const session = await getSession()
        if (!mounted) return

        if (!session) {
          window.location.href = '/admin/login'
          return
        }

        const venuesData = await fetchAllVenues()
        if (mounted) {
          setVenues(venuesData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('データ取得エラー:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  // フォームをリセット
  const resetForm = () => {
    setFormData({
      name: '',
      scale: '',
      capacity: '',
      image_url: ''
    })
    setEditingVenue(null)
    setShowAddForm(false)
  }

  // 追加ボタンクリック
  const handleAddClick = () => {
    resetForm()
    setShowAddForm(true)
  }

  // 編集ボタンクリック
  const handleEditClick = (venue: Venue) => {
    setFormData({
      name: venue.name,
      scale: venue.scale || '',
      capacity: venue.capacity?.toString() || '',
      image_url: venue.image_url || ''
    })
    setEditingVenue(venue)
    setShowAddForm(false)
  }

  // 保存処理
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('会場名を入力してください')
      return
    }

    setIsProcessing(true)
    try {
      const capacity = formData.capacity ? parseInt(formData.capacity) : null
      const scale = formData.scale.trim() || null
      const imageUrl = formData.image_url.trim() || null

      if (editingVenue) {
        // 更新
        const result = await updateVenueAction(
          editingVenue.id,
          formData.name,
          scale,
          capacity,
          imageUrl
        )

        if (result.success) {
          const updatedVenues = await fetchAllVenues()
          setVenues(updatedVenues)
          resetForm()
          alert('会場を更新しました')
        } else {
          alert(result.error || '更新に失敗しました')
        }
      } else {
        // 追加
        const result = await addVenueAction(
          formData.name,
          scale,
          capacity,
          imageUrl
        )

        if (result.success) {
          const updatedVenues = await fetchAllVenues()
          setVenues(updatedVenues)
          resetForm()
          alert('会場を追加しました')
        } else {
          alert(result.error || '追加に失敗しました')
        }
      }
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  // 削除処理
  const handleDelete = async (venue: Venue) => {
    const confirmed = confirm(`会場「${venue.name}」を削除してもよろしいですか？\n\nこの操作は取り消せません。`)
    if (!confirmed) return

    setIsProcessing(true)
    try {
      const result = await deleteVenueAction(venue.id)

      if (result.success) {
        const updatedVenues = await fetchAllVenues()
        setVenues(updatedVenues)
        alert('会場を削除しました')
      } else {
        alert(result.error || '削除に失敗しました')
      }
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6">
      <AdminHeader />

      {/* ヘッダーとボタン */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">会場管理</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded transition-colors disabled:opacity-50"
          disabled={isProcessing}
        >
          + 新規追加
        </button>
      </div>

      {/* 編集・追加フォーム */}
      {(showAddForm || editingVenue) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingVenue ? '会場編集' : '会場追加'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">会場名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="例: 東京ドーム"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">規模</label>
              <input
                type="text"
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="例: ドーム級"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">収容人数</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="例: 55000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">画像URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="例: https://..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? '保存中...' : '保存'}
            </button>
            <button
              onClick={resetForm}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 会場一覧テーブル */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会場名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">規模</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">収容人数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">画像</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {venues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    会場が登録されていません
                  </td>
                </tr>
              ) : (
                venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{venue.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{venue.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{venue.scale || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {venue.capacity ? venue.capacity.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {venue.image_url ? (
                        <img
                          src={venue.image_url}
                          alt={venue.name}
                          className="h-16 w-24 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">画像なし</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(venue)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(venue)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        合計: {venues.length} 件
      </div>
    </main>
  )
}
