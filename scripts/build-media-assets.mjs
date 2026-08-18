#!/usr/bin/env node
/**
 * Campus imagery pipeline (Task G3 — delivered-image integration).
 *
 * The sibling of `scripts/build-brand-assets.mjs`, applying the same rule to
 * a different class of source: the owner supplies finished photographic
 * plates, this script turns them into the small, purpose-fit derivatives the
 * site actually loads. It never draws, paints, upscales or synthesises a
 * pixel — every operation here is mechanical (copy, crop, resize down,
 * re-encode). That is the boundary the project's "never generate raster art"
 * rule draws around asset tooling; see `build-brand-assets.mjs`'s header for
 * the same statement in the brand-mark context.
 *
 * ┌─ WHY THIS SCRIPT EXISTS ────────────────────────────────────────────────┐
 * The owner's drop lives in `assets/hero-plates/new/` as ~2MB PNGs at their
 * generated resolution. Two different consumers need two different kinds of
 * derivative, and neither can use those PNGs directly:
 *
 *   1. THE HERO PLATE is theme-adaptive, and a theme is only known in the
 *      browser (`data-theme` on `<html>`, set pre-paint from localStorage —
 *      see `src/theme/theme-script.ts`). A server-rendered `<img srcset>`
 *      cannot pick between the night and day plate, and rendering BOTH
 *      downloads both (a `display: none` `<img>` still fetches — the exact
 *      trap `src/lib/hero-armed-store.ts` documents). A CSS
 *      `background-image` selected by a `[data-theme]` rule fetches exactly
 *      the one plate the active theme resolves to, works with no JS, and
 *      survives static prerender untouched. But a CSS background bypasses
 *      `next/image` entirely, so the AVIF/WebP encodes Next would normally
 *      negotiate have to exist as real files: that is §1 below.
 *
 *   2. THE SUB-PAGE PHOTOGRAPHS do go through `next/image`, which handles
 *      responsive widths and AVIF negotiation itself. They only need ONE
 *      reasonably sized master per slot to optimise from — shipping the
 *      2MB PNG as that master would put 10MB of never-transferred bytes in
 *      the deploy for no gain. That is §2 below.
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * SOURCES — read-only, never written to:
 *   - `assets/hero-plates/new/*.png` — the owner's untouched drop.
 *   - `public/media/hero/plate-*.png` — the night plates already in
 *     production (see the NIGHT SET note below for why these, not the
 *     delivered night candidates, are the hero's night film).
 *
 * NIGHT SET — a documented deviation from the delivered-images catalog
 * (`docs/asset-briefs/delivered-images-catalog-2026-08-19.md` §6, which
 * proposed replacing all four night plates). Viewing the candidates against
 * the production plates showed the delivered night batch renders the campus
 * walkway as a WHITE line; the production plates render it in signal lime.
 * That lime thread is not incidental decoration — `home.css`'s `.hero-bloom`
 * is authored as "the campus walkway's own light temperature", the hero's
 * whole accent system rhymes with it, and `.hero-stamp` carries a shadow
 * specifically so it stays separable "over the plate's own lime walkway".
 * Swapping in near-identical frames that drop that thread is a lateral move
 * at best and a brand regression at worst, so the night set stays; only the
 * DAY plate is new. Re-running this script is how a future night swap would
 * land if the owner ever delivers a lime-walkway night set.
 *
 * OUTPUTS (all under `public/`, all deterministic and safe to re-run):
 *
 *   §1 Hero plates — explicit AVIF + WebP at native width, consumed by
 *      `src/styles/home.css`'s `--hero-plate` `image-set()`:
 *        public/media/hero/plate-background.{avif,webp}      (night)
 *        public/media/hero/plate-background-day.{avif,webp}  (day)
 *      Native width (1915px) is the only width emitted on purpose: the plate
 *      is a 21:9 frame rendered with `object-fit: cover`, so on a PORTRAIT
 *      phone viewport it is the plate's HEIGHT that drives the cover scale
 *      (390×844 needs 844/821 = 1.03× — i.e. essentially the full source
 *      width), and a narrower variant would be upscaled ~2.7× there. The
 *      usual "small screens get a small image" instinct is inverted for
 *      ultra-wide plates; one native-width encode is both the smallest and
 *      the sharpest thing to send a phone.
 *
 *   §2 Sub-page photograph masters — one WebP per slot, the input
 *      `next/image` optimises from:
 *        public/media/company/ops-room.webp
 *        public/media/solutions/academies-dawn.webp
 *        public/media/solutions/venues-courts.webp
 *        public/media/solutions/clubs-sideline.webp
 *        public/media/pricing/city-hubs.webp
 *
 * NOT COPIED (a second documented deviation from catalog §6): the three
 * chapter stills (`chapter-{clubs,venues,intelligence}.png`) and the parked
 * alternates. Catalog §6 itself notes the hero rig has no code path that
 * would display the chapter stills — dropping them in `public/` would ship
 * ~7MB of never-requested bytes to every deploy. They stay in the owner's
 * source drop until a rig change actually consumes them.
 *
 * USAGE
 *   npm run media:build
 *
 * Add a slot by appending to {@link HERO_PLATES} or {@link PHOTO_MASTERS};
 * the owner's round-2 files (day midground, day foreground, day finale,
 * multi-sport hero) land as new entries here plus their consumer, never as
 * a hand-run one-off conversion.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The owner's untouched source drop. Read-only. */
const DROP = path.join(ROOT, "assets", "hero-plates", "new");

/** Already-in-production plates, used as sources for the night encodes. */
const HERO_DIR = path.join(ROOT, "public", "media", "hero");

/**
 * AVIF encoder settings. `effort: 6` is the quality/build-time knee — the
 * default 4 leaves visible blocking in the plates' dark sky gradients, and 9
 * costs minutes per file for a fraction of a percent. `chromaSubsampling`
 * stays at the 4:4:4 default: these frames carry saturated turquoise pool
 * and lime walkway detail at small pixel scales, exactly what 4:2:0 smears.
 */
const AVIF = { quality: 58, effort: 6 };

/** WebP fallback settings — only reached by browsers without AVIF. */
const WEBP = { quality: 82, effort: 6 };

/** Master encode for the `next/image` inputs (§2): high enough that the
 *  optimiser's own AVIF pass is the only visible generation loss. */
const MASTER_WEBP = { quality: 90, effort: 6 };

/**
 * §1 — hero plates. `out` is the basename under `public/media/hero/`; both
 * an `.avif` and a `.webp` are written for each.
 */
const HERO_PLATES = [
  {
    /** Night film, both the static frame and the armed flight's base layer.
     *  Source is the production plate itself — see the NIGHT SET note. */
    source: path.join(HERO_DIR, "plate-background.png"),
    out: "plate-background",
  },
  {
    /** Day film (light theme). `Golden-Hour Aerial Sports Complex` won the
     *  P14 slot over `Aerial Sports Complex Masterplan` in catalog §1. */
    source: path.join(DROP, "Golden-Hour Aerial Sports Complex.png"),
    out: "plate-background-day",
  },
];

/**
 * §2 — sub-page photograph masters. `crop` is an optional
 * `sharp.resize`-compatible target that re-frames a source whose native
 * aspect ratio does not match the slot; it only ever removes pixels.
 */
const PHOTO_MASTERS = [
  {
    /** /company — the night operations room overlooking the campus. Native
     *  1122×1402 is already the 4:5 the portrait slot wants. */
    source: path.join(DROP, "Night Operations Room Overlooking Sports Complex.png"),
    out: path.join("company", "ops-room"),
  },
  {
    /** /solutions/sports-academies — misty dawn training ground. 4:5 native. */
    source: path.join(DROP, "Misty Dawn Soccer Training Ground.png"),
    out: path.join("solutions", "academies-dawn"),
  },
  {
    /** /solutions/sports-venues — the near-nadir padel court grid, one court
     *  lit. 4:5 native. */
    source: path.join(DROP, "Midnight Paddle Courts from Above.png"),
    out: path.join("solutions", "venues-courts"),
  },
  {
    /** /solutions/sports-clubs — rainy night sideline. Native 971×1619 is a
     *  much taller 3:5; cropped to the same 4:5 the other three portraits
     *  use so the framed plates read as one set across the sub-pages. The
     *  crop is anchored to the TOP: the frame's subject stack (dugout roof,
     *  benches, tactics board, floodlight, far stand) all lives in the upper
     *  three quarters, and the bottom quarter is wet foreground tarmac. */
    source: path.join(DROP, "Rainy Night at the Soccer Sideline.png"),
    out: path.join("solutions", "clubs-sideline"),
    crop: { width: 971, height: 1214, position: "top" },
  },
  {
    /** /pricing — four lit facility islands across a dark city. Stays at its
     *  native 21:9: the whole point of the frame is the four separate hubs,
     *  and any portrait crop throws two of them away. */
    source: path.join(DROP, "Four Sports Hubs Across the Night City.png"),
    out: path.join("pricing", "city-hubs"),
  },
];

/**
 * Writes `data` to `file`, creating parent directories as needed, and
 * reports the result.
 *
 * @param file - Absolute destination path.
 * @param data - Encoded image bytes.
 */
async function emit(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
  const digest = createHash("sha256").update(data).digest("hex").slice(0, 12);
  const kb = (data.byteLength / 1024).toFixed(1);
  console.log(`  ${path.relative(ROOT, file).replace(/\\/g, "/")}  ${kb} kB  ${digest}`);
}

/**
 * Runs both passes. Fails loudly (non-zero exit) if any declared source is
 * missing rather than silently emitting a partial set.
 */
async function main() {
  console.log("§1 hero plates (CSS background-image, explicit AVIF + WebP)");
  for (const plate of HERO_PLATES) {
    const input = await readFile(plate.source);
    const meta = await sharp(input).metadata();
    console.log(`- ${path.basename(plate.source)}  ${meta.width}×${meta.height}`);
    await emit(path.join(HERO_DIR, `${plate.out}.avif`), await sharp(input).avif(AVIF).toBuffer());
    await emit(path.join(HERO_DIR, `${plate.out}.webp`), await sharp(input).webp(WEBP).toBuffer());
  }

  console.log("\n§2 sub-page photograph masters (next/image inputs, WebP)");
  for (const photo of PHOTO_MASTERS) {
    const input = await readFile(photo.source);
    const meta = await sharp(input).metadata();
    const pipeline = sharp(input);
    if (photo.crop) {
      pipeline.resize({
        width: photo.crop.width,
        height: photo.crop.height,
        fit: "cover",
        position: photo.crop.position,
      });
    }
    const size = photo.crop ? `${photo.crop.width}×${photo.crop.height} (cropped)` : `${meta.width}×${meta.height}`;
    console.log(`- ${path.basename(photo.source)}  ${meta.width}×${meta.height} → ${size}`);
    await emit(path.join(ROOT, "public", "media", `${photo.out}.webp`), await pipeline.webp(MASTER_WEBP).toBuffer());
  }
}

await main();
