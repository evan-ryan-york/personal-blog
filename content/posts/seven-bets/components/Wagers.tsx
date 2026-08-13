import ScrollReveal from "./ScrollReveal";

// The four wagers, set as an engraved index rather than a clause buried in the
// opening sentence. Self-contained — no pronoun reaching back into the prose —
// and the paragraph after it points at the row with "Those are all wagers…".
// Styled in globals.css rather than inline: the column hairlines need a
// breakpoint so a wrapped row never starts with a stray rule.
export default function Wagers({ items }: { items: string[] }) {
  return (
    <ScrollReveal>
      <div className="sb-wagers">
        {items.map((item) => (
          <div key={item} className="sb-wagers-item">
            {item}
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
