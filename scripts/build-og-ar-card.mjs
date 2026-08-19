#!/usr/bin/env node
/**
 * SCRIPE — Arabic social-share (OpenGraph) card, rendered via headless
 * Chromium (Task G6).
 *
 * WHY THIS SCRIPT EXISTS
 * -----------------------
 * `src/app/[locale]/opengraph-image.tsx` renders both locale cards through
 * `next/og` (`ImageResponse`/Satori). Task G5 proved definitively that
 * Satori cannot shape Arabic script at all: it throws `lookupType: 5 -
 * substFormat: 3 is not yet supported` deep inside its own bundled
 * Bidi/Arabic-ligature engine (`Bidi.arabicRequiredLigatures`), reproduced
 * 5/5 runs against two different STATIC Arabic instances (Noto Sans Arabic
 * Regular, Noto Kufi Arabic SemiBold) that both loaded into Satori
 * correctly and still crashed the instant Arabic text was shaped — not a
 * font-parseability or font-choice problem, a Satori engine gap. Full
 * writeup: `.superpowers/sdd/2026-08-17-website-fusion-rebuild/task-g5-report.md`
 * and `opengraph-image.tsx`'s own `CONTENT` doc comment.
 *
 * Real browsers shape Arabic correctly (proper letter joining, correct
 * visual order) because they ship a complete OpenType/HarfBuzz-class
 * shaping engine. This script renders the AR card in headless Chromium
 * instead of Satori: a real `<div>` tree laid out with `dir="rtl"`,
 * screenshotted at the exact OG canvas size.
 *
 * DESIGN CONTRACT — visually equivalent to the `en` card
 * (`opengraph-image.tsx`): same 1200×630 canvas, obsidian `#0B0B0E`
 * ground, the real 3D brand mark, "SCRIPE" wordmark in Archivo ExtraBold,
 * lime `#C0FF00` tagline — mirrored right-to-left, with the REAL Arabic
 * tagline (not the English-fallback placeholder the Satori route still
 * ships, since it structurally cannot do better).
 *
 * SOURCE OF TRUTH FOR COPY — the Arabic tagline is read from
 * `messages/ar.json`'s `footer.tagline` at build time, never hardcoded
 * here, so this card cannot drift from the copy every Arabic page already
 * ships ("نظام تشغيل المنظمات الرياضية الحديثة" — the same string
 * `src/content/ar/home.ts`'s `<title>` uses).
 *
 * FONTS — the site's own self-hosted VARIABLE fonts, embedded as base64
 * @font-face (never a project dependency, and NOT the special static
 * `.ttf` instances `scripts/build-og-fonts.py` derives for Satori — those
 * exist only because Satori cannot parse variable WOFF2 at all; a real
 * browser parses it natively):
 *   - `src/fonts/Archivo-var.woff2`        (wordmark, weight 800)
 *   - `src/fonts/NotoKufiArabic-var.woff2` (tagline,  weight 600)
 * `font-weight` on a `100 900`-range @font-face selects the matching point
 * on the `wght` axis — exactly what `next/font/local` already does for the
 * live site (`src/fonts/index.ts`), so this card's type matches production
 * rendering, not an approximation of it.
 *
 * CHROMIUM, NOT A PROJECT DEPENDENCY — this repo has no Playwright/
 * Puppeteer dependency and this script does not add one (hard rule for
 * this task, same "no new deps for a one-off build tool" discipline
 * `scripts/subset-fonts.mjs` documents for `subset-font`). It borrows the
 * Chromium already installed by the `playwright-skill` Claude Code plugin
 * and reaches into that install's own `node_modules` — see
 * {@link resolvePlaywrightSkillDir}. That plugin's `run.js` wrapper is
 * meant for one-off ad-hoc scripts (writes a temp file, string-execs it);
 * this is a proper rerunnable build script, so it borrows the plugin's
 * Chromium directly via `node:module`'s `createRequire` instead of
 * shelling out to `run.js`. (Plain `await import("playwright")` would NOT
 * work here even with `NODE_PATH` set — Node's ESM resolver does not
 * consult `NODE_PATH`, only the CommonJS resolver does — `createRequire`
 * sidesteps that entirely by resolving against the plugin directory's own
 * `package.json`.)
 *
 * Override the lookup with `PLAYWRIGHT_SKILL_DIR` (pointed at the plugin's
 * root — the directory containing its own `package.json`/`node_modules`)
 * on a machine where the default plugin cache path doesn't apply, or once
 * a real Playwright install exists anywhere else.
 *
 * OUTPUT — `public/og/og-ar.png`, a committed build artifact (same
 * "small derivative checked into the repo" convention as
 * `public/brand/**`— see `build-brand-assets.mjs`'s header). Rendered at
 * `deviceScaleFactor: 2` (2400×1260 physical pixels) then downsampled to
 * the exact 1200×630 the `og:image:width`/`height` metadata declares —
 * supersampling for crisp text/edges, matching Satori's clean vector
 * output, without shipping a 2x image the metadata doesn't describe.
 *
 * `src/lib/seo/metadata.ts` points the `ar` locale's `openGraph.images`/
 * `twitter.images` at this static file instead of the dynamic
 * `/ar/opengraph-image` route. That dynamic route is deliberately left in
 * place, unlinked — see `metadata.ts`'s own comment for why deleting it
 * isn't the simplest correct choice.
 *
 * USAGE
 * -----
 *     node scripts/build-og-ar-card.mjs
 *
 * Deterministic for a given tagline + font + mark input; overwrites
 * `public/og/og-ar.png` in place. Re-run whenever `messages/ar.json`'s
 * `footer.tagline`, `src/fonts/NotoKufiArabic-var.woff2`/
 * `Archivo-var.woff2`, or `public/brand/mark/scripe-mark-og.png` changes.
 */
import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const OUTPUT_PATH = join(ROOT, "public", "og", "og-ar.png");
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const DEVICE_SCALE_FACTOR = 2;

const OBSIDIAN = "#0B0B0E";
const SIGNAL_LIME = "#C0FF00";
const NEAR_WHITE = "#F4F6F0";

/**
 * Locates an installed `playwright-skill` plugin cache directory that
 * already has Chromium downloaded, without adding `playwright` to this
 * project's own `package.json`. See the file header's CHROMIUM section for
 * why `createRequire` is used instead of a bare `import`/`NODE_PATH`.
 *
 * @returns Absolute path to the skill directory — contains its own
 *   `package.json` and `node_modules/playwright`.
 * @throws {Error} If no candidate resolves. The message documents the fix:
 *   install the plugin, or set `PLAYWRIGHT_SKILL_DIR`.
 */
function resolvePlaywrightSkillDir() {
  const hasPlaywright = (dir) => Boolean(dir) && existsSync(join(dir, "node_modules", "playwright", "package.json"));

  const override = process.env.PLAYWRIGHT_SKILL_DIR;
  if (override) {
    if (hasPlaywright(override)) return override;
    throw new Error(
      `PLAYWRIGHT_SKILL_DIR=${override} has no node_modules/playwright. Point it at the ` +
        "playwright-skill plugin directory (the one containing its own package.json).",
    );
  }

  // Default Claude Code plugin cache layout:
  //   ~/.claude/plugins/cache/playwright-skill/playwright-skill/<version>/skills/playwright-skill
  const cacheRoot = join(homedir(), ".claude", "plugins", "cache", "playwright-skill", "playwright-skill");
  if (existsSync(cacheRoot)) {
    // Version-numbered subdirectories (e.g. "4.1.0") — newest first so a
    // multi-version cache picks the most recently installed one.
    const versions = readdirSync(cacheRoot).sort().reverse();
    for (const version of versions) {
      const candidate = join(cacheRoot, version, "skills", "playwright-skill");
      if (hasPlaywright(candidate)) return candidate;
    }
  }

  throw new Error(
    "Could not find an installed playwright-skill Chromium. Install the playwright-skill " +
      "Claude Code plugin (it vendors its own Playwright + Chromium under its own " +
      "node_modules, kept out of this project's package.json), or set PLAYWRIGHT_SKILL_DIR " +
      "to point at any install that has node_modules/playwright.",
  );
}

/** Reads a file relative to the repo root and returns it as a base64 data URI. */
async function toDataUri(relativePath, mime) {
  const buffer = await readFile(join(ROOT, relativePath));
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/**
 * Builds the self-contained HTML string Chromium renders the card from.
 * "Self-contained" is load-bearing: every font and image is a base64 data
 * URI, so `page.setContent()` never issues a network request and the
 * render is fully deterministic and offline-safe.
 */
async function buildHtml() {
  const messages = JSON.parse(await readFile(join(ROOT, "messages", "ar.json"), "utf8"));
  const tagline = messages.footer?.tagline;
  if (!tagline) {
    throw new Error("messages/ar.json is missing footer.tagline — the AR OG card has no source-of-truth copy.");
  }

  const [archivoDataUri, kufiDataUri, markDataUri] = await Promise.all([
    toDataUri("src/fonts/Archivo-var.woff2", "font/woff2"),
    toDataUri("src/fonts/NotoKufiArabic-var.woff2", "font/woff2"),
    toDataUri("public/brand/mark/scripe-mark-og.png", "image/png"),
  ]);

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Archivo";
    src: url(${archivoDataUri}) format("woff2");
    font-weight: 100 900;
    font-style: normal;
  }
  @font-face {
    font-family: "Noto Kufi Arabic";
    src: url(${kufiDataUri}) format("woff2");
    font-weight: 100 900;
    font-style: normal;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${CARD_WIDTH}px; height: ${CARD_HEIGHT}px; }
  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px;
    background: ${OBSIDIAN};
    direction: rtl;
  }
  /* Mirrors the en card's mark row: mark hugs the leading edge of reading
     order, which under dir="rtl" is the right side — no manual
     row-reverse/justify-content flip needed, direction: rtl alone moves
     flexbox's "start" there. */
  .mark-row { display: flex; }
  .mark-row img { width: 139px; height: 110px; }
  .text-block { display: flex; flex-direction: column; align-items: flex-start; }
  .wordmark {
    font-family: "Archivo", sans-serif;
    font-weight: 800;
    font-size: 148px;
    line-height: 1;
    color: ${NEAR_WHITE};
    letter-spacing: -4px;
    /* The brand name stays Latin/LTR even inside the RTL card, matching
       every other Arabic page on the site (src/fonts/index.ts's header:
       Latin brand names/abbreviations embedded in Arabic copy render via
       the Latin fallback stack, never the Arabic face). */
    direction: ltr;
    unicode-bidi: isolate;
  }
  .tagline {
    font-family: "Noto Kufi Arabic", sans-serif;
    font-weight: 600;
    font-size: 40px;
    line-height: 1.35;
    color: ${SIGNAL_LIME};
    margin-top: 20px;
    direction: rtl;
    text-align: right;
    max-width: 780px;
  }
</style>
</head>
<body>
  <div class="mark-row"><img src="${markDataUri}" alt="" /></div>
  <div class="text-block">
    <div class="wordmark">SCRIPE</div>
    <div class="tagline">${tagline}</div>
  </div>
</body>
</html>`;
}

async function main() {
  const skillDir = resolvePlaywrightSkillDir();
  console.log(`Using Chromium from: ${skillDir}`);
  const skillRequire = createRequire(join(skillDir, "package.json"));
  const { chromium } = skillRequire("playwright");

  const html = await buildHtml();

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: CARD_WIDTH, height: CARD_HEIGHT },
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    // Base64 data-URI fonts are available in memory the instant the HTML
    // parses, but `document.fonts.ready` is still the correct signal that
    // both @font-face weights have finished parsing/shaping before the
    // screenshot is taken — avoids a flash-of-fallback-font race.
    await page.evaluate(() => document.fonts.ready);

    const rawScreenshot = await page.screenshot({ type: "png" });

    await mkdir(join(ROOT, "public", "og"), { recursive: true });
    // Downsample the 2x supersampled capture back to the exact 1200×630
    // the metadata declares — see the file header's OUTPUT section.
    const finalPng = await sharp(rawScreenshot)
      .resize(CARD_WIDTH, CARD_HEIGHT, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(OUTPUT_PATH, finalPng);

    const { width, height } = await sharp(finalPng).metadata();
    console.log(`✓ public/og/og-ar.png  ${width}×${height}  ${finalPng.length} bytes (${(finalPng.length / 1024).toFixed(1)} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Arabic OG card build failed:", error);
  process.exitCode = 1;
});
