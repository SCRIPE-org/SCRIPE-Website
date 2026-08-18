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
 * Rhythm (Task E3): the block padding was compressed ~40% (from a 96–160px
 * clamp to 64–96px) as part of the cinematic elevation wave — the old scale
 * produced dead viewport-height oceans between designed content. Sections
 * that need to breathe differently extend via `className` (`!py-*`).
 *
 * Width steps resolve through the `--container-*` tokens
 * (`src/styles/tokens/spacing.css`), added in the same wave — the previous
 * literal pixel values are now ledgered there with their provenance.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

/** Max-inline-size step for the section's inner container. */
export type SectionWidth = "default" | "wide" | "full";

const WIDTH_CLASSES: Record<SectionWidth, string> = {
  default: "max-w-[var(--container-default)]",
  wide: "max-w-[var(--container-wide)]",
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
      className={cx("py-[clamp(var(--space-10),8vh,var(--space-12))]", className)}
      {...rest}
    >
      <div className={cx("mx-auto px-[clamp(var(--space-5),4vw,var(--space-9))]", WIDTH_CLASSES[width])}>
        {children}
      </div>
    </section>
  );
}
