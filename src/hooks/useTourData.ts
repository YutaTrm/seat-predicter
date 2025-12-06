import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Tour } from '@/types/ticket'
import { SWR_CACHE_OPTIONS } from '@/constants/swrConfig'

/**
 * ツアーデータを取得・キャッシュするカスタムフック
 * @param artistId - アーティストID
 * @returns ツアーデータと読み込み状態
 */
export const useTourData = (artistId: number | null) => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient()

  // ツアーデータを取得する関数
  const fetchTours = async (): Promise<Tour[]> => {
    if (!artistId) return []

    console.log(`🔄 ツアーデータをリクエスト(aID: ${artistId})`)
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('id')
      .eq('artist_id', artistId)

    if (error) {
      throw error
    }

    return data || []
  }

  // useSWRを使用してデータを取得・キャッシュ
  const { data: tours, error, isLoading } = useSWR(
    artistId ? `tours-${artistId}` : null,
    fetchTours,
    {
      ...SWR_CACHE_OPTIONS,
      onSuccess: () => {
        console.log(`✅ ツアーデータを取得(aID: ${artistId})`)
      },
    }
  )

  return {
    tours: tours || [],
    isLoading,
    error
  }
}