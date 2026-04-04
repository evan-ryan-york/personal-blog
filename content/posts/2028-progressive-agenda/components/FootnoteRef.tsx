"use client";

export default function FootnoteRef({ id }: { id: number }) {
  return (
    <sup>
      <a
        href={`#footnote-${id}`}
        id={`ref-${id}`}
        style={{
          fontFamily: "var(--pa-font-body)",
          color: "var(--pa-accent, #1e3a5f)",
          textDecoration: "none",
          fontSize: "0.7em",
          fontWeight: 600,
          marginLeft: 1,
        }}
      >
        {id}
      </a>
    </sup>
  );
}
