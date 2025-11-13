-- toursテーブルにX投稿フラグを追加
ALTER TABLE tours
ADD COLUMN IF NOT EXISTS posted_day_before BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS posted_on_day BOOLEAN DEFAULT FALSE;

-- インデックスを追加（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_tours_print_start_date ON tours(print_start_date);
CREATE INDEX IF NOT EXISTS idx_tours_posted_flags ON tours(posted_day_before, posted_on_day);
