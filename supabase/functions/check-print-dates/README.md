# チケット発券日通知 Edge Function

toursテーブルの`print_start_date`を監視し、前日と当日にXへ自動投稿する機能。

## セットアップ手順

### 1. マイグレーション実行

Supabaseダッシュボードの「SQL Editor」で以下のSQLを実行：

```sql
-- migrations/20250113000000_add_posted_flags_to_tours.sql の内容を実行
```

### 2. Edge Functionのデプロイ

```bash
# Supabase CLIでデプロイ
supabase functions deploy check-print-dates
```

### 3. 環境変数の設定

Supabaseダッシュボードの「Edge Functions」→「check-print-dates」→「Settings」で以下を設定：

```
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
```

**X API v2の認証情報取得方法：**
1. https://developer.twitter.com/ にアクセス
2. プロジェクトを作成
3. OAuth 1.0aの認証情報を取得
4. 「Read and Write」権限を設定

### 4. Cronジョブの設定

Supabaseダッシュボードの「SQL Editor」で以下を実行：

```sql
-- pg_cron拡張を有効化
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 毎日午前9時（JST 9:00）にEdge Functionを呼び出し
SELECT cron.schedule(
  'check-print-dates-daily',
  '0 0 * * *',  -- UTC 0:00 = JST 9:00
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-print-dates',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

**注意：**
- `YOUR_PROJECT_REF`をあなたのSupabaseプロジェクトのrefに置き換え
- `YOUR_ANON_KEY`をSupabaseの anon key に置き換え（Settings → API）
- タイムゾーンはUTC基準（JST 9:00 = UTC 0:00）

### 5. Cronジョブの確認

```sql
-- 登録されているジョブを確認
SELECT * FROM cron.job;

-- ジョブの実行履歴を確認
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### 6. 手動テスト

```bash
# ローカルでテスト
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-print-dates \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 投稿文言

### 前日通知（実装済み）

```
もうすぐ{アーティスト名}さんのツアー『{ツアー名}』の発券開始ですね！皆さんに良い座席が当たることを祈ってます！✨️🎫✨️

{keywords}
```

### 当日通知（コメントアウト中）

文言は後で決定予定。

## トラブルシューティング

### ログの確認

```bash
# Edge Functionのログを確認
supabase functions logs check-print-dates
```

### X API認証エラー

OAuth 1.0aの署名生成が必要な場合は、以下のライブラリを使用：
- https://deno.land/x/oauth_1_0a

### タイムゾーンの確認

関数内で`getJSTDate()`を使用してJST変換しています。必要に応じて調整してください。
