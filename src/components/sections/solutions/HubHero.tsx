/**
 * HubHero — the solutions hub's typography-led intro.
 *
 * The same "interior pages open on type" pattern
 * `src/components/sections/platform/CapabilityHero.tsx` establishes (see
 * that file's own header): a small marker (the page's one hero marker, per
 * that same convention) above the heading. Brand lime here, not a product
 * accent — the hub represents all four shapes at once, so it carries the
 * brand-wide mark; the accent identity only appears once the reader picks a
 * shape, in the grid below and on each solution page's own hero.
 *
 * Task E4: the marker now runs in the ground sequence's mono film-grammar
 * (see `CapabilityHero.tsx`'s header) and the section sits on a quiet cool
 * ground glow + grain (`.atmo`/`.atmo-grain`, `.sol-hero-atmo` in
 * `solutions.css` §1b — shared with `SolutionHero.tsx`, since both open on
 * the same shape). A Server Component; `Reveal` is the only client leaf.
 */
import type { SolutionsHubContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface HubHeroProps {
  /** The hero slice of the hub's content. */
  content: SolutionsHubContent["hero"];
}

/**
 * Renders the solutions hub's hero.
 *
 * @param props - See {@link HubHeroProps}.
 */
export function HubHero({ content }: HubHeroProps) {
  return (
    <Section className="atmo atmo-grain sol-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <Reveal className="max-w-[900px]">
        <p className="text-accent-text flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.eyebrow}
        </p>
        <h1 className="atmo-title font-display text-text-primary mt-5 text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h1>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact" size="lg">
            {content.primaryCta}
          </Button>
          <Button href="/platform" size="lg" variant="outline">
            {content.secondaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
