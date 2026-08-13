import fs from "fs/promises";
import path from "path";
import { getPostBySlug } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";

const SAFE_SLUG = /^[a-z0-9-]+$/;
const SAFE_IMAGE = /^[a-z0-9-]+\.(?:jpe?g|png|webp|gif|avif)$/;

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function unavailable(): Response {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; filename: string }> }
) {
  const { slug, filename } = await params;

  if (!SAFE_SLUG.test(slug) || !SAFE_IMAGE.test(filename)) {
    return unavailable();
  }

  const post = getPostBySlug(slug);
  if (post?.status !== "draft" || !(await isPreviewEnabled())) {
    return unavailable();
  }

  try {
    const asset = await fs.readFile(
      path.join(process.cwd(), "content", "posts", slug, "assets", filename)
    );
    const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()];

    return new Response(asset, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return unavailable();
  }
}
