import { createServerClient } from '@supabase/ssr'
import type { Database } from '../../types/database.types'

// 必要な機能のみを持つインターフェースを定義
interface CookieStore {
  get(name: string): { value: string } | undefined
}

export function createServerSupabaseClient(cookieStore: CookieStore) {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )
}

export async function fetchArtists(cookieStore: CookieStore) {
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

export async function fetchToursByArtist(cookieStore: CookieStore, artistId: number) {
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