import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Ryan York",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="px-6 py-24 md:px-8">
      <div className="mx-auto max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium tracking-tight text-muted transition-colors hover:text-accent"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ryan York
        </Link>
        <h1
          className="mb-2 text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
          }}
        >
          Sign in
        </h1>
        <p className="mb-6 text-sm text-muted" style={{ lineHeight: 1.6 }}>
          Author access — unlocks drafts before they&rsquo;re published.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
