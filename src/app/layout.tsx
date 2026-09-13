import type { Metadata } from "next";
import { Bitter, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { generateSiteMetadata, generateSiteJsonLd, jsonLdScript } from "@/lib/seo";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

const bitter = Bitter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bitterBody = Bitter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const fontVars = `${bitter.variable} ${bitterBody.variable} ${firaCode.variable}`;

export const metadata: Metadata = generateSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      <body
        className="flex min-h-dvh flex-col"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Who wrote this site and what it is — stated once, on every page, so
            the per-page graphs below can reference it by @id. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(generateSiteJsonLd())}
        />
        <PostHogProvider>
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
