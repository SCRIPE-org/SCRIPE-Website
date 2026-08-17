/**
 * Fusion UI primitive — Eyebrow.
 *
 * The small kicker label used above headings ("01 — Operations" style
 * chapter markers, section labels). Uses `--accent-text` rather than
 * `--accent`: per `src/styles/tokens/colors.css`, `--accent` is the fill
 * role tuned for lime-on-lime contrast (e.g. a button background) while
 * `--accent-text` is the darker/foreground-tuned stop meant for lime used
 * as running text color — using the fill token here would fail contrast as
 * small text in the light theme. A Server Component — no hooks.
 *
 * Per the brand voice doctrine (the backup/_ds design reference's readme.md: "UPPERCASE only
 * for eyebrows/metadata (tracked-out, EN only; Arabic never
 * fake-uppercased)"), the uppercase transform and letter-spacing are undone
 * under `:lang(ar)` via an arbitrary Tailwind variant, mirroring the same
 * `:lang(ar)` convention `src/styles/tokens/typography.css` already uses
 * for Arabic-specific rules — scoped to this component instead of a global
 * token-file edit.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

export interface EyebrowProps extends Omit<ComponentPropsWithoutRef<"p">, "children"> {
  /** Merged after the internal type classes so callers can extend (never
   *  fully override) the computed styling. */
  className?: string;
  children: ReactNode;
}

/**
 * Renders the kicker label as a `<p>` styled with Fusion's meta type step.
 *
 * @param props - See {@link EyebrowProps}.
 */
export function Eyebrow({ className, children, ...rest }: EyebrowProps) {
  return (
    <p
      className={cx(
        "text-[length:var(--fs-meta)] font-semibold uppercase tracking-[0.14em] text-accent-text",
        "[&:lang(ar)]:normal-case [&:lang(ar)]:tracking-normal",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
