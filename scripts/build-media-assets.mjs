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
 * SOURCES — read-only, never written to. `assets/` is the SINGLE source of
 * truth: every file under `public/media/` is generated from it by this
 * script, and nothing under `public/media/` is ever a source for anything
 * else. That was not true before — the night encodes used to read
 * `public/media/hero/plate-background.png`, which meant a 2.25MB PNG sat in
 * the deploy purely to be this script's input while no browser ever requested
 * it (the stylesheet only ever asks for `.avif`/`.webp`). It now lives at
 * `assets/hero/night-background.png` — byte-identical, verified by hash — and
 * the deploy is 2.25MB lighter.
 *
 *   - `assets/hero/*.png`  — the hero's night film, day film and the three
 *     chapter subjects. Named for their ROLE in the flight.
 *   - `assets/pages/*.png` — one framed photograph per page slot, named
 *     `<page>-<subject>`.
 *   - `assets/unused/`     — delivered frames nothing consumes, each named
 *     for what it is AND why it lost. Never read by this script.
 *
 * NIGHT SET — a documented deviation from the delivered-images catalog
 * (`docs/asset-briefs/delivered-images-catalog-2026-08-19.md` §6, which
 * proposed replacing all four night plates). Viewing the candidates against
 * the production plates showed the delivered night batch renders the campus
 * walkway as a WHITE line; the production plates render it in signal lime.
 * The rejected candidates are the four `assets/unused/*-white-walkway*.png`
 * files, named so this decision does not have to be rediscovered.
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
 *   §1 Hero plates — explicit AVIF + WebP, consumed by `src/styles/home.css`
 *      as `background-image`s:
 *        public/media/hero/plate-background.{avif,webp}          (night base)
 *        public/media/hero/plate-background-day.{avif,webp}      (day base)
 *        public/media/hero/chapter-clubs.{avif,webp}             (beat 01)
 *        public/media/hero/chapter-venues.{avif,webp}            (beat 02)
 *        public/media/hero/chapter-intelligence.{avif,webp}      (beat 03)
 *      …each with a `-portrait` sibling; see PORTRAIT WINDOWS below.
 *
 *      Landscape encodes stay at NATIVE width (1915/1844px) on purpose: the
 *      frames are 21:9 rendered with `cover`, so even a portrait phone
 *      resolves the cover scale off the plate's HEIGHT, and a "small screens
 *      get a small image" variant would be upscaled ~2.7× there.
 *
 *   §1b PORTRAIT WINDOWS — the fix for what the landscape plates do to a
 *      phone. `cover` on a 390×844 viewport fits the 821px-tall plate
 *      vertically and shows only 390/(844/821) = 379 source px of width —
 *      under the rig's 1.14 rest overscan, 332px, i.e. 17% of a 21:9
 *      photograph. On the day plate that 17% is a road and a treeline: the
 *      stadium is cut in half and the pool is off-frame entirely, so the
 *      "one operating picture" proposition dies on the majority of traffic.
 *
 *      A narrower FILE cannot fix sharpness (the browser was already showing
 *      ~332 source pixels across 390 CSS px either way) — what it fixes is
 *      WHICH 332 pixels, and what they cost. Each plate therefore gets one
 *      3:4 window (`{ aspect, centerX }` on the entry), cut at native
 *      resolution — never upscaled, never resampled — around the subject
 *      that actually carries that frame's argument. `home.css` selects it at
 *      `@media (max-aspect-ratio: 3 / 4)`, which is exactly the range where
 *      a 3:4 file is the better source: at narrower ratios the browser crops
 *      its width (as it would the landscape plate, only from a better
 *      centre), and at 3:4 itself it fits edge to edge with nothing wasted.
 *      Past 3:4 the window would start losing its own top and bottom, so the
 *      landscape plate takes over. The centres are recorded per entry.
 *
 *      Byte side effect: the window is ~33% of the plate's pixels, so a phone
 *      transfers roughly a third of what it did (night 148 → 50 kB).
 *
 *   §2 Sub-page photograph masters — one WebP per slot, the input
 *      `next/image` optimises from:
 *        public/media/company/ops-room.webp
 *        public/media/solutions/academies-dawn.webp
 *        public/media/solutions/venues-courts.webp
 *        public/media/solutions/clubs-sideline.webp
 *        public/media/solutions/multisport-masterplan.webp
 *        public/media/pricing/city-hubs.webp
 *        public/media/platform/operations-desk.webp
 *
 * CHAPTER STILLS — the three frames catalog §1 mapped to P5/P6/P7 and the
 * previous pass declined to copy ("the hero rig has no code path that would
 * display them"). The rig now has one: each corner chapter crossfades to its
 * OWN establishing photograph at the top of its beat, so 01/02/03 are three
 * different PLACES rather than three crops of one aerial. They are mounted
 * progressively as the flight approaches each beat and only in dark theme
 * (the delivered chapter set is entirely night), so none of these bytes are
 * spent by a reader who does not scroll — see `HeroChapterPlate.tsx`.
 *
 * They encode at a lower AVIF quality than the base plates ({@link
 * CHAPTER_AVIF}) because the camera treats them differently: a base plate is
 * pushed to ×2.21 of its own pixels at the flight's peak, a chapter still
 * only to ×1.20 of a gentle Ken-Burns move, under the same grade and grain.
 * A/B'd against the source on a 2× blow-up of the padel-court markings and
 * clubhouse glazing — the finest detail in the set — q52 holds where q46
 * smears; q58 buys nothing visible for ~25% more bytes.
 *
 * STILL NOT COPIED: everything under `assets/unused/`. Nothing consumes it;
 * each filename carries its own reason (the four `-white-walkway` night
 * alternates per the deviation above, the `-DEFECTIVE-tilt-shift-red-fringe`
 * day midground per catalog §1, and the two peopled `platform-desk-` frames,
 * which lost to the empty room because a legible spreadsheet on a screen,
 * on a page headlined "every module resolves into one dashboard", reads as a
 * claim about our software that our software has not earned).
 *
 * USAGE
 *   npm run media:build
 *
 * Add a slot by appending to {@link HERO_PLATES} or {@link PHOTO_MASTERS};
 * the owner's round-2 files (day midground, day foreground, day finale,
 * the dedicated multi-sport night hero) land as new entries here plus their
 * consumer, never as a hand-run one-off conversion.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The hero's own source photography — night film, day film, chapter
 *  subjects. Read-only. */
const HERO_SRC = path.join(ROOT, "assets", "hero");

/** One framed photograph per page slot. Read-only. */
const PAGES_SRC = path.join(ROOT, "assets", "pages");

/** Output directory for the hero's generated encodes. */
const HERO_DIR = path.join(ROOT, "public", "media", "hero");

/**
 * AVIF encoder settings. `effort: 6` is the quality/build-time knee — the
 * default 4 leaves visible blocking in the plates' dark sky gradients, and 9
 * costs minutes per file for a fraction of a percent. `chromaSubsampling`
 * stays at the 4:4:4 default: these frames carry saturated turquoise pool
 * and lime walkway detail at small pixel scales, exactly what 4:2:0 smears.
 */
const AVIF = { quality: 58, effort: 6 };

/**
 * AVIF settings for the three chapter stills. Lower than {@link AVIF}
 * because the camera asks less of them: the base plate is pushed to ×2.21 of
 * its own pixels at the flight's peak keyframe, a chapter still only to
 * ×1.20 by its own push. A/B'd against the source at 2× on the padel-court
 * line markings and the clubhouse glazing — see the file header.
 */
const CHAPTER_AVIF = { quality: 52, effort: 6 };

/** WebP fallback settings — only reached by browsers without AVIF. */
const WEBP = { quality: 82, effort: 6 };

/** Aspect ratio of the portrait windows (§1b), as width ÷ height. Must stay
 *  in step with the `@media (max-aspect-ratio: 3 / 4)` query in home.css
 *  that selects them: the window is the better source exactly up to its own
 *  ratio, and past it would begin losing its own top and bottom. */
const PORTRAIT_ASPECT = 3 / 4;

/** Master encode for the `next/image` inputs (§2): high enough that the
 *  optimiser's own AVIF pass is the only visible generation loss. */
const MASTER_WEBP = { quality: 90, effort: 6 };

/**
 * §1 — hero plates. `out` is the basename under `public/media/hero/`; an
 * `.avif` and a `.webp` are written for each, plus an `<out>-portrait` pair
 * when the entry declares a `portrait` window (§1b).
 *
 * `portrait.centerX` is the horizontal centre of that window as a fraction of
 * the source width; `portrait.trimTop` discards that fraction of the source's
 * height off the top before the window is cut. Both were chosen by rendering
 * the phone's actual rest frame (`390 / (844 / height) / 1.14` source px wide)
 * at several candidate values and looking at them; the note on each entry says
 * what the winning frame contains.
 *
 * `trimTop` earns its place on the two aerials because on a portrait viewport
 * the window's HEIGHT sets the cover scale: dropping a band of empty sky is
 * therefore also a zoom, and the stadium, courts and pool all arrive
 * correspondingly larger. It is only ever applied where the discarded band is
 * genuinely empty — the two ground-level chapter stills keep their full height
 * because their upper frame carries the stand, the floodlights and (on beat
 * 03) the coach's head and breath.
 */
const HERO_PLATES = [
  {
    /** Night film, both the static frame and the armed flight's base layer.
     *  See the NIGHT SET note for why this frame and not a delivered one. */
    source: path.join(HERO_SRC, "night-background.png"),
    out: "plate-background",
    /** 0.58 — the stadium bowl (pitch and running track legible) stacked
     *  directly over the four lit padel courts, road at the bottom edge.
     *  Two bookable surface types in one column, which is the closest a
     *  17%-wide slice of this frame gets to the whole proposition. The
     *  default centre (0.50) lands on the walkway and the courts with the
     *  stadium cut at the right edge and the pool out of frame.
     *  trimTop 0.10 drops most of the sky above the city-lights band — the
     *  band itself survives as a thin strip, which is what keeps the campus
     *  reading as a real place in a real city rather than a rendering. */
    portrait: { centerX: 0.58, trimTop: 0.1 },
  },
  {
    /** Day film (light theme). `Golden-Hour Aerial Sports Complex` won the
     *  P14 slot over `Aerial Sports Complex Masterplan` in catalog §1. */
    source: path.join(HERO_SRC, "day-background.png"),
    out: "plate-background-day",
    /** 0.56 — the whole stadium (both ends inside the frame) over the full
     *  eight-court grid and the clubhouse block. The default centre is the
     *  frame this task exists to kill: a road, a treeline, and half a
     *  stadium. trimTop 0.12 — slightly more than the night plate's, because
     *  this frame's upper band is featureless morning mist rather than a
     *  skyline. The stadium becomes the dominant object above the headline
     *  instead of a small shape floating in haze. */
    portrait: { centerX: 0.56, trimTop: 0.12 },
  },
  {
    /** Beat 01 CLUBS — `Empty Stadium Under Floodlights` (catalog P5).
     *  Ground level: dugout benches, folded tactics board, wet reflective
     *  surfaces, the main stand dark behind a floodlit pitch. */
    source: path.join(HERO_SRC, "chapter-01-clubs.png"),
    out: "chapter-clubs",
    avif: CHAPTER_AVIF,
    /** 0.34 — the dugout shelter running across the lower frame with the
     *  lit pitch and the goal above it. The club's own building, which is
     *  what beat 01 says. */
    portrait: { centerX: 0.34 },
  },
  {
    /** Beat 02 VENUES — `Modern Sports Complex at Night` (catalog P6).
     *  Elevated oblique: the padel/tennis grid reading as a booking board,
     *  the warm-lit glass clubhouse behind it. */
    source: path.join(HERO_SRC, "chapter-02-venues.png"),
    out: "chapter-venues",
    avif: CHAPTER_AVIF,
    /** 0.38 — two full lit courts in the foreground with the glazed
     *  clubhouse directly above them: the surface and the building that
     *  books it, in one column. */
    portrait: { centerX: 0.38 },
  },
  {
    /** Beat 03 INTELLIGENCE — `Night Soccer Training Under Floodlights`
     *  (catalog P7). The coach seen from behind (breath fog visible, no
     *  face) watching a small group work through cones and ladders. */
    source: path.join(HERO_SRC, "chapter-03-intelligence.png"),
    out: "chapter-intelligence",
    avif: CHAPTER_AVIF,
    /** 0.36 — the coach silhouette on the left edge, two players mid-drill,
     *  the ladder and cone lines running out of the bottom of the frame.
     *  Tighter centres lose the drill; wider ones lose the coach, and the
     *  coach is the one who is reading something. */
    portrait: { centerX: 0.36 },
  },
];

/**
 * §2 — sub-page photograph masters. Two optional re-framings, both of which
 * only ever REMOVE pixels: `crop` is a `sharp.resize`-compatible target with
 * a named anchor (used where the source is too tall and the subject sits at
 * one end), and `window` is the same `{ aspect, centerX }` cut §1b uses
 * (used where the source is too WIDE and the subject sits at a measured
 * horizontal position).
 */
const PHOTO_MASTERS = [
  {
    /** /company — the night operations room overlooking the campus. Native
     *  1122×1402 is already the 4:5 the portrait slot wants. */
    source: path.join(PAGES_SRC, "company-ops-room.png"),
    out: path.join("company", "ops-room"),
  },
  {
    /** /solutions/sports-academies — misty dawn training ground. 4:5 native. */
    source: path.join(PAGES_SRC, "solution-academies-dawn.png"),
    out: path.join("solutions", "academies-dawn"),
  },
  {
    /** /solutions/sports-venues — the near-nadir padel court grid, one court
     *  lit. 4:5 native. */
    source: path.join(PAGES_SRC, "solution-venues-courts.png"),
    out: path.join("solutions", "venues-courts"),
  },
  {
    /** /solutions/sports-clubs — rainy night sideline. Native 971×1619 is a
     *  much taller 3:5; cropped to the same 4:5 the other three portraits
     *  use so the framed plates read as one set across the sub-pages. The
     *  crop is anchored to the TOP: the frame's subject stack (dugout roof,
     *  benches, tactics board, floodlight, far stand) all lives in the upper
     *  three quarters, and the bottom quarter is wet foreground tarmac. */
    source: path.join(PAGES_SRC, "solution-clubs-sideline.png"),
    out: path.join("solutions", "clubs-sideline"),
    crop: { width: 971, height: 1214, position: "top" },
  },
  {
    /** /solutions/multi-sports-organizations — INTERIM. P12 (a night 21:9
     *  "many disciplines, one estate") was never delivered, so that page
     *  shipped as the only solution hero without a photograph.
     *  `Aerial Sports Complex Masterplan` is catalog §1's one unassigned
     *  file, rejected for P14 because it is a different, larger complex at a
     *  steeper angle than the night establishing shot — which is precisely
     *  what makes it right HERE: many disciplines, one estate is its literal
     *  subject. It is day-graded where the set is night, and the frame is
     *  what absorbs that (`PlatePhoto`'s whole reason to exist is making one
     *  photograph read as a deliberate print in a room it does not match).
     *  Swap for the owner's dedicated night frame when it lands; nothing
     *  else changes.
     *
     *  Windowed to the same 4:5 the other three prints use so the four
     *  solution pages still read as one set. centerX 0.45 keeps the 50m
     *  pool, a full football pitch, the stadium and the eight-court tennis
     *  block inside one frame — four disciplines, which is the page's own
     *  argument. Centres further right trade the aquatics for parking. */
    source: path.join(PAGES_SRC, "solution-multisport-masterplan.png"),
    out: path.join("solutions", "multisport-masterplan"),
    window: { aspect: 4 / 5, centerX: 0.45 },
  },
  {
    /** /pricing — four lit facility islands across a dark city. Stays at its
     *  native 21:9: the whole point of the frame is the four separate hubs,
     *  and any portrait crop throws two of them away. */
    source: path.join(PAGES_SRC, "pricing-city-hubs.png"),
    out: path.join("pricing", "city-hubs"),
  },
  {
    /** /platform — the operations counter a minute after the last person left:
     *  dark monitors, a lanyard and a bottle on the stone, one warm overhead
     *  pool of light, and the floodlit campus still running through the glass.
     *
     *  This is the page's only photograph and it is deliberately NOT a
     *  dashboard. `/platform` is headlined "every module resolves into one
     *  dashboard", and a generated screenshot under that sentence is
     *  fabricated product evidence — a reader would reasonably take it as what
     *  our software looks like. The two delivered alternates that DO show a
     *  legible screen are parked in `assets/unused/` for exactly that reason.
     *  An empty operations room makes the same argument (someone runs this
     *  place, and they close the day here) and claims nothing.
     *
     *  Stays at its native 21:9: it is a wide room shot whose subject is the
     *  length of the desk against the window, and it renders as a framed
     *  print inside a section rather than a full-bleed plate, so the phone
     *  gets a legible letterbox rather than 17% of a panorama. */
    source: path.join(PAGES_SRC, "platform-operations-desk.png"),
    out: path.join("platform", "operations-desk"),
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
 * Computes a window of `aspect` centred horizontally on `centerX`, optionally
 * dropping `trimTop` of the source's height off the top first, clamped so it
 * never runs off either edge. Pure pixel selection — the result is always a
 * sub-rectangle of the original, so nothing is ever resampled or upscaled.
 *
 * `trimTop` is a zoom as much as a crop: the window's height sets the cover
 * scale on a portrait viewport, so removing rows of empty sky makes every
 * remaining subject correspondingly larger in the delivered frame.
 *
 * @param meta - `sharp` metadata for the source (needs `width`/`height`).
 * @param aspect - Target ratio as width ÷ height.
 * @param centerX - Desired horizontal centre, as a fraction of source width.
 * @param trimTop - Fraction of the source height to discard from the top.
 * @returns A `sharp.extract`-shaped rectangle.
 */
function windowRect(meta, aspect, centerX, trimTop = 0) {
  const top = Math.round(meta.height * trimTop);
  const height = meta.height - top;
  const width = Math.min(meta.width, Math.round(height * aspect));
  const left = Math.max(0, Math.min(meta.width - width, Math.round(meta.width * centerX - width / 2)));
  return { left, top, width, height };
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
    const avif = plate.avif ?? AVIF;
    console.log(`- ${path.basename(plate.source)}  ${meta.width}×${meta.height}`);
    await emit(path.join(HERO_DIR, `${plate.out}.avif`), await sharp(input).avif(avif).toBuffer());
    await emit(path.join(HERO_DIR, `${plate.out}.webp`), await sharp(input).webp(WEBP).toBuffer());

    if (!plate.portrait) continue;
    const rect = windowRect(meta, PORTRAIT_ASPECT, plate.portrait.centerX, plate.portrait.trimTop);
    const center = ((rect.left + rect.width / 2) / meta.width).toFixed(3);
    console.log(
      `  portrait window  ${rect.width}×${rect.height} @ ${rect.left},${rect.top} (centre ${center})`,
    );
    await emit(
      path.join(HERO_DIR, `${plate.out}-portrait.avif`),
      await sharp(input).extract(rect).avif(avif).toBuffer(),
    );
    await emit(
      path.join(HERO_DIR, `${plate.out}-portrait.webp`),
      await sharp(input).extract(rect).webp(WEBP).toBuffer(),
    );
  }

  console.log("\n§2 sub-page photograph masters (next/image inputs, WebP)");
  for (const photo of PHOTO_MASTERS) {
    const input = await readFile(photo.source);
    const meta = await sharp(input).metadata();
    const pipeline = sharp(input);
    let size = `${meta.width}×${meta.height}`;
    if (photo.crop) {
      pipeline.resize({
        width: photo.crop.width,
        height: photo.crop.height,
        fit: "cover",
        position: photo.crop.position,
      });
      size = `${photo.crop.width}×${photo.crop.height} (cropped ${photo.crop.position})`;
    } else if (photo.window) {
      const rect = windowRect(meta, photo.window.aspect, photo.window.centerX);
      pipeline.extract(rect);
      size = `${rect.width}×${rect.height} (window @ x=${rect.left})`;
    }
    console.log(`- ${path.basename(photo.source)}  ${meta.width}×${meta.height} → ${size}`);
    await emit(path.join(ROOT, "public", "media", `${photo.out}.webp`), await pipeline.webp(MASTER_WEBP).toBuffer());
  }
}

await main();
