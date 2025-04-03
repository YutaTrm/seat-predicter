import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '../../types/database.types'
// サーバーサイドのSupabaseクライアントを作成
function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    }
  )
}

// 現在のセッションを取得
export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('セッション取得エラー:', error)
    return null
  }
  return session
}

// 認証を必要とする関数のラッパー
export async function requireAuth<T>(
  callback: () => Promise<T>
): Promise<T> {
  const session = await getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }
  return callback()
}

export async function fetchArtists() {
  const supabase = createServerSupabaseClient()
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

export async function fetchToursByArtist(artistId: number) {
  const supabase = createServerSupabaseClient()
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

export async function fetchLotterySlots(artistId: number) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('lottery_slots')
    .select('*')
    .eq('artist_id', artistId)
    .order('name')

  if (error) {
    console.error('抽選枠取得エラー:', error)
    return []
  }

  return data
}

export async function fetchArtistById(artistId: number) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', artistId)
    .single()

  if (error) {
    console.error('アーティスト取得エラー:', error)
    return null
  }

  return data
}

export async function fetchTourById(tourId: number, artistId: number) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', tourId)
    .eq('artist_id', artistId)
    .single()

  if (error) {
    console.error('ツアー取得エラー:', error)
    return null
  }

  return data
}

export async function fetchTickets(artistId: number, tourId: number) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      lottery_slots (
        name
      )
    `)
    .eq('artist_id', artistId)
    .eq('tour_id', tourId)
    .order('block')
    .order('column')
    .order('number')

  if (error) {
    console.error('チケット取得エラー:', error)
    return []
  }

  return data
}

export async function createTicket(ticket: Database['public']['Tables']['tickets']['Insert']) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('tickets')
      .insert(ticket)

    if (error) {
      console.error('チケット登録エラー:', error)
      throw new Error('チケットの登録に失敗しました')
    }

    return true
  })
}

// 管理者用の関数
export async function addArtist(name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('artists')
      .insert({ name } as Database['public']['Tables']['artists']['Insert'])
      .select()

    if (error) {
      console.error('アーティスト追加エラー:', error)
      throw new Error('アーティストの追加に失敗しました')
    }

    return data[0]
  })
}

export async function updateArtist(id: number, name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .update({ name } as Database['public']['Tables']['artists']['Update'])
      .eq('id', id)

    if (error) {
      console.error('アーティスト編集エラー:', error)
      throw new Error('アーティストの編集に失敗しました')
    }

    return true
  })
}

export async function deleteArtist(id: number) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('アーティスト削除エラー:', error)
      throw new Error('アーティストの削除に失敗しました')
    }

    return true
  })
}

export async function addTour(artistId: number, name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({
        artist_id: artistId,
        name
      } as Database['public']['Tables']['tours']['Insert'])
      .select()

    if (error) {
      console.error('ツアー追加エラー:', error)
      throw new Error('ツアーの追加に失敗しました')
    }

    return data[0]
  })
}

export async function updateTour(id: number, name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .update({ name } as Database['public']['Tables']['tours']['Update'])
      .eq('id', id)

    if (error) {
      console.error('ツアー編集エラー:', error)
      throw new Error('ツアーの編集に失敗しました')
    }

    return true
  })
}

export async function deleteTour(id: number) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('ツアー削除エラー:', error)
      throw new Error('ツアーの削除に失敗しました')
    }

    return true
  })
}

export async function addLotterySlot(artistId: number, name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('lottery_slots')
      .insert({
        artist_id: artistId,
        name
      } as Database['public']['Tables']['lottery_slots']['Insert'])
      .select()

    if (error) {
      console.error('抽選枠追加エラー:', error)
      throw new Error('抽選枠の追加に失敗しました')
    }

    return data[0]
  })
}

export async function updateLotterySlot(id: number, name: string) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('lottery_slots')
      .update({ name } as Database['public']['Tables']['lottery_slots']['Update'])
      .eq('id', id)

    if (error) {
      console.error('抽選枠編集エラー:', error)
      throw new Error('抽選枠の編集に失敗しました')
    }

    return true
  })
}

export async function deleteLotterySlot(id: number) {
  return requireAuth(async () => {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('lottery_slots')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('抽選枠削除エラー:', error)
      throw new Error('抽選枠の削除に失敗しました')
    }

    return true
  })
}