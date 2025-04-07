import { Database } from '../../../types/database.types'
import { createServerSupabaseClient, createAdminSupabaseClient, handleAdminError } from '../utils'

// アーティスト一覧を取得
export async function fetchArtists() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('id')

  if (error) {
    console.error('アーティスト取得エラー:', error)
    return []
  }

  return data
}

// アーティストを取得
export async function fetchArtistById(artistId: number) {
  const supabase = await createServerSupabaseClient()
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

// アーティストを追加
export async function addArtist(name: string) {
  try {
    const supabase = createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('artists')
      .insert({ name } as Database['public']['Tables']['artists']['Insert'])
      .select()

    if (error || !data) {
      handleAdminError(error)
    }

    return data![0]
  } catch (error) {
    handleAdminError(error)
  }
}

// アーティストを更新
export async function updateArtist(id: number, name: string) {
  try {
    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .update({ name } as Database['public']['Tables']['artists']['Update'])
      .eq('id', id)

    if (error) {
      handleAdminError(error)
    }

    return true
  } catch (error) {
    handleAdminError(error)
  }
}

// アーティストを削除
export async function deleteArtist(id: number) {
  try {
    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    if (error) {
      handleAdminError(error)
    }

    return true
  } catch (error) {
    handleAdminError(error)
  }
}