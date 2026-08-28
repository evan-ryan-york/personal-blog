import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isJournalConfigured, listEntries } from "@/lib/journal";
import { isPreviewEnabled } from "@/lib/preview";
import DraftBanner from "@/components/DraftBanner";
import JournalEditor, {
  type JournalDaySummary,
} from "@/components/JournalEditor";

export const metadata: Metadata = {
  title: "Journal — Ryan York",
  robots: { index: false, follow: false },
};

// Never prerender: this page's contents depend entirely on who's asking.
export const dynamic = "force-dynamic";

/** A one-line gist of an entry for the sidebar — no markdown syntax, no images. */
function previewOf(body: string): string {
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[#>*_`\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

export default async function JournalPage() {
  if (!(await isPreviewEnabled())) notFound();

  const configured = isJournalConfigured();
  const recentDays: JournalDaySummary[] = configured
    ? (await listEntries()).map((entry) => ({
        entryDay: entry.entryDay,
        preview: previewOf(entry.body),
      }))
    : [];

  return (
    <>
      <DraftBanner />
      <section className="px-6 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-8 inline-block text-sm font-medium tracking-tight text-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ryan York
          </Link>

          {configured ? (
            <JournalEditor recentDays={recentDays} />
          ) : (
            <p className="text-sm text-muted">
              The journal needs <code>SUPABASE_PRIVATE_KEY</code> set before it
              can store entries.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
