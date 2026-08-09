import ScrollReveal from "./ScrollReveal";

// The index of the seven, ruled top and bottom, each row anchoring to its bet.
export default function TheSeven({
  bets,
}: {
  bets: { letter: string; title: string }[];
}) {
  return (
    <ScrollReveal>
      <nav
        aria-label="The seven bets"
        style={{
          marginTop: "clamp(3.5rem, 8vw, 5rem)",
          borderTop: "1px solid var(--sb-rule)",
          borderBottom: "1px solid var(--sb-rule)",
          padding: "2.125rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "1.125rem",
        }}
      >
        <div className="sb-eyebrow">The seven</div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {bets.map(({ letter, title }) => (
            <a
              key={letter}
              href={`#bet-${letter.toLowerCase()}`}
              className="sb-bet-link"
            >
              <span className="sb-bet-link-letter">{letter}</span>
              <span className="sb-bet-link-title">{title}</span>
            </a>
          ))}
        </div>
      </nav>
    </ScrollReveal>
  );
}
