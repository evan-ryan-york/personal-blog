/**
 * Does this request come from the site itself?
 *
 * A CSRF guard for author-only mutations: the Draft Mode cookie rides along on
 * cross-site requests, so the session check alone is not enough. Browsers send
 * `Origin` on every POST, and a missing one is treated as a failure rather than
 * waved through.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestUrl = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    requestUrl.protocol.replace(/:$/, "");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    requestUrl.host;

  return origin === `${protocol}://${host}`;
}
