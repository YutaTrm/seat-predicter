-- artistsテーブルにアフィリエイト検索キーワードカラムを追加
ALTER TABLE artists ADD COLUMN affiliate_search_words TEXT;

-- コメント追加
COMMENT ON COLUMN artists.affiliate_search_words IS 'アフィリエイト商品検索用のキーワード（スペース区切りで複数指定可）。NULLの場合はアーティスト名を使用';
