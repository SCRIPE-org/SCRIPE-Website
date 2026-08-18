"use client";

/**
 * CurrencySelect — the visible currency picker rendered next to
 * `BillingToggle` in `PlanCards.tsx`. Lists every currency the live pricing
 * context supports (`context.supportedCurrencies`, label = the code itself,
 * per this task's contract), always includes `"SAR"` as a manual reset back
 * to the baked truth even if the fetched context's own list happens not to
 * name it, and persists a visitor's choice through
 * `PricingCurrencyProvider.tsx`'s `setCurrency` (which itself owns the
 * `localStorage["scripe-currency"]` write — see that file's header).
 *
 * ============================================================================
 * WHY THIS RENDERS NOTHING BEFORE `status === "ready"`
 * ============================================================================
 * Before the Provider's fetch resolves (`status: "loading"`) there is no
 * currency list to offer yet; if it resolved to `null` (`status:
 * "unavailable"`) there never will be one for this page view — the honest
 * choice in both cases is to render nothing rather than a disabled select or
 * a single-option "SAR" dropdown that implies more capability than the page
 * actually has right now. This also keeps the server-rendered markup and the
 * client's pre-hydration first render identical (`status` starts `"loading"`
 * on both — see `PricingCurrencyProvider.tsx`'s "no hydration mismatch"
 * section): both render `null`. The select only appears once `status` flips
 * to `"ready"`, a client-only state update strictly AFTER hydration has
 * already completed — not a hydration-time difference, an ordinary post-
 * mount UI change, the same pattern `ThemeToggle.tsx` already establishes
 * for its own "nothing meaningful to show yet" initial render.
 *
 * Unlike the price-figure slots `LivePrices.tsx` writes into, this
 * component's own appearance is NOT under the pricing page's zero-CLS
 * contract — that contract is scoped explicitly to the reserved-width price
 * wrappers `PlanCards.tsx` documents. This control popping in once real
 * currency data exists is an accepted, expected layout change, the same way
 * the confirmation panel replacing `ContactForm.tsx`'s form is an accepted
 * change on that page.
 */
import { useTranslations } from "next-intl";
import { usePricingCurrency } from "./PricingCurrencyProvider";

/** Shared visual treatment, sized to sit next to `BillingToggle.tsx`'s own
 *  compact toggle group rather than a full-width form control. */
const SELECT_CLASS =
  "rounded-[var(--radius-md)] border border-border-subtle bg-surface-raised px-3 py-2 " +
  "text-[length:var(--fs-small)] text-text-primary transition-colors duration-[var(--motion-quick)] " +
  "ease-[var(--ease-standard)] hover:border-border-strong";

/**
 * Renders the currency picker, or nothing before a live context is ready —
 * see this file's header.
 */
export function CurrencySelect() {
  const t = useTranslations();
  const { status, context, activeCurrency, setCurrency } = usePricingCurrency();

  if (status !== "ready" || !context) return null;

  // "SAR" first, always present — the manual reset back to the baked
  // figures this task's hard rule requires, deduplicated against the
  // fetched list rather than assuming the backend never names it itself.
  const codes = Array.from(new Set(["SAR", ...context.supportedCurrencies.map((currency) => currency.code)]));

  return (
    <select
      aria-label={t("pricing.currencyLabel")}
      value={activeCurrency}
      onChange={(event) => setCurrency(event.target.value)}
      className={SELECT_CLASS}
    >
      {codes.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
