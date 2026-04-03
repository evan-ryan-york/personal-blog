import type { Metadata } from "next";
import { Bitter, Fira_Code } from "next/font/google";
import { generateSiteMetadata } from "@/lib/seo";
import Footer from "@/components/Footer";
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

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <head>
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body
        className="flex min-h-full flex-col"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
