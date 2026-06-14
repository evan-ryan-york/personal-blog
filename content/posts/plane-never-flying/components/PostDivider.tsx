export default function PostDivider() {
  return (
    <div
      aria-hidden
      style={{
        width: 80,
        height: 0,
        borderTop: "1px dashed var(--pf-rule, #d2cab2)",
        margin: "4rem 0",
      }}
    />
  );
}
