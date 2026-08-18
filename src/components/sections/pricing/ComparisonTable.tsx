/**
 * ComparisonTable (`#compare`) — the full plan-by-plan feature matrix.
 * Ported row-for-row from `backup/scripe-static/pricing.html`'s `#compare`
 * section: three row groups (Operations, Commercial, Organization), each
 * cell either a themed included/excluded glyph or short text (branch
 * counts, onboarding/support tiers).
 *
 * A semantic `<table>` inside an `overflow-x-auto` wrapper — horizontally
 * scrollable by touch, trackpad, or keyboard once the four columns no
 * longer fit. The wrapper carries `tabIndex={0}` + `role="region"` (WCAG
 * technique SCR29): a table built entirely of static text/glyphs has no
 * focusable descendant of its own to hand keyboard users a scroll target,
 * so without an explicit tab stop on the scroll container itself, arrow-key
 * scrolling would be reachable by mouse/touch/trackpad only — not every
 * browser adds an unindexed overflow container to the tab order on its
 * own. The row-label column stays pinned via Tailwind's logical `start-0`
 * utility (`inset-inline-start: 0`), so a reader who has scrolled two
 * columns in can still see which capability each row describes; the
 * highlighted Growth column keeps its own solid background so it doesn't
 * show through the row label's sticky cell as it scrolls underneath.
 *
 * A Server Component — no client JS.
 */
import type { PricingContent, PricingComparisonValue, PricingPlan } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface ComparisonTableProps {
  /** The comparison slice of the pricing page content. */
  content: PricingContent["comparison"];
  /** The three plans, in column order — read for their names and to find
   *  which column is `highlight`ed (tinted, per the legacy page's own
   *  Growth-column emphasis). */
  plans: PricingPlan[];
}

/** Included-cell glyph: the same checkmark path used sitewide, in the
 *  established "positive = jade" accent (`src/components/sections/platform
 *  /CapabilityEvidence.tsx`'s `TONE_CLASS.positive` convention). */
function IncludedGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent-venue"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Excluded-cell glyph: a short muted dash — deliberately not a red "X"
 *  (Fusion's iconography reserves alarm colors for real status states, not
 *  a plain "not on this tier" fact; see `CapabilityEvidence.tsx`'s header
 *  for the same positive/attention/neutral discipline). */
function ExcludedGlyph() {
  return <span aria-hidden="true" className="bg-border-strong inline-block h-px w-3" />;
}

/** Renders one table cell for a {@link PricingComparisonValue}. */
function ValueCell({
  value,
  includedLabel,
  notIncludedLabel,
}: {
  value: PricingComparisonValue;
  includedLabel: string;
  notIncludedLabel: string;
}) {
  if (value.kind === "included") {
    return (
      <>
        <IncludedGlyph />
        <span className="sr-only">{includedLabel}</span>
      </>
    );
  }
  if (value.kind === "excluded") {
    return (
      <>
        <ExcludedGlyph />
        <span className="sr-only">{notIncludedLabel}</span>
      </>
    );
  }
  return <span className="text-text-secondary text-[length:var(--fs-small)]">{value.text}</span>;
}

/**
 * Renders the comparison header and its scrollable table.
 *
 * @param props - See {@link ComparisonTableProps}.
 */
export function ComparisonTable({ content, plans }: ComparisonTableProps) {
  return (
    <Section id="compare" className="bg-surface-overlay/40 scroll-mt-24">
      <Reveal className="max-w-[760px]">
        <p className="text-accent-text flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h2 className="font-display text-text-primary mt-5 text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={20} className="mt-10">
        <div
          role="region"
          aria-label={content.title}
          tabIndex={0}
          className="border-border-subtle bg-surface-raised overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-ring)]"
        >
          <table className="w-full min-w-[640px] border-collapse">
            <caption className="caption-bottom text-text-muted px-6 py-5 text-start text-[length:var(--fs-meta)] text-pretty">
              {content.caption}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-border-subtle bg-surface-raised sticky start-0 z-[1] min-w-[240px] border-b p-4 text-start"
                >
                  <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
                    {content.columnHeader}
                  </span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={`border-border-subtle min-w-[132px] border-b p-4 ${
                      plan.highlight ? "bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]" : ""
                    }`}
                  >
                    <span
                      className={`text-[length:var(--fs-small)] font-medium ${
                        plan.highlight ? "text-accent-text" : "text-text-primary"
                      }`}
                    >
                      {plan.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {content.groups.map((group) => (
              <tbody key={group.title}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={plans.length + 1}
                    className="border-border-subtle bg-surface-overlay p-4 pb-2.5 text-start"
                  >
                    <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
                      {group.title}
                    </span>
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="border-border-subtle bg-surface-raised sticky start-0 z-[1] border-b p-4 text-start font-normal"
                    >
                      <span className="text-text-primary text-[length:var(--fs-small)]">{row.label}</span>
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${plans[index]?.id ?? index}`}
                        className={`border-border-subtle border-b p-4 text-center ${
                          plans[index]?.highlight ? "bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]" : ""
                        }`}
                      >
                        <span className="inline-flex items-center justify-center">
                          <ValueCell value={value} includedLabel={content.includedLabel} notIncludedLabel={content.notIncludedLabel} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
