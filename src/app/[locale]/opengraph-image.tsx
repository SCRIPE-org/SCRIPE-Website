/**
 * Locale-aware OpenGraph image for the `[locale]` route subtree.
 *
 * One image per locale (`en`/`ar`), generated at build time via
 * `generateStaticParams` below (the `[locale]` segment is already fully
 * static — `dynamicParams = false` in `src/app/[locale]/layout.tsx` — this
 * file mirrors that so both locale images prerender rather than falling
 * back to per-request generation). This is a site-wide image, not a
 * per-page one: individual page tasks may add their own nested
 * `opengraph-image.tsx` later if a page needs a bespoke image, but none do
 * yet, so every page under a locale shares this file's output.
 *
 * Font note: Satori (the renderer behind `next/og`'s `ImageResponse`) can
 * only parse TrueType/OpenType-container fonts (magic bytes `\x00\x01\x00\x00`,
 * `"OTTO"`, or `"true"`) — not WOFF/WOFF2. Every font asset this project
 * ships (`src/fonts/*.woff2`) is a variable WOFF2, so {@link loadArchivoFont}
 * always returns `null` today and every render below falls back to Satori's
 * bundled default font. Verified locally against next@16.3.1's bundled
 * `@vercel/og`: handing the raw `Archivo-var.woff2` buffer to `ImageResponse`
 * throws `Unsupported OpenType signature wOF2`. Signature-checking (rather
 * than hardcoding "always skip") means this starts working again on its own
 * if a TTF/OTF Archivo asset is ever added, with no changes needed here.
 *
 * A second, unrelated Satori quirk to preserve if this file is edited: a
 * style object's `fontFamily` key must be entirely absent when there is no
 * custom font, not present with value `undefined` — Satori's font-family
 * parser unconditionally calls `.split(",")` on it, so an explicit
 * `fontFamily: undefined` throws `Cannot read properties of undefined
 * (reading 'split')` at prerender time (reproduced locally; only surfaces
 * under `next build`, not in ad-hoc `ImageResponse` calls outside the
 * framework). That is why {@link fontFamilyStyle} conditionally spreads the
 * key in rather than assigning it a possibly-`undefined` value directly.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

/** Alt text for the generated image. */
export const alt = "SCRIPE — Sports Operations OS";
/** Pixel dimensions Next.js renders this route at and links in `<meta>` tags. */
export const size = { width: 1200, height: 630 };
/** MIME type of the generated image. */
export const contentType = "image/png";

const OBSIDIAN = "#0B0B0E";
const SIGNAL_LIME = "#C0FF00";
const NEAR_WHITE = "#F4F6F0";

/** Per-locale OG image copy. */
interface OgLocaleContent {
  /** Tagline rendered under the "SCRIPE" wordmark. */
  tagline: string;
  /** Whether the layout mirrors for a right-to-left reading locale. */
  isRtl: boolean;
}

/**
 * Per-locale content for the OG image.
 *
 * The `ar` entry deliberately does NOT contain the real Arabic tagline
 * ("نظام تشغيل العمليات الرياضية"). Verified locally against next@16.3.1's
 * bundled `@vercel/og`: rendering Arabic-script text through `ImageResponse`
 * throws `lookupType: 5 - substFormat: 3 is not yet supported` from Satori's
 * internal Arabic-shaping module. This was reproduced with the default
 * bundled font (Satori has no system-font fallback — it can only shape text
 * with whichever font is loaded into it) and is NOT reliably avoidable by
 * font choice: the project's own Arabic source fonts
 * (`src/fonts/NotoKufiArabic-var.woff2`, `NotoSansArabic-var.woff2`) are
 * WOFF2 (unparseable, same as Archivo above), and the only alternative
 * Arabic assets in the repo — the variable TTFs under
 * `backup/_ds/.../assets/fonts/` — fail to parse for an unrelated reason
 * (a crash in Satori's `fvar` variable-axis table parser). The failure was
 * also observed to be non-deterministic across calls within one process
 * (identical input sometimes throws, sometimes doesn't, depending on prior
 * renders in the same runtime) — unacceptable for a route that must not
 * intermittently 500 in production.
 *
 * TODO(task-12): once a static (non-variable) Arabic TTF/OTF asset is added
 * to the repo AND Satori's Arabic shaping is confirmed stable against it,
 * restore the real Arabic tagline here and drop this comment. Flagged for
 * Task 26 visual QA in the sequencing brief — the `ar` image today is a
 * mirrored layout with an English-language tagline, not a translated one.
 */
const CONTENT: Record<"en" | "ar", OgLocaleContent> = {
  en: { tagline: "Sports Operations OS", isRtl: false },
  ar: { tagline: "Sports Operations OS", isRtl: true },
};

/**
 * Loads the Archivo variable font for Satori, if its container format is
 * one Satori can actually parse.
 *
 * @returns The font's raw bytes when the file's magic bytes match a
 *   TrueType/OpenType container, otherwise `null`. Callers must omit the
 *   `fonts` entry when this returns `null` — Satori's bundled default font
 *   still renders Latin text correctly without it.
 */
async function loadArchivoFont(): Promise<Buffer | null> {
  try {
    const buffer = await readFile(join(process.cwd(), "src/fonts/Archivo-var.woff2"));
    const signature = buffer.subarray(0, 4).toString("ascii");
    const isTrueTypeSfnt = buffer.length >= 4 && buffer.readUInt32BE(0) === 0x00010000;
    if (signature === "OTTO" || signature === "true" || isTrueTypeSfnt) {
      return buffer;
    }
    return null;
  } catch {
    return null;
  }
}

/** Prerenders both locale images at build time, matching the parent layout. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Renders the OG image for one locale: obsidian ground, a Signal Lime
 * accent bar, and the "SCRIPE" wordmark with its tagline underneath. The
 * `ar` layout mirrors (accent bar and text align to the right) without
 * containing literal Arabic glyphs — see {@link CONTENT}'s doc comment.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = locale === "ar" ? CONTENT.ar : CONTENT.en;
  const archivoFont = await loadArchivoFont();
  // See the file header: this key must be omitted, not set to `undefined`.
  const fontFamilyStyle = archivoFont ? { fontFamily: "Archivo" } : {};

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: OBSIDIAN,
          ...fontFamilyStyle,
        }}
      >
        <div style={{ display: "flex", flexDirection: content.isRtl ? "row-reverse" : "row" }}>
          <div style={{ width: 72, height: 14, background: SIGNAL_LIME }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: content.isRtl ? "flex-end" : "flex-start",
          }}
        >
          <div style={{ fontSize: 148, fontWeight: 800, color: NEAR_WHITE, letterSpacing: -4 }}>
            SCRIPE
          </div>
          <div style={{ fontSize: 40, color: SIGNAL_LIME, marginTop: 20 }}>{content.tagline}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: archivoFont
        ? [{ name: "Archivo", data: archivoFont, style: "normal", weight: 800 }]
        : undefined,
    },
  );
}
