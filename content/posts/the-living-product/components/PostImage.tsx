import ScrollReveal from "./ScrollReveal";

export default function PostImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <ScrollReveal>
      <figure
        style={{
          margin: "3.5rem -2rem",
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </figure>
    </ScrollReveal>
  );
}
