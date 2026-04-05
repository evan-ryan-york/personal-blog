import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ryanyork.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagUrls = Array.from(tags.keys()).map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postUrls,
    ...tagUrls,
  ];
}
