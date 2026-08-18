/**
 * Outcomes — the shared "one place the numbers agree" KPI strip closing out
 * the solution page template's content (before the cross-links and CTA).
 *
 * The same bordered, divider-separated stat-strip idiom
 * `src/components/sections/platform/DashboardStrip.tsx` establishes for the
 * platform page's own closing payoff statement, reused here per-solution
 * with the page's own product accent instead of brand lime, and a centered
 * header — the DashboardStrip's own device, legitimately reused because
 * this section plays the identical role (a closing evidence strip) rather
 * than being scaffolding repeated for its own sake. Ported from
 * `backup/scripe-static/solutions/*.html`'s "numbers" section.
 *
 * Task E4: the KPI panel moved off its old one-off `shadow-[...]` onto the
 * shared elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`).
 * A Server Component; `Reveal` is the only client leaf.
 */
import type { AccentId, SolutionContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";

export interface OutcomesProps {
  /** The outcomes slice of the solution page's content. */
  content: SolutionContent["outcomes"];
  /** Product-world accent identity for this solution. */
  accent: AccentId;
}

/**
 * Renders the outcomes header and its bordered KPI strip.
 *
 * @param props - See {@link OutcomesProps}.
 */
export function Outcomes({ content, accent }: OutcomesProps) {
  return (
    <Section>
      <Reveal className="mx-auto max-w-[680px] text-center">
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h2>
        <p className="text-text-secondary mx-auto mt-5 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={24} className="mt-12">
        <div className="atmo-panel overflow-hidden rounded-lg">
          <div className="flex flex-wrap">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border-subtle grid min-w-0 flex-1 basis-52 gap-1.5 border-s px-8 py-8 text-center first:border-s-0 sm:text-start"
              >
                <span className={`sol-outcome-rule mx-auto sm:mx-0 ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
                <span className="font-display text-text-primary mx-auto text-[length:var(--fs-h1)] leading-[1.05] font-semibold tracking-[-0.015em] tabular-nums sm:mx-0 [font-variation-settings:'wdth'_114]">
                  {stat.value}
                </span>
                <span className="text-text-secondary text-[length:var(--fs-small)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-text-muted mt-4 text-[length:var(--fs-meta)]">{content.note}</p>
      </Reveal>
    </Section>
  );
}
