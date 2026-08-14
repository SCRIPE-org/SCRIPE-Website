/**
 * Stamp the production domain into the static site.
 *
 *   node tools/set-domain.mjs https://www.example.com
 *
 * Every page ships with a __SITE_URL__ placeholder in its canonical, og:url and
 * og:image tags, and robots.txt / sitemap.xml carry the same token. This script
 * replaces it everywhere, and can be re-run at any time (it also matches an
 * already-stamped domain, so changing hosts is one command).
 *
 * No domain is hardcoded anywhere in the site — the placeholder is the only
 * value shipped, so nothing can accidentally go live pointing at a guess.
 *
 * Node 18+. No dependencies.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = "__SITE_URL__";
const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

const input = process.argv[2];
if (!input) {
  console.error("usage: node tools/set-domain.mjs https://www.example.com");
  process.exit(1);
}

let origin;
try {
  const u = new URL(input);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad protocol");
  origin = u.origin;
} catch {
  console.error(`"${input}" is not a valid absolute URL (expected e.g. https://www.example.com)`);
  process.exit(1);
}

/**
 * The tags that carry the site origin. Matching these by name (rather than
 * hunting for bare URLs) means a link to some other site can never be rewritten.
 */
const ORIGIN_TAGS =
  /(<link rel="canonical" href="|<meta property="og:url" content="|<meta property="og:image" content="|<meta name="twitter:image" content="|<loc>|Sitemap: |Host: )(https?:\/\/[^"<\s]+)/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "tools" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if ([".html", ".xml", ".txt"].includes(extname(name))) out.push(full);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const before = readFileSync(file, "utf8");
  let after = before.split(TOKEN).join(origin);

  // already stamped once: retarget the previous origin, keeping each path
  if (after === before) {
    after = before.replace(ORIGIN_TAGS, (m, lead, url) => {
      const path = new URL(url).pathname.replace(/\/$/, "");
      return lead + origin + path;
    });
  }

  if (after !== before) {
    writeFileSync(file, after, "utf8");
    changed++;
    console.log("stamped", file.replace(ROOT, ""));
  }
}

console.log(`\n${changed} file(s) updated → ${origin}`);
if (!changed) console.log("nothing to do — no placeholder or previous origin found");
