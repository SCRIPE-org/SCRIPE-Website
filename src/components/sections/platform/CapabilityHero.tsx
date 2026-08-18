/**
 * CapabilityHero — the platform page's typography-led intro.
 *
 * The site's one cinematic hero belongs to the home page (`Hero.tsx`'s
 * scroll-scrubbed Camera-Hero); every interior page opens on type instead.
 * This is the page's single occurrence of the small lime-rule marker device
 * `PlatformOverview` reserves as "the only section on the home page with
 * this device" — legitimate here as this page's own one hero marker, not a
 * repeated per-section eyebrow. A Server Component; `Reveal` is the only
 * client leaf.
 */
import type { PlatformContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface CapabilityHeroProps {
  /** The hero slice of the platform page content. */
  content: PlatformContent["hero"];
}

/**
 * Renders the platform page's typography-led hero.
 *
 * @param props - See {@link CapabilityHeroProps}.
 */
export function CapabilityHero({ content }: CapabilityHeroProps) {
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
          <Button href="/pricing" size="lg" variant="outline">
            {content.secondaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
