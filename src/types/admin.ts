import type { Database } from './database.types'

export type Artist = Database['public']['Tables']['artists']['Row']
export type Tour = Database['public']['Tables']['tours']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type LotterySlot = Database['public']['Tables']['lottery_slots']['Row']

export type AdminPageProps = {
  initialArtists: Artist[]
  initialTours: Tour[]
  initialTickets: Ticket[]
  initialLotterySlots: LotterySlot[]
  handleAddArtist: (formData: FormData) => Promise<{ artist: Artist }>
  handleEditArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteArtist: (formData: FormData) => Promise<{ success: boolean }>
  handleAddTour: (formData: FormData) => Promise<{ tour: Tour }>
  handleFetchTours: (formData: FormData) => Promise<{ tours: Tour[] }>
  handleEditTour: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteTour: (formData: FormData) => Promise<{ success: boolean }>
  handleAddLotterySlot: (formData: FormData) => Promise<{ lotterySlot: LotterySlot }>
  handleFetchLotterySlots: (formData: FormData) => Promise<{ lotterySlots: LotterySlot[] }>
  handleEditLotterySlot: (formData: FormData) => Promise<{ success: boolean }>
  handleDeleteLotterySlot: (formData: FormData) => Promise<{ success: boolean }>
  handleFetchTickets: (formData: FormData) => Promise<{ tickets: Ticket[] }>
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

export type LotterySlotSectionProps = {
  artists: Artist[]
  lotterySlots: LotterySlot[]
  selectedArtistId: string
  onArtistSelect: (artistId: string) => void
  onLotterySlotAdd: (lotterySlot: LotterySlot) => void
  onLotterySlotEdit: (id: number, newName: string) => void
  onLotterySlotDelete: (id: number) => void
  handleAddLotterySlot: AdminPageProps['handleAddLotterySlot']
  handleEditLotterySlot: AdminPageProps['handleEditLotterySlot']
  handleDeleteLotterySlot: AdminPageProps['handleDeleteLotterySlot']
}

export type TicketSectionProps = {
  artists: Artist[]
  tours: Tour[]
  tickets: Ticket[]
  selectedArtistId: string
  selectedTourId: string
  onTourSelect: (tourId: string) => void
}