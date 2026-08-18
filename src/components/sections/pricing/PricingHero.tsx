/**
 * PricingHero — the pricing page's typography-led intro.
 *
 * A page-scoped sibling of `src/components/sections/platform/CapabilityHero.tsx`
 * (same shape and markup — small lime-rule marker + `<h1>` + subtitle + two
 * CTAs — see that file's own header for why interior pages open on type
 * rather than the home page's cinematic camera hero). Copy is ported from
 * `backup/scripe-static/pricing.html`'s page-header section. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { PricingContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface PricingHeroProps {
  /** The hero slice of the pricing page content. */
  content: PricingContent["hero"];
}

/**
 * Renders the pricing page's typography-led hero.
 *
 * @param props - See {@link PricingHeroProps}.
 */
export function PricingHero({ content }: PricingHeroProps) {
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
          <Button href="/contact" size="lg" variant="outline">
            {content.secondaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
