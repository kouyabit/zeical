import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabaseクライアントを生成する。
 * 環境変数が未設定の場合は null を返し、呼び出し側でフォールバックできるようにする。
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  // 一度作ったクライアントは使い回す（接続の無駄を防ぐ）
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
