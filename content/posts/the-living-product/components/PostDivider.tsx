export default function PostDivider() {
  return (
    <div
      style={{
        width: 60,
        height: 1,
        background: "color-mix(in srgb, var(--lp-secondary, var(--lp-divider, #d9d3ca)) 40%, var(--lp-divider, #d9d3ca))",
        margin: "4rem 0",
      }}
    />
  );
}
