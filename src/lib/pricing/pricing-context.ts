/**
 * Geo pricing-context fetch client.
 *
 * ============================================================================
 * ENDPOINT CONTRACT
 * ============================================================================
 * `GET ${NEXT_PUBLIC_API_BASE_URL}/v1/auth/signup/pricing-context`
 *
 * Geo-detection happens entirely server-side: the backend reads Cloudflare's
 * `CF-IPCountry` request header (never a client-supplied value — a visitor
 * cannot spoof their own detected country by sending a header) and returns
 * that detection plus the currency it recommends and the full list of
 * currencies it can quote, each with its live USD conversion rate:
 *
 * ```json
 * {
 *   "detectedCountry": "SA",
 *   "recommendedCurrency": "SAR",
 *   "supportedCurrencies": [
 *     { "code": "SAR", "rateFromUsd": 3.75 },
 *     { "code": "USD", "rateFromUsd": 1 },
 *     { "code": "EGP", "rateFromUsd": 49.2 }
 *   ]
 * }
 * ```
 *
 * `rateFromUsd` is always "units of this currency per 1 USD" — the exact
 * shape `src/lib/pricing/convert.ts`'s `convertFromSar` expects for both of
 * its rate arguments, with no unit conversion needed at the call site.
 *
 * No request body, no auth header, no cookies — this is a public endpoint a
 * visitor's browser calls directly, unauthenticated, before any account
 * exists. Nothing here ever touches a secret, a token, or PII: only a
 * detected-country code and public currency rates cross the wire.
 *
 * ============================================================================
 * TRUST BOUNDARY
 * ============================================================================
 * This is a response from a public HTTP endpoint — nothing about its shape
 * is assumed correct until checked field-by-field by
 * {@link isValidPricingContext}. Any missing field, wrong type, or malformed
 * currency entry resolves the whole call to `null` rather than returning a
 * partially-trusted object a caller might destructure into a `NaN` or
 * `undefined` price — a REJECT-THE-WHOLE-PAYLOAD strategy, not a
 * filter-out-the-bad-entry one, chosen so a caller never has to reason about
 * a `PricingContext` that's missing an entry it might otherwise assume
 * exists (e.g. no `"SAR"` entry left after filtering breaks
 * `convertFromSar`'s SAR-rate lookup silently rather than obviously).
 * {@link fetchPricingContext} resolves `null` on EVERY failure path —
 * network error, non-2xx status, non-JSON body, timeout, a caller-supplied
 * abort, OR a malformed field — so every consumer has exactly one failure
 * case to handle, not five. See `LivePrices.tsx`/`PricingCurrencyProvider.tsx`
 * for how `null` is treated: the page's baked SAR figures stand unchanged,
 * and `CurrencySelect.tsx` renders nothing rather than a currency list with
 * nothing real to offer.
 *
 * ============================================================================
 * CURRENCY-CODE SHAPE — the crash this validation exists to prevent
 * ============================================================================
 * `formatPrice` (`convert.ts`) hands `currency` straight to
 * `Intl.NumberFormat`, which throws a `RangeError` for a `currency` value
 * that isn't a well-formed ISO 4217 code shape (`IsWellFormedCurrencyCode`
 * in the ECMA-402 spec: exactly 3 letters — verified directly: `"US-DOLLAR"`
 * throws, `""` throws, but a shape-valid *unrecognized* code like `"ZZZ"`
 * does NOT throw, it just renders with the code as its own symbol). A
 * currency code reaching `formatPrice` from an unvalidated network response
 * is therefore a real page-crash vector, not a cosmetic one — there is no
 * error boundary in `src/app` to catch it. {@link isValidCurrency} enforces
 * `/^[A-Za-z]{3}$/` on every `supportedCurrencies[].code` for exactly this
 * reason (layer 1 of 2 — `convert.ts`'s `safeFormatPrice` is layer 2,
 * `LivePrices.tsx`'s own defense-in-depth backstop for any shape this
 * layer's regex didn't anticipate). `recommendedCurrency` is NOT held to
 * the same regex/rejection here — see {@link isValidPricingContext}'s own
 * comment for why that's still safe.
 */

/** One currency SCRIPE can quote a price in, and its live rate against USD
 *  ("units of this currency per 1 USD"). */
export interface PricingCurrency {
  /** ISO 4217 currency code (e.g. `"SAR"`, `"USD"`, `"EGP"`). */
  code: string;
  /** Units of this currency per 1 USD. */
  rateFromUsd: number;
}

/** The geo pricing context — see this file's header for the full endpoint
 *  contract and trust boundary. */
export interface PricingContext {
  /** ISO 3166-1 alpha-2 country code the backend detected from the request
   *  (Cloudflare's `CF-IPCountry` header). Informational only — nothing in
   *  this pricing feature branches on it directly; `recommendedCurrency` is
   *  the field that actually drives behavior. */
  detectedCountry: string;
  /** The currency code the backend recommends showing by default for the
   *  detected country. Not necessarily in effect — a stored visitor
   *  override (`localStorage["scripe-currency"]`, read by
   *  `PricingCurrencyProvider.tsx`) takes precedence when present. */
  recommendedCurrency: string;
  /** Every currency SCRIPE can quote a price in, each with its live USD
   *  rate. Always includes at least one entry when this object is returned
   *  at all — see {@link isValidPricingContext}. */
  supportedCurrencies: PricingCurrency[];
}

/** The pricing-context endpoint's path, relative to `NEXT_PUBLIC_API_BASE_URL`. */
const ENDPOINT_PATH = "/v1/auth/signup/pricing-context";

/** Request timeout — this call sits on the pricing page's live-conversion
 *  path, not a blocking one (the baked SAR figures are already fully
 *  rendered before this ever fires), so a short bound keeps a slow/dead
 *  backend from leaving `LivePrices.tsx`'s loading state hanging
 *  indefinitely rather than falling back to the baked truth. */
const TIMEOUT_MS = 5000;

/** A well-formed ISO 4217 currency-code SHAPE: exactly 3 ASCII letters,
 *  either case. Mirrors `Intl.NumberFormat`'s own `IsWellFormedCurrencyCode`
 *  check — see this file's header for why that specific shape is what
 *  actually prevents the `RangeError` crash, and why a shape-valid but
 *  unrecognized code (e.g. `"ZZZ"`) is intentionally still accepted here
 *  (it doesn't crash `Intl.NumberFormat`; only a malformed SHAPE does). */
const CURRENCY_CODE_RE = /^[A-Za-z]{3}$/;

/**
 * Validates one `supportedCurrencies` entry, including the code-shape check
 * this file's header documents as the actual crash-prevention boundary.
 *
 * @param value - A single array element from the parsed JSON body.
 * @returns Whether `value` is a well-formed {@link PricingCurrency}.
 */
function isValidCurrency(value: unknown): value is PricingCurrency {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.code === "string" &&
    CURRENCY_CODE_RE.test(candidate.code) &&
    typeof candidate.rateFromUsd === "number" &&
    Number.isFinite(candidate.rateFromUsd) &&
    candidate.rateFromUsd > 0
  );
}

/**
 * Validates the full parsed JSON body against the {@link PricingContext}
 * shape. Returns `false` for any missing or malformed field — see this
 * file's header ("Trust boundary").
 *
 * `recommendedCurrency` is checked for "non-empty string" only, NOT the
 * same `CURRENCY_CODE_RE` shape `supportedCurrencies[].code` is held to —
 * deliberately, not an oversight. `recommendedCurrency` is never handed to
 * `formatPrice` directly; `PricingCurrencyProvider.tsx` only ever adopts it
 * as `activeCurrency` when it exactly matches a code already drawn from
 * `supportedCurrencies` (which IS shape-validated below). A malformed
 * `recommendedCurrency` therefore can't crash anything — it simply fails
 * that match and the provider falls back to `"SAR"`, so rejecting the whole
 * payload over it would be stricter than the crash this file exists to
 * prevent actually requires. {@link normalizePricingContext} still
 * uppercases it, purely so a same-currency case difference (backend sends
 * `"usd"` as recommended but `"USD"` in the list) doesn't spuriously trigger
 * that same fallback.
 *
 * @param value - The parsed JSON response body.
 * @returns Whether `value` is a well-formed {@link PricingContext}.
 */
function isValidPricingContext(value: unknown): value is PricingContext {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  if (typeof candidate.detectedCountry !== "string" || candidate.detectedCountry.length === 0) return false;
  if (typeof candidate.recommendedCurrency !== "string" || candidate.recommendedCurrency.length === 0) return false;
  if (!Array.isArray(candidate.supportedCurrencies) || candidate.supportedCurrencies.length === 0) return false;

  return candidate.supportedCurrencies.every(isValidCurrency);
}

/**
 * Normalizes a validated {@link PricingContext}'s currency codes to
 * uppercase — "on ingest," once, here, so every downstream comparison
 * (`code === "SAR"` in `LivePrices.tsx`/`CurrencySelect.tsx`,
 * `context.supportedCurrencies.some(...)` in
 * `PricingCurrencyProvider.tsx`'s `setCurrency` guard) can do a plain,
 * case-sensitive equality check instead of every call site normalizing
 * case itself. Runs only after {@link isValidPricingContext} has already
 * confirmed every code's SHAPE, so `.toUpperCase()` here never turns a
 * still-malformed value into a falsely-trusted one — it only changes case.
 *
 * @param context - An already-validated {@link PricingContext}.
 * @returns A new object with `recommendedCurrency` and every
 *   `supportedCurrencies[].code` uppercased.
 */
function normalizePricingContext(context: PricingContext): PricingContext {
  return {
    detectedCountry: context.detectedCountry,
    recommendedCurrency: context.recommendedCurrency.toUpperCase(),
    supportedCurrencies: context.supportedCurrencies.map((currency) => ({
      code: currency.code.toUpperCase(),
      rateFromUsd: currency.rateFromUsd,
    })),
  };
}

/**
 * Fetches the geo pricing context. Resolves `null` on every failure path —
 * network error, non-2xx response, a non-JSON or malformed body, the 5s
 * internal timeout, an aborted `signal`, OR (the contract-closure fix this
 * function's whole body now sits inside one `try` for) an environment
 * where `AbortSignal.timeout`/`AbortSignal.any` themselves throw
 * synchronously (older browsers without them) — never throws, and never
 * returns a REJECTED promise either. Previously, those two `AbortSignal`
 * calls sat OUTSIDE the `try`: a synchronous throw from either of them
 * inside this `async function` becomes a rejected promise regardless of
 * where the throw occurs in the function body, so a caller doing
 * `fetchPricingContext(...).then(...)` with no `.catch` would have seen an
 * unhandled rejection on exactly the browsers this feature most needs to
 * degrade gracefully on. Callers branch on `null` exactly once; no failure
 * mode needs its own handling.
 *
 * @param signal - An optional caller-owned `AbortSignal` (e.g. a component's
 *   unmount-cleanup controller). Combined with this function's own 5s
 *   timeout via `AbortSignal.any` — whichever fires first aborts the
 *   request.
 * @returns The validated, uppercase-normalized {@link PricingContext}, or
 *   `null` on any failure.
 */
export async function fetchPricingContext(signal?: AbortSignal): Promise<PricingContext | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.scripe.org/api";
    const url = `${base}${ENDPOINT_PATH}`;
    const timeoutSignal = AbortSignal.timeout(TIMEOUT_MS);
    const combinedSignal = signal ? AbortSignal.any([timeoutSignal, signal]) : timeoutSignal;

    const response = await fetch(url, { method: "GET", signal: combinedSignal });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (!isValidPricingContext(body)) return null;

    return normalizePricingContext(body);
  } catch {
    // Network failure, JSON parse failure, an abort (timeout or caller), or
    // an AbortSignal API missing entirely all land here — every one of them
    // is an honest "no live context available," not an error this call
    // surfaces to its caller.
    return null;
  }
}
