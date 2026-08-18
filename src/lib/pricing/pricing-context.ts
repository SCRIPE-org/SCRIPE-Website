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
 * `undefined` price. {@link fetchPricingContext} resolves `null` on EVERY
 * failure path — network error, non-2xx status, non-JSON body, timeout, or a
 * caller-supplied abort — so every consumer has exactly one failure case to
 * handle, not four. See `LivePrices.tsx`/`PricingCurrencyProvider.tsx` for
 * how `null` is treated: the page's baked SAR figures stand unchanged, and
 * `CurrencySelect.tsx` renders nothing rather than a currency list with
 * nothing real to offer.
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

/**
 * Validates one `supportedCurrencies` entry.
 *
 * @param value - A single array element from the parsed JSON body.
 * @returns Whether `value` is a well-formed {@link PricingCurrency}.
 */
function isValidCurrency(value: unknown): value is PricingCurrency {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.code === "string" &&
    candidate.code.length > 0 &&
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
 * Fetches the geo pricing context. Resolves `null` on every failure path —
 * network error, non-2xx response, a non-JSON or malformed body, the 5s
 * internal timeout, or an aborted `signal` — never throws. Callers branch on
 * `null` exactly once; no failure mode needs its own handling.
 *
 * @param signal - An optional caller-owned `AbortSignal` (e.g. a component's
 *   unmount-cleanup controller). Combined with this function's own 5s
 *   timeout via `AbortSignal.any` — whichever fires first aborts the
 *   request.
 * @returns The validated {@link PricingContext}, or `null` on any failure.
 */
export async function fetchPricingContext(signal?: AbortSignal): Promise<PricingContext | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.scripe.org/api";
  const url = `${base}${ENDPOINT_PATH}`;
  const timeoutSignal = AbortSignal.timeout(TIMEOUT_MS);
  const combinedSignal = signal ? AbortSignal.any([timeoutSignal, signal]) : timeoutSignal;

  try {
    const response = await fetch(url, { method: "GET", signal: combinedSignal });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (!isValidPricingContext(body)) return null;

    return body;
  } catch {
    // Network failure, JSON parse failure, or an abort (timeout or caller)
    // all land here — every one of them is an honest "no live context
    // available", not an error this call surfaces to its caller.
    return null;
  }
}
