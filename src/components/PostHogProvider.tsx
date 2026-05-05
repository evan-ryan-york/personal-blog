"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
      ip: true,
    });
    // Debug: surface runtime config + expose client globally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = posthog as any;
    // eslint-disable-next-line no-console
    console.log("[posthog] initialized", {
      ip: ph.config?.ip,
      api_host: ph.config?.api_host,
      capture_pageview: ph.config?.capture_pageview,
      distinct_id: ph.get_distinct_id?.(),
      version: ph.LIB_VERSION ?? ph.config?.LIB_VERSION,
    });
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).posthog = posthog;
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || !pathname) return;
    const query = searchParams?.toString();
    const url = query
      ? `${window.location.origin}${pathname}?${query}`
      : `${window.location.origin}${pathname}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}
