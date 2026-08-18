/**
 * CompanyHero — the company page's typography-led, statement-piece intro.
 *
 * A deliberate departure from the shared "small lime-rule marker + `<h1>` +
 * subtitle" interior hero shape `ResourcesHero.tsx`/`CapabilityHero.tsx`/
 * `PricingHero.tsx` each carry unchanged (see those files' own headers): this
 * page is the one place on the site that speaks in the brand's own voice
 * rather than a product's, so its heading runs one deliberate step larger
 * than `--fs-display`'s shared 3.6rem ceiling — a page-scoped
 * `clamp(2.4rem, 1.4rem + 3.6vw, 4.5rem)`, still well under the frontend
 * design doctrine's 6rem hero ceiling, but sized to read as a single carried
 * statement rather than a page-intro sentence competing with body copy
 * beneath it. Everything else (marker, CTAs, `Section`/`Reveal` rhythm)
 * stays identical to its sibling interior heroes, so the page still reads as
 * part of the same system. Copy is ported from
 * `backup/scripe-static/company.html`'s page-header section. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { CompanyContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface CompanyHeroProps {
  /** The hero slice of the company page content. */
  content: CompanyContent["hero"];
}

/**
 * Renders the company page's typography-led, statement-piece hero.
 *
 * @param props - See {@link CompanyHeroProps}.
 */
export function CompanyHero({ content }: CompanyHeroProps) {
  return (
    <Section className="!pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <Reveal className="max-w-[960px]">
        <p className="text-accent-text flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h1 className="font-display text-text-primary mt-5 text-[length:clamp(2.4rem,1.4rem+3.6vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.02em] text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.28] [&:lang(ar)]:tracking-normal">
          {content.title}
        </h1>
        <p className="text-text-secondary mt-6 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
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
