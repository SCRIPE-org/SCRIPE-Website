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
 * SOURCE — resolved at runtime, in priority order (see {@link resolveSource}),
 * from three possible locations. This script only ever READS from whichever
 * one wins; it never writes to any of them:
 *   1. `BRAND_SOURCE_DIR` env var, if set and it contains the two owner
 *      originals (under either naming convention below) — lets anyone point
 *      the script at a different copy of the handoff folder (a refreshed
 *      drop, a different machine, CI without the D:\ path mounted).
 *   2. The read-only external handoff folder, if it exists on disk:
 *        D:\01_PROJECTS\SCRIPE\SCRIPE_RELAY_VNEXT_CLAUDE_HANDOFF_SOURCE_FIDELITY\
 *          02_BRAND_ASSETS\00_SOURCE_ORIGINALS_DO_NOT_EDIT\
 *      — the normal case on a machine with that folder mounted.
 *   3. The in-repo archival copies under `assets/brand/` (this script's own
 *      output — see OUTPUTS §1 below) — makes the script actually
 *      rerunnable on a machine or CI box without access to the read-only
 *      handoff folder, regenerating byte-identical derivatives from the
 *      same pixels one layer removed.
 *   Each candidate is matched against BOTH filename conventions (the
 *   external handoff's `SCRIPE_3D_*` names and the archive's
 *   `scripe-*-original.png` names), since `BRAND_SOURCE_DIR` might point at
 *   either kind of folder:
 *     - `SCRIPE_3D_MARK_TRANSPARENT.png` / `scripe-mark-3d-original.png` —
 *       the glossy lime/steel/graphite "S" mark alone, alpha background.
 *       Source for every surface that needs the mark WITHOUT a background:
 *       the nav/footer lockup, the favicon set, and the JSON-LD
 *       Organization logo.
 *     - `SCRIPE_3D_APP_ICON_GLOSSY.png` / `scripe-app-icon-3d-original.png`
 *       — the same mark already composed onto its own dark rounded-square
 *       app-icon tile with a lime glow edge. Source for every surface that
 *       wants a finished, self-contained icon tile: apple-touch-icon and
 *       the PWA manifest icons.
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
 *   BRAND_SOURCE_DIR=/some/other/folder node scripts/build-brand-assets.mjs
 *
 *   Re-run any time a source original is replaced. The script always
 *   re-resolves its source (see above) and overwrites its outputs — there
 *   is no incremental/partial mode to reason about. When the resolved
 *   source turns out to already BE the in-repo archive (case 3 above), the
 *   archival-copy step is skipped rather than copying the file onto itself.
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
import { existsSync, realpathSync } from "node:fs";
import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** Read-only external owner handoff folder. This script must never write here. */
const EXTERNAL_HANDOFF_DIR =
  "D:/01_PROJECTS/SCRIPE/SCRIPE_RELAY_VNEXT_CLAUDE_HANDOFF_SOURCE_FIDELITY/02_BRAND_ASSETS/00_SOURCE_ORIGINALS_DO_NOT_EDIT";
/** In-repo archival copies — this script's own §1 output, and fallback §3 input. */
const ARCHIVE_DIR = join(ROOT, "assets", "brand");

const EXTERNAL_MARK_NAME = "SCRIPE_3D_MARK_TRANSPARENT.png";
const EXTERNAL_APP_ICON_NAME = "SCRIPE_3D_APP_ICON_GLOSSY.png";
const ARCHIVE_MARK_NAME = "scripe-mark-3d-original.png";
const ARCHIVE_APP_ICON_NAME = "scripe-app-icon-3d-original.png";

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Ensures a directory exists (recursive mkdir is a no-op if it already does). */
async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

/**
 * Checks whether `dir` contains both owner originals under either known
 * naming convention (the external handoff's `SCRIPE_3D_*` names, or the
 * archive's `scripe-*-original.png` names — see the file header).
 *
 * @param {string | undefined} dir - Directory to check. `undefined`/empty is
 *   treated as "not a candidate" (matches an unset env var).
 * @returns {{ dir: string, mark: string, appIcon: string } | null} The
 *   resolved filenames if both files exist in `dir`, else `null`.
 */
function matchSourceDir(dir) {
  if (!dir) return null;
  if (existsSync(join(dir, EXTERNAL_MARK_NAME)) && existsSync(join(dir, EXTERNAL_APP_ICON_NAME))) {
    return { dir, mark: EXTERNAL_MARK_NAME, appIcon: EXTERNAL_APP_ICON_NAME };
  }
  if (existsSync(join(dir, ARCHIVE_MARK_NAME)) && existsSync(join(dir, ARCHIVE_APP_ICON_NAME))) {
    return { dir, mark: ARCHIVE_MARK_NAME, appIcon: ARCHIVE_APP_ICON_NAME };
  }
  return null;
}

/**
 * Resolves which directory + filenames to read the two owner originals
 * from. See the file header's SOURCE section for the full three-tier
 * priority order and rationale.
 *
 * @returns {{ dir: string, mark: string, appIcon: string, label: string }}
 * @throws {Error} If none of the three candidates contain both originals.
 */
function resolveSource() {
  const candidates = [
    { dir: process.env.BRAND_SOURCE_DIR, label: `BRAND_SOURCE_DIR override (${process.env.BRAND_SOURCE_DIR})` },
    { dir: EXTERNAL_HANDOFF_DIR, label: "external read-only handoff folder" },
    { dir: ARCHIVE_DIR, label: "in-repo archive (assets/brand/)" },
  ];
  for (const candidate of candidates) {
    const match = matchSourceDir(candidate.dir);
    if (match) return { ...match, label: candidate.label };
  }
  throw new Error(
    "No brand source originals found. Checked BRAND_SOURCE_DIR, the external handoff " +
      "folder, and the in-repo assets/brand/ archive — none contained both owner originals.",
  );
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

/**
 * Trims transparent margin off the mark source, returning a sharp pipeline.
 *
 * @param {string} sourceMark - Resolved absolute path to the mark original
 *   (from {@link resolveSource}).
 */
function trimmedMark(sourceMark) {
  return sharp(sourceMark).trim();
}

async function main() {
  const resolved = resolveSource();
  const sourceMark = join(resolved.dir, resolved.mark);
  const sourceAppIcon = join(resolved.dir, resolved.appIcon);
  console.log(`SCRIPE brand asset pipeline — source: ${resolved.label}`);
  console.log(`  mark:     ${sourceMark}`);
  console.log(`  app icon: ${sourceAppIcon}`);

  // ── 1. Archival copies (untouched pixels) ────────────────────────────
  // Skipped when the resolved source IS already the archive (case 3 in
  // resolveSource) — copying a file onto itself is unnecessary and, with
  // Node's copyFile, not guaranteed safe if source and dest ever race.
  // Compared via realpathSync, not a plain string/`===` compare: a
  // `BRAND_SOURCE_DIR` override can spell the identical directory
  // differently from `ARCHIVE_DIR`'s own `path.join` output (forward vs.
  // back slashes, a trailing slash, relative vs. absolute, different
  // casing on a case-insensitive filesystem) and still resolve to the same
  // files on disk — confirmed by hand: `join()`-built `ARCHIVE_DIR` came
  // out back-slashed on Windows while a forward-slashed `BRAND_SOURCE_DIR`
  // pointed at the exact same folder, which a naive `===` missed entirely.
  await ensureDir(ARCHIVE_DIR);
  const isArchiveSource = existsSync(resolved.dir) && realpathSync(resolved.dir) === realpathSync(ARCHIVE_DIR);
  if (isArchiveSource) {
    console.log("✓ source is already the in-repo archive — skipping self-copy");
  } else {
    await copyFile(sourceMark, join(ARCHIVE_DIR, ARCHIVE_MARK_NAME));
    await copyFile(sourceAppIcon, join(ARCHIVE_DIR, ARCHIVE_APP_ICON_NAME));
    console.log("✓ archived verbatim originals to assets/brand/");
  }

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
    const info = await trimmedMark(sourceMark).resize({ width }).png({ compressionLevel: 9 }).toFile(outPath);
    console.log(`✓ public/brand/mark/scripe-mark-${width}.png (${info.width}×${info.height})`);
  }

  // JSON-LD Organization.logo: square, transparent, comfortably above
  // Google's 112px structured-data minimum.
  const logoInfo = await trimmedMark(sourceMark)
    .resize(512, 512, { fit: "contain", background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toFile(join(markDir, "scripe-logo-512.png"));
  console.log(`✓ public/brand/mark/scripe-logo-512.png (${logoInfo.width}×${logoInfo.height})`);

  // OpenGraph card embed: small enough that embedding it in the ImageResponse
  // keeps the whole OG bundle well under the 500KB budget.
  const ogInfo = await trimmedMark(sourceMark)
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
    const buffer = await trimmedMark(sourceMark)
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
  const appleIconInfo = await sharp(sourceAppIcon)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(join(appDir, "apple-icon.png"));
  console.log(`✓ src/app/apple-icon.png (${appleIconInfo.width}×${appleIconInfo.height})`);

  const iconsDir = join(ROOT, "public", "brand", "icons");
  await ensureDir(iconsDir);
  for (const size of [192, 512]) {
    const info = await sharp(sourceAppIcon)
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
