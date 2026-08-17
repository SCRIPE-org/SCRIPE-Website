# SCRIPE Public Website — Fusion Redesign Design Spec

**Date:** 2026-08-17
**Status:** Approved (with tweaks) — governing design for the Next.js rebuild
**Repo:** `SCRIPE-Website` (git submodule of the SCRIPE monorepo)
**Supersedes:** `scripe-static/` as the deployed site (it becomes the copy + brand baseline in `backup/`)

---

## 1. Decisions of Record

| Decision | Ruling |
|---|---|
| Target repo | Monorepo submodule `SCRIPE\SCRIPE-Website`. New Next.js app at repo root; all current content moves to `backup/`. |
| Hosting | Vercel. |
| Live data at launch | Pricing + geo currency (backend `pricing-context`), contact/demo form (backend lead endpoint). Resources/blog structure-ready, not live. Everything else static + localized. |
| Design strategy | **Fusion redesign**: brand DNA preserved; every page redesigned fresh at world-class ambition; strongest assets harvested from both prior attempts (`scripe-static` and the standalone `D:\01_PROJECTS\SCRIPE-Website` cinematic build). |
| IA | Keep the 12-page structure as baseline. Dedicated product pages (Venue / Academy / Football Intelligence) may be **proposed** during redesign if storytelling/UX/SEO clearly warrants — never added without approval. |
| Styling | Tailwind v4 consuming a CSS custom-property token layer. |
| Domain | `www.scripe.org` canonical (apex redirects). Configured via `SITE_URL` env until DNS confirmed. |
| Locales | `en` + `ar` at launch; locale list extensible without restructure. |

### Approved tweaks (binding)

1. **Tokens (§5):** `scripe-static/global.css` is *not* an immutable source of truth beyond approved brand DNA. Signal Lime, Obsidian, product accent identity, and typography heritage are preserved; spacing, type scale, radii, shadows, layout, and motion values **may evolve** where it materially improves the new design. **The new Fusion token system becomes the final production source of truth.**
2. **Camera Hero (§8):** Approved *concept*, not a locked implementation. Harvest its strongest qualities; elevate or reimagine freely if the result is clearly stronger while preserving the concept.
3. **GSAP (§8):** CSS/native scroll-driven animation is the default. GSAP is allowed **selectively anywhere** a signature cinematic interaction genuinely benefits, provided performance and accessibility budgets hold. Not restricted to the homepage hero.

### Asset workflow (binding)

For any custom imagery/visual asset the design needs:
1. If Claude can generate/create it → do it.
2. If not → emit a **production-ready image-generation prompt** (composition, subject, camera angle, lens, lighting, colors, materials, mood, background, aspect ratio, section-fit requirements) and **stop that part** until the user provides the asset.
3. Integrate the delivered asset; continue. Repeat per asset.

**Never compromise, simplify, or design around missing imagery.**

---

## 2. Context: the three sources

1. **`scripe-static/`** (this repo): 12 pages, full EN copy + ~726 AR keys, real RTL via logical properties, dark+light themes both authored, Signal Lime `#C0FF00` on Obsidian `#0B0B0E`, SAR pricing hardcoded, contact endpoint `null`, zero third-party scripts. **Defect the rebuild fixes:** Arabic is client-side text-swap — no AR URLs, no hreflang, Arabic market invisible to crawlers.
2. **Standalone `D:\01_PROJECTS\SCRIPE-Website`** (separate repo, untouched): cinematic "Scheduled Night" Next.js 16 build. Harvest pool: `reference\design-system\` (complete token system, 73 component files, 20 guideline pages, 6 motion proofs, EN/AR × dark/light proofs), approved cinematic media (`public\media\`, ~110MB), claims-guardrails/product-truth docs, motion infrastructure, security-hardened `next.config.ts`, pre-paint theme+dir script.
3. **`SCRIPE-Frontend`**: not a chassis (admin-app architecture). Reused: `GET /v1/auth/signup/pricing-context` endpoint (geo via `CF-IPCountry`, 15 currencies, server-cached rates), 68 commercial content files in 7 languages (copy material), `DESIGN.md` brand reference.

Research basis: triangulated multi-agent research (rendering, i18n/RTL, theming, perf/SEO, content tooling, animation, top-tier site teardowns) saved under the session scratchpad `website-arch-research/`. Key teardown facts: Stripe/Linear/Vercel/Resend/Clerk all animate with **pure CSS** in initial payloads; Stripe does multi-currency via **URL variants**; none of the nine sites audited supports Arabic/RTL — SCRIPE differentiates there.

---

## 3. Repo layout & migration

```
SCRIPE-Website/
├─ backup/                      ← ALL current content, moved intact via git mv:
│  ├─ scripe-static/            (copy + brand baseline; reference only)
│  ├─ _ds/                      (upstream design-system package + brief)
│  ├─ design-comps/             (*.dc.html + support.js)
│  ├─ screenshots/  uploads/  assets/
├─ docs/                        (this spec, plans, walkthroughs)
├─ src/                         ← new Next.js app (repo root = Vercel project root)
├─ public/
├─ package.json  next.config.ts  tsconfig.json  eslint.config.mjs
```

Migration rules: `git mv` (history preserved), nothing deleted, `backup/` excluded from tsconfig/eslint/build. Submodule commits on `main`; parent repo pointer updated separately.

---

## 4. Application architecture

### 4.1 Structure

```
src/
├─ app/
│  ├─ [locale]/                      en | ar — generateStaticParams, dynamicParams=false
│  │  ├─ layout.tsx                  <html lang dir>, fonts, pre-paint script, chrome
│  │  ├─ page.tsx                    home
│  │  ├─ platform/ pricing/ resources/ company/ contact/
│  │  ├─ solutions/page.tsx
│  │  ├─ solutions/[slug]/page.tsx   4 static slugs (clubs, academies, venues, multi-sport)
│  │  ├─ not-found.tsx + [...rest]/  localized 404
│  ├─ sitemap.ts  robots.ts  manifest.ts
│  └─ (og image routes per page group)
├─ proxy.ts                          / → /en|/ar (cookie → Accept-Language); redirect only —
│                                    NEVER set-cookie on a cacheable HTML response
├─ components/
│  ├─ ui/            primitives (Button, Link, Field, Card…)
│  ├─ chrome/        NavBar, MegaMenu, MobileSheet, Footer, LocaleSwitch, ThemeToggle
│  ├─ sections/      per-page composition sections
│  └─ motion/        "use client" leaf wrappers only
├─ content/  en/  ar/                typed TS page content; shared types force key parity
├─ i18n/                             next-intl request config + routing helpers
├─ lib/                              pricing client, jsonld builders, seo helpers
└─ styles/  tokens/  globals.css     Fusion token system (source of truth)
```

**RSC discipline:** pages/layouts/sections are Server Components. `"use client"` only in motion/interaction leaves. This is the bundle budget's main enforcement.

### 4.2 Rendering & caching

- Every route: **full static prerender**, Next.js default caching model.
- **No `cacheComponents` / PPR** at launch (opt-in migration with cache-persistence regressions; revisit when it becomes framework default).
- Resources gets `revalidate` (≥1h) only when live content lands; on-demand `revalidatePath` preferred.
- Image defaults: AVIF/WebP via `next/image`; hero uses `priority` + correct `sizes`.

### 4.3 i18n & RTL

- `next-intl` with `/[locale]/` subdirectory routing. Full bidirectional `hreflang` + `x-default`, localized `sitemap.ts` with `alternates.languages`, per-locale metadata + OG.
- UI strings via next-intl messages; long-form page content via typed TS files in `content/{en,ar}/` (shared interfaces = compile-time parity; missing-key drift impossible).
- CSS: logical properties everywhere; targeted `[dir="rtl"]` overrides for transforms / background-position / shadows; `.rtl-flip` class only for direction-semantic icons; photographic/camera coordinates stay physical (imagery never mirrors).
- Arabic typography: `letter-spacing: 0`, script-specific line-heights, `<bdi>` isolation for Latin brand names in AR sentences, Western numerals held constant, `text-decoration-skip-ink: auto`.
- Fonts: `next/font/local`, **woff2 only** (drops ~1.5MB of TTF fallbacks). Latin faces load on `/en`, Arabic faces on `/ar`.

### 4.4 Theming

- Dark default; light fully authored (both palettes already exist as baseline material).
- **No next-themes** (17-month-stale, open React-19 bug). Hand-rolled pre-paint inline script (ported from `scripe-static` / standalone repo — both already solve this): sets `data-theme`, `style.colorScheme`; server renders `dir`/`lang` from route. localStorage persistence, `prefers-color-scheme` fallback, `theme-color` meta repaint.
- `suppressHydrationWarning` on `<html>` only.

### 4.5 Fusion token system (production source of truth)

- Layers: **primitive → semantic** CSS custom properties; Tailwind v4 `@theme` consumes them.
- Preserved brand DNA: Signal Lime `#C0FF00` family, Obsidian/Carbon/Graphite neutrals, product accents (teal = Academy, jade = Venue, indigo = Football Intelligence, rust = Club), Archivo/Inter + Noto Kufi/Sans Arabic heritage, sentence-case voice.
- Free to evolve (per tweak 1): spacing scale, type scale, radii, shadows, layout tokens, motion durations/easings.
- Motion tokens keep the `--motion-travel → 0` reduced-motion mechanism (choreography degrades to fades, not `animation: none`).

---

## 5. Live integrations

### 5.1 Pricing (launch)

- Static page shell, SAR baked into HTML as fallback truth (zero-JS correct).
- Client hydrates from existing **`GET /v1/auth/signup/pricing-context`** (geo-detection, `recommendedCurrency`, `rateFromUsd`, 15 currencies — all server-solved already; the website only reads it).
- Reserved-width price slots → **zero CLS**. Always-visible currency selector overrides geo (an inferred currency must never be the only path to a contractual number).
- Documented upgrade path (not launch): Stripe-style prebuilt currency-variant URLs behind a proxy geo rewrite.

### 5.2 Contact / demo form (launch)

- Server Action → backend lead endpoint. Honeypot + time-trap + server-side validation (mirroring the static site's field limits) + backend rate limiting.
- Until the endpoint exists: honest "not yet connected" confirmation state (current behavior), wired behind one constant.

### 5.3 Blog/resources (structure-ready)

- Same typed-TS content pipeline at launch. MDX via `content-collections` is the chosen future tool (Contentlayer is dead; next-mdx-remote archived) — additive, no restructure.

---

## 6. SEO

- Metadata API: per-page title/description templates, canonical on `www.scripe.org`, `metadataBase` from `SITE_URL` env.
- JSON-LD: `Organization` (site-wide), `SoftwareApplication`, `BreadcrumbList`. **No FAQPage/HowTo schema** (rich results deprecated 2026).
- `next/og` OG images per page; Arabic OG variants require visual QA (Satori RTL is best-effort).
- `sitemap.ts` (localized alternates), `robots.ts` (env-gated: noindex on previews).
- 404 noindex; www canonical redirect at Vercel level.

---

## 7. Performance budgets (gates, not aspirations)

| Metric | Budget |
|---|---|
| LCP (home, internal bar) | ≤ 1.8s (Google floor 2.5s) |
| INP | ≤ 200ms |
| CLS | ≤ 0.05 (bilingual + theme + currency swaps are compounding risks) |
| Initial JS (marketing pages) | ≤ ~100KB gzip |
| Fonts | woff2 only, subset, per-locale loading |
| Third-party scripts | none (Vercel Analytics pending decision — see Open Items) |

---

## 8. Creative direction

- **Ambition bar:** Linear-class polish through CSS keyframes + scroll-driven animation; the audited top-tier sites prove premium feel is CSS discipline, not heavy JS.
- **Animation stack:** CSS scroll-driven animations + IntersectionObserver fallback → Motion (`m` + `LazyMotion`, ~5KB) for micro-interactions → **GSAP selectively for signature cinematic interactions anywhere on the site** (tweak 3), always inside perf/a11y budgets. No three.js at launch (documented CWV hazard; the cinematic feel comes from art direction + choreography).
- **Camera Hero:** approved concept (scroll-scrubbed virtual camera over a single environment). Implementation free to be elevated/reimagined (tweak 2) — candidates: multi-plate parallax, new AI-generated environment plates via the asset workflow, GSAP-scrubbed camera path.
- **Harvest pool** (use where it serves the new design): standalone repo's design-system components/guidelines/motion proofs, approved campaign media, `scripe-static` copy + IA + ambient keyframe library, commercial copy files from SCRIPE-Frontend.
- **Copy governance:** claims guardrails + product truth docs (standalone repo `reference\source-of-truth\public-website\`) bind all public copy. No fake metrics, no fabricated logos/testimonials.
- Reduced-motion: authored variant on every choreographed sequence; auto-playing hero motion gets an explicit pause control (WCAG 2.2.2 — media query alone is insufficient).

---

## 9. Security

- Headers (port from standalone `next.config.ts`, already hardened): first-party-only CSP, HSTS, `frame-ancestors 'none'`, referrer-policy, permissions-policy.
- No secrets client-side; only public API base URL via `NEXT_PUBLIC_*`; `SITE_URL` server env.
- Form abuse: honeypot + time-trap + server validation + backend rate limit; no PII in URLs or logs.
- Supply chain: minimal dependency set (next, react, next-intl, motion, gsap, tailwind); lockfile committed; no CDN scripts.

---

## 10. QA gates (per slice + pre-launch)

1. `typecheck` + `lint` + `build` green per commit slice.
2. Lighthouse CI budgets on home + pricing (lab proxy; field CWV is the real bar).
3. Manual passes: AR/RTL visual, both themes × both locales, reduced-motion, keyboard navigation, 375px→4K responsive.
4. Verification is code-read + build-based per standing rule (no live preview unless explicitly requested).

---

## 11. Out of scope (documented, not forgotten)

- CMS / MDX blog engine (structure-ready only).
- Currency-in-URL prebuilt pricing variants (upgrade path).
- Locales beyond en/ar.
- `cacheComponents` / PPR migration.
- three.js/WebGL experiences.
- Product-specific pages (proposal-gated per IA decision).

## 12. Open items

| Item | Owner | Blocking? |
|---|---|---|
| Backend lead endpoint for contact form | Backend | No (honest-fallback state ships) |
| `pricing-context` endpoint reachable from public site origin (CORS) | Backend | Launch-blocking for live currency only |
| Vercel Analytics on/off | User | No |
| DNS / `www.scripe.org` go-live | User | Launch only |
| Custom imagery per section | User + asset workflow | Per-section, by design |
