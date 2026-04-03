import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ryanyork.com";

export async function GET() {
  const posts = getAllPosts();

  const feed = new Feed({
    title: "Ryan York",
    description:
      "Writing about tech, product, politics, purpose, happiness, and education.",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    copyright: `Copyright ${new Date().getFullYear()} Ryan York`,
    author: {
      name: "Ryan York",
      link: siteUrl,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.frontmatter.title,
      id: `${siteUrl}/posts/${post.slug}`,
      link: `${siteUrl}/posts/${post.slug}`,
      description: post.frontmatter.description,
      date: new Date(post.frontmatter.date),
      category: post.frontmatter.tags.map((tag) => ({ name: tag })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
