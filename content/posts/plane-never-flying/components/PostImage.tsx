import ScrollReveal from "./ScrollReveal";

export default function PostImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <ScrollReveal>
      <figure style={{ margin: "3rem 0" }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 8,
            border: "1px solid var(--pf-rule, #d2cab2)",
          }}
        />
        {caption ? (
          <figcaption
            style={{
              fontFamily: "var(--pf-font-label)",
              fontSize: "0.69rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--pf-faint, #94a09e)",
              marginTop: "0.9rem",
              textAlign: "center",
            }}
          >
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </ScrollReveal>
  );
}
