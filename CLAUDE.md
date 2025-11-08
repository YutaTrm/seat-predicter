# CLAUDE.md

このファイルは、このリポジトリでClaude Code (claude.ai/code) が作業する際のガイダンスを提供します。

## 言語設定

このプロジェクトでは必ず日本語で回答してください。技術用語は必要に応じて英語のままで使用可能です。

## プロジェクト概要

座席予想掲示板 - コンサートチケット情報を収集・可視化するNext.jsアプリケーションです。ユーザーはチケット詳細（ブロック、列番、座席番号）を投稿でき、アプリは集計データを基に座席分布の可視化を生成します。

## コマンド

### 開発用コマンド

```bash
npm run dev          # 開発サーバーをTurbopackで起動 (http://localhost:3000)
npm run build        # 本番用ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLintを実行
```

## アーキテクチャ

### 技術スタック

- **Framework**: Next.js 15.2.4 (App Router with Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks + SWR for data fetching
- **Analytics**: Google Analytics

### データベーススキーマ

Supabaseで管理される4つの主要テーブル：

- `artists` - アーティスト情報
- `tours` - アーティストに紐づくツアー情報
- `lottery_slots` - アーティストごとの抽選枠情報
- `tickets` - 個別のチケット投稿（ブロック、列番、座席番号など）

### 主要なアプリケーションフロー

#### クライアントサイドのデータフロー

1. `HomePage` (`src/app/components/HomePage.tsx`) がメインのクライアントコンポーネント
2. カスタムhooksでSupabaseからデータを取得：
   - `useArtistData` - アーティスト一覧を取得
   - `useTourData` - 選択されたアーティストのツアーを取得
   - `useLotterySlotData` - 選択されたアーティストの抽選枠を取得
3. チケット投稿には `postLimitUtils.ts` による投稿制限あり
4. Supabaseクライアントは `src/lib/supabase/client.ts` でシングルトンとして初期化

#### サーバーサイドのアーキテクチャ

- `src/app/page.tsx` のServer ComponentsがSupabase認証情報をクライアントに渡す
- 管理機能 (`src/app/admin/page.tsx`) はServer ActionsでCRUD操作を実行
- サーバーサイドSupabaseクライアント (`src/lib/supabase/server.ts`) は以下を処理：
  - 通常の認証操作（ユーザーセッション）
  - 管理者操作（service role key使用）

#### 可視化システム

座席分布の可視化 (`TicketGrid`) は高度なアルゴリズムを実装：

- IQR法による外れ値検出（ON/OFF切替可能）
- チケット内の最大座席番号・列番号に基づくブロックサイズ計算
- 日本語フォント対応のCanvas描画（M PLUS 1p）
- レイアウトルール：
  - 同じアルファベット（A1, A2, A3）のブロックは高さを共有（最大列番）
  - 同じ数字（A1, B1, C1）のブロックは幅を共有（最大座席番号）
  - データがない場合はデフォルトサイズ12を使用
  - 外れ値検出ONの場合、外れ値は赤色で表示

関連ファイル：

- `src/app/components/home/TicketGrid.tsx` - メインのグリッドコンポーネント
- `src/utils/outlierDetection.ts` - 統計的外れ値フィルタリング
- `src/app/components/home/TicketGrid/utils/blockCalculations.ts` - ブロックサイズ計算ロジック
- `src/app/components/home/TicketGrid/utils/canvasDrawing.ts` - Canvas描画処理

### プロジェクト構造

```
src/
├── app/                         # Next.js App Routerのページ
│   ├── components/              # Reactコンポーネント
│   │   ├── home/               # ホームページ用コンポーネント（Form、Table、Grid）
│   │   ├── admin/              # 管理画面用セクション
│   │   └── common/             # 共通コンポーネント（Modal、Footer、Ads）
│   ├── admin/                   # Server Actions使用の管理ページ
│   └── [page].tsx              # その他のページ（about、terms、privacy）
├── lib/
│   └── supabase/               # Supabaseクライアント/サーバーセットアップ
├── hooks/                       # データ取得用カスタムReact hooks
├── utils/                       # ユーティリティ関数（チケット、外れ値など）
├── types/                       # TypeScript型定義
│   ├── database.types.ts       # Supabase生成型
│   └── ticket.ts               # ドメイン型
└── constants/                   # アプリ定数（grid設定など）
```

### 重要なパターン

1. **Supabase認証情報**: クライアントサイドで認証情報を公開しない。Server Componentsが`supabaseUrl`と`supabaseKey`をpropsとしてクライアントコンポーネントに渡す。

2. **型安全性**: データベース型は`src/types/database.types.ts`で定義。スキーマ変更時は再生成が必要。

3. **URL状態管理**: アーティストとツアーの選択はURLパラメータ（`?artist=X&tour=Y`）で永続化され、共有可能なリンクを実現。

4. **Force Dynamic**: ホームページと管理ページの両方で`export const dynamic = 'force-dynamic'`を使用し、静的生成を防止。

5. **投稿制限**: クライアントサイドの投稿制限でスパム投稿を防止（`postLimitUtils.ts`に実装）。

6. **SEO**: `layout.tsx`で包括的なメタデータ設定（OpenGraph、Twitterカード対応）。`page.tsx`でJSON-LD構造化データを実装。

## 開発時の注意事項

- アプリは日本語フォーカスで、カスタム日本語フォント（M PLUS 1p）を使用
- 可視化の生成には最低15件のチケットが必要
- 管理画面にはSupabaseのservice role keyが必要
- Google Analytics IDは環境変数`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`で設定
