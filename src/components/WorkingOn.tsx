import Image from "next/image";

interface Project {
  name: string;
  domain: string;
  url: string;
  image: string;
  description: string;
}

const projects: Project[] = [
  {
    name: "Willow",
    domain: "willowed.org",
    url: "https://willowed.org",
    image: "/projects/willow.jpg",
    description:
      "A career and postsecondary readiness curriculum built for economic mobility. I’m CPTO, building the platform schools use to teach purpose, AI fluency, and durable skills.",
  },
  {
    name: "Work that Matters",
    domain: "workthatmatters.io",
    url: "https://workthatmatters.io",
    image: "/projects/work-that-matters.jpg",
    description:
      "A twelve-week residency inside your company. Your people pick a real problem, build a system of agents that handles it, and put it into production.",
  },
  {
    name: "Clearwater",
    domain: "clearwaterafrica.com",
    url: "https://clearwaterafrica.com",
    image: "/projects/clearwater.jpg",
    description:
      "Reliable, transparent water delivery in Accra, Ghana, where 3.6 million people don’t have dependable water. Order from your phone and get it delivered to your home or business.",
  },
];

export default function WorkingOn() {
  return (
    <section className="px-6 py-12 md:px-8">
      <div className="mx-auto max-w-2xl">
        <h2
          className="mb-8 text-xs uppercase tracking-widest text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          What I&rsquo;m working on
        </h2>

        <div className="space-y-6">
          {projects.map((project) => (
            <a
              key={project.domain}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-xl border border-paper-warm transition-shadow hover:shadow-lg sm:flex-row"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-paper-warm sm:aspect-auto sm:w-56 sm:border-b-0 sm:border-r">
                <Image
                  src={project.image}
                  alt={`${project.name} homepage`}
                  fill
                  sizes="(min-width: 640px) 224px, 100vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <article className="flex flex-col justify-center p-5">
                <div
                  className="mb-2 text-xs uppercase tracking-widest text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {project.domain}
                </div>
                <h3
                  className="mb-2 text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent md:text-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {project.name}
                </h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  {project.description}
                </p>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
