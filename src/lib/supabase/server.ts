import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database.types'

// サーバーサイドのSupabaseクライアントを作成
function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
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
    .select('*')
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

export async function createTicket(ticket: {
  artist_id: number
  tour_id: number
  block: string
  column: number
  number: number
}) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('tickets').insert(ticket)

  if (error) {
    console.error('チケット登録エラー:', error)
    throw new Error('チケットの登録に失敗しました')
  }

  return true
}

// 管理者用の関数
export async function addArtist(name: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('artists')
    .insert({ name })
    .select()

  if (error) {
    console.error('アーティスト追加エラー:', error)
    throw new Error('アーティストの追加に失敗しました')
  }

  return data[0]
}

export async function updateArtist(id: number, name: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('artists')
    .update({ name })
    .eq('id', id)

  if (error) {
    console.error('アーティスト編集エラー:', error)
    throw new Error('アーティストの編集に失敗しました')
  }

  return true
}

export async function deleteArtist(id: number) {
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
}

export async function addTour(artistId: number, name: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours')
    .insert({
      artist_id: artistId,
      name
    })
    .select()

  if (error) {
    console.error('ツアー追加エラー:', error)
    throw new Error('ツアーの追加に失敗しました')
  }

  return data[0]
}

export async function updateTour(id: number, name: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('tours')
    .update({ name })
    .eq('id', id)

  if (error) {
    console.error('ツアー編集エラー:', error)
    throw new Error('ツアーの編集に失敗しました')
  }

  return true
}

export async function deleteTour(id: number) {
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
}