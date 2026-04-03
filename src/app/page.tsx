import { getAllPosts, getAllTags } from "@/lib/posts";
import { generateWebsiteJsonLd } from "@/lib/seo";
import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const jsonLd = generateWebsiteJsonLd();

  const serializedTags = Array.from(tags.entries());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent posts={posts} tags={serializedTags} />
    </>
  );
}
