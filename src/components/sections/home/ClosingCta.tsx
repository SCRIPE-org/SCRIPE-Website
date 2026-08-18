/**
 * ClosingCta — the conversion band that closes the page: the film's END
 * CARD (Task E3).
 *
 * An obsidian panel with the brand's lime "horizon" edge-light (hairline +
 * bloom along the top edge — `.cta-panel` in `src/styles/home.css` §12),
 * the hero's crop-mark corners and film-grain tile (`.cta-corners` /
 * `.cta-grain` — the framing device that opened the film closes it), riding
 * the deepest shadow step. Deliberately the same night-world the hero
 * opened in, in both themes: the page starts and ends on brand ground.
 * Centered stack: brand mark, headline (in the ground sequence's
 * extended-heavy voice), sentence, primary/secondary CTAs, pricing link and
 * the honest onboarding note. Because the panel is always dark, its
 * foregrounds are fixed light values rather than theme tokens — a
 * documented single-look exception, not a leak. A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "./ArrowLink";

export interface ClosingCtaProps {
  /** The closing slice of the home page content. */
  content: HomeContent["closing"];
}

/**
 * Renders the closing CTA panel.
 *
 * @param props - See {@link ClosingCtaProps}.
 */
export function ClosingCta({ content }: ClosingCtaProps) {
  return (
    <Section>
      <Reveal y={24}>
        <div className="cta-panel night-zone px-6 py-14 text-center sm:px-10 sm:py-16">
          <span className="cta-horizon" aria-hidden="true" />
          <span className="cta-bloom" aria-hidden="true" />
          <span className="cta-grain" aria-hidden="true" />
          <span className="cta-corners" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-[780px] flex-col items-center gap-6">
            <BrandMark size={40} />
            <h2 className="font-display text-[length:var(--fs-display)] leading-[1.04] font-semibold text-balance text-white [font-variation-settings:'wdth'_120] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
              {content.title}
            </h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lead)] text-pretty text-white/78">
              {content.subtitle}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {/* The panel's `night-zone` class (Task E5) re-pins the CTA
                  tokens to the dark pairing — full-brightness lime fill with
                  an ink label — in both themes, so no per-button `!bg`
                  override is needed anymore. */}
              <Button href="/contact" size="lg">
                {content.primaryCta}
              </Button>
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 active:bg-white/10"
              >
                {content.secondaryCta}
              </Button>
            </div>

            <ArrowLink href="/pricing" className="text-white/85 hover:text-[var(--lime-400)]">
              {content.pricingLink}
            </ArrowLink>

            <p className="text-[length:var(--fs-meta)] text-white/70">{content.note}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
