/**
 * Tests for `fetchPricingContext`'s validation, normalization, and the
 * after-review hardening fix (`fix: harden currency validation and
 * formatting fallback`):
 *
 * 1. A `supportedCurrencies` entry whose `code` isn't a well-formed 3-letter
 *    shape (e.g. `"US-DOLLAR"`) rejects the WHOLE payload (`null`) — this
 *    file's ingest design deliberately rejects rather than filters (see
 *    `pricing-context.ts`'s "Trust boundary" header section for why).
 * 2. Valid lower/mixed-case codes are uppercased on ingest.
 * 3. `fetchPricingContext` still resolves `null` — never a REJECTED promise
 *    — even when `AbortSignal.timeout` itself throws synchronously, the
 *    older-browser condition the contract-closure fix moved inside the
 *    function's `try` to guard against.
 *
 * `fetch` is monkey-patched per test (Node's global `fetch` is a writable
 * property, not a read-only binding) rather than adding a mocking
 * dependency — consistent with this project's "no new deps" constraint.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchPricingContext } from "./pricing-context";

/**
 * Runs `run` with `globalThis.fetch` replaced by a stub that resolves an
 * `ok` JSON response of `body`, restoring the original `fetch` afterward
 * (even if `run` throws/rejects).
 *
 * @param body - The value the stubbed response's `.json()` resolves to.
 * @param run - The test body to execute under the stub.
 */
async function withMockFetchJson<T>(body: unknown, run: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () =>
    ({
      ok: true,
      json: async () => body,
    }) as Response) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

test("fetchPricingContext: rejects the whole payload when one currency code isn't a well-formed 3-letter shape", async () => {
  const result = await withMockFetchJson(
    {
      detectedCountry: "US",
      recommendedCurrency: "USD",
      supportedCurrencies: [
        { code: "SAR", rateFromUsd: 3.75 },
        { code: "US-DOLLAR", rateFromUsd: 1 },
      ],
    },
    () => fetchPricingContext(),
  );
  assert.equal(result, null);
});

test("fetchPricingContext: rejects an empty-string currency code the same way", async () => {
  const result = await withMockFetchJson(
    {
      detectedCountry: "SA",
      recommendedCurrency: "SAR",
      supportedCurrencies: [{ code: "", rateFromUsd: 3.75 }],
    },
    () => fetchPricingContext(),
  );
  assert.equal(result, null);
});

test("fetchPricingContext: a shape-valid but unrecognized currency code is accepted (shape, not a real-currency lookup, is the crash boundary)", async () => {
  const result = await withMockFetchJson(
    {
      detectedCountry: "SA",
      recommendedCurrency: "SAR",
      supportedCurrencies: [
        { code: "SAR", rateFromUsd: 3.75 },
        { code: "ZZZ", rateFromUsd: 1 },
      ],
    },
    () => fetchPricingContext(),
  );
  assert.notEqual(result, null);
  assert.deepEqual(
    result?.supportedCurrencies.map((c) => c.code),
    ["SAR", "ZZZ"],
  );
});

test("fetchPricingContext: normalizes valid lower/mixed-case currency codes to uppercase on ingest", async () => {
  const result = await withMockFetchJson(
    {
      detectedCountry: "SA",
      recommendedCurrency: "sar",
      supportedCurrencies: [
        { code: "sar", rateFromUsd: 3.75 },
        { code: "Usd", rateFromUsd: 1 },
      ],
    },
    () => fetchPricingContext(),
  );
  assert.deepEqual(result, {
    detectedCountry: "SA",
    recommendedCurrency: "SAR",
    supportedCurrencies: [
      { code: "SAR", rateFromUsd: 3.75 },
      { code: "USD", rateFromUsd: 1 },
    ],
  });
});

test("fetchPricingContext: accepts a well-formed payload unchanged (beyond case normalization)", async () => {
  const payload = {
    detectedCountry: "SA",
    recommendedCurrency: "SAR",
    supportedCurrencies: [{ code: "SAR", rateFromUsd: 3.75 }],
  };
  const result = await withMockFetchJson(payload, () => fetchPricingContext());
  assert.deepEqual(result, payload);
});

test("fetchPricingContext: rejects a non-positive or non-finite rateFromUsd", async () => {
  const zero = await withMockFetchJson(
    {
      detectedCountry: "SA",
      recommendedCurrency: "SAR",
      supportedCurrencies: [{ code: "SAR", rateFromUsd: 0 }],
    },
    () => fetchPricingContext(),
  );
  assert.equal(zero, null);

  const nan = await withMockFetchJson(
    {
      detectedCountry: "SA",
      recommendedCurrency: "SAR",
      supportedCurrencies: [{ code: "SAR", rateFromUsd: Number.NaN }],
    },
    () => fetchPricingContext(),
  );
  assert.equal(nan, null);
});

test("fetchPricingContext: resolves null, never a rejected promise, when AbortSignal.timeout itself throws (older-browser simulation)", async () => {
  // Regression test for the contract-closure fix: AbortSignal.timeout/
  // AbortSignal.any previously sat OUTSIDE fetchPricingContext's try block,
  // so a synchronous throw from either (a real gap on older browsers)
  // produced a REJECTED promise instead of the documented "resolves null on
  // every failure" contract. Monkey-patching AbortSignal.timeout to throw
  // reproduces that exact condition.
  const originalTimeout = AbortSignal.timeout;
  AbortSignal.timeout = () => {
    throw new TypeError("AbortSignal.timeout is not a function");
  };
  try {
    await assert.doesNotReject(() => fetchPricingContext());
    const result = await fetchPricingContext();
    assert.equal(result, null);
  } finally {
    AbortSignal.timeout = originalTimeout;
  }
});

test("fetchPricingContext: resolves null when the response is not ok", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => ({ ok: false, json: async () => ({}) }) as Response) as typeof fetch;
  try {
    const result = await fetchPricingContext();
    assert.equal(result, null);
  } finally {
    globalThis.fetch = original;
  }
});
