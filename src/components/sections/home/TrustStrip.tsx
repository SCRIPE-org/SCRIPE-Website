/**
 * TrustStrip (`#trusted`) — honest positioning strip, and the first beat of
 * the ground sequence (slate `05 / Trusted` — see `Slate.tsx`).
 *
 * The quietest section on the page by design: a centered slate + heading +
 * sentence and the five organization categories SCRIPE is built for, as
 * elevated chips (`.chip-lit` — real surfaces on the shadow ramp, replacing
 * the old flat hairline boxes). Deliberately NO logo wall, NO invented
 * metrics and NO fabricated customer marks — the categories are the honest
 * claim the legacy site already made. Atmosphere: the `.gs-trusted` recipe
 * (a cool overhead glow — the hero stage's hand-off light; dark theme only,
 * see `src/styles/home.css` §13). Rhythm is compressed below the shared
 * Section default — this is a bridge, not a destination. Chips stagger in
 * via the shared `Reveal` + `data-rv-stagger` choreography. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { Slate } from "./Slate";

export interface TrustStripProps {
  /** The trusted slice of the home page content. */
  content: HomeContent["trusted"];
}

/**
 * Renders the trust strip.
 *
 * @param props - See {@link TrustStripProps}.
 */
export function TrustStrip({ content }: TrustStripProps) {
  return (
    <Section
      id="trusted"
      className="gs gs-trusted scroll-mt-24 !py-[clamp(var(--space-9),6vh,var(--space-10))]"
    >
      <Reveal className="mx-auto max-w-[680px] text-center">
        <Slate no="05" label={content.stamp} center />
        <h2 className="gs-title gs-title-sm">{content.title}</h2>
        <p className="text-text-secondary mx-auto mt-3 max-w-[56ch] text-[length:var(--fs-body)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap justify-center gap-3" data-rv-stagger>
        {content.categories.map((category) => (
          <Reveal key={category} y={10}>
            <span className="chip-lit text-text-secondary inline-flex min-h-[52px] items-center rounded-md px-6 font-display text-[0.8125rem] font-semibold tracking-[0.09em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {category}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
