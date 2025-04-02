'use client'

import { LotterySlot } from '../types/admin'

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

  const formData = new FormData()
  formData.append('artist_id', artistId)
  formData.append('name', name)

  const { lotterySlot } = await handleAddLotterySlot(formData)
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

  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('name', name)

  await handleEditLotterySlot(formData)
}

/**
 * 抽選枠を削除する関数
 */
export const deleteLotterySlot = async (
  id: number,
  handleDeleteLotterySlot: (formData: FormData) => Promise<{ success: boolean }>
) => {
  const confirmed = confirm('この抽選枠を削除してもよろしいですか？')
  if (!confirmed) {
    throw new Error('キャンセルされました')
  }

  const formData = new FormData()
  formData.append('id', id.toString())

  await handleDeleteLotterySlot(formData)
}