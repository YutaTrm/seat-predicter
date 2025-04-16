import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Tour } from '@/types/ticket'

/**
 * ツアーデータを取得・キャッシュするカスタムフック
 * @param supabaseUrl - SupabaseのURL
 * @param supabaseKey - SupabaseのAPIキー
 * @param artistId - アーティストID
 * @returns ツアーデータと読み込み状態
 */
export const useTourData = (supabaseUrl: string, supabaseKey: string, artistId: number | null) => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

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
      // 15分間キャッシュを保持
      dedupingInterval: 15 * 60 * 1000,
      // キャッシュデータを15分間保持
      focusThrottleInterval: 15 * 60 * 1000,
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