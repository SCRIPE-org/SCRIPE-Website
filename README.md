# SCRIPE Website

The public marketing site at [scripe.org](https://scripe.org) — SCRIPE's
Sports Operations OS: facility booking, multi-sport academy operations, and
football coach intelligence, in one connected product. This repository is
the site only; it is not the product application.

**Status:** actively developed. Bilingual (English / Arabic, real RTL, not
a mirrored stylesheet). Dark theme only at present — see
[Theming](#theming-dark-only-right-now) below before you go looking for a
light-mode toggle that doesn't render.

---

## Table of contents

- [Stack](#stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Content & internationalization](#content--internationalization)
- [Theming (dark-only, right now)](#theming-dark-only-right-now)
- [Assets & media pipeline](#assets--media-pipeline)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) — see [`AGENTS.md`](AGENTS.md), this version has real breaking changes from what most training data assumes |
| UI | [React 19](https://react.dev) |
| Language | TypeScript, strict |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + hand-authored design tokens (`src/styles/tokens/`) |
| i18n | [next-intl](https://next-intl.dev) — English + Arabic, full RTL |
| Motion | [GSAP](https://gsap.com) (scroll-scrubbed sequences, lazy-loaded, never in the initial route chunk) + [Motion](https://motion.dev) |
| Images | [`sharp`](https://sharp.pixelplumbing.com) at build time (`scripts/*.mjs`) + `next/image` at request time |
| Tests | Node's built-in test runner (`node --test`), no third-party test framework |
| Lint | ESLint (`eslint-config-next`) |

No database. No server-side session. No third-party analytics, trackers, or
scripts of any kind — see [`SECURITY.md`](SECURITY.md) for what that claim
actually means and how to verify it yourself.

## Getting started

Requires Node.js and npm. (No `.nvmrc` is currently committed — use a
current LTS Node.)

```bash
npm install
npm run dev
```

The dev server runs on its own build output directory (`.next-dev`, not
`.next`) specifically so it never collides with a production build's
cache — see the comment on `distDir` in `next.config.ts` if you're curious
why that matters.

### Environment variables

Copy `.env.example` and fill in what you need. Every variable this app
reads is documented there; nothing is a secret:

```bash
cp .env.example .env.local
```

| Variable | Required? | What it does |
|---|---|---|
| `SITE_URL` | No — has a working default | Public origin used for canonicals, OG images, and the sitemap. |
| `SITE_INDEXABLE` | No | Opts a **non-Vercel** production host into search indexing. Vercel production is auto-detected via `VERCEL_ENV`; leave unset everywhere else (previews, local dev, CI) — indexing defaults closed. |
| `NEXT_PUBLIC_API_BASE_URL` | No — has a working default | SCRIPE backend API base for the live pricing/currency feature. Public by design (`NEXT_PUBLIC_*`). |
| `LEADS_ENDPOINT` | No | Contact-form lead delivery endpoint. Server-only, never bundled to the client. Unset by default — the form still validates and submits, and honestly tells the visitor it isn't connected yet rather than faking success. See `src/lib/leads/submit-lead.ts`. |

## Scripts

```bash
npm run dev          # start the dev server (.next-dev)
npm run build        # production build
npm run start        # serve a production build

npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # node's built-in test runner, src/**/*.test.ts

npm run brand:build  # regenerate brand assets (favicons, manifest icons, etc.) from assets/brand/
npm run media:build  # regenerate every public/media/** derivative from assets/ — see below
npm run fonts:subset # regenerate the subsetted, self-hosted font files
```

Before committing, run all four gate commands
(`typecheck`, `lint`, `test`, `build`) — see
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the full pre-commit checklist.

## Project structure

```
src/
  app/[locale]/       Routes — one folder per page, both locales share
                       one route tree via next-intl's [locale] segment
  components/
    chrome/            Nav, footer, mobile nav, theme toggle, locale switch
    sections/          Page-specific sections, one subfolder per page
    motion/            Reveal-on-scroll and other shared motion primitives
    seo/               JSON-LD and structured-data components
    ui/                Generic building blocks (Button, Section, PlatePhoto…)
  content/
    en/, ar/           One file per page, per locale — the actual copy
    types.ts           The typed contract every content file must satisfy
  lib/                 Framework-agnostic logic: leads, pricing, SEO helpers,
                       the theme-mode store, GSAP's lazy loader
  theme/               Theme resolution: the pre-paint script, the lock
                       (see Theming below), the client-side guard
  styles/
    tokens/            Design tokens — color, type, spacing, motion, elevation
    *.css              Per-surface stylesheets (home.css, platform.css…)
  i18n/                Locale routing config
  fonts/                Self-hosted, subsetted font files + loaders

assets/                 SOURCE images — see assets/README.md. This is the
                        one place to drop a new photograph; everything under
                        public/media/ is GENERATED from here.
public/                 Static files Next.js serves directly, including the
                        generated media/ tree — never hand-edit public/media/

scripts/                Build-time asset pipelines (media, brand, fonts) —
                        all plain Node, no third-party build tool

docs/                   Audits, walkthroughs, asset briefs — the durable
                        written record of what shipped and why
```

Every non-trivial file starts with a doc comment explaining its role, the
constraints it's satisfying, and — where relevant — the reasoning behind a
specific number or decision. Read the header before you change the file;
it's usually faster than re-deriving the same reasoning from scratch.

## Content & internationalization

Every page's copy lives in `src/content/en/<page>.ts` and
`src/content/ar/<page>.ts`, typed against a shared interface in
`src/content/types.ts`. Components never hardcode strings — they read
through this layer, which is what makes both locales share one route tree
and one component tree with zero `if (locale === "ar")` branching in the
UI.

Arabic is **authored copy**, not machine-translated English — most `ar/*.ts`
files document in their own header which legacy dictionary source a given
string traces back to, and which strings are new and composed for this
site specifically. RTL is real logical-property CSS (`start`/`end`,
`ms-`/`me-`), not a mirrored stylesheet or a `dir="rtl"` hack layered on
top of an LTR one.

`src/content/parity.test.ts` fails the build if a key exists in one locale
and not the other — there is no way to ship an English-only page by
accident.

## Theming (dark-only, right now)

**The site currently ships dark theme only.** This is a deliberate, logged
decision — not a bug, and not the finished state.

SCRIPE's brand identity is an obsidian, night-cinematic film; light was
always the second theme, not a peer. It's fully designed and it works, but
two known gaps kept it from shipping alongside dark: the home hero's
establishing photographs exist as night frames only, and the day-theme base
plate is shot at a different facility than the night one. Rather than ship
a visibly half-finished second theme, the toggle is withdrawn behind a
single flag.

**Nothing was deleted.** Every light-theme token, stylesheet rule, and the
`ThemeToggle` component itself are untouched in the tree. The entire
mechanism is one export:

```ts
// src/theme/theme-lock.ts
export const THEME_LOCKED_TO_DARK = true;
```

Flip that to `false` and light theme, and the toggle that reaches it, both
come back — no rebuild of anything else required. If you're looking at this
repo wondering where the theme switcher went, it's not missing; it's
parked.

## Assets & media pipeline

`assets/` is the single source of truth for every photograph and brand
asset on the site. `public/media/` is entirely **generated** from it by
`scripts/build-media-assets.mjs` (`npm run media:build`) — nothing under
`public/media/` should ever be hand-edited or treated as a source.

```
assets/
  brand/    The 3D brand mark and app icon, as delivered
  hero/     The home hero's own film — background, midground, foreground,
            finale, and the three per-chapter establishing photographs —
            named by their ROLE in the flight, not by whatever the
            generating tool called the file
  pages/    One framed photograph per page slot (<page>-<subject>.png)
  unused/   Delivered frames nothing consumes, each named for WHY it lost
            (a defect, a brand mismatch, an honesty concern) so the
            decision doesn't have to be re-litigated by someone re-opening
            the folder later
```

See [`assets/README.md`](assets/README.md) for the full naming convention
and the reasoning behind every file currently in `unused/`.

To add a new image: drop it in the right `assets/` subfolder under a
name that describes its job, add an entry to `HERO_PLATES` or
`PHOTO_MASTERS` in `scripts/build-media-assets.mjs` with a comment
explaining the choice, then run `npm run media:build`.

## Testing

```bash
npm test
```

Runs every `src/**/*.test.ts` file through Node's built-in test runner —
no Jest, no Vitest, no third-party test framework. Coverage includes:

- **Content parity** (`src/content/parity.test.ts`) — every EN key has an
  AR counterpart and vice versa.
- **Routing** (`src/i18n/routing.test.ts`) — locale routing behaves as
  configured.
- **SEO metadata** — OG images resolve to the correct locale, the sitemap's
  route count and exclusions are correct, `siteUrl` falls back correctly.
- **Hero timing invariants**
  (`src/components/sections/home/hero-timing.test.ts`) — the home hero's
  scroll-scrubbed timeline is authored as *derived* numbers (a chapter photo
  holds for exactly this many pixels because of this formula), and these
  tests parse the constants straight out of source and assert the
  relationships hold: chapter windows tile with no gap, captions hand off
  cleanly, nothing is scheduled past the end of the track. If you touch
  `HeroDirector.tsx`'s timing constants, these are what catch a broken
  derivation instead of a human having to re-derive it by eye.

There is currently no browser/E2E test suite committed to the repo —
UI and visual verification for hero motion, theming, and responsive layout
is done manually against a running build. See open items tracked in
`docs/` if you're picking up that gap.

## Security

See [`SECURITY.md`](SECURITY.md) for the reporting process, what security
controls actually exist in this repo today, and — just as importantly —
what doesn't exist yet, stated plainly rather than implied.

Short version: real CSP and security headers on every route
(`next.config.ts`), zero third-party scripts or trackers, no secrets belong
in this repository, and every environment variable this app reads is
documented in `.env.example`.

## Deployment

Built for Vercel (`next.config.ts`'s production-detection logic uses
`VERCEL_ENV`), but nothing in the app is Vercel-exclusive — `sharp`-based
image optimization needs to be available at runtime on any other host. See
`SITE_INDEXABLE` above if you're deploying somewhere that isn't Vercel and
want the site to be indexable.

```bash
npm run build
npm run start
```

## Contributing

This is a private repository — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for
the team's workflow: setup, the pre-commit gate, commit conventions, and
the code conventions this codebase actually enforces (doc comments, content
parity, no invented product evidence, derived-not-eyeballed numbers).

## License

Proprietary. All rights reserved — see [`LICENSE`](LICENSE). This is closed
SCRIPE source; it is not available for reuse, and nothing in this
repository is offered under an open-source license.
