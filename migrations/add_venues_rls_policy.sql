-- venuesテーブルのRLSを有効化
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- 全員が会場情報を読み取れるようにするポリシーを作成
CREATE POLICY "venues_select_policy"
ON venues
FOR SELECT
TO public
USING (true);
