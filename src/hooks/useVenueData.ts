import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { SWR_CACHE_OPTIONS } from '@/constants/swrConfig'

type Venue = Database['public']['Tables']['venues']['Row']

/**
 * 会場データを取得・キャッシュするカスタムフック
 * @param venueId - 会場ID
 * @returns 会場データと読み込み状態
 */
export const useVenueData = (venueId: number | null) => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient()

  // 会場データを取得する関数
  const fetchVenue = async (): Promise<Venue | null> => {
    if (!venueId) return null

    console.log(`🔄 会場データをリクエスト(vID: ${venueId})`)
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single()

    if (error) {
      throw error
    }

    return data || null
  }

  // useSWRを使用してデータを取得・キャッシュ
  const { data: venue, error, isLoading } = useSWR(
    venueId ? `venue-${venueId}` : null,
    fetchVenue,
    {
      ...SWR_CACHE_OPTIONS,
      onSuccess: () => {
        console.log(`✅ 会場データを取得(vID: ${venueId})`)
      },
    }
  )

  return {
    venue: venue || null,
    isLoading,
    error
  }
}
