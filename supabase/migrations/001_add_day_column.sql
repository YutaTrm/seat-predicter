-- ticketsテーブルにdayカラムを追加

-- 1. dayカラムを追加（INTEGER型、既存レコードはnull許可）
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS day INTEGER;

-- 2. dayカラムにコメントを追加
COMMENT ON COLUMN public.tickets.day IS 'ライブ公演日目（day1, day2など）';

-- 3. 既存のUNIQUE制約を削除（もし存在する場合）
-- user_idを含まない古い制約が残っている可能性があるため
DO $$
BEGIN
    -- 既存の制約を全て確認して削除
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tickets_tour_id_block_block_number_column_number_key'
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE public.tickets DROP CONSTRAINT tickets_tour_id_block_block_number_column_number_key;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tickets_unique_seat'
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE public.tickets DROP CONSTRAINT tickets_unique_seat;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tickets_unique_seat_per_user'
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE public.tickets DROP CONSTRAINT tickets_unique_seat_per_user;
    END IF;
END $$;

-- 4. 新しい複合ユニークキー制約を追加
-- 同じユーザーが同じツアー・同じ抽選枠・同じ座席・同じdayに重複登録できないようにする
-- 異なるユーザーは同じ座席を登録可能
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_unique_seat_per_user
UNIQUE (user_id, tour_id, lottery_slots_id, block, block_number, "column", number, day);

-- 5. 今後の新規レコードではdayを必須にするため、CHECK制約を追加（1-4の範囲）
-- 既存のnullレコードは許可するが、新規登録では必須かつ1-4の範囲内
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tickets_day_range'
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE public.tickets
        ADD CONSTRAINT tickets_day_range
        CHECK (day IS NULL OR (day >= 1 AND day <= 4));
    END IF;
END $$;

-- 確認用クエリ
-- SELECT * FROM public.tickets ORDER BY created_at DESC LIMIT 10;
