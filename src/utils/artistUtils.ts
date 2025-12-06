'use client'

import { Artist } from '../types/admin'
import { deleteWithConfirm, createFormData } from './adminHelpers'

/**
 * アーティストを追加する
 */
export const addArtist = async (
  name: string,
  handleAddArtist: (formData: FormData) => Promise<{ artist: Artist }>
): Promise<Artist> => {
  try {
    const { artist } = await handleAddArtist(createFormData({ name }))
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
  try {
    await handleEditArtist(createFormData({ id, name: newName }))
  } catch (err) {
    console.error('アーティスト編集エラー:', err)
    throw new Error('アーティストの編集に失敗しました')
  }
}

/**
 * アーティストを削除する
 */
export const deleteArtist = (
  id: number,
  handleDeleteArtist: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => deleteWithConfirm(id, 'アーティスト', handleDeleteArtist)