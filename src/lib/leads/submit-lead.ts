"use server";

/**
 * The contact form's real Server Action, called by `ContactForm.tsx` via
 * `useActionState(submitLead, null)`. Replaces the local `submit-lead-stub.ts`
 * Task 19 shipped (deleted by this task) — the exact same function signature
 * and `LeadActionResult` shape, so `ContactForm.tsx` needed no change beyond
 * its import line.
 *
 * ============================================================================
 * SPAM -> `"sent"`, NEVER a distinct `"spam"` status (binding, do not change)
 * ============================================================================
 * The return type below still carries `"spam"` as an allowed `status`
 * literal — kept for parity with `LeadActionResult`'s original shape
 * (`submit-lead-stub.ts`) and so `validateLead`'s own `{ spam: true }`
 * verdict has an obvious status to map to in code review — but this function
 * NEVER actually returns it. A honeypot hit or a time-trap failure resolves
 * to `{ status: "sent" }`, the EXACT SAME shape a genuinely delivered
 * submission returns. This is deliberate, not an oversight: if the response
 * a bot receives were distinguishable from a real success (even a differently
 * *named* status with identical UI treatment), an attacker probing this
 * endpoint programmatically could use that response to learn its honeypot/
 * time-trap logic was tripped and iterate against it. Returning byte-for-byte
 * the same success response for spam as for a real send closes that channel
 * completely — there is no observable difference, from the network response
 * alone, between "delivered" and "silently discarded as spam." See
 * `validate.ts`'s header for why the spam check itself also never leaks
 * field-level detail.
 *
 * ============================================================================
 * PII-FREE LOGGING (binding — every log call in this file is audited against
 * this rule)
 * ============================================================================
 * This file's only two `console.error` call sites log a fixed, static
 * message string plus a non-PII code (an HTTP status number, or a caught
 * error's `.name`, e.g. `"AbortError"`/`"TypeError"` — never `.message`,
 * which can echo request/response details, and never the error object
 * itself). Neither call site EVER logs: the lead's `name`/`email`/
 * `organization`/`phone`/`message`, the raw `FormData`, the constructed
 * request body, or the response body. A visitor's contact details must never
 * land in server logs, a log aggregator, or an error-tracking dashboard just
 * because their submission failed to deliver — that would turn a delivery
 * failure into a data-handling incident. If you add a new log call to this
 * file, it must pass the same test: could a human read this line without
 * learning anything about who submitted the form?
 *
 * ============================================================================
 * WHY THIS FUNCTION NEVER THROWS
 * ============================================================================
 * `useActionState` (React 19 / Next.js Server Actions) surfaces a thrown
 * server action as an unhandled error on the client — there is no
 * `try/catch` at the call site in `ContactForm.tsx`, by design (the whole
 * point of the `status` union is that every outcome, including failure, is
 * an ordinary return value the UI branches on, never an exception it has to
 * catch). Every code path in this file — FormData parsing, validation, the
 * network call, and their surrounding control flow — therefore lives inside
 * one outer `try/catch` (mirroring `pricing-context.ts`'s
 * `fetchPricingContext`, this codebase's other network-calling module) so
 * that ANY unexpected failure (a future parsing bug, an environment where
 * `AbortSignal.timeout` itself throws synchronously, anything) degrades to
 * the same honest `{ status: "not-connected" }` a dead backend already
 * produces, rather than crashing the page.
 *
 * ============================================================================
 * WHY THE ENV VAR IS READ INSIDE `submitLead`, NOT AT MODULE LOAD
 * ============================================================================
 * `process.env.LEADS_ENDPOINT` is read at the top of `submitLead`'s own
 * `try` block — CALL time — rather than once into a module-level `const`
 * when this file first loads. Two independent reasons, matching
 * `pricing-context.ts`'s own documented pattern for its base-URL env var:
 * 1. **Deployment timing.** On Vercel (and similar platforms), a server
 *    module can be evaluated once and reused across many invocations/regions
 *    within a deployment's lifetime; reading `process.env` at module-eval
 *    time risks capturing a value from before an env var change has
 *    propagated everywhere, or before it's set at all during cold start
 *    ordering. Reading it fresh on every call sidesteps that class of bug
 *    entirely — there is no cached value that can go stale.
 * 2. **Testability.** A module-level `const` is fixed the instant this file
 *    is first imported, before any test gets a chance to set
 *    `process.env.LEADS_ENDPOINT` for that specific test run — making the
 *    unset/set behavior effectively untestable without reaching for
 *    module-reset tricks. Reading it inside the function means a future test
 *    can set `process.env.LEADS_ENDPOINT` immediately before calling
 *    `submitLead` and see that exact value honored.
 */
import { validateLead, type LeadInput } from "./validate";

/** The shape every `submitLead`-compatible action resolves to — identical to
 *  `submit-lead-stub.ts`'s original `LeadActionResult`, preserved verbatim
 *  so `ContactForm.tsx` needed no change beyond its import line. See this
 *  file's header for what each `status` means; see the header's first
 *  section specifically for why `"spam"` is a valid literal here that this
 *  function never actually returns. */
export interface LeadActionResult {
  /** Outcome of the submission attempt. */
  status: "sent" | "not-connected" | "invalid" | "spam";
  /** Present only for `status: "invalid"` — one `forms.*` message KEY per
   *  rejected field (never raw text, never user input), keyed by that
   *  field's `name` attribute (`name`, `email`, `organization`, `phone`,
   *  `message`). See `validate.ts`'s `LeadValidation` doc comment. */
  fieldErrors?: Record<string, string>;
}

/** Request timeout for the backend POST. The visitor is already staring at
 *  a "Sending…" button (`ContactForm.tsx`'s `isPending`) — 8s bounds how
 *  long a slow/hanging backend can leave them waiting before this action
 *  gives up and reports the honest degraded state instead. */
const TIMEOUT_MS = 8000;

/**
 * Reads one `FormData` entry as a trimmed-of-nothing raw string, treating a
 * missing entry OR a `File`-typed entry (a `<input type="file">` this form
 * doesn't have, but `FormData.get` is typed to allow one for any key) as an
 * empty string rather than letting either reach `validateLead` as something
 * other than a `string`.
 *
 * @param formData - The submitted form's data.
 * @param key - The field's `name` attribute.
 * @returns The entry's string value, or `""` if absent or a `File`.
 */
function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Reads and parses the `startedAt` time-trap field. A missing entry, a
 * `File`-typed entry, an empty OR WHITESPACE-ONLY string, or a
 * non-numeric/non-finite value all resolve to `undefined` — `validateLead`
 * treats an `undefined` `startedAt` as spam (fail-safe; see `validate.ts`'s
 * header), so any of those cases end up with the exact same conservative
 * outcome without this function having to duplicate that decision.
 *
 * The whitespace-only case is checked explicitly (`raw.trim() === ""`, not
 * `raw === ""`) rather than left to `Number()` to reject: `Number("   ")` is
 * `0`, NOT `NaN` — a bare `raw === ""` check would let a `"   "` payload
 * fall through to `Number(raw)`, resolve to epoch 0 (Jan 1 1970), and then
 * pass the time-trap comparison outright (`now - 0` is always far larger
 * than the 3000ms floor). That would hand a trivial bypass to anything
 * submitting a blank/whitespace `startedAt` instead of omitting it. Trimming
 * first closes that gap the same way `validateLead`'s own field checks do.
 *
 * @param formData - The submitted form's data.
 * @returns The parsed epoch-ms timestamp, or `undefined`.
 */
function readStartedAt(formData: FormData): number | undefined {
  const raw = readFormString(formData, "startedAt");
  if (raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Parses a submitted `FormData` into a {@link LeadInput}. Every field is
 * read defensively (see {@link readFormString}/{@link readStartedAt}) — this
 * function cannot throw on missing or wrong-typed entries.
 *
 * @param formData - The submitted form's data.
 * @returns A {@link LeadInput}, unvalidated (validation is `validateLead`'s
 *   job, called separately so it stays unit-testable without a `FormData`).
 */
function parseLeadInput(formData: FormData): LeadInput {
  return {
    name: readFormString(formData, "name"),
    email: readFormString(formData, "email"),
    organization: readFormString(formData, "organization"),
    phone: readFormString(formData, "phone"),
    type: readFormString(formData, "type"),
    message: readFormString(formData, "message"),
    companyWebsite: readFormString(formData, "company_website"),
    startedAt: readStartedAt(formData),
  };
}

/**
 * Builds the JSON payload POSTed to the lead-intake endpoint from a
 * validated lead.
 *
 * WAVE N — matched to the REAL backend contract, not a generic guess.
 * ---------------------------------------------------------------------
 * `LEADS_ENDPOINT` is meant to point at SCRIPE-Backend's own public
 * lead-capture route, `POST /api/v1/auth/signup/contact-sales`
 * (`SelfServiceSignupController.cs`) — the same one the real product app's
 * signup wizard calls for its own "Contact Sales" step
 * (`SCRIPE-Frontend/src/modules/shared/auth/signup/src/data/services/
 * signup.endpoints.ts`), the only unauthenticated, anonymous-friendly
 * lead-intake route in that backend (every other lead/CRM route is
 * `[Authorize]` + `[AdminOnly]`). This is not this repo's own invention —
 * matching it is the whole point.
 *
 * That controller deserializes into `ContactSalesRequest` (a C# record):
 * `CompanyName`, `ContactName`, `Email` (required); `Phone`, `EditionKey`,
 * `Message`, `BusinessType`, `TeamSize`, `PrimaryPriority` (all optional).
 * ASP.NET Core's default `System.Text.Json` binding is case-insensitive, so
 * camelCase here is safe and is the more conventional JSON casing to send.
 *
 * Field mapping, and why each one lands where it does:
 * - `name` -> `contactName`, `email` -> `email`, `organization` ->
 *   `companyName` — this form's three REQUIRED fields
 *   (`REQUIRED_FIELDS` in `validate.ts`) map exactly onto the backend's
 *   three required fields. No fallback/derivation needed on either side.
 * - `type` -> `businessType` — this form's organization-type dropdown
 *   (`club`/`academy`/`venue`/`multi-sport`/`other`, `validate.ts`'s
 *   `KNOWN_ORG_TYPES`) is the same concept `businessType` names on the
 *   backend, just collected earlier in a different flow (this form, not
 *   a multi-step signup wizard's discovery step).
 * - `editionKey`/`teamSize`/`primaryPriority` are deliberately OMITTED
 *   (not sent as empty strings) — this form collects none of that
 *   information, and the backend record declares all three optional
 *   (`string?`), so omitting the keys entirely is the honest shape: this
 *   submission genuinely doesn't have an opinion on them, which is a
 *   different thing from asserting an empty one.
 *
 * Still excludes `companyWebsite`/`startedAt` (this form's OWN bot-defense
 * fields — meaningless to any lead-intake backend, this one included).
 *
 * @param lead - A validated lead (`LeadValidation["lead"]` from an `ok: true`
 *   result).
 * @returns A plain object safe to `JSON.stringify`, shaped for
 *   `ContactSalesRequest`.
 */
function toLeadPayload(lead: LeadInput): Record<string, string> {
  const payload: Record<string, string> = {
    contactName: lead.name,
    email: lead.email,
    companyName: lead.organization,
  };
  if (lead.phone) payload.phone = lead.phone;
  if (lead.type) payload.businessType = lead.type;
  if (lead.message) payload.message = lead.message;
  return payload;
}

/**
 * The contact form's Server Action. See this file's header for the full
 * behavioral contract (spam handling, logging rule, never-throws guarantee).
 *
 * @param _prev - `useActionState`'s previous-state argument. Unused — there
 *   is nothing to accumulate across submissions, matching the stub this
 *   replaces.
 * @param formData - The submitted form's data (see {@link parseLeadInput}
 *   for exactly which fields are read).
 * @returns See {@link LeadActionResult}.
 */
export async function submitLead(_prev: unknown, formData: FormData): Promise<LeadActionResult> {
  try {
    const input = parseLeadInput(formData);
    const validation = validateLead(input);

    if (!validation.ok) {
      if ("spam" in validation) {
        // Silent discard — see this file's header, "spam -> 'sent'".
        return { status: "sent" };
      }
      return { status: "invalid", fieldErrors: validation.fieldErrors };
    }

    // Read at CALL time, not module load time — see this file's header,
    // "why the env var is read inside submitLead", for why.
    //
    // MUST be the Cloudflare-fronted host (https://api.scripe.org/...), NEVER
    // the raw Render origin (https://scripe-backend.onrender.com/...) even
    // though the backend's own AllowedHosts accepts both. A separate
    // `CloudflareOriginVerificationMiddleware` sits in front of every route on
    // that backend (`GeoIp:RequireCloudflareOriginVerification=true` in its
    // production config) and 403s any request missing the header Cloudflare's
    // own Transform Rule injects for traffic that actually transits it — a
    // direct server-to-server call to the Render origin skips that entirely
    // and gets flatly rejected, no matter how correct everything else here is.
    const leadsEndpoint = process.env.LEADS_ENDPOINT;
    if (!leadsEndpoint) {
      // No backend wired yet — the honest degraded state, not a fabricated
      // success. The visitor's input was still fully validated.
      return { status: "not-connected" };
    }

    const response = await fetch(leadsEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toLeadPayload(validation.lead)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // A 409 from this endpoint means `workspace_exists` or `duplicate_lead`
    // (SelfServiceSignupController's own contact-sales handler) — the
    // submission reached the backend and IS on record, just not as a new
    // row. Folding that into "not-connected" would be a real regression:
    // that status's own copy says "this form is not connected to a live
    // inbox yet", which is false the moment a 409 comes back — the inbox is
    // very much connected, it just already has this visitor. `sent` is the
    // honest outcome here, not `not-connected`.
    if (!response.ok && response.status !== 409) {
      // Status code only — never the response body, never the request we
      // just sent. See this file's header, "PII-free logging".
      console.error("[leads] delivery failed with non-2xx status", response.status);
      return { status: "not-connected" };
    }

    return { status: "sent" };
  } catch (error) {
    // Network failure, timeout (AbortSignal.timeout fires an AbortError),
    // JSON.stringify failure, or any other unexpected throw all land here.
    // `.name` only (e.g. "AbortError"/"TypeError") — never `.message` or the
    // error object itself. See this file's header, "PII-free logging" and
    // "why this function never throws".
    console.error("[leads] submission failed", error instanceof Error ? error.name : "unknown");
    return { status: "not-connected" };
  }
}
