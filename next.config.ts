import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingIncludes: {
    "/api/draft-assets/**": ["content/posts/*/assets/**/*"],
  },
};

export default nextConfig;
