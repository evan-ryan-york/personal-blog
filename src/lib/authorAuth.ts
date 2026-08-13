import { createHash, timingSafeEqual } from "crypto";

/**
 * Single-author gate for draft previews. The password lives in the
 * AUTHOR_PASSWORD environment variable; with it unset, preview can never be
 * enabled in production and drafts stay invisible to everyone.
 */
export function isAuthorAuthConfigured(): boolean {
  return Boolean(process.env.AUTHOR_PASSWORD);
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function verifyAuthorPassword(input: unknown): boolean {
  const expected = process.env.AUTHOR_PASSWORD;
  if (!expected || typeof input !== "string" || input.length === 0) {
    return false;
  }

  // Hash first so the comparison is fixed-width and leaks no length.
  return timingSafeEqual(digest(input), digest(expected));
}
