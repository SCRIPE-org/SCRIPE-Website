/**
 * ContactHero — the contact page's typography-led intro.
 *
 * A page-scoped sibling of `src/components/sections/resources/ResourcesHero.tsx`
 * and `src/components/sections/platform/CapabilityHero.tsx` (same shape and
 * markup — a small marker + `<h1>` + subtitle — see those files' own
 * headers for why interior pages open on type rather than the home page's
 * cinematic camera hero), with one deliberate departure: no CTA button.
 * Every other interior hero ends in a "Book a Demo" button that routes here
 * (`/contact`); putting that same button on THIS page would point at itself.
 * The form immediately below is this page's one call to action, so the hero
 * stays pure statement — heading and subtitle only. Copy is ported from
 * `backup/scripe-static/contact.html`'s page-header section.
 *
 * Task E4: the marker now runs in the ground sequence's mono film-grammar
 * (see `CapabilityHero.tsx`'s header) and the section sits on a quiet cool
 * ground glow + grain (`.atmo`/`.atmo-grain`, `.contact-hero-atmo` in the
 * new `src/styles/contact.css` — this page's first page-scoped stylesheet;
 * it previously ran on Tailwind utilities alone). A Server Component;
 * `Reveal` is the only client leaf.
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
    <Section className="atmo atmo-grain contact-hero-atmo !pb-[clamp(var(--space-8),6vh,var(--space-10))]">
      <Reveal className="max-w-[900px]">
        <p className="flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium uppercase tracking-[0.22em] text-accent-text [&:lang(ar)]:tracking-[0.06em]">
          <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
          {content.label}
        </p>
        <h1 className="atmo-title mt-5 font-display text-[length:var(--fs-display)] text-balance text-text-primary">
          {content.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty text-text-secondary">
          {content.subtitle}
        </p>
      </Reveal>
    </Section>
  );
}
