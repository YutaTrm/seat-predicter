'use client'

import { Artist } from '../types/admin'

/**
 * アーティストを追加する
 */
export const addArtist = async (
  name: string,
  handleAddArtist: (formData: FormData) => Promise<{ artist: Artist }>
): Promise<Artist> => {
  const formData = new FormData()
  formData.append('name', name)

  try {
    const { artist } = await handleAddArtist(formData)
    return artist
  } catch (err) {
    console.error('アーティスト追加エラー:', err)
    throw new Error('アーティストの追加に失敗しました')
  }
}

/**
 * アーティストを編集する
 */
export const editArtist = async (
  id: number,
  newName: string,
  handleEditArtist: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => {
  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('name', newName)

  try {
    await handleEditArtist(formData)
  } catch (err) {
    console.error('アーティスト編集エラー:', err)
    throw new Error('アーティストの編集に失敗しました')
  }
}

/**
 * アーティストを削除する
 */
export const deleteArtist = async (
  id: number,
  handleDeleteArtist: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => {
  if (!confirm('このアーティストを削除してもよろしいですか？')) {
    throw new Error('キャンセルされました')
  }

  const formData = new FormData()
  formData.append('id', id.toString())

  try {
    await handleDeleteArtist(formData)
  } catch (err) {
    console.error('アーティスト削除エラー:', err)
    throw new Error('アーティストの削除に失敗しました')
  }
}