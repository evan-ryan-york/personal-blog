import { getAllPosts, getAllTags } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { generateBlogJsonLd, jsonLdScript } from "@/lib/seo";
import HomeContent from "@/components/HomeContent";

export default async function HomePage() {
  const includeDrafts = await isPreviewEnabled();
  const posts = getAllPosts({ includeDrafts });
  const tags = getAllTags({ includeDrafts });

  const serializedTags = Array.from(tags.entries());

  return (
    <>
      {/* The Person and WebSite nodes come from the root layout; this adds the
          blog itself and its posts, which reference those by @id. Drafts are
          left out even in preview — they are not part of the public record. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(generateBlogJsonLd(getAllPosts()))}
      />
      <HomeContent posts={posts} tags={serializedTags} preview={includeDrafts} />
    </>
  );
}
