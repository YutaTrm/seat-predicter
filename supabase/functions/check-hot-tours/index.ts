import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

// OAuth 1.0a署名を生成
async function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): Promise<string> {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&')

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`

  const encoder = new TextEncoder()
  const keyData = encoder.encode(signingKey)
  const messageData = encoder.encode(signatureBase)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  return base64Encode(new Uint8Array(signature))
}

// X API v2でポストを送信
async function postToX(text: string): Promise<void> {
  const apiKey = Deno.env.get('X_API_KEY')
  const apiSecret = Deno.env.get('X_API_SECRET')
  const accessToken = Deno.env.get('X_ACCESS_TOKEN')
  const accessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET')

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error('X API credentials not configured')
  }

  const url = 'https://api.twitter.com/2/tweets'
  const method = 'POST'

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_version: '1.0',
  }

  const signature = await generateOAuthSignature(
    method,
    url,
    oauthParams,
    apiSecret,
    accessTokenSecret
  )
  oauthParams.oauth_signature = signature

  const authHeader =
    'OAuth ' +
    Object.keys(oauthParams)
      .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to post to X: ${error}`)
  }
}

serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 24時間前の日時を取得
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // 直近24時間のチケットをツアーごとに集計
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('tour_id')
      .gte('created_at', twentyFourHoursAgo)

    if (ticketsError) {
      throw ticketsError
    }

    // ツアーごとの件数を集計
    const tourCounts: Record<number, number> = {}
    for (const ticket of tickets || []) {
      tourCounts[ticket.tour_id] = (tourCounts[ticket.tour_id] || 0) + 1
    }

    // 50件以上のツアーを取得
    const hotTourIds = Object.entries(tourCounts)
      .filter(([_, count]) => count >= 50)
      .map(([tourId, _]) => parseInt(tourId))

    if (hotTourIds.length === 0) {
      return new Response(
        JSON.stringify({ success: true, postedCount: 0, message: 'No hot tours found' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ツアー情報を取得（アーティスト名含む）
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        artist_id,
        hot_post_count,
        artists!tours_artist_id_fkey (
          name
        )
      `)
      .in('id', hotTourIds)

    if (toursError) {
      throw toursError
    }

    let postedCount = 0

    for (const tour of tours || []) {
      const currentCount = tourCounts[tour.id]
      const lastPostedCount = tour.hot_post_count || 0

      // 50件刻みで次の閾値を計算
      const nextThreshold = Math.floor(lastPostedCount / 50) * 50 + 50

      // 現在の件数が次の閾値以上ならポスト
      if (currentCount >= nextThreshold) {
        const siteUrl = `https://zasekiyosou.com/?artist=${tour.artist_id}&tour=${tour.id}`

        const artistName = tour.artists?.name || '不明'
        const message = [
          `🔥${artistName}のツアー`,
          `『${tour.name}』が登録急増中！`,
          '',
          `${currentCount}件の座席情報が集まっています！🔥`,
          siteUrl,
        ].join('\n')

        console.log(`Posting hot tour: ${tour.name} (${currentCount} tickets)`)
        await postToX(message)

        // hot_post_countを更新（現在の件数を50刻みで切り捨てた値）
        const newPostCount = Math.floor(currentCount / 50) * 50
        const { error: updateError } = await supabase
          .from('tours')
          .update({ hot_post_count: newPostCount })
          .eq('id', tour.id)

        if (updateError) {
          console.error(`Failed to update hot_post_count for tour ${tour.id}:`, updateError)
        }

        postedCount++
      }
    }

    return new Response(
      JSON.stringify({ success: true, postedCount }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
