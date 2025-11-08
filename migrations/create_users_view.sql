-- auth.usersテーブルにアクセスするためのビューを作成（Security Invoker）

-- 既存のビューを削除（存在する場合）
DROP VIEW IF EXISTS public.users;

-- publicスキーマにユーザー情報を公開するビューを作成
-- Security Invokerを使用して、呼び出し元ユーザーの権限で実行
CREATE VIEW public.users
WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users;

-- ビューへの読み取り権限を付与（認証済みユーザーのみ）
GRANT SELECT ON public.users TO authenticated;

-- RLS（Row Level Security）を有効化
ALTER VIEW public.users SET (security_invoker = true);

-- 注意：このビューは認証済みユーザーのみがアクセスできます
-- 管理者権限が必要な場合は、アプリケーション側で制御してください

-- 確認用クエリ：ビューが正しく作成されたかチェック
-- SELECT * FROM public.users LIMIT 5;
