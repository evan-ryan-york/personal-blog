/**
 * Shown only while previewing an unpublished post, so a draft is never
 * mistaken for the live thing.
 *
 * Deliberately not a session control. Being signed in is now a property of the
 * author, not of the page being read: it follows you across every route and
 * outlives the browser. Signing out lives in the footer, once, on purpose.
 */
export default function DraftBanner() {
  return (
    <div
      className="sticky top-0 z-50 flex items-center gap-4 bg-ink px-4 py-2 text-white"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="text-xs uppercase tracking-widest">
        Draft &mdash; visible only to you
      </span>
    </div>
  );
}
