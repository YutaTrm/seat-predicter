-- ticketsテーブルにuser_id列を追加するマイグレーション

-- まず、user_id列が存在するか確認
-- Supabase SQL Editorで以下のクエリを実行して確認してください：
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'tickets'
--   AND column_name = 'user_id';

-- user_id列が存在しない場合、以下のSQLを実行してください：

-- user_id列を追加（auth.usersテーブルのidを参照）
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- パフォーマンス向上のためインデックスを作成
CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON public.tickets(user_id);

-- 既存のチケットのuser_idはNULLのままにする（過去のデータは匿名扱い）
-- 新規登録からuser_idが保存されるようになります

-- 確認用クエリ：user_id列が追加されたことを確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tickets'
ORDER BY ordinal_position;
