export type Ticket = {
  id: number
  artist_id: number
  tour_id: number
  block: string
  column: number
  number: number
  created_at: string
}

export type Artist = {
  id: number
  name: string
}

export type Tour = {
  id: number
  artist_id: number
  name: string
}

export type HomePageProps = {
  artists: Artist[]
  handleTicketSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  fetchTourTickets: (formData: FormData) => Promise<{ tickets: Ticket[] }>
  fetchTours: (formData: FormData) => Promise<{ tours: Tour[] }>
}