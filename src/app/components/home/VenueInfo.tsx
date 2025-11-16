import { Database } from '@/types/database.types'

type Venue = Database['public']['Tables']['venues']['Row']

interface VenueInfoProps {
  venue: Venue
}

/**
 * 会場情報を表示するコンポーネント
 */
export default function VenueInfo({ venue }: VenueInfoProps) {
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
          <a href={venue.image_url} target="_blank" rel="noopener noreferrer">
            <img
              src={venue.image_url}
              alt={`${venue.name}の図`}
              className="w-full h-auto object-contain cursor-pointer"
            />
          </a>
          <a
            href="https://livekiti.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rose-500 text-right"
          >
            ©ライブ基地
          </a>
        </div>
      )}
    </div>
  )
}
