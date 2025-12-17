-- 管理者用：全チケット情報と投稿者情報を取得する関数

-- 全チケット情報を投稿者情報付きで取得する関数（管理者のみ）
CREATE OR REPLACE FUNCTION public.get_all_tickets_with_users()
RETURNS TABLE (
  ticket_id bigint,
  artist_id bigint,
  tour_id bigint,
  lottery_slots_id bigint,
  block text,
  block_number bigint,
  "column" bigint,
  number bigint,
  day integer,
  ticket_created_at timestamptz,
  ticket_updated_at timestamptz,
  user_id uuid,
  user_email text,
  user_name text,
  user_full_name text,
  user_avatar_url text,
  user_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 管理者チェック
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- ticketsとauth.usersを結合して返す
  RETURN QUERY
  SELECT
    t.id::bigint as ticket_id,
    t.artist_id::bigint,
    t.tour_id::bigint,
    t.lottery_slots_id::bigint,
    t.block,
    t.block_number::bigint,
    t."column"::bigint,
    t.number::bigint,
    t.day,
    t.created_at as ticket_created_at,
    t.updated_at as ticket_updated_at,
    u.id as user_id,
    u.email::text as user_email,
    (u.raw_user_meta_data->>'name')::text as user_name,
    (u.raw_user_meta_data->>'full_name')::text as user_full_name,
    COALESCE(
      u.raw_user_meta_data->>'avatar_url',
      u.raw_user_meta_data->>'picture',
      u.raw_user_meta_data->>'profile_image_url'
    )::text as user_avatar_url,
    u.created_at as user_created_at
  FROM public.tickets t
  LEFT JOIN auth.users u ON t.user_id = u.id
  ORDER BY t.created_at DESC;
END;
$$;

-- 関数への実行権限を付与
GRANT EXECUTE ON FUNCTION public.get_all_tickets_with_users() TO authenticated;

-- 確認用クエリ
-- SELECT * FROM public.get_all_tickets_with_users() LIMIT 10;
