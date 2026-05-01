"use client";

import { useEffect, useRef, useCallback } from "react";

function getColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || fallback
  );
}

// Each section's visualization
interface SectionViz {
  label: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    y: number,
    r: number,
    progress: number,
    colors: Colors
  ) => void;
}

interface Colors {
  accent: string;
  secondary: string;
  ink: string;
  muted: string;
  divider: string;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// --- Section visualizations ---

// 01: Empty quadrant — dashed square with one corner highlighted
// All 9 visualizations share a consistent geometric vocabulary:
// circles, squares, lines — all centered on the vertical spine.
// Together they form a visual narrative: empty → filled.
// #1 is an empty dashed square. #9 is the same square, solid and filled.

// Shared: consistent stroke width
const SW = 1.5;

// 01: The Empty Quadrant — a dashed square, open, with nothing inside
function drawEmptyQuadrant(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const s = r * 0.9;
  ctx.save();
  ctx.globalAlpha = p * 0.7;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = SW;
  ctx.strokeRect(cx - s, y - s, s * 2, s * 2);
  ctx.setLineDash([]);
  ctx.restore();
}

// 02: The Technology Is Not the Companies — a circle bisected into two halves
// pulling apart — the technology on one side, the institutions on the other.
function drawBisect(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const rad = r * 0.7;
  const gap = r * 0.18 * p;
  ctx.save();
  ctx.lineWidth = SW;
  // Left half — the technology
  ctx.globalAlpha = p * 0.7;
  ctx.strokeStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(cx - gap, y, rad, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.stroke();
  // Right half — the companies (enters slightly delayed, in secondary color)
  const rp = Math.max(0, (p - 0.2) / 0.8);
  if (rp > 0) {
    ctx.globalAlpha = easeOut(rp) * 0.7;
    ctx.strokeStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(cx + gap, y, rad, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  ctx.restore();
}

// 03: The Landscape — a crosshair inside a circle, mapping the terrain
function drawFactions(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  ctx.save();
  ctx.globalAlpha = p * 0.6;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = SW;
  // Circle
  ctx.beginPath();
  ctx.arc(cx, y, r * 0.8 * p, 0, Math.PI * 2);
  ctx.stroke();
  // Crosshair
  const ch = r * 0.55 * p;
  ctx.beginPath();
  ctx.moveTo(cx - ch, y);
  ctx.lineTo(cx + ch, y);
  ctx.moveTo(cx, y - ch);
  ctx.lineTo(cx, y + ch);
  ctx.stroke();
  ctx.restore();
}

// 03: Two Commitments — two small circles flanking the line, connected
function drawTwoCommitments(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const spread = r * 0.8;
  const dotR = r * 0.18;
  ctx.save();
  // Connecting bar
  ctx.globalAlpha = p * 0.4;
  ctx.strokeStyle = colors.divider;
  ctx.lineWidth = SW;
  ctx.beginPath();
  ctx.moveTo(cx - spread, y);
  ctx.lineTo(cx + spread, y);
  ctx.stroke();
  // Left dot — abundance
  ctx.globalAlpha = p * 0.85;
  ctx.beginPath();
  ctx.arc(cx - spread, y, dotR * p, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  // Right dot — equity
  const rp = Math.max(0, (p - 0.2) / 0.8);
  if (rp > 0) {
    ctx.globalAlpha = easeOut(rp) * 0.85;
    ctx.beginPath();
    ctx.arc(cx + spread, y, dotR * easeOut(rp), 0, Math.PI * 2);
    ctx.fillStyle = colors.secondary;
    ctx.fill();
  }
  ctx.restore();
}

// 04: Build Smart — an upward arrow breaking through two horizontal rails (guardrails + momentum)
function drawBuildSmart(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const w = r * 0.8;
  const gap = r * 0.3;
  ctx.save();
  // Two horizontal rails (guardrails)
  ctx.strokeStyle = colors.muted;
  ctx.lineWidth = SW;
  ctx.globalAlpha = p * 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - w * p, y - gap);
  ctx.lineTo(cx + w * p, y - gap);
  ctx.moveTo(cx - w * p, y + gap);
  ctx.lineTo(cx + w * p, y + gap);
  ctx.stroke();
  // Upward arrow through the center (building through the rails)
  const arrowP = Math.max(0, (p - 0.25) / 0.75);
  if (arrowP > 0) {
    const ap = easeOut(arrowP);
    const arrowH = r * 0.7 * ap;
    ctx.globalAlpha = ap * 0.7;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = SW + 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, y + gap);
    ctx.lineTo(cx, y - arrowH);
    ctx.stroke();
    // Arrowhead
    if (arrowP > 0.5) {
      const hp = (arrowP - 0.5) / 0.5;
      ctx.globalAlpha = easeOut(hp) * 0.7;
      const hs = r * 0.15;
      const tipY = y - arrowH;
      ctx.beginPath();
      ctx.moveTo(cx - hs, tipY + hs);
      ctx.lineTo(cx, tipY);
      ctx.lineTo(cx + hs, tipY + hs);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// 06: Labor — three lines converging to center point
function drawConverge(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const spread = r * 0.75;
  ctx.save();
  ctx.lineWidth = SW;
  const angles = [-0.7, 0, 0.7]; // fan from above
  const lineColors = [colors.accent, colors.secondary, colors.accent];
  for (let i = 0; i < 3; i++) {
    const delay = i * 0.12;
    const lp = Math.max(0, (p - delay) / (1 - delay));
    if (lp <= 0) continue;
    ctx.globalAlpha = easeOut(lp) * 0.6;
    ctx.strokeStyle = lineColors[i];
    ctx.beginPath();
    const sx = cx + Math.sin(angles[i]) * spread;
    const sy = y - r * 0.6;
    const ex = lerp(sx, cx, easeOut(lp));
    const ey = lerp(sy, y + r * 0.15, easeOut(lp));
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
  // Convergence dot
  if (p > 0.6) {
    const dp = (p - 0.6) / 0.4;
    ctx.globalAlpha = easeOut(dp) * 0.7;
    ctx.beginPath();
    ctx.arc(cx, y + r * 0.15, r * 0.08 * easeOut(dp), 0, Math.PI * 2);
    ctx.fillStyle = colors.accent;
    ctx.fill();
  }
  ctx.restore();
}

// 07: 2028 — a diamond (rotated square) on the spine
function drawDiamond(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const s = r * 0.65;
  ctx.save();
  ctx.globalAlpha = p * 0.7;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = SW + 0.5;
  // Draw diamond progressively
  const pts = [[cx, y - s], [cx + s, y], [cx, y + s], [cx - s, y]] as const;
  const segs = p * 4;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < 4; i++) {
    if (segs <= i) break;
    const sp = Math.min(1, segs - i);
    const nx = (i + 1) % 4;
    ctx.lineTo(lerp(pts[i][0], pts[nx][0], sp), lerp(pts[i][1], pts[nx][1], sp));
  }
  ctx.stroke();
  // Faint fill when complete
  if (p > 0.85) {
    const fp = (p - 0.85) / 0.15;
    ctx.globalAlpha = easeOut(fp) * 0.06;
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const pt of pts) ctx.lineTo(pt[0], pt[1]);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// 08: Platform — five small horizontal ticks on the left of the line
function drawChecklist(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const tickW = r * 0.4;
  const gap = r * 0.3;
  const startY = y - gap * 2;
  ctx.save();
  ctx.lineWidth = SW + 0.5;
  for (let i = 0; i < 5; i++) {
    const delay = i * 0.1;
    const tp = Math.max(0, (p - delay) / (1 - delay));
    if (tp <= 0) continue;
    const ty = startY + i * gap;
    ctx.globalAlpha = easeOut(tp) * 0.6;
    ctx.strokeStyle = i === 4 ? colors.secondary : colors.accent;
    ctx.beginPath();
    ctx.moveTo(cx - tickW * easeOut(tp), ty);
    ctx.lineTo(cx + tickW * easeOut(tp), ty);
    ctx.stroke();
  }
  ctx.restore();
}

// 09: Fill the Quadrant — the same square as #1, now solid and filled
function drawArrow(
  ctx: CanvasRenderingContext2D, cx: number, y: number, r: number, progress: number, colors: Colors
) {
  const p = easeOut(progress);
  const s = r * 0.9; // same size as #1
  ctx.save();
  // Solid outline
  ctx.globalAlpha = p * 0.8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = SW + 0.5;
  ctx.strokeRect(cx - s, y - s, s * 2, s * 2);
  // Fill grows in
  if (p > 0.3) {
    const fp = (p - 0.3) / 0.7;
    ctx.globalAlpha = easeOut(fp) * 0.12;
    ctx.fillStyle = colors.accent;
    ctx.fillRect(cx - s, y - s, s * 2, s * 2);
  }
  // Small accent dot at center when complete
  if (p > 0.6) {
    const dp = (p - 0.6) / 0.4;
    ctx.globalAlpha = easeOut(dp) * 0.7;
    ctx.beginPath();
    ctx.arc(cx, y, r * 0.1 * easeOut(dp), 0, Math.PI * 2);
    ctx.fillStyle = colors.secondary;
    ctx.fill();
  }
  ctx.restore();
}

const SECTIONS: SectionViz[] = [
  { label: "01", draw: drawEmptyQuadrant },
  { label: "02", draw: drawBisect },
  { label: "03", draw: drawFactions },
  { label: "04", draw: drawTwoCommitments },
  { label: "05", draw: drawBuildSmart },
  { label: "06", draw: drawConverge },
  { label: "07", draw: drawDiamond },
  { label: "08", draw: drawChecklist },
  { label: "09", draw: drawArrow },
];

export default function ScrollArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const colors: Colors = {
      accent: getColor("--pa-accent", "#1e3a5f"),
      secondary: getColor("--pa-secondary", "#b91c1c"),
      ink: getColor("--pa-ink", "#0f0f0f"),
      muted: getColor("--pa-muted", "#6b7280"),
      divider: getColor("--pa-divider", "#e5e7eb"),
    };

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Calculate scroll progress through the prose area
    const prose = document.querySelector(".progressive-agenda-prose");
    if (!prose) return;

    const proseRect = prose.getBoundingClientRect();
    const viewH = window.innerHeight;
    const proseTop = proseRect.top;
    const proseH = proseRect.height;

    // scrollProgress: 0 until prose top reaches top of viewport (hero fully gone),
    // then grows to 1 as you scroll through the prose.
    const rawProgress = (-proseTop + viewH * 0.35) / proseH;
    const scrollProgress = Math.max(0, Math.min(1, rawProgress));

    const cx = w / 2;
    const sectionCount = SECTIONS.length;
    const vizRadius = Math.min(w * 0.18, 36);

    // Nothing to draw until we've scrolled into the prose
    if (scrollProgress <= 0) return;

    const topPad = 30;
    const bottomPad = 30;
    const usableH = h - topPad - bottomPad;

    // --- Compute section positions and line progress from DOM ---
    // Use h2 positions to map scroll position to a continuous 0..1 "section progress"
    // that moves faster through short sections and slower through long ones.
    const sectionEls = prose.querySelectorAll("h2");
    const triggerY = viewH * 0.7;
    const nodeYs: number[] = [];
    const vizProgresses: number[] = [];

    // Gather the scroll-space positions of each heading (as 0..1 within prose)
    const headingPositions: number[] = [];
    for (let i = 0; i < sectionCount; i++) {
      nodeYs.push(topPad + usableH * ((i + 0.5) / sectionCount));

      const heading = sectionEls[i];
      if (heading) {
        const headingRect = heading.getBoundingClientRect();
        // Position of this heading as a fraction of prose scroll
        const posInProse = (headingRect.top - proseRect.top) / proseH;
        headingPositions.push(posInProse);

        // Viz animation progress (triggers at 70% viewport)
        const raw = (triggerY - headingRect.top) / 200;
        vizProgresses.push(Math.max(0, Math.min(1, raw)));
      } else {
        headingPositions.push(i / sectionCount);
        vizProgresses.push(0);
      }
    }

    // --- Tracing line ---
    // Map scrollProgress to a line Y that moves between node positions
    // at a speed proportional to section length.
    // scrollProgress is 0..1 through the prose.
    // headingPositions[i] tells us when section i starts in scroll space.
    // We interpolate between nodeYs based on where scrollProgress falls
    // between consecutive headingPositions.
    // Line position: continuously interpolated between node positions
    // based on where scrollProgress falls between heading positions.
    // Before first viz triggers: nothing. Once triggered, use vizProgress
    // for initial growth, then headingPositions for smooth continuous movement.
    let lineEndY = 0;
    const firstTriggered = vizProgresses[0] > 0;

    if (firstTriggered) {
      // Find which segment we're in based on scroll position
      if (scrollProgress >= headingPositions[sectionCount - 1]) {
        // Past last heading
        const lastPos = headingPositions[sectionCount - 1];
        const t = Math.min(1, (scrollProgress - lastPos) / (1 - lastPos));
        lineEndY = lerp(nodeYs[sectionCount - 1], topPad + usableH, t);
      } else {
        let found = false;
        for (let i = 1; i < sectionCount; i++) {
          if (scrollProgress < headingPositions[i]) {
            const prevPos = headingPositions[i - 1];
            const range = headingPositions[i] - prevPos;
            const t = range > 0 ? (scrollProgress - prevPos) / range : 0;
            lineEndY = lerp(nodeYs[i - 1], nodeYs[i], Math.max(0, Math.min(1, t)));
            found = true;
            break;
          }
        }
        if (!found) {
          lineEndY = nodeYs[0];
        }
      }

      // For the very start, scale by first viz progress so it grows from 0
      if (vizProgresses[0] < 1) {
        lineEndY = Math.min(lineEndY, vizProgresses[0] * nodeYs[0]);
      }
    }

    // Ghost track — only visible below the active line tip
    if (lineEndY < topPad + usableH) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, lineEndY + 20);
      ctx.lineTo(cx, topPad + usableH);
      ctx.strokeStyle = colors.divider;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.15;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Active line
    if (lineEndY > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, lineEndY);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.45;
      ctx.stroke();
      ctx.restore();

      // Glowing tip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, lineEndY, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.8;
      ctx.fill();

      const glow = ctx.createRadialGradient(cx, lineEndY, 0, cx, lineEndY, 18);
      glow.addColorStop(0, colors.accent);
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, lineEndY, 18, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.15;
      ctx.fill();
      ctx.restore();
    }

    // --- Draw section visualizations ---
    for (let i = 0; i < sectionCount; i++) {
      const nodeY = nodeYs[i];
      const vizProgress = vizProgresses[i];

      if (vizProgress <= 0) continue;

      // Node dot on the line
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, nodeY, 4, 0, Math.PI * 2);
      ctx.fillStyle = vizProgress >= 0.5 ? colors.accent : colors.divider;
      ctx.globalAlpha = Math.min(1, vizProgress * 3);
      ctx.fill();

      // Section label
      ctx.font = `600 ${Math.max(9, w * 0.05)}px var(--pa-font-body), system-ui, sans-serif`;
      ctx.fillStyle = colors.divider;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 0.3;
      ctx.fillText(SECTIONS[i].label, cx, nodeY - vizRadius - 14);
      ctx.restore();

      // Draw the visualization
      ctx.save();
      SECTIONS[i].draw(ctx, cx, nodeY, vizRadius, vizProgress, colors);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className="pa-scroll-art"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
