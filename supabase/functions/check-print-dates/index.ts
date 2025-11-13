import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';
// OAuth 1.0a署名を生成
async function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  // パラメータをソート
  const sortedParams = Object.keys(params).sort().map((key)=>`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
  // 署名ベース文字列を作成
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');
  // 署名キーを作成
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  // HMAC-SHA1で署名を生成
  const encoder = new TextEncoder();
  const keyData = encoder.encode(signingKey);
  const messageData = encoder.encode(signatureBase);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, {
    name: 'HMAC',
    hash: 'SHA-1'
  }, false, [
    'sign'
  ]);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const base64Signature = base64Encode(new Uint8Array(signature));
  return base64Signature;
}
// X API v2でポストを送信
async function postToX(text) {
  const apiKey = Deno.env.get('X_API_KEY');
  const apiSecret = Deno.env.get('X_API_SECRET');
  const accessToken = Deno.env.get('X_ACCESS_TOKEN');
  const accessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET');
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error('X API credentials not configured');
  }
  const url = 'https://api.twitter.com/2/tweets';
  const method = 'POST';
  // OAuth 1.0aパラメータ
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_version: '1.0'
  };
  // 署名を生成
  const signature = await generateOAuthSignature(method, url, oauthParams, apiSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;
  // Authorizationヘッダーを構築
  const authHeader = 'OAuth ' + Object.keys(oauthParams).map((key)=>`${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`).join(', ');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      text: text
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post to X: ${error}`);
  }
}
// JSTで日付を取得
function getJSTDate(date) {
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return jstDate.toISOString().split('T')[0];
}
serve(async (req)=>{
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    const now = new Date();
    const today = getJSTDate(now);
    const tomorrow = getJSTDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    console.log(`Checking print dates - Today: ${today}, Tomorrow: ${tomorrow}`);
    // 明日が発券日のツアー（前日通知）
    const { data: dayBeforeTours, error: dayBeforeError } = await supabase.from('tours').select(`
        id,
        name,
        keywords,
        artist_id,
        print_start_date,
        posted_day_before,
        artists!tours_artist_id_fkey (
          id,
          name
        )
      `).eq('print_start_date', tomorrow).eq('posted_day_before', false);
    if (dayBeforeError) {
      throw dayBeforeError;
    }
    // 前日通知を送信
    for (const tour of dayBeforeTours || []){
      const artistName = tour.artists?.name || '不明';
      const artistId = tour.artist_id;
      const tourId = tour.id;
      const keywords = tour.keywords || '';
      const url = `https://zasekiyosou.com/?artist=${artistId}&tour=${tourId}`;
      // 改行とインデントを正しく制御
      const message = [
        `もうすぐ${artistName}さんのツアー『${tour.name}』の発券開始ですね！✨️🎫✨️`,
        `皆さんに良い座席が当たることを祈ってます！🙌🏟️🙌`,
        `🔗 ${url}`,
        '',
        `${keywords} アリーナ構成 座席予想`
      ].join('\n');
      console.log(`Posting day-before reminder for tour: ${tour.name}`);
      await postToX(message);
      // フラグを更新
      const { error: updateError } = await supabase.from('tours').update({
        posted_day_before: true
      }).eq('id', tour.id);
      if (updateError) {
        console.error(`Failed to update posted_day_before flag for tour ${tour.id}:`, updateError);
      }
    }
    // 当日通知（コメントアウト）
    /*
    const { data: onDayTours, error: onDayError } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        keywords,
        artist_id,
        print_start_date,
        posted_on_day,
        artists!tours_artist_id_fkey (
          id,
          name
        )
      `)
      .eq('print_start_date', today)
      .eq('posted_on_day', false)

    if (onDayError) {
      throw onDayError
    }

    // 当日通知を送信
    for (const tour of onDayTours || []) {
      const artistName = tour.artists?.name || '不明'
      const artistId = tour.artist_id
      const tourId = tour.id
      const keywords = tour.keywords || ''
      const url = `https://zasekiyosou.com/?artist=${artistId}&tour=${tourId}`

      // TODO: 当日の文言を設定
      const message = [
        `当日の文言（TODO）`,
        url,
        '',
        keywords
      ].join('\n')

      console.log(`Posting on-day reminder for tour: ${tour.name}`)
      await postToX(message)

      // フラグを更新
      const { error: updateError } = await supabase
        .from('tours')
        .update({ posted_on_day: true })
        .eq('id', tour.id)

      if (updateError) {
        console.error(`Failed to update posted_on_day flag for tour ${tour.id}:`, updateError)
      }
    }
    */ return new Response(JSON.stringify({
      success: true,
      dayBeforeCount: dayBeforeTours?.length || 0
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
