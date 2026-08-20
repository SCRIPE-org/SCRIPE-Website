"use client";

/**
 * ContactForm — the site's only form and its one true conversion surface:
 * the demo-request form card. Everything else on this page (`ContactHero`,
 * `ContactExpect`) is a zero-JS Server Component; this is the ONE client
 * leaf the page needs, scoped as tightly as the RSC discipline in the design
 * spec (§4.1) calls for. `content` (this component's one prop) supplies
 * only page-specific narrative copy — the card's eyebrow/intro, field
 * placeholders/hints, the submit button's own conversion copy, and the
 * footnote. Field LABELS and every validation/state string come from
 * `useTranslations()` reading `messages/*.json`'s `forms` namespace instead
 * — see `ContactContent`'s doc comment (`src/content/types.ts`) for exactly
 * why that split exists.
 *
 * ── Field-label / message-vocabulary split ────────────────────────────────
 * `forms.name`/`email`/`organization`/`phone`/`type`/`message` are the six
 * field labels. `forms.required`/`emailInvalid`/`tooLong` are the three
 * validation messages every field reuses. `submit-lead.ts`'s server-side
 * `validateLead` returns these SAME three strings as `fieldErrors` values —
 * but as bare message KEYS (`"required"`, not the translated sentence),
 * never translated text and never user input (see that file's own doc
 * comment). `translateServerFieldError` below is what turns a server key
 * back into displayed copy via `t("forms." + key)`, so a client-caught error
 * and a server-caught error for the same field render identically either
 * way. `forms.sent`/`sentBody`/`notConnectedTitle`/`notConnected`/
 * `sendAnother`/`sending`/`send` are the submit/result-state vocabulary.
 *
 * ── "not connected" is NOT a success state (binding) ───────────────────────
 * `submitLead` returns `status: "not-connected"` in exactly the cases where
 * the submission did NOT reach anybody: `LEADS_ENDPOINT` unset, the endpoint
 * refusing/erroring, the request timing out, or any unexpected throw inside
 * the action (see that file's "WHY THIS FUNCTION NEVER THROWS" header). The
 * visitor's details were not delivered and were not stored anywhere.
 *
 * That outcome therefore must NOT reuse the resolved-success composition
 * (check glyph + "Thanks." + "Submit another request"), which is what an
 * audit caught it doing: a green tick and a thank-you over a submission that
 * went nowhere is a lie told at the exact moment the visitor is most likely
 * to act on it. Instead:
 *
 * - `showConfirmation` covers only the states where the submission is
 *   genuinely finished — `"sent"`, and `"spam"` (which `submit-lead.ts`
 *   deliberately makes indistinguishable from `"sent"`; see its header).
 *   That branch is untouched and is what a live `LEADS_ENDPOINT` will show.
 * - `"not-connected"` keeps the FORM MOUNTED and renders a neutral,
 *   informational notice at the top of the card. Keeping the form mounted is
 *   the substantive part: the inputs are uncontrolled, so replacing the form
 *   with a panel would throw away everything the visitor typed and make
 *   "try again" mean "retype all of it". Re-submitting is a real action here
 *   precisely because a delivery failure can be transient.
 *
 * Visual treatment is deliberately neutral (overlay surface, strong border,
 * muted alert glyph, secondary text) — never the accent/tick vocabulary the
 * success panel owns.
 *
 * ── Organization-type option source (binding decision) ────────────────────
 * The five `type` options are NOT page content. Four
 * (`club`/`academy`/`venue`/`multi-sport`) reuse the EXISTING
 * `nav.solutionsItems.*` message keys — the same "Sports Clubs" / "Sports
 * Academies" / "Sports Venues" / "Multi-Sports Organizations" labels the
 * Solutions mega-menu and hub already render (`src/components/chrome/ia.ts`).
 * This is deliberate reuse, not an oversight: duplicating that already-
 * translated copy into a second, contact-page-only string would be a second
 * translation to keep in sync for the same four organization shapes the
 * rest of the site already names once. The fifth option (`other`) has no
 * `nav.solutionsItems` counterpart, so it gets one new dedicated message,
 * `forms.typeOther`.
 *
 * ── Bot defenses (honeypot + time-trap) ────────────────────────────────────
 * `company_website` is a honeypot: a real visitor never sees or fills it
 * (`sr-only` class + `aria-hidden="true"` + `tabIndex={-1}` +
 * `autoComplete="off"` removes it from the visual layout, the accessibility
 * tree AND the tab order simultaneously), so any non-empty value on
 * submission is a strong bot signal. `startedAt` is a time-trap: an empty
 * hidden field at first render, filled with `Date.now()` in a `useEffect`
 * ("on mount", per the task brief) rather than during render, so server and
 * pre-hydration client markup stay byte-identical — no hydration mismatch.
 * `submitLead` (`src/lib/leads/submit-lead.ts`) compares it against its own
 * request time to reject implausibly instant submissions. Neither field is
 * validated client-side; both are read only by the server action — see that
 * file's header for the exact contract, including why a spam verdict there
 * resolves to the SAME `"sent"` status a real delivery does (never a
 * distinct, bot-legible signal).
 *
 * ── Client-side pre-validation vs. native HTML validation ──────────────────
 * Every required/limited input keeps its real `required`/`maxLength`/
 * `type="email"` attributes (never stripped), so a no-JS visitor still gets
 * the browser's own baseline constraint validation — the self-review
 * checklist's "no-JS: native validation attrs present" point. With JS
 * active, the `<form>` also carries `noValidate`: this does NOT remove those
 * attributes (a screen reader still announces "required"; `maxLength` still
 * clamps typed/pasted input), it only stops the browser's own unstyled
 * validation bubble from pre-empting `handleSubmit` below. Per React 19's
 * documented form-action semantics, calling `event.preventDefault()` inside
 * a form's `onSubmit` opts the submission out of firing its `action` — that
 * is exactly how `handleSubmit` blocks a client-invalid submission from ever
 * reaching `submitLead`. Its rules mirror the legacy static site's own
 * limits (`backup/scripe-static/js/contact.js`): required name/email/
 * organization, an email-shape check, and the five max-lengths.
 *
 * ── Elevation (Task E4) ─────────────────────────────────────────────────────
 * The form card moved from a flat border onto the shared elevation ramp
 * (`.atmo-panel`, `src/styles/tokens/atmosphere.css`); the confirmation
 * panel keeps its own intentionally stronger `border-border-strong` (a
 * deliberate signal on the resolved state) and takes only the ramp's shadow
 * half (`.atmo-lift`), which never touches border/background.
 *
 * ── Focus management ───────────────────────────────────────────────────────
 * On ANY invalid submission — client-side (immediate) or server-side (the
 * action returns `status: "invalid"`) — the first invalid field in field
 * order is focused, so a keyboard/screen-reader user lands exactly where the
 * fix is needed instead of having to hunt for it. On a delivered submission
 * (`sent`/`spam`), the confirmation panel's own heading is focused and the
 * panel carries `role="status"` (an implicit polite live region), so both a
 * sighted keyboard user and a screen-reader user learn the outcome without
 * hunting for it either. `not-connected` gets the same treatment on its own
 * in-form notice heading — the outcome is different, the way it is announced
 * is not.
 */
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { ContactContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";
import { Field } from "@/components/ui/Field";
import { submitLead, type LeadActionResult } from "@/lib/leads/submit-lead";
import { SpinnerIcon } from "./icons";

export interface ContactFormProps {
  /** The form card's narrative copy slice of the contact page content. */
  content: ContactContent["form"];
  /** The page's "what happens next" + contact-channel side panel
   *  (`ContactExpect`), server-rendered by `contact/page.tsx` and passed in
   *  as an opaque children slot — see that file's header for why it isn't
   *  imported here directly. Rendered beside the form in the default 2-column
   *  layout; suppressed entirely once a submission is confirmed, when this
   *  component takes over the full width instead. */
  children: ReactNode;
}

/** Field names this form validates and can show a `Field` error for. Order
 *  doubles as the "first invalid field" focus order after a failed
 *  submission. */
const VALIDATED_FIELDS = ["name", "email", "organization", "phone", "message"] as const;
type ValidatedField = (typeof VALIDATED_FIELDS)[number];

/** Max length per field, mirroring the legacy static site's own limits
 *  (`backup/scripe-static/js/contact.js`'s `LIMITS`) and the task brief's
 *  field contract. `type`/`company_website`/`startedAt` are excluded — none
 *  of them are user-validated free text. */
const FIELD_LIMITS: Record<ValidatedField, number> = {
  name: 120,
  email: 254,
  organization: 160,
  phone: 40,
  message: 4000,
};

/** Fields that must not be empty. */
const REQUIRED_FIELDS: ReadonlySet<ValidatedField> = new Set(["name", "email", "organization"]);

/** Same permissive shape check the legacy validator used — good enough to
 *  catch an obviously incomplete address without rejecting a valid one a
 *  stricter pattern might. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The five organization-type options. See this file's header for why four
 *  reuse `nav.solutionsItems` message keys and one is dedicated. `value` is
 *  the literal string this form submits — the exact set the task brief
 *  names (`club`/`academy`/`venue`/`multi-sport`/`other`). */
const ORG_TYPE_OPTIONS: ReadonlyArray<{ value: string; labelKey: string }> = [
  { value: "club", labelKey: "nav.solutionsItems.sportsClubs" },
  { value: "academy", labelKey: "nav.solutionsItems.sportsAcademies" },
  { value: "venue", labelKey: "nav.solutionsItems.sportsVenues" },
  { value: "multi-sport", labelKey: "nav.solutionsItems.multiSportsOrganizations" },
  { value: "other", labelKey: "forms.typeOther" },
];

/** Shared visual treatment for every text/email/tel/textarea/select control,
 *  reusing the same surface/border/radius tokens `Button.tsx`/`Card.tsx`
 *  already establish. `aria-invalid:` targets the attribute `Field` sets on
 *  the control it wraps, so an errored control's border recolors without
 *  this component tracking error state on the DOM node itself. Global
 *  `:focus-visible` styling (`src/app/globals.css`) already applies a
 *  token-driven focus ring to every focusable element, so none is redeclared
 *  here — matching `Button.tsx`'s own note on the same point. The select
 *  keeps its native browser arrow (no `appearance-none`) rather than a
 *  custom overlay icon: `Field` clones exactly one element and applies its
 *  id/aria-* directly onto it, so the child passed to `Field` must be the
 *  real `<select>` itself, not a wrapper `<div>` a floating icon could sit
 *  in — the native arrow reaches the same result (and already sits on the
 *  correct side in RTL) with no extra markup. */
const CONTROL_CLASS =
  // `border-strong`, not `border-subtle`: these are input boundaries, which
  // WCAG 1.4.11 holds to 3:1 against their background as UI components, not to
  // the 1.4.3 text ratio. Measured in the dark palette (the only one that ships
  // today): subtle #26282c on surface-page #0b0b0e is 1.33:1 — effectively an
  // invisible field on the site's only conversion surface. Strong #666a70 is
  // 3.62:1 and clears it.
  "w-full rounded-md border border-border-strong bg-surface-page px-4 py-3 text-[length:var(--fs-body)] " +
  "text-text-primary placeholder:text-text-muted transition-colors duration-[var(--motion-quick)] " +
  "ease-[var(--ease-standard)] aria-invalid:border-accent-club disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Validates one field's value against its required/length/email rules.
 * Length is checked against the TRIMMED value, not the raw one — matching
 * `src/lib/leads/validate.ts`'s server-side `validateTextField` exactly
 * (that file's header, "Trim before length checks", is the binding
 * statement of this rule) so padding whitespace never makes this client
 * check disagree with the server's authoritative one for the same input.
 *
 * @param field - Which field is being checked (selects the limit/required
 *   rule to apply).
 * @param value - The field's current raw value.
 * @param t - The root translator (`useTranslations()`, no namespace) — reads
 *   `forms.required`/`forms.emailInvalid`/`forms.tooLong`.
 * @returns The translated error message, or `undefined` if `value` passes.
 */
function validateField(field: ValidatedField, value: string, t: (key: string) => string): string | undefined {
  const trimmed = value.trim();
  if (REQUIRED_FIELDS.has(field) && !trimmed) return t("forms.required");
  if (field === "email" && trimmed && !EMAIL_RE.test(trimmed)) return t("forms.emailInvalid");
  if (trimmed.length > FIELD_LIMITS[field]) return t("forms.tooLong");
  return undefined;
}

/** The only `fieldErrors` values `submitLead` (`src/lib/leads/validate.ts`)
 *  can ever produce — the closed set {@link translateServerFieldError} is
 *  allowed to translate. Checked explicitly rather than translating whatever
 *  key arrives: `state.fieldErrors` is typed `Record<string, string>` (the
 *  server action's return type, not a literal union), so this is defense in
 *  depth against a future server-side change emitting a key with no matching
 *  `forms.*` message — `useTranslations` throws on an unknown key, which
 *  would otherwise crash this whole form on the exact "something went wrong
 *  server-side" path a visitor is least equipped to recover from. */
const KNOWN_SERVER_FIELD_ERROR_KEYS: ReadonlySet<string> = new Set(["required", "emailInvalid", "tooLong"]);

/**
 * Translates one server-reported `fieldErrors` entry — a bare `forms.*`
 * message KEY (`"required"` / `"emailInvalid"` / `"tooLong"`), never
 * translated text and never user input, per `submit-lead.ts`'s contract —
 * into the same displayed copy `validateField`'s client-side check would
 * show for an equivalent local failure.
 *
 * @param key - The raw `fieldErrors[field]` value from the server action's
 *   result, or `undefined` if that field has no server-reported error.
 * @param t - The root translator (`useTranslations()`, no namespace).
 * @returns The translated message, or `undefined` if `key` is absent or not
 *   one of the known message keys (see {@link KNOWN_SERVER_FIELD_ERROR_KEYS}).
 */
function translateServerFieldError(key: string | undefined, t: (key: string) => string): string | undefined {
  if (!key || !KNOWN_SERVER_FIELD_ERROR_KEYS.has(key)) return undefined;
  return t(`forms.${key}`);
}

/**
 * Renders this page's whole interactive section: in the default state, the
 * demo-request form card (eyebrow/intro, the undelivered-submission notice,
 * the honeypot and time-trap fields, the six visible fields, and the submit
 * button/footnote) beside `children` (`ContactExpect`) in a 2-column grid —
 * OR, once a submission is genuinely delivered, a single full-width
 * confirmation panel that replaces BOTH columns entirely. See this file's
 * header for the full behavioral contract, in particular why `not-connected`
 * renders in-form instead of as that panel.
 *
 * @param props - See {@link ContactFormProps}.
 */
export function ContactForm({ content, children }: ContactFormProps) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<LeadActionResult | null, FormData>(submitLead, null);
  const [clientErrors, setClientErrors] = useState<Partial<Record<ValidatedField, string>>>({});
  const [dismissed, setDismissed] = useState(false);
  const [formInstance, setFormInstance] = useState(0);
  const [startedAt, setStartedAt] = useState("");
  /** Last submitted values, mirrored back onto each control's `defaultValue`.
   *
   *  React 19 RESETS a `<form action={...}>` once its action completes — for
   *  every outcome, not just success. That is right for a delivered lead and
   *  wrong for every other result: an undelivered submission and a
   *  server-rejected one both leave the visitor on a form they must now
   *  retype from scratch, which is also what made the honest "your answers
   *  are still in the fields below" copy untrue when it was first written
   *  (measured: all four fields came back empty).
   *
   *  Rather than fight the reset or echo the lead back through the server
   *  action's result (which would put contact details in a response payload
   *  for no reason — see `submit-lead.ts`'s PII rules), the values are
   *  captured client-side in `handleSubmit` and become the controls' new
   *  DEFAULTS. A native form reset restores each control to its default, so
   *  React's own reset now restores what was typed instead of clearing it.
   *  The inputs stay uncontrolled throughout: `defaultValue` only writes the
   *  attribute, never the live value, so nothing interferes with typing.
   *
   *  This map covers all SIX fields, but the `defaultValue` prop alone only
   *  carries five of them — the org-type `<select>` needs
   *  {@link syncSelectDefault} as well. See that function for why. */
  const [retained, setRetained] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const organizationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const panelHeadingRef = useRef<HTMLHeadingElement>(null);
  const noticeHeadingRef = useRef<HTMLHeadingElement>(null);

  /** Focuses the DOM node behind one {@link ValidatedField}. A small switch
   *  rather than a `Record<ValidatedField, RefObject<...>>` lookup — the
   *  refs above have two different element types (`input` vs `textarea`),
   *  and TypeScript's invariant `RefObject` typing makes a single
   *  homogeneous record of them awkward to type correctly; this sidesteps
   *  that entirely. */
  function focusField(field: ValidatedField): void {
    const target =
      field === "name"
        ? nameRef.current
        : field === "email"
          ? emailRef.current
          : field === "organization"
            ? organizationRef.current
            : field === "phone"
              ? phoneRef.current
              : messageRef.current;
    target?.focus();
  }

  // Time-trap: recorded on mount (and again after "submit another" resets
  // the form), never during render, so server and pre-hydration client
  // markup stay byte-identical — see the file header.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Date.now() is only ever readable post-mount; it cannot be derived from props/state, so there is no render-time value to compute this from
    setStartedAt(String(Date.now()));
  }, [formInstance]);

  // Server-side "invalid": focus the first field the server itself
  // rejected, the same way a client-side failure does below.
  useEffect(() => {
    if (state?.status !== "invalid" || !state.fieldErrors) return;
    const fieldErrors = state.fieldErrors;
    const first = VALIDATED_FIELDS.find((field) => fieldErrors[field]);
    if (first) focusField(first);
  }, [state]);

  // Only genuinely-delivered outcomes resolve the form. `"spam"` is here
  // because `submit-lead.ts` guarantees a bot can never tell it apart from
  // `"sent"`; `"not-connected"` is deliberately NOT here — see the file
  // header's "not connected is NOT a success state".
  const showConfirmation = !dismissed && (state?.status === "sent" || state?.status === "spam");
  // Suppressed while a retry is in flight so the old notice never sits above
  // a submission that is currently being re-attempted.
  const showNotConnected = !dismissed && !isPending && state?.status === "not-connected";
  const rawServerFieldErrors = state?.status === "invalid" ? (state.fieldErrors ?? {}) : {};
  // Translate each server-reported message KEY into displayed copy — see
  // `translateServerFieldError`'s doc comment and this file's header
  // ("Field-label / message-vocabulary split") for why `fieldErrors` values
  // are keys, never text, and never user input.
  const serverErrors: Partial<Record<ValidatedField, string>> = {};
  for (const field of VALIDATED_FIELDS) {
    const translated = translateServerFieldError(rawServerFieldErrors[field], t);
    if (translated) serverErrors[field] = translated;
  }

  useEffect(() => {
    if (showConfirmation) panelHeadingRef.current?.focus();
  }, [showConfirmation]);

  useEffect(() => {
    if (showNotConnected) noticeHeadingRef.current?.focus();
  }, [showNotConnected]);

  /** Re-points the org-type `<select>`'s NATIVE default at `value`.
   *
   *  The five text controls survive the post-action reset purely by having a
   *  `defaultValue` prop, because React re-syncs `node.defaultValue` from that
   *  prop on every render for `<input>`/`<textarea>`. It does NOT do the
   *  equivalent for an uncontrolled `<select>`: `defaultValue` there is
   *  translated into `defaultSelected` on the matching `<option>` at MOUNT
   *  only, so a prop-only change on re-render is inert. Measured directly
   *  after a round trip, before this fix — every option's `defaultSelected`
   *  was still exactly as it mounted (`true` on the disabled placeholder,
   *  `false` on the chosen option), so the reset dutifully restored the
   *  placeholder while the other five fields came back. One field silently
   *  contradicting "your answers are still in the fields below" is the same
   *  class of defect as the one that copy was written to close.
   *
   *  `defaultSelected` is precisely the state a native reset consumes, so
   *  setting it here — at the one moment the intended default is known, and
   *  before the action is ever dispatched — needs no assumption about WHEN
   *  React resets the form, and no remount. It is the same thing React itself
   *  does for the text controls, done by hand for the one element type it
   *  skips. The `defaultValue` prop stays on the element for the mount case
   *  (first render, and the deliberate remount in `startAnother`). */
  function syncSelectDefault(value: string): void {
    const select = typeRef.current;
    if (!select) return;
    for (const option of select.options) option.defaultSelected = option.value === value;
  }

  /** Reads and validates every tracked field from a submitted `<form>`,
   *  blocking the action from dispatching (via `preventDefault`) when any
   *  fail — see this file's header for why that stops React's form action
   *  from firing. On success, clears any stale client errors and re-arms
   *  the confirmation panel so a second submission can show its own result. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const errors: Partial<Record<ValidatedField, string>> = {};

    // Captured before any early return, so the values survive React's
    // post-action form reset on every outcome — see `retained`'s declaration.
    const submittedType = String(data.get("type") ?? "");
    setRetained({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organization: String(data.get("organization") ?? ""),
      phone: String(data.get("phone") ?? ""),
      type: submittedType,
      message: String(data.get("message") ?? ""),
    });
    syncSelectDefault(submittedType);

    for (const field of VALIDATED_FIELDS) {
      const message = validateField(field, String(data.get(field) ?? ""), t);
      if (message) errors[field] = message;
    }

    const firstInvalid = VALIDATED_FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      event.preventDefault();
      setClientErrors(errors);
      focusField(firstInvalid);
      return;
    }

    setClientErrors({});
    setDismissed(false);
  }

  /** "Submit another request": remounts the `<form>` (clearing its
   *  uncontrolled inputs), re-arms the time-trap and returns focus to the
   *  first field. */
  function startAnother(): void {
    setDismissed(true);
    setClientErrors({});
    // Drop the retained defaults too — "another request" means a blank form,
    // not the delivered one pre-filled again.
    setRetained({});
    setFormInstance((n) => n + 1);
    requestAnimationFrame(() => nameRef.current?.focus());
  }

  if (showConfirmation) {
    // A full-width takeover, not a card in the form's old grid cell — see
    // `contact/page.tsx`'s header for why this branch renders instead of
    // that 2-column layout entirely (both `children`/`ContactExpect` and the
    // grid disappear here). This is deliberately the SAME "obsidian panel +
    // lime horizon" brand moment every page's closing CTA already ends on
    // (`.atmo-cta-panel`/`-horizon`/`-bloom`/`-grain`, `night-zone` — see
    // e.g. `platform/ClosingCta.tsx`) rather than a bespoke treatment: a
    // confirmed demo request is exactly the kind of moment that vocabulary
    // exists for, and reusing it means this page's biggest beat looks like
    // it belongs to the same site instead of inventing a second one.
    //
    // `.result-panel` (motion-utilities.css §7), NOT `Reveal`: this panel
    // appears because `state.status` just flipped, at the scroll position
    // the visitor is already looking at — there is no "scrolling into view"
    // event for `Reveal`'s IntersectionObserver to key off, and confirmed
    // live that leaves it stuck at `opacity: 0` indefinitely (a real "sent"
    // response, real DOM, permanently invisible — the exact "nothing
    // happened" report this replaces). A plain `@starting-style` transition
    // fires on insertion regardless of viewport/compositing state, which is
    // the guarantee this moment needs. §7a's own header covers the badge
    // pop + glow bloom + check-draw + heading/body/button stagger the
    // classes below wire up, now at this panel's larger scale.
    return (
      <div role="status" className="result-panel atmo-cta-panel night-zone px-6 py-14 text-center sm:px-10 sm:py-16">
        <span className="atmo-cta-horizon" aria-hidden="true" />
        <span className="atmo-cta-bloom" aria-hidden="true" />
        <span className="atmo-cta-grain" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-6">
          <span
            aria-hidden="true"
            className="result-panel-icon grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent-text"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" className="result-panel-check" />
            </svg>
          </span>
          <h2
            ref={panelHeadingRef}
            tabIndex={-1}
            className="result-panel-heading atmo-title font-display text-[length:var(--fs-display)] text-balance text-white outline-none"
          >
            {t("forms.sent")}
          </h2>
          <p className="result-panel-body max-w-[52ch] text-[length:var(--fs-lead)] text-pretty text-white/78">
            {t("forms.sentBody")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="result-panel-cta mt-2 border-white/30 text-white hover:bg-white/10 active:bg-white/10"
            onClick={startAnother}
          >
            {t("forms.sendAnother")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      <Reveal className="min-w-0">
        <form
          key={formInstance}
          noValidate
          action={formAction}
          onSubmit={handleSubmit}
          className="atmo-panel grid gap-6 rounded-lg p-6 sm:p-8"
        >
          <div className="grid gap-1.5">
            <span className="text-[length:var(--fs-meta)] font-semibold uppercase tracking-[0.14em] text-accent-text [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {content.eyebrow}
            </span>
            <p className="text-[length:var(--fs-small)] text-pretty text-text-secondary">{content.intro}</p>
          </div>

          {/* Undelivered-submission notice. Deliberately NOT the success
              composition — no tick, no accent, no "Thanks." — and deliberately
              ABOVE a form that is still mounted and still holds everything the
              visitor typed. See this file's header. */}
          {showNotConnected && (
            <div
              role="status"
              className="notice-panel grid gap-3 rounded-md border border-border-strong bg-surface-overlay p-5 sm:grid-cols-[auto_1fr] sm:gap-4"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-md border border-border-strong text-text-secondary"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" />
                  <path d="M12 16.5v.01" />
                </svg>
              </span>
              <div className="grid min-w-0 gap-1.5">
                <h2
                  ref={noticeHeadingRef}
                  tabIndex={-1}
                  className="font-display text-[length:var(--fs-lead)] font-semibold text-text-primary outline-none"
                >
                  {t("forms.notConnectedTitle")}
                </h2>
                <p className="max-w-[56ch] text-[length:var(--fs-small)] text-pretty text-text-secondary">
                  {t("forms.notConnected")}
                </p>
              </div>
            </div>
          )}

          {/* Honeypot: a real visitor never perceives this field by any
              channel — sight, screen reader, or Tab key. */}
          <input
            type="text"
            name="company_website"
            defaultValue=""
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />
          {/* Time-trap: filled on mount, read only by the server action. */}
          <input type="hidden" name="startedAt" value={startedAt} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("forms.name")} required error={clientErrors.name ?? serverErrors.name}>
              <input
                ref={nameRef}
                type="text"
                name="name"
                required
                maxLength={FIELD_LIMITS.name}
                autoComplete="name"
                defaultValue={retained.name ?? ""}
                placeholder={content.placeholders.name}
                className={CONTROL_CLASS}
              />
            </Field>

            <Field label={t("forms.email")} required error={clientErrors.email ?? serverErrors.email}>
              <input
                ref={emailRef}
                type="email"
                name="email"
                required
                maxLength={FIELD_LIMITS.email}
                autoComplete="email"
                defaultValue={retained.email ?? ""}
                placeholder={content.placeholders.email}
                className={CONTROL_CLASS}
              />
            </Field>

            <Field label={t("forms.organization")} required error={clientErrors.organization ?? serverErrors.organization}>
              <input
                ref={organizationRef}
                type="text"
                name="organization"
                required
                maxLength={FIELD_LIMITS.organization}
                autoComplete="organization"
                defaultValue={retained.organization ?? ""}
                placeholder={content.placeholders.organization}
                className={CONTROL_CLASS}
              />
            </Field>

            <Field
              label={t("forms.phone")}
              hint={content.hints.phone}
              error={clientErrors.phone ?? serverErrors.phone}
            >
              {/* Phone numbers stay LTR even on the Arabic page — dir="ltr" is
                  physical here on purpose, not a logical-property omission. */}
              <input
                ref={phoneRef}
                type="tel"
                name="phone"
                dir="ltr"
                inputMode="tel"
                maxLength={FIELD_LIMITS.phone}
                autoComplete="tel"
                defaultValue={retained.phone ?? ""}
                placeholder={content.placeholders.phone}
                className={cx(CONTROL_CLASS, "text-start")}
              />
            </Field>
          </div>

          <Field label={t("forms.type")} hint={content.hints.type}>
            <select ref={typeRef} name="type" defaultValue={retained.type ?? ""} className={CONTROL_CLASS}>
              <option value="" disabled>
                {t("forms.typePlaceholder")}
              </option>
              {ORG_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("forms.message")} error={clientErrors.message ?? serverErrors.message}>
            <textarea
              ref={messageRef}
              name="message"
              maxLength={FIELD_LIMITS.message}
              defaultValue={retained.message ?? ""}
              placeholder={content.placeholders.message}
              className={cx(CONTROL_CLASS, "min-h-[120px] resize-y")}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending && <SpinnerIcon />}
              {isPending ? t("forms.sending") : content.submitCta}
            </Button>
            <p className="flex-1 text-[length:var(--fs-meta)] text-text-muted">{content.footnote}</p>
          </div>
        </form>
      </Reveal>
      {children}
    </div>
  );
}
