/**
 * SolutionsGrid (`#solutions`) — the four organization shapes SCRIPE
 * configures for (ground slate `08 / Solutions` — see `Slate.tsx`).
 *
 * A genuine four-way choice, so cards are the honest affordance here (the
 * one card grid on the page): each `Card` keeps its product-world accent
 * top edge (the design contract for the Card primitive) and gains Task E3's
 * depth treatment — the `.sol-card` surface (elevation ramp + dark gradient
 * ground) with a hover tilt (`perspective` + `rotateX`, travel gated by
 * `--motion-travel`), and an accent-lit glyph tile (`.sol-glyph` — tinted
 * ground, tinted border, soft accent bloom; `--sol-accent` carries the
 * world's color into the CSS). Icons are minimal strokes — shape identity,
 * not decoration. Header is centered to mark the rhythm change from the
 * start-aligned platform split above; the section ground is the
 * `.gs-solutions` center-stage wash. A Server Component; `Reveal` is the
 * only client leaf.
 */
import type { AccentId, HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ACCENT_VAR, toCardAccent } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { Slate } from "./Slate";

/** Stroke glyph per solution shape, keyed by accent identity. */
function SolutionGlyph({ accent }: { accent: AccentId }) {
  const paths: Record<string, React.ReactNode> = {
    club: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    academy: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <path d="M3 10h18" />
      </>
    ),
    venue: (
      <>
        <circle cx="12" cy="10" r="3" />
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      </>
    ),
    fi: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20" />
        <path d="M12 2a14.5 14.5 0 0 1 0 20" />
        <path d="M2 12h20" />
      </>
    ),
  };

  return (
    <span className="sol-glyph" aria-hidden="true">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[accent] ?? paths.club}
      </svg>
    </span>
  );
}

export interface SolutionsGridProps {
  /** The solutions slice of the home page content. */
  content: HomeContent["solutions"];
}

/**
 * Renders the solutions header, the four accent cards and the compare link.
 *
 * @param props - See {@link SolutionsGridProps}.
 */
export function SolutionsGrid({ content }: SolutionsGridProps) {
  return (
    <Section id="solutions" className="gs gs-solutions scroll-mt-24">
      <Reveal className="mx-auto max-w-[1000px] text-center">
        <Slate no="08" label={content.stamp} center />
        <h2 className="gs-title">{content.title}</h2>
        <p className="text-text-secondary mx-auto mt-4 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div
        className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.href} y={20}>
            <Card
              accent={toCardAccent(item.accent)}
              className="sol-card flex h-full flex-col gap-5"
              style={{ "--sol-accent": ACCENT_VAR[item.accent] } as React.CSSProperties}
            >
              <SolutionGlyph accent={item.accent} />
              <div className="flex-1">
                <h3 className="font-display text-text-primary text-[length:var(--fs-lead)] font-semibold">
                  {item.title}
                </h3>
                <p className="text-text-secondary mt-2 text-[length:var(--fs-small)] leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
              <ArrowLink href={item.href}>{item.cta}</ArrowLink>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-9 flex justify-center">
        <ArrowLink href="/solutions">{content.compareCta}</ArrowLink>
      </div>
    </Section>
  );
}
