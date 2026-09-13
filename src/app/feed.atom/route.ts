import { buildFeed, feedHeaders } from "@/lib/feed";

export async function GET() {
  return new Response(buildFeed().atom1(), {
    headers: feedHeaders("application/atom+xml"),
  });
}
