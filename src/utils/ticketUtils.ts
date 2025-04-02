'use client'

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Ticket } from '../types/ticket'

/**
 * URLパラメータを更新する関数
 */
export const updateUrlParams = (
  router: AppRouterInstance,
  artistId: number | null,
  tourId: number | null
) => {
  const params = new URLSearchParams()
  if (artistId) params.set('artist', artistId.toString())
  if (tourId) params.set('tour', tourId.toString())
  router.push(`?${params.toString()}`)
}

/**
 * チケット一覧を取得する関数
 */
export const fetchTickets = async (
  selectedArtist: number,
  selectedTour: number,
  fetchTourTickets: (formData: FormData) => Promise<{ tickets: Ticket[] }>
): Promise<Ticket[]> => {
  const formData = new FormData()
  formData.append('artist_id', selectedArtist.toString())
  formData.append('tour_id', selectedTour.toString())

  const { tickets } = await fetchTourTickets(formData)
  return tickets
}

/**
 * チケットを登録する関数
 */
export const submitTicket = async (
  selectedArtist: number,
  selectedTour: number,
  selectedLotterySlot: number,
  block: string,
  column: number,
  seatNumber: number,
  handleTicketSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
) => {
  const formData = new FormData()
  formData.append('artist_id', selectedArtist.toString())
  formData.append('tour_id', selectedTour.toString())
  formData.append('lottery_slots_id', selectedLotterySlot.toString())
  formData.append('block', block)
  formData.append('column', column.toString())
  formData.append('number', seatNumber.toString())

  return await handleTicketSubmit(formData)
}