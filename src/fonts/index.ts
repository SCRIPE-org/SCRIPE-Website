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
 * 2. Every `.woff2` under this directory is subsetted (Latin faces to
 *    Latin + Latin Extended + the punctuation/symbols actually used in
 *    `src/content`/`messages`; Arabic faces to the Arabic block(s) + Latin
 *    digits — Latin LETTERS embedded in Arabic copy, e.g. "SAR"/"CRM"/brand
 *    names, fall back to Archivo/Inter via the `--font-*-ar-base` stacks in
 *    `typography.css`, so they don't need to live in the Arabic font too).
 *    Variable axes (weight, and Archivo's width axis) are untouched —
 *    subsetting only drops unused GLYPHS, never variation range. Regenerate
 *    with (from a scratch directory, no project dependency added):
 *    `npm install subset-font` then a script calling
 *    `subsetFont(buffer, text, { targetFormat: "woff2" })` per face — see
 *    the Wave G Task G1 report for the exact character-range script used.
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
  display: "swap",
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
  display: "swap",
  // Never preload on English pages that don't use it at all — see the file
  // header. `display: "swap"` still keeps Arabic pages' text visible on the
  // `--font-*-ar-base` fallback (Archivo) while this loads.
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
