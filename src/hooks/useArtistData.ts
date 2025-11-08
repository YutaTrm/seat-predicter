import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Artist } from '@/types/ticket'

/**
 * アーティストデータを取得・キャッシュするカスタムフック
 * @returns アーティストデータと読み込み状態
 */
export const useArtistData = () => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient()

  // アーティストデータを取得する関数
  const fetchArtists = async (): Promise<Artist[]> => {
    console.log('🔄 アーティストデータをリクエスト')
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('id')

    if (error) {
      throw error
    }

    return data || []
  }

  // useSWRを使用してデータを取得・キャッシュ
  const { data: artists, error, isLoading } = useSWR(
    'artists',
    fetchArtists,
    {
      // 15分間キャッシュを保持
      dedupingInterval: 15 * 60 * 1000,
      onSuccess: () => {
        console.log('✅ アーティストデータを取得')
      },
      // キャッシュデータを15分間保持
      focusThrottleInterval: 15 * 60 * 1000,
    }
  )

  return {
    artists: artists || [],
    isLoading,
    error
  }
}