import Link from "next/link";

export default function Header() {
  return (
    <header className="px-6 py-6 md:px-8">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ink transition-colors hover:text-accent"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ryan York
        </Link>
        <Link
          href="/feed.xml"
          className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          RSS
        </Link>
      </nav>
    </header>
  );
}
