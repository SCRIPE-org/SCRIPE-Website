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

/** The server-only backend endpoint this action POSTs a validated lead to.
 *  Deliberately NOT `NEXT_PUBLIC_*` — a public env var is bundled into
 *  client JavaScript and would expose an internal lead-intake URL to every
 *  visitor's browser (and to anyone reading the bundle), which is exactly
 *  the kind of endpoint worth keeping server-only even though it isn't a
 *  secret in the credential sense. Unset (the default until a backend
 *  exists) resolves every valid submission to the honest `"not-connected"`
 *  state — see `.env.example` for the setup comment. */
const LEADS_ENDPOINT = process.env.LEADS_ENDPOINT;

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
 * `File`-typed entry, an empty string, or a non-numeric/non-finite value all
 * resolve to `undefined` — `validateLead` treats an `undefined` `startedAt`
 * as spam (fail-safe; see `validate.ts`'s header), so any of those cases end
 * up with the exact same conservative outcome without this function having
 * to duplicate that decision.
 *
 * @param formData - The submitted form's data.
 * @returns The parsed epoch-ms timestamp, or `undefined`.
 */
function readStartedAt(formData: FormData): number | undefined {
  const raw = readFormString(formData, "startedAt");
  if (raw === "") return undefined;
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
 * Builds the JSON payload POSTed to {@link LEADS_ENDPOINT} from a validated
 * lead. Deliberately excludes `companyWebsite`/`startedAt` — both are
 * bot-defense mechanics with no meaning to a lead-intake backend, the same
 * way the legacy static site's own `contact.js` only ever POSTed its five
 * visible fields (never its honeypot). Field order matches
 * `ContactForm.tsx`'s own field order.
 *
 * @param lead - A validated lead (`LeadValidation["lead"]` from an `ok: true`
 *   result).
 * @returns A plain object safe to `JSON.stringify`.
 */
function toLeadPayload(lead: LeadInput): Record<string, string> {
  return {
    name: lead.name,
    email: lead.email,
    organization: lead.organization,
    phone: lead.phone ?? "",
    type: lead.type ?? "",
    message: lead.message ?? "",
  };
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

    if (!LEADS_ENDPOINT) {
      // No backend wired yet — the honest degraded state, not a fabricated
      // success. The visitor's input was still fully validated.
      return { status: "not-connected" };
    }

    const response = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toLeadPayload(validation.lead)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
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
