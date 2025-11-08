-- 管理者設定の確認用SQL

-- 1. 現在ログイン中のユーザーIDを確認
SELECT auth.uid() as current_user_id;

-- 2. 現在のユーザーのraw_user_meta_dataを確認
SELECT
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE id = auth.uid();

-- 3. 管理者権限があるか確認
SELECT public.is_admin() as is_admin;

-- 4. すべてのユーザーのroleを確認
SELECT
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data @> '{"role":"admin"}'::jsonb as has_admin_role
FROM auth.users
ORDER BY created_at DESC;

-- 5. get_all_users関数をテスト
-- SELECT * FROM public.get_all_users();

-- ====================================
-- 現在のユーザーを管理者にする場合は以下を実行
-- ====================================

-- 方法1: 現在ログイン中のユーザーを管理者にする
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'::jsonb
-- )
-- WHERE id = auth.uid();

-- 方法2: 特定のメールアドレスのユーザーを管理者にする
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'::jsonb
-- )
-- WHERE email = 'your-email@example.com';

-- 確認: 更新後に再度確認
-- SELECT
--   id,
--   email,
--   raw_user_meta_data->>'role' as role
-- FROM auth.users
-- WHERE id = auth.uid();
