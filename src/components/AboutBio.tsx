import { authorProfiles } from "@/lib/site";

/**
 * The author's bio.
 *
 * It lived inside a client-side tab on the homepage, which meant it only
 * entered the DOM once a reader clicked "about" — so no crawler, and no
 * assistant answering "who is Ryan York", had ever seen a word of it. It is a
 * component now so the homepage tab and `/about` can share one copy, and so
 * the version at `/about` renders in the HTML unconditionally.
 */

function ProfileLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      // rel="me" is the claim that this profile and this site are the same
      // person. Crawlers weigh a link they can follow and see reciprocated far
      // more heavily than the same assertion made only in JSON-LD.
      rel="me noopener noreferrer"
      target="_blank"
      className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </a>
  );
}

const PROFILE_LABELS: Record<string, string> = {
  "x.com": "X",
  "linkedin.com": "LinkedIn",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "soundcloud.com": "SoundCloud",
};

function labelFor(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return PROFILE_LABELS[host] ?? host;
}

const link =
  "text-ink underline underline-offset-2 hover:text-accent";

export default function AboutBio({
  showProfiles = true,
}: {
  showProfiles?: boolean;
}) {
  return (
    <div
      className="space-y-6 text-base text-ink/80"
      style={{ lineHeight: 1.8 }}
    >
      <p>
        My earliest memory is my mom throwing away the 6 VCRs I&rsquo;d smuggled
        from friends&rsquo; houses and my own attic. I had fully disassembled
        them and was trying to reconfigure the parts into a game console. I was
        5.
      </p>
      <p>
        Same instinct, bigger VCRs. I built my first recording studio at 15. I
        talked a bankrupt landlord into giving me a building and turned it into
        a rock and roll camp for kids. I created math software that put every
        teacher who used it into the top 5% of their district. I built a CS
        curriculum that went from 400 to 50,000 students across 13 states in a
        year and a half. I co-founded a charter school where kindergartners used
        real hammers and saws&nbsp;&mdash; then walked away from it when the
        people in charge stopped protecting kids.
      </p>
      <p>
        Now I&rsquo;m CPTO of{" "}
        <a
          href="https://willowed.org"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Willow Education
        </a>
        , and launching{" "}
        <a
          href="https://clearwaterafrica.com"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Clearwater
        </a>{" "}
        in Accra, Ghana&nbsp;&mdash; where 3.6 million people don&rsquo;t have
        reliable water. In the cracks between those stones lives politics,
        gardening,{" "}
        <a
          href="https://soundcloud.com/ryan_york"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          music
        </a>
        , and fumbling my way through parenthood.
      </p>
      <p>
        This site is where I capture the ideas that won&rsquo;t leave me alone.
        I write about artificial intelligence, education, product, and
        politics&nbsp;&mdash; mostly about how technology reshapes work and
        learning, and who ends up sharing in what it creates.
      </p>

      {showProfiles && (
        <p className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
          {authorProfiles.map((url) => (
            <ProfileLink key={url} href={url}>
              {labelFor(url)}
            </ProfileLink>
          ))}
          <a
            href="mailto:ryan@ryanyork.io"
            className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Email
          </a>
        </p>
      )}
    </div>
  );
}
