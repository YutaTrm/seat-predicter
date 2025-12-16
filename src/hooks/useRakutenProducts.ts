import useSWR from 'swr'

/** 楽天商品情報 */
export interface RakutenProduct {
  itemName: string
  itemPrice: number
  itemUrl: string
  affiliateUrl: string
  imageUrl: string
}

/** 楽天APIレスポンスの型 */
interface RakutenApiResponse {
  Items: Array<{
    Item: {
      itemName: string
      itemPrice: number
      itemUrl: string
      affiliateUrl: string
      mediumImageUrls: Array<{ imageUrl: string }>
    }
  }>
}

const RAKUTEN_API_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'

/**
 * 楽天商品を検索するカスタムフック
 * @param keyword 検索キーワード（アーティスト名）
 * @returns 商品データと読み込み状態
 */
export const useRakutenProducts = (keyword: string | null) => {
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID

  const fetchProducts = async (): Promise<RakutenProduct[]> => {
    if (!keyword || !appId || !affiliateId) {
      return []
    }

    const params = new URLSearchParams({
      applicationId: appId,
      affiliateId: affiliateId,
      keyword: `${keyword} CD`,
      hits: '6',
      sort: '-reviewCount',
      genreId: '0',
    })

    const response = await fetch(`${RAKUTEN_API_URL}?${params}`)

    if (!response.ok) {
      throw new Error('楽天API呼び出しに失敗しました')
    }

    const data: RakutenApiResponse = await response.json()

    return data.Items.map(({ Item }) => ({
      itemName: Item.itemName,
      itemPrice: Item.itemPrice,
      itemUrl: Item.itemUrl,
      affiliateUrl: Item.affiliateUrl,
      imageUrl: Item.mediumImageUrls[0]?.imageUrl || '',
    }))
  }

  const { data: products, error, isLoading } = useSWR(
    keyword ? ['rakutenProducts', keyword] : null,
    fetchProducts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60 * 60 * 1000, // 1時間キャッシュ
    }
  )

  return {
    products: products || [],
    isLoading,
    error,
  }
}
