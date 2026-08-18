/**
 * SAR-base price conversion + currency formatting.
 *
 * ============================================================================
 * CONTROLLER RULING — supersedes Task 21's brief (binding)
 * ============================================================================
 * The brief this task shipped with assumed a static USD base price per plan
 * (`convertPrice(baseUsd, rateFromUsd)`). Task 16's SCRIPE-Frontend
 * cross-check (recorded in `src/content/en/pricing.ts`'s file header and
 * `PricingPlan["baseUsd"]`'s doc comment in `src/content/types.ts`) proved
 * there is no static USD base anywhere in the signup module — SCRIPE's plan
 * catalog is entirely API/geo-driven, and every baked figure this site ships
 * (`PricingPlan["baseMonthly"]`/`["baseYearly"]`) is denominated in SAR
 * (`baseCurrency: "SAR"`), with `baseUsd: null`. The conversion contract is
 * therefore pivoted through SAR, not USD-as-input: {@link convertFromSar}
 * takes the baked SAR figure directly plus two USD-per-unit rates (SAR's own
 * and the target currency's — the exact shape `pricing-context.ts`'s
 * `PricingContext["supportedCurrencies"]` reports), and does the USD pivot
 * internally.
 *
 * Consumed by `src/components/sections/pricing/LivePrices.tsx`, which reads
 * both rates out of the fetched `PricingContext` and calls this for each of
 * the four convertible price slots `PlanCards.tsx` renders.
 */

/**
 * Rounds a converted amount to a "clean" display tier — a converted price
 * doesn't need single-currency-unit precision, and a round number reads as
 * more trustworthy than an exact-seeming conversion artifact. Coarser tiers
 * apply as the magnitude grows:
 *
 * - `< 100`   → nearest 1
 * - `>= 100`  → nearest 5
 * - `>= 1000` → nearest 10
 *
 * @param amount - The raw (unrounded) converted amount.
 * @returns `amount` rounded to its tier's step.
 */
function roundToTier(amount: number): number {
  const magnitude = Math.abs(amount);
  if (magnitude >= 1000) return Math.round(amount / 10) * 10;
  if (magnitude >= 100) return Math.round(amount / 5) * 5;
  return Math.round(amount);
}

/**
 * Converts a SAR-denominated baked price into a target currency, pivoting
 * through USD, then rounds the result to a clean display tier (see
 * {@link roundToTier}).
 *
 * `baseSar / rateSarPerUsd` recovers the USD value; `* rateTargetPerUsd`
 * converts that USD value into the target currency — both rates are
 * "units of this currency per 1 USD", matching
 * `PricingContext["supportedCurrencies"][number]["rateFromUsd"]`'s exact
 * unit exactly, so both arguments can be read straight off that array with
 * no unit conversion at the call site.
 *
 * Identity guarantee: when `rateSarPerUsd === rateTargetPerUsd` (converting
 * SAR to SAR, or — in the general case this function only ever sees two
 * numbers, never currency codes — to any currency that happens to share
 * SAR's exact rate), this returns `baseSar` completely unchanged rather than
 * routing it through the divide-then-multiply arithmetic. That is a
 * deliberate short-circuit, not an optimization: `baseSar / r * r` is not
 * guaranteed by IEEE-754 float arithmetic to land back on the exact original
 * integer for every possible rate, and the baked SAR figures in
 * `src/content/{en,ar}/pricing.ts` are the product's stated truth — they
 * must never visibly drift (e.g. render as "989" or "991") when the active
 * currency is SAR itself.
 *
 * @param baseSar - The baked SAR figure (`PricingPlan["baseMonthly"]` or
 *   `["baseYearly"]`), e.g. `990`, `2490`, `9900`, `24900`.
 * @param rateSarPerUsd - SAR units per 1 USD (SAR's own `rateFromUsd` from
 *   `PricingContext["supportedCurrencies"]`).
 * @param rateTargetPerUsd - The target currency's units per 1 USD (that
 *   currency's own `rateFromUsd`).
 * @returns The converted, tier-rounded amount in the target currency.
 */
export function convertFromSar(baseSar: number, rateSarPerUsd: number, rateTargetPerUsd: number): number {
  if (rateSarPerUsd === rateTargetPerUsd) return baseSar;

  const usd = baseSar / rateSarPerUsd;
  const target = usd * rateTargetPerUsd;
  return roundToTier(target);
}

/**
 * Formats a converted amount as a localized currency string.
 *
 * Two deliberate departures from `Intl.NumberFormat`'s defaults, both
 * binding per this task's brand rule:
 *
 * 1. **Western digits, always** — `Intl.NumberFormat("ar", ...)` defaults to
 *    Arabic-Indic digits (٠-٩) for the `"ar"` locale. SCRIPE's brand rule
 *    (see `PlanCards.tsx`'s own `formatSar` helper, which pins `"en-US"` for
 *    the same reason) keeps every price figure in Western digits regardless
 *    of active locale. Rather than pinning the whole locale to `"en"` for
 *    Arabic pages (which would also flip currency-name/symbol placement and
 *    RTL-aware formatting away from Arabic), the `-u-nu-latn` Unicode
 *    locale extension is appended — it keeps the `"ar"` locale's own
 *    grammar/symbol/placement rules intact and overrides ONLY the numbering
 *    system to Latin digits.
 * 2. **`currencyDisplay: "narrowSymbol"`** — prefers a currency's short
 *    glyph (`$`, `E£`) over its longer localized name or ISO code where ICU
 *    has one. Currencies with no dedicated narrow glyph (SAR has none in
 *    ICU's data) fall back to the ISO code (`"SAR"`) — that fallback is
 *    exercised by this file's own test suite rather than assumed.
 *
 * `maximumFractionDigits: 0` matches every price on this site already being
 * a whole-currency-unit figure post-{@link convertFromSar}'s rounding — no
 * converted price ever needs cents/halalas precision.
 *
 * @param amount - The amount to format (already converted/rounded, or a
 *   baked figure for the `"SAR"` case).
 * @param currency - ISO 4217 currency code (e.g. `"SAR"`, `"USD"`, `"EGP"`).
 * @param locale - The active site locale (`"en"` or `"ar"`) — any other
 *   value falls back to `"en"`'s formatting rules.
 * @returns The formatted currency string.
 */
export function formatPrice(amount: number, currency: string, locale: string): string {
  const intlLocale = locale === "ar" ? "ar-u-nu-latn" : "en";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Defense-in-depth wrapper around {@link formatPrice} — the guard
 * `LivePrices.tsx` calls instead of `formatPrice` directly.
 *
 * `Intl.NumberFormat` throws a `RangeError` when `currency` isn't a
 * well-formed 3-letter code shape (`"US-DOLLAR"` throws; `""` throws — see
 * `pricing-context.ts`'s header for the exact spec rule and the verified
 * throw/no-throw cases). `pricing-context.ts`'s `isValidCurrency` already
 * rejects that shape at the network-response boundary — the layer that
 * should make this unreachable in practice — but `src/app` has no error
 * boundary, so a currency code reaching `formatPrice` any other way (a
 * future call site, an ICU behavior change, a future field added to
 * `PricingContext` this validation doesn't yet cover) would otherwise crash
 * the whole pricing page rather than degrade to the baked SAR figures. This
 * function is the second, independent layer: it converts that throw into
 * `null` instead of letting it propagate, so ITS caller only ever has a
 * value to check, never an exception to catch.
 *
 * @param amount - See {@link formatPrice}.
 * @param currency - See {@link formatPrice}.
 * @param locale - See {@link formatPrice}.
 * @returns The formatted string, or `null` if `formatPrice` threw.
 */
export function safeFormatPrice(amount: number, currency: string, locale: string): string | null {
  try {
    return formatPrice(amount, currency, locale);
  } catch {
    return null;
  }
}
