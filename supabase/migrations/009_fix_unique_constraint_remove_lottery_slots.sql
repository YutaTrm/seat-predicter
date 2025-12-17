-- UNIQUE制約からlottery_slots_idを除外
-- 同じユーザーが同じ座席・同じdayを抽選枠に関係なく1回のみ登録できるようにする

-- 既存の制約を削除
ALTER TABLE public.tickets
DROP CONSTRAINT IF EXISTS tickets_unique_seat_per_user;

-- 新しい制約を作成（lottery_slots_idを除外）
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_unique_seat_per_user
UNIQUE (user_id, tour_id, block, block_number, "column", number, day);

-- 確認用クエリ：制約の定義を確認
SELECT
  conname,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.tickets'::regclass
  AND contype = 'u'
  AND conname = 'tickets_unique_seat_per_user';
