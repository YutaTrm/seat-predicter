import type { NextConfig } from "next";

// 環境変数の存在確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Required environment variables are missing')
}

const nextConfig: NextConfig = {
  output: 'standalone',
  publicRuntimeConfig: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey,
  }
};

export default nextConfig;
