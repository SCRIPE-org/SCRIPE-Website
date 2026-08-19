/**
 * Self-hosted variable font declarations.
 *
 * Two fixes here from the audit:
 *
 * 1. `preload: false` on `notoKufi`/`notoSans`. `next/font/local` emits a
 *    `<link rel="preload">` for every `localFont()` call it sees executed
 *    while rendering a page — which is EVERY call in this module, since the
 *    root layout imports the module unconditionally and `fontClassesFor()`
 *    only controls which `.variable` CLASS NAMES end up on `<html>`, not
 *    which `localFont()` calls run. Before this fix, English-locale pages
 *    (which never reference `--font-noto-kufi`/`--font-noto-sans` in any
 *    matching CSS — see `fontClassesFor` below) still preloaded both Arabic
 *    fonts on every load: 100% wasted bytes on `en`. `preload: false` stops
 *    the eager `<link>`; the browser now only ever fetches these two when a
 *    page actually renders `:lang(ar)` content that needs them. Arabic
 *    pages stay covered either way: `display: "swap"` keeps their text
 *    visible on the Archivo/Inter fallback already listed in
 *    `typography.css`'s `--font-display-ar-base`/`--font-body-ar-base`
 *    stacks while the Arabic face itself finishes loading.
 * 2. `display: "optional"` on the two DISPLAY faces (`archivo`, `notoKufi`)
 *    — the Core Web Vitals fix, and the one deliberate design trade in this
 *    file. Measured mobile CLS on the home page at 390px was 0.1138 (en) /
 *    0.0592 (ar): a Core Web Vitals FAILURE, isolated by ablation to the
 *    font swap itself (blocking every `.woff2` dropped it to 0.0028, so it
 *    was never the GSAP flight). Both shifts came from ONE mechanism the
 *    `next/font` metric fallback cannot address: Archivo is used at the
 *    extremes of its WIDTH axis (`"wdth" 122` on the hero statement's second
 *    line, `"wdth" 80` on its first), and Noto Kufi's bold is far wider than
 *    any Latin fallback. `adjustFontFallback` matches x-height and vertical
 *    metrics; it cannot match ADVANCE WIDTH, and advance width is what
 *    decides line COUNT. Measured at 390px: the statement's second line runs
 *    1.25x wider in Archivo than in the generated fallback, so it broke to
 *    two lines the instant the font arrived, while the first line ran 0.83x
 *    and collapsed from two lines to one — the hero's vertically-centred
 *    column re-laid out under the reader mid-scroll.
 *
 *    `optional` removes the transition rather than trying to make the two
 *    states agree: the browser gets a ~100ms window (starting with the
 *    preload, which is why `preload` stays on for `archivo`) and either uses
 *    the real face from the FIRST paint or uses the fallback for that page
 *    load and never swaps. Either way nothing re-lays out, in either locale.
 *    The cost is real and is accepted knowingly: a cold visit on a genuinely
 *    slow link renders headings in the metric-adjusted fallback for that
 *    visit. Both faces are subsetted and preloaded specifically to keep that
 *    window narrow, and a repeat visit serves from cache well inside it.
 *
 *    The BODY faces (`inter`, `notoSans`) deliberately keep `swap`: running
 *    text in a fallback is a far larger legibility cost than a heading in
 *    one, their metric fallbacks are genuine metric matches (no width axis
 *    involved), and measurement attributed no shift to them.
 * 3. Every `.woff2` under this directory is subsetted (Latin faces to
 *    Latin + Latin Extended + the punctuation/symbols actually used in
 *    `src/content`/`messages`; Arabic faces to the Arabic block(s) + Latin
 *    digits — Latin LETTERS embedded in Arabic copy, e.g. "SAR"/"CRM"/brand
 *    names, fall back to Archivo/Inter via the `--font-*-ar-base` stacks in
 *    `typography.css`, so they don't need to live in the Arabic font too).
 *    Variable axes (weight, and Archivo's width axis) are untouched —
 *    subsetting only drops unused GLYPHS, never variation range. Regenerate
 *    with `npm run fonts:subset` (`scripts/subset-fonts.mjs` — documented,
 *    rerunnable, no project dependency added; that script's own header has
 *    the exact character-range method and the scratch-install recipe for
 *    its one build-time dependency).
 */
import localFont from "next/font/local";

export const archivo = localFont({
  src: [
    {
      path: "./Archivo-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  // Display face — see the file header, point 2. Never `swap`: the width-axis
  // instances this face is used at re-break every headline on arrival.
  display: "optional",
});

export const inter = localFont({
  src: [
    {
      path: "./Inter-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const notoKufi = localFont({
  src: [
    {
      path: "./NotoKufiArabic-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-noto-kufi",
  // Arabic display face — same reasoning as `archivo` (file header, point 2).
  // Its bold measured 1.55x the fallback's advance width at the hero
  // statement's size, which is the whole of the Arabic home page's 0.0592
  // CLS.
  display: "optional",
  // Never preload on English pages that don't use it at all — see the file
  // header. Arabic pages stay legible either way: `--font-display-ar-base`
  // falls through to Archivo and then the system stack, so text is visible
  // from first paint whether or not this face wins its `optional` window.
  preload: false,
});

export const notoSans = localFont({
  src: [
    {
      path: "./NotoSansArabic-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans",
  display: "swap",
  // See notoKufi above.
  preload: false,
});

export function fontClassesFor(locale: "en" | "ar"): string {
  if (locale === "ar") {
    return [archivo.variable, inter.variable, notoKufi.variable, notoSans.variable].join(" ");
  }
  return [archivo.variable, inter.variable].join(" ");
}
