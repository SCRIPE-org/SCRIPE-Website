/**
 * A single, deliberately narrow regression test for `submitLead`
 * (`submit-lead.ts`) — NOT a general test suite for this file. Per the
 * controller ruling that reviewed this task, `submit-lead.ts`'s
 * network/fetch path (timeout, non-2xx handling, delivery success) stays
 * untested for now (would need `fetch`/`AbortSignal.timeout` mocking
 * infrastructure this task doesn't introduce) — deferred deliberately, not
 * an oversight.
 *
 * This ONE test does not touch that network path at all, in either its
 * buggy or fixed form: it exercises `readStartedAt`'s whitespace-only
 * parsing bug (`Number("   ") === 0`, not `NaN` — see `readStartedAt`'s own
 * doc comment in `submit-lead.ts`) purely through `submitLead`'s public
 * `FormData` contract, with `LEADS_ENDPOINT` explicitly unset for the
 * duration of the test. That makes the two possible outcomes cleanly
 * distinguishable with NO mocking:
 * - Bug present (whitespace treated as "elapsed time since epoch 0" and the
 *   time-trap silently passes): the submission proceeds as a normal valid
 *   lead, reaches the `!leadsEndpoint` check, and resolves `"not-connected"`.
 * - Bug fixed (whitespace-only correctly treated as a missing timestamp,
 *   spam per the fail-safe): the submission never reaches the endpoint
 *   check at all — it resolves `"sent"` (silent discard; see `submit-lead.ts`'s
 *   header, "SPAM -> 'sent'").
 * Neither branch ever calls `fetch`, so this is a plain, deterministic unit
 * test despite exercising the real `submitLead` entry point.
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
