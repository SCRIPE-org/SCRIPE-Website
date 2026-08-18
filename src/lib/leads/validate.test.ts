/**
 * Tests for `validateLead` — the pure, side-effect-free contact-lead
 * validator (`validate.ts`).
 *
 * Written before `validate.ts` exists (TDD red phase — the first run of this
 * file fails on a missing module, then `validate.ts` lands to turn it green;
 * see Task 22's report for the transcript of that run). Covers the task
 * brief's exact contract: honeypot + time-trap spam detection short-circuits
 * BEFORE any field validation runs (so a bot never learns which fields it
 * got wrong), required/length/email-shape field errors keyed by `forms.*`
 * message KEYS (never raw translated text — `submit-lead.ts` and
 * `ContactForm.tsx` are the only places a key becomes visible copy), exact
 * boundary-length behavior (limit passes, limit+1 fails), and the closed
 * `type` enum being sanitized rather than rejected.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLead, type LeadInput } from "./validate";

/** A fully valid submission, aged well past the 3000ms time-trap floor.
 *  Individual tests spread over this base and override only what they're
 *  exercising, so a field unrelated to the assertion never accidentally
 *  causes a spurious failure. */
function baseInput(overrides: Partial<LeadInput> = {}): LeadInput {
  return {
    name: "Amina Al-Sayed",
    email: "amina@example.com",
    organization: "Riyadh Falcons Academy",
    phone: "+966501234567",
    type: "academy",
    message: "We run a 200-athlete multi-sport academy and want a demo.",
    companyWebsite: "",
    startedAt: Date.now() - 5000,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Valid submissions
// ---------------------------------------------------------------------------

test("validateLead: a fully valid lead passes with ok: true", () => {
  const result = validateLead(baseInput());
  assert.equal(result.ok, true);
});

test("validateLead: a valid lead with only the required fields passes (phone/type/message are optional)", () => {
  const result = validateLead(
    baseInput({ phone: "", type: "", message: "" }),
  );
  assert.equal(result.ok, true);
});

test("validateLead: trims leading/trailing whitespace from the returned lead's fields", () => {
  const result = validateLead(baseInput({ name: "  Amina Al-Sayed  ", organization: "  Riyadh Falcons  " }));
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.lead.name, "Amina Al-Sayed");
    assert.equal(result.lead.organization, "Riyadh Falcons");
  }
});

// ---------------------------------------------------------------------------
// Spam detection — checked BEFORE field validation, per the "never teach the
// bot" rule: a spam submission must never also carry fieldErrors.
// ---------------------------------------------------------------------------

test("validateLead: a filled honeypot (company_website) is spam, regardless of otherwise-valid fields", () => {
  const result = validateLead(baseInput({ companyWebsite: "http://spam-bot.example" }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal("spam" in result && result.spam, true);
});

test("validateLead: a submission faster than the 3000ms time-trap floor is spam", () => {
  const result = validateLead(baseInput({ startedAt: Date.now() - 500 }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal("spam" in result && result.spam, true);
});

test("validateLead: exactly at the 3000ms floor is NOT spam (only strictly less than 3000ms trips it)", () => {
  const now = 1_000_000_000;
  const result = validateLead(baseInput({ startedAt: now - 3000 }), now);
  assert.equal(result.ok, true);
});

test("validateLead: 2999ms elapsed is spam (one ms under the floor)", () => {
  const now = 1_000_000_000;
  const result = validateLead(baseInput({ startedAt: now - 2999 }), now);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal("spam" in result && result.spam, true);
});

test("validateLead: a missing startedAt is treated as spam (fail-safe — see file header)", () => {
  const result = validateLead(baseInput({ startedAt: undefined }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal("spam" in result && result.spam, true);
});

test("validateLead: an otherwise-invalid submission that's ALSO spam reports spam, not fieldErrors (never teach the bot which field it got wrong)", () => {
  const result = validateLead(
    baseInput({ companyWebsite: "http://spam-bot.example", name: "", email: "not-an-email" }),
  );
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal("spam" in result && result.spam, true);
    assert.equal("fieldErrors" in result, false);
  }
});

// ---------------------------------------------------------------------------
// Required-field errors
// ---------------------------------------------------------------------------

test("validateLead: empty name -> fieldErrors.name === 'required'", () => {
  const result = validateLead(baseInput({ name: "" }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.name, "required");
});

test("validateLead: whitespace-only email -> fieldErrors.email === 'required' (trimmed before the required check)", () => {
  const result = validateLead(baseInput({ email: "   " }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.email, "required");
});

test("validateLead: empty organization -> fieldErrors.organization === 'required'", () => {
  const result = validateLead(baseInput({ organization: "" }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.organization, "required");
});

// ---------------------------------------------------------------------------
// Bad email shape
// ---------------------------------------------------------------------------

test("validateLead: an email with no '@' -> fieldErrors.email === 'emailInvalid'", () => {
  const result = validateLead(baseInput({ email: "not-an-email" }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.email, "emailInvalid");
});

test("validateLead: an email with no domain dot -> fieldErrors.email === 'emailInvalid'", () => {
  const result = validateLead(baseInput({ email: "amina@example" }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.email, "emailInvalid");
});

// ---------------------------------------------------------------------------
// Over-limit fields (each field gets its own 'tooLong' fieldError)
// ---------------------------------------------------------------------------

test("validateLead: name over 120 chars -> fieldErrors.name === 'tooLong'", () => {
  const result = validateLead(baseInput({ name: "a".repeat(121) }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.name, "tooLong");
});

test("validateLead: email over 254 chars -> fieldErrors.email === 'tooLong'", () => {
  const email = `${"a".repeat(243)}@example.com`; // 243 + 12 = 255 chars, valid shape
  assert.equal(email.length, 255);
  const result = validateLead(baseInput({ email }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.email, "tooLong");
});

test("validateLead: organization over 160 chars -> fieldErrors.organization === 'tooLong'", () => {
  const result = validateLead(baseInput({ organization: "a".repeat(161) }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.organization, "tooLong");
});

test("validateLead: phone over 40 chars -> fieldErrors.phone === 'tooLong'", () => {
  const result = validateLead(baseInput({ phone: "1".repeat(41) }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.phone, "tooLong");
});

test("validateLead: message over 4000 chars -> fieldErrors.message === 'tooLong'", () => {
  const result = validateLead(baseInput({ message: "a".repeat(4001) }));
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.message, "tooLong");
});

test("validateLead: a name over its limit ONLY BECAUSE of untrimmed whitespace still fails (raw length, not trimmed, decides tooLong)", () => {
  const result = validateLead(baseInput({ name: `  ${"a".repeat(119)}  ` })); // 119 + 4 spaces = 123 raw
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) assert.equal(result.fieldErrors.name, "tooLong");
});

test("validateLead: multiple over-limit fields each get their own fieldErrors entry", () => {
  const result = validateLead(
    baseInput({ name: "a".repeat(121), organization: "a".repeat(161), phone: "1".repeat(41) }),
  );
  assert.equal(result.ok, false);
  if (!result.ok && "fieldErrors" in result) {
    assert.equal(result.fieldErrors.name, "tooLong");
    assert.equal(result.fieldErrors.organization, "tooLong");
    assert.equal(result.fieldErrors.phone, "tooLong");
  }
});

// ---------------------------------------------------------------------------
// Boundary lengths — exactly at the limit passes, limit+1 fails
// ---------------------------------------------------------------------------

test("validateLead: name at exactly 120 chars passes", () => {
  const result = validateLead(baseInput({ name: "a".repeat(120) }));
  assert.equal(result.ok, true);
});

test("validateLead: email at exactly 254 chars (valid shape) passes", () => {
  const email = `${"a".repeat(242)}@example.com`; // 242 + 12 = 254 chars
  assert.equal(email.length, 254);
  const result = validateLead(baseInput({ email }));
  assert.equal(result.ok, true);
});

test("validateLead: organization at exactly 160 chars passes", () => {
  const result = validateLead(baseInput({ organization: "a".repeat(160) }));
  assert.equal(result.ok, true);
});

test("validateLead: phone at exactly 40 chars passes", () => {
  const result = validateLead(baseInput({ phone: "1".repeat(40) }));
  assert.equal(result.ok, true);
});

test("validateLead: message at exactly 4000 chars passes", () => {
  const result = validateLead(baseInput({ message: "a".repeat(4000) }));
  assert.equal(result.ok, true);
});

// ---------------------------------------------------------------------------
// `type` — closed 5-value enum (or empty), sanitized rather than rejected
// ---------------------------------------------------------------------------

for (const validType of ["club", "academy", "venue", "multi-sport", "other", ""]) {
  test(`validateLead: type '${validType || "(empty)"}' is accepted as-is`, () => {
    const result = validateLead(baseInput({ type: validType }));
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.lead.type, validType);
  });
}

test("validateLead: an unknown type value is silently normalized to empty, not rejected (no fieldErrors UI slot exists for it)", () => {
  const result = validateLead(baseInput({ type: "<script>alert(1)</script>" }));
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.lead.type, "");
});
