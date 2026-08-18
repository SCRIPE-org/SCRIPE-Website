/**
 * PricingHero — the pricing page's typography-led intro.
 *
 * A page-scoped sibling of `src/components/sections/platform/CapabilityHero.tsx`
 * (same shape and markup — a marker + `<h1>` + subtitle + two CTAs — see
 * that file's own header for why interior pages open on type rather than
 * the home page's cinematic camera hero). Copy is ported from
 * `backup/scripe-static/pricing.html`'s page-header section.
 *
 * Task E4: the marker now runs in the ground sequence's mono film-grammar
 * (see `CapabilityHero.tsx`'s header) and the section sits on a quiet cool
 * ground glow + grain (`.atmo`/`.atmo-grain`, `.pricing-hero-atmo` in
 * `pricing.css` §4). A Server Component; `Reveal` is the only client leaf.
 *
 * Task G3: a framed photograph joins the copy — four separately lit facility
 * hubs scattered across one dark city. It runs as a FULL-WIDTH strip under
 * the copy rather than in a right-hand column, which is a deliberate
 * departure from the portrait prints on `/company` and the solution pages.
 * The frame is 21:9 and its entire argument is that there are four of them:
 * any crop tight enough to sit beside a text column throws two hubs away and
 * with them the reason the picture is on a pricing page at all. A wide strip
 * is also the honest reading of the shot's own scale — it is a high-altitude
 * aerial, and shrinking it to 340px would make four city-blocks of detail
 * unreadable. The image argues for per-branch pricing before the copy does.
 */
import type { PricingContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { PlatePhoto } from "@/components/ui/PlatePhoto";
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
    <Section className="atmo atmo-grain pricing-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
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
          {/* Optional: no self-service "start free trial" secondary action
              anymore (see `PricingContent["hero"]`'s doc comment) — a single
              primary CTA is a valid, complete hero. */}
          {content.secondaryCta ? (
            <Button href="/contact" size="lg" variant="outline">
              {content.secondaryCta}
            </Button>
          ) : null}
        </div>
      </Reveal>

      {/* Clamped to the copy's own 900px measure, not the section's full
          width. At container width the 21:9 frame stood 556px tall and
          pushed the plan cards — the page's actual job — to y≈1322, more
          than a viewport down. Sharing the copy's measure keeps the four
          hubs individually legible, reads as one left-aligned column with
          the paragraph above it, and buys back ~170px before the plans. */}
      <Reveal delay={120} className="mt-[clamp(var(--space-8),5vh,var(--space-10))] max-w-[900px]">
        <PlatePhoto
          src="/media/pricing/city-hubs.webp"
          alt={content.imageAlt}
          width={1915}
          height={821}
          sizes="(min-width: 60rem) 900px, 92vw"
        />
      </Reveal>
    </Section>
  );
}
