import { buildFeed, feedHeaders } from "@/lib/feed";

export async function GET() {
  return new Response(buildFeed().rss2(), {
    headers: feedHeaders("application/rss+xml"),
  });
}
