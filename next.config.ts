import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingIncludes: {
    "/api/draft-assets/**": ["content/posts/*/assets/**/*"],
  },
  async rewrites() {
    return {
      // Before the filesystem, so `/posts/seven-bets.md` reaches the handler
      // rather than falling through to the `[slug]` page with a slug of
      // "seven-bets.md". `:slug` stops at the literal `.md` that follows it.
      beforeFiles: [
        {
          source: "/posts/:slug.md",
          destination: "/api/posts/:slug/markdown",
        },
      ],
    };
  },
};

export default nextConfig;
