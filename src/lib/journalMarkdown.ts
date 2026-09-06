import { Marked } from "marked";

/** How an uploaded screenshot is addressed inside an entry's markdown. */
const ASSET_PREFIX = "/api/journal/assets/";

/** The same `<uuid>.<ext>` shape `saveAsset` mints, matched inside prose. */
const ASSET_REFERENCE = /\/api\/journal\/assets\/([0-9a-f-]{36}\.(?:avif|gif|jpe?g|png|webp))/g;

/**
 * marked's own URL handling only runs the href through `encodeURI`, so a
 * `javascript:` link would survive it. Nothing but the author can write an
 * entry, but the output is a public URL, so pin links to protocols a reader
 * can safely follow.
 */
function isSafeUrl(href: string): boolean {
  return !/^\s*[a-z][a-z0-9+.-]*:/i.test(href) || /^\s*(?:https?|mailto):/i.test(href);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Every screenshot an entry actually references.
 *
 * The shared asset route uses this as its allow-list: holding one day's share
 * link must not turn into the ability to fetch arbitrary objects out of the
 * private bucket by guessing names.
 */
export function assetsReferencedIn(body: string): Set<string> {
  return new Set(
    Array.from(body.matchAll(ASSET_REFERENCE), (match) => match[1])
  );
}

/**
 * Markdown → HTML for a shared journal day.
 *
 * Deliberately not the MDX pipeline that renders posts. Posts are hand-authored
 * files whose JSX is part of the content; a journal entry is whatever Tiptap
 * serialized while the author typed, where a stray `<` or `{` is prose and must
 * render as prose rather than fail the page.
 */
export function renderJournalMarkdown(body: string, shareToken: string): string {
  const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      // Raw HTML in an entry is something the author typed, not something they
      // wrote to be executed. Showing it verbatim is both the honest reading
      // and the one that cannot smuggle a script onto a public URL.
      html({ text }) {
        return escapeHtml(text);
      },
      image({ href, title, text }) {
        const source = href.startsWith(ASSET_PREFIX)
          ? `/api/journal/shared/${shareToken}/assets/${href.slice(ASSET_PREFIX.length)}`
          : href;
        if (!isSafeUrl(source)) return escapeHtml(text);
        const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
        return `<img src="${escapeHtml(source)}" alt="${escapeHtml(text)}"${titleAttribute} loading="lazy" />`;
      },
      link({ href, title, tokens }) {
        const label = this.parser.parseInline(tokens);
        const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
        if (!isSafeUrl(href)) return label;
        const external = /^https?:\/\//i.test(href);
        const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeHtml(href)}"${titleAttribute}${rel}>${label}</a>`;
      },
    },
  });

  return marked.parse(body, { async: false });
}
