import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, lastModifiedOf } from "@/lib/posts";
import { siteUrl, tagUrl, postUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  // The newest post is the best proxy for when the site itself last changed.
  const newest = posts[0] ? new Date(lastModifiedOf(posts[0])) : new Date();

  const postUrls = posts.map((post) => ({
    url: postUrl(post.slug),
    lastModified: new Date(lastModifiedOf(post)),
    priority: 0.9,
    // Declaring the post's art here is what gets it considered for image
    // search, which the page's OG tag alone does not do.
    ...(post.frontmatter.ogImage
      ? { images: [`${siteUrl}${post.frontmatter.ogImage}`] }
      : {}),
  }));

  const tagUrls = Array.from(tags.keys()).map((tag) => ({
    url: tagUrl(tag),
    lastModified: newest,
    priority: 0.5,
  }));

  return [
    { url: siteUrl, lastModified: newest, priority: 1 },
    { url: `${siteUrl}/about`, lastModified: newest, priority: 0.7 },
    ...postUrls,
    ...tagUrls,
  ];
}
