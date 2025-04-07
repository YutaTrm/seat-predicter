import { Database } from '../../../types/database.types'
import { createServerSupabaseClient, createAdminSupabaseClient, handleAdminError } from '../utils'

// ツアー一覧を取得
export async function fetchToursByArtist(artistId: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('artist_id', artistId)
    .order('id')

  if (error) {
    console.error('ツアー取得エラー:', error)
    return []
  }

  return data
}

// ツアーを取得
export async function fetchTourById(tourId: number, artistId: number) {
  const supabase = await createServerSupabaseClient()
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

// ツアーを追加
export async function addTour(artistId: number, name: string) {
  try {
    const supabase = createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({
        artist_id: artistId,
        name
      } as Database['public']['Tables']['tours']['Insert'])
      .select()

    if (error || !data) {
      handleAdminError(error)
    }

    return data![0]
  } catch (error) {
    handleAdminError(error)
  }
}

// ツアーを更新
export async function updateTour(id: number, name: string) {
  try {
    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .update({ name } as Database['public']['Tables']['tours']['Update'])
      .eq('id', id)

    if (error) {
      handleAdminError(error)
    }

    return true
  } catch (error) {
    handleAdminError(error)
  }
}

// ツアーを削除
export async function deleteTour(id: number) {
  try {
    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
      .from('tours')
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