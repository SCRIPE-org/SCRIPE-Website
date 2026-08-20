/**
 * A deliberately narrow set of regression tests for `submitLead`
 * (`submit-lead.ts`) — NOT a general test suite for this file. Per the
 * controller ruling that reviewed the original task, this file's
 * network/fetch path (timeout, non-2xx handling, delivery success) stayed
 * untested at the time — real `fetch`/`AbortSignal.timeout` mocking
 * infrastructure felt like more than that task needed.
 *
 * Wave N adds exactly one more test to that narrow set, because it changed
 * the single highest-risk correctness surface in this file: `toLeadPayload`'s
 * field mapping now has to match a REAL backend DTO
 * (`ContactSalesRequest` — see `toLeadPayload`'s own doc comment for the
 * full citation) rather than an internal shape only this codebase ever
 * read. A silent regression here — a renamed field, a dropped mapping —
 * would not throw, would not fail typecheck, and would not show up as
 * anything other than every future submission quietly 400ing at the
 * backend forever. That risk is exactly what the ORIGINAL test already
 * avoided by never calling `fetch` at all; this one exists specifically
 * because avoiding it here would leave the actual field-mapping code
 * unverified by anything. The mock below is the minimum needed for that
 * one assertion — a single `globalThis.fetch` stub that captures the
 * request it was given and returns a canned 200, save/restored the same
 * way the original test save/restores `LEADS_ENDPOINT` — not a general
 * fetch-mocking framework.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { submitLead } from "./submit-lead";

test("submitLead: a whitespace-only startedAt is treated as spam ('sent'), not a bypassed time-trap ('not-connected')", async () => {
  const previousEndpoint = process.env.LEADS_ENDPOINT;
  delete process.env.LEADS_ENDPOINT;

  try {
    const formData = new FormData();
    formData.set("name", "Amina Al-Sayed");
    formData.set("email", "amina@example.com");
    formData.set("organization", "Riyadh Falcons Academy");
    formData.set("phone", "");
    formData.set("type", "");
    formData.set("message", "");
    formData.set("company_website", ""); // honeypot: empty, a real visitor's value
    formData.set("startedAt", "   "); // whitespace-only — the exact bypass shape

    const result = await submitLead(null, formData);

    assert.equal(result.status, "sent");
  } finally {
    if (previousEndpoint === undefined) delete process.env.LEADS_ENDPOINT;
    else process.env.LEADS_ENDPOINT = previousEndpoint;
  }
});

/** A `startedAt` comfortably past `SPAM_TIME_TRAP_MS` (3000ms), so every test
 *  below reaches the actual `fetch` call instead of the spam short-circuit. */
function validFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.set("name", "Amina Al-Sayed");
  formData.set("email", "amina@example.com");
  formData.set("organization", "Riyadh Falcons Academy");
  formData.set("phone", "");
  formData.set("type", "");
  formData.set("message", "");
  formData.set("company_website", "");
  formData.set("startedAt", String(Date.now() - 5000));
  for (const [key, value] of Object.entries(overrides)) formData.set(key, value);
  return formData;
}

/** Swaps in a stub `fetch` that records the single call made to it and
 *  resolves with `status`, running `run()` with the real `LEADS_ENDPOINT`
 *  and `fetch` restored afterward no matter how `run()` exits. */
async function withStubbedFetch<T>(status: number, run: () => Promise<T>): Promise<{ result: T; call: { url: string; body: unknown } | null }> {
  const previousEndpoint = process.env.LEADS_ENDPOINT;
  const previousFetch = globalThis.fetch;
  process.env.LEADS_ENDPOINT = "https://api.scripe.org/api/v1/auth/signup/contact-sales";
  let call: { url: string; body: unknown } | null = null;

  // @ts-expect-error -- deliberately narrow stub; not a general fetch mock.
  globalThis.fetch = async (url: string, init?: RequestInit) => {
    call = { url, body: init?.body ? JSON.parse(init.body as string) : null };
    return new Response(null, { status });
  };

  try {
    const result = await run();
    return { result, call };
  } finally {
    globalThis.fetch = previousFetch;
    if (previousEndpoint === undefined) delete process.env.LEADS_ENDPOINT;
    else process.env.LEADS_ENDPOINT = previousEndpoint;
  }
}

test("toLeadPayload (via submitLead's actual request body): maps every field to the real ContactSalesRequest shape", async () => {
  const { result, call } = await withStubbedFetch(200, () =>
    submitLead(
      null,
      validFormData({ phone: "+966500000000", type: "academy", message: "Interested in the academy tier." }),
    ),
  );

  assert.equal(result.status, "sent");
  assert.deepEqual(call?.body, {
    contactName: "Amina Al-Sayed",
    email: "amina@example.com",
    companyName: "Riyadh Falcons Academy",
    phone: "+966500000000",
    businessType: "academy",
    message: "Interested in the academy tier.",
  });
});

test("toLeadPayload omits phone/businessType/message entirely when the visitor left them blank, rather than sending empty strings", async () => {
  const { call } = await withStubbedFetch(200, () => submitLead(null, validFormData()));

  assert.deepEqual(call?.body, {
    contactName: "Amina Al-Sayed",
    email: "amina@example.com",
    companyName: "Riyadh Falcons Academy",
  });
});

test("a 409 (duplicate lead / workspace exists) resolves 'sent', not 'not-connected' -- the submission DID reach the backend", async () => {
  const { result } = await withStubbedFetch(409, () => submitLead(null, validFormData()));
  assert.equal(result.status, "sent");
});

test("a genuine failure status (500) still resolves 'not-connected'", async () => {
  const { result } = await withStubbedFetch(500, () => submitLead(null, validFormData()));
  assert.equal(result.status, "not-connected");
});
