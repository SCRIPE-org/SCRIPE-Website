/**
 * Self-hosted variable font declarations.
 *
 * FONT CHOICES — Latin: Archivo (display) + Inter (body). Arabic: Cairo
 * (display) + Tajawal (body). This pair replaced Noto Kufi Arabic/Noto Sans
 * Arabic (this task) — Cairo and Tajawal are not two independently-picked
 * faces, they're a designed companion pair: both commissioned from the same
 * Google Fonts Arabic-UI project (Mohamed Gaber), Cairo scoped for
 * headline/UI use and Tajawal for running text, sharing the same
 * geometric-humanist construction so the two roles read as one typeface
 * system rather than a display face bolted onto an unrelated body face.
 * Cairo also geometrically echoes Archivo's own construction, so the EN and
 * AR display faces feel like one brand rather than two independent choices.
 *
 * Two fixes here from the audit that predates the Cairo/Tajawal swap (still
 * load-bearing, so kept in force for the new faces too):
 *
 * 1. `preload: false` on `cairo`/`tajawal`. `next/font/local` emits a
 *    `<link rel="preload">` for every `localFont()` call it sees executed
 *    while rendering a page — which is EVERY call in this module, since the
 *    root layout imports the module unconditionally and `fontClassesFor()`
 *    only controls which `.variable` CLASS NAMES end up on `<html>`, not
 *    which `localFont()` calls run. Before this fix, English-locale pages
 *    (which never reference `--font-cairo`/`--font-tajawal` in any
 *    matching CSS — see `fontClassesFor` below) still preloaded both Arabic
 *    fonts on every load: 100% wasted bytes on `en`. `preload: false` stops
 *    the eager `<link>`; the browser now only ever fetches these two when a
 *    page actually renders `:lang(ar)` content that needs them. Arabic
 *    pages stay covered either way: `display: "swap"` keeps their text
 *    visible on the Archivo/Inter fallback already listed in
 *    `typography.css`'s `--font-display-ar-base`/`--font-body-ar-base`
 *    stacks while the Arabic face itself finishes loading.
 * 2. `display: "optional"` on the two DISPLAY faces (`archivo`, `cairo`) —
 *    the Core Web Vitals fix, and the one deliberate design trade in this
 *    file. The prior Arabic display face (Noto Kufi Arabic) measured a real
 *    mobile CLS regression at 390px, isolated by ablation to the font swap
 *    itself: Archivo/Kufi are both used at heavy/wide instances on the hero
 *    statement, and `next/font`'s `adjustFontFallback` metric matching
 *    cannot correct for ADVANCE WIDTH — it matches x-height and vertical
 *    metrics only — so a fallback-to-real-face swap on a wide instance can
 *    change line count and re-lay-out the page. `optional` removes the
 *    transition rather than trying to make the two states agree: the
 *    browser gets a short window (starting at the preload, which is why
 *    `preload` stays on for `archivo`) and either uses the real face from
 *    the FIRST paint or uses the fallback for that page load and never
 *    swaps. Cairo is also used at a heavy display weight on the same hero
 *    statement, so the same failure mode applies to it and `optional` is
 *    kept for the same reason. Re-run the mobile CLS measurement (Chrome
 *    DevTools Performance panel or a `PerformanceObserver` for
 *    `layout-shift` entries without `hadRecentInput`, on the `ar` home page
 *    at 390px) if Cairo's advance width at the hero's instances ever
 *    measures materially differently from Kufi's did — the mechanism this
 *    fix addresses is generic, but the exact regression number is
 *    face-specific and was not re-measured against Cairo's own metrics as
 *    part of this swap.
 *
 *    The cost is real and is accepted knowingly: a cold visit on a genuinely
 *    slow link renders headings in the metric-adjusted fallback for that
 *    visit. Both faces are subsetted to keep that window narrow, and a
 *    repeat visit serves from cache well inside it.
 *
 *    That cost is NOT symmetric between the locales, and the asymmetry is
 *    stated here rather than glossed: `archivo` is preloaded, so its
 *    `optional` window starts at HTML parse and it usually wins. `cairo`
 *    carries `preload: false` (point 1 — it must not cost English pages,
 *    which never reference it), so on an Arabic page its window starts only
 *    once the CSS has been parsed and the font is found to be needed. An
 *    Arabic reader on a cold, slow connection is therefore materially more
 *    likely to get the fallback for that visit than an English one. The
 *    alternative — preloading it — would put a wasted Arabic font download
 *    on every English page, which is a certain cost to every visitor in
 *    exchange for a probabilistic gain for some; the current split is the
 *    better trade, but it IS a trade, and Arabic is the side paying for it.
 *    Arabic text stays visible throughout either way: `--font-display-ar-base`
 *    falls through to Archivo and then to the system stack. Worth revisiting
 *    if Arabic ever gets its own entry point, where a locale-scoped preload
 *    becomes possible without taxing `en`.
 *
 *    The BODY faces (`inter`, `tajawal`) deliberately keep `swap`: running
 *    text in a fallback is a far larger legibility cost than a heading in
 *    one. `tajawal` additionally has no variable axis to mismatch — it
 *    ships as 7 discrete static weights (see point 3 below), so there is no
 *    width-axis-style CLS mechanism for it to trigger in the first place.
 * 3. Every `.woff2` under this directory is subsetted (Latin faces to
 *    Latin + Latin Extended + the punctuation/symbols actually used in
 *    `src/content`/`messages`; Arabic faces to the Arabic block(s) + Latin
 *    digits — Latin LETTERS embedded in Arabic copy, e.g. "SAR"/"CRM"/brand
 *    names, fall back to Archivo/Inter via the `--font-*-ar-base` stacks in
 *    `typography.css`, so they don't need to live in the Arabic font too).
 *    Variable axes (weight, and Archivo's width axis, and Cairo's own
 *    weight axis) are untouched — subsetting only drops unused GLYPHS,
 *    never variation range. Regenerate with `npm run fonts:subset`
 *    (`scripts/subset-fonts.mjs` — documented, rerunnable, no project
 *    dependency added; that script's own header has the exact
 *    character-range method and the scratch-install recipe for its one
 *    build-time dependency). Cairo's source is Google Fonts' own
 *    Arabic-unicode-range split of its variable instance (`wght` 200–1000).
 *    Tajawal has no variable instance on Google Fonts at all — its 7
 *    static weight files are each subsetted independently, same policy.
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

export const cairo = localFont({
  src: [
    {
      path: "./Cairo-var.woff2",
      weight: "200 1000",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  // Arabic display face — same reasoning as `archivo` (file header, point 2).
  display: "optional",
  // Never preload on English pages that don't use it at all — see the file
  // header. Arabic pages stay legible either way: `--font-display-ar-base`
  // falls through to Archivo and then the system stack, so text is visible
  // from first paint whether or not this face wins its `optional` window.
  preload: false,
});

export const tajawal = localFont({
  // No variable instance on Google Fonts — 7 discrete static weights, one
  // `src` entry each. `next/font/local` treats this as one logical family:
  // the browser resolves any requested `font-weight` to its nearest listed
  // instance via normal CSS font matching (there is no 600 instance; 500 or
  // 700 wins depending on the browser's matching algorithm).
  src: [
    { path: "./Tajawal-200.woff2", weight: "200", style: "normal" },
    { path: "./Tajawal-300.woff2", weight: "300", style: "normal" },
    { path: "./Tajawal-400.woff2", weight: "400", style: "normal" },
    { path: "./Tajawal-500.woff2", weight: "500", style: "normal" },
    { path: "./Tajawal-700.woff2", weight: "700", style: "normal" },
    { path: "./Tajawal-800.woff2", weight: "800", style: "normal" },
    { path: "./Tajawal-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-tajawal",
  display: "swap",
  // See cairo above.
  preload: false,
});

export function fontClassesFor(locale: "en" | "ar"): string {
  if (locale === "ar") {
    return [archivo.variable, inter.variable, cairo.variable, tajawal.variable].join(" ");
  }
  return [archivo.variable, inter.variable].join(" ");
}
