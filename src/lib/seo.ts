import type { Metadata } from "next";
import type { Post } from "./posts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ryanyork.io";

export function generatePostMetadata(post: Post): Metadata {
  const ogImageUrl = post.frontmatter.ogImage
    ? `${siteUrl}${post.frontmatter.ogImage}`
    : `${siteUrl}/api/og?title=${encodeURIComponent(post.frontmatter.title)}&tags=${encodeURIComponent(post.frontmatter.tags.join(","))}`;

  return {
    title: `${post.frontmatter.title} — Ryan York`,
    description: post.frontmatter.description,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImageUrl],
    },
  };
}

export function generateSiteMetadata(): Metadata {
  return {
    title: "Ryan York",
    description:
      "Writing about tech, product, politics, purpose, happiness, and education.",
    metadataBase: new URL(siteUrl),
    alternates: {
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type: "website",
      title: "Ryan York",
      description:
        "Writing about tech, product, politics, purpose, happiness, and education.",
      url: siteUrl,
    },
  };
}

export function generateArticleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Ryan York",
      url: siteUrl,
    },
    url: `${siteUrl}/posts/${post.slug}`,
    keywords: post.frontmatter.tags,
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ryan York",
    description:
      "Writing about tech, product, politics, purpose, happiness, and education.",
    url: siteUrl,
    author: {
      "@type": "Person",
      name: "Ryan York",
    },
  };
}
