/**
 * SolutionCta — the closing conversion band shared by every solution page's
 * `[slug]` template.
 *
 * The same obsidian panel + lime "horizon" edge-light brand moment
 * `src/components/sections/home/ClosingCta.tsx` and
 * `src/components/sections/platform/ClosingCta.tsx` each give their own
 * page — the shared `.atmo-cta-*` recipe (`src/styles/tokens/atmosphere.css`,
 * Task E4), used here and by the hub's own `HubCta.tsx`. Deliberately not
 * accented per solution: the panel is always obsidian in both themes, so its
 * foregrounds are fixed light values rather than theme tokens or the page's
 * own product accent — the same documented single-look exception
 * `ClosingCta.tsx` establishes. A Server Component; `Reveal` is the only
 * client leaf.
 */
import type { SolutionContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface SolutionCtaProps {
  /** The CTA slice of the solution page's content. */
  content: SolutionContent["cta"];
}

/**
 * Renders the solution page's closing CTA panel.
 *
 * @param props - See {@link SolutionCtaProps}.
 */
export function SolutionCta({ content }: SolutionCtaProps) {
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
                href="/platform"
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
