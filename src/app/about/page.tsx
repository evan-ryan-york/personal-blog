import Link from "next/link";
import type { Metadata } from "next";
import AboutBio from "@/components/AboutBio";
import WorkingOn from "@/components/WorkingOn";
import { generateAboutJsonLd, jsonLdScript } from "@/lib/seo";
import { authorName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ryan York is a product and technology leader writing about AI, education, product, and politics. CPTO at Willow Education, and the founder of Clearwater in Accra, Ghana.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    type: "profile",
    title: `About ${authorName}`,
    description:
      "Product and technology leader writing about AI, education, product, and politics.",
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(generateAboutJsonLd())}
      />

      <div className="px-6 py-12 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-10 inline-block text-sm font-medium tracking-tight text-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ryan York
          </Link>

          <h1
            className="mb-8 text-4xl font-bold tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            About
          </h1>

          <AboutBio />
        </div>
      </div>

      <WorkingOn />
    </>
  );
}
