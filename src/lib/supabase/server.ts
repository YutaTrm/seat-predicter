import { createServerClient } from '@supabase/ssr'
import type { Database } from '../../types/database.types'

export function createServerSupabaseClient(cookieStore: any) {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle server-side cookie setting error
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options, expires: new Date(0) })
          } catch (error) {
            // Handle server-side cookie deletion error
          }
        },
      },
    }
  )
}

export async function fetchArtists(cookieStore: any) {
  const supabase = createServerSupabaseClient(cookieStore)
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name')

  if (error) {
    console.error('アーティスト取得エラー:', error)
    return []
  }

  return data
}

export async function fetchToursByArtist(cookieStore: any, artistId: number) {
  const supabase = createServerSupabaseClient(cookieStore)
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('artist_id', artistId)
    .order('name')

  if (error) {
    console.error('ツアー取得エラー:', error)
    return []
  }

  return data
}