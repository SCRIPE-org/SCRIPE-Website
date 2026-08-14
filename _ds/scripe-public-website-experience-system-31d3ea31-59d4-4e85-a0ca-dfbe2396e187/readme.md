# SCRIPE — Public Website Experience System

Design system for the **public-facing SCRIPE website only**: marketing, storytelling, product discovery, solutions, pricing, demo/trial conversion, company, trust, resources, editorial. It is **not** an admin-dashboard or back-office UI kit — product UI may appear only as contextual evidence inside marketing narrative.

## Company context
SCRIPE is a modular **Sports Operations OS** — "the operational partner behind modern sports organizations." It connects athletes, guardians, coaches, staff, programs, sessions, attendance, facilities, bookings, payments, evaluations, position trials, and development evidence into one connected operating system.

**Product family** (one platform identity, four contextual worlds):
- **SCRIPE Academy** — multi-sport academy operations (programs, groups, sessions, attendance, guardians).
- **SCRIPE Venue** — facility operations: availability, one-off + recurring booking, pricing, payments, check-in, utilization.
- **SCRIPE Football Intelligence** — coach intelligence: pitch context, 5v5–11v11 formations, observations, evaluations, position trials, offline coach workflows.
- **SCRIPE Club** — the connected composition of all of the above.

**Storytelling wedge:** football academies + the Coach App lead emotionally, but the visual world must always read multi-sport (padel, swimming, basketball, tennis, gymnastics) and multi-surface (pitches, courts, pools, halls). **Commercial journey is sales-assisted**: Book a Demo / Request a Trial / Talk to Sales — never self-service provisioning.

**Audiences:** academy/club/venue owners, directors, technical directors, operations leaders (primary converters); coaches, program managers, reception/finance staff (influencers); parents, guardians, athletes (experience proof).

## Sources
- `uploads/logo.png` — official SCRIPE mark (3D violet "S" on dark rounded tile, 500×500 PNG). Only provided brand asset. **No wordmark artwork was provided** — lockups set "SCRIPE" in Archivo next to the mark (see Logo rules). No Figma, no codebase, no photography.
- Full written direction: "SCRIPE Public Website Experience System" brief (pasted in project chat) — the governing document for scope, rejections, and quality bar.
- Fonts from `github.com/google/fonts` (OFL): Archivo, Inter, Noto Sans Arabic, Noto Kufi Arabic (variable TTFs in `assets/fonts/`).
- Icons from `github.com/lucide-icons/lucide` (ISC): curated set in `assets/icons/`.

## CONTENT FUNDAMENTALS
**Voice:** direct, confident, precise, operational, human. Outcome-first and problem-aware — lead with the operational outcome and the lived reality of sport, never with a screenshot or feature grid. The reader should feel *"these people understand how sports organizations actually operate."*

- **Person:** "you/your" for the organization; "we" sparingly for SCRIPE. Never "users".
- **Casing:** sentence case everywhere — headlines, buttons, nav. UPPERCASE only for eyebrows/metadata (tracked-out, EN only; Arabic never fake-uppercased).
- **Sentences:** short, declarative, concrete. Operational nouns over abstractions: *sessions, pitches, lanes, kick-off, check-in, guardians* — not "workflows" or "synergies".
- **Emoji:** never.
- **Claims:** no "world's first", no "revolutionary", no "AI-powered everything", no fake metrics/logos/testimonials/awards. Evidence-aware phrasing ("built with academy directors") only when true. Don't publicly claim parent portals, video analysis, wearables, marketplaces, or autonomous coaching as current Release 1.
- **Structure of major pages:** outcome → recognition of real operations → fragmentation/consequence → SCRIPE as connected partner → who it serves → product worlds → evidence → trust → guided, sales-assisted next step.

**Example copy (EN):**
- Hero: `Every session. Every pitch. Every athlete. One operating rhythm.`
- Tagline: `The operational partner behind modern sports organizations.`
- Recognition: `Tuesday, 4:52pm. Three pitches, five groups, two coaches out, one guardian on the phone. This is the part nobody sees — and the part that decides everything.`
- CTA labels: `Book a demo` · `Request a trial` · `Talk to sales` · `Explore the platform` · `Sign in`

**Example copy (AR)** — authored, not mirrored; Latin product names stay Latin:
- Hero: `كل حصة. كل ملعب. كل رياضي. إيقاع تشغيلي واحد.`
- Tagline: `الشريك التشغيلي خلف المنظمات الرياضية الحديثة.`
- CTAs: `احجز عرضًا توضيحيًا` · `اطلب نسخة تجريبية` · `تحدث إلى المبيعات` · `استكشف المنصة` · `تسجيل الدخول`

## VISUAL FOUNDATIONS
The language is **"matchday cinema × operational precision"**: cinematic dark atmospheres and architectural light editorial, expanded-grotesque display type, marking-derived hairlines, and restrained violet used as a signature — never as wallpaper.

- **Color (rebalanced):** neutral-first, blue-led, violet-restrained. Foundation is a neutral ramp (`#07111F` dark canvas → `#F6F8FB` light canvas). **Electric blue** (`--interactive`, `#2563EB` light / `#4F8CFF` dark) is the primary interaction color — every CTA, link, active nav state and text-selection. **Cyan** (`--focus-ring`/`--live`) is the focus ring and live/connected state — deliberately distinct from the blue fill so focus is always legible against it. **SCRIPE violet** (`--accent-primary`, `#7C5AED`/`#9B7CFF`) is a restrained brand signature only: the hero's accent line, one featured pricing tier, and brand touches — never a universal fill, button color, or focus/selection state. **Indigo** (`--accent-football`, adjacent to violet but distinct) carries Football Intelligence evidence (formation dots, trial markers). Emerald = Venue/positive, amber = Club/attention, red = critical only. Product accents are atmospheres, not sub-brands. See `guidelines/colors-hierarchy.html` for the before/after correction, and `guidelines/proof/` + `guidelines/motion-proof/` for full theme and motion capability proof.
- **Themes:** Dark and Light are independently designed, both first-class, sharing semantic tokens (`--surface-*`, `--text-*`, `--accent-*` under `:root` and `[data-theme="dark"]`). Dark = cinematic, dimensional (depth from light, hairlines and ambient shadow — not gray boxes). Light = editorial, architectural (ink on paper, soft layered shadows). `color-scheme` set per theme; toggle is a direct control; persist choice; no flash-of-wrong-theme (set `data-theme` before paint).
- **Type:** EN display = **Archivo** variable (expanded width ~114%, weight 560–680, tracking −0.02…−0.035em, lh 0.98–1.1); EN body/UI = **Inter**. AR display = **Noto Kufi Arabic**; AR body/UI = **Noto Sans Arabic** (letter-spacing 0, looser line-height 1.7–1.85, display lh ≥1.3). Fluid `clamp()` scale from cinema (~120px) to metadata (12px); tokens in `tokens/typography.css` with `.sc-*` utility classes. No all-caps body, no monospace body, no futuristic fonts.
- **Spacing/layout:** 4px base scale; sections breathe at `clamp(96px,12vh,160px)`; container max 1360px, prose max 720px; 12-col grid, gutters 24–32px. Controlled asymmetry: editorial offsets (e.g. 5/7 splits), not centered-everything. Negative space is deliberate, never accidental emptiness.
- **Radii:** compact and architectural — controls 10px, cards 16px, media frames 18px, tiles 24px. Full-round reserved for locale/theme pills and player dots. Not every element is a rounded card.
- **Borders:** 1px hairlines from `--border-hairline` (white @ 9% on dark, ink @ 12% on light). Stronger `--border-strong` for interaction. No thin-gray-border-on-everything minimalism.
- **Shadows:** Light theme = layered soft ink shadows (`--shadow-1..3`). Dark theme = shadows barely read; depth comes from inset top-light hairline + ambient black falloff. Never glow-as-shadow.
- **Backgrounds:** flat semantic surfaces; atmosphere via *very* low-alpha radial violet/blue washes at hero scale only (`--wash-brand`); photography full-bleed with protection scrims (`--scrim-media`), never headline-over-random-stadium. No decorative blur/glassmorphism; blur only functionally (e.g. mobile nav sheet) at low intensity.
- **Imagery:** premium sports-documentary photography — operational reality (coaches preparing sessions, reception check-in, lane ropes, court maintenance), cinematic grading (deep shadows, controlled highlights, cool-neutral base with warm human accents), intentional depth of field. **No photography was provided** — components render graded placeholder fields labeled with the intended shot; replace with real campaign media. Never AI-slop faces, wrong markings, or stock offices.
- **Hover:** color-shift (violet → deeper/lighter per theme) + 150–200ms ease; links get directional underlines (grow from start edge — logical, so RTL-aware). Media frames: scale 1.02 inside fixed mask. **Press:** compress `scale(0.985)` + darken, 100ms. Never opacity-only hovers.
- **Focus:** 2px `--focus-ring` (electric blue) outline, 2px offset, on `:focus-visible` — on both themes, on media too.
- **Motion:** a core brand material — see MOTION section.
- **Signature motifs:** (1) *marking lines* — hairline rules derived from pitch/court/lane markings, incl. the "kick-off" center tick, used for chapter dividers; (2) *chapter eyebrows* — `01 — Operations` indexed section labels; (3) *evidence chips* — small squared status markers (Trial, Fixed, Live) borrowed from the product's vocabulary; (4) *aperture media reveals* — clip-path masks that resolve fully.

## MOTION
Tokens in `tokens/motion.css`. Durations: immediate 100ms · micro 180 · control 240 · nav 360 · media 600 · reveal 800 · narrative 1000 (scroll-linked scenes derive progress from scroll, not time). Easings: `--ease-standard` (.2,0,0,1) · `--ease-enter` (.16,1,.3,1) · `--ease-exit` (.7,0,.84,0) · `--ease-emphasized` (.3,0,0,1) · `--ease-cinematic` (.65,0,.15,1) · `--ease-settle` (.22,1,.36,1) · `--ease-scrub` linear for scroll-linking. Travel multiplier `--motion-travel` (1 → 0 under reduced motion) scales all translate distances so reduced-motion keeps hierarchy via fades/cuts instead of `animation:none`. Rules: anticipation→action→handoff→settle; one thing moves at a time; stillness is part of the language; every animation has a stable resolved state; reversible when scroll-linked; no fade-up-everything, no scroll-jacking, no infinite loops.

## ICONOGRAPHY
- **System: Lucide** (outline, 24px grid, round caps) — the only icon system. Rendered at `stroke-width:1.5` for premium weight, sized 16/20/24 via `--icon-*` tokens. Curated SVGs live in `assets/icons/` (arrows, chevrons, globe, languages, sun, moon, check, menu, x, calendar, clock, play, shield-check, users, map-pin, phone, mail). Components inline these exact Lucide paths — never hand-drawn glyphs, never emoji, never unicode-as-icon.
- Directional icons (arrows, chevrons) must flip in RTL — components handle this via `dir` context, assets exist for both directions.
- The 3D "S" mark is never used as an icon.

## LOGO
`assets/logo.png` is the single source of truth — never redraw, regenerate, recolor, stretch, glow, or rebuild. It is a self-contained dark tile: works as-is on both themes and on media.
- **Nav lockup:** mark at 32px (28px mobile) + "SCRIPE" in Archivo 600, wdth 114%, tracking +0.08em, 17px, gap 10px. Footer: 40px mark. Favicon/app: the mark alone.
- **Clear space:** ≥ 50% of mark width on all sides. **Min size:** 24px.
- **Monochrome:** only where color is technically impossible — set "SCRIPE" in type instead of altering the mark.
- **Motion:** the mark may fade/settle in page-entry choreography; never rotate, bounce, or extrude further.

## THEMING, LOCALE & RTL RULES
- Theme: `data-theme="dark|light"` on `html` (or a scoped wrapper). Set before paint from `localStorage` → `prefers-color-scheme`.
- Locale: `lang="ar" dir="rtl"` on `html`; all layout uses logical properties (`margin-inline-start`, `inset-inline-end`, `text-align:start`); Arabic type rules apply via `:lang(ar)`; language names stay primary in the selector ("English", "العربية"); flags optional and secondary; preserve page + theme across switch.
- `LocaleSwitch` is a compact flag+code dropdown (`components/navigation/LocaleSwitch.jsx`) — self-contained inline vector flags (no external asset files, so it renders correctly at any consuming depth), data-driven `locales` array so future locales need no layout changes. Flag is always paired with the native name in the open menu; never the sole indicator.
- Numbers/dates localize; currencies + phone numbers keep LTR embedding inside RTL text (`<bdi>`).

## Index
- `styles.css` — global entry (imports only). Tokens: `tokens/{fonts,colors,typography,spacing,motion,base}.css`.
- `assets/` — `logo.png`, `fonts/` (4 variable TTFs), `icons/` (Lucide SVGs).
- `guidelines/` — foundation specimen cards (colors, type EN/AR, spacing, radii/shadows, motion, logo, media, voice).
- `components/actions/` — Button, TextLink · `components/navigation/` — NavBar, MegaMenu, ThemeToggle, LocaleSwitch · `components/storytelling/` — Eyebrow, SectionHeading, MediaFrame, StatMetric, QuoteBlock, ProductChip · `components/evidence/` — FormationPitch · `components/conversion/` — TextField, SelectField, PricingTier, DemoForm · `components/footer/` — SiteFooter.
- `ui_kits/public_site/` — interactive public-website kit (Home / Pricing / Demo, EN⇄AR, dark⇄light).
- `guidelines/proof/` — complete Light/Dark × English/Arabic experience proofs (`theme-en-dark/light.html`, `theme-ar-dark/light.html`, authored not mirrored) + `responsive-proof.html` (1440/768/390).
- `guidelines/motion-proof/` — six interactive Motion Capability Proof specimens: page entry, mega-menu (incl. real 390px mobile alternative), scroll-linked hero→chapter transformation, real-world→evidence transformation, theme transition, reduced-motion equivalence.
- `SKILL.md` — agent skill entry point.

## Intentional additions
No component source existed, so the inventory follows §29 of the brief (public-website foundations only). `FormationPitch` renders geometrically-correct pitch markings as **product evidence** (§18 allows formation evidence; this is interface vocabulary, not illustration). `LocaleSwitch`/`ThemeToggle` are mandated by the brief.

## Caveats
- **Photography**: none provided; all media are labeled placeholder fields. The grading/treatment rules are defined; supply real campaign imagery.
- **Wordmark**: no wordmark artwork provided; text lockup used (flagged above).
- **Arabic display**: Noto Kufi Arabic is the licensed stand-in; supply a brand Arabic display family if one exists.
- Testimonial/metric content in kit screens is illustrative sample copy, marked as such — replace before publishing.
