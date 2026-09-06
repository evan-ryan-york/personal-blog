import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSharedEntry, isValidShareToken } from "@/lib/journal";
import { renderJournalMarkdown } from "@/lib/journalMarkdown";

type Params = Promise<{ token: string }>;

// The token is the whole of the authorization, so this page can never be
// prerendered or cached — unsharing has to take effect on the next request.
export const dynamic = "force-dynamic";

/** `YYYY-MM-DD` read as a plain calendar day, not shifted by the server's zone. */
function formatDay(entryDay: string): string {
  return new Date(`${entryDay}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  const entry = isValidShareToken(token) ? await getSharedEntry(token) : null;
  if (!entry) return { robots: { index: false, follow: false } };

  return {
    title: `Journal — ${formatDay(entry.entryDay)} — Ryan York`,
    // A shared link is meant for the people it was handed to, not for search.
    robots: { index: false, follow: false },
  };
}

export default async function SharedJournalPage({ params }: { params: Params }) {
  const { token } = await params;
  const entry = isValidShareToken(token) ? await getSharedEntry(token) : null;
  if (!entry) notFound();

  const html = renderJournalMarkdown(entry.body, token);

  return (
    <section className="px-6 py-12 md:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-paper-warm pb-6">
          <p
            className="mb-2 text-xs uppercase tracking-widest text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Journal
          </p>
          <h1
            className="text-2xl font-bold tracking-tight md:text-3xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {formatDay(entry.entryDay)}
          </h1>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-semibold prose-img:rounded-md prose-img:border prose-img:border-paper-warm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </section>
  );
}
