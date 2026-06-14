"use client";

import { useEffect, useRef } from "react";

// Body backdrop: a faint dot grid that drifts slowly and continuously, over a
// base color that warms as you scroll — endpoints from the Blueprint theme:
// cool blueprint paper -> warm aged cream.
const START: [number, number, number] = [232, 238, 241]; // light cold steel
const END: [number, number, number] = [248, 246, 238]; // almost white, faint warm

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

export default function GridBackground() {
  const baseRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let pending = false;

    const applyScroll = () => {
      pending = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // smoothstep — warm-up sits mostly in the back half, nearly invisible
      // within any single scroll
      const t = p * p * (3 - 2 * p);
      const r = lerp(START[0], END[0], t);
      const g = lerp(START[1], END[1], t);
      const b = lerp(START[2], END[2], t);
      if (baseRef.current) {
        baseRef.current.style.background = `rgb(${r}, ${g}, ${b})`;
      }
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyScroll);
      }
    };

    const tick = (t: number) => {
      // continuous, organic drift — two slow sine waves per axis at different
      // periods so the motion never visibly repeats (fluid feel)
      const ax = Math.sin(t * 0.00028) * 5 + Math.sin(t * 0.00017) * 2.5;
      const ay = Math.cos(t * 0.00022) * 5 + Math.cos(t * 0.00039) * 2.5;
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${ax.toFixed(
          2
        )}px, ${ay.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    applyScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      {/* Base color — interpolated on scroll */}
      <div
        ref={baseRef}
        className="absolute inset-0"
        style={{
          background: `rgb(${START[0]}, ${START[1]}, ${START[2]})`,
          transition: "background 0.15s linear",
        }}
      />
      {/* Dot grid — slightly oversized so the drift never reveals an edge */}
      <div
        ref={gridRef}
        className="absolute"
        style={{
          inset: "-48px",
          backgroundImage:
            "radial-gradient(circle, rgba(12,49,55,0.08) 0.7px, transparent 1.4px)",
          backgroundSize: "13px 13px",
          willChange: "transform",
        }}
      />
    </div>
  );
}
