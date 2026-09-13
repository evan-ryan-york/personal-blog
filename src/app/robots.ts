import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Replaces the old static `public/robots.txt`, which was silent about AI
 * crawlers and about the parts of the site that should never be indexed.
 *
 * The assistant crawlers are named and allowed on purpose. Several of them
 * (Google-Extended, Applebot-Extended) do nothing but govern whether the
 * content may be used in AI answers, and saying nothing is not the same as
 * saying yes — the default for some is to fall back to a publisher's other
 * signals. Being explicit is the whole point.
 *
 * `/journal`, `/drafts` and `/login` are already `noindex` in their own
 * metadata; disallowing them here saves the crawl as well as the index.
 */

const AI_CRAWLERS = [
  // OpenAI: training, search index, and live user-initiated fetches.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Google and Apple's AI-specific opt-in controls.
  "Google-Extended",
  "Applebot-Extended",
  // Common Crawl, which feeds a long tail of models.
  "CCBot",
  // Meta, Amazon, Mistral, You.com, Bytedance.
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "MistralAI-User",
  "YouBot",
  "Bytespider",
];

const PRIVATE_PATHS = ["/api/", "/journal", "/drafts", "/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
