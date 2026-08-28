import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Cookie-backed Supabase clients — the ones that know who is signed in.
 *
 * Distinct from `@/lib/supabase`, whose clients are stateless: `getSupabase()`
 * is the anonymous client for public tables, `getSupabaseAdmin()` the secret-key
 * client for tables the browser must never reach. Neither reads a session.
 */

/**
 * The auth cookies never need to be read by JavaScript: every Supabase call in
 * this app happens on the server, so nothing in the browser needs the tokens.
 * `httpOnly` therefore costs nothing and takes them out of reach of XSS.
 */
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

function projectCredentials(): { url: string; key: string } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

/**
 * A client for Route Handlers, where cookies can be written. Refreshed tokens
 * and sign-in/sign-out land on the outgoing response automatically.
 *
 * Never share the returned client across requests — it is bound to this
 * request's cookie store.
 */
export async function createRouteSupabase(): Promise<SupabaseClient> {
  const store = await cookies();
  const { url, key } = projectCredentials();

  return createServerClient(url, key, {
    cookieOptions: cookieOptions(),
    cookies: {
      getAll: () => store.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            store.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. Harmless: `proxy.ts` runs
          // ahead of every render and refreshes the session there instead.
        }
      },
    },
  });
}

/**
 * A client for `proxy.ts`, which has a request but not yet a response.
 *
 * Cookie writes are buffered and replayed onto whichever response the proxy
 * ends up returning — `applyTo` must be called on it, or a rotated refresh
 * token is silently dropped and the session dies early.
 */
export function createProxySupabase(request: NextRequest) {
  const pendingCookies: { name: string; value: string; options: CookieOptions }[] =
    [];
  const pendingHeaders: Record<string, string> = {};
  const { url, key } = projectCredentials();

  const supabase = createServerClient(url, key, {
    cookieOptions: cookieOptions(),
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        Object.assign(pendingHeaders, headers);

        for (const cookie of cookiesToSet) {
          pendingCookies.push(cookie);
          // Anything rendering later in this same request should see the
          // refreshed token, not the one that just expired.
          request.cookies.set(cookie.name, cookie.value);
        }
      },
    },
  });

  function applyTo<T extends NextResponse>(response: T): T {
    for (const { name, value, options } of pendingCookies) {
      response.cookies.set(name, value, options);
    }
    // Supabase asks for these when it sets auth cookies: a response carrying
    // one user's tokens must never be cached and handed to someone else.
    for (const [name, value] of Object.entries(pendingHeaders)) {
      response.headers.set(name, value);
    }
    return response;
  }

  return { supabase, applyTo };
}
