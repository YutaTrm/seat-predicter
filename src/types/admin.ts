import type { Database } from './database.types'

export type Artist = Database['public']['Tables']['artists']['Row']
export type Tour = Database['public']['Tables']['tours']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']

export type AdminPageProps = {
  initialArtists: Artist[]
  initialTours: Tour[]
  initialTickets: Ticket[]
  handleAddArtist: (formData: FormData) => Promise<{ artist: Artist }>
  handleEditArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleAddTour: (formData: FormData) => Promise<{ tour: Tour }>
  handleFetchTours: (formData: FormData) => Promise<{ tours: Tour[] }>
  handleEditTour: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteTour: (formData: FormData) => Promise<{ success: boolean }>
}

export type ArtistSectionProps = {
  artists: Artist[]
  onArtistAdd: (artist: Artist) => void
  onArtistEdit: (id: number, newName: string) => void
  onArtistDelete: (id: number) => void
  handleAddArtist: AdminPageProps['handleAddArtist']
  handleEditArtist: AdminPageProps['handleEditArtist']
  handleDeleteArtist: AdminPageProps['handleDeleteArtist']
}

export type TourSectionProps = {
  artists: Artist[]
  tours: Tour[]
  selectedArtistId: string
  onArtistSelect: (artistId: string) => void
  onTourAdd: (tour: Tour) => void
  onTourEdit: (id: number, newName: string) => void
  onTourDelete: (id: number) => void
  handleAddTour: AdminPageProps['handleAddTour']
  handleEditTour: AdminPageProps['handleEditTour']
  handleDeleteTour: AdminPageProps['handleDeleteTour']
}

export type TicketSectionProps = {
  artists: Artist[]
  tours: Tour[]
  tickets: Ticket[]
  selectedArtistId: string
  selectedTourId: string
  onTourSelect: (tourId: string) => void
}