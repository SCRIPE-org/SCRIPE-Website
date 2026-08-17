/**
 * Fusion UI primitive — Section.
 *
 * The page-level rhythm primitive every marketing section renders through:
 * a `<section>` that owns consistent vertical (block) breathing room, wrapping
 * an inner max-inline-size container that centers content and owns the
 * horizontal (inline) gutter. Splitting the two lets a section's background
 * or media run full-bleed to the viewport edge while its text content still
 * clamps to a readable measure — the standard "section owns rhythm, inner
 * container owns width" split. A Server Component — no hooks.
 *
 * Fusion's token set (`src/styles/tokens`) doesn't yet define container
 * max-width tokens, so the three `width` steps below are literal pixel
 * values rather than `var(--...)` references; the `--space-*` scale is used
 * everywhere else (block padding, inline gutter) since those tokens do
 * exist. The default/wide figures are sourced from the standalone design
 * reference's documented container doctrine (`--container-max: 1360px` in
 * `backup/_ds`'s tokens/spacing.css), not invented — `wide` is a deliberate
 * step up from that baseline for sections that want more breathing room
 * (e.g. wide media, multi-column evidence) without going full-bleed.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

/** Max-inline-size step for the section's inner container. */
export type SectionWidth = "default" | "wide" | "full";

const WIDTH_CLASSES: Record<SectionWidth, string> = {
  default: "max-w-[1360px]",
  wide: "max-w-[1680px]",
  full: "max-w-none",
};

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  /** Anchor target for in-page navigation (e.g. a footer link to `#pricing`). */
  id?: string;
  /** Inner container max-inline-size step. Defaults to `"default"`. */
  width?: SectionWidth;
  /** Merged after the internal rhythm classes so callers can extend (never
   *  fully override) the computed styling. Applies to the outer `<section>`. */
  className?: string;
  children: ReactNode;
}

/**
 * Renders a `<section>` with the shared vertical rhythm, wrapping `children`
 * in a centered, width-clamped inner `<div>`.
 *
 * @param props - See {@link SectionProps}. `width` defaults to `"default"`.
 */
export function Section({ id, width = "default", className, children, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      className={cx("py-[clamp(var(--space-12),12vh,var(--space-14))]", className)}
      {...rest}
    >
      <div className={cx("mx-auto px-[clamp(var(--space-5),4vw,var(--space-9))]", WIDTH_CLASSES[width])}>
        {children}
      </div>
    </section>
  );
}
