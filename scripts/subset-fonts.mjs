#!/usr/bin/env node
/**
 * Font subsetting pipeline (Wave G Task G1's method, made reproducible).
 *
 * `src/fonts/*.woff2` are pre-subsetted — G1 cut the shipped faces from
 * their full-glyph originals down to 48–55% of their prior size (see
 * `.superpowers/sdd/2026-08-17-website-fusion-rebuild/task-g1-report.md`
 * §5) by keeping only the glyphs the site can ever render. That report
 * documented the method in prose but never committed the script that did
 * it, which is a real risk: a future content change could introduce a
 * character outside the kept subset and silently render tofu (a missing-
 * glyph box) with no build-time signal. This script is that missing
 * script — read it, or re-run it, instead of re-deriving the method from
 * the report by hand.
 *
 * METHOD (text-based subsetting via HarfBuzz/`hb-subset`, not
 * `unicode-range` — the font's own glyph table is cut, not just the CSS
 * hint browsers may or may not honor):
 *
 *   1. Scan every string this site can ever render — `src/content/**\/*.ts`
 *      (both locales' copy) and `messages/*.json` (chrome strings next-intl
 *      resolves) — and collect the set of characters actually in use.
 *   2. For the two LATIN faces (Archivo, Inter), keep that scanned set
 *      PLUS the full Basic Latin, Latin-1 Supplement, Latin Extended-A,
 *      Latin Extended-B, General Punctuation, Currency Symbols, Arrows and
 *      Mathematical Operators blocks — headroom for copy edits that stay
 *      within "the kind of character a Latin marketing page uses" without
 *      needing a re-subset for every wording tweak.
 *   3 For the ARABIC faces (Cairo, and Tajawal's 7 static weight files),
 *      keep the scanned set FILTERED TO the Arabic script blocks only
 *      (Arabic, Arabic Supplement, Arabic Extended-A) plus the full Arabic
 *      block ranges for the same headroom reason, Western digits 0–9
 *      (SAR/CRM-style figures embedded in Arabic copy use Western numerals
 *      per this project's own hard rule — see `src/content/en/pricing.ts`'s
 *      header), and the bidi/shaping control characters Arabic text needs
 *      (ZWJ, ZWNJ, LRM, RLM, ALM, the LRE/RLE/PDF/LRO/RLO/LRI/RLI/FSI/PDI
 *      bidi controls). Latin LETTERS embedded in Arabic copy (brand names
 *      like "SCRIPE", abbreviations like "CRM") are deliberately EXCLUDED
 *      from the Arabic faces' own subset: they already render correctly via
 *      the `--font-*-ar-base` (Archivo/Inter) fallback stacks in
 *      `src/styles/tokens/typography.css`, so the Arabic fonts never need
 *      to carry Latin-letter glyphs at all.
 *   4. Variable axes are NEVER reduced — every call omits `variationAxes`,
 *      so Archivo's/Inter's/Cairo's full weight ranges (and Archivo's width
 *      axis) survive untouched. Tajawal has no variable axis to preserve —
 *      it ships as 7 independent static weight files, each subsetted on its
 *      own with the identical Arabic-script text. Subsetting here only ever
 *      drops unused GLYPHS, on any face.
 *
 * Requires `subset-font` (HarfBuzz/`hb-subset` compiled to WASM). Per this
 * project's "no new deps for a one-off tool" discipline (the same rule
 * `scripts/build-brand-assets.mjs` and `scripts/build-media-assets.mjs`
 * follow for `sharp`... except `sharp` IS a project dep because those two
 * scripts' outputs are regenerated often enough to earn it — font
 * subsetting is not), `subset-font` is never added to `package.json`.
 * Install it into a SCRATCH directory instead and point `NODE_PATH` at it:
 *
 *   mkdir -p /tmp/scripe-font-subset && cd /tmp/scripe-font-subset
 *   npm install subset-font
 *   cd -
 *   NODE_PATH=/tmp/scripe-font-subset/node_modules node scripts/subset-fonts.mjs
 *
 * (PowerShell equivalent: `New-Item -ItemType Directory -Force
 * $scratch; Set-Location $scratch; npm install subset-font; Set-Location
 * -; $env:NODE_PATH = "$scratch\node_modules"; node
 * scripts/subset-fonts.mjs`.) If `subset-font` cannot be resolved, this
 * script fails loudly with that exact recipe rather than silently no-op-ing
 * or partially rewriting the shipped fonts.
 *
 * USAGE
 *   npm run fonts:subset
 *
 * Re-run whenever `src/content` or `messages/*.json` gains a character
 * outside the kept ranges (a build-time way to catch that in advance: grep
 * new copy against the block ranges below before it ships). Overwrites
 * `src/fonts/*.woff2` in place — safe to re-run any number of times, the
 * output is deterministic for a given set of source `.woff2` files + copy.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTS_DIR = path.join(ROOT, "src", "fonts");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const MESSAGES_DIR = path.join(ROOT, "messages");

/** [start, end] inclusive Unicode code-point ranges, standard block
 *  boundaries. Kept as plain tuples (not a library) — four blocks, easy to
 *  eyeball against the Unicode block chart if this ever needs auditing. */
const LATIN_BLOCKS = [
  [0x0000, 0x007f], // Basic Latin
  [0x0080, 0x00ff], // Latin-1 Supplement
  [0x0100, 0x017f], // Latin Extended-A
  [0x0180, 0x024f], // Latin Extended-B
  [0x2000, 0x206f], // General Punctuation (em dash, ellipsis, quotes...)
  [0x20a0, 0x20cf], // Currency Symbols
  [0x2190, 0x21ff], // Arrows
  [0x2200, 0x22ff], // Mathematical Operators
];

/** Arabic script blocks, kept for the two Arabic faces. */
const ARABIC_BLOCKS = [
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
];

/** Western digits — SAR/CRM-style figures inside Arabic copy use these,
 *  never Arabic-Indic digits (project hard rule). */
const LATIN_DIGIT_CHARS = "0123456789";

/** Bidi/shaping control characters Arabic text needs at runtime (joiners,
 *  marks and explicit directional embeddings) — none of these fall inside
 *  the Arabic script blocks above, so they are listed explicitly. */
const RTL_CONTROL_CHARS = [
  0x061c, // Arabic Letter Mark
  0x200c, // Zero Width Non-Joiner
  0x200d, // Zero Width Joiner
  0x200e, // Left-to-Right Mark
  0x200f, // Right-to-Left Mark
  0x202a, // Left-to-Right Embedding
  0x202b, // Right-to-Left Embedding
  0x202c, // Pop Directional Formatting
  0x202d, // Left-to-Right Override
  0x202e, // Right-to-Left Override
  0x2066, // Left-to-Right Isolate
  0x2067, // Right-to-Left Isolate
  0x2068, // First Strong Isolate
  0x2069, // Pop Directional Isolate
]
  .map((cp) => String.fromCodePoint(cp))
  .join("");

/** Every shipped font FILE and which kept-range policy applies to it.
 *  Tajawal has no variable instance, so its 7 static weights are 7 separate
 *  entries here — each subsetted independently with the same Arabic text. */
const FACES = [
  { file: "Archivo-var.woff2", script: "latin" },
  { file: "Inter-var.woff2", script: "latin" },
  { file: "Cairo-var.woff2", script: "arabic" },
  { file: "Tajawal-200.woff2", script: "arabic" },
  { file: "Tajawal-300.woff2", script: "arabic" },
  { file: "Tajawal-400.woff2", script: "arabic" },
  { file: "Tajawal-500.woff2", script: "arabic" },
  { file: "Tajawal-700.woff2", script: "arabic" },
  { file: "Tajawal-800.woff2", script: "arabic" },
  { file: "Tajawal-900.woff2", script: "arabic" },
];

/**
 * Expands a list of `[start, end]` code-point ranges into their literal
 * characters, concatenated.
 *
 * @param ranges - Inclusive code-point range tuples.
 * @returns Every character in every range, in order.
 */
function expandRanges(ranges) {
  let out = "";
  for (const [start, end] of ranges) {
    for (let cp = start; cp <= end; cp++) out += String.fromCodePoint(cp);
  }
  return out;
}

/**
 * True if a code point falls inside any of the given ranges.
 *
 * @param cp - A Unicode code point.
 * @param ranges - Inclusive code-point range tuples.
 */
function inRanges(cp, ranges) {
  return ranges.some(([start, end]) => cp >= start && cp <= end);
}

/**
 * Recursively collects every file under `dir` whose name matches `test`.
 *
 * @param dir - Directory to walk.
 * @param test - Filename predicate.
 * @returns Absolute file paths.
 */
async function walk(dir, test) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, test)));
    } else if (test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Recursively flattens every string value in a parsed JSON object/array.
 *
 * @param value - A parsed JSON value.
 * @param out - Accumulator array (internal recursion detail).
 * @returns Every string value found, in traversal order.
 */
function flattenStrings(value, out = []) {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) flattenStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) flattenStrings(item, out);
  }
  return out;
}

/**
 * Builds the full corpus of text this site can ever render: every
 * `src/content/**\/*.ts` file's raw source (sweeping in a handful of harmless
 * TypeScript-syntax ASCII characters is fine — they are Basic Latin, already
 * covered by {@link LATIN_BLOCKS}) plus every string value in
 * `messages/*.json`.
 *
 * @returns The concatenated corpus text.
 */
async function readCorpus() {
  const contentFiles = await walk(CONTENT_DIR, (name) => name.endsWith(".ts"));
  const contentText = await Promise.all(contentFiles.map((file) => readFile(file, "utf8")));

  const messageFiles = await walk(MESSAGES_DIR, (name) => name.endsWith(".json"));
  const messageText = await Promise.all(
    messageFiles.map(async (file) => flattenStrings(JSON.parse(await readFile(file, "utf8"))).join("\n")),
  );

  return [...contentText, ...messageText].join("\n");
}

/**
 * Writes `data` to `file` and reports the result (size, short hash).
 *
 * @param file - Absolute destination path.
 * @param data - Encoded font bytes.
 * @param before - The source file's byte length, for the savings line.
 */
async function emit(file, data, before) {
  await writeFile(file, data);
  const digest = createHash("sha256").update(data).digest("hex").slice(0, 12);
  const delta = (((before - data.byteLength) / before) * 100).toFixed(1);
  console.log(
    `  ${path.relative(ROOT, file).replace(/\\/g, "/")}  ${before} B -> ${data.byteLength} B  (${delta}% smaller)  ${digest}`,
  );
}

/**
 * Loads `subset-font` from whatever `NODE_PATH` (or the project's own
 * `node_modules`) resolves it to. Fails loudly with the scratch-install
 * recipe rather than leaving a confusing bare `ERR_MODULE_NOT_FOUND`.
 *
 * @returns The package's default export (`subsetFont(buffer, text, opts)`).
 */
async function loadSubsetFont() {
  try {
    const mod = await import("subset-font");
    return mod.default ?? mod;
  } catch {
    console.error(
      [
        "",
        "subset-font is not installed, and this script never adds it to",
        "package.json (a one-off tool dependency, not a build dependency —",
        "see this file's header). Install it into a scratch directory and",
        "point NODE_PATH at it, then re-run:",
        "",
        "  mkdir -p /tmp/scripe-font-subset && cd /tmp/scripe-font-subset",
        "  npm install subset-font",
        "  cd -",
        "  NODE_PATH=/tmp/scripe-font-subset/node_modules node scripts/subset-fonts.mjs",
        "",
        "PowerShell:",
        '  New-Item -ItemType Directory -Force -Path "$env:TEMP\\scripe-font-subset"',
        '  Set-Location "$env:TEMP\\scripe-font-subset"; npm install subset-font',
        "  Set-Location -",
        '  $env:NODE_PATH = "$env:TEMP\\scripe-font-subset\\node_modules"',
        "  node scripts/subset-fonts.mjs",
        "",
      ].join("\n"),
    );
    return null;
  }
}

/**
 * Runs the full pipeline: builds the kept-character text per script, then
 * subsets all four faces in place. Fails loudly (non-zero exit) rather than
 * emitting a partial set.
 */
async function main() {
  const subsetFont = await loadSubsetFont();
  if (!subsetFont) {
    process.exitCode = 1;
    return;
  }

  console.log("Scanning src/content + messages/*.json for characters in use...");
  const corpus = await readCorpus();
  const corpusChars = new Set(Array.from(corpus));

  const latinFromCorpus = [...corpusChars].filter((ch) => !inRanges(ch.codePointAt(0), ARABIC_BLOCKS)).join("");
  const arabicFromCorpus = [...corpusChars].filter((ch) => inRanges(ch.codePointAt(0), ARABIC_BLOCKS)).join("");

  const latinText = latinFromCorpus + expandRanges(LATIN_BLOCKS);
  const arabicText = arabicFromCorpus + expandRanges(ARABIC_BLOCKS) + LATIN_DIGIT_CHARS + RTL_CONTROL_CHARS;

  console.log(`Latin kept-set: ${new Set(Array.from(latinText)).size} unique characters`);
  console.log(`Arabic kept-set: ${new Set(Array.from(arabicText)).size} unique characters`);
  console.log("\nSubsetting (variable axes preserved, no variationAxes option passed):");

  for (const face of FACES) {
    const file = path.join(FONTS_DIR, face.file);
    const input = await readFile(file);
    const text = face.script === "latin" ? latinText : arabicText;
    const output = await subsetFont(input, text, { targetFormat: "woff2" });
    await emit(file, output, input.byteLength);
  }
}

await main();
