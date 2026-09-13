import { getAllPosts } from "@/lib/posts";
import { postToMarkdown } from "@/lib/postMarkdown";
import { postUrl, siteDescription, siteName, siteUrl } from "@/lib/site";

/**
 * `/llms-full.txt` — the whole corpus as one Markdown document.
 *
 * `/llms.txt` is an index a model has to follow links from; this is the thing
 * it can ingest in a single fetch. At four essays that is a comfortable size,
 * and it means an assistant asked about anything Ryan has written can have all
 * of it without a crawl.
 */
export async function GET() {
  const posts = getAllPosts();

  const header = [
    `# ${siteName} — complete writing`,
    "",
    `> ${siteDescription}`,
    "",
    `Every published post, in full, newest first. Generated ${new Date()
      .toISOString()
      .slice(0, 10)} from ${siteUrl}.`,
    "",
    "## Contents",
    "",
    ...posts.map(
      (post, index) =>
        `${index + 1}. [${post.frontmatter.title}](${postUrl(post.slug)}) — ${
          post.frontmatter.description
        }`
    ),
    "",
  ].join("\n");

  const body = posts
    .map((post) => postToMarkdown(post))
    .join("\n\n<!-- next post -->\n\n");

  return new Response(`${header}\n${body}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
