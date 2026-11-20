"use client";

import { useCallback, useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";

// The Cynefin plate, drawn rather than shipped as art. Same engraved-plate
// vocabulary as the rest of the post — near-black ground, brass rules, warm
// paper-white type — but it re-lays out at the reader's width instead of
// scaling one fixed raster down until the body copy is unreadable.

type Quadrant = {
  title: string;
  body: string;
  example: string;
  implication: string;
};

const QUADRANTS: Quadrant[] = [
  {
    title: "Simple",
    body: "Cause and effect are clear, repeatable, and governed by established best practices.",
    example: "Processing an invoice that has already been approved.",
    implication: "AI already can fully do this work",
  },
  {
    title: "Complicated",
    body: "Cause and effect are knowable with expertise, analysis, and deliberate problem-solving.",
    example: "Performing an appendectomy.",
    implication: "AI can do this work with the proper training, tools, and oversight",
  },
  {
    title: "Complex",
    body: "Cause and effect only become clear in retrospect, so progress comes through experimentation, learning, and adaptation.",
    example:
      "Designing and adapting a teacher-training program to improve student math outcomes tenfold.",
    implication:
      "Most of this work is and will remain human. We need to rapidly convert our workforce into people who can thrive in this space",
  },
  {
    title: "Chaotic",
    body: "Cause and effect are unclear in the moment, requiring immediate action to stabilize the situation.",
    example:
      "Coordinating rescue operations after an earthquake strikes a dense urban center.",
    implication:
      "This work is entirely human. Instinct, speed, and judgment prevail.",
  },
];

// Canvas can't use CSS variables directly, so the palette is read off the
// post's tokens at paint time. That lets a companion post with its own tokens
// (When AI Does Our Work, in pastels) reuse the plate. The defaults mirror
// SB_TOKENS in the Seven Bets layout and apply if a token is missing.
type Palette = {
  ground: string;
  border: string;
  gold: string;
  goldBright: string;
  heading: string;
  body: string;
  divider: string;
};

const DEFAULT_PALETTE: Palette = {
  ground: "#080A0E",
  border: "#262C38",
  gold: "#C9A45C",
  goldBright: "#E3C382",
  heading: "#F2ECE0",
  body: "#D6D0C4",
  divider: "rgba(201,164,92,.3)",
};

const C: Palette = { ...DEFAULT_PALETTE };

function readPalette(el: Element) {
  const style = getComputedStyle(el);
  const token = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  C.ground = token("--sb-bg-deep", DEFAULT_PALETTE.ground);
  C.border = token("--sb-rule", DEFAULT_PALETTE.border);
  C.gold = token("--sb-gold", DEFAULT_PALETTE.gold);
  C.goldBright = token("--sb-gold-bright", DEFAULT_PALETTE.goldBright);
  C.heading = token("--sb-heading", DEFAULT_PALETTE.heading);
  C.body = token("--sb-body", DEFAULT_PALETTE.body);
  C.divider = token("--sb-plate-divider", DEFAULT_PALETTE.divider);
}

// Typefaces come from the post's tokens too, defaulting to Seven Bets'.
const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'EB Garamond', Georgia, serif",
  mono: "'Space Mono', ui-monospace, monospace",
};

function readFonts(el: Element) {
  const style = getComputedStyle(el);
  const token = (name: string) => style.getPropertyValue(name).trim();
  F.display = token("--sb-font-display") || F.display;
  F.body = token("--sb-font-body") || F.body;
  F.mono = token("--sb-font-mono") || F.mono;
}

// Below this the two columns would be too narrow to hold a line of body copy,
// so the grid stacks into one column.
const STACK_BELOW = 560;

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  return lines;
}

// The mono labels are tracked out the way .sb-figure-caption is in CSS.
function trackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number
) {
  ctx.letterSpacing = `${tracking}px`;
  ctx.fillText(text, x, y);
  ctx.letterSpacing = "0px";
}

function hairline(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  // Half-pixel offset so a 1px rule lands on the pixel rather than across two.
  ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
  ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
  ctx.stroke();
}

/**
 * Lays the plate out at `width` and, when `paint` is set, draws it. Running it
 * without painting measures the height, so the canvas is sized to its content
 * instead of forcing the content into a fixed aspect ratio.
 */
function layout(
  ctx: CanvasRenderingContext2D,
  width: number,
  paint: boolean
): number {
  const s = Math.min(Math.max(width / 900, 0.6), 1.1);
  const stacked = width < STACK_BELOW;

  const pad = Math.max(22, 34 * s);
  const gutter = 40 * s;
  const contentX = pad;
  const contentW = width - pad * 2;
  const colW = stacked ? contentW : (contentW - gutter * 2) / 2;

  // Floors matter more than the ratio: a narrow phone column would otherwise
  // scale the body copy down to something nobody can read.
  const titleSize = Math.max(31, 52 * s);
  const quadSize = Math.max(26, 38 * s);
  const bodySize = Math.max(15, 19 * s);
  const bodyLead = bodySize * 1.42;
  const labelSize = Math.max(10, 11 * s);

  // --- Title ---------------------------------------------------------------
  let y = pad + titleSize * 0.9;

  if (paint) {
    ctx.fillStyle = C.heading;
    ctx.font = `400 ${titleSize}px ${F.display}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Cynefin Framework", width / 2, y);
    ctx.textAlign = "left";
  }

  y += titleSize * 0.42;

  if (paint) {
    hairline(ctx, contentX, y, contentX + contentW, y, "rgba(201,164,92,.42)");
    // Brighter tick at the centre, the way the engraved rules in the post carry
    // a highlight at their midpoint.
    hairline(
      ctx,
      width / 2 - 30 * s,
      y,
      width / 2 + 30 * s,
      y,
      C.goldBright
    );
  }

  const gridTop = y;
  y += Math.max(28, 42 * s);

  // --- Quadrants -----------------------------------------------------------
  const quadrantHeight = (quad: Quadrant): number => {
    ctx.font = `400 ${bodySize}px ${F.body}`;
    const bodyLines = wrap(ctx, quad.body, colW).length;
    const exampleLines = wrap(ctx, quad.example, colW).length;
    const impLines = wrap(ctx, quad.implication, colW).length;

    return (
      quadSize * 1.0 + // title
      18 * s +
      bodyLines * bodyLead +
      26 * s +
      labelSize +
      16 * s +
      exampleLines * bodyLead +
      26 * s +
      labelSize +
      16 * s +
      impLines * bodyLead
    );
  };

  const drawQuadrant = (quad: Quadrant, x: number, top: number) => {
    let cursor = top;

    ctx.fillStyle = C.heading;
    ctx.font = `300 ${quadSize}px ${F.display}`;
    ctx.fillText(quad.title, x, cursor + quadSize * 0.78);
    cursor += quadSize * 1.0 + 18 * s;

    ctx.fillStyle = C.body;
    ctx.font = `400 ${bodySize}px ${F.body}`;
    for (const line of wrap(ctx, quad.body, colW)) {
      ctx.fillText(line, x, cursor + bodySize);
      cursor += bodyLead;
    }

    cursor += 26 * s;
    ctx.fillStyle = C.gold;
    ctx.font = `400 ${labelSize}px ${F.mono}`;
    trackedText(ctx, "EXAMPLE", x, cursor + labelSize, labelSize * 0.16);
    cursor += labelSize + 16 * s;

    ctx.fillStyle = C.body;
    ctx.font = `400 ${bodySize}px ${F.body}`;
    for (const line of wrap(ctx, quad.example, colW)) {
      ctx.fillText(line, x, cursor + bodySize);
      cursor += bodyLead;
    }

    cursor += 26 * s;
    ctx.fillStyle = C.gold;
    ctx.font = `400 ${labelSize}px ${F.mono}`;
    trackedText(ctx, "AI IMPLICATION", x, cursor + labelSize, labelSize * 0.16);
    cursor += labelSize + 16 * s;

    ctx.fillStyle = C.body;
    ctx.font = `400 ${bodySize}px ${F.body}`;
    for (const line of wrap(ctx, quad.implication, colW)) {
      ctx.fillText(line, x, cursor + bodySize);
      cursor += bodyLead;
    }
  };

  // Stacked blocks run the full width, so they need a wider band between them
  // than two columns do before the rule reads as a separator.
  const rowGap = stacked ? Math.max(36, 46 * s) : Math.max(26, 36 * s);

  if (stacked) {
    QUADRANTS.forEach((quad, i) => {
      if (i > 0) {
        if (paint) {
          hairline(
            ctx,
            contentX,
            y - rowGap / 2,
            contentX + contentW,
            y - rowGap / 2,
            C.divider
          );
        }
      }
      if (paint) drawQuadrant(quad, contentX, y);
      y += quadrantHeight(quad) + rowGap;
    });
    y -= rowGap;
  } else {
    const colX = [contentX, contentX + colW + gutter * 2];
    const rows: [Quadrant, Quadrant][] = [
      [QUADRANTS[0], QUADRANTS[1]],
      [QUADRANTS[2], QUADRANTS[3]],
    ];

    rows.forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        if (paint) {
          hairline(
            ctx,
            contentX,
            y - rowGap,
            contentX + contentW,
            y - rowGap,
            C.divider
          );
        }
      }

      const rowHeight = Math.max(...row.map(quadrantHeight));
      if (paint) row.forEach((quad, i) => drawQuadrant(quad, colX[i], y));
      y += rowHeight + rowGap * 2;
    });

    y -= rowGap * 2;

    // Vertical rule spanning both rows, drawn last so it reads as one stroke.
    if (paint) {
      const midX = contentX + colW + gutter;
      hairline(ctx, midX, gridTop, midX, y, C.divider);
    }
  }

  return y + pad;
}

function render(canvas: HTMLCanvasElement, width: number) {
  readPalette(canvas);
  readFonts(canvas);
  const measure = document.createElement("canvas").getContext("2d");
  const ctx = canvas.getContext("2d");
  if (!measure || !ctx) return;

  const height = layout(measure, width, false);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Plate ground and frame.
  ctx.fillStyle = C.ground;
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, width - 1, height - 1, 4);
  ctx.fill();
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  layout(ctx, width, true);
}

export default function CynefinPlate({ caption }: { caption?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthRef = useRef(0);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || widthRef.current === 0) return;
    render(canvas, widthRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    readFonts(canvas);

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width === 0 || width === widthRef.current) return;
      widthRef.current = width;
      paint();
    });

    observer.observe(canvas.parentElement ?? canvas);

    // Draw once with whatever is available, then again once the post's
    // webfonts land — otherwise the plate is measured in Georgia and keeps
    // those line breaks after Cormorant arrives.
    Promise.all([
      document.fonts.load(`400 52px ${F.display}`),
      document.fonts.load(`300 38px ${F.display}`),
      document.fonts.load(`400 19px ${F.body}`),
      document.fonts.load(`400 11px ${F.mono}`),
    ])
      .then(paint)
      .catch(() => {});

    return () => observer.disconnect();
  }, [paint]);

  const description =
    "The Cynefin framework in four quadrants. " +
    QUADRANTS.map(
      (q) =>
        `${q.title}: ${q.body} Example: ${q.example} AI implication: ${q.implication}.`
    ).join(" ");

  return (
    <ScrollReveal>
      <figure className="sb-figure">
        <canvas
          ref={canvasRef}
          className="sb-plate-canvas"
          role="img"
          aria-label={description}
        />
        {caption ? (
          <figcaption className="sb-figure-caption">{caption}</figcaption>
        ) : null}
      </figure>
    </ScrollReveal>
  );
}
