/**
 * Content parity harness.
 *
 * Walks CONTENT_REGISTRY and asserts, for every registered page, that both
 * locales are present and structurally identical: the same key paths at
 * every depth, with arrays compared by length and by each element's own key
 * shape. This is the safety net later page tasks rely on — dropping a key
 * from one locale's content file (or leaving a page's translation half
 * finished) fails this test instead of shipping a silently mismatched page.
 *
 * The generic `deepKeys` walk above catches shape drift within one content
 * tree, but it can't catch a *cross-field* structural invariant: the pricing
 * page's `PricingComparisonRow["values"]` array is positionally zipped to
 * `PricingContent["plans"]` (`values[i]` is plan `plans[i]`'s verdict) with
 * nothing in the type system enforcing that the two arrays stay the same
 * length — `deepKeys` would happily consider two rows with 2 and 3 values
 * "the same shape" as long as both locales agreed on that (wrong) count. The
 * dedicated pricing guard below closes that gap.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT_REGISTRY } from "./index";
import type { PricingContent } from "./types";

/**
 * Collects a sorted list of key paths reachable from `value`.
 *
 * Encoding: every *container* (object or array) emits a path for itself —
 * its own `prefix` for an object, `prefix[]` for an array — in addition to
 * recursing into its contents. A plain object additionally contributes a
 * `parent.child` path per key it holds; an array additionally contributes a
 * `parent[index]` path per element, recursing into each element so its own
 * key shape is captured too (which is what makes an array comparison both
 * length- and shape-sensitive). Anything else (string, number, boolean,
 * null) contributes its own path as a leaf.
 *
 * Emitting a path for the container itself — not just its leaves — is
 * deliberate: without it, an empty object (`{}`) or empty array (`[]`)
 * contributes zero paths, making a key holding one indistinguishable from
 * the key being absent entirely. With it, `{foo: {}}` and `{}` produce
 * different key lists (`["foo"]` vs `[]`) and the mismatch is caught.
 */
function deepKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    const self = [`${prefix}[]`];
    return self.concat(value.flatMap((item, i) => deepKeys(item, `${prefix}[${i}]`)));
  }
  if (value !== null && typeof value === "object") {
    const self = prefix ? [prefix] : [];
    const children = Object.keys(value as Record<string, unknown>)
      .sort()
      .flatMap((key) =>
        deepKeys((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key),
      );
    return self.concat(children);
  }
  return [prefix];
}

test("deepKeys: a key holding an empty object vanishing between locales is detected", () => {
  const withEmptyObject = deepKeys({ foo: {}, bar: "y" });
  const withoutTheKey = deepKeys({ bar: "y" });
  assert.notDeepEqual(withEmptyObject, withoutTheKey, "an empty-object key must still register a path");
});

test("deepKeys: a key holding an empty array vanishing between locales is detected", () => {
  const withEmptyArray = deepKeys({ foo: [], bar: "y" });
  const withoutTheKey = deepKeys({ bar: "y" });
  assert.notDeepEqual(withEmptyArray, withoutTheKey, "an empty-array key must still register a path");
});

test("deepKeys: equal-length arrays with different element key shape are detected", () => {
  const richer = deepKeys({ list: [{ a: 1, b: 2 }, { a: 1, b: 2 }] });
  const thinner = deepKeys({ list: [{ a: 1 }, { a: 1, b: 2 }] });
  assert.notDeepEqual(richer, thinner, "an element missing a key must change the array's key shape");
});

test("content parity: every registered page has matching en/ar key shape", () => {
  const pages = Object.keys(CONTENT_REGISTRY) as (keyof typeof CONTENT_REGISTRY)[];
  assert.ok(pages.length > 0, "expected at least one registered page in CONTENT_REGISTRY");

  for (const page of pages) {
    const entry = CONTENT_REGISTRY[page];
    assert.ok(entry, `page "${String(page)}" is registered but has no locale entry`);
    assert.ok(entry?.en, `page "${String(page)}" is missing "en" content`);
    assert.ok(entry?.ar, `page "${String(page)}" is missing "ar" content`);

    const enKeys = deepKeys(entry?.en);
    const arKeys = deepKeys(entry?.ar);
    assert.deepEqual(arKeys, enKeys, `page "${String(page)}" key shape mismatch between en and ar`);
  }
});

test("pricing content: every comparison row has exactly one value per plan, in both locales", () => {
  const entry = CONTENT_REGISTRY.pricing;
  assert.ok(entry, 'expected "pricing" to be registered in CONTENT_REGISTRY for this guard to run');

  for (const locale of ["en", "ar"] as const) {
    const content = entry?.[locale] as PricingContent;
    const planCount = content.plans.length;
    assert.ok(planCount > 0, `pricing (${locale}): expected at least one plan`);

    for (const group of content.comparison.groups) {
      for (const row of group.rows) {
        assert.equal(
          row.values.length,
          planCount,
          `pricing (${locale}): comparison row "${row.label}" in group "${group.title}" has ` +
            `${row.values.length} value(s) but there are ${planCount} plans — ` +
            `ComparisonTable.tsx zips row.values[i] to plans[i] positionally with no structural ` +
            `enforcement, so a length mismatch here means a verdict silently lands on the wrong plan`,
        );
      }
    }
  }
});
