export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          id: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      lottery_slots: {
        Row: {
          id: number
          artist_id: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          artist_id: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          artist_id?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: number
          artist_id: number
          name: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          artist_id: number
          name: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          artist_id?: number
          name?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: number
          artist_id: number
          tour_id: number
          lottery_slots_id: number
          block: string
          block_number: number
          column: number
          number: number
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          artist_id: number
          tour_id: number
          lottery_slots_id: number
          block: string
          block_number: number
          column: number
          number: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          artist_id?: number
          tour_id?: number
          lottery_slots_id?: number
          block?: string
          block_number?: number
          column?: number
          number?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}