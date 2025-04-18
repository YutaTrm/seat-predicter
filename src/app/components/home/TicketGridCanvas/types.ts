import { Ticket } from '@/types/ticket'

export type TicketGridCanvasProps = {
  tickets: Ticket[]
  artistName: string
  tourName: string
}

export type BlockSize = {
  width: number
  height: number
  count: number
}

export type ProcessedData = {
  filteredTickets: Ticket[]
  outliers: number
  outlierTickets: string[]
  validRanges: Record<string, { columns: Set<number>, numbers: Set<number> }>
}

export type OutlierStats = {
  outliers: number
  outlierTickets: string[]
}

export type RowSizes = {
  heights: Record<string, number>
  widths: Record<string, number>
}