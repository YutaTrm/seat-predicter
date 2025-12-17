-- チケットテーブルのRLSポリシーを修正
-- セキュリティ問題を解決するための修正

-- 【1】危険なINSERTポリシーを削除（誰でもチケット登録できる状態を解消）
DROP POLICY IF EXISTS "Enable insert for all users" ON public.tickets;

-- 【2】認証済みユーザーのみが自分のuser_idでチケットを登録できるポリシー
CREATE POLICY "Enable insert for authenticated users"
ON public.tickets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 【3】ユーザーが自分のチケットを削除できるポリシー
CREATE POLICY "Enable delete for own tickets"
ON public.tickets
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 確認用クエリ：修正後のポリシーを確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'tickets'
ORDER BY cmd, policyname;
