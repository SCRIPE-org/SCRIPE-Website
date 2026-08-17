/**
 * Content parity harness.
 *
 * Walks CONTENT_REGISTRY and asserts, for every registered page, that both
 * locales are present and structurally identical: the same key paths at
 * every depth, with arrays compared by length and by each element's own key
 * shape. This is the safety net later page tasks rely on — dropping a key
 * from one locale's content file (or leaving a page's translation half
 * finished) fails this test instead of shipping a silently mismatched page.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT_REGISTRY } from "./index";

/**
 * Collects a sorted list of key paths reachable from `value`.
 *
 * Plain objects contribute a `parent.child` path per key (recursing into
 * nested values); arrays contribute one `parent[index]` path per element
 * (recursing into each element so its own key shape is captured too, which
 * is what makes an array comparison length- and shape-sensitive); anything
 * else (string, number, boolean, null) contributes its own path as a leaf.
 */
function deepKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => deepKeys(item, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .flatMap((key) =>
        deepKeys((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key),
      );
  }
  return [prefix];
}

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
