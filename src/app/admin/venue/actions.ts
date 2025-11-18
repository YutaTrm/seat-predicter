'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Venue = {
  id: number
  name: string
  scale: string | null
  capacity: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

/**
 * 全ての会場を取得
 */
export async function fetchAllVenues(): Promise<Venue[]> {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('会場取得エラー:', error)
    return []
  }

  return data || []
}

/**
 * 会場を追加
 */
export async function addVenueAction(
  name: string,
  scale: string | null,
  capacity: number | null,
  imageUrl: string | null
): Promise<{ success: boolean; error?: string; venue?: Venue }> {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('venues')
      .insert({
        name,
        scale,
        capacity,
        image_url: imageUrl
      })
      .select()
      .single()

    if (error) {
      console.error('会場追加エラー:', error)
      return { success: false, error: '会場の追加に失敗しました' }
    }

    revalidatePath('/admin/venue')
    return { success: true, venue: data }
  } catch (error) {
    console.error('会場追加エラー:', error)
    return { success: false, error: '会場の追加に失敗しました' }
  }
}

/**
 * 会場を更新
 */
export async function updateVenueAction(
  id: number,
  name: string,
  scale: string | null,
  capacity: number | null,
  imageUrl: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from('venues')
      .update({
        name,
        scale,
        capacity,
        image_url: imageUrl
      })
      .eq('id', id)

    if (error) {
      console.error('会場更新エラー:', error)
      return { success: false, error: '会場の更新に失敗しました' }
    }

    revalidatePath('/admin/venue')
    return { success: true }
  } catch (error) {
    console.error('会場更新エラー:', error)
    return { success: false, error: '会場の更新に失敗しました' }
  }
}

/**
 * 会場を削除
 */
export async function deleteVenueAction(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('会場削除エラー:', error)
      return { success: false, error: '会場の削除に失敗しました' }
    }

    revalidatePath('/admin/venue')
    return { success: true }
  } catch (error) {
    console.error('会場削除エラー:', error)
    return { success: false, error: '会場の削除に失敗しました' }
  }
}
