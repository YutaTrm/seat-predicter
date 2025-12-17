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

interface UseRakutenProductsParams {
  artistName: string | null
  affiliateSearchWords: string | null
}

/**
 * 楽天商品を検索するカスタムフック
 * @param params.artistName アーティスト名（affiliate_search_wordsがない場合に使用）
 * @param params.affiliateSearchWords 検索キーワード（設定されている場合はこちらを優先）
 * @returns 商品データと読み込み状態
 */
export const useRakutenProducts = ({ artistName, affiliateSearchWords }: UseRakutenProductsParams) => {
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID

  // 検索キーワードを決定（affiliate_search_wordsがあればそれを使用、なければアーティスト名）
  const searchKeyword = affiliateSearchWords || artistName

  const fetchProducts = async (): Promise<RakutenProduct[]> => {
    if (!searchKeyword || !appId || !affiliateId) {
      return []
    }

    const params = new URLSearchParams({
      applicationId: appId,
      affiliateId: affiliateId,
      keyword: searchKeyword,
      hits: '24',
      sort: 'standard',
    })

    const response = await fetch(`${RAKUTEN_API_URL}?${params}`)

    if (!response.ok) {
      // エラー時は空配列を返す（400エラー等）
      return []
    }

    const data: RakutenApiResponse = await response.json()

    // 検索結果がない場合
    if (!data.Items || data.Items.length === 0) {
      return []
    }

    return data.Items.map(({ Item }) => ({
      itemName: Item.itemName,
      itemPrice: Item.itemPrice,
      itemUrl: Item.itemUrl,
      affiliateUrl: Item.affiliateUrl,
      imageUrl: Item.mediumImageUrls[0]?.imageUrl || '',
    }))
  }

  const { data: products, error, isLoading } = useSWR(
    searchKeyword ? ['rakutenProducts', searchKeyword] : null,
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
