-- 登録急増中のポスト履歴を管理するカラムを追加
ALTER TABLE tours ADD COLUMN hot_post_count INTEGER DEFAULT 0;
COMMENT ON COLUMN tours.hot_post_count IS '登録急増中で最後にXポストした時点の24時間内登録件数（50件刻み）';
