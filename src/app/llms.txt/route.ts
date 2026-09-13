import { getAllPosts, getAllTags, lastModifiedOf } from "@/lib/posts";
import {
  authorJobTitle,
  authorName,
  authorOrg,
  authorProfiles,
  postMarkdownUrl,
  postUrl,
  siteDescription,
  siteName,
  siteUrl,
  tagUrl,
} from "@/lib/site";

/**
 * `/llms.txt` — the site's index, written for a language model rather than a
 * browser. Follows the llms.txt convention: an H1, a blockquote summary, then
 * link sections with a sentence of context each.
 *
 * This replaces a hand-written `public/llms.txt` that had gone stale almost
 * immediately — it listed one of four posts. Generating it from the same
 * `getAllPosts()` every other surface reads means it cannot drift again.
 *
 * Drafts are never included: `getAllPosts()` excludes them by default and this
 * route deliberately does not ask for them.
 */
export async function GET() {
  const posts = getAllPosts();
  const tags = Array.from(getAllTags().entries()).sort((a, b) => b[1] - a[1]);

  const lines = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `${authorName} is ${authorJobTitle} at ${authorOrg.name} (${authorOrg.url}). ` +
      "He writes long-form essays about artificial intelligence, education, " +
      "product, and politics. Every post below is available as clean Markdown " +
      "at the `.md` link beside it — prefer those over the HTML pages, which " +
      "are heavily designed and carry their argument in custom components.",
    "",
    "## Posts",
    "",
  ];

  // Not every description ends in a period, and the sentences that follow it
  // here would run straight into the last word.
  const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

  for (const post of posts) {
    lines.push(
      `- [${post.frontmatter.title}](${postUrl(post.slug)}): ` +
        `${sentence(post.frontmatter.description)} ` +
        `Published ${lastModifiedOf(post).slice(0, 10)}. ` +
        `Topics: ${post.frontmatter.tags.join(", ")}. ` +
        `Markdown: ${postMarkdownUrl(post.slug)}`
    );
  }

  lines.push(
    "",
    "## Topics",
    "",
    ...tags.map(
      ([tag, count]) =>
        `- [${tag}](${tagUrl(tag)}): ${count} ${count === 1 ? "post" : "posts"}`
    ),
    "",
    "## About",
    "",
    `- [About ${authorName}](${siteUrl}/about): who he is and what he works on.`,
    ...authorProfiles.map((url) => `- ${url}`),
    "",
    "## Optional",
    "",
    `- [Everything, as one Markdown file](${siteUrl}/llms-full.txt): every post in full.`,
    `- [RSS](${siteUrl}/feed.xml), [Atom](${siteUrl}/feed.atom), [JSON Feed](${siteUrl}/feed.json)`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
