import Link from "next/link";
import type { Metadata } from "next";
import { authorName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Music",
  description: `Music by ${authorName}.`,
  alternates: { canonical: `${siteUrl}/music` },
  openGraph: {
    title: `Music · ${authorName}`,
    description: `Music by ${authorName}.`,
    url: `${siteUrl}/music`,
  },
};

const CATALOG_SRC =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2331126390&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false";

export default function MusicPage() {
  return (
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
          Music
        </h1>

        {/* The "Public" playlist (soundcloud.com/ryan_york/sets/public) sets
            the track order; reorder or add tracks there, not here. */}
        <iframe
          title="Ryan_York on SoundCloud"
          width="100%"
          height="450"
          allow="autoplay; encrypted-media"
          loading="lazy"
          src={CATALOG_SRC}
          className="block w-full border-0"
        />
      </div>
    </div>
  );
}
