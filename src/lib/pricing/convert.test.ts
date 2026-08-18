/**
 * Tests for the SAR-base price conversion + currency formatting helpers.
 *
 * Written before `convert.ts` exists (TDD red phase — see Task 21's report
 * for the run that failed on a missing module before the implementation
 * landed). Covers the controller ruling's binding contract: `convertFromSar`
 * is an exact identity when the source and target rates match (protects the
 * baked SAR figures in `src/content/{en,ar}/pricing.ts` from float drift),
 * a three-tier rounding rule once rates actually differ (<100 → nearest 1,
 * ≥100 → nearest 5, ≥1000 → nearest 10), and `formatPrice` always renders
 * Western digits — even for the `"ar"` locale, where `Intl.NumberFormat`
 * defaults to Arabic-Indic digits unless explicitly pinned to the `latn`
 * numbering system — plus narrow currency symbols.
 *
 * The `safeFormatPrice` block at the end covers the after-review hardening
 * fix (`fix: harden currency validation and formatting fallback`):
 * `formatPrice` genuinely throws `RangeError` for a malformed currency code
 * (`"US-DOLLAR"`, verified against real `Intl.NumberFormat` behavior, not
 * assumed) — these tests both pin that throw exists AND prove
 * `safeFormatPrice`'s guard converts it to `null` instead of letting it
 * escape, which is the property `LivePrices.tsx` depends on to leave a
 * baked SAR figure untouched rather than crash the pricing page.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { convertFromSar, formatPrice, safeFormatPrice } from "./convert";

test("convertFromSar: SAR to SAR is an exact identity (Starter monthly, 990)", () => {
  assert.equal(convertFromSar(990, 3.75, 3.75), 990);
});

test("convertFromSar: SAR to SAR is an exact identity (Growth yearly, 24900)", () => {
  assert.equal(convertFromSar(24900, 3.75, 3.75), 24900);
});

test("convertFromSar: identity holds even when the rates are equal but not SAR's own rate", () => {
  // The function only ever sees two numbers, not currency codes — equal
  // rates must short-circuit to identity regardless of which currency they
  // happen to belong to, since that's what removes the float round-trip
  // risk the identity guarantee depends on.
  assert.equal(convertFromSar(2490, 1, 1), 2490);
});

test("convertFromSar: rounds to the nearest 5 in the 100-999 tier (990 SAR -> ~970 target)", () => {
  // 990 / 3.75 = 264 USD; 264 * 3.6725 = 969.54 -> nearest 5 -> 970.
  assert.equal(convertFromSar(990, 3.75, 3.6725), 970);
});

test("convertFromSar: rounds to the nearest 10 in the >=1000 tier (24900 SAR -> ~24390 target)", () => {
  // 24900 / 3.75 = 6640 USD; 6640 * 3.6725 = 24385.4 -> nearest 10 -> 24390.
  assert.equal(convertFromSar(24900, 3.75, 3.6725), 24390);
});

test("convertFromSar: rounds to the nearest 1 below the 100 tier (99 SAR -> ~24 target)", () => {
  // 99 / 3.75 = 26.4 USD; 26.4 * 0.9 = 23.76 -> nearest 1 -> 24.
  assert.equal(convertFromSar(99, 3.75, 0.9), 24);
});

test("convertFromSar: an already-clean converted figure is left unchanged by its own tier (9900 SAR -> 2640 USD)", () => {
  // 9900 / 3.75 = 2640 USD; already a multiple of 10, so the >=1000 tier's
  // rounding is a no-op — proof the rounding never nudges a clean number.
  assert.equal(convertFromSar(9900, 3.75, 1), 2640);
});

test("formatPrice: 'ar' locale renders Western digits, never Arabic-Indic digits", () => {
  const formatted = formatPrice(990, "SAR", "ar");
  assert.match(formatted, /990/, "expected the Western-digit figure 990 to appear literally");
  assert.equal(
    /[٠-٩]/.test(formatted),
    false,
    `expected no Arabic-Indic digits (U+0660-U+0669) in "${formatted}"`,
  );
});

test("formatPrice: 'en' locale also renders Western digits (baseline sanity check)", () => {
  const formatted = formatPrice(990, "USD", "en");
  assert.match(formatted, /990/);
  assert.equal(/[٠-٩]/.test(formatted), false);
});

test("formatPrice: uses currencyDisplay 'narrowSymbol' (USD renders as '$', not 'USD' or 'US$')", () => {
  assert.equal(formatPrice(990, "USD", "en"), "$990");
});

test("formatPrice: SAR has no narrow glyph in ICU, so it renders the ISO code as its symbol", () => {
  // ICU separates the code from the figure with U+00A0 (no-break space), not
  // a plain U+0020 — asserted literally rather than loosened with a regex,
  // since this exact character is real, deterministic ICU output worth
  // pinning, not an implementation detail to paper over.
  assert.equal(formatPrice(990, "SAR", "en"), "SAR 990");
});

test("formatPrice: drops decimal places (maximumFractionDigits: 0)", () => {
  const formatted = formatPrice(970, "SAR", "en");
  assert.equal(formatted.includes("."), false, `expected no decimal point in "${formatted}"`);
});

test("formatPrice: throws RangeError for a malformed (not-3-letter) currency code — the real crash this task hardened against", () => {
  assert.throws(() => formatPrice(990, "US-DOLLAR", "en"), RangeError);
});

test("safeFormatPrice: guards formatPrice's throw — returns null instead of letting a malformed code escape", () => {
  assert.doesNotThrow(() => safeFormatPrice(990, "US-DOLLAR", "en"));
  assert.equal(safeFormatPrice(990, "US-DOLLAR", "en"), null);
});

test("safeFormatPrice: also guards an empty-string currency code", () => {
  assert.equal(safeFormatPrice(990, "", "en"), null);
});

test("safeFormatPrice: returns formatPrice's exact output for a well-formed code (the guard is transparent on the happy path)", () => {
  assert.equal(safeFormatPrice(990, "USD", "en"), formatPrice(990, "USD", "en"));
});
