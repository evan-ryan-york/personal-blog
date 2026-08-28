import { draftMode } from "next/headers";
import { getAuthorUser } from "@/lib/authorAuth";

/**
 * Is the current request the author previewing unpublished work?
 *
 * Backed by Next's Draft Mode: the `__prerender_bypass` cookie is httpOnly and
 * only ever set after the author's Supabase session checks out — by `/api/auth`
 * at sign-in, and by `/api/auth/draft` whenever `proxy.ts` finds a valid session
 * without one. Reading `isEnabled` does not opt a route out of static rendering
 * — the cookie itself is what bypasses the cache — so published pages stay
 * prerendered. Reading the session directly here would not: `cookies()` forces
 * every page that renders the footer, which is all of them, to go dynamic.
 *
 * Local development always counts as preview, so drafts are visible while
 * writing without logging in.
 */
export async function isPreviewEnabled(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  const { isEnabled } = await draftMode();
  return isEnabled;
}

/**
 * Is the author signed in, verified against Supabase on this request?
 *
 * Unlike `isPreviewEnabled`, this never grants access merely because the app is
 * running locally, and never settles for the Draft Mode cookie — mutations such
 * as publishing check the access token itself. Only call it from Route
 * Handlers, which are dynamic anyway.
 */
export async function isAuthorSessionEnabled(): Promise<boolean> {
  return (await getAuthorUser()) !== null;
}
