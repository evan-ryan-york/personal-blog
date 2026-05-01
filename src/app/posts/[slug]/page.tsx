import { notFound } from "next/navigation";
import {
  getAllRoutablePostSlugs,
  getPostBySlug,
  postHasCustomLayout,
} from "@/lib/posts";
import { renderMDX } from "@/lib/mdx";
import { generatePostMetadata, generateArticleJsonLd } from "@/lib/seo";
import DefaultPostLayout from "@/components/DefaultPostLayout";

// Post-specific imports
import LivingProductLayout from "../../../../content/posts/the-living-product/layout";
import ScrollReveal from "../../../../content/posts/the-living-product/components/ScrollReveal";
import Section from "../../../../content/posts/the-living-product/components/Section";
import Lead from "../../../../content/posts/the-living-product/components/Lead";
import Callout from "../../../../content/posts/the-living-product/components/Callout";
import PostDivider from "../../../../content/posts/the-living-product/components/PostDivider";
import {
  Flow,
  FlowStep,
  SystemLabel,
  SystemSubtitle,
} from "../../../../content/posts/the-living-product/components/FlowComponents";
import {
  Barriers,
  BarrierCard,
} from "../../../../content/posts/the-living-product/components/BarrierComponents";
import PostImage from "../../../../content/posts/the-living-product/components/PostImage";
import Highlight from "../../../../content/posts/the-living-product/components/Highlight";

// Progressive Agenda post imports
import ProgressiveAgendaLayout from "../../../../content/posts/progressive-agenda/layout";
import PAScrollReveal from "../../../../content/posts/progressive-agenda/components/ScrollReveal";
import PASection from "../../../../content/posts/progressive-agenda/components/Section";
import PACallout from "../../../../content/posts/progressive-agenda/components/Callout";
import PADivider from "../../../../content/posts/progressive-agenda/components/PostDivider";
import PAHighlight from "../../../../content/posts/progressive-agenda/components/Highlight";
import QuadrantChart from "../../../../content/posts/progressive-agenda/components/QuadrantChart";
import FootnoteRef from "../../../../content/posts/progressive-agenda/components/FootnoteRef";
import {
  Footnotes,
  Footnote,
} from "../../../../content/posts/progressive-agenda/components/Footnotes";
import { PlatformSection } from "../../../../content/posts/progressive-agenda/components/PlatformList";
import {
  StatRow,
  Stat,
} from "../../../../content/posts/progressive-agenda/components/StatRow";
import {
  ThreeUp,
  ColumnCard,
} from "../../../../content/posts/progressive-agenda/components/ThreeUp";
import {
  BulletList,
  Bullet,
} from "../../../../content/posts/progressive-agenda/components/BulletList";
import ScrollArt from "../../../../content/posts/progressive-agenda/components/ScrollArt";

import CommentSection from "@/components/CommentSection";
import type { Metadata } from "next";
import type { ComponentType } from "react";

type Params = Promise<{ slug: string }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

// Map of slug -> custom components for MDX rendering
const postComponentsMap: Record<string, Record<string, AnyComponent>> = {
  "the-living-product": {
    ScrollReveal,
    Section,
    Lead,
    Callout,
    Divider: PostDivider,
    Flow,
    FlowStep,
    SystemLabel,
    SystemSubtitle,
    Barriers,
    BarrierCard,
    PostImage,
    Highlight,
  },
  "progressive-agenda": {
    ScrollReveal: PAScrollReveal,
    Section: PASection,
    Callout: PACallout,
    Divider: PADivider,
    Highlight: PAHighlight,
    QuadrantChart,
    FootnoteRef,
    Footnotes,
    Footnote,
    PlatformSection,
    StatRow,
    Stat,
    ThreeUp,
    ColumnCard,
    BulletList,
    Bullet,
    ScrollArt,
  },
};

// Map of slug -> custom layout
const postLayoutMap: Record<
  string,
  ComponentType<{
    post: NonNullable<ReturnType<typeof getPostBySlug>>;
    children: React.ReactNode;
  }>
> = {
  "the-living-product": LivingProductLayout,
  "progressive-agenda": ProgressiveAgendaLayout,
};

export async function generateStaticParams() {
  return getAllRoutablePostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  if (
    post.frontmatter.status === "draft" &&
    process.env.NODE_ENV !== "development"
  )
    notFound();

  const components = postComponentsMap[slug] || {};
  const content = await renderMDX(post.content, components);
  const jsonLd = generateArticleJsonLd(post);

  if (postHasCustomLayout(slug)) {
    const CustomLayout = postLayoutMap[slug];
    if (CustomLayout) {
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <CustomLayout post={post}>{content}</CustomLayout>
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <CommentSection slug={slug} />
          </div>
        </>
      );
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DefaultPostLayout post={post}>{content}</DefaultPostLayout>
    </>
  );
}
