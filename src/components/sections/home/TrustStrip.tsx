/**
 * TrustStrip (`#trusted`) — honest positioning strip.
 *
 * The quietest section on the page by design: a centered heading + sentence
 * and the five organization categories SCRIPE is built for, as tracked-out
 * hairline chips. Deliberately NO logo wall, NO invented metrics and NO
 * fabricated customer marks — the categories are the honest claim the
 * legacy site already made, presented as typography. Chips stagger in via
 * the shared `Reveal` + `data-rv-stagger` choreography. A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

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
      className="scroll-mt-24 !py-[clamp(var(--space-10),8vh,var(--space-12))]"
    >
      <Reveal className="mx-auto max-w-[640px] text-center">
        <h2 className="font-display text-text-primary text-[length:var(--fs-h2)] font-semibold text-balance">
          {content.title}
        </h2>
        <p className="text-text-secondary mx-auto mt-3 max-w-[56ch] text-[length:var(--fs-body)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap justify-center gap-3" data-rv-stagger>
        {content.categories.map((category) => (
          <Reveal key={category} y={10}>
            <span className="border-border-subtle text-text-secondary inline-flex min-h-[52px] items-center rounded-md border px-6 font-display text-[0.8125rem] font-semibold tracking-[0.09em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {category}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
