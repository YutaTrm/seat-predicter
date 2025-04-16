export const dynamic = 'force-dynamic'

import AdminPage from '@/app/components/AdminPage'
import { Suspense } from 'react'
import {
  fetchArtists,
  fetchToursByArtist,
  fetchTickets,
  fetchLotterySlots,
  addArtist,
  updateArtist,
  deleteArtist,
  addTour,
  updateTour,
  deleteTour,
  addLotterySlot,
  updateLotterySlot,
  deleteLotterySlot
} from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Tour, Ticket, LotterySlot } from '@/types/admin'

// アーティスト追加のServer Action
async function handleAddArtist(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const artist = await addArtist(name)
  revalidatePath('/admin')
  return { artist }
}

// アーティスト編集のServer Action
async function handleEditArtist(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  const name = formData.get('name') as string
  await updateArtist(id, name)
  revalidatePath('/admin')
  return { success: true }
}

// アーティスト削除のServer Action
async function handleDeleteArtist(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  await deleteArtist(id)
  revalidatePath('/admin')
  return { success: true }
}

// ツアー追加のServer Action
async function handleAddTour(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artistId'))
  const name = formData.get('name') as string
  const endDate = formData.get('endDate') as string
  const tour = await addTour(artistId, name, endDate)
  revalidatePath('/admin')
  return { tour }
}

// ツアー編集のServer Action
async function handleEditTour(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  const name = formData.get('name') as string
  await updateTour(id, name)
  revalidatePath('/admin')
  return { success: true }
}

// ツアー削除のServer Action
async function handleDeleteTour(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  await deleteTour(id)
  revalidatePath('/admin')
  return { success: true }
}

// ツアー一覧を取得するServer Action
async function handleFetchTours(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artistId'))
  const tours = await fetchToursByArtist(artistId)
  return { tours }
}

// 抽選枠追加のServer Action
async function handleAddLotterySlot(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))
  const name = formData.get('name') as string
  const lotterySlot = await addLotterySlot(artistId, name)
  revalidatePath('/admin')
  return { lotterySlot }
}

// 抽選枠編集のServer Action
async function handleEditLotterySlot(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  const name = formData.get('name') as string
  await updateLotterySlot(id, name)
  revalidatePath('/admin')
  return { success: true }
}

// 抽選枠削除のServer Action
async function handleDeleteLotterySlot(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  await deleteLotterySlot(id)
  revalidatePath('/admin')
  return { success: true }
}

// 抽選枠一覧を取得するServer Action
async function handleFetchLotterySlots(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))
  const lotterySlots = await fetchLotterySlots(artistId)
  return { lotterySlots }
}

// チケット一覧を取得するServer Action
async function handleFetchTickets(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))
  const tourId = Number(formData.get('tour_id'))
  const tickets = await fetchTickets(artistId, tourId)
  return { tickets }
}

export default async function Page() {
  // 初期データの取得
  const artists = await fetchArtists()
  const tours: Tour[] = []
  const tickets: Ticket[] = []
  const lotterySlots: LotterySlot[] = []

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">読み込み中...</h1>
        </div>
      </div>
    }>
      <AdminPage
        initialArtists={artists}
        initialTours={tours}
        initialTickets={tickets}
        initialLotterySlots={lotterySlots}
        handleAddArtist={handleAddArtist}
        handleEditArtist={handleEditArtist}
        handleDeleteArtist={handleDeleteArtist}
        handleAddTour={handleAddTour}
        handleEditTour={handleEditTour}
        handleDeleteTour={handleDeleteTour}
        handleFetchTours={handleFetchTours}
        handleAddLotterySlot={handleAddLotterySlot}
        handleEditLotterySlot={handleEditLotterySlot}
        handleDeleteLotterySlot={handleDeleteLotterySlot}
        handleFetchLotterySlots={handleFetchLotterySlots}
        handleFetchTickets={handleFetchTickets}
      />
    </Suspense>
  )
}