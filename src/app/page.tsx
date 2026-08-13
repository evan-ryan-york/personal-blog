import { getAllPosts, getAllTags } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { generateWebsiteJsonLd } from "@/lib/seo";
import HomeContent from "@/components/HomeContent";

export default async function HomePage() {
  const includeDrafts = await isPreviewEnabled();
  const posts = getAllPosts({ includeDrafts });
  const tags = getAllTags({ includeDrafts });
  const jsonLd = generateWebsiteJsonLd();

  const serializedTags = Array.from(tags.entries());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent posts={posts} tags={serializedTags} preview={includeDrafts} />
    </>
  );
}
