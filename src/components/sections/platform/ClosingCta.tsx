/**
 * ClosingCta — the platform page's conversion band.
 *
 * A page-scoped sibling of the home page's `ClosingCta`, not a shared
 * import: same obsidian panel + lime "horizon" edge-light brand moment,
 * now the shared `.atmo-cta-panel`/`.atmo-cta-horizon`/`.atmo-cta-bloom`/
 * `.atmo-cta-grain` recipe (`src/styles/tokens/atmosphere.css`, Task E4 —
 * see that file's header for why this moved out of a page-scoped copy), but
 * with this page's own copy and CTAs (a demo, and a link into `/solutions`
 * rather than pricing). Because the panel is always dark, its foregrounds
 * are fixed light values rather than theme tokens — a documented
 * single-look exception, not a leak. A Server Component; `Reveal` is the
 * only client leaf.
 */
import type { PlatformContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface ClosingCtaProps {
  /** The closing slice of the platform page content. */
  content: PlatformContent["closing"];
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
        <div className="atmo-cta-panel night-zone px-6 py-14 text-center sm:px-10 sm:py-16">
          <span className="atmo-cta-horizon" aria-hidden="true" />
          <span className="atmo-cta-bloom" aria-hidden="true" />
          <span className="atmo-cta-grain" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-[960px] flex-col items-center gap-6">
            <BrandMark size={40} decorative />
            <h2 className="atmo-title font-display text-[length:var(--fs-display)] text-balance text-white">
              {content.title}
            </h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lead)] text-pretty text-white/78">
              {content.subtitle}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {/* The panel's `night-zone` class (Task E5) re-pins the CTA
                  tokens to the dark pairing — lime fill, ink label — in both
                  themes; no per-button override needed. */}
              <Button href="/contact" size="lg">
                {content.primaryCta}
              </Button>
              <Button
                href="/solutions"
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
