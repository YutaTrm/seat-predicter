-- ticketsテーブルにdayカラムを追加

-- 1. dayカラムを追加（INTEGER型、既存レコードはnull許可）
ALTER TABLE public.tickets
ADD COLUMN day INTEGER;

-- 2. dayカラムにコメントを追加
COMMENT ON COLUMN public.tickets.day IS 'ライブ公演日目（day1, day2など）';

-- 3. 複合ユニークキー制約を追加
-- 同じユーザーが同じツアー・同じ抽選枠・同じ座席・同じdayに重複登録できないようにする
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_unique_seat_per_user
UNIQUE (user_id, tour_id, lottery_slots_id, block, block_number, column, number, day);

-- 4. 今後の新規レコードではdayを必須にするため、CHECK制約を追加（1-4の範囲）
-- 既存のnullレコードは許可するが、新規登録では必須かつ1-4の範囲内
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_day_range
CHECK (day IS NULL OR (day >= 1 AND day <= 4));

-- 確認用クエリ
-- SELECT * FROM public.tickets ORDER BY created_at DESC LIMIT 10;
