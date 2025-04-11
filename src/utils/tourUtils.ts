'use client'

import { Tour } from '../types/admin'

/**
 * ツアーを追加する
 */
export const addTour = async (
  artistId: string,
  name: string,
  endDate: string,
  handleAddTour: (formData: FormData) => Promise<{ tour: Tour }>
): Promise<Tour> => {
  const formData = new FormData()
  formData.append('artistId', artistId)
  formData.append('name', name)
  formData.append('endDate', endDate)

  try {
    const { tour } = await handleAddTour(formData)
    return tour
  } catch (err) {
    console.error('ツアー追加エラー:', err)
    throw new Error('ツアーの追加に失敗しました')
  }
}

/**
 * ツアーを編集する
 */
export const editTour = async (
  id: number,
  newName: string,
  newEndDate: string,
  handleEditTour: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => {
  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('name', newName)
  formData.append('endDate', newEndDate)

  try {
    await handleEditTour(formData)
  } catch (err) {
    console.error('ツアー編集エラー:', err)
    throw new Error('ツアーの編集に失敗しました')
  }
}

/**
 * ツアーを削除する
 */
export const deleteTour = async (
  id: number,
  handleDeleteTour: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => {
  if (!confirm('このツアーを削除してもよろしいですか？')) {
    throw new Error('キャンセルされました')
  }

  const formData = new FormData()
  formData.append('id', id.toString())

  try {
    await handleDeleteTour(formData)
  } catch (err) {
    console.error('ツアー削除エラー:', err)
    throw new Error('ツアーの削除に失敗しました')
  }
}

/**
 * アーティストのツアー一覧を取得する
 */
export const fetchArtistTours = async (
  artistId: string,
  handleFetchTours: (formData: FormData) => Promise<{ tours: Tour[] }>
): Promise<Tour[]> => {
  const formData = new FormData()
  formData.append('artistId', artistId)

  try {
    const { tours } = await handleFetchTours(formData)
    return tours
  } catch (err) {
    console.error('ツアー取得エラー:', err)
    throw new Error('ツアーの取得に失敗しました')
  }
}