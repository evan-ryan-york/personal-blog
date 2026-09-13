import { buildFeed, feedHeaders } from "@/lib/feed";

export async function GET() {
  return new Response(buildFeed().json1(), {
    headers: feedHeaders("application/feed+json"),
  });
}
