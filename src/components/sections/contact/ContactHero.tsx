/**
 * ContactHero — the contact page's typography-led intro.
 *
 * A page-scoped sibling of `src/components/sections/resources/ResourcesHero.tsx`
 * and `src/components/sections/platform/CapabilityHero.tsx` (same shape and
 * markup — small lime-rule marker + `<h1>` + subtitle — see those files' own
 * headers for why interior pages open on type rather than the home page's
 * cinematic camera hero), with one deliberate departure: no CTA button.
 * Every other interior hero ends in a "Book a Demo" button that routes here
 * (`/contact`); putting that same button on THIS page would point at itself.
 * The form immediately below is this page's one call to action, so the hero
 * stays pure statement — heading and subtitle only. Copy is ported from
 * `backup/scripe-static/contact.html`'s page-header section. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { ContactContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface ContactHeroProps {
  /** The hero slice of the contact page content. */
  content: ContactContent["hero"];
}

/**
 * Renders the contact page's typography-led hero.
 *
 * @param props - See {@link ContactHeroProps}.
 */
export function ContactHero({ content }: ContactHeroProps) {
  return (
    <Section className="!pb-[clamp(var(--space-8),6vh,var(--space-10))]">
      <Reveal className="max-w-[900px]">
        <p className="flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold uppercase tracking-[0.14em] text-accent-text [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
          {content.label}
        </p>
        <h1 className="mt-5 font-display text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance text-text-primary [font-variation-settings:'wdth'_114] [&:lang(ar)]:leading-[1.3] [&:lang(ar)]:[font-variation-settings:normal]">
          {content.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty text-text-secondary">
          {content.subtitle}
        </p>
      </Reveal>
    </Section>
  );
}
