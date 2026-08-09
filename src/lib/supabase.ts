import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

let _supabaseAdmin: SupabaseClient | null = null;

// Secret-key client, for tables that must never be readable with the public
// anon key (subscribers). Returns null when the key isn't configured so callers
// can degrade instead of throwing.
export function getSupabaseAdmin() {
  const key = process.env.SUPABASE_PRIVATE_KEY;
  if (!key) return null;

  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabaseAdmin;
}
