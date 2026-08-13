import { draftMode } from "next/headers";

/**
 * Is the current request the author previewing unpublished work?
 *
 * Backed by Next's Draft Mode: the `__prerender_bypass` cookie is httpOnly,
 * regenerated on every build, and only ever set by `/api/preview` after the
 * author password checks out. Reading `isEnabled` does not opt a route out of
 * static rendering — the cookie itself is what bypasses the cache — so
 * published pages stay prerendered.
 *
 * Local development always counts as preview, so drafts are visible while
 * writing without logging in.
 */
export async function isPreviewEnabled(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  const { isEnabled } = await draftMode();
  return isEnabled;
}
