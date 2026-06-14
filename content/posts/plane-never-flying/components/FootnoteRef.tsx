"use client";

export default function FootnoteRef({ id }: { id: number }) {
  return (
    <sup>
      <a
        href={`#footnote-${id}`}
        id={`ref-${id}`}
        style={{
          fontFamily: "var(--pf-font-label)",
          color: "var(--pf-coral, #d4562d)",
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
