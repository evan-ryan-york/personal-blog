"use client";

import { useEffect, useRef, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";

function getColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return val || fallback;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

export default function QuadrantChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const accent = getColor("--pa-accent", "#1e3a5f");
    const secondary = getColor("--pa-secondary", "#b91c1c");
    const ink = getColor("--pa-ink", "#0f0f0f");
    const muted = getColor("--pa-muted", "#6b7280");
    const divider = getColor("--pa-divider", "#e5e7eb");
    const fontDisplay = getColor("--pa-font-display", '"Instrument Serif", Georgia, serif');
    const fontBody = getColor("--pa-font-body", '"Inter", system-ui, sans-serif');

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = w * 0.75;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Dimensions
    const margin = { top: 36, right: 28, bottom: 52, left: 60 };
    const chartW = w - margin.left - margin.right;
    const chartH = h - margin.top - margin.bottom;
    const cx = margin.left + chartW / 2;
    const cy = margin.top + chartH / 2;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // --- Quadrant fills ---
    // Top-left (The Right) — light gray
    ctx.fillStyle = "#f6f6f4";
    ctx.fillRect(margin.left, margin.top, chartW / 2, chartH / 2);

    // Bottom-left (Soft Center) — light gray
    ctx.fillStyle = "#f3f3f1";
    ctx.fillRect(margin.left, cy, chartW / 2, chartH / 2);

    // Bottom-right (Progressives Today) — light gray
    ctx.fillStyle = "#f6f6f4";
    ctx.fillRect(cx, cy, chartW / 2, chartH / 2);

    // Top-right (Progressive Abundance Agenda) — highlighted
    const hlGrad = ctx.createLinearGradient(cx, margin.top, cx + chartW / 2, cy);
    hlGrad.addColorStop(0, hexToRgba(accent, 0.06));
    hlGrad.addColorStop(1, hexToRgba(secondary, 0.04));
    ctx.fillStyle = hlGrad;
    ctx.fillRect(cx, margin.top, chartW / 2, chartH / 2);

    // Highlighted border
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx + 1, margin.top + 1, chartW / 2 - 2, chartH / 2 - 2);

    // --- Axes ---
    ctx.strokeStyle = divider;
    ctx.lineWidth = 1;

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(margin.left, cy);
    ctx.lineTo(margin.left + chartW, cy);
    ctx.stroke();

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(cx, margin.top);
    ctx.lineTo(cx, margin.top + chartH);
    ctx.stroke();

    // Outer border
    ctx.strokeStyle = divider;
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, chartW, chartH);

    // --- Axis arrows and labels ---
    const labelFont = `600 ${Math.max(11, w * 0.018)}px ${fontBody}`;
    const labelColor = muted;

    // X-axis label (bottom center)
    ctx.font = labelFont;
    ctx.fillStyle = labelColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.letterSpacing = "1.5px";
    ctx.fillText("EQUITABLE DISTRIBUTION →", cx, margin.top + chartH + 16);

    // Y-axis label (left center, rotated)
    ctx.save();
    ctx.translate(14, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ABUNDANCE AGENDA →", 0, 0);
    ctx.restore();

    // Low/High markers
    const markerFont = `500 ${Math.max(10, w * 0.015)}px ${fontBody}`;
    ctx.font = markerFont;
    ctx.fillStyle = hexToRgba(muted, 0.5);
    ctx.letterSpacing = "1px";

    // Bottom-left: Low/Low
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("LOW", margin.left + 6, margin.top + chartH - 6);

    // Top-right: High/High
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("HIGH", margin.left + chartW - 6, margin.top + 6);

    ctx.letterSpacing = "0px";

    // --- Quadrant content ---
    const titleSize = Math.max(17, Math.min(w * 0.032, 26));
    const subtitleSize = Math.max(13, Math.min(w * 0.02, 16));
    const pad = Math.max(20, w * 0.035);
    const qw = chartW / 2 - pad * 2;

    // Quadrant data
    const quadrants = [
      {
        title: "The Right",
        subtitle: "Free market theory, protectionist reality.",
        x: margin.left + pad,
        y: margin.top + chartH / 4,
        color: ink,
        subtitleColor: muted,
      },
      {
        title: "The Progressive\nAbundance Agenda",
        subtitle: "Build everything. Share everything.",
        x: cx + pad,
        y: margin.top + chartH / 4,
        color: accent,
        subtitleColor: ink,
        highlighted: true,
      },
      {
        title: "The Soft Center",
        subtitle: "No conviction on either front.",
        x: margin.left + pad,
        y: cy + chartH / 4,
        color: ink,
        subtitleColor: muted,
      },
      {
        title: "Progressives Today",
        subtitle: "Moral clarity, no engine.",
        x: cx + pad,
        y: cy + chartH / 4,
        color: ink,
        subtitleColor: muted,
      },
    ];

    for (const q of quadrants) {
      // Title
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const lines = q.title.split("\n");
      const titleLineH = titleSize * 1.25;
      const totalTitleH = titleLineH * lines.length;
      const startY = q.y - totalTitleH / 2 - subtitleSize * 0.4;

      ctx.font = `400 ${titleSize}px ${fontDisplay}`;
      ctx.fillStyle = q.color;

      let lastY = startY;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], q.x, startY + i * titleLineH);
        lastY = startY + i * titleLineH;
      }

      // Subtitle
      ctx.font = `${q.highlighted ? "italic 400" : "400"} ${subtitleSize}px ${fontBody}`;
      ctx.fillStyle = q.subtitleColor;
      wrapText(ctx, q.subtitle, q.x, lastY + titleSize * 1.1, qw, subtitleSize * 1.45);
    }

    // Small decorative accent dot on the highlighted quadrant
    ctx.beginPath();
    ctx.arc(cx + pad - 6, margin.top + chartH / 4 - titleSize * 0.8, 3, 0, Math.PI * 2);
    ctx.fillStyle = secondary;
    ctx.fill();
  }, []);

  useEffect(() => {
    draw();

    // Redraw on resize for responsiveness
    const observer = new ResizeObserver(() => draw());
    if (containerRef.current) observer.observe(containerRef.current);

    // Redraw when palette changes (MutationObserver on :root style)
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [draw]);

  return (
    <ScrollReveal>
      <div
        ref={containerRef}
        style={{
          margin: "3rem 0",
          width: "100%",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            display: "block",
            borderRadius: 2,
          }}
        />
      </div>
    </ScrollReveal>
  );
}
