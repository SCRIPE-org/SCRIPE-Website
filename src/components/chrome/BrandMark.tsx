/**
 * SCRIPE brand mark.
 *
 * Shared by `NavBar` and `Footer` (previously each inlined its own copy of
 * this SVG at a different size — consolidated here as the single source).
 * Rendered as inline SVG rather than an `<img src="/brand/...">` reference
 * so the main shape can use `fill="currentColor"` and pick up the ambient
 * text color automatically, exactly the way Button/Card/Eyebrow avoid
 * hardcoding per-theme colors — no client JS or theme-detection needed for
 * the mark to look correct in both themes. The small corner chip stays the
 * fixed Signal Lime accent (`var(--accent)`), which already resolves to the
 * correct per-theme lime stop via the token cascade.
 *
 * Source path data: `backup/scripe-static/assets/brand/scripe-mark.svg`
 * (viewBox `0 0 96 100`).
 */
import { cx } from "@/components/ui/cx";

/** Props for {@link BrandMark}. */
export interface BrandMarkProps {
  /** Rendered width in CSS pixels; height follows the mark's fixed 96:100
   *  aspect ratio automatically. Defaults to `24`. */
  size?: number;
  /** Merged after the internal `shrink-0` class so callers can extend (e.g.
   *  a `text-*` color utility) without fighting it. */
  className?: string;
}

/**
 * Renders the SCRIPE angular mark as an inline, theme-aware SVG.
 *
 * @param props - See {@link BrandMarkProps}.
 */
export function BrandMark({ size = 24, className }: BrandMarkProps) {
  const height = Math.round((size * 100) / 96);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 96 100"
      fill="none"
      aria-hidden="true"
      className={cx("shrink-0", className)}
    >
      <path fill="currentColor" d="M76 0H0V63H64V74H0V86L14 100H90V37H26V26H90V14L76 0Z" />
      <path style={{ fill: "var(--accent)" }} d="M82 0H94V12L82 0Z" />
    </svg>
  );
}
