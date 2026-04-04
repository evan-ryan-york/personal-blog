import type { Metadata } from "next";
import { Bitter, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
