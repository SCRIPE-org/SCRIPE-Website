/**
 * Local stand-in for the contact page's demo-request Server Action.
 *
 * ============================================================================
 * STUB-SWAP CONTRACT FOR TASK 22 — READ BEFORE EDITING
 * ============================================================================
 * `ContactForm.tsx` imports `submitLead` from this file and drives
 * `useActionState(submitLead, null)` with it. Task 22 replaces THIS FILE's
 * export with a real `"use server"` action that posts to the backend lead
 * endpoint (design spec §5.2) — `ContactForm.tsx` itself needs no change
 * beyond the import line, provided the replacement keeps this EXACT function
 * signature:
 *
 *   (prev: unknown, formData: FormData) =>
 *     Promise<{ status: "sent" | "not-connected" | "invalid" | "spam"; fieldErrors?: Record<string, string> }>
 *
 * `prev` is `useActionState`'s previous-state argument — this stub ignores
 * it (there is nothing to accumulate across submissions), typed `unknown`
 * rather than `LeadState | null` so the signature matches exactly what
 * `useActionState`'s reducer-style action type expects regardless of how the
 * initial state is seeded.
 *
 * `formData` carries every field `ContactForm.tsx` names on its inputs:
 * `name`, `email`, `organization`, `phone`, `type`, `message`, plus the
 * bot-defense fields `company_website` (honeypot — a real submission never
 * fills this; a non-empty value is a strong spam signal) and `startedAt`
 * (time-trap — the epoch-ms timestamp the form recorded on mount; the real
 * action should reject submissions where `Date.now() - Number(startedAt)`
 * is implausibly small, per design spec §5.2/§9's "honeypot + time-trap +
 * server-side validation" requirement — this stub cannot do that check
 * meaningfully since it has no real request timing to distrust).
 *
 * Result contract:
 * - `"sent"` — delivered to the backend lead endpoint. Real success; the
 *   real action is the only place this can ever be returned honestly.
 * - `"not-connected"` — the endpoint doesn't exist yet, or delivery failed.
 *   `ContactForm.tsx` renders the SAME honest confirmation copy for this as
 *   for `"sent"` (see its own file header) — the visitor's input was
 *   captured and validated either way, only the backend delivery differs,
 *   and the UI says so plainly rather than pretending delivery succeeded.
 * - `"invalid"` — server-side validation rejected the submission.
 *   `fieldErrors` should be keyed by the same field `name` attributes this
 *   form renders (`name`, `email`, `organization`, `phone`, `message`) so
 *   `ContactForm.tsx` can route each message straight into that field's
 *   `Field` `error` prop with no remapping.
 * - `"spam"` — honeypot/time-trap/rate-limit rejected the submission.
 *   `ContactForm.tsx` deliberately renders the SAME confirmation panel as
 *   `"sent"`/`"not-connected"` for this status — never a distinct "you were
 *   flagged as spam" message — so a bot (or a human spammer) gets no signal
 *   that it was caught. Keep that behavior when wiring the real action;
 *   don't add spam-specific UI copy.
 *
 * THIS STUB always resolves `"not-connected"`, regardless of input — there
 * is no backend to reach yet (design spec §12: "Backend lead endpoint for
 * contact form … No [blocking]: the honest-fallback state ships"). It
 * performs no validation of its own (the fields are read but never
 * inspected) — `ContactForm.tsx`'s own client-side pre-validation is the
 * only gate in front of it until Task 22 adds real server-side validation
 * behind this same contract.
 */

/** The shape every `submitLead`-compatible action must resolve to — see
 *  this file's header for what each `status` means and who renders it. */
export interface LeadActionResult {
  /** Outcome of the submission attempt. See this file's header for the
   *  contract each value carries. */
  status: "sent" | "not-connected" | "invalid" | "spam";
  /** Present only for `status: "invalid"` — one message per rejected field,
   *  keyed by that field's `name` attribute (`name`, `email`, `organization`,
   *  `phone`, `message`). */
  fieldErrors?: Record<string, string>;
}

/**
 * Local stub for the contact form's demo-request submission.
 *
 * Ignores `formData` entirely and always resolves `{ status: "not-connected" }`
 * after a submission has already passed `ContactForm.tsx`'s own client-side
 * validation — matching the legacy static site's own honest behavior
 * (`backup/scripe-static/js/contact.js`: "THERE IS NO BACKEND HERE... the
 * form validates locally and then says plainly that the site is not yet
 * connected to a live inbox"). See this file's header for the exact contract
 * Task 22's real Server Action must preserve when it replaces this export.
 *
 * @param _prev - `useActionState`'s previous-state argument. Unused.
 * @param _formData - The submitted form's data. Unused — see this file's
 *   header for why this stub performs no validation of its own.
 * @returns Always `{ status: "not-connected" }`.
 */
export async function submitLead(_prev: unknown, _formData: FormData): Promise<LeadActionResult> {
  return { status: "not-connected" };
}
