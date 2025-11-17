'use client'

import { useState } from 'react'
import { Database } from '@/types/database.types'
import Icon from '@/app/components/common/Icon'

type Venue = Database['public']['Tables']['venues']['Row']

interface VenueInfoProps {
  venue: Venue
}

/**
 * 会場情報を表示するコンポーネント
 */
export default function VenueInfo({ venue }: VenueInfoProps) {
  const [rotation, setRotation] = useState(0)

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      {/* 上：会場情報 */}
      <div className="">
        <h3 className="text-lg font-semibold text-rose-500 mb-1">{venue.name}</h3>
        <div className='flex gap-4'>
          {venue.scale && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-gray-400">規模：</span>{venue.scale}
            </p>
          )}
          {venue.capacity && (
            <p className="text-sm text-gray-600">
              <span className="text-gray-400">収容人数：</span>約{venue.capacity.toLocaleString()}人
            </p>
          )}
        </div>
      </div>

      {/* 下：画像 */}
      {venue.image_url && (
        <div className="flex flex-col mt-2">
          <a href={venue.image_url} target="_blank" rel="noopener noreferrer" className="w-full aspect-square overflow-hidden flex items-center justify-center bg-white">
            <img
              src={venue.image_url}
              alt={`${venue.name}の図`}
              className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </a>
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={handleRotate}
              className="bg-white hover:bg-rose-100 text-rose-500 p-1 rounded border border-rose-500 transition-colors"
              title="画像を90度回転"
            >
              <Icon type="rotate" />
            </button>
            <a
              href="https://livekiti.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-rose-500"
            >
              画像元: ライブ基地
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
