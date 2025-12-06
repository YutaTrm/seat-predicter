import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Artist } from '@/types/ticket'
import { SWR_CACHE_OPTIONS } from '@/constants/swrConfig'

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
      ...SWR_CACHE_OPTIONS,
      onSuccess: () => {
        console.log('✅ アーティストデータを取得')
      },
    }
  )

  return {
    artists: artists || [],
    isLoading,
    error
  }
}