/**
 * PlanCards (`#plans`) — the billing toggle plus the three pricing tier
 * cards (Starter, Growth, Enterprise). Ported from
 * `backup/scripe-static/pricing.html`'s `#plans` section: Growth stays the
 * visually promoted middle card (brand-accent border + "Most chosen" badge),
 * Starter/Growth carry a real SAR figure, Enterprise is always "Custom".
 *
 * ## The `data-price-slot` / `data-price-cycle-meta` contract
 *
 * Every price figure and every period-line caption below is rendered
 * TWICE — once for `monthly`, once for `yearly` — as sibling `<span>`s
 * inside one fixed-width wrapper, the non-active one carrying the native
 * `hidden` attribute. Each carries a `data-price-slot="<planId>-<cycle>"`
 * (figures) or `data-price-cycle-meta="<planId>-<cycle>"` (period-line
 * captions) attribute — `"starter-monthly"`, `"starter-yearly"`,
 * `"growth-monthly"`, `"growth-yearly"`, and `"enterprise-custom"` for the
 * one figure Enterprise has (never toggled — nothing matches `-monthly`/
 * `-yearly`, so `BillingToggle.tsx`'s cycle switch simply never touches it).
 * This buys two things:
 *
 * 1. `BillingToggle.tsx` (this page's only client leaf) can flip the
 *    visible cycle by querying `[data-price-slot$="-monthly"]` etc. and
 *    toggling `hidden` — an instant, zero-fetch swap of an already
 *    server-rendered figure, not a re-render.
 * 2. A later task's client-side currency swap (`LivePrices`, layered on top
 *    once the geo-currency endpoint is wired in) can target every price
 *    node on the page by this one stable attribute, keyed by plan id and
 *    cycle, without this markup ever changing.
 *
 * ## Zero-CLS width reservation
 *
 * Each price wrapper sets `min-inline-size` (via the `--price-slot-min`
 * custom property declared in `src/styles/pricing.css`) wide enough for the
 * longest realistic currency string this page will ever show — not just
 * these SAR figures, but the wider currency codes/values a later task's
 * live currency swap can land (e.g. `"EGP 149,000"` at 11 characters, wider
 * than any SAR figure here). Reserving that width on the CONTAINER (not the
 * individual monthly/yearly spans) means toggling which cycle is visible,
 * or a later currency swap rewriting a span's text, can never shift layout:
 * the box is already as wide as it will ever need to be, so a shorter
 * string just sits inside it with a little unused space instead of the box
 * shrinking. `tabular-nums` keeps digit glyphs a fixed width too, so the
 * two SAR figures line up on their decimal-free ones place regardless of
 * digit count.
 *
 * A Server Component; `BillingToggle` is the one client leaf.
 */
import type { PricingContent, PricingPlan } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";
import { BillingToggle } from "./BillingToggle";

export interface PlanCardsProps {
  /** The billing-toggle labels shared by every amount-priced card. */
  billing: PricingContent["billing"];
  /** The three pricing tiers, in display order. */
  plans: PricingPlan[];
  /** Small honesty note rendered under the grid. */
  plansFootnote: string;
}

/** Formats a SAR amount as `"SAR 9,900"` — thousands-grouped, no decimals,
 *  Western digits regardless of active locale (per this task's price-digit
 *  rule). `Intl.NumberFormat` is pinned to `"en-US"` rather than reading the
 *  active locale for exactly that reason. */
function formatSar(amount: number): string {
  return `SAR ${new Intl.NumberFormat("en-US").format(amount)}`;
}

/** Shared checklist glyph — the exact stroke path the legacy static page's
 *  own plan-card checklists and the current `HubCompare`/`ComparisonTable`
 *  checklists already use, kept a muted neutral here (feature bullets are
 *  not "positive vs. negative" the way a comparison-table cell is). */
function CheckGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-secondary mt-0.5 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Renders one plan's price block: the toggleable SAR figure pair (or the
 *  single "Custom" figure for Enterprise) inside its width-reserved
 *  wrapper, plus the matching period-line caption pair. */
function PriceBlock({ plan, billing }: { plan: PricingPlan; billing: PricingContent["billing"] }) {
  if (plan.baseMonthly === null || plan.baseYearly === null) {
    return (
      <div className="grid gap-1">
        {/* `width`/`inline-size` has no effect on an inline `<span>`, so the
            reservation lives on this wrapping block `<div>` — the same
            container-not-leaf placement the amount branch below uses. */}
        <div className="[min-inline-size:var(--price-slot-min)]">
          <span
            data-price-slot={`${plan.id}-custom`}
            className="font-display text-text-primary text-[2rem] leading-none font-semibold tracking-[-0.015em] tabular-nums"
          >
            {plan.customLabel}
          </span>
        </div>
        <span className="text-text-muted text-[length:var(--fs-small)]">{plan.customCaption}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      <div className="[min-inline-size:var(--price-slot-min)]">
        <span
          data-price-slot={`${plan.id}-monthly`}
          className="font-display text-text-primary text-[2rem] leading-none font-semibold tracking-[-0.015em] tabular-nums"
        >
          {formatSar(plan.baseMonthly)}
        </span>
        <span
          data-price-slot={`${plan.id}-yearly`}
          hidden
          className="font-display text-text-primary text-[2rem] leading-none font-semibold tracking-[-0.015em] tabular-nums"
        >
          {formatSar(plan.baseYearly)}
        </span>
      </div>
      <div>
        <span data-price-cycle-meta={`${plan.id}-monthly`} className="text-text-muted text-[length:var(--fs-small)]">
          {billing.perMonthSuffix}
        </span>
        <span
          data-price-cycle-meta={`${plan.id}-yearly`}
          hidden
          className="text-text-muted text-[length:var(--fs-small)]"
        >
          {billing.perYearSuffix}
        </span>
      </div>
    </div>
  );
}

/** Renders one plan card. */
function PlanCard({ plan, billing }: { plan: PricingPlan; billing: PricingContent["billing"] }) {
  return (
    <div
      className={
        plan.highlight
          ? "border-accent bg-surface-raised relative flex h-full flex-col gap-6 rounded-lg border-[1.5px] p-7 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.4)]"
          : "border-border-subtle bg-surface-raised flex h-full flex-col gap-6 rounded-lg border p-7"
      }
    >
      <div className="grid gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`inline-block size-2.5 shrink-0 rounded-[2px] ${ACCENT_DOT_CLASS[plan.accent]}`}
          />
          <h3 className="font-display text-text-primary text-[length:var(--fs-h3)] font-semibold">{plan.name}</h3>
          {plan.badge && (
            <span className="border-accent/40 bg-accent/10 text-accent-text ms-auto rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] font-medium whitespace-nowrap">
              {plan.badge}
            </span>
          )}
        </div>
        <p className="text-text-secondary text-[length:var(--fs-small)]">{plan.tagline}</p>
      </div>

      <PriceBlock plan={plan} billing={billing} />

      <ul className="m-0 grid list-none gap-2.5 p-0">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckGlyph />
            <span className="text-text-secondary text-[length:var(--fs-small)] text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto grid gap-2.5 pt-1">
        <Button href={plan.cta.href} variant={plan.highlight ? "primary" : "outline"} className="justify-self-start">
          {plan.cta.label}
        </Button>
        {plan.footnote && <span className="text-text-muted text-[length:var(--fs-meta)]">{plan.footnote}</span>}
      </div>
    </div>
  );
}

/**
 * Renders the billing toggle and the three-card plan grid.
 *
 * @param props - See {@link PlanCardsProps}.
 */
export function PlanCards({ billing, plans, plansFootnote }: PlanCardsProps) {
  return (
    <Section id="plans" className="scroll-mt-24">
      <div className="flex justify-center">
        <BillingToggle content={billing} />
      </div>

      <div
        className="mt-9 grid items-stretch gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(288px, 1fr))" }}
        data-rv-stagger
      >
        {plans.map((plan) => (
          <Reveal key={plan.id} y={24}>
            <PlanCard plan={plan} billing={billing} />
          </Reveal>
        ))}
      </div>

      <p className="text-text-muted mt-8 text-center text-[length:var(--fs-small)]">{plansFootnote}</p>
    </Section>
  );
}
