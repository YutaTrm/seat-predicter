'use client'

import { RakutenProduct } from '@/hooks/useRakutenProducts'
import Image from 'next/image'

interface RakutenProductsProps {
  products: RakutenProduct[]
  artistName: string
  isLoading: boolean
}

/**
 * 楽天商品を表示するコンポーネント
 */
export default function RakutenProducts({ products, artistName, isLoading }: RakutenProductsProps) {
  if (isLoading) {
    return (
      <div className="text-center text-gray-400 text-sm py-2">
        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-rose-500 border-t-transparent mr-2" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">{artistName}の関連商品</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-24 hover:opacity-80 transition-opacity"
          >
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.itemName}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-tight">
              {product.itemName}
            </p>
            <p className="text-xs text-rose-500 font-bold">
              ¥{product.itemPrice.toLocaleString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
