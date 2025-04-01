import AdminPage from '@/app/components/AdminPage'
import { Suspense } from 'react'
import {
  fetchArtists,
  fetchToursByArtist,
  fetchTickets,
  addArtist,
  updateArtist,
  deleteArtist,
  addTour,
  updateTour,
  deleteTour
} from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  const tour = await addTour(artistId, name)
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

export default async function Page() {
  // 初期データの取得
  const artists = await fetchArtists()
  const tours = artists.length > 0 ? await fetchToursByArtist(artists[0].id) : []
  const tickets = tours.length > 0 ? await fetchTickets(artists[0].id, tours[0].id) : []

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
        handleAddArtist={handleAddArtist}
        handleEditArtist={handleEditArtist}
        handleDeleteArtist={handleDeleteArtist}
        handleAddTour={handleAddTour}
        handleEditTour={handleEditTour}
        handleDeleteTour={handleDeleteTour}
        handleFetchTours={handleFetchTours}
      />
    </Suspense>
  )
}