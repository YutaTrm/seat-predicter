import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database.types'

export function createSupabaseClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}