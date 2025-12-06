'use client'

import { LotterySlot } from '../types/admin'
import { deleteWithConfirm, createFormData } from './adminHelpers'

/**
 * 抽選枠を追加する関数
 */
export const addLotterySlot = async (
  artistId: string,
  name: string,
  handleAddLotterySlot: (formData: FormData) => Promise<{ lotterySlot: LotterySlot }>
) => {
  if (!name.trim()) {
    throw new Error('抽選枠名を入力してください')
  }

  const { lotterySlot } = await handleAddLotterySlot(createFormData({ artist_id: artistId, name }))
  return lotterySlot
}

/**
 * 抽選枠を編集する関数
 */
export const editLotterySlot = async (
  id: number,
  name: string,
  handleEditLotterySlot: (formData: FormData) => Promise<{ success: boolean }>
) => {
  if (!name.trim()) {
    throw new Error('抽選枠名を入力してください')
  }

  await handleEditLotterySlot(createFormData({ id, name }))
}

/**
 * 抽選枠を削除する関数
 */
export const deleteLotterySlot = (
  id: number,
  handleDeleteLotterySlot: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => deleteWithConfirm(id, '抽選枠', handleDeleteLotterySlot)