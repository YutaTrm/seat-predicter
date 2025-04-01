import HomePage from './components/HomePage'
import { createTicket, fetchArtists, fetchTickets, fetchToursByArtist } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// チケット登録のServer Action
async function handleTicketSubmit(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))
  const tourId = Number(formData.get('tour_id'))
  const block = formData.get('block') as string
  const column = Number(formData.get('column'))
  const number = Number(formData.get('number'))

  try {
    await createTicket({
      artist_id: artistId,
      tour_id: tourId,
      block,
      column,
      number
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'チケットの登録に失敗しました' }
  }
}

// ツアーのチケット一覧を取得するServer Action
async function fetchTourTickets(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))
  const tourId = Number(formData.get('tour_id'))

  const tickets = await fetchTickets(artistId, tourId)
  return { tickets }
}

// ツアー一覧を取得するServer Action
async function fetchTours(formData: FormData) {
  'use server'

  const artistId = Number(formData.get('artist_id'))

  const tours = await fetchToursByArtist(artistId)
  return { tours }
}

export default async function Page() {
  const artists = await fetchArtists()

  if (!artists.length) {
    return <div>アーティスト情報の読み込みに失敗しました</div>
  }

  return (
    <HomePage
      artists={artists}
      handleTicketSubmit={handleTicketSubmit}
      fetchTourTickets={fetchTourTickets}
      fetchTours={fetchTours}
    />
  )
}
