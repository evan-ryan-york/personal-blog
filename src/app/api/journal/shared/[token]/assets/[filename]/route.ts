import { getSharedEntry, readAsset } from "@/lib/journal";
import { assetsReferencedIn } from "@/lib/journalMarkdown";

/**
 * Serves a screenshot belonging to a *shared* journal day, to anyone holding
 * the link.
 *
 * The token alone is not enough: the filename must also appear in that day's
 * body. Otherwise one shared day would become a read handle on the whole
 * private bucket for anyone willing to guess object names.
 *
 * Like the author-only asset route, every failure is the same bare 404 so the
 * response cannot be used to probe what exists.
 */
function unavailable(): Response {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; filename: string }> }
) {
  const { token, filename } = await params;

  const entry = await getSharedEntry(token);
  if (!entry) return unavailable();
  if (!assetsReferencedIn(entry.body).has(filename)) return unavailable();

  const asset = await readAsset(filename);
  if (!asset) return unavailable();

  return new Response(asset.bytes, {
    headers: {
      // Public, but never shared cache: unsharing the day has to take the
      // image with it, and a CDN copy would outlive the revoked token.
      "Cache-Control": "private, no-store",
      "Content-Type": asset.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
