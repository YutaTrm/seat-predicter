import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { LotterySlot } from '@/types/ticket'
import { SWR_CACHE_OPTIONS } from '@/constants/swrConfig'

/**
 * 抽選枠データを取得・キャッシュするカスタムフック
 * @param artistId - アーティストID
 * @returns 抽選枠データと読み込み状態
 */
export const useLotterySlotData = (artistId: number | null) => {
  // Supabaseクライアントを初期化
  const supabase = createSupabaseClient()

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
      ...SWR_CACHE_OPTIONS,
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