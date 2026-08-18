/**
 * ClosingCta — the pricing page's conversion band.
 *
 * A page-scoped sibling of `src/components/sections/platform/ClosingCta.tsx`
 * (same obsidian panel + lime "horizon" edge-light brand moment — see that
 * file's own header for why the class names are kept page-scoped rather
 * than shared — here `.pricing-cta-*` in `src/styles/pricing.css`), with
 * this page's own copy from `backup/scripe-static/pricing.html`'s closing
 * section. A Server Component; `Reveal` is the only client leaf.
 */
import type { PricingContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface ClosingCtaProps {
  /** The closing slice of the pricing page content. */
  content: PricingContent["cta"];
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
        <div className="pricing-cta-panel px-6 py-14 text-center sm:px-10 sm:py-16">
          <span className="pricing-cta-horizon" aria-hidden="true" />
          <span className="pricing-cta-bloom" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6">
            <BrandMark size={40} className="text-white" />
            <h2 className="font-display text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance text-white [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
              {content.title}
            </h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lead)] text-pretty text-white/78">
              {content.subtitle}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {/* Fixed lime-on-ink pairing: the panel is obsidian in both
                  themes, so the dark theme's full-brightness lime is always
                  the right fill here. */}
              <Button href="/contact" size="lg" className="!bg-[var(--lime-400)]">
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

            <p className="text-[length:var(--fs-meta)] text-white/70">{content.note}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
