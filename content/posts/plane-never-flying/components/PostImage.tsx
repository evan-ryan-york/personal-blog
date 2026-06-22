import ScrollReveal from "./ScrollReveal";

export default function PostImage({
  src,
  alt,
  caption,
  float,
}: {
  src: string;
  alt: string;
  caption?: string;
  float?: "left" | "right";
}) {
  const figure = (
    <figure
      style={
        float
          ? {
              float,
              width: "clamp(180px, 38%, 300px)",
              margin:
                float === "left"
                  ? "0.4rem 2rem 1.2rem 0"
                  : "0.4rem 0 1.2rem 2rem",
            }
          : { margin: "3rem 0" }
      }
    >
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
  );

  // A floated image must sit inline beside the prose; the ScrollReveal
  // wrapper is a block element that would break the text wrap.
  return float ? figure : <ScrollReveal>{figure}</ScrollReveal>;
}
