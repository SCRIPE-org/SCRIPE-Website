"use client";

/**
 * CurrencyNote — the small disclosure line under the plan grid
 * ("Converted from SAR · rates updated daily"), shown only while a non-SAR
 * currency is active. Rendered by `PlanCards.tsx` directly under the plan
 * grid, above `plansFootnote`.
 *
 * ============================================================================
 * ZERO-CLS RESERVATION STRATEGY
 * ============================================================================
 * The task requires this line's box to reserve its own space so its
 * appearance/disappearance (SAR ↔ a converted currency) never shifts the
 * page. Rather than computing a `min-height` guess in `px`/`rem` (fragile —
 * it has to exactly match this exact text's rendered line height at every
 * viewport width, and silently drifts the moment the copy or font changes),
 * this component ALWAYS renders the same paragraph with the same text
 * content and only toggles CSS `visibility` (`invisible` ↔ visible, Tailwind
 * utility for `visibility: hidden`) plus `aria-hidden`. `visibility: hidden`
 * keeps the element fully laid out (unlike `display: none`, which collapses
 * it and reintroduces exactly the shift this is meant to prevent) while
 * removing it from the visual and accessibility tree — so the box's height
 * is byte-identical whether shown or hidden, without hand-tuning a min-height
 * value that has to be kept in sync with the text by hand.
 *
 * `aria-hidden` follows `visibility` exactly: a screen reader has no reason
 * to ever announce a disclosure about currency conversion while SAR (i.e.
 * the baked, unconverted figures) is what's actually showing — which now
 * includes `conversionFailed` (see `PricingCurrencyProvider.tsx`'s own doc
 * comment on that field): if `LivePrices.tsx`'s most recent conversion pass
 * failed to write at least one price slot, this claims nothing was
 * converted rather than asserting a conversion that didn't fully happen.
 */
import { useTranslations } from "next-intl";
import { cx } from "@/components/ui/cx";
import { usePricingCurrency } from "./PricingCurrencyProvider";

/**
 * Renders the currency-conversion disclosure line, space-reserved at all
 * times — see this file's header.
 */
export function CurrencyNote() {
  const t = useTranslations();
  const { status, activeCurrency, conversionFailed } = usePricingCurrency();

  const showNote = status === "ready" && activeCurrency !== "SAR" && !conversionFailed;

  return (
    <p
      aria-hidden={!showNote}
      className={cx("mt-3 text-center text-[length:var(--fs-meta)] text-text-muted", !showNote && "invisible")}
    >
      {t("pricing.currencyNote")}
    </p>
  );
}
