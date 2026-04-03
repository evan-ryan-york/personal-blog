import Link from "next/link";

const tagColors = [
  "bg-accent/10 text-accent border-accent/20",
  "bg-amber-100/80 text-amber-800 border-amber-200",
  "bg-emerald-100/80 text-emerald-800 border-emerald-200",
  "bg-sky-100/80 text-sky-800 border-sky-200",
  "bg-violet-100/80 text-violet-800 border-violet-200",
  "bg-rose-100/80 text-rose-800 border-rose-200",
  "bg-orange-100/80 text-orange-800 border-orange-200",
  "bg-teal-100/80 text-teal-800 border-teal-200",
];

const rotations = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-2",
  "rotate-0",
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
];

const radii = [
  "rounded-full",
  "rounded-2xl",
  "rounded-lg",
  "rounded-full",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
  "rounded-lg",
];

export default function TagCloud({ tags }: { tags: Map<string, number> }) {
  const maxCount = Math.max(...tags.values());
  const tagEntries = Array.from(tags.entries());

  return (
    <div className="animate-fade-up delay-3">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {tagEntries.map(([tag, count], i) => {
          const scale = 0.75 + (count / maxCount) * 0.5;
          const colorIndex = i % tagColors.length;

          return (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className={`
                border px-4 py-2 font-medium transition-all duration-200
                hover:scale-110 hover:shadow-md
                ${tagColors[colorIndex]}
                ${rotations[i % rotations.length]}
                ${radii[i % radii.length]}
              `}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: `${scale}rem`,
              }}
            >
              {tag}
              <span className="ml-1.5 opacity-50">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
