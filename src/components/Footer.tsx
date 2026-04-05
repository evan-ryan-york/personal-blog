import SubscribeForm from "./SubscribeForm";

export default function Footer() {
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
          <p
            className="mt-4 text-xs text-muted/60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &copy; {new Date().getFullYear()} Ryan York
          </p>
        </div>
      </div>
    </footer>
  );
}
