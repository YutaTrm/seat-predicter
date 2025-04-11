export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at: string
}

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
      tickets: {
        Row: {
          id: number
          artist_id: number
          tour_id: number
          lottery_slots_id: number
          lottery_slots_name: string
          block: string
          block_number: number
          column: number
          number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          artist_id: number
          tour_id: number
          lottery_slots_id: number
          block: string
          column: number
          number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          artist_id?: number
          tour_id?: number
          lottery_slots_id?: number
          block?: string
          column?: number
          number?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    user_roles: {
      Row: {
        id: string
        user_id: string
        role: 'admin' | 'user'
        created_at: string
      }
      Insert: {
        id?: string
        user_id: string
        role: 'admin' | 'user'
        created_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        role?: 'admin' | 'user'
        created_at?: string
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