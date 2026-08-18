/**
 * HubCta — the solutions hub's closing conversion band.
 *
 * Same `.atmo-cta-*` brand moment (`src/styles/tokens/atmosphere.css`, Task
 * E4) `SolutionCta.tsx` gives every solution page, with the hub's own copy
 * and CTAs ("Book a demo" + "See pricing", matching the legacy hub page's
 * own pair — every individual solution page instead pairs "Book a demo"
 * with "Explore the platform"). A Server Component; `Reveal` is the only
 * client leaf.
 */
import type { SolutionsHubContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface HubCtaProps {
  /** The CTA slice of the hub's content. */
  content: SolutionsHubContent["cta"];
}

/**
 * Renders the hub's closing CTA panel.
 *
 * @param props - See {@link HubCtaProps}.
 */
export function HubCta({ content }: HubCtaProps) {
  return (
    <Section>
      <Reveal y={24}>
        <div className="atmo-cta-panel night-zone px-6 py-14 text-center sm:px-10 sm:py-16">
          <span className="atmo-cta-horizon" aria-hidden="true" />
          <span className="atmo-cta-bloom" aria-hidden="true" />
          <span className="atmo-cta-grain" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6">
            <BrandMark size={40} className="text-white" />
            <h2 className="atmo-title font-display text-[length:var(--fs-display)] text-balance text-white">
              {content.title}
            </h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lead)] text-pretty text-white/78">
              {content.subtitle}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href="/contact" size="lg">
                {content.primaryCta}
              </Button>
              <Button
                href="/pricing"
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
