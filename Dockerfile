# ビルドステージ
FROM node:20-slim AS builder
WORKDIR /app

# ビルド時の環境変数を設定
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# パッケージファイルをコピー
COPY package*.json ./
# 本番環境用の依存関係のみをインストール
RUN npm ci

# ソースコードをコピー
COPY . .
# 本番用ビルドを実行
RUN npm run build

# 実行ステージ
FROM node:20-slim AS runner
WORKDIR /app

# 本番環境変数を設定
ENV NODE_ENV=production
ENV PORT=8080

# アプリケーションの実行に必要なファイルをコピー
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# 本番環境用の依存関係のみをインストール
RUN npm ci --only=production

# セキュリティのためにnon-rootユーザーを使用
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# アプリケーションを起動
CMD ["npm", "start"]

# Cloud Runが使用するポートを公開
EXPOSE 8080