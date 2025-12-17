'use client'

import { RakutenProduct } from '@/hooks/useRakutenProducts'
import Image from 'next/image'

interface RakutenProductsProps {
  products: RakutenProduct[]
  artistName: string
  searchKeyword: string
  isLoading: boolean
}

/**
 * 楽天商品を表示するコンポーネント
 */
export default function RakutenProducts({ products, artistName, searchKeyword, isLoading }: RakutenProductsProps) {
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

  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(searchKeyword)}/`
  const rakutenSearchUrl = `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(searchUrl)}`

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-500">{artistName}の関連商品</p>
        <a
          href={rakutenSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-rose-500"
        >
          もっと見る →
        </a>
      </div>
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
