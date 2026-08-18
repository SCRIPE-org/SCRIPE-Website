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
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { convertFromSar, formatPrice } from "./convert";

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
