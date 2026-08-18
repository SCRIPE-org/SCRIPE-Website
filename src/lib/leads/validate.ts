/**
 * Pure contact-lead validation — no I/O, no `"use server"`, no network.
 *
 * ============================================================================
 * WHY SPAM DETECTION RUNS BEFORE FIELD VALIDATION (binding rule)
 * ============================================================================
 * {@link validateLead} checks the honeypot and time-trap FIRST and returns
 * immediately on a hit — it never falls through into field validation once a
 * submission is flagged as spam. If a spam submission also carried, say, an
 * empty `name`, a naive implementation might return BOTH `spam: true` and a
 * `fieldErrors.name`. That would leak information a bot (or a human spammer
 * scripting against this endpoint) could use to iteratively learn which
 * fields matter and what shape passes — exactly the signal `submit-lead.ts`'s
 * own header explains SCRIPE refuses to hand out. Checking spam first and
 * returning a single `{ ok: false; spam: true }` verdict with no field-level
 * detail closes that channel: every spam submission gets the exact same
 * response shape regardless of what garbage the rest of the payload
 * contained.
 *
 * ============================================================================
 * TRUST BOUNDARY FOR `startedAt` — missing/unparseable is spam, not "unknown"
 * ============================================================================
 * `ContactForm.tsx` fills the `startedAt` hidden field with `Date.now()` in a
 * `useEffect` that always runs for a real, JS-enabled visitor (see that
 * file's header — the mount effect is unconditional, not feature-gated). A
 * value that's missing, non-numeric, or non-finite by the time it reaches
 * `submit-lead.ts`'s `FormData` parse therefore isn't an honest "we can't
 * tell" case that deserves benefit of the doubt — it's exactly the shape a
 * request forged without ever loading the real page would have (a bot
 * POSTing straight to the server action with a hand-built body, or a no-JS
 * client that never ran the effect that stamps the field). This validator
 * treats that case as spam (fail-safe, not fail-open): the one cost is that a
 * true no-JS human visitor's submission is silently discarded rather than
 * delivered — but `ContactForm.tsx` shows the identical `"sent"` confirmation
 * either way (see `submit-lead.ts`'s header for why spam maps to `"sent"`,
 * never a distinct status), so that visitor sees the same "we got it" outcome
 * a delivered submission would show. Nothing about this failure mode is
 * user-visible; only actual backend delivery differs.
 *
 * ============================================================================
 * EMAIL PATTERN — chosen tradeoff
 * ============================================================================
 * `EMAIL_RE` (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) is the SAME "RFC-basic" shape
 * check `ContactForm.tsx`'s own client-side `EMAIL_RE` uses (see that file's
 * `validateField`) — deliberately kept identical so a client-caught
 * `emailInvalid` and a server-caught one for the exact same input never
 * disagree. It requires: at least one non-whitespace, non-`@` character
 * before an `@`; at least one non-whitespace, non-`@` character between the
 * `@` and a `.`; at least one character after that `.`. This is intentionally
 * FAR looser than the full RFC 5322 grammar:
 * - It accepts addresses a strict parser would reject as implausible (e.g.
 *   `a@b.c`, consecutive dots, a numeric-looking TLD) — false positives are
 *   cheap here because a wrong-but-shaped address only fails later at actual
 *   delivery/bounce time, which is the real authority on deliverability, not
 *   this form.
 * - It does NOT accept quoted local parts (`"john doe"@example.com`), IP
 *   literal domains (`user@[192.168.1.1]`), or internationalized (IDN/EAI)
 *   addresses in some raw forms — all technically valid RFC 5322/6531 shapes.
 * The tradeoff is deliberate: a false REJECT (a legitimate lead who can't
 * submit the form at all) is worse for a lead-capture form than a false
 * ACCEPT (a slightly-malformed address that simply won't receive the
 * follow-up email) — the failure mode of the latter is silent and
 * self-limiting, the failure mode of the former is a lost, frustrated
 * prospect who never tries again.
 */

/** One contact-lead submission's field values, plus the two bot-defense
 *  signals `ContactForm.tsx` renders alongside the visible fields (see that
 *  file's header, "Bot defenses"). All string fields are read RAW from
 *  `FormData` by `submit-lead.ts` before being handed here — this module is
 *  the only place trimming/limits/shape are enforced. */
export interface LeadInput {
  /** Full name. Required, 120 chars max. */
  name: string;
  /** Email address. Required, 254 chars max, RFC-basic shape (see this
   *  file's header for the exact tradeoff). */
  email: string;
  /** Organization name. Required, 160 chars max. */
  organization: string;
  /** Phone number. Optional, 40 chars max. */
  phone?: string;
  /** Organization type. Optional. Only `"club"` / `"academy"` / `"venue"` /
   *  `"multi-sport"` / `"other"` / `""` (empty = not selected) are ever
   *  returned in a validated lead — any other value is silently normalized
   *  to `""` rather than rejected (see {@link normalizeType}). */
  type?: string;
  /** Free-text message. Optional, 4000 chars max. */
  message?: string;
  /** Honeypot field (`company_website` in the DOM). A real visitor never
   *  sees or fills this — any non-empty value (after trimming) is spam. */
  companyWebsite?: string;
  /** Epoch-ms timestamp `ContactForm.tsx` stamped on mount. A submission
   *  where `now - startedAt` is under {@link SPAM_TIME_TRAP_MS} is spam. */
  startedAt?: number;
}

/** The result of validating one {@link LeadInput}. Exactly one of three
 *  shapes:
 *  - `ok: true` — passed every check; `lead` is the trimmed/normalized
 *    version of the input, safe to forward to the backend.
 *  - `ok: false, fieldErrors` — failed one or more field checks. Every value
 *    in `fieldErrors` is a `forms.*` message KEY (`"required"` /
 *    `"emailInvalid"` / `"tooLong"`) — never a translated string, never
 *    user-submitted text. The caller (`submit-lead.ts` / `ContactForm.tsx`)
 *    is responsible for translating the key.
 *  - `ok: false, spam: true` — the honeypot or time-trap fired. Carries no
 *    field-level detail at all — see this file's header for why. */
export type LeadValidation =
  | { ok: true; lead: LeadInput }
  | { ok: false; fieldErrors: Record<string, string> }
  | { ok: false; spam: true };

/** Field length limits, matching the task brief and `ContactForm.tsx`'s own
 *  `FIELD_LIMITS` (Task 19) exactly. Duplicated rather than imported from
 *  that client component on purpose: this module must stay import-free of
 *  anything `"use client"` so it can be safely required from the
 *  `"use server"` action, and the two layers (client pre-validation, server
 *  authoritative validation) are independent defenses that happen to agree
 *  on the same numbers, not one delegating to the other. */
const FIELD_LIMITS = {
  name: 120,
  email: 254,
  organization: 160,
  phone: 40,
  message: 4000,
} as const;

/** Fields that must be non-empty (after trimming) to pass. `phone`/`message`
 *  are intentionally absent — both are optional, length-limited only. */
const REQUIRED_FIELDS = ["name", "email", "organization"] as const;

/** See this file's header, "Email pattern — chosen tradeoff". */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A submission is spam when the elapsed time between `startedAt` and `now`
 *  is strictly less than this — a human filling out a multi-field form
 *  cannot plausibly do it in under 3 seconds; a bot that fills-and-submits
 *  synchronously can. */
const SPAM_TIME_TRAP_MS = 3000;

/** The organization-type values `ContactForm.tsx`'s `<select>` actually
 *  offers (`ORG_TYPE_OPTIONS` in that file) — the closed set `type` is
 *  validated against. */
const KNOWN_ORG_TYPES: ReadonlySet<string> = new Set(["club", "academy", "venue", "multi-sport", "other"]);

/**
 * Normalizes a submitted `type` value against the closed organization-type
 * enum. Unlike every other field, an out-of-set `type` is NOT surfaced as a
 * `fieldErrors` entry — `ContactForm.tsx`'s `type` `<select>` has no `error`
 * prop wired at all (it's a fixed dropdown a legitimate client can never
 * produce an invalid value from), so a `fieldErrors.type` would be invisible
 * to a real visitor while silently blocking their otherwise-fully-valid
 * submission. The only realistic source of an out-of-set value is a request
 * built by hand (bypassing the `<select>` entirely) — for that case, quietly
 * dropping the bogus string to `""` before it ever reaches the backend
 * payload is both simpler and safer than rejecting the whole submission over
 * a field the UI doesn't even let a human get wrong.
 *
 * @param value - The raw submitted `type` value, or `undefined`.
 * @returns `value` unchanged if it's one of the five known types or empty;
 *   `""` otherwise.
 */
function normalizeType(value: string | undefined): string {
  if (!value) return "";
  return KNOWN_ORG_TYPES.has(value) ? value : "";
}

/**
 * Validates one required/length/email-shape field.
 *
 * @param field - Which field is being checked.
 * @param rawValue - The field's raw (untrimmed) value, or `undefined`.
 * @returns A `forms.*` message KEY if `rawValue` fails, `undefined` if it
 *   passes.
 */
function validateTextField(field: keyof typeof FIELD_LIMITS, rawValue: string | undefined): string | undefined {
  const raw = rawValue ?? "";
  const trimmed = raw.trim();
  const isRequired = (REQUIRED_FIELDS as readonly string[]).includes(field);

  if (isRequired && !trimmed) return "required";
  // Length is checked against the RAW (untrimmed) value, mirroring
  // ContactForm.tsx's own client-side `validateField` — a value that's only
  // over-limit because of padding whitespace still reports `tooLong`, not a
  // silently-truncated pass.
  if (raw.length > FIELD_LIMITS[field]) return "tooLong";
  if (field === "email" && trimmed && !EMAIL_RE.test(trimmed)) return "emailInvalid";
  return undefined;
}

/**
 * Validates a contact-lead submission: spam detection first (see this file's
 * header for why), then required/length/email-shape checks on every
 * user-facing field, then closed-enum normalization of `type`. Pure and
 * synchronous — no I/O, no timers, no randomness — so it's exercised directly
 * by `validate.test.ts` with no mocking.
 *
 * @param input - The raw submitted values (already read out of `FormData` by
 *   `submit-lead.ts` — string fields are NOT yet trimmed).
 * @param now - The current time in epoch ms, for the time-trap comparison.
 *   Defaults to `Date.now()`; a test passes an explicit value for
 *   deterministic boundary assertions.
 * @returns See {@link LeadValidation}.
 */
export function validateLead(input: LeadInput, now: number = Date.now()): LeadValidation {
  const honeypotFilled = Boolean(input.companyWebsite && input.companyWebsite.trim() !== "");
  const startedAt = input.startedAt;
  const timeTrapTripped = startedAt === undefined || !Number.isFinite(startedAt) || now - startedAt < SPAM_TIME_TRAP_MS;

  if (honeypotFilled || timeTrapTripped) {
    return { ok: false, spam: true };
  }

  const fieldErrors: Record<string, string> = {};

  const nameError = validateTextField("name", input.name);
  if (nameError) fieldErrors.name = nameError;

  const emailError = validateTextField("email", input.email);
  if (emailError) fieldErrors.email = emailError;

  const organizationError = validateTextField("organization", input.organization);
  if (organizationError) fieldErrors.organization = organizationError;

  const phoneError = validateTextField("phone", input.phone);
  if (phoneError) fieldErrors.phone = phoneError;

  const messageError = validateTextField("message", input.message);
  if (messageError) fieldErrors.message = messageError;

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    lead: {
      name: input.name.trim(),
      email: input.email.trim(),
      organization: input.organization.trim(),
      phone: input.phone?.trim() ?? "",
      type: normalizeType(input.type),
      message: input.message?.trim() ?? "",
      companyWebsite: input.companyWebsite ?? "",
      startedAt: input.startedAt,
    },
  };
}
