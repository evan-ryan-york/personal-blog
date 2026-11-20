"use client";

import { useEffect, useRef } from "react";

// The fixed background layer behind the essay: dust in a beam of stage light
// (styled in post.css). This writes the scroll position into `--wa-sy` on the
// layer itself, not the article, so a scroll frame restyles a single div; the
// dust layers scroll at different speeds against it for parallax.

export default function BackgroundMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    function write() {
      frame = 0;
      el!.style.setProperty("--wa-sy", String(Math.round(window.scrollY)));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(write);
    }

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return <div ref={ref} aria-hidden className="wa-bg" />;
}
