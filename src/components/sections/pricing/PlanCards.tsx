/**
 * PlanCards (`#plans`) — the billing toggle plus the three pricing tier
 * cards (Starter, Growth, Enterprise). Ported from
 * `backup/scripe-static/pricing.html`'s `#plans` section: Growth stays the
 * visually promoted middle card (brand-accent border + "Most chosen" badge),
 * Starter/Growth carry a real SAR figure, Enterprise is always "Custom".
 *
 * Task E4: every card moved off a flat border + one-off `shadow-[...]` onto
 * the shared elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`).
 * The promoted Growth card layers `.atmo-panel-deep` (shadow-3) and
 * `.atmo-panel-accent` (the same lime border, now 1.5px against a
 * `--atmo-panel-border`/`--atmo-panel-border-width` custom-property override
 * rather than a Tailwind `border-accent` utility — see `atmo-panel-accent`'s
 * own comment for why a plain utility override can't win against the
 * recipe's unlayered `border` shorthand under Tailwind v4's cascade layers).
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
 * ## Live currency layer (Task 21)
 *
 * `LivePrices` (mounted from `page.tsx`, not from this file — see its own
 * header) is the "later task" pass 1 above already anticipated: once a live
 * geo pricing context resolves to a non-SAR currency, it rewrites the exact
 * `data-price-slot` spans above via `textContent`, reusing the same
 * reserved-width boxes and the same monthly/yearly pair `BillingToggle`
 * already toggles — no markup here changed to support it. `CurrencySelect`
 * (rendered next to `BillingToggle` below) and `CurrencyNote` (rendered
 * under the plan grid) are this file's only two additions for that feature;
 * both read shared state from `PricingCurrencyProvider`, which `page.tsx`
 * wraps around this whole page so a Server Component (this file) and a
 * page-level client leaf (`LivePrices`) can coordinate without prop
 * drilling — see `PricingCurrencyProvider.tsx`'s header for the full
 * reasoning.
 *
 * ## Zero-CLS width reservation
 *
 * Each price wrapper sets `min-inline-size` (via the `--price-slot-min`
 * custom property declared in `src/styles/pricing.css`, currently `14ch` —
 * see that file's own comment for the character-budget reasoning) wide
 * enough for the longest realistic currency string this page will ever
 * show — not just these SAR figures, but the wider currency codes/values a
 * later task's live currency swap can land (e.g. `"EGP 149,000"` at 11
 * characters, wider than any SAR figure here). Reserving that width on the
 * CONTAINER (not the individual monthly/yearly spans) means toggling which
 * cycle is visible, or a later currency swap rewriting a span's text, can
 * never shift layout: the box is already as wide as it will ever need to
 * be, so a shorter string just sits inside it with a little unused space
 * instead of the box shrinking. `tabular-nums` keeps digit glyphs a fixed
 * width too, so the two SAR figures line up on their decimal-free ones
 * place regardless of digit count.
 *
 * `ch` is a font-relative unit: it resolves against the advance width of
 * the "0" glyph *at the element it is applied to*, using THAT element's own
 * computed font-size — not its children's. The price figures render at
 * `2rem`, so `text-[2rem]` is set ONCE, on the reserving wrapper `<div>`
 * itself (not on the price `<span>`s, which inherit it) — that is the only
 * way to guarantee `14ch` is ever computed against the same font context
 * the price text actually renders at. At the page's ambient body size
 * (`--fs-body`, ~15–16px), `14ch` would resolve to a noticeably narrower
 * box than 2rem price text needs, which is exactly the bug an earlier
 * version of this file had: `text-[2rem]` lived only on the `<span>`s, the
 * reservation lived on an unsized wrapper, `ch` resolved against the
 * ambient body size instead of 2rem, and the reservation "worked" only by
 * accident — propped up by the surrounding flex/grid stretch rather than
 * by the reservation itself. The `<span>`s cannot carry `min-inline-size`
 * themselves either way — `width`/`inline-size` has no effect on a
 * non-replaced inline element — and giving them a `display` utility to fix
 * that would silently break `BillingToggle.tsx`'s `hidden`-attribute
 * toggle (an author-stylesheet `display` class always beats the
 * user-agent `[hidden]{display:none}` rule in the cascade, regardless of
 * specificity), so the reservation has to live on the block-level wrapper,
 * and the wrapper is the one place that also has to carry the font-size.
 *
 * A Server Component; `BillingToggle` is the one client leaf.
 */
import type { PricingContent, PricingPlan } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { formatSar } from "@/lib/pricing/convert";
import { ACCENT_DOT_CLASS } from "./accents";
import { BillingToggle } from "./BillingToggle";
import { CurrencyNote } from "./CurrencyNote";
import { CurrencySelect } from "./CurrencySelect";

export interface PlanCardsProps {
  /** The billing-toggle labels shared by every amount-priced card. */
  billing: PricingContent["billing"];
  /** The three pricing tiers, in display order. */
  plans: PricingPlan[];
  /** Small honesty note rendered under the grid. */
  plansFootnote: string;
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
            container-not-leaf placement the amount branch below uses. This
            wrapper ALSO carries `text-[2rem]` (matching the price span's own
            size) purely so the `ch`-based `--price-slot-min` reservation is
            computed against the same font context the price text renders
            at — see this file's header for why that binding matters. */}
        <div className="text-[2rem] [min-inline-size:var(--price-slot-min)]">
          <span
            data-price-slot={`${plan.id}-custom`}
            className="font-display text-text-primary leading-none font-semibold tracking-[-0.015em] tabular-nums"
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
      {/* See the file header + the branch above: `text-[2rem]` here binds
          `--price-slot-min`'s `ch` unit to the price text's own font-size. */}
      <div className="text-[2rem] [min-inline-size:var(--price-slot-min)]">
        <span
          data-price-slot={`${plan.id}-monthly`}
          className="font-display text-text-primary leading-none font-semibold tracking-[-0.015em] tabular-nums"
        >
          {formatSar(plan.baseMonthly)}
        </span>
        <span
          data-price-slot={`${plan.id}-yearly`}
          hidden
          className="font-display text-text-primary leading-none font-semibold tracking-[-0.015em] tabular-nums"
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
          ? "atmo-panel atmo-panel-deep atmo-panel-accent relative flex h-full flex-col gap-6 rounded-lg p-7"
          : "atmo-panel flex h-full flex-col gap-6 rounded-lg p-7"
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
      <div className="flex flex-wrap items-center justify-center gap-3">
        <BillingToggle content={billing} />
        {/* Client leaf — see this file's "Live currency layer" header note
            and CurrencySelect.tsx's own header for why it renders nothing
            until a live pricing context is ready. */}
        <CurrencySelect />
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

      {/* Client leaf, space-reserved at all times — see CurrencyNote.tsx's
          header for why this never causes a layout shift. */}
      <CurrencyNote />

      <p className="text-text-muted mt-8 text-center text-[length:var(--fs-small)]">{plansFootnote}</p>
    </Section>
  );
}
