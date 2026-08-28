import type { User } from "@supabase/supabase-js";
import { createRouteSupabase } from "@/lib/supabaseServer";

/**
 * Single-author gate, backed by Supabase Auth.
 *
 * The site has exactly one account, created by hand in the Supabase dashboard
 * with sign-ups disabled. `AUTHOR_EMAIL` names it, so even if sign-ups were
 * switched on by mistake, a new account would carry no privileges at all.
 */
export function isAuthorAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.AUTHOR_EMAIL
  );
}

/** Is this signed-in user *the* author? Unset `AUTHOR_EMAIL` means nobody is. */
export function isAuthorUser(user: User | null | undefined): boolean {
  const expected = process.env.AUTHOR_EMAIL;
  if (!expected || !user?.email) return false;

  return user.email.toLowerCase() === expected.toLowerCase();
}

/**
 * The author's Supabase user, or null.
 *
 * Uses `getUser()` rather than `getSession()`: the former revalidates the
 * access token against Supabase, so a forged or tampered cookie fails here
 * instead of being trusted.
 */
export async function getAuthorUser(): Promise<User | null> {
  if (!isAuthorAuthConfigured()) return null;

  const supabase = await createRouteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return isAuthorUser(user) ? user : null;
}
