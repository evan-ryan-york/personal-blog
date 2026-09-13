import type { Metadata } from "next";
import type { Post } from "./posts";
import { lastModifiedOf } from "./posts";
import {
  authorEmail,
  authorJobTitle,
  authorName,
  authorOrg,
  authorProfiles,
  authorTopics,
  ids,
  postMarkdownUrl,
  postUrl,
  siteDescription,
  siteName,
  siteTagline,
  siteUrl,
  tagUrl,
} from "./site";

/**
 * The social card for a post: its own art where it has some, and the generated
 * plate from `/api/og` where it doesn't.
 */
export function ogImageFor(post: Post): string {
  if (post.frontmatter.ogImage) return `${siteUrl}${post.frontmatter.ogImage}`;

  const params = new URLSearchParams({
    title: post.frontmatter.title,
    tags: post.frontmatter.tags.join(","),
  });
  return `${siteUrl}/api/og?${params}`;
}

const siteOgImage = `${siteUrl}/api/og?title=${encodeURIComponent(siteName)}`;

export function generatePostMetadata(post: Post): Metadata {
  const ogImageUrl = ogImageFor(post);
  const url = postUrl(post.slug);

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    authors: [{ name: authorName, url: siteUrl }],
    alternates: {
      canonical: url,
      types: {
        // The post as clean Markdown. Chat assistants and scrapers that follow
        // this land on prose instead of the post's bespoke JSX.
        "text/markdown": postMarkdownUrl(post.slug),
        "application/rss+xml": `${siteUrl}/feed.xml`,
      },
    },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      siteName,
      locale: "en_US",
      publishedTime: post.frontmatter.date,
      modifiedTime: lastModifiedOf(post),
      authors: [authorName],
      tags: post.frontmatter.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      creator: "@evan_ryan_york",
      images: [ogImageUrl],
    },
  };
}

export function generateSiteMetadata(): Metadata {
  return {
    // Every page below supplies only its own title; the template adds the rest.
    title: {
      default: `${siteName} — essays on AI, education, product, and politics`,
      template: `%s — ${siteName}`,
    },
    description: siteDescription,
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    authors: [{ name: authorName, url: siteUrl }],
    creator: authorName,
    publisher: authorName,
    keywords: authorTopics,
    alternates: {
      canonical: siteUrl,
      types: {
        "application/rss+xml": `${siteUrl}/feed.xml`,
        "application/atom+xml": `${siteUrl}/feed.atom`,
        "application/feed+json": `${siteUrl}/feed.json`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title: `${siteName} — essays on AI, education, product, and politics`,
      description: siteDescription,
      url: siteUrl,
      siteName,
      locale: "en_US",
      images: [{ url: siteOgImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      creator: "@evan_ryan_york",
      images: [siteOgImage],
    },
  };
}

/* ---------------------------------------------------------------------------
 * Structured data
 *
 * Every page emits one `@graph` rather than a scatter of separate <script>
 * blocks, and the nodes inside it reference each other by `@id`. That is what
 * lets a crawler read "this article was written by the person described on the
 * about page" instead of finding two unconnected assertions that both happen
 * to say "Ryan York".
 * ------------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = Record<string, any>;

/** The author. Defined once, referenced by `@id` from every other node. */
function personNode(): Node {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: authorName,
    url: `${siteUrl}/about`,
    email: authorEmail,
    jobTitle: authorJobTitle,
    worksFor: {
      "@type": "Organization",
      name: authorOrg.name,
      url: authorOrg.url,
    },
    knowsAbout: authorTopics,
    sameAs: authorProfiles,
  };
}

function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    inLanguage: "en-US",
    publisher: { "@id": ids.person },
    author: { "@id": ids.person },
  };
}

function graph(nodes: Node[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function breadcrumbNode(trail: { name: string; url: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** Person + WebSite. Emitted once, from the root layout, on every page. */
export function generateSiteJsonLd() {
  return graph([personNode(), websiteNode()]);
}

/** The homepage: the blog itself, plus its posts in order. */
export function generateBlogJsonLd(posts: Post[]) {
  return graph([
    {
      "@type": "Blog",
      "@id": ids.blog,
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      inLanguage: "en-US",
      author: { "@id": ids.person },
      publisher: { "@id": ids.person },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        "@id": postUrl(post.slug),
        headline: post.frontmatter.title,
        description: post.frontmatter.description,
        url: postUrl(post.slug),
        datePublished: post.frontmatter.date,
        author: { "@id": ids.person },
      })),
    },
  ]);
}

export function generateArticleJsonLd(post: Post) {
  const url = postUrl(post.slug);

  const nodes: Node[] = [
    {
      "@type": "BlogPosting",
      "@id": url,
      headline: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: post.frontmatter.date,
      dateModified: lastModifiedOf(post),
      author: { "@id": ids.person },
      publisher: { "@id": ids.person },
      isPartOf: { "@id": ids.blog },
      image: [ogImageFor(post)],
      keywords: post.frontmatter.tags,
      articleSection: post.frontmatter.tags,
      wordCount: post.wordCount,
      timeRequired: `PT${Math.max(1, Math.round(post.wordCount / 200))}M`,
      inLanguage: "en-US",
      // The TL;DR bullets, joined — this is the passage most likely to be
      // lifted whole into an AI overview, so it is stated outright.
      ...(post.frontmatter.tldr?.length
        ? { abstract: post.frontmatter.tldr.join(" ") }
        : {}),
      // Where the same post lives as plain Markdown.
      encoding: {
        "@type": "MediaObject",
        encodingFormat: "text/markdown",
        contentUrl: postMarkdownUrl(post.slug),
      },
    },
    breadcrumbNode([
      { name: "Home", url: siteUrl },
      { name: post.frontmatter.title, url },
    ]),
  ];

  // Only where the post genuinely asks and answers the question on the page.
  if (post.frontmatter.faq?.length) {
    nodes.push({
      "@type": "FAQPage",
      mainEntity: post.frontmatter.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return graph(nodes);
}

/** A tag page: a curated collection of posts on one subject. */
export function generateTagJsonLd(
  tag: string,
  description: string,
  posts: Post[]
) {
  const url = tagUrl(tag);

  return graph([
    {
      "@type": "CollectionPage",
      "@id": url,
      name: `${tag} — ${siteName}`,
      description,
      url,
      inLanguage: "en-US",
      isPartOf: { "@id": ids.website },
      about: { "@type": "Thing", name: tag },
      author: { "@id": ids.person },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: postUrl(post.slug),
          name: post.frontmatter.title,
        })),
      },
    },
    breadcrumbNode([
      { name: "Home", url: siteUrl },
      { name: tag, url },
    ]),
  ]);
}

/** The about page: a profile page whose subject is the author. */
export function generateAboutJsonLd() {
  const url = `${siteUrl}/about`;

  return graph([
    {
      "@type": "ProfilePage",
      "@id": url,
      url,
      name: `About ${authorName}`,
      inLanguage: "en-US",
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.person },
    },
    breadcrumbNode([
      { name: "Home", url: siteUrl },
      { name: "About", url },
    ]),
  ]);
}

/** Kept so callers don't have to remember the JSON.stringify dance. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data) };
}

export { siteTagline };
