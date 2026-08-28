import { isPreviewEnabled } from "@/lib/preview";
import { readAsset } from "@/lib/journal";

/**
 * Serves a journal screenshot out of the private Supabase bucket.
 *
 * Mirrors `/api/draft-assets` deliberately: every failure — bad name, missing
 * object, no session — returns the same bare 404 with no cacheable body, so the
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
  { params }: { params: Promise<{ filename: string }> }
) {
  if (!(await isPreviewEnabled())) return unavailable();

  const { filename } = await params;
  const asset = await readAsset(filename);
  if (!asset) return unavailable();

  return new Response(asset.bytes, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": asset.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
