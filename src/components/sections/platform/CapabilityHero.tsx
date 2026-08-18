/**
 * CapabilityHero — the platform page's typography-led intro.
 *
 * The site's one cinematic hero belongs to the home page (`Hero.tsx`'s
 * scroll-scrubbed Camera-Hero); every interior page opens on type instead.
 * This is the page's single occurrence of the small marker device
 * `PlatformOverview` reserves as "the only section on the home page with
 * this device" — legitimate here as this page's own one hero marker, not a
 * repeated per-section eyebrow.
 *
 * Task E4: the marker is now set in the ground sequence's mono film-grammar
 * (`font-mono`, wide tracking — the same voice `home.css`'s `.slate-stamp`
 * uses for its timecode, minus the timecode itself: this page has no
 * flight/ground film to number) rather than the old tracked-uppercase sans
 * kicker, and the section sits on a quiet cool ground glow + grain
 * (`.atmo`/`.atmo-grain`, `.cap-hero-atmo` in `platform.css` §5) — this
 * page's one hero-toned moment. A Server Component; `Reveal` is the only
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
    <Section className="atmo atmo-grain cap-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <Reveal className="max-w-[900px]">
        <p className="text-accent-text flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
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
          <Button href="/pricing" size="lg" variant="outline">
            {content.secondaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
