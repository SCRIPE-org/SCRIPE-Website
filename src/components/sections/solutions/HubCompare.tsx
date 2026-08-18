/**
 * HubCompare (`#compare`) — "same platform, different centre of gravity":
 * one column per solution, each a checklist of the modules that
 * organization shape leans on first.
 *
 * Deliberately not a second `Card` grid: `HubGrid` above already spends this
 * page's one bordered-card moment, so this section uses plain
 * `border-border-subtle` panels with just a small accent dot beside each
 * heading (the same lighter-weight marker
 * `src/components/sections/platform/CapabilityGroup.tsx` uses) — visual
 * variety within one page instead of repeating the same affordance twice in
 * a row.
 *
 * Task E4: each column panel moved from a flat `border` onto the shared
 * elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`). A
 * Server Component; `Reveal` is the only client leaf.
 */
import type { SolutionsHubContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS } from "./accents";
import { ArrowLink } from "./ArrowLink";

export interface HubCompareProps {
  /** The compare slice of the hub's content. */
  content: SolutionsHubContent["compare"];
}

/**
 * Renders the compare header and its four checklist columns.
 *
 * @param props - See {@link HubCompareProps}.
 */
export function HubCompare({ content }: HubCompareProps) {
  return (
    <Section id="compare" className="bg-surface-overlay/40 scroll-mt-24">
      <Reveal className="max-w-[760px]">
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div
        className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "80ms" } as React.CSSProperties}
      >
        {content.columns.map((column) => (
          <Reveal key={column.href} y={16}>
            <div className="atmo-panel flex h-full flex-col gap-4 rounded-lg p-6">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-block size-2 shrink-0 rounded-[2px] ${ACCENT_DOT_CLASS[column.accent]}`}
                  aria-hidden="true"
                />
                <h3 className="font-display text-text-primary min-w-0 text-[length:var(--fs-h3)] font-semibold">
                  {column.title}
                </h3>
              </div>
              <ul className="m-0 grid list-none gap-2.5 p-0">
                {column.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`mt-0.5 shrink-0 ${ACCENT_TEXT_CLASS[column.accent]}`}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-text-secondary text-[length:var(--fs-small)] text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>
              <ArrowLink href={column.href} className="mt-auto pt-1">
                {column.cta}
              </ArrowLink>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
