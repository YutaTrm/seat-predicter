import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '../../types/database.types'

// Supabaseの認証情報を取得
export function getSupabaseCredentials() {
  return {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  }
}

// 通常のサーバーサイドのSupabaseクライアントを作成
async function createServerSupabaseClient() {
  const cookieStore = cookies()
  const cookieString = await Promise.resolve(cookieStore.toString())
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      },
      global: {
        headers: {
          Cookie: cookieString
        }
      }
    }
  )
}

// 管理者用のサーバーサイドのSupabaseクライアントを作成
async function createAdminSupabaseClient() {
  const session = await getSession()
  if (!session) {
    throw new Error('認証が必要です')
  }

  // 管理者権限チェック
  const supabase = await createServerSupabaseClient()
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (!roles || roles.role !== 'admin') {
    throw new Error('管理者権限が必要です')
  }

  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// 現在のセッションを取得
export async function getSession() {
  const supabase = await createServerSupabaseClient()
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

export async function fetchLotterySlots(artistId: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('lottery_slots')
    .select('*')
    .eq('artist_id', artistId)
    .order('id')

  if (error) {
    console.error('抽選枠取得エラー:', error)
    return []
  }

  return data
}

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

export async function fetchTickets(artistId: number, tourId: number) {
  const supabase = await createServerSupabaseClient()
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
    const supabase = await createServerSupabaseClient()
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
  try {
    const supabase = await createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('artists')
      .insert({ name } as Database['public']['Tables']['artists']['Insert'])
      .select()

    if (error) {
      // 本番環境ではエラー詳細をログサービスに送信
      console.error('Admin operation error:', error)
      // クライアントには一般的なメッセージを返す
      throw new Error('操作に失敗しました')
    }

    return data[0]
  } catch (error) {
    // エラーの種類に応じて適切なメッセージを返す
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function updateArtist(id: number, name: string) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .update({ name } as Database['public']['Tables']['artists']['Update'])
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function deleteArtist(id: number) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function addTour(artistId: number, name: string) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({
        artist_id: artistId,
        name
      } as Database['public']['Tables']['tours']['Insert'])
      .select()

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return data[0]
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function updateTour(id: number, name: string) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .update({ name } as Database['public']['Tables']['tours']['Update'])
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function deleteTour(id: number) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function addLotterySlot(artistId: number, name: string) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('lottery_slots')
      .insert({
        artist_id: artistId,
        name
      } as Database['public']['Tables']['lottery_slots']['Insert'])
      .select()

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return data[0]
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function updateLotterySlot(id: number, name: string) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('lottery_slots')
      .update({ name } as Database['public']['Tables']['lottery_slots']['Update'])
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}

export async function deleteLotterySlot(id: number) {
  try {
    const supabase = await createAdminSupabaseClient()
    const { error } = await supabase
      .from('lottery_slots')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Admin operation error:', error)
      throw new Error('操作に失敗しました')
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '認証が必要です' ||
          error.message === '管理者権限が必要です') {
        throw error
      }
    }
    throw new Error('操作に失敗しました')
  }
}