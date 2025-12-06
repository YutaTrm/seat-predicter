'use client'

import { Tour } from '../types/admin'
import { deleteWithConfirm, createFormData } from './adminHelpers'

/**
 * ツアーを追加する
 */
export const addTour = async (
  artistId: string,
  name: string,
  endDate: string,
  handleAddTour: (formData: FormData) => Promise<{ tour: Tour }>
): Promise<Tour> => {
  try {
    const { tour } = await handleAddTour(createFormData({ artistId, name, endDate }))
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
  try {
    await handleEditTour(createFormData({ id, name: newName, endDate: newEndDate }))
  } catch (err) {
    console.error('ツアー編集エラー:', err)
    throw new Error('ツアーの編集に失敗しました')
  }
}

/**
 * ツアーを削除する
 */
export const deleteTour = (
  id: number,
  handleDeleteTour: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => deleteWithConfirm(id, 'ツアー', handleDeleteTour)

/**
 * アーティストのツアー一覧を取得する
 */
export const fetchArtistTours = async (
  artistId: string,
  handleFetchTours: (formData: FormData) => Promise<{ tours: Tour[] }>
): Promise<Tour[]> => {
  try {
    const { tours } = await handleFetchTours(createFormData({ artistId }))
    return tours
  } catch (err) {
    console.error('ツアー取得エラー:', err)
    throw new Error('ツアーの取得に失敗しました')
  }
}