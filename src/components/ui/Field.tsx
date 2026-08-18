/**
 * Fusion UI primitive — Field.
 *
 * Form field wrapper: pairs a `<label>` with a single input-like child,
 * generating the ids that wire `aria-describedby` (hint and/or error) and
 * `aria-invalid`/`aria-required` onto the child, so callers never hand-wire
 * that plumbing themselves. A Server Component — no hooks, which rules out
 * `useId()` (React hooks including `useId` aren't available in Server
 * Components at all, since RSC rendering has no per-instance fiber to hang
 * hook state off). Ids are instead derived deterministically from `label`
 * via a tiny string hash (see `hashId` below) — stable across
 * server-renders, and Unicode-safe so Arabic labels hash to a real id
 * instead of collapsing to an empty string the way an ASCII-only slugify
 * would. The tradeoff: two Fields with byte-identical label text on the
 * same page would collide on id — acceptable for a form-field primitive,
 * since forms don't repeat identical labels in practice.
 *
 * Child wiring: `children` is cloned via `cloneElement` rather than a
 * render-prop. The brief's contract describes `children` as "the input
 * element" (not a function), so `<Field label="Email"><input /></Field>` is
 * the expected call shape; cloneElement keeps that shape working without
 * requiring callers to manually spread generated props onto their control.
 * The cost is the same one every cloneElement API has: `children` must be
 * exactly one element that accepts `id`/`aria-describedby`/`aria-invalid`/
 * `aria-required` (true for `<input>`, `<select>`, `<textarea>`, and any
 * component that forwards unknown props to one of those).
 */
import { cloneElement, type ReactElement } from "react";
import { cx } from "./cx";

interface FieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

export interface FieldProps {
  /** Field label, shown above the control and linked via `<label for>`. Also
   *  the seed for the generated id — see the file header for the tradeoff. */
  label: string;
  /** Validation error message. When present, replaces the hint (if any) and
   *  sets `aria-invalid` on the control. */
  error?: string;
  /** Supporting helper text shown below the control when there is no error. */
  hint?: string;
  /** Marks the field required: sets `aria-required` on the control and shows
   *  a required marker next to the label. */
  required?: boolean;
  /** Merged after the internal layout classes so callers can extend (never
   *  fully override) the computed styling. Applies to the outer wrapper. */
  className?: string;
  /** The single input-like element this field wraps and wires ids/aria onto. */
  children: ReactElement<FieldControlProps>;
}

/**
 * Deterministic, Unicode-safe string hash (a small djb2 variant) used to
 * derive a stable id fragment from `label` without React hooks.
 *
 * @param value - Arbitrary string (any script) to hash.
 * @returns A short base-36 digest, always non-negative.
 */
function hashId(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
}

/**
 * Renders a labeled form field: `<label>` + the cloned control + optional
 * hint/error text, with ids and ARIA attributes wired between them.
 *
 * @param props - See {@link FieldProps}.
 */
export function Field({ label, error, hint, required, className, children }: FieldProps) {
  const baseId = `field-${hashId(label)}`;
  const showHint = Boolean(hint) && !error;
  const hintId = showHint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const controlId = children.props.id ?? baseId;
  const control = cloneElement(children, {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    "aria-required": required,
  });

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={controlId} className="text-[length:var(--fs-small)] font-medium text-text-primary">
        {label}
        {required && (
          <span aria-hidden="true" className="text-text-secondary">
            {" "}
            *
          </span>
        )}
      </label>
      {control}
      {showHint && (
        <p id={hintId} className="text-[length:var(--fs-small)] text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        // No dedicated status/danger token exists in Fusion's color tokens
        // yet (src/styles/tokens/colors.css defines surface/text/accent/
        // border roles only). --accent-club (rust) is the nearest existing
        // warm/attention color that already flips correctly per theme, so
        // it's reused here rather than adding a new token file edit outside
        // this task's scope. Revisit once a dedicated status color lands.
        <p id={errorId} role="alert" className="text-[length:var(--fs-small)] text-accent-club">
          {error}
        </p>
      )}
    </div>
  );
}
