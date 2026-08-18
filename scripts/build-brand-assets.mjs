#!/usr/bin/env node
/**
 * Brand asset pipeline (Task E6 — 3D Brand System Everywhere).
 *
 * Regenerates every raster brand derivative the site actually loads, from
 * the owner's real 3D brand originals. Rerunnable and deterministic: running
 * it again always reproduces byte-for-byte identical output for the same
 * inputs, so it is safe to re-run after a source asset is replaced.
 *
 * ┌─ WHY THIS SCRIPT EXISTS ────────────────────────────────────────────────┐
 * The owner supplies finished 3D renders (glossy, ~1.2–2.2MB each) as the
 * single source of truth for the SCRIPE mark. Pages must never load those
 * originals directly — they are far too large for a nav-bar icon or a
 * favicon, and shipping the same multi-megabyte PNG to every route would
 * blow the performance budget for no visual gain (a 16px favicon does not
 * need 1254×1254 of source detail). This script is the ONE place that
 * turns the originals into the small, purpose-fit derivatives every real
 * surface (nav, footer, favicon, apple-touch-icon, PWA manifest, JSON-LD
 * Organization.logo, OpenGraph card) actually references. No raster art is
 * drawn or generated here — every pixel already exists in the owner's
 * source files; this script only copies, trims transparent margin, resizes,
 * and (for favicon.ico) repackages existing PNG bytes into an ICO
 * container. That is the boundary the project's "never generate raster
 * art" rule draws around asset tooling.
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * SOURCE (read-only — this script only ever reads from here, never writes):
 *   D:\01_PROJECTS\SCRIPE\SCRIPE_RELAY_VNEXT_CLAUDE_HANDOFF_SOURCE_FIDELITY\
 *     02_BRAND_ASSETS\00_SOURCE_ORIGINALS_DO_NOT_EDIT\
 *   Specifically:
 *     - SCRIPE_3D_MARK_TRANSPARENT.png   — the glossy lime/steel/graphite
 *       "S" mark alone, alpha background. Source for every surface that
 *       needs the mark WITHOUT a background: the nav/footer lockup, the
 *       favicon set, and the JSON-LD Organization logo.
 *     - SCRIPE_3D_APP_ICON_GLOSSY.png — the same mark already composed
 *       onto its own dark rounded-square app-icon tile with a lime glow
 *       edge. Source for every surface that wants a finished, self-
 *       contained icon tile: apple-touch-icon and the PWA manifest icons.
 *
 * OUTPUTS:
 *   1. Verbatim archival copies (untouched pixels, just copied + renamed)
 *      under `assets/brand/` — mirrors this repo's existing convention of
 *      keeping raw/source material in `assets/` and only build output in
 *      `public/` (see `assets/hero-plates/` → `public/media/hero/`). These
 *      are NOT under `public/`, so they cannot be accidentally loaded by a
 *      page and do not bloat the deployed static bundle; they exist purely
 *      so a future derivative can be regenerated without going back to the
 *      read-only source folder.
 *   2. Small, purpose-fit derivatives under `public/brand/` — the only
 *      brand raster files any page/metadata file may reference.
 *   3. `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`
 *      — Next.js App Router's file-convention metadata icons, which Next
 *      auto-wires into `<head>` with no manual `<link>` tags needed (same
 *      convention the pre-existing `src/app/favicon.ico` already used).
 *
 * USAGE:
 *   node scripts/build-brand-assets.mjs
 *   (or: npm run brand:build)
 *
 *   Re-run any time a source original is replaced. The script always
 *   re-reads from the read-only source folder and overwrites its outputs —
 *   there is no incremental/partial mode to reason about.
 *
 * DERIVATION NOTES:
 *   - The mark's opaque content does not fill its 1254×1254 canvas — sharp's
 *     `.trim()` crops to the mark's true bounds (measured: 1197×947, a
 *     ~1.264:1 aspect ratio) before every mark-only derivative is cut, so
 *     the nav/footer lockup and favicon sit tight against the mark the way
 *     the previous inline-SVG BrandMark did (its viewBox was hand-fit to
 *     its path bounds the same way). `BrandMark.tsx` hardcodes this same
 *     1197:947 ratio to size its wrapper without an extra image decode.
 *   - The app-icon source is trimmed differently: it is a deliberately
 *     square, edge-to-edge composition (dark tile + glow bleeding toward
 *     the border), so trimming would risk clipping the glow asymmetrically.
 *     Its derivatives resize the full 1254×1254 canvas untouched.
 *   - Favicon/JSON-LD-logo derivatives need a square frame, so they combine
 *     the trim with `fit: "contain"` on a transparent square canvas —
 *     centers the trimmed mark rather than distorting its aspect ratio.
 */
import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** Read-only owner source folder. This script must never write here. */
const SOURCE_DIR =
  "D:/01_PROJECTS/SCRIPE/SCRIPE_RELAY_VNEXT_CLAUDE_HANDOFF_SOURCE_FIDELITY/02_BRAND_ASSETS/00_SOURCE_ORIGINALS_DO_NOT_EDIT";

const SOURCE_MARK = join(SOURCE_DIR, "SCRIPE_3D_MARK_TRANSPARENT.png");
const SOURCE_APP_ICON = join(SOURCE_DIR, "SCRIPE_3D_APP_ICON_GLOSSY.png");

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Ensures a directory exists (recursive mkdir is a no-op if it already does). */
async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

/**
 * Packs one or more same-format PNG buffers into a Windows `.ico` container.
 *
 * Sharp has no ICO encoder (libvips doesn't speak the format), so this is a
 * small hand-rolled writer for the well-documented ICONDIR/ICONDIRENTRY
 * layout. Modern ICO readers (every current browser) accept PNG-compressed
 * frames directly — this is NOT a legacy BMP/DIB packer, it just wraps the
 * already-generated PNG bytes with the container's directory header. Purely
 * mechanical container packaging, not image processing.
 *
 * @param {{ size: number, png: Buffer }[]} frames - Each frame's square side
 *   length and its already-encoded PNG bytes.
 * @returns {Buffer} A complete `.ico` file.
 */
function packIco(frames) {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(frames.length, 4); // image count

  const entries = Buffer.alloc(ENTRY_SIZE * frames.length);
  let offset = HEADER_SIZE + ENTRY_SIZE * frames.length;
  const imageBuffers = [];

  frames.forEach((frame, i) => {
    const entryOffset = i * ENTRY_SIZE;
    // Width/height byte fields use 0 to mean "256" — none of our sizes hit
    // that, so a direct write is always correct here.
    entries.writeUInt8(frame.size, entryOffset + 0); // width
    entries.writeUInt8(frame.size, entryOffset + 1); // height
    entries.writeUInt8(0, entryOffset + 2); // color palette count (0 = no palette / true color)
    entries.writeUInt8(0, entryOffset + 3); // reserved
    entries.writeUInt16LE(1, entryOffset + 4); // color planes
    entries.writeUInt16LE(32, entryOffset + 6); // bits per pixel
    entries.writeUInt32LE(frame.png.length, entryOffset + 8); // bytes in resource
    entries.writeUInt32LE(offset, entryOffset + 12); // offset from file start
    offset += frame.png.length;
    imageBuffers.push(frame.png);
  });

  return Buffer.concat([header, entries, ...imageBuffers]);
}

/** Trims transparent margin off the mark source, returning a sharp pipeline. */
function trimmedMark() {
  return sharp(SOURCE_MARK).trim();
}

async function main() {
  console.log("SCRIPE brand asset pipeline — reading from:", SOURCE_DIR);

  // ── 1. Archival copies (untouched pixels) ────────────────────────────
  const archiveDir = join(ROOT, "assets", "brand");
  await ensureDir(archiveDir);
  await copyFile(SOURCE_MARK, join(archiveDir, "scripe-mark-3d-original.png"));
  await copyFile(SOURCE_APP_ICON, join(archiveDir, "scripe-app-icon-3d-original.png"));
  console.log("✓ archived verbatim originals to assets/brand/");

  // ── 2. Nav/footer mark derivatives (trimmed, aspect-preserving) ──────
  // Widths chosen to cover 2x/3x pixel density for the ~26-32px logical
  // sizes NavBar/Footer render the mark at (see BrandMark.tsx); 128 is the
  // canonical `next/image` `src` — the largest small derivative, letting
  // Next's own image optimizer downscale from a already-small source
  // instead of the 1.4MB original.
  const markDir = join(ROOT, "public", "brand", "mark");
  await ensureDir(markDir);
  const navWidths = [64, 96, 128];
  for (const width of navWidths) {
    const outPath = join(markDir, `scripe-mark-${width}.png`);
    const info = await trimmedMark().resize({ width }).png({ compressionLevel: 9 }).toFile(outPath);
    console.log(`✓ public/brand/mark/scripe-mark-${width}.png (${info.width}×${info.height})`);
  }

  // JSON-LD Organization.logo: square, transparent, comfortably above
  // Google's 112px structured-data minimum.
  const logoInfo = await trimmedMark()
    .resize(512, 512, { fit: "contain", background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toFile(join(markDir, "scripe-logo-512.png"));
  console.log(`✓ public/brand/mark/scripe-logo-512.png (${logoInfo.width}×${logoInfo.height})`);

  // OpenGraph card embed: small enough that embedding it in the ImageResponse
  // keeps the whole OG bundle well under the 500KB budget.
  const ogInfo = await trimmedMark()
    .resize({ width: 220 })
    .png({ compressionLevel: 9 })
    .toFile(join(markDir, "scripe-mark-og.png"));
  console.log(`✓ public/brand/mark/scripe-mark-og.png (${ogInfo.width}×${ogInfo.height})`);

  // ── 3. Favicon set (square, transparent, trimmed mark) ───────────────
  const faviconDir = join(ROOT, "public", "brand", "favicon");
  await ensureDir(faviconDir);
  const faviconSizes = [16, 32, 48];
  const faviconBuffers = [];
  for (const size of faviconSizes) {
    const buffer = await trimmedMark()
      .resize(size, size, { fit: "contain", background: TRANSPARENT })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(join(faviconDir, `scripe-favicon-${size}.png`), buffer);
    faviconBuffers.push({ size, png: buffer });
    console.log(`✓ public/brand/favicon/scripe-favicon-${size}.png`);
  }

  // Next.js App Router file-convention icons — auto-wired into <head>,
  // same pattern the pre-existing src/app/favicon.ico already used.
  const appDir = join(ROOT, "src", "app");
  await writeFile(join(appDir, "favicon.ico"), packIco(faviconBuffers));
  console.log("✓ src/app/favicon.ico (16/32/48 multi-res, PNG-in-ICO)");

  const icon48 = faviconBuffers.find((f) => f.size === 48).png;
  await writeFile(join(appDir, "icon.png"), icon48);
  console.log("✓ src/app/icon.png (48×48, modern <link rel=icon>)");

  // ── 4. App icon tile derivatives (full square, untouched composition) ─
  const appleIconInfo = await sharp(SOURCE_APP_ICON)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(join(appDir, "apple-icon.png"));
  console.log(`✓ src/app/apple-icon.png (${appleIconInfo.width}×${appleIconInfo.height})`);

  const iconsDir = join(ROOT, "public", "brand", "icons");
  await ensureDir(iconsDir);
  for (const size of [192, 512]) {
    const info = await sharp(SOURCE_APP_ICON)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(iconsDir, `icon-${size}.png`));
    console.log(`✓ public/brand/icons/icon-${size}.png (${info.width}×${info.height})`);
  }

  console.log("\nDone. Re-run this script any time a source original is replaced.");
}

main().catch((error) => {
  console.error("Brand asset pipeline failed:", error);
  process.exitCode = 1;
});
