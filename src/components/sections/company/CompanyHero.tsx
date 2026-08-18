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
 * `backup/scripe-static/company.html`'s page-header section.
 *
 * Task E4: the marker now runs in the ground sequence's mono film-grammar
 * (see `src/components/sections/platform/CapabilityHero.tsx`'s header), the
 * heading composes the shared `.atmo-title` heavy-axis recipe (its own
 * page-scoped clamp size and tracking stay — `.atmo-title` only sets
 * family/variation-axis/leading/letter-spacing, both fully overridable by a
 * caller's own more specific need), and the section sits on a quiet cool
 * ground glow + grain (`.atmo`/`.atmo-grain`, `.co-hero-atmo` in
 * `company.css` §2). A Server Component; `Reveal` is the only client leaf.
 *
 * Task G3: the statement gained a companion — the night operations room
 * overlooking the campus, framed as a print (`PlatePhoto`, whose header owns
 * the frame contract). It is the one photograph on the site with a person's
 * chair in it and no person, which is the whole page's argument in a single
 * frame: the company exists so somebody does not have to sit there. The
 * hero's max-width moves from a flat 960px to a two-column row that keeps
 * the statement measure intact and lets the print take the outer column; in
 * Arabic the row reverses with `dir`, putting the print on the left, which
 * is correct — nothing here is positioned with physical properties.
 */
import type { CompanyContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { PlatePhoto } from "@/components/ui/PlatePhoto";
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
    <Section className="atmo atmo-grain co-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <div className="flex flex-wrap items-center gap-10 lg:gap-14">
        <Reveal className="min-w-0 flex-1 basis-[520px]">
          <p className="text-accent-text flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
            <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
            {content.label}
          </p>
          <h1 className="atmo-title font-display text-text-primary mt-5 text-[length:clamp(2.4rem,1.4rem+3.6vw,4.5rem)] text-balance">
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

        {/* `basis-72` lets the print drop below the statement on narrow
            viewports (both columns wrap at the same breakpoint the flex
            basis pair implies) rather than squeezing to a stamp. */}
        <Reveal delay={120} className="min-w-0 flex-1 basis-72 lg:max-w-[380px]">
          <PlatePhoto
            src="/media/company/ops-room.webp"
            alt={content.imageAlt}
            width={1122}
            height={1402}
            sizes="(min-width: 64rem) 380px, (min-width: 40rem) 40vw, 90vw"
            priority
          />
        </Reveal>
      </div>
    </Section>
  );
}
