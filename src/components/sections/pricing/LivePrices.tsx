"use client";

/**
 * LivePrices — the client leaf that rewrites `PlanCards.tsx`'s baked SAR
 * price figures into the visitor's active currency, once a live geo pricing
 * context is available. Renders no DOM of its own (`return null`) — every
 * visible price node it touches already exists, server-rendered, inside
 * `PlanCards.tsx`'s `data-price-slot` wrappers; this component only ever
 * writes `textContent` into nodes that are already there.
 *
 * ============================================================================
 * WHY A DOM WRITE, NOT REACT STATE — Task 16's documented contract
 * ============================================================================
 * `PlanCards.tsx`'s file header names this exact tradeoff and why it's
 * intentional: the price slots are rendered by a Server Component
 * (`PlanCards`) in one part of the tree, while this component mounts from
 * `src/app/[locale]/pricing/page.tsx` in another — there is no shared React
 * component instance to hold "the current price" as state and re-render
 * from. `BillingToggle.tsx` already established the pattern this component
 * reuses: an imperative DOM write against a stable `data-price-slot`
 * attribute contract, not a re-render. Threading the converted figures back
 * into `PlanCards` as props would require either lifting `PlanCards` itself
 * into a Client Component (defeating the RSC-discipline this whole page is
 * built on — see `page.tsx`'s header) or a second server round-trip, neither
 * of which this feature needs when a plain DOM write does the job in one
 * `querySelector` per slot.
 *
 * ============================================================================
 * WHY WRITING BOTH CYCLES' SPANS ONCE COVERS THE BILLING TOGGLE
 * ============================================================================
 * `BillingToggle.tsx`'s own file header documents its mechanism precisely:
 * both the monthly AND yearly price `<span>`s for every plan are ALREADY
 * present in the server-rendered DOM at all times — the toggle only flips
 * the `hidden` attribute on whichever pair isn't the active cycle, it never
 * removes or re-creates either span. `PlanCards.tsx` gives monthly and
 * yearly each their OWN distinct `data-price-slot` value
 * (`"starter-monthly"` vs `"starter-yearly"`, not one shared slot toggled
 * between two text values), so the four convertible slots this component's
 * `slots` prop lists already name both cycles for both amount-priced plans.
 * Writing every one of them once, whenever the active currency changes, is
 * therefore sufficient — there is no separate "the toggle was just clicked"
 * event to also listen for. Clicking Monthly/Yearly after a currency swap
 * simply reveals a `<span>` that was already holding the correctly converted
 * figure the whole time, exactly the same "instant, zero-fetch swap" that
 * `BillingToggle.tsx` gives the baked SAR figures.
 *
 * ============================================================================
 * ZERO CLS
 * ============================================================================
 * The only DOM mutation this component ever performs is `el.textContent =
 * ...` on a node that already exists, already has its own reserved-width
 * ancestor wrapper (`PlanCards.tsx`'s `[min-inline-size:var(--price-slot-min)]`
 * div — see that file's header for the full character-budget accounting,
 * including the `"EGP 149,000"`-class figures this feature's live currencies
 * can produce). No element is created, removed, resized, or reflowed by this
 * component — a shorter or longer converted string just sits inside a box
 * already sized for the widest realistic case.
 *
 * ============================================================================
 * FAILURE PATH — the page stays byte-identical
 * ============================================================================
 * `status !== "ready"` (still loading, or `"unavailable"` after a failed
 * fetch) and `activeCurrency === "SAR"` both short-circuit the effect before
 * it touches the DOM at all. A visitor on a slow connection, behind a
 * blocked/failing pricing-context endpoint, or simply not geo-recommended a
 * different currency sees exactly the same server-rendered SAR figures
 * `PlanCards.tsx` always rendered — this component never puts the page into
 * a visibly different state than "do nothing" until it has a fully validated
 * conversion to apply.
 *
 * ============================================================================
 * PER-SLOT FORMATTING GUARD — defense in depth, layer 2 of 2
 * ============================================================================
 * `pricing-context.ts`'s `isValidCurrency` (layer 1) already rejects any
 * currency code that isn't a well-formed 3-letter shape before it can ever
 * reach this component — that should make a `formatPrice` throw
 * unreachable here in practice. `src/app` has no error boundary, though, so
 * this component doesn't call `formatPrice` directly: it calls
 * `convert.ts`'s `safeFormatPrice`, which converts any throw into `null`
 * instead of letting it escape. A `null` result for one slot leaves THAT
 * slot's baked SAR figure exactly as server-rendered (the DOM write is
 * simply skipped for it — the baked SAR truth is this component's fallback
 * of last resort) rather than writing a garbled or partial string, and
 * marks the whole pass as failed via `reportConversionResult(true)` so
 * `CurrencyNote` hides its "Converted from SAR" disclosure rather than
 * claiming a conversion happened when at least one figure on the page is
 * still unconverted. A pass where every slot formats successfully reports
 * `false`, so a later currency that DOES work fully un-hides the note again
 * — this never gets stuck suppressed.
 */
import { useEffect } from "react";
import { useLocale } from "next-intl";
import { convertFromSar, safeFormatPrice } from "@/lib/pricing/convert";
import { usePricingCurrency } from "./PricingCurrencyProvider";

/** One convertible price slot: the exact `data-price-slot` attribute value
 *  `PlanCards.tsx` renders it under, and the baked SAR figure backing it. */
export interface PriceSlot {
  /** Matches `PlanCards.tsx`'s `data-price-slot="<planId>-<cycle>"` value
   *  exactly (e.g. `"starter-monthly"`, `"growth-yearly"`). */
  slot: string;
  /** The baked SAR figure this slot currently renders
   *  (`PricingPlan["baseMonthly"]`/`["baseYearly"]`). */
  baseSar: number;
}

export interface LivePricesProps {
  /** Every convertible price slot on the page — always four at launch (the
   *  Starter/Growth × monthly/yearly cross product). Enterprise's
   *  `"enterprise-custom"` slot is deliberately absent: it has no numeric
   *  SAR baseline to convert (`PricingPlan["baseMonthly"]` is `null` for a
   *  custom-quoted plan) — see `page.tsx` for exactly how this list is
   *  derived from `content.plans` so it can never drift out of sync with
   *  what `PlanCards.tsx` actually renders. */
  slots: PriceSlot[];
}

/**
 * Mounts the currency-conversion effect. Renders nothing — see this file's
 * header for the full DOM-write contract, the billing-toggle interaction
 * analysis, and the CLS/failure-path reasoning.
 *
 * @param props - See {@link LivePricesProps}.
 */
export function LivePrices({ slots }: LivePricesProps) {
  const locale = useLocale();
  const { status, context, activeCurrency, reportConversionResult } = usePricingCurrency();

  useEffect(() => {
    if (status !== "ready" || !context) return;
    // The baked SAR figures already sitting in the DOM ARE the SAR truth —
    // nothing to convert or write. (`reportConversionResult` is deliberately
    // NOT called here: `CurrencyNote`'s own render condition already
    // requires `activeCurrency !== "SAR"` before it would show anything, so
    // a stale `conversionFailed` value from a previous currency can't
    // matter while SAR is active.)
    if (activeCurrency === "SAR") return;

    const sarRate = context.supportedCurrencies.find((currency) => currency.code === "SAR")?.rateFromUsd;
    const targetRate = context.supportedCurrencies.find((currency) => currency.code === activeCurrency)?.rateFromUsd;
    // A context that doesn't carry a SAR rate, or doesn't actually carry the
    // active currency's own rate, is malformed for this feature's purposes —
    // leave the baked SAR figures standing rather than guess a conversion,
    // and report the pass as failed so the currency-conversion disclosure
    // doesn't claim a conversion that didn't happen.
    if (sarRate === undefined || targetRate === undefined) {
      reportConversionResult(true);
      return;
    }

    let anyFailure = false;
    for (const { slot, baseSar } of slots) {
      const el = document.querySelector<HTMLElement>(`[data-price-slot="${slot}"]`);
      if (!el) continue;
      const converted = convertFromSar(baseSar, sarRate, targetRate);
      const formatted = safeFormatPrice(converted, activeCurrency, locale);
      if (formatted === null) {
        // See this file's "Per-slot formatting guard" header section — the
        // baked SAR figure already in this node is left exactly as is.
        anyFailure = true;
        continue;
      }
      // Idempotent by construction: re-running this effect with the same
      // (status, context, activeCurrency, locale) always computes the same
      // string and assigns it again — a no-op write, not a visible change.
      el.textContent = formatted;
    }
    reportConversionResult(anyFailure);
  }, [status, context, activeCurrency, slots, locale, reportConversionResult]);

  return null;
}
