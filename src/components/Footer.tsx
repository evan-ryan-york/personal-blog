import Link from "next/link";
import { isPreviewEnabled } from "@/lib/preview";
import LogoutButton from "./LogoutButton";
import SubscribeForm from "./SubscribeForm";

export default async function Footer() {
  const preview = await isPreviewEnabled();

  return (
    <footer className="mt-auto border-t border-paper-warm px-6 py-12 md:px-8">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <div>
          <h3
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Stay in the loop
          </h3>
          <p className="mb-4 text-sm text-muted" style={{ lineHeight: 1.6 }}>
            New posts delivered to your inbox. No spam, unsubscribe anytime.
          </p>
          <SubscribeForm />
        </div>
        <div className="flex flex-col justify-between text-right">
          <p className="text-sm leading-relaxed text-muted">
            Writing about tech, product, politics, purpose, happiness, and
            education.
          </p>
          <p className="mt-4 text-sm text-muted">
            <a
              href="mailto:ryan@ryanyork.io"
              className="transition-colors hover:text-accent"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ryan@ryanyork.io
            </a>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4">
            {preview ? (
              <>
                <Link
                  href="/journal"
                  className="rounded border border-paper-warm px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Journal
                </Link>
                <Link
                  href="/drafts"
                  className="rounded border border-paper-warm px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Drafts
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded border border-paper-warm px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Login
              </Link>
            )}
            <p
              className="text-xs text-muted/60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              &copy; {new Date().getFullYear()} Ryan York
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
