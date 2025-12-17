-- UNIQUE制約を修正するSQL

-- 1. まず現在の制約を確認
-- SELECT
--   conname AS constraint_name,
--   pg_get_constraintdef(oid) AS constraint_definition
-- FROM pg_constraint
-- WHERE conrelid = 'public.tickets'::regclass
--   AND contype = 'u'
-- ORDER BY conname;

-- 2. 全てのUNIQUE制約を削除（tickets_unique_seat_per_user以外）
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.tickets'::regclass
          AND contype = 'u'
          AND conname != 'tickets_unique_seat_per_user'
    LOOP
        EXECUTE format('ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
        RAISE NOTICE 'Dropped constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- 3. tickets_unique_seat_per_userも一度削除
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_unique_seat_per_user;

-- 4. 正しい制約を追加
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_unique_seat_per_user
UNIQUE (user_id, tour_id, lottery_slots_id, block, block_number, "column", number, day);

-- 5. 確認
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.tickets'::regclass
  AND contype = 'u'
ORDER BY conname;
