# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The public marketing site for SCRIPE (scripe.org) — a Next.js 16 (App Router) site, not the product application. Bilingual (English/Arabic, real RTL), dark-theme-only at present (deliberately, not a bug — see Theming below). No database, no server-side session, no third-party analytics or trackers.

## Commands

```bash
npm install
npm run dev          # dev server — writes to .next-dev, NOT .next (see Build output isolation below)
npm run build        # production build — writes to .next
npm run start         # serve a production build

npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm test              # node's built-in test runner over src/**/*.test.ts (no Jest/Vitest)

npm run brand:build   # regenerate brand assets (favicons, manifest icons) from assets/brand/
npm run media:build   # regenerate every public/media/** derivative from assets/
npm run fonts:subset  # regenerate self-hosted, subsetted font files
```

Run a single test file directly (the `test` script's glob is package.json's default, not a constraint):

```bash
node --import tsx --test src/content/parity.test.ts
```

Before any commit, all four must pass: `typecheck`, `lint`, `test`, `build`. They catch different things — passing three of four has let real bugs through before. If a change touches `src/styles/`, `public/media/`, or the hero, also look at it in a browser; the test suite checks arithmetic and structure, not whether a scroll transition feels right.

## Architecture

### Content is data, not JSX — and it's typed and bilingual by construction

Long-form page copy lives in `src/content/en/<page>.ts` and `src/content/ar/<page>.ts`, typed against shared interfaces in `src/content/types.ts`. Components never hardcode copy; they call `getContent<T>(page, locale)` from `src/content/index.ts`, which looks the page up in `CONTENT_REGISTRY` and throws if a page or locale entry is missing. This is a hard boundary: content files never import components, and components never reach into a locale file directly.

`src/content/parity.test.ts` fails the build if a key exists in one locale's content and not the other — there is no code path that ships an English-only page by accident. Arabic is authored copy (not machine-translated), and RTL is real logical-property CSS (`start`/`end`, `ms-`/`me-`), not a mirrored LTR stylesheet.

This content layer (`src/content/`) is distinct from `messages/*.json`, which holds short UI strings consumed directly by next-intl.

### i18n routing

`src/i18n/routing.ts` defines locales (`en`, `ar`, default `en`) via next-intl's `defineRouting`, with `localePrefix: "always"` and `localeCookie: false` — locale is resolved from the URL prefix and `Accept-Language` only, deliberately never persisted client-side (avoids `Set-Cookie` on cacheable HTML). Both locales share one route tree under `src/app/[locale]/`; there is no per-locale route duplication and no `if (locale === "ar")` branching in UI code.

### Theming is locked to dark, on purpose, behind one flag

`src/theme/theme-lock.ts` exports `THEME_LOCKED_TO_DARK = true`. Light theme is fully built (tokens, stylesheets, `ThemeToggle.tsx`) but withheld because the hero's chapter photography only exists as night frames and the day/night base plates are shot at different facilities — not a code gap. Exactly three consumers read the flag: `theme-script.ts` (pre-paint resolver), `ThemeGuard.tsx` (client re-assert), and `NavBar.tsx` (hides the toggle). Both storage readers are locked deliberately so a visitor's previously-stored `"light"` preference is suspended, not destroyed — it's honored again the moment the flag flips to `false`. Do not delete light-theme code to "clean up" the dark-only period; flipping this one flag is the intended way to resume theming.

### Motion has three tiers — pick the cheapest one that works

1. CSS (`motion-utilities.css`) — default choice.
2. Motion (`m` components via `LazyMotionProvider`) — second choice.
3. GSAP, via `loadGsap()` in `src/lib/gsap.ts` — reserved for sequencing/`ScrollTrigger` work CSS and Motion can't express.

`loadGsap()` is the only sanctioned way to obtain `gsap`/`ScrollTrigger` in this codebase: it dynamically imports both so the payload only downloads on pages that call it, registers `ScrollTrigger` exactly once regardless of how many sections call it, and returns `null` *before* importing anything when running server-side or when `prefers-reduced-motion: reduce` is set — reduced-motion users never pay for the GSAP chunk at all. Callers must treat `null` as "render the static fallback," not as an error to retry.

Home hero timing constants are derived from stated formulas in comments, not tuned by feel; `src/components/sections/home/hero-timing.test.ts` parses the constants out of source and asserts chapter windows tile with no gaps. Follow this derive-and-test pattern for any other hand-tuned numeric constant.

### Asset pipeline: `assets/` is the only source of truth

`public/media/**` is entirely generated from `assets/` by `scripts/build-media-assets.mjs` (`npm run media:build`) — never hand-edit anything under `public/media/`. The scripts are mechanical only (copy, crop, resize, re-encode); nothing under `scripts/` generates or upscales imagery. To add a new image: drop it in the right `assets/` subfolder, register it in `HERO_PLATES` or `PHOTO_MASTERS` in `scripts/build-media-assets.mjs` with a comment explaining the choice, then run `npm run media:build`. `assets/unused/` keeps rejected frames named for *why* they lost, so that decision isn't re-litigated later.

### Build output isolation (`distDir`)

`next.config.ts` branches `distDir` on the Next.js `phase` argument (not `NODE_ENV`, which can be inherited as `"development"` from a process manager even during a production `next start`): `next dev` writes to `.next-dev`, everything else writes to `.next`. This exists because both would otherwise share one `cache/` directory, and a build running concurrently with a stray dev server can corrupt it. ESLint's ignore list and `tsconfig.json`'s `include` both account for `.next-dev/**` separately from `.next/**` — if you ever rename or remove one dist dir, check both configs.

### Security headers and CSP

Security headers (HSTS, CSP, `X-Content-Type-Options`, `Permissions-Policy`, `Referrer-Policy`) are set in `next.config.ts`, applied to every route. The CSP's `connect-src` is derived as `new URL(NEXT_PUBLIC_API_BASE_URL).origin` rather than interpolating the raw env value — the documented API base is path-bearing (`.../api`), and per CSP3 a path-bearing source requires an exact path match, so using it verbatim would silently block every API path except that literal one. If you change the API base URL shape, keep this derivation.

### Leads: fail-closed spam handling, PII-free logs

`src/lib/leads/submit-lead.ts` is the contact form's server action. A spam-flagged submission (honeypot or time-trap) and a genuinely delivered one return the byte-identical `{ status: "sent" }` shape — this is deliberate: giving spam submissions a distinguishable response would let an attacker fingerprint the anti-spam logic and iterate against it. Every log call site in this file is audited to log only a fixed message plus a non-PII code (HTTP status, or `error.name` — never `.message` or the error object); it never logs the lead's name, email, org, phone, message, raw `FormData`, or any request/response body. Preserve both properties when touching this file.

### Doc-comment convention (not lint-enforced, but expected)

Every exported component, function, and type carries a doc comment explaining its role and, where relevant, the reasoning behind a specific number or rejected alternative — not a restatement of its name. This is a manual reviewing convention (`eslint.config.mjs` has no JSDoc rule configured), and it's dense enough in this codebase that reading a file's header before editing it is usually faster than re-deriving the same reasoning from scratch.

### No invented product evidence

Any stat, screenshot-shaped panel, or "proof" element on the site must be either real or explicitly labeled sample data (see `CapabilityEvidence.tsx`'s `"Sample data"` badge pattern). This has been audited and fixed more than once — don't add a number or claim that looks factual without one of those two backings.
