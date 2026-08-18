/**
 * SCRIPE brand mark.
 *
 * Shared by `NavBar` and `Footer` (previously each inlined its own copy of
 * this SVG at a different size — consolidated here as the single source).
 *
 * Task E6 (3D Brand System Everywhere) replaced the flat, theme-following
 * inline SVG this component used to render with the owner's real 3D mark —
 * a glossy lime/steel/graphite render with its own fixed colors baked into
 * the pixels, so it no longer picks up `currentColor`/`var(--accent)` the
 * way the old flat SVG did. That trade was verified deliberately, not
 * assumed: the mark was composited over swatches approximating both the
 * dark nav (`--obsidian`) and the light nav's frosted-glass surface
 * (`color-mix(clean-white 72%, transparent)` over `--surface-page`) before
 * this change shipped. It reads clearly on dark; on light the lime and
 * graphite thirds stay high-contrast and the steel/chrome third — the
 * softest of the three — keeps enough internal shading and dark edge
 * strokes to still read as a distinct shape rather than washing out. Do NOT
 * recolor or reprocess the mark's pixels to "fix" light-theme contrast
 * further without owner sign-off — see the Task E6 report for the full
 * before/after swatches.
 *
 * Renders via `next/image` from a pre-shrunk derivative
 * (`public/brand/mark/scripe-mark-128.png`, produced by
 * `scripts/build-brand-assets.mjs` from the owner's
 * `SCRIPE_3D_MARK_TRANSPARENT.png` original) rather than the 1.4MB source —
 * Next's image optimizer only ever has to downscale from an already-small
 * 128px-wide PNG, never the original. `next/image`'s default fixed-size
 * behavior (non-`fill`) emits both 1x and 2x density sources automatically,
 * so the mark stays crisp on high-DPI displays without any manual `srcSet`.
 *
 * The source mark's opaque content doesn't fill its square canvas — sharp's
 * `.trim()` (in the build script) crops it to its true bounds, measured at
 * 1197×947px, a ~1.264:1 aspect ratio. {@link MARK_ASPECT_RATIO} hardcodes
 * that same ratio so callers can pass a single logical `size` (matching the
 * mark's width) and get a correctly-proportioned height without decoding
 * the image just to read its dimensions — the same pattern the previous
 * inline-SVG version used with its hand-fit `viewBox`.
 *
 * `next/image` defaults every non-`priority` image to `loading="lazy"`,
 * gated on an `IntersectionObserver`. `NavBar`'s mark is guaranteed to be in
 * the initial viewport on every single page load — never actually "below
 * the fold" — so it passes {@link BrandMarkProps.priority} to skip that
 * gate and render immediately, same as `Hero.tsx`'s background plate. Every
 * other call site (`Footer`, the closing-CTA panels) leaves it at the
 * default `false`: those genuinely are off-screen until the user scrolls,
 * so lazy-loading them is the correct, not just harmless, choice.
 */
import Image from "next/image";
import { cx } from "@/components/ui/cx";

/** The trimmed mark's width:height ratio — see the file header. */
const MARK_ASPECT_RATIO = 1197 / 947;

/** Props for {@link BrandMark}. */
export interface BrandMarkProps {
  /** Rendered width in CSS pixels; height follows the mark's fixed
   *  ~1.264:1 aspect ratio automatically. Defaults to `26`. */
  size?: number;
  /** Alt text for the mark image. Callers that already wrap `BrandMark` in
   *  a link carrying its own accessible name (e.g. an `aria-label`d
   *  `<Link>`, as both `NavBar` and `Footer` do) should still pass a
   *  real, localized value here rather than `""` — the link's label takes
   *  precedence for the accessible name either way, and a real alt keeps
   *  the mark meaningful in contexts a wrapping label doesn't cover (e.g.
   *  the image failing to load, or a future call site with no such
   *  wrapper). Defaults to `"SCRIPE"`. */
  alt?: string;
  /** Skips `next/image`'s default lazy-load gate for a mark that is always
   *  in the initial viewport (the nav lockup). See the file header — leave
   *  this `false` (the default) for every below-the-fold call site. */
  priority?: boolean;
  /** Merged onto the rendered image element so callers can extend layout
   *  (e.g. `shrink-0`, already applied internally, or a margin utility). */
  className?: string;
}

/**
 * Renders the SCRIPE 3D mark. See the file header for the asset/aspect-
 * ratio contract.
 *
 * @param props - See {@link BrandMarkProps}.
 */
export function BrandMark({ size = 26, alt = "SCRIPE", priority = false, className }: BrandMarkProps) {
  const height = Math.round(size / MARK_ASPECT_RATIO);

  return (
    <Image
      src="/brand/mark/scripe-mark-128.png"
      alt={alt}
      width={size}
      height={height}
      priority={priority}
      className={cx("shrink-0", className)}
    />
  );
}
