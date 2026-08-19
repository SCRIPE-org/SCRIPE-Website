/**
 * Fusion UI primitive — PlatePhoto.
 *
 * The one way a campus photograph appears anywhere outside the home hero: a
 * framed print. Every sub-page image on this site is a single asset that has
 * to read correctly in BOTH themes, so the theme work happens in the FRAME
 * around the photograph, never by shipping a second copy of it. (The home
 * hero is the deliberate exception — it is the only theme-adaptive imagery,
 * swapping a night plate for a golden-hour one; see
 * `src/components/sections/home/Hero.tsx`'s header.)
 *
 * WHY A FRAME AT ALL. Every delivered photograph is a night or blue-hour
 * frame — near-black, low-key, high-contrast. Dropped bare onto the dark
 * theme's obsidian page they dissolve into it with no edge; dropped bare
 * onto the light theme's paper they read as a hole punched in the page. The
 * frame is what makes the same dark image land as a deliberate print in both
 * rooms: in dark it gets an edge (hairline + inner top light + deep shadow)
 * so it separates from the page; in light it gets a paper mat and a studio
 * shadow so it reads as something placed ON the page. The mat's GEOMETRY is
 * identical in both themes — only its material changes — so toggling the
 * theme never reflows the image or shifts the page.
 *
 * THE SIGNATURE: crop marks. Two lime L-corners, the same device the hero
 * stage draws around the film (`.hero-corners`, `home.css` §3), placed
 * INSIDE the image area rather than on the mat — every photograph in the set
 * is dark, so lime always has something dark to sit on regardless of theme,
 * and the marks read as the film language continuing rather than as a
 * decorated card. Deliberately the only ornament: the mat, the hairline and
 * the elevation ramp are the system's existing vocabulary, and this is the
 * one thing added on top.
 *
 * SIZING. `width`/`height` are the master file's intrinsic pixels and are
 * required — they give `next/image` the intrinsic ratio, which is what stops
 * the frame collapsing and re-expanding as the photograph decodes (the whole
 * layout-shift class of bug). The photographs are served from small WebP
 * masters built by `scripts/build-media-assets.mjs`; `next/image` derives the
 * responsive AVIF/WebP widths from them at request time, so `sizes` must
 * describe the frame's real CSS width at each breakpoint or it will fetch a
 * needlessly large one.
 *
 * A Server Component — no hooks, no client bundle cost.
 */
import Image from "next/image";
import { cx } from "./cx";

export interface PlatePhotoProps {
  /** Path to the photograph's master under `public/` (e.g.
   *  `/media/company/ops-room.webp`). */
  src: string;
  /** Alternative text. Comes from the locale content files so it translates
   *  — never hard-coded in a component. */
  alt: string;
  /** Intrinsic width of the master file, in pixels. */
  width: number;
  /** Intrinsic height of the master file, in pixels. */
  height: number;
  /** `next/image` `sizes`. Must describe the frame's rendered CSS width. */
  sizes: string;
  /** Set on a photograph that is above the fold on its page, so it is
   *  preloaded rather than lazily fetched. Defaults to false. */
  priority?: boolean;
  /** Set on a photograph that is NOT a night frame. The crop marks assume
   *  lime always lands on something dark; a daylight image breaks that, so
   *  this gives them the same drop-shadow the hero's own frame corners take
   *  over its day film. Defaults to false — the set is night. */
  bright?: boolean;
  /** Merged after the frame classes so callers can set width/placement. */
  className?: string;
}

/**
 * Renders a framed campus photograph.
 *
 * @param props - See {@link PlatePhotoProps}.
 */
export function PlatePhoto({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  bright = false,
  className,
}: PlatePhotoProps) {
  return (
    <figure className={cx("plate-frame", bright && "plate-frame-bright", className)}>
      <div className="plate-frame-window">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="plate-frame-img"
        />
        <span className="plate-frame-marks" aria-hidden="true" />
      </div>
    </figure>
  );
}
