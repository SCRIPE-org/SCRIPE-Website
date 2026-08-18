# SCRIPE Public Website — Fusion Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SCRIPE public website as a bilingual (en/ar), dual-theme, statically-prerendered Next.js 16 app at world-class design quality, replacing `scripe-static/` (which moves to `backup/`).

**Architecture:** App Router with `/[locale]/` routes (next-intl), full static prerender on the default caching model, Fusion CSS-token system consumed by Tailwind v4, RSC-first with client leaves only for motion/interaction, live pricing via existing backend `pricing-context` endpoint, contact via Server Action.

**Tech Stack:** Next.js ^16.2, React ^19.2, TypeScript ^5.9, next-intl ^4.13, Tailwind CSS ^4, motion ^13 (LazyMotion), gsap ^3.15, node:test + tsx for unit tests.

**Spec:** `docs/superpowers/specs/2026-08-17-scripe-website-fusion-redesign-design.md` — read it first; this plan argues from it.

## Global Constraints

- Work directly in the checkout `D:\01_PROJECTS\SCRIPE\SCRIPE-Website` (git submodule, branch `main`). **No worktree isolation** (standing user rule).
- Commit messages: plain conventional commits. **Never mention Claude/Anthropic/AI, never add Co-Authored-By footers** (project hard rule).
- No secrets, keys, or credentials in code. Public config only via `NEXT_PUBLIC_*`; server config via env.
- Brand DNA is fixed: Signal Lime `#C0FF00` on Obsidian `#0B0B0E`; product accents teal (Academy), jade (Venue), indigo (Football Intelligence), rust (Club); Archivo/Inter + Noto Kufi/Sans Arabic. Everything else in the token system may evolve (spec tweak 1).
- All CSS uses **logical properties** (`padding-inline`, `margin-inline-start`, `inset-inline`, `text-align: start`). Physical `left/right` only inside `[dir="rtl"]` override blocks or photo-coordinate code.
- Arabic text rules: `letter-spacing: 0`, `<bdi>` around Latin brand names, Western numerals, script-specific line-heights.
- Every choreographed animation has an authored `prefers-reduced-motion` variant via `--motion-travel: 0` (degrade to fades, never `animation: none` on content).
- Performance budgets are gates: LCP ≤ 1.8s (home), INP ≤ 200ms, CLS ≤ 0.05, initial JS ≤ ~100KB gzip, zero third-party scripts.
- **Asset workflow (binding, spec §1):** when a section needs custom imagery you cannot generate, emit a production-ready image-generation prompt (composition, subject, camera angle, lens, lighting, colors, materials, mood, background, aspect ratio, fit requirements) and STOP that section until the user supplies the asset. Never design around missing imagery.
- Page/section tasks are design-critical: implement with the design doctrine in spec §8 (Linear-class CSS polish, CSS-first motion, GSAP only for signature moments). Load the `frontend-design` and `impeccable:impeccable` skills before designing sections.
- Verification is code-read + build-based. Do not start dev servers/browser previews (standing user rule).
- Gate per task: `npm run typecheck && npm run lint && npm run build` green before commit (tests too where the task has them).
- Copy governance: no fake metrics, no invented logos/testimonials; copy source is `backup/scripe-static/` HTML (EN) + `backup/scripe-static/js/lang-ar.js` (AR).
- Documentation comments (user directive 2026-08-18): every source file gets a concise file-level doc header (purpose + role in the system); every exported function/component/type gets a JSDoc block (what it does, params/returns where non-obvious). No line-by-line narration — document the contract, not the mechanics. Files from Tasks 2–6 get retrofitted in the final fix wave.

---

## Phase 0 — Migration & Scaffold

### Task 1: Move everything into `backup/`

**Files:**
- Move (git mv): `scripe-static/` → `backup/scripe-static/`; `_ds/` → `backup/_ds/`; `assets/` → `backup/assets/`; `screenshots/` → `backup/screenshots/`; `uploads/` → `backup/uploads/`; `support.js` + all 4 `*.dc.html` → `backup/design-comps/`

- [ ] **Step 1: Verify clean tree**

Run: `git -C D:\01_PROJECTS\SCRIPE\SCRIPE-Website status --short`
Expected: empty (only untracked docs/ if plan not yet committed).

- [ ] **Step 2: Move via git mv**

```bash
cd /d/01_PROJECTS/SCRIPE/SCRIPE-Website
mkdir -p backup/design-comps
git mv scripe-static backup/scripe-static
git mv _ds backup/_ds
git mv assets backup/assets
git mv screenshots backup/screenshots
git mv uploads backup/uploads
git mv support.js backup/design-comps/support.js
git mv "Academy Camera Story.dc.html" "backup/design-comps/Academy Camera Story.dc.html"
git mv "Animated Hero.dc.html" "backup/design-comps/Animated Hero.dc.html"
git mv "SCRIPE Landing Page.dc.html" "backup/design-comps/SCRIPE Landing Page.dc.html"
git mv "SCRIPE Landing Page v1.dc.html" "backup/design-comps/SCRIPE Landing Page v1.dc.html"
```

- [ ] **Step 3: Verify nothing left at root except backup/ and docs/**

Run: `ls`
Expected: `backup/  docs/` only.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: move static site and design artifacts into backup/"
```

### Task 2: Scaffold Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.env.example`, `src/app/globals.css` (placeholder import only), `src/app/[locale]/layout.tsx` (minimal), `src/app/[locale]/page.tsx` (minimal)

**Interfaces:**
- Produces: `npm run dev|build|start|lint|typecheck|test` scripts; `@/*` path alias → `src/*`; security headers in `next.config.ts`.

- [ ] **Step 1: Write package.json**

```json
{
  "name": "scripe-website",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "node --import tsx --test \"src/**/*.test.ts\""
  },
  "dependencies": {
    "gsap": "^3.15.0",
    "motion": "^13.1.0",
    "next": "^16.2.12",
    "next-intl": "^4.13.7",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.0",
    "@types/node": "^20.19.43",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "eslint": "^9.39.5",
    "eslint-config-next": "^16.2.12",
    "tailwindcss": "^4.2.0",
    "tsx": "^4.23.1",
    "typescript": "^5.9.3"
  }
}
```

- [ ] **Step 2: Write next.config.ts with security headers (ported per spec §9)**

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.scripe.org"}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
```

- [ ] **Step 3: Write tsconfig.json (paths `@/*` → `src/*`; exclude `backup`), postcss.config.mjs (`@tailwindcss/postcss`), eslint.config.mjs (eslint-config-next flat, ignore `backup/**`), .gitignore (node_modules, .next, .env*, !.env.example), .env.example:**

```bash
# Public site origin, used for canonicals/OG/sitemap. No trailing slash.
SITE_URL=https://www.scripe.org
# SCRIPE backend API base (public endpoints only). No trailing slash.
NEXT_PUBLIC_API_BASE_URL=https://api.scripe.org/api
```

- [ ] **Step 4: Minimal `src/app/[locale]/layout.tsx` + `page.tsx` (placeholder "SCRIPE" h1, no i18n yet), `src/app/globals.css` containing only `@import "tailwindcss";`**

- [ ] **Step 5: Install + gate**

Run: `npm install && npm run typecheck && npm run lint && npm run build`
Expected: all green; build outputs `/[locale]` route.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js app with security headers and tooling"
```

---

## Phase 1 — Foundation

### Task 3: Fusion token system

**Files:**
- Create: `src/styles/tokens/colors.css`, `src/styles/tokens/typography.css`, `src/styles/tokens/spacing.css`, `src/styles/tokens/motion.css`, `src/styles/tokens/z.css`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: semantic CSS vars every component uses: `--surface-page`, `--surface-raised`, `--surface-overlay`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-ink`, `--accent-text`, `--border-subtle`, `--border-strong`, `--focus-ring`, product accents `--accent-academy|venue|fi|club`, spacing `--space-1..14`, radii `--radius-xs..full`, motion `--motion-*` durations + `--ease-*` + `--motion-travel`, z `--z-nav|megamenu|overlay|toast`. Tailwind `@theme inline` maps them (e.g. `--color-surface-page: var(--surface-page)`).

- [ ] **Step 1: Write `colors.css`** — primitives (obsidian `#0b0b0e`, carbon `#1a1d1f`, charcoal `#202226`, graphite `#2b2e33`, slate `#6e7278`, fog `#8b8f94`, silver `#c7cace`, soft-white `#f1f2f2`; lime ramp `#d4ff66/#c0ff00/#9adb00/#6e8f00/#4c6600`; teal `#5ac8e0/#0e7490`; jade `#36d399/#0a7a4d`; indigo `#8b85e8/#5347c4`; rust `#e0a64b/#a6421f`; azure focus `#1e6feb`) then two full semantic sets: `:root` = light (page `#f1f2f2`, accent-text `#4c6600` for contrast), `[data-theme="dark"]` = dark (page `#0b0b0e`, accent `#c0ff00`, accent-ink `#0b0b0e`). Both authored — no inversion tricks. On lime fills, foreground is always ink, never white.
- [ ] **Step 2: Write `typography.css`** — fluid `clamp()` scale (`--fs-cinema` ~3.4→7.25rem down to `--fs-meta` 0.75rem), `--font-display`/`--font-body`/`--font-display-ar`/`--font-body-ar` var hooks, `:lang(ar)` overrides: `letter-spacing: 0`, `--lh-body-ar: 1.85` applied. Evolve values freely (spec tweak 1) — brand families fixed.
- [ ] **Step 3: Write `spacing.css` (4→160px ladder, radii xs 3px → full 999px), `motion.css` (durations 100→1000ms, eases standard/enter/exit/emphasized/cinematic/settle, `--motion-travel: 1`, and `@media (prefers-reduced-motion: reduce) { :root { --motion-travel: 0; } }`), `z.css` (nav 100, megamenu 90, overlay 200, toast 300).**
- [ ] **Step 4: Wire `globals.css`**: ordered `@import` of the five token files, then `@import "tailwindcss";`, then `@theme inline { … }` mapping semantic vars to Tailwind color/spacing/radius names, then base element styles (body bg `var(--surface-page)`, `color-scheme` from theme, focus-visible ring azure, `::selection` lime/ink).
- [ ] **Step 5: Gate + commit**

```bash
npm run typecheck && npm run lint && npm run build
git add -A && git commit -m "feat: add Fusion design token system and Tailwind theme mapping"
```

### Task 4: Fonts

**Files:**
- Create: `src/fonts/` (copy 4 woff2 from `backup/scripe-static/assets/fonts/`: `Archivo-var.woff2`, `Inter-var.woff2`, `NotoKufiArabic-var.woff2`, `NotoSansArabic-var.woff2`), `src/fonts/index.ts`

**Interfaces:**
- Produces: `latinFonts(locale)` / font class names: exports `archivo`, `inter`, `notoKufi`, `notoSans` via `next/font/local` (`display: "swap"`, `variable` names `--font-archivo` etc.). Layout applies Latin vars always; Arabic vars only when `locale === "ar"`, and sets `--font-display`/`--font-body` accordingly.

- [ ] **Step 1: Copy woff2 files (woff2 ONLY — TTFs stay in backup, ~1.5MB saved).**
- [ ] **Step 2: Write `src/fonts/index.ts` with four `next/font/local` declarations + helper `fontClassesFor(locale: "en" | "ar"): string`.**
- [ ] **Step 3: Gate + commit** (`feat: add self-hosted variable fonts with per-locale loading`).

### Task 5: i18n core (next-intl) + proxy

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `messages/en.json`, `messages/ar.json`, `src/proxy.ts`, `src/i18n/routing.test.ts`
- Modify: `next.config.ts` (wrap with `createNextIntlPlugin`), `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `routing = defineRouting({ locales: ["en","ar"], defaultLocale: "en", localePrefix: "always" })`; `Link/redirect/usePathname/useRouter` from `createNavigation(routing)`; `dirFor(locale): "ltr" | "rtl"` exported from `routing.ts`. Messages namespaces: `nav`, `footer`, `common`, `forms`.

- [ ] **Step 1: Write failing test `src/i18n/routing.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { routing, dirFor } from "./routing";

test("locales and default", () => {
  assert.deepEqual(routing.locales, ["en", "ar"]);
  assert.equal(routing.defaultLocale, "en");
});
test("dirFor maps ar to rtl", () => {
  assert.equal(dirFor("ar"), "rtl");
  assert.equal(dirFor("en"), "ltr");
});
```

Run: `npm test` — Expected: FAIL (module not found).

- [ ] **Step 2: Implement `routing.ts` (+ `dirFor`), `request.ts` (`getRequestConfig` loading `messages/{locale}.json`), `navigation.ts`.**
- [ ] **Step 3: Write `src/proxy.ts`** — next-intl middleware with cookie detection disabled on cacheable paths:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing, { localeCookie: false });

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

(`localeCookie: false` = never `set-cookie` on cacheable HTML — spec §4.1. `/` redirects to `/en` or `/ar` via Accept-Language.)

- [ ] **Step 4: Seed `messages/en.json` + `messages/ar.json`** with `nav` (platform/solutions/pricing/resources/company/contact labels), `common` (cta labels, theme/lang switch aria), `forms` (validation strings) — AR values ported from `backup/scripe-static/js/lang-ar.js` keys, not machine-translated.
- [ ] **Step 5: Update layout to `generateStaticParams` from `routing.locales`, `dynamicParams = false`, `setRequestLocale`, `<html lang={locale} dir={dirFor(locale)}>`.**
- [ ] **Step 6: Run `npm test` (PASS) + gate + commit** (`feat: add next-intl locale routing with rtl support`).

### Task 6: Theme system (pre-paint script + toggle)

**Files:**
- Create: `src/theme/theme-script.ts`, `src/components/chrome/ThemeToggle.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `THEME_SCRIPT: string` (inline IIFE), `ThemeToggle` client component. Storage key `"scripe-theme"` (`"dark" | "light"`; absent = follow system, dark-leaning default per spec). Sets `data-theme` + `style.colorScheme` on `<html>`, repaints `<meta name="theme-color">` (`#0B0B0E` dark / `#F1F2F2` light).

- [ ] **Step 1: Write `theme-script.ts`**

```ts
export const THEME_SCRIPT = `(function(){try{
var t=localStorage.getItem("scripe-theme");
var dark=t==="light"?false:t==="dark"?true:!matchMedia("(prefers-color-scheme: light)").matches;
var e=document.documentElement;
e.setAttribute("data-theme",dark?"dark":"light");
e.style.colorScheme=dark?"dark":"light";
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",dark?"#0B0B0E":"#F1F2F2");
}catch(e){}})();`;
```

(Note: default resolves dark unless OS explicitly prefers light — dark is brand default.)

- [ ] **Step 2: Inject in layout `<head>`: `<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />`, add `suppressHydrationWarning` on `<html>`, static `<meta name="theme-color" content="#0B0B0E" />`.**
- [ ] **Step 3: Write `ThemeToggle.tsx`** — `"use client"`; reads `data-theme` after mount (`useState<null | "dark" | "light">` + `useEffect`), toggles attribute + localStorage + colorScheme + meta; sun/moon SVG; `aria-label` from `common` messages; renders neutral placeholder until mounted (no hydration mismatch).
- [ ] **Step 4: Gate + commit** (`feat: add pre-paint theme script and theme toggle`).

### Task 7: Content pipeline + parity harness

**Files:**
- Create: `src/content/types.ts`, `src/content/index.ts`, `src/content/en/home.ts`, `src/content/ar/home.ts` (skeletons), `src/content/parity.test.ts`

**Interfaces:**
- Produces: per-page content interfaces (e.g. `HomeContent`) in `types.ts`; `getContent(locale, page)` in `index.ts` with a `CONTENT_REGISTRY: Record<Locale, Record<PageId, unknown>>`; `PageId = "home" | "platform" | "solutions" | "solutionClubs" | "solutionAcademies" | "solutionVenues" | "solutionMultiSport" | "pricing" | "resources" | "company" | "contact" | "notFound"`. Later page tasks add `en/<page>.ts` + `ar/<page>.ts` pairs and register them.

- [ ] **Step 1: Write failing `parity.test.ts`** — walks `CONTENT_REGISTRY`, asserts for every registered PageId: both locales present and `deepKeys(en) === deepKeys(ar)` (recursive key-path comparison; arrays compared by length + element key shape). Include the `deepKeys` implementation in the test file (~20 lines).
- [ ] **Step 2: Implement types + registry with `home` skeleton (hero title/sub/cta only, real copy from backup index.html + lang-ar.js). Run `npm test` — PASS.**
- [ ] **Step 3: Gate + commit** (`feat: add typed bilingual content pipeline with key-parity test`).

---

## Phase 2 — Design System & Chrome

### Task 8: UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Section.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Eyebrow.tsx`, `src/components/ui/Field.tsx`

**Interfaces:**
- Produces: `Button` (`variant: "primary" | "ghost" | "outline"`, `size: "md" | "lg"`, renders `<a>` via next-intl `Link` when `href` given; primary = lime fill + ink text); `Section` (`id?`, `width: "default" | "wide" | "full"`, consistent block padding); `Card` (`accent?: "academy" | "venue" | "fi" | "club"` top-edge accent); `Eyebrow` (kicker label); `Field` (`label`, `error?`, `hint?`, wires `aria-describedby`/`aria-invalid`). All Server Components except none — keep them server-safe (no hooks).

- [ ] **Step 1: Implement all five with Tailwind utilities consuming token colors (`bg-surface-raised`, `text-text-primary`, etc.). Reference `backup/_ds` component prompts + standalone repo DS for quality bar — do not copy verbatim; this is the Fusion design.**
- [ ] **Step 2: Gate + commit** (`feat: add core ui primitives`).

### Task 9: Site chrome (NavBar, MegaMenu, mobile sheet, Footer, LocaleSwitch)

**Files:**
- Create: `src/components/chrome/NavBar.tsx`, `src/components/chrome/MegaMenu.tsx` (client), `src/components/chrome/MobileNav.tsx` (client), `src/components/chrome/LocaleSwitch.tsx`, `src/components/chrome/Footer.tsx`, `src/components/chrome/ia.ts`
- Modify: `src/app/[locale]/layout.tsx` (render NavBar + Footer around children)

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation`, messages `nav`/`footer`, `ThemeToggle`.
- Produces: `IA` const in `ia.ts` — single source for nav + footer links: primary `[platform, solutions, pricing, resources, company]`, solutions submenu `[sports-clubs, sports-academies, sports-venues, multi-sports-organizations]`, CTAs `[contact (primary), signIn → app]`, footer columns (Product / Solutions / Company / Legal) — mirror `backup/scripe-static/js/navbar.js` definitions.

- [ ] **Step 1: Write `ia.ts` from backup navbar.js IA (paths as route hrefs without locale prefix — `Link` adds it).**
- [ ] **Step 2: Build NavBar (sticky, translucent obsidian blur, logo SVG from `backup/scripe-static/assets/brand/scripe-logo-*.svg` — move used SVGs to `public/brand/`), MegaMenu for Solutions (keyboard accessible: arrow keys, Escape, focus trap), MobileNav sheet, LocaleSwitch (segmented `EN / ع` linking to same pathname in other locale via `Link locale="ar"`), Footer from IA.**
- [ ] **Step 3: RTL pass: verify all chrome uses logical properties; directional chevrons get `rtl:-scale-x-100` only where meaning is directional.**
- [ ] **Step 4: Gate + commit** (`feat: add site chrome with mega menu, locale switch and footer`).

### Task 10: Motion infrastructure

**Files:**
- Create: `src/components/motion/Reveal.tsx` (client), `src/components/motion/LazyMotionProvider.tsx` (client), `src/lib/gsap.ts`, `src/styles/motion-utilities.css` (imported by globals.css)

**Interfaces:**
- Produces: `Reveal` (`as?`, `delay?`, `y?`) — IntersectionObserver-driven reveal using CSS classes + `--motion-travel` (no JS animation lib for reveals); `motion-utilities.css` — `.rv` hidden/shown states, staggered children helper, CSS scroll-driven animation `@supports (animation-timeline: view())` progressive enhancement with IO fallback; `LazyMotionProvider` wrapping `LazyMotion features={domAnimation}` for micro-interactions; `loadGsap(): Promise<{ gsap, ScrollTrigger }>` dynamic import, registered once, `matchMedia`-gated on `(prefers-reduced-motion: no-preference)`.

- [ ] **Step 1: Implement all four. Reveal must render content visible when JS absent (`.no-js` / no-IO fallback — content never trapped hidden).**
- [ ] **Step 2: Gate + commit** (`feat: add css-first motion infrastructure with gsap loader`).

---

## Phase 3 — SEO Infrastructure

### Task 11: JSON-LD builders

**Files:**
- Create: `src/lib/seo/jsonld.ts`, `src/lib/seo/jsonld.test.ts`, `src/components/seo/JsonLd.tsx`

**Interfaces:**
- Produces: `buildOrganization(siteUrl)`, `buildSoftwareApplication(siteUrl, locale)`, `buildBreadcrumb(items: {name, url}[])` returning plain objects; `JsonLd({ data })` rendering `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")`.

- [ ] **Step 1: Write failing tests** — Organization has `@type: "Organization"`, `url`, `logo`; Breadcrumb positions are 1-based sequential; serialized output contains no raw `<`.
- [ ] **Step 2: Implement; `npm test` PASS.**
- [ ] **Step 3: Commit** (`feat: add json-ld builders`).

### Task 12: Metadata, sitemap, robots, manifest, OG images

**Files:**
- Create: `src/lib/seo/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`, `src/app/[locale]/opengraph-image.tsx`
- Modify: `src/app/[locale]/layout.tsx` (root metadata + Organization JsonLd)

**Interfaces:**
- Produces: `siteUrl()` (reads `SITE_URL`, default `https://www.scripe.org`); `pageMetadata({ locale, path, title, description })` → Metadata with canonical + `alternates.languages` ({ en, ar, "x-default" }) + OG/twitter. `ROUTES: { id: PageId; path: string; changeFrequency; priority }[]` shared by sitemap. `robots.ts`: allow all when `process.env.VERCEL_ENV === "production"`, else disallow all.

- [ ] **Step 1: Implement all; sitemap emits both locale URLs per route with `alternates.languages`.**
- [ ] **Step 2: `opengraph-image.tsx`**: `ImageResponse` 1200×630 — obsidian ground, lime accent bar, Archivo (load woff2 via `fetch` of file buffer), page title + `scripe` wordmark. AR variant renders RTL text — flag for visual QA in Task 26.
- [ ] **Step 3: Gate + commit** (`feat: add seo metadata, localized sitemap, robots and og images`).

---

## Phase 4 — Pages

**Pattern for every page task (applies to Tasks 13–20; steps listed once here, repeat per page):**
1. Port copy: EN from `backup/scripe-static/<page>.html`, AR from `backup/scripe-static/js/lang-ar.js` → `src/content/en/<page>.ts` + `src/content/ar/<page>.ts` matching a new interface in `types.ts`; register in `CONTENT_REGISTRY`. Run `npm test` (parity PASS).
2. Design sections (design-critical: load `frontend-design` + `impeccable:impeccable`; doctrine spec §8). Build as Server Components in `src/components/sections/<page>/`, motion via Reveal/CSS; GSAP only for signature moments.
3. **Asset gate:** if the design needs imagery you cannot generate → emit production-ready prompt(s), STOP the section, continue other sections. Integrate user-delivered assets via `next/image` (AVIF/WebP, correct `sizes`).
4. Page file: `setRequestLocale`, `pageMetadata(...)`, `JsonLd` breadcrumb, compose sections.
5. Gate `typecheck && lint && build`, both locale routes render in build output.
6. Commit (`feat: build <page> page`).

### Task 13: Home page

**Files:**
- Create: `src/content/{en,ar}/home.ts` (full), `src/components/sections/home/*` (Hero, TrustStrip, ProductFamily, PlatformOverview, SolutionsGrid, AutomationStory, BranchesStory, ClosingCta), modify `src/app/[locale]/page.tsx`

**Notes:**
- Hero = **Camera-Hero concept, elevated** (spec tweak 2): scroll-scrubbed camera over an environment. Rebuild with GSAP ScrollTrigger scrub + transform-only moves on layered plates. Source imagery: `backup/scripe-static/assets/images/campus.jpg` is the incumbent single plate — for the elevated multi-plate version, emit asset prompts (campus environment, foreground/mid/background separations, 21:9-safe, obsidian-night grade with lime signal accents) and STOP hero polish until assets arrive; ship structure + incumbent plate meanwhile so the page is never blocked.
- Section flow mirrors backup `index.html` anchors (`#trusted #product #platform #solutions #automation #branches`) — redesigned presentation, same narrative spine.
- Reduced-motion: camera scrub degrades to static composed frame + fade-ins.

### Task 14: Platform page

**Files:** `src/content/{en,ar}/platform.ts`, `src/components/sections/platform/*`, `src/app/[locale]/platform/page.tsx`
**Notes:** 13 capability modules from backup `platform.html` → capability grid grouped by product family with per-family accent tokens; sticky in-page subnav; module detail rows alternate with media frames (asset gates per family scene as needed).

### Task 15: Solutions hub + 4 solution pages

**Files:** `src/content/{en,ar}/solutions.ts` + `solution-{clubs,academies,venues,multi-sport}.ts`, `src/components/sections/solutions/*`, `src/app/[locale]/solutions/page.tsx`, `src/app/[locale]/solutions/[slug]/page.tsx`
**Interfaces:** `generateStaticParams` returns the 4 slugs (`sports-clubs`, `sports-academies`, `sports-venues`, `multi-sports-organizations`); shared `SolutionContent` interface (hero, painPoints[], capabilities[], outcomes[], cta) renders all four from one template with per-solution accent + imagery (asset gate per solution hero).

### Task 16: Pricing page (static shell)

**Files:** `src/content/{en,ar}/pricing.ts`, `src/components/sections/pricing/*` (PlanCards, BillingToggle (client), ComparisonTable, PricingFaq), `src/app/[locale]/pricing/page.tsx`
**Interfaces:**
- Produces: `PlanId = "starter" | "growth" | "enterprise"`; `PricingContent` with per-plan `{ baseMonthly, baseYearly, baseCurrency: "SAR" }` — seed SAR 990/9,900 (starter), 2,490/24,900 (growth), enterprise custom. **Step:** cross-check base prices against `SCRIPE-Frontend\src\modules\shared\auth\signup\src\presentation\viewmodels\usePlanPicker.ts` + plan constants; if signup uses USD bases, record both (`baseUsd`) in content for Task 21 conversion.
- Price slots render server-side SAR values inside fixed-width containers (`min-inline-size` reserving widest currency string) — zero CLS when Task 21 hydrates.
**Notes:** billing toggle swaps monthly/yearly from content (client leaf, no fetch). Comparison table `overflow-x-auto` container. No FAQPage schema.

### Task 17: Resources page

**Files:** `src/content/{en,ar}/resources.ts`, `src/components/sections/resources/*`, `src/app/[locale]/resources/page.tsx`
**Notes:** guides/FAQ/product-reading sections from backup `resources.html`. Content shape `ResourceItem[]` with `kind: "guide" | "faq" | "article"` — the future MDX pipeline maps onto this same shape (spec §5.3), no restructure later.

### Task 18: Company page

**Files:** `src/content/{en,ar}/company.ts`, `src/components/sections/company/*`, `src/app/[locale]/company/page.tsx`
**Notes:** mission/vision/operating principles + `#legal` anchor placeholder section (id preserved for inbound links).

### Task 19: Contact page (UI only; action wired in Task 22)

**Files:** `src/content/{en,ar}/contact.ts`, `src/components/sections/contact/ContactForm.tsx` (client), `src/app/[locale]/contact/page.tsx`
**Interfaces:**
- Produces: form fields exactly: `name*` (≤120), `email*` (≤254), `organization*` (≤160), `phone` (≤40), `type` (select: club/academy/venue/multi-sport/other), `message` (≤4000); hidden honeypot `company_website`; hidden `startedAt` timestamp (time-trap). Field-level errors from `forms` messages via `Field` primitive. Submits to `submitLead` Server Action (Task 22 provides; until then a local stub returning `{ ok: false, reason: "not-connected" }` renders the honest "not yet connected" panel).

### Task 20: Localized 404

**Files:** `src/content/{en,ar}/notFound.ts`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx` (calls `notFound()`)
**Notes:** noindex via `robots: { index: false }` metadata; link home + top pages.

---

## Phase 5 — Live Integrations

### Task 21: Live pricing (geo currency)

**Files:**
- Create: `src/lib/pricing/pricing-context.ts`, `src/lib/pricing/convert.ts`, `src/lib/pricing/convert.test.ts`, `src/components/sections/pricing/LivePrices.tsx` (client), `src/components/sections/pricing/CurrencySelect.tsx` (client)
- Modify: `src/components/sections/pricing/PlanCards.tsx`

**Interfaces:**
- Produces:

```ts
// pricing-context.ts
export interface PricingContext {
  detectedCountry: string;
  recommendedCurrency: string;
  supportedCurrencies: { code: string; rateFromUsd: number }[];
}
export async function fetchPricingContext(signal?: AbortSignal): Promise<PricingContext | null>;
// GET `${NEXT_PUBLIC_API_BASE_URL}/v1/auth/signup/pricing-context`, 5s timeout, null on any failure.

// convert.ts
export function convertPrice(baseUsd: number, rateFromUsd: number): number; // round to sensible tier (≥100 → nearest 10)
export function formatPrice(amount: number, currency: string, locale: string): string; // Intl.NumberFormat, currencyDisplay: "narrowSymbol"
```

- [ ] **Step 1: Write failing `convert.test.ts`** — conversion rounding cases (e.g. `convertPrice(264, 3.75)` → `990`), `formatPrice(990, "SAR", "ar")` contains Arabic-locale formatting with Western digits (`numberingSystem: "latn"`).
- [ ] **Step 2: Implement; `npm test` PASS.**
- [ ] **Step 3: `LivePrices`** — mounts, fetches context, renders converted prices into the reserved slots; on `null` keeps baked SAR (no layout change either way); `CurrencySelect` always visible listing `supportedCurrencies`, selection stored `localStorage["scripe-currency"]`, overrides geo recommendation.
- [ ] **Step 4: Confirm CORS**: note in Open Items — endpoint must allow `https://www.scripe.org` origin (backend task; site degrades gracefully meanwhile).
- [ ] **Step 5: Gate + commit** (`feat: add live geo currency pricing with manual override`).

### Task 22: Contact server action

**Files:**
- Create: `src/lib/leads/submit-lead.ts` (server action), `src/lib/leads/validate.ts`, `src/lib/leads/validate.test.ts`
- Modify: `src/components/sections/contact/ContactForm.tsx` (wire real action)

**Interfaces:**
- Produces:

```ts
// validate.ts
export interface LeadInput { name: string; email: string; organization: string; phone?: string; type?: string; message?: string; companyWebsite?: string; startedAt?: number; }
export type LeadValidation = { ok: true; lead: LeadInput } | { ok: false; fieldErrors: Record<string, string> } | { ok: false; spam: true };
export function validateLead(input: LeadInput, now?: number): LeadValidation;
// spam when honeypot non-empty OR (now - startedAt) < 3000ms. Field limits per Task 19. Email RFC-basic regex.

// submit-lead.ts ("use server")
export async function submitLead(prev: unknown, formData: FormData): Promise<{ status: "sent" | "not-connected" | "invalid" | "spam"; fieldErrors?: Record<string, string> }>;
// POSTs JSON to `${LEADS_ENDPOINT}` env (server-only); when unset returns "not-connected" (honest panel). Spam submissions return "sent" (silent discard — never teach the bot).
```

- [ ] **Step 1: Write failing `validate.test.ts`** — valid lead passes; honeypot filled → spam; too-fast submit → spam; over-limit fields → fieldErrors; bad email → fieldErrors.
- [ ] **Step 2: Implement; `npm test` PASS.**
- [ ] **Step 3: Wire form with `useActionState`; success/not-connected/invalid states rendered from `forms` messages in both locales.**
- [ ] **Step 4: Gate + commit** (`feat: add contact lead server action with spam protection`).

---

## Phase 6 — QA & Launch

### Task 22.5: Deprecation & convention sweep (added 2026-08-18, user directive)

**Files:** any file using a deprecated API; report-driven.

- [ ] **Step 1: Research-verified migration for `setRequestLocale`** — deprecated (TS6385) in installed next-intl; official successor is Next 16 `next/root-params` (`await rootParams()` / generated `lang()`). Use the controller-provided research findings; do not guess API shapes.
- [ ] **Step 2: Sweep for ALL deprecation warnings**: run `npm run typecheck` with deprecation reporting (tsc reports TS6385/TS6387 via editor; grep `@deprecated` usages: `grep -rn "setRequestLocale\|@deprecated" src/ --include=*.ts*`), plus `npm run build` output warnings, plus `npx next lint` deprecation rules. Inventory every hit in the report.
- [ ] **Step 3: Migrate each deprecated usage** to the current API per research; architecture rules intact (RSC-first, static prerender must survive — verify build output unchanged route-wise).
- [ ] **Step 4: Convention violation scan**: physical left/right outside sanctioned blocks, hardcoded hex outside token files (except documented single-look moments), undefined Tailwind tokens (classes that compile to nothing), duplicated `.rtl-flip` definitions. Fix or ledger each with justification.
- [ ] **Step 5: Gate + commit** (`refactor: migrate deprecated apis and sweep conventions`).

### Task 23: Bundle + budget audit

- [ ] **Step 1: `npm run build`; record per-route First Load JS. Gate: marketing routes ≤ ~100KB gzip. If over: hunt stray `"use client"`, dynamic-import GSAP-consuming sections, verify motion stays LazyMotion `m`.**
- [ ] **Step 2: Verify zero third-party requests: grep built output/source for external origins — only `NEXT_PUBLIC_API_BASE_URL` allowed (fonts/images all self-hosted).**
- [ ] **Step 3: Commit fixes** (`perf: enforce bundle budgets`).

### Task 24: Accessibility + RTL + reduced-motion pass (code audit)

- [ ] **Step 1: Sweep all components:** every interactive element keyboard-reachable + visible focus; MegaMenu/MobileNav focus management; form `aria-*` wiring; heading hierarchy per page; `<bdi>` on Latin-in-Arabic strings; no physical left/right outside sanctioned blocks (`grep -rn "left\|right" src/components src/styles` and justify each hit); every animation consumes `--motion-travel` or is inside `no-preference` guard; auto-playing hero motion has visible pause control (WCAG 2.2.2).
- [ ] **Step 2: Fix findings, gate, commit** (`fix: accessibility, rtl and reduced-motion audit findings`).

### Task 25: Content + SEO verification

- [ ] **Step 1: `npm test` (parity across ALL registered pages — every page task registered its pair).**
- [ ] **Step 2: Build output check: every route × both locales prerendered as static (`○`/`●` markers); sitemap contains 12 routes × 2 locales with alternates; robots gated by `VERCEL_ENV`; canonical/OG URLs use `SITE_URL` — zero `__SITE_URL__`-style placeholders anywhere.**
- [ ] **Step 3: Commit fixes** (`fix: seo verification findings`).

### Task 25.5: Hero plates integration (added 2026-08-18 — user-delivered assets)

**Files:** `src/components/sections/home/Hero.tsx`, `HeroDirector.tsx`, `src/styles/home.css`, `public/media/hero/` (copies of `assets/hero-plates/*`)

- [ ] **Step 1:** Copy the 4 delivered plates from `assets/hero-plates/` into `public/media/hero/` with stable kebab names (`plate-background.png`, `plate-midground.png`, `plate-foreground.png`, `plate-finale.png`); keep `assets/hero-plates/` as the drop-in source for future higher-res replacements (same names re-copy).
- [ ] **Step 2:** Per the Hero integration contract (Task 13 report §8): background plate replaces `campus.jpg` as the rig's base `next/image` (priority); midground cutout + bokeh foreground stack as sibling layers inside `.hero-rig` with GSAP depth multipliers (mid ×1.15, near ×1.4); finale plate crossfades in across scrub 0.76→0.86.
- [ ] **Step 3:** Reduced-motion/no-JS static frame recomposed with the new background plate (single flattened layer, no parallax). Foreground layer `aria-hidden` + `pointer-events: none`.
- [ ] **Step 4:** Known limitation documented: plates are 1915×821 (below 3440×1476 target) — cap the camera scale if softness is visible in reasoning; note the drop-in upgrade path.
- [ ] **Step 5:** Gate (`npm test && typecheck && lint && build`, both locales static) + commit `feat: integrate cinematic hero plates`.

### Task 26: OG/AR visual QA + walkthrough doc

- [ ] **Step 1: Render OG images at build (hit route files in build output); inspect AR OG rendering (Satori RTL is best-effort — adjust template if glyph order/alignment wrong).**
- [ ] **Step 2: Write `docs/walkthroughs/2026-XX-XX-website-rebuild.md`:** what shipped, per-page screenshots deferred (no live preview rule), budgets recorded from Task 23, open items status (CORS, leads endpoint, DNS, analytics decision), asset-gate registry (delivered vs pending prompts).**
- [ ] **Step 3: Commit** (`docs: add rebuild walkthrough`).

### Task 27: Launch prep

- [ ] **Step 1: Vercel project config note (in walkthrough): root = repo root, `SITE_URL=https://www.scripe.org`, `NEXT_PUBLIC_API_BASE_URL`, `LEADS_ENDPOINT` (when ready); apex→www redirect at Vercel domain level.**
- [ ] **Step 2: Update parent monorepo submodule pointer:**

```bash
cd /d/01_PROJECTS/SCRIPE
git add SCRIPE-Website
git commit -m "chore: update website submodule to fusion rebuild"
```

- [ ] **Step 3: Final full gate: `npm run typecheck && npm run lint && npm test && npm run build` — all green. Report exact results; state what is verified and what remains unverified (field CWV, CORS, DNS).**
