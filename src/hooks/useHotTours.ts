import useSWR from 'swr'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Tour } from '@/types/ticket'
import { SWR_CACHE_OPTIONS } from '@/constants/swrConfig'

/** ホットなツアー情報 */
export interface HotTour {
  tour: Tour
  count: number
}

/** 直近24時間で50件以上の投稿があるツアーを判定する閾値 */
const HOT_THRESHOLD = 50

/**
 * 直近24時間で投稿数が多いツアーを取得するカスタムフック
 * @returns ホットなツアーデータと読み込み状態
 */
export const useHotTours = () => {
  const supabase = createSupabaseClient()

  const fetchHotTours = async (): Promise<HotTour[]> => {
    // 24時間前の日時を計算
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const isoString = twentyFourHoursAgo.toISOString()

    // 直近24時間のチケットを取得
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('tour_id')
      .gte('created_at', isoString)

    if (ticketError) {
      throw ticketError
    }

    if (!ticketData || ticketData.length === 0) {
      return []
    }

    // tour_idごとにカウント
    const countByTour = ticketData.reduce<Record<number, number>>((acc, ticket) => {
      acc[ticket.tour_id] = (acc[ticket.tour_id] || 0) + 1
      return acc
    }, {})

    // 50件以上のツアーIDを抽出
    const hotTourIds = Object.entries(countByTour)
      .filter(([, count]) => count >= HOT_THRESHOLD)
      .map(([tourId]) => Number(tourId))

    if (hotTourIds.length === 0) {
      return []
    }

    // 該当ツアーの情報を取得
    const { data: tourData, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .in('id', hotTourIds)

    if (tourError) {
      throw tourError
    }

    // ホットなツアーを件数順でソート
    const hotTours: HotTour[] = (tourData || [])
      .map(tour => ({
        tour: tour as Tour,
        count: countByTour[tour.id]
      }))
      .sort((a, b) => b.count - a.count)

    return hotTours
  }

  const { data: hotTours, error, isLoading } = useSWR(
    'hotTours',
    fetchHotTours,
    {
      ...SWR_CACHE_OPTIONS,
      revalidateOnFocus: false,
    }
  )

  return {
    hotTours: hotTours || [],
    isLoading,
    error
  }
}
