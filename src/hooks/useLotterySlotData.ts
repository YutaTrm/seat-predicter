import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { LotterySlot } from '@/types/ticket'

/**
 * 抽選枠データを取得・キャッシュするカスタムフック
 * @param supabaseUrl - SupabaseのURL
 * @param supabaseKey - SupabaseのAPIキー
 * @param artistId - アーティストID
 * @returns 抽選枠データと読み込み状態
 */
export const useLotterySlotData = (supabaseUrl: string, supabaseKey: string, artistId: number | null) => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

  // 抽選枠データを取得する関数
  const fetchLotterySlots = async (): Promise<LotterySlot[]> => {
    if (!artistId) return []

    console.log(`🔄 抽選枠をリクエスト(aID: ${artistId})`)
    const { data, error } = await supabase
      .from('lottery_slots')
      .select('*')
      .eq('artist_id', artistId)
      .order('id')

    if (error) {
      throw error
    }

    return data || []
  }

  // useSWRを使用してデータを取得・キャッシュ
  const { data: lotterySlots, error, isLoading } = useSWR(
    artistId ? `lottery-slots-${artistId}` : null,
    fetchLotterySlots,
    {
      // 15分間キャッシュを保持
      dedupingInterval: 15 * 60 * 1000,
      // キャッシュデータを15分間保持
      focusThrottleInterval: 15 * 60 * 1000,
      onSuccess: () => {
        console.log(`✅ 抽選枠を取得(aID: ${artistId})`)
      },
    }
  )

  return {
    lotterySlots: lotterySlots || [],
    isLoading,
    error
  }
}