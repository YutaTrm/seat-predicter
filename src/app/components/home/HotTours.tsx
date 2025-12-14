'use client'

import { HotTour } from '@/hooks/useHotTours'
import { useLanguage } from '@/contexts/LanguageContext'

interface HotToursProps {
  hotTours: HotTour[]
  onTourClick: (artistId: number, tourId: number) => void
}

/**
 * 直近24時間で投稿が急増しているツアーを表示するコンポーネント
 */
export default function HotTours({ hotTours, onTourClick }: HotToursProps) {
  const { t } = useLanguage()

  if (hotTours.length === 0) {
    return null
  }

  return (
    <div className="text-sm">
      <div className="text-rose-500 font-bold">{t('home.hotTours')}</div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0 -mt-1">
        {hotTours.map((item) => (
          <span key={item.tour.id}>
            <button
              onClick={() => onTourClick(item.tour.artist_id, item.tour.id)}
              className="text-rose-500 hover:text-rose-700 underline text-xs"
            >
              {item.tour.name}
            </button>
            <span className="text-gray-500 text-xs">{t('home.hotToursCount').replace('{count}', String(item.count))}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
