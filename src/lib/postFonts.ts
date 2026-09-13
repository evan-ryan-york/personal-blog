import {
  Cormorant_Garamond,
  EB_Garamond,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter,
  Space_Mono,
  Spectral,
} from "next/font/google";

/**
 * The typefaces the three custom post designs are built on.
 *
 * They used to arrive as `<link rel="stylesheet">` tags rendered inside the
 * post layouts, which is about the worst way to load a font: render-blocking,
 * a third-party round trip before any text can paint, and a guaranteed layout
 * shift when it lands. `next/font` downloads and self-hosts them at build time
 * and generates the `@font-face` rules up front, so the text paints once.
 *
 * Declared here rather than in `src/app/layout.tsx` so the homepage does not
 * pay for a post's typography.
 *
 * `preload: false` on every one of them is deliberate. `src/app/posts/[slug]`
 * statically imports all four post layouts, so any post route pulls all of
 * these families into its CSS whether or not it uses them — preloading would
 * have every post eagerly download two dozen font files. Without it the
 * browser fetches only the faces the rendered page actually references, and
 * `display: "swap"` covers the gap. The site fonts in `src/app/layout.tsx`
 * keep their preload, since every page genuinely uses them.
 */

/* Seven Bets — an engraved plate. */
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
  preload: false,
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

/* This Plane Was Never Going to Fly. */
export const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
  preload: false,
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

/* The Empty Quadrant. The old stylesheet pulled ten families here; the design
   only ever used these two. The other eight were left over from a scrapped
   design explorer and were downloaded by every reader of the post. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const sevenBetsFonts = `${cormorantGaramond.variable} ${ebGaramond.variable} ${spaceMono.variable}`;
export const planeFonts = `${spectral.variable} ${ibmPlexMono.variable}`;
export const progressiveAgendaFonts = `${instrumentSerif.variable} ${inter.variable}`;
