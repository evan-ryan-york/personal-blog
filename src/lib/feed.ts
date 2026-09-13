import { Feed } from "feed";
import { Marked } from "marked";
import { getAllPosts, lastModifiedOf, type Post } from "./posts";
import { postBodyToMarkdown } from "./postMarkdown";
import { ogImageFor } from "./seo";
import {
  authorEmail,
  authorName,
  postUrl,
  siteDescription,
  siteName,
  siteUrl,
} from "./site";

/**
 * The feed, in all three formats.
 *
 * Built once here rather than three times in three routes — the only thing
 * that differed between them was which serializer ran at the end.
 *
 * Items carry the full post, not just its description. A summary-only feed
 * asks every reader and every aggregator to come back for the actual text;
 * shipping the whole thing means feed readers, newsletter tools, and the
 * crawlers that ingest feeds all get the essay itself.
 */

// Posts are authored MDX, so the Markdown reaching this has already been
// through `postBodyToMarkdown`. No custom renderer: unlike the journal, there
// is no untrusted input here and the components are already gone.
const marked = new Marked({ gfm: true });

function postToHtml(post: Post): string {
  const body = marked.parse(postBodyToMarkdown(post.content), {
    async: false,
  }) as string;

  const tldr = post.frontmatter.tldr?.length
    ? `<h2>TL;DR</h2><ul>${post.frontmatter.tldr
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`
    : "";

  return `${tldr}${body}`;
}

export function buildFeed(): Feed {
  const posts = getAllPosts();

  const feed = new Feed({
    title: siteName,
    description: siteDescription,
    id: siteUrl,
    link: siteUrl,
    language: "en",
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `Copyright ${new Date().getFullYear()} ${authorName}`,
    updated: posts[0] ? new Date(lastModifiedOf(posts[0])) : new Date(),
    feedLinks: {
      rss: `${siteUrl}/feed.xml`,
      atom: `${siteUrl}/feed.atom`,
      json: `${siteUrl}/feed.json`,
    },
    author: {
      name: authorName,
      email: authorEmail,
      link: siteUrl,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.frontmatter.title,
      id: postUrl(post.slug),
      link: postUrl(post.slug),
      description: post.frontmatter.description,
      content: postToHtml(post),
      date: new Date(lastModifiedOf(post)),
      published: new Date(post.frontmatter.date),
      image: ogImageFor(post),
      author: [{ name: authorName, email: authorEmail, link: siteUrl }],
      category: post.frontmatter.tags.map((tag) => ({ name: tag })),
    });
  }

  return feed;
}

export const feedHeaders = (contentType: string) => ({
  "Content-Type": `${contentType}; charset=utf-8`,
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
});
