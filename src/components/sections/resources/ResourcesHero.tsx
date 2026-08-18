/**
 * ResourcesHero — the resources page's typography-led intro.
 *
 * A page-scoped sibling of `src/components/sections/platform/CapabilityHero.tsx`
 * and `src/components/sections/pricing/PricingHero.tsx` (same shape and
 * markup — small lime-rule marker + `<h1>` + subtitle — see those files' own
 * headers for why interior pages open on type rather than the home page's
 * cinematic camera hero). Unlike its two siblings this hero carries a single
 * CTA, matching the legacy static page's own hero, which only ever offered
 * "Talk to sales" (no secondary trial CTA — a resources page is a reading
 * destination, not a conversion page). Copy is ported from
 * `backup/scripe-static/resources.html`'s page-header section. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { ResourcesContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface ResourcesHeroProps {
  /** The hero slice of the resources page content. */
  content: ResourcesContent["hero"];
}

/**
 * Renders the resources page's typography-led hero.
 *
 * @param props - See {@link ResourcesHeroProps}.
 */
export function ResourcesHero({ content }: ResourcesHeroProps) {
  return (
    <Section className="!pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <Reveal className="max-w-[900px]">
        <p className="text-accent-text flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h1 className="font-display text-text-primary mt-5 text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h1>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact" size="lg">
            {content.primaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
