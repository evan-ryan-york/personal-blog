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
      "This work is entirely human, it represents spaces where instinct, speed, and judgement prevail",
  },
];

// Mirrors the post's tokens. Canvas can't read CSS variables, so the palette is
// repeated here; keep it in step with SB_TOKENS in the post layout.
const GROUND = "#080A0E";
const BORDER = "#262C38";
const GOLD = "#C9A45C";
const GOLD_BRIGHT = "#E3C382";
const HEADING = "#F2ECE0";
const BODY = "#D6D0C4";

const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'EB Garamond', Georgia, serif";
const FONT_MONO = "'Space Mono', ui-monospace, monospace";

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
    ctx.fillStyle = HEADING;
    ctx.font = `400 ${titleSize}px ${FONT_DISPLAY}`;
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
      GOLD_BRIGHT
    );
  }

  const gridTop = y;
  y += Math.max(28, 42 * s);

  // --- Quadrants -----------------------------------------------------------
  const quadrantHeight = (quad: Quadrant): number => {
    ctx.font = `400 ${bodySize}px ${FONT_BODY}`;
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

    ctx.fillStyle = HEADING;
    ctx.font = `300 ${quadSize}px ${FONT_DISPLAY}`;
    ctx.fillText(quad.title, x, cursor + quadSize * 0.78);
    cursor += quadSize * 1.0 + 18 * s;

    ctx.fillStyle = BODY;
    ctx.font = `400 ${bodySize}px ${FONT_BODY}`;
    for (const line of wrap(ctx, quad.body, colW)) {
      ctx.fillText(line, x, cursor + bodySize);
      cursor += bodyLead;
    }

    cursor += 26 * s;
    ctx.fillStyle = GOLD;
    ctx.font = `400 ${labelSize}px ${FONT_MONO}`;
    trackedText(ctx, "EXAMPLE", x, cursor + labelSize, labelSize * 0.16);
    cursor += labelSize + 16 * s;

    ctx.fillStyle = BODY;
    ctx.font = `400 ${bodySize}px ${FONT_BODY}`;
    for (const line of wrap(ctx, quad.example, colW)) {
      ctx.fillText(line, x, cursor + bodySize);
      cursor += bodyLead;
    }

    cursor += 26 * s;
    ctx.fillStyle = GOLD;
    ctx.font = `400 ${labelSize}px ${FONT_MONO}`;
    trackedText(ctx, "AI IMPLICATION", x, cursor + labelSize, labelSize * 0.16);
    cursor += labelSize + 16 * s;

    ctx.fillStyle = BODY;
    ctx.font = `400 ${bodySize}px ${FONT_BODY}`;
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
            "rgba(201,164,92,.3)"
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
            "rgba(201,164,92,.3)"
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
      hairline(ctx, midX, gridTop, midX, y, "rgba(201,164,92,.3)");
    }
  }

  return y + pad;
}

function render(canvas: HTMLCanvasElement, width: number) {
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
  ctx.fillStyle = GROUND;
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, width - 1, height - 1, 4);
  ctx.fill();
  ctx.strokeStyle = BORDER;
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
      document.fonts.load(`400 52px ${FONT_DISPLAY}`),
      document.fonts.load(`300 38px ${FONT_DISPLAY}`),
      document.fonts.load(`400 19px ${FONT_BODY}`),
      document.fonts.load(`400 11px ${FONT_MONO}`),
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
