import { getPostBySlug } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { postToMarkdown } from "@/lib/postMarkdown";

/**
 * A post as plain Markdown, served at `/posts/<slug>.md` via the rewrite in
 * `next.config.ts`.
 *
 * Every post here is a bespoke React layout — scroll-driven scenes, canvas
 * diagrams, engraved plates. Wonderful to read, hostile to anything trying to
 * extract the argument. This hands over the same essay as prose, which is what
 * an assistant asked to summarize or cite it actually needs.
 *
 * Draft privacy is the same deal as the page itself (`src/app/posts/[slug]`):
 * unpublished work 404s unless the author is previewing. Getting that wrong
 * here would be a much quieter leak than getting it wrong on a page, so
 * `scripts/verify-draft-privacy.mjs` checks this route too.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return new Response("Not found", { status: 404 });
  if (post.status === "draft" && !(await isPreviewEnabled())) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(postToMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control":
        post.status === "draft"
          ? "private, no-store"
          : "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
