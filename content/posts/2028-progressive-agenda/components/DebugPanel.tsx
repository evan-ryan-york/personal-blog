"use client";

import { useState, useEffect } from "react";

const FONT_PAIRS = [
  {
    name: "Instrument + Inter",
    display: "'Instrument Serif', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    families:
      "Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900",
  },
  {
    name: "Playfair + Source Sans",
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
    families:
      "Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900",
  },
  {
    name: "Fraunces + Work Sans",
    display: "'Fraunces', Georgia, serif",
    body: "'Work Sans', system-ui, sans-serif",
    families:
      "Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900",
  },
  {
    name: "Lora + Karla",
    display: "'Lora', Georgia, serif",
    body: "'Karla', system-ui, sans-serif",
    families:
      "Lora:ital,wght@0,400..700;1,400..700&family=Karla:ital,wght@0,200..800;1,200..800",
  },
  {
    name: "DM Serif + DM Sans",
    display: "'DM Serif Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    families:
      "DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000",
  },
];

const PALETTES = [
  {
    name: "Navy + Crimson",
    ink: "#0f0f0f",
    accent: "#1e3a5f",
    secondary: "#b91c1c",
    muted: "#6b7280",
    divider: "#e5e7eb",
    calloutBg: "#f8fafc",
    highlightBg: "#fafafa",
  },
  {
    name: "Forest + Amber",
    ink: "#1a1a1a",
    accent: "#1b4332",
    secondary: "#b45309",
    muted: "#6b7264",
    divider: "#e2e0d8",
    calloutBg: "#f7f9f5",
    highlightBg: "#faf9f6",
  },
  {
    name: "Slate + Teal",
    ink: "#0f172a",
    accent: "#334155",
    secondary: "#0d9488",
    muted: "#64748b",
    divider: "#e2e8f0",
    calloutBg: "#f8fafc",
    highlightBg: "#f1f5f9",
  },
  {
    name: "Charcoal + Coral",
    ink: "#1c1917",
    accent: "#44403c",
    secondary: "#dc5040",
    muted: "#78716c",
    divider: "#e7e5e4",
    calloutBg: "#fafaf9",
    highlightBg: "#f5f5f4",
  },
  {
    name: "Indigo + Rose",
    ink: "#1e1b4b",
    accent: "#3730a3",
    secondary: "#be123c",
    muted: "#6366f1",
    divider: "#e0e7ff",
    calloutBg: "#f5f3ff",
    highlightBg: "#faf5ff",
  },
];

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState<Set<number>>(new Set([0]));

  // Apply font pair via CSS custom properties
  useEffect(() => {
    const pair = FONT_PAIRS[fontIdx];
    const root = document.documentElement;
    root.style.setProperty("--pa-font-display", pair.display);
    root.style.setProperty("--pa-font-body", pair.body);
  }, [fontIdx]);

  // Apply palette
  useEffect(() => {
    const palette = PALETTES[paletteIdx];
    const root = document.documentElement;
    root.style.setProperty("--pa-ink", palette.ink);
    root.style.setProperty("--pa-accent", palette.accent);
    root.style.setProperty("--pa-secondary", palette.secondary);
    root.style.setProperty("--pa-muted", palette.muted);
    root.style.setProperty("--pa-divider", palette.divider);
    root.style.setProperty("--pa-callout-bg", palette.calloutBg);
    root.style.setProperty("--pa-highlight-bg", palette.highlightBg);
  }, [paletteIdx]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          style={{
            width: 320,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#999",
              }}
            >
              Design Explorer
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#999",
                lineHeight: 1,
                padding: 0,
              }}
            >
              &times;
            </button>
          </div>

          {/* Font pairs */}
          <div style={{ padding: "16px 18px 12px" }}>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#bbb",
                marginBottom: 10,
              }}
            >
              Font Pair
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {FONT_PAIRS.map((pair, i) => (
                <button
                  key={pair.name}
                  onClick={() => setFontIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border:
                      i === fontIdx
                        ? "1.5px solid #111"
                        : "1.5px solid transparent",
                    background: i === fontIdx ? "#f5f5f5" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: i === fontIdx ? "#111" : "#ddd",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: i === fontIdx ? 600 : 400,
                      color: i === fontIdx ? "#111" : "#666",
                    }}
                  >
                    {pair.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Palettes */}
          <div
            style={{
              padding: "8px 18px 18px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#bbb",
                marginBottom: 10,
                marginTop: 8,
              }}
            >
              Color Palette
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {PALETTES.map((palette, i) => (
                <button
                  key={palette.name}
                  onClick={() => setPaletteIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border:
                      i === paletteIdx
                        ? "1.5px solid #111"
                        : "1.5px solid transparent",
                    background: i === paletteIdx ? "#f5f5f5" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    width: "100%",
                  }}
                >
                  {/* Color swatches */}
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: palette.accent,
                      }}
                    />
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: palette.secondary,
                      }}
                    />
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: palette.ink,
                      }}
                    />
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: palette.muted,
                        border: "1px solid #eee",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: i === paletteIdx ? 600 : 400,
                      color: i === paletteIdx ? "#111" : "#666",
                    }}
                  >
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
