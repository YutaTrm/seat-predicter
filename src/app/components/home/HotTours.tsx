'use client'

import { HotTour } from '@/hooks/useHotTours'

interface HotToursProps {
  hotTours: HotTour[]
  onTourClick: (artistId: number, tourId: number) => void
}

/**
 * 直近24時間で投稿が急増しているツアーを表示するコンポーネント
 */
export default function HotTours({ hotTours, onTourClick }: HotToursProps) {
  if (hotTours.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-rose-500 font-bold mb-[-8]">🔥登録急増中</span>
      {hotTours.map((item, index) => (
        <span key={item.tour.id}>
          <button
            onClick={() => onTourClick(item.tour.artist_id, item.tour.id)}
            className="text-rose-500 hover:text-rose-700 underline text-xs"
          >
            {item.tour.name}
          </button>
          <span className="text-gray-500 text-xs">({item.count}件)</span>
          {index < hotTours.length - 1 && <span className="text-gray-400 ml-1">/</span>}
        </span>
      ))}
    </div>
  )
}
