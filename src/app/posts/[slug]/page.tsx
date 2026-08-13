import { notFound } from "next/navigation";
import {
  getPublicPostSlugs,
  getPostBySlug,
  postHasCustomLayout,
} from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { renderMDX } from "@/lib/mdx";
import { generatePostMetadata, generateArticleJsonLd } from "@/lib/seo";
import DefaultPostLayout from "@/components/DefaultPostLayout";
import DraftBanner from "@/components/DraftBanner";

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

// Plane Never Flying post imports
import PlaneNeverFlyingLayout from "../../../../content/posts/plane-never-flying/layout";
import PFSection from "../../../../content/posts/plane-never-flying/components/Section";
import PFLead from "../../../../content/posts/plane-never-flying/components/Lead";
import PFHighlight from "../../../../content/posts/plane-never-flying/components/Highlight";
import PFCallout from "../../../../content/posts/plane-never-flying/components/Callout";
import PFDivider from "../../../../content/posts/plane-never-flying/components/PostDivider";
import PFScene from "../../../../content/posts/plane-never-flying/components/Scene";
import PFKeyBox from "../../../../content/posts/plane-never-flying/components/KeyBox";
import PFPostImage from "../../../../content/posts/plane-never-flying/components/PostImage";
import {
  Blueprint,
  BlueprintItem,
} from "../../../../content/posts/plane-never-flying/components/Blueprint";
import PFFootnoteRef from "../../../../content/posts/plane-never-flying/components/FootnoteRef";
import {
  Footnotes as PFFootnotes,
  Footnote as PFFootnote,
} from "../../../../content/posts/plane-never-flying/components/Footnotes";

// Seven Bets post imports
import SevenBetsLayout from "../../../../content/posts/seven-bets/layout";
import SBBetHero from "../../../../content/posts/seven-bets/components/BetHero";
import SBCynefinPlate from "../../../../content/posts/seven-bets/components/CynefinPlate";
import SBLead from "../../../../content/posts/seven-bets/components/Lead";
import SBWagers from "../../../../content/posts/seven-bets/components/Wagers";
import SBTheSeven from "../../../../content/posts/seven-bets/components/TheSeven";
import SBTurn from "../../../../content/posts/seven-bets/components/Turn";
import SBClosing from "../../../../content/posts/seven-bets/components/Closing";
import SBWhyItMatters, {
  FullArgument as SBFullArgument,
} from "../../../../content/posts/seven-bets/components/WhyItMatters";

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
  "plane-never-flying": {
    Section: PFSection,
    Lead: PFLead,
    Highlight: PFHighlight,
    Callout: PFCallout,
    Divider: PFDivider,
    Scene: PFScene,
    KeyBox: PFKeyBox,
    PostImage: PFPostImage,
    Blueprint,
    BlueprintItem,
    FootnoteRef: PFFootnoteRef,
    Footnotes: PFFootnotes,
    Footnote: PFFootnote,
  },
  "seven-bets": {
    TheSeven: SBTheSeven,
    BetHero: SBBetHero,
    CynefinPlate: SBCynefinPlate,
    Lead: SBLead,
    Wagers: SBWagers,
    Turn: SBTurn,
    WhyItMatters: SBWhyItMatters,
    FullArgument: SBFullArgument,
    Closing: SBClosing,
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
  "plane-never-flying": PlaneNeverFlyingLayout,
  "seven-bets": SevenBetsLayout,
};

// Drafts are deliberately absent: they render on demand, and only for the
// author. Everyone else gets the 404 below.
export async function generateStaticParams() {
  return getPublicPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  if (post.status === "draft") {
    if (!(await isPreviewEnabled())) notFound();

    const metadata = generatePostMetadata(post);
    return {
      ...metadata,
      title: `[Draft] ${metadata.title}`,
      robots: { index: false, follow: false },
    };
  }

  return generatePostMetadata(post);
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const isDraft = post.status === "draft";
  if (isDraft && !(await isPreviewEnabled())) notFound();

  const components = postComponentsMap[slug] || {};
  const content = await renderMDX(post.content, components);
  const jsonLd = generateArticleJsonLd(post);

  if (postHasCustomLayout(slug)) {
    const CustomLayout = postLayoutMap[slug];
    if (CustomLayout) {
      return (
        <>
          {isDraft && <DraftBanner />}
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
      {isDraft && <DraftBanner />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DefaultPostLayout post={post}>{content}</DefaultPostLayout>
    </>
  );
}
