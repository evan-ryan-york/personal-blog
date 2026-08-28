/**
 * Cookie names shared between `proxy.ts` and `/api/auth/draft`.
 *
 * Their own module because `proxy.ts` must not pull in `next/headers`, which
 * every other auth module depends on.
 */

/** Next's own Draft Mode cookie. Set by `draftMode().enable()`, never by us. */
export const DRAFT_MODE_COOKIE = "__prerender_bypass";

/**
 * Marks that the proxy already bounced this browser through `/api/auth/draft`.
 * Without it, an enable that somehow fails to stick would redirect forever.
 */
export const DRAFT_RETRY_COOKIE = "__author_draft_retry";
