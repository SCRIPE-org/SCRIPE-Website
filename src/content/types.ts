/**
 * Content pipeline type contracts.
 *
 * Declares the locale/page identifiers and the per-page content shapes for
 * SCRIPE's typed, server-only content layer. This layer holds long-form page
 * copy (headlines, section copy, feature lists) as plain TypeScript data —
 * distinct from messages/*.json, which holds short UI strings consumed by
 * next-intl. Content files under src/content/{en,ar}/*.ts are only ever
 * imported from server-side code (RSC data loaders), so this layer costs
 * zero client bundle weight.
 *
 * Every page's content interface is declared here and grows as its section
 * coverage is ported; see src/content/index.ts for the registry that wires
 * a page's content files up for lookup via getContent().
 */

/** Supported site locales. Mirrors `routing.locales` in src/i18n/routing.ts. */
export type Locale = "en" | "ar";

/**
 * Identifiers for every page the content pipeline is scoped to serve. An id
 * existing here does not imply it has content yet — a page is only usable
 * via getContent() once it is registered in CONTENT_REGISTRY.
 */
export type PageId =
  | "home"
  | "platform"
  | "solutions"
  | "solutionClubs"
  | "solutionAcademies"
  | "solutionVenues"
  | "solutionMultiSport"
  | "pricing"
  | "resources"
  | "company"
  | "contact"
  | "privacy"
  | "terms"
  | "notFound";

/**
 * Product-world accent identity used across home page sections. Matches the
 * Fusion accent tokens: `academy` = teal, `venue` = jade, `fi` = indigo
 * (Football Intelligence), `club` = rust, `lime` = the Signal Lime brand
 * accent itself. Components map these to `--accent-*` utilities; content
 * files only ever store the identity, never a color value.
 */
export type AccentId = "academy" | "venue" | "fi" | "club" | "lime";

/** Visual tone of an operations-board status chip. */
export type StatusTone = "positive" | "live" | "attention";

/** One chapter (beat) of the home hero's scroll-scrubbed camera flight. */
export interface HeroChapter {
  /** Short rail/progress label (e.g. "Clubs"). Also used in beat stamps. */
  rail: string;
  /** Chapter headline (e.g. "Sports Clubs"). */
  title: string;
  /** One-line supporting sentence under the chapter headline. */
  subtitle: string;
}

/** One row of the platform section's operations-board evidence panel. */
export interface BoardRow {
  /** Start time, kept as Latin digits in both locales (matches the legacy
   *  static site, which never localized board times). */
  time: string;
  /** Primary activity label (e.g. "U12 · Technical block"). */
  activity: string;
  /** Secondary detail line (surface + duration). */
  detail: string;
  /** Responsible person/desk shown at the row end. */
  owner: string;
  /** Status chip label. */
  status: string;
  /** Status chip tone, mapped to a themed accent color. */
  tone: StatusTone;
}

/** One product row in the product-family section. */
export interface ProductEntry {
  /** Product name suffix after the SCRIPE wordmark (kept Latin in both
   *  locales — product names are proper nouns and never translated). */
  name: string;
  /** Short category line rendered in the product's accent color. */
  tagline: string;
  /** One-sentence description of what the product runs. */
  description: string;
  /** Label of the product's explore link. */
  cta: string;
  /** Locale-less internal route the explore link points at. */
  href: string;
  /** Product-world accent identity. */
  accent: AccentId;
}

/** One solution card in the solutions grid. */
export interface SolutionEntry {
  /** Solution shape title (e.g. "Sports Clubs"). */
  title: string;
  /** One-sentence description of the shape. */
  description: string;
  /** Label of the card's explore link. */
  cta: string;
  /** Locale-less internal route the card links to. */
  href: string;
  /** Product-world accent identity. */
  accent: AccentId;
}

/** One step of the automation chain. */
export interface AutomationStep {
  /** Step title (e.g. "Reservation confirmed"). */
  title: string;
  /** One-line caption describing the step. */
  caption: string;
}

/** One branch chip in the multi-branch convergence story. */
export interface BranchChip {
  /** Branch display name. */
  name: string;
  /** Accent identity of the chip's marker dot. */
  accent: AccentId;
}

/**
 * Content for the home page — the full seven-section composition:
 * hero → product family → platform → solutions → automation →
 * branches → closing CTA. Copy is ported from the legacy static site
 * (`backup/scripe-static/index.html` + `js/lang-ar.js`); the product-family
 * section additionally draws on the current Sports Operations OS product
 * framing and reuses approved copy lines for its descriptions.
 */
export interface HomeContent {
  /** Page-level metadata strings. */
  meta: {
    /** Absolute page title (no template suffix — this IS the brand title). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
  };
  /** Scroll-scrubbed camera hero over the campus environment. */
  hero: {
    /**
     * The two-line statement headline (the `<h1>`). Line 1 is `top`; line 2
     * is `pre` + `accent` + `post`, where `accent` is the single
     * lime-accented keyword ("one"/"واحدة"). Kept as four fields so each
     * locale places the accent word wherever its own grammar puts it.
     */
    headline: {
      /** First headline line (the concrete triplet). */
      top: string;
      /** Second line, before the accent word (may end with a space). */
      pre: string;
      /** The single accented keyword. */
      accent: string;
      /** Second line, after the accent word (usually the period). */
      post: string;
    };
    /** Brand support line rendered under the statement headline. */
    tagline: string;
    /** Accessible name for the campus plate photograph, rendered as
     *  `aria-label` on the plate's `role="img"` element (the plate is a CSS
     *  `background-image`, not an `<img>` — see `Hero.tsx`'s header for why
     *  the theme-adaptive film requires that). Deliberately describes the
     *  campus WITHOUT naming a time of day: Task G3 made the hero swap
     *  between a night and a golden-hour film on `data-theme`, and this
     *  string is server-rendered, so it cannot know which of the two a given
     *  reader is being shown. */
    plateAlt: string;
    /** Progress-rail label for the intro beat. */
    railIntro: string;
    /** The four camera chapters, in flight order: three product-distinct
     *  corner beats (Clubs → Venues → Intelligence) followed by the
     *  destination beat that carries the CTAs in armed (cinematic) mode.
     *  Task G2 cut the former five-chapter list — the Academies chapter
     *  repeated the Clubs framing on the same crop of the plate and its
     *  subject is already carried below the fold by `productFamily.products`
     *  and `solutions.items`. */
    chapters: HeroChapter[];
    /** Label of the primary call-to-action button. */
    primaryCta: string;
    /** Label of the secondary call-to-action button. */
    secondaryCta: string;
  };
  /* NOTE: there is no `trusted` slice. The home page used to open its ground
     sequence on a `#trusted` strip — a film slate, an `<h2>` reading "Trusted
     by modern sports organizations", and one sentence. An earlier cleanup had
     already amputated its category-pill row for reading like a customer-logo
     wall, which left the CLAIM standing over nothing: ~300px of vertical
     space asserting trust with zero proof beneath it, in the exact position
     where a reader expects marks. An empty proof slot reads as "no
     customers", which is a worse answer than not raising the question. The
     section is gone (Wave H); its one honest sentence — who the platform is
     for — is already carried, in more useful form, by `productFamily` and by
     `solutions`. Restore a strip here only when there are real, nameable
     customers to put in it. */
  /** Product family section (`#product`) — the three SCRIPE products, and
   *  the first beat of the ground sequence. */
  productFamily: {
    /** Film-slate stamp label — the ground sequence continues the hero
     *  rail's timecode below the fold (`05 / <stamp>`; see `src/styles/
     *  home.css` §13). Short label, genuine per locale; the number itself
     *  is layout (Latin digits, board-times precedent), never content. */
    stamp: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The three products, in presentation order. */
    products: ProductEntry[];
  };
  /** Platform overview (`#platform`) — narrative + operations-board evidence. */
  platform: {
    /** Small section marker label — doubles as this section's film-slate
     *  stamp (`06 / <label>`; see `productFamily.stamp` for the system). */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA (explore the platform) label. */
    primaryCta: string;
    /** Secondary CTA (book a demo) label. */
    secondaryCta: string;
    /** Operations-board evidence panel. */
    board: {
      /** Panel header label (e.g. "Today · Tuesday"). */
      title: string;
      /** Honesty badge shown at the panel header end — the rows' names and
       *  times are a staged example, not live customer data. */
      badge: string;
      /** The board's schedule rows. */
      rows: BoardRow[];
    };
    /** Platform capability modules, shown as an accent-dotted chip row. */
    modules: Array<{ name: string; accent: AccentId }>;
    /** Deep link label into the platform page. */
    deepLink: string;
  };
  /** Solutions grid (`#solutions`) — the four organization shapes. */
  solutions: {
    /** Film-slate stamp label (`07 / <stamp>`) — see `productFamily.stamp`. */
    stamp: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The four solution cards. */
    items: SolutionEntry[];
    /** Label of the compare-all link. */
    compareCta: string;
  };
  /** Automation chain story (`#automation`). */
  automation: {
    /** Film-slate stamp label (`08 / <stamp>`) — see `productFamily.stamp`. */
    stamp: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The six chain steps, in order — a real sequence, hence numbered. */
    steps: AutomationStep[];
    /** Deep link label into the platform page's automation modules. */
    deepLink: string;
  };
  /** Multi-branch convergence story (`#branches`). */
  branches: {
    /** Film-slate stamp label (`09 / <stamp>`) — see `productFamily.stamp`. */
    stamp: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Example branch chips feeding the convergence flow. */
    chips: BranchChip[];
    /** Label of the middle convergence node. */
    orgLabel: string;
    /** Label of the final convergence node (the operational picture). */
    pictureLabel: string;
    /** Link label out to the multi-sports solution page. */
    deepLink: string;
  };
  /** Closing conversion band. */
  closing: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Optional secondary CTA label. Omitted sitewide since the "start free
     *  trial" removal (there is no self-service trial — see the pricing
     *  FAQ) — kept optional rather than deleted in case a real secondary
     *  conversion action (not a trial) is added later. */
    secondaryCta?: string;
    /** Pricing text-link label. */
    pricingLink: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * Visual tone for a platform capability's evidence-panel status marker.
 * Deliberately narrower than {@link StatusTone}: every evidence row on the
 * platform page needs only a positive/attention contrast pair (reusing the
 * same jade/rust tokens `StatusTone` already maps to) plus an uncolored
 * `"neutral"` default — `StatusTone`'s `"live"` (lime) is reserved for the
 * home page's in-progress board and never appears here.
 */
export type EvidenceTone = "positive" | "attention" | "neutral";

/** One row inside a `"rows"` evidence panel — a list of records (a member,
 *  a payment, a fixture, a notification...). */
export interface EvidenceRow {
  /** Optional short label before the row body (e.g. a weekday on a fixture
   *  list). Omit for rows with no leading label. */
  leading?: string;
  /** Primary line (bold). */
  primary: string;
  /** Secondary line under the primary (muted caption). */
  secondary?: string;
  /** Trailing badge text — a status word or a formatted value (e.g.
   *  "SAR 2,400"). Omit for a row with no trailing marker. */
  trailing?: string;
  /** Tone of the trailing badge. Defaults to `"neutral"` when `trailing` is set. */
  trailingTone?: EvidenceTone;
}

/** One stat cell inside a `"stats"` evidence panel. */
export interface EvidenceStat {
  /** The headline figure, already formatted (e.g. "SAR 214K", "97%"). */
  value: string;
  /** Label under the figure. */
  label: string;
  /** Small supporting caption under the label. */
  caption?: string;
}

/** One row inside a `"meters"` evidence panel — a labelled percentage bar. */
export interface EvidenceMeter {
  /** Row label (e.g. a weekday or a venue surface name). */
  label: string;
  /** Fill percentage, 0–100. Also rendered, formatted, as the visible value. */
  percent: number;
}

/** One slot cell inside a `"grid"` evidence panel — a booking-style time grid. */
export interface EvidenceSlot {
  /** Slot status word (e.g. "Open", "Held", "Booked"). */
  label: string;
  /** Visual tone of the slot cell. */
  tone: EvidenceTone;
}

/** One chip inside a `"chips"` evidence panel — a cluster of labelled pills. */
export interface EvidenceChip {
  /** Chip label (e.g. "Cairo · 94%"). */
  label: string;
}

/**
 * A capability module's evidence panel — the same honest "product evidence"
 * proof the home page's operations board (`HomeContent["platform"]["board"]`)
 * establishes, applied per module. Five shapes cover every module on the
 * legacy platform page without hand-building thirteen bespoke panel designs:
 * a record list (`"rows"`), a headline-figure strip (`"stats"`), a labelled
 * percentage list (`"meters"`), a booking-style time grid (`"grid"` —
 * Reservations only) and a labelled pill cluster (`"chips"` — Branches
 * only). Every sample figure is illustrative product evidence, not live
 * data — each variant's `badge` says so.
 */
export type ModuleEvidence =
  | { kind: "rows"; title: string; badge: string; rows: EvidenceRow[]; note?: string }
  | { kind: "stats"; title: string; badge: string; stats: EvidenceStat[] }
  | { kind: "meters"; title: string; badge: string; meters: EvidenceMeter[]; note?: string }
  | { kind: "grid"; title: string; badge: string; times: string[]; slots: EvidenceSlot[]; note?: string }
  | { kind: "chips"; title: string; badge: string; chips: EvidenceChip[]; note?: string };

/** One of the platform's thirteen capability modules. */
export interface CapabilityModule {
  /** Anchor slug — also the legacy static site's own module anchor,
   *  preserved for deep-linking continuity (e.g. `platform.html#members`
   *  becomes `/platform#members`). */
  id: string;
  /** Module name (e.g. "Members"). */
  name: string;
  /** One-sentence lead under the module name. */
  lead: string;
  /** Exactly four supporting feature bullets. */
  features: string[];
  /** Small status note shown next to the module name for a module that is
   *  not fully shipped (e.g. the Parents module's honest "Guardian portal
   *  on the roadmap" flag). Omit for a fully shipped module. */
  roadmapNote?: string;
  /** The module's product-evidence panel. */
  evidence: ModuleEvidence;
}

/**
 * One product-family grouping of capability modules, keyed to an
 * {@link AccentId} so its subnav entry, group header and every module inside
 * it share one accent identity.
 */
export interface CapabilityGroup {
  /** Anchor slug and subnav id (e.g. `"venue"`). */
  id: string;
  /** Group display name (e.g. "Venue"). */
  name: string;
  /** One-sentence description of what this family of modules covers,
   *  composed from the modules' own approved copy — no new claims. */
  blurb: string;
  /** Product-world accent identity shared by every module in the group. */
  accent: AccentId;
  /** The group's capability modules, in display order. */
  modules: CapabilityModule[];
}

/**
 * Content for the platform page — the full capability catalog: hero →
 * thirteen capability modules grouped into five product-accent families
 * behind a sticky subnav → a consolidated dashboard strip → closing CTA.
 * Copy is ported from the legacy static site
 * (`backup/scripe-static/platform.html` + `js/lang-ar.js`); the family
 * grouping and blurbs are new editorial structure the legacy page never had
 * (it listed all thirteen modules in one flat list) — see
 * `src/content/en/platform.ts`'s file header for the grouping rationale.
 */
export interface PlatformContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro. */
  hero: {
    /** Small section marker label. */
    label: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (see pricing). */
    secondaryCta: string;
    /** Alt text for the hero's companion photograph — see
     *  `CapabilityHero.tsx`'s header. Optional in lockstep with the
     *  photograph itself, which landed in Wave M: both locale files set
     *  this now, gating the hero into its two-column layout. Stays optional
     *  because the contract cuts both ways — clearing this without also
     *  removing the photograph falls back to the single-column layout
     *  cleanly, the same way a future page with no photograph at all would.
     *  Never set this ahead of a photograph actually landing — an alt with
     *  no image is a broken contract, not a preview of one. */
    imageAlt?: string;
  };
  /** Sticky in-page subnav, one entry per {@link CapabilityGroup}. */
  nav: {
    /** Accessible label for the subnav landmark. */
    label: string;
  };
  /** The five product-family groups, in display order. */
  groups: CapabilityGroup[];
  /** Consolidated dashboard strip — the payoff statement before the CTA. */
  dashboard: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Headline stats, reprised from the Reports module's own evidence —
     *  the same read, once for the whole organization. */
    stats: EvidenceStat[];
    /** Alt text for the operations-desk photograph that sits between the
     *  heading and the stats. The image is a real room, not a product
     *  screenshot (see `build-media-assets.mjs`'s entry for why), so the alt
     *  describes the room — it must not claim to describe a dashboard. */
    imageAlt: string;
  };
  /** Closing conversion band. */
  closing: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (choose a solution). */
    secondaryCta: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * One metric shown in a solution's hero snapshot panel or a hub card's mini
 * stat row — a labelled figure with no caption (unlike {@link EvidenceStat},
 * which a solution page's outcomes strip uses instead). Matches the legacy
 * static site's compact "what this looks like" panel
 * (`backup/scripe-static/solutions/*.html`).
 */
export interface SolutionStat {
  /** The metric's label (e.g. "Squads"). */
  label: string;
  /** The metric's already-formatted value (e.g. "14", "97%"). */
  value: string;
}

/** One friction point named in a solution page's pain-points section. */
export interface SolutionPainPoint {
  /** Short friction title (e.g. "Who's actually free tonight"). */
  title: string;
  /** One–two sentence description of the friction and its cost. */
  description: string;
}

/** One capability tile in a solution page's capabilities grid. */
export interface SolutionCapability {
  /** Key into the shared capability icon registry
   *  (`src/components/sections/solutions/CapabilityIcon.tsx`). */
  icon: string;
  /** Capability title (e.g. "Teams and squads"). */
  title: string;
  /** One-sentence description of what the capability does. */
  description: string;
}

/**
 * Content shared by all four solution pages (`solutionClubs`,
 * `solutionAcademies`, `solutionVenues`, `solutionMultiSport`) — ONE
 * interface every `src/app/[locale]/solutions/[slug]/page.tsx` render draws
 * from, with the per-solution personality carried entirely by copy and the
 * registry's own accent identity (`src/components/sections/solutions/registry.ts`),
 * never by a per-slug branch inside the template.
 *
 * Ported from `backup/scripe-static/solutions/*.html` — all four legacy
 * pages share this exact section shape: hero (with a "what this looks like"
 * mini stat panel) → a "focus" capability grid → an "operating day" narrative
 * (a meters + evidence-board mockup) → a "numbers" KPI strip → cross-links to
 * the other three solutions → closing CTA. The "operating day" mockup is
 * deliberately recomposed into concise `painPoints` prose here instead of
 * ported as a second evidence mockup — the same simplification
 * `src/content/en/platform.ts`'s file header documents for `DashboardStrip`
 * replacing the legacy "product experience" screenshot: the same honest
 * claim, without duplicating `CapabilityEvidence`'s board/meters machinery a
 * third time. The cross-links section is not part of this interface — the
 * `[slug]` template derives it from `SolutionsHubContent["grid"]["items"]`
 * (filtering out the current slug) rather than repeating the other three
 * solutions' title/description/href four times over.
 */
export interface SolutionContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for the solutions-hub crumb in structured data. */
    breadcrumbSolutions: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Hero: headline, subtitle, CTAs and a small evidence snapshot. */
  hero: {
    /** Small marker label above the heading (the solution's display name). */
    eyebrow: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (see pricing). */
    secondaryCta: string;
    /** Alt text for the framed campus photograph above the snapshot panel.
     *  OPTIONAL because the set is incomplete: three of the four solution
     *  pages have a delivered photograph, and multi-sport organizations does
     *  not (`docs/asset-briefs/delivered-images-catalog-2026-08-19.md` §2 —
     *  P12 was never delivered). A page without this key renders its hero
     *  exactly as before, snapshot panel alone; adding the key plus the
     *  file's entry in `SOLUTION_HERO_IMAGE` is the whole integration when
     *  the owner's round-2 drop lands. */
    imageAlt?: string;
    /** The "what this looks like" mini evidence panel beside the hero copy. */
    snapshot: {
      /** Panel label (e.g. "What this looks like") — already frames the
       *  stats below as illustrative, so the panel carries no separate
       *  sample-data footnote (see `SolutionHero.tsx`'s header). */
      label: string;
      /** Three illustrative metrics. */
      stats: SolutionStat[];
    };
  };
  /** The friction this solution exists to remove. */
  painPoints: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Three named frictions. */
    items: SolutionPainPoint[];
  };
  /** The capability grid — what this organization shape actually runs on. */
  capabilities: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The capability tiles, in display order. */
    items: SolutionCapability[];
  };
  /** The KPI strip — "one place the numbers agree." */
  outcomes: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Four illustrative headline figures. */
    stats: EvidenceStat[];
  };
  /** Heading for the cross-links to the other three solutions. The links
   *  themselves are not stored here — the `[slug]` template derives them
   *  from `SolutionsHubContent["grid"]["items"]` (see `SolutionContent`'s
   *  own doc comment above for why). */
  otherSolutions: {
    /** Section heading. */
    title: string;
  };
  /** Closing conversion band. */
  cta: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (explore the platform). */
    secondaryCta: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * One solution card in the hub's grid — the {@link SolutionEntry} shape plus
 * the mini stat row the legacy hub page's cards carried
 * (`backup/scripe-static/solutions.html`).
 */
export interface SolutionsHubCard {
  /** Solution shape title (e.g. "Sports Clubs"). */
  title: string;
  /** One-sentence description of the shape. */
  description: string;
  /** Label of the card's explore link. */
  cta: string;
  /** Locale-less internal route the card links to. */
  href: string;
  /** Product-world accent identity. */
  accent: AccentId;
  /** Three illustrative metrics shown under the description. */
  stats: SolutionStat[];
}

/**
 * One column of the hub's "same platform, different centre of gravity"
 * comparison grid.
 */
export interface SolutionsHubCompareColumn {
  /** Solution shape title (e.g. "Sports Clubs"). */
  title: string;
  /** Label of the column's deep link. */
  cta: string;
  /** Locale-less internal route the column's deep link points at. */
  href: string;
  /** Product-world accent identity. */
  accent: AccentId;
  /** The modules this organization shape leans on first. */
  features: string[];
}

/**
 * Content for the solutions hub page (`/solutions`) — hero → a grid of four
 * solution gateways → a comparison grid → the "what never changes" shared
 * value proposition → closing CTA. Ported from
 * `backup/scripe-static/solutions.html`.
 */
export interface SolutionsHubContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro. */
  hero: {
    /** Small marker label above the heading. */
    eyebrow: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (explore the platform). */
    secondaryCta: string;
  };
  /** The four-card solution gateway grid. */
  grid: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The four solution cards. */
    items: SolutionsHubCard[];
  };
  /** The "same platform, different centre of gravity" comparison grid. */
  compare: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** One column per solution shape. */
    columns: SolutionsHubCompareColumn[];
  };
  /** The "what never changes" shared value proposition split. */
  shared: {
    /** Section heading. */
    title: string;
    /** Label of the deep link into the platform page. */
    cta: string;
    /** Locale-less internal route the deep link points at. */
    href: string;
    /** The checklist of what every solution shares underneath. */
    points: string[];
  };
  /** Closing conversion band. */
  cta: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (see pricing). */
    secondaryCta: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/** Discriminated identifier for one of SCRIPE's three public pricing tiers. */
export type PlanId = "starter" | "growth" | "enterprise";

/**
 * One row's per-plan verdict in the pricing comparison table. `"included"`/
 * `"excluded"` render as a themed glyph (plus a screen-reader-only label
 * sourced from `PricingContent["comparison"]`); `"text"` renders arbitrary
 * copy (e.g. "Unlimited", "Priority onboarding") for a row that isn't a
 * simple yes/no.
 */
export type PricingComparisonValue =
  | { kind: "included" }
  | { kind: "excluded" }
  | { kind: "text"; text: string };

/**
 * One row of the comparison table — a capability/attribute, and one
 * {@link PricingComparisonValue} per plan, in the same order as
 * `PricingContent["plans"]` (Starter, Growth, Enterprise).
 */
export interface PricingComparisonRow {
  /** Row label (e.g. "Reservations and pricing rules"). */
  label: string;
  /** One verdict per plan, in `PricingContent["plans"]` order. */
  values: PricingComparisonValue[];
}

/**
 * One grouping of comparison rows under a shared subheading (e.g.
 * "Operations", "Commercial", "Organization").
 */
export interface PricingComparisonGroup {
  /** Group subheading, rendered as a full-width row inside the table body. */
  title: string;
  /** The group's rows, in display order. */
  rows: PricingComparisonRow[];
}

/** One call-to-action button on a pricing plan card. */
export interface PricingPlanCta {
  /** Button label. */
  label: string;
  /** Locale-less internal route the button links to. */
  href: string;
}

/**
 * One of the three public pricing tiers ({@link PlanId}). Starter and Growth
 * carry a real indicative SAR figure (`baseMonthly`/`baseYearly`); Enterprise
 * is always quoted, so those two fields are `null` and `customLabel`/
 * `customCaption` supply its "Custom" figure and caption instead.
 *
 * `baseUsd` is `null` for every plan at launch: cross-checked against
 * SCRIPE-Frontend's `usePlanPicker.ts` (the signup product's own plan-picker
 * viewmodel) and its neighboring `presentation/helpers`/`data/helpers` —
 * that plan catalog is entirely server/API-driven
 * (`getEditions()`/`getPricingContext()`), with no static USD base-price
 * constant for any plan name anywhere in the signup module. See
 * `src/content/en/pricing.ts`'s file header for the full cross-check trail.
 * A later task fills this in if/when a USD base is ever established
 * server-side; until then it stays `null` rather than a guessed number.
 */
export interface PricingPlan {
  /** Stable identifier, also used to key the `data-price-slot` DOM contract
   *  documented in `src/components/sections/pricing/PlanCards.tsx`'s file
   *  header. */
  id: PlanId;
  /** Plan display name (e.g. "Growth"). */
  name: string;
  /** One-sentence audience line (e.g. "For growing clubs and venues."). */
  tagline: string;
  /** Marker-dot accent identity — mirrors the legacy static page's own
   *  per-tier dot colors (Starter/Growth/Enterprise), not a claim about
   *  which SCRIPE product world the plan belongs to. */
  accent: AccentId;
  /** Indicative monthly price in `baseCurrency`, or `null` for a
   *  custom-quoted plan (Enterprise). */
  baseMonthly: number | null;
  /** Indicative yearly price in `baseCurrency` — the discounted annual
   *  total, not `baseMonthly * 12` — or `null` for a custom-quoted plan. */
  baseYearly: number | null;
  /** Currency `baseMonthly`/`baseYearly` are denominated in. Always `"SAR"`
   *  at launch; a later task layers live geo-currency conversion on top via
   *  the `data-price-slot` contract without editing these baked-in figures. */
  baseCurrency: "SAR";
  /** USD equivalents, or `null` — see this interface's own doc comment. */
  baseUsd: { monthly: number; yearly: number } | null;
  /** Figure shown instead of a price when `baseMonthly` is `null` (e.g.
   *  "Custom"). Set exactly when `baseMonthly` is `null`. */
  customLabel?: string;
  /** Caption shown under `customLabel` (e.g. "Quoted on branches, sports
   *  and volume"). Set exactly when `baseMonthly` is `null` — amount plans
   *  get their per-cycle caption from `PricingContent["billing"]` instead
   *  (it swaps with the billing toggle; this doesn't). */
  customCaption?: string;
  /** Feature bullets, in display order. */
  features: string[];
  /** True for the one plan visually promoted (Growth) — a heavier border,
   *  the brand accent, and `badge` shown next to its name. */
  highlight?: boolean;
  /** Small badge shown next to the plan name (e.g. "Most chosen"). Only the
   *  highlighted plan carries one. */
  badge?: string;
  /** The plan card's own call-to-action. */
  cta: PricingPlanCta;
  /** Small note under the CTA (e.g. "Includes onboarding with your
   *  operations team."). Omit for a plan with no such note. */
  footnote?: string;
}

/**
 * One question/answer pair in the pricing FAQ. Plain content only — no
 * FAQPage schema is emitted for it (ruled out sitewide per the design
 * spec's SEO section: rich-result FAQ markup is deprecated as of 2026).
 */
export interface PricingFaqItem {
  /** The question, rendered as a `<summary>`. */
  question: string;
  /** The answer, rendered inside the disclosure's panel. */
  answer: string;
}

/**
 * Content for the pricing page (`/pricing`) — hero → billing-toggle plan
 * cards → a full comparison table → an FAQ → closing CTA. Ported from
 * `backup/scripe-static/pricing.html` + `js/lang-ar.js` (prices, feature
 * lists, the comparison table and the closing CTA are the legacy page's own
 * copy, verbatim); the FAQ reframes the legacy page's "how pricing works"
 * three info cards as genuine question/answer pairs, plus a couple of
 * additional questions whose answers are derived arithmetically from the
 * ported prices themselves (e.g. the yearly-billing saving) — see
 * `src/content/en/pricing.ts`'s file header for exactly which legacy
 * sentences map to which question. Never an invented figure or claim.
 */
export interface PricingContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro — same shape as `PlatformContent["hero"]`. */
  hero: {
    /** Small section marker label. */
    label: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Optional secondary CTA label. Omitted since the "start free trial"
     *  removal — there is no self-service trial (see the FAQ's
     *  `is-there-a-self-service-trial` answer). */
    secondaryCta?: string;
    /** Alt text for the wide framed photograph under the hero copy — four
     *  separately lit facility hubs across one dark city, the page's
     *  per-branch pricing argument made before the copy makes it. */
    imageAlt: string;
  };
  /** Billing-cycle toggle copy, shared by every amount-priced plan card. */
  billing: {
    /** Accessible label for the toggle's `role="group"` landmark. */
    ariaLabel: string;
    /** "Monthly" tab label. */
    monthlyLabel: string;
    /** "Yearly" tab label. */
    yearlyLabel: string;
    /** Savings badge shown on the yearly tab (e.g. "−2 months"). */
    yearlySavingsBadge: string;
    /** Price caption for the monthly cycle (e.g. "per month · per branch"). */
    perMonthSuffix: string;
    /** Price caption for the yearly cycle (e.g. "per year · per branch"). */
    perYearSuffix: string;
  };
  /** The three pricing tiers, in display order (Starter, Growth, Enterprise). */
  plans: PricingPlan[];
  /** Small honesty note under the plan grid. */
  plansFootnote: string;
  /** The full plan comparison table. */
  comparison: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Header label for the row-label column (e.g. "Compare plans"). */
    columnHeader: string;
    /** Table caption, rendered below the table. */
    caption: string;
    /** Screen-reader-only label for an `"included"` cell. */
    includedLabel: string;
    /** Screen-reader-only label for an `"excluded"` cell. */
    notIncludedLabel: string;
    /** The table's row groups, in display order. */
    groups: PricingComparisonGroup[];
  };
  /** The FAQ disclosure list. */
  faq: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** The question/answer pairs, in display order. */
    items: PricingFaqItem[];
  };
  /** Closing conversion band. */
  cta: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Optional secondary CTA label. Omitted since the "start free trial"
     *  removal — see `hero.secondaryCta`'s doc comment above. */
    secondaryCta?: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * Discriminant for a {@link ResourceItem}: which resources-page section it
 * belongs to today, and — since this is also the exact field the future MDX
 * pipeline switches on (see that interface's own doc comment) — which MDX
 * collection it would become. `"faq"` is carried for completeness of the
 * union but is not how the FAQ section itself is modeled; see
 * {@link ResourceFaqItem}'s doc comment for why question/answer content gets
 * its own shape instead.
 */
export type ResourceKind = "guide" | "faq" | "article";

/**
 * The central content unit for the resources page, and the shape the future
 * MDX pipeline (`content-collections`, the tool the design spec §5.3 names
 * as chosen — Contentlayer is dead, next-mdx-remote is archived) is meant to
 * map onto without a restructure: `kind` becomes the collection a file lives
 * in (`guides/*.mdx`, `articles/*.mdx`), `slug` becomes its route segment,
 * `title`/`summary` become frontmatter fields, and `body` becomes the
 * compiled MDX output once a page task actually renders one. Nothing on the
 * site publishes a full reading page yet — every guide and article today is
 * an honest "in preparation"/"coming soon" card, exactly like the legacy
 * static site's own `resources.html` — so `body` stays reserved rather than
 * populated.
 *
 * `guides` and `articles` on {@link ResourcesContent} both hold
 * `ResourceItem[]` (kind `"guide"`/`"article"` respectively) rather than two
 * bespoke shapes, so a later "all resources" index or MDX collection loader
 * can iterate one uniform list instead of hand-merging two unrelated types.
 */
export interface ResourceItem {
  /** Which resources-page section this item renders in — see this type's
   *  own doc comment for the MDX-collection mapping. */
  kind: ResourceKind;
  /** Stable slug, unique within `kind` — the future MDX file/route segment. */
  slug: string;
  /** Item title (a guide's or article's headline). */
  title: string;
  /** One–two sentence summary shown on the card. */
  summary: string;
  /** Reserved for the future MDX-compiled body. Typed `never` on purpose: no
   *  content file can populate it today, so there is nothing here for a
   *  reading-page template to accidentally render early. The field name is
   *  fixed now so wiring in a real value later is additive, not a rename. */
  body?: never;
  /** Optional short status/category word shown as a small badge (today,
   *  every guide/article carries an honest build-status word — "In
   *  preparation" or "Coming soon" — never a fabricated topic tag). Omit
   *  once an item is actually published and needs no badge. */
  tag?: string;
}

/**
 * One question/answer pair in the resources FAQ. Kept as its own interface
 * rather than reusing {@link ResourceItem} (`title` → question, `summary` →
 * answer would technically fit): a question/answer pair is not blog-ready
 * content bound for the future MDX pipeline — it has no `slug`, no future
 * "reading page," and calling its two fields `title`/`summary` would read as
 * a lie about what they are. Matches {@link PricingFaqItem}'s shape exactly
 * (same accessible `<details>`/`<summary>` rendering contract — see
 * `ResourcesFaq.tsx`'s file header) so both FAQs stay one recognizable
 * pattern sitewide. No FAQPage JSON-LD is emitted for this content, per the
 * design spec's SEO section (rich-result FAQ schema is deprecated as of
 * 2026) — the same rule `PricingFaqItem` documents.
 */
export interface ResourceFaqItem {
  /** The question, rendered as a `<summary>`. */
  question: string;
  /** The answer, rendered inside the disclosure's panel. */
  answer: string;
}

/**
 * One platform-capability deep link in the resources page's "product
 * resources" section (`/resources#product`) — a live reference index into
 * `/platform#<id>`, deliberately NOT a {@link ResourceItem}: there is no MDX
 * file this will ever become, only a pointer at a module that already has
 * its own full page. `id` doubles as the anchor slug and matches the
 * corresponding `CapabilityModule["id"]` in `PlatformContent["groups"]`, and
 * `accent` matches that module's own group accent — both copied rather than
 * cross-imported, per this content layer's per-page independence (each
 * page's content file is self-contained; nothing here reaches into
 * `platform.ts` at runtime).
 */
export interface ProductReadingEntry {
  /** Anchor slug into the platform page (`/platform#<id>`). */
  id: string;
  /** Module display name (e.g. "Members"). */
  name: string;
  /** One-sentence description of what the module does — ported verbatim
   *  from the legacy static site's own product-resources tile captions. */
  description: string;
  /** Product-world accent identity, matching the module's platform-page group. */
  accent: AccentId;
}

/**
 * Content for the resources page (`/resources`) — hero → guides → FAQ →
 * product reference → articles → closing CTA. Ported from
 * `backup/scripe-static/resources.html` + `js/lang-ar.js`; anchors
 * (`#guides #faq #product #articles`) are preserved from the legacy page for
 * deep-linking continuity. This is also the future home of the blog: see
 * {@link ResourceItem}'s doc comment for the structure-ready contract the
 * design spec §5.3 calls for, and {@link ProductReadingEntry}'s doc comment
 * for why the product-reference section is deliberately excluded from that
 * same contract.
 */
export interface ResourcesContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro — same shape as `PlatformContent["hero"]`,
   *  minus a secondary CTA (the legacy page carries only one). */
  hero: {
    /** Small section marker label. */
    label: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (talk to sales). */
    primaryCta: string;
  };
  /** Guides section (`#guides`) — how organizations set SCRIPE up. */
  guides: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The guide cards, in display order. Every item's `kind` is `"guide"`. */
    items: ResourceItem[];
    /** Honesty note under the grid (the legacy page's own "guides are in
     *  preparation" caption). */
    note: string;
  };
  /** FAQ section (`#faq`) — the questions operations leaders ask before
   *  talking to sales. */
  faq: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** The question/answer pairs, in display order. */
    items: ResourceFaqItem[];
  };
  /** Product reference section (`#product`) — one deep link per platform
   *  capability module. */
  productReading: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The module deep links, in display order (matches the legacy page's
     *  own thirteen-tile order). */
    items: ProductReadingEntry[];
  };
  /** Articles section (`#articles`) — published as they are written. */
  articles: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The article cards, in display order. Every item's `kind` is `"article"`. */
    items: ResourceItem[];
  };
  /** Closing conversion band. */
  cta: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (talk to sales). */
    secondaryCta: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * One card in the company page's operating-principles grid — "the
 * constraints the product is actually designed against," per that section's
 * own subtitle, not a marketing feature list.
 */
export interface CompanyPrinciple {
  /** Stable id, matched to its own glyph in
   *  `src/components/sections/company/icons.tsx` (e.g. `"operations"`). */
  id: string;
  /** Card heading. */
  title: string;
  /** Supporting sentence. */
  description: string;
  /** Product-world accent for the icon tile. Omitted for the one principle
   *  ("One connected record") the legacy page itself rendered with a plain,
   *  unaccented tile — see `src/content/en/company.ts`'s header for why the
   *  other three each carry a specific {@link AccentId}. */
  accent?: AccentId;
}

/**
 * Content for the company page (`/company`) — the smallest page in the
 * fusion rebuild and the one page that speaks in the brand's own voice
 * rather than a product's. Ported from `backup/scripe-static/company.html`:
 * hero → mission (`#mission`) paired with the product vision checklist →
 * operating principles → legal/working-with-us (`#legal`) → closing CTA.
 * Nothing here is invented — no team bios, no office address, no history —
 * the legacy page never carried any of that, and this port doesn't add it.
 */
export interface CompanyContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero — this page's one statement-piece marker, same
   *  shape as `ResourcesContent["hero"]`/`PlatformContent["hero"]` but set
   *  larger; see `CompanyHero.tsx`'s own header for why. */
  hero: {
    /** Small section marker label. */
    label: string;
    /** Page heading — the legacy page's own opening statement. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (explore the platform). */
    secondaryCta: string;
    /** Alt text for the framed campus photograph beside the statement. The
     *  file itself is fixed in `CompanyHero.tsx` (one page, one photograph);
     *  only the description translates. */
    imageAlt: string;
  };
  /** Mission section (`#mission`) — why SCRIPE exists and who it is built
   *  for, paired in the rendered layout with `vision` below. */
  mission: {
    /** Small section marker label. */
    label: string;
    /** Section heading — the mission statement itself. */
    title: string;
    /** The "Tuesday, 4:52pm..." scenario paragraph that grounds the mission
     *  in a concrete operational moment. */
    scenario: string;
    /** Who SCRIPE is built for, and the module-inclusion rule. */
    audience: string;
  };
  /** Product vision checklist, rendered as the paired panel beside
   *  `mission` (the legacy page's own two-column composition). */
  vision: {
    /** Panel label ("Product vision"). */
    label: string;
    /** The four vision statements, in display order. */
    items: string[];
  };
  /** Operating principles section — "the constraints the product is
   *  actually designed against," not a manifesto. */
  principles: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The four principle cards, in display order. */
    items: CompanyPrinciple[];
  };
  /** Legal/working-with-us section (`#legal`) — preserved anchor id for
   *  inbound links (the footer's Privacy/Terms links point at
   *  `/company#legal` today, per `src/components/chrome/ia.ts`, since no
   *  standalone legal documentation is published yet). */
  legal: {
    /** Small section marker label. */
    label: string;
    /** Section heading. */
    title: string;
    /** Body paragraph explaining the sales-assisted, no-self-service model. */
    body: string;
    /** Honesty note: privacy/terms/data-processing docs are issued during
     *  onboarding, not published on the site. */
    note: string;
  };
  /** Closing conversion band. */
  cta: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Primary CTA label (book a demo). */
    primaryCta: string;
    /** Secondary CTA label (see pricing). */
    secondaryCta: string;
    /** Small honesty note under the CTAs. */
    note: string;
  };
}

/**
 * One "what to expect" channel card in the contact page's side panel — the
 * honest email/phone/response-time notes the legacy static page's aside
 * carried (`backup/scripe-static/contact.html`). `id` doubles as the lookup
 * key into `src/components/sections/contact/icons.tsx`'s glyph registry.
 */
export interface ContactChannel {
  /** Stable id, matched to its own glyph in
   *  `src/components/sections/contact/icons.tsx` (`"email"` | `"phone"` |
   *  `"response"`). */
  id: string;
  /** Channel label (e.g. "Email"). */
  label: string;
  /** The channel's current value — honestly "Not published yet" for the two
   *  channels SCRIPE has not published, or the response-time promise. */
  value: string;
  /** One-line note explaining what to do instead, or what the value means. */
  note: string;
}

/**
 * Content for the contact page (`/contact`) — the site's only form and its
 * one true conversion surface: a typography-led hero → the demo-request form
 * card → a "what happens next" checklist paired with honest contact-channel
 * notes. Ported from `backup/scripe-static/contact.html` + `js/contact.js`
 * (field limits, validation copy and the "not yet connected" confirmation
 * wording are that legacy implementation's own, carried forward exactly —
 * see `src/lib/leads/submit-lead.ts`'s file header for the live Server
 * Action that now delivers submissions).
 *
 * Content-layer split (binding for `ContactForm.tsx`): this interface holds
 * only page-specific narrative copy (hero, the form card's own intro/
 * placeholder/hint/footnote text, the side panel). Field LABELS and reusable
 * validation/state vocabulary ("Name", "This field is required.", "Thanks.",
 * the "not yet connected" notice, "Send"...) live in `messages/*.json`'s
 * `forms` namespace instead — that namespace was already seeded ahead of
 * this task (see `messages/en.json`), specifically because those strings are
 * generic, reusable form vocabulary a client component reads via
 * `useTranslations()`, not long-form page content tied to this one page. The
 * organization-type select's four "shape" options reuse `nav.solutionsItems`
 * message keys (the same labels the Solutions mega-menu and hub already
 * show) instead of duplicating that translated copy a third time; only the
 * fifth option ("Other" — a shape the mega-menu has no `nav.solutionsItems`
 * entry for) gets one new dedicated message key (`forms.typeOther`). See
 * `ContactForm.tsx`'s file header for exactly where each key is read.
 */
export interface ContactContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro. No CTA button here — the form immediately
   *  below is this page's one call to action, so a second one in the hero
   *  would only repeat it. */
  hero: {
    /** Small section marker label. */
    label: string;
    /** Page heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
  };
  /** The demo-request form's own narrative copy — never the field labels or
   *  validation/state copy, which come from `messages/*.json`'s `forms`
   *  namespace (see this interface's own doc comment). */
  form: {
    /** Small kicker label at the top of the form card (e.g. "Book a demo"). */
    eyebrow: string;
    /** One-sentence intro under the eyebrow. */
    intro: string;
    /** Example placeholder text, one per free-text field. */
    placeholders: {
      name: string;
      email: string;
      organization: string;
      phone: string;
      message: string;
    };
    /** Supporting hint text shown under a field until it carries an error. */
    hints: {
      phone: string;
      type: string;
    };
    /** Submit button label (e.g. "Book a Demo") — page-specific conversion
     *  copy, kept here rather than the generic `forms.send` message, the
     *  same way every other page's CTA label lives in its own content file
     *  (e.g. `CompanyContent["hero"]["primaryCta"]`). */
    submitCta: string;
    /** Small note under the submit button. */
    footnote: string;
  };
  /** The "what happens next" checklist beside the form. */
  expect: {
    /** Panel label. */
    label: string;
    /** The four checklist items, in display order. */
    items: string[];
  };
  /** Honest contact-channel notes (email, phone, response time). */
  channels: {
    /** The three channel cards, in display order. */
    items: ContactChannel[];
  };
}

/**
 * One content unit inside a {@link LegalSection}'s body, in display order.
 * Two ordinary reading blocks (`"paragraph"`, `"list"`) plus one deliberately
 * different one: `"note"` is a visually flagged callout for a fact this
 * standard, in-house-drafted policy cannot honestly state yet (a legal
 * entity name, a jurisdiction, a retention schedule) — see
 * `LegalPageContent`'s own doc comment for why those gaps exist and why they
 * are marked rather than guessed at. `LegalArticle.tsx` renders `"note"` with
 * a distinct bordered/tinted treatment (the same `accent-club` "attention"
 * color `Field.tsx`'s validation-error text already establishes as this
 * design system's nearest warm/flag color) so a placeholder never reads as
 * finished legal text.
 */
export type LegalBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; text: string };

/**
 * One heading + body section of a legal document — the unit both the
 * in-page table of contents and the document body iterate over, one to one.
 */
export interface LegalSection {
  /** Anchor id — the section's own heading id and its ToC entry's target.
   *  A stable, English, kebab-case slug in both locales (matches every other
   *  anchor id on the site, e.g. `CompanyContent["legal"]`'s `"legal"` —
   *  ids are addresses, not content, and are never translated). */
  id: string;
  /** Section heading, rendered as an `<h2>`. */
  heading: string;
  /** The section's body content, in display order. */
  blocks: LegalBlock[];
}

/**
 * Content shared by the Privacy Policy (`/privacy`) and Terms of Service
 * (`/terms`) pages — one interface for both, since they are two instances of
 * exactly the same long-form-document template (typography-led hero with a
 * draft-review banner, a table of contents, ordered sections) differing only
 * in copy, unlike e.g. the FAQ pattern's per-page component copies (see
 * `ResourcesFaq.tsx`'s header) which exist because those pages' FAQs are
 * free to diverge structurally over time. `LegalHero.tsx`/`LegalArticle.tsx`
 * under `src/components/sections/legal/` are the one shared implementation
 * both `src/app/[locale]/privacy/page.tsx` and `.../terms/page.tsx` render
 * through.
 *
 * Task G4: these are standard, plain-language, honest documents the SCRIPE
 * team wrote in-house to close a real launch blocker — the contact form
 * collects PII with no policy published anywhere — NOT a substitute for a
 * counsel-drafted policy. `banner`/`tbdLabel` and every {@link LegalBlock}
 * of kind `"note"` exist specifically so that gap is visible on the page
 * itself, not just in an internal report: no company registration number,
 * registered address, DPO name, or governing-law jurisdiction is invented
 * anywhere in this content — each is a marked placeholder instead.
 */
export interface LegalPageContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
    /** Breadcrumb label for the home crumb in structured data. */
    breadcrumbHome: string;
    /** Breadcrumb label for this page's own crumb in structured data. */
    breadcrumbCurrent: string;
  };
  /** Typography-led hero/intro — same shape as `ResourcesContent["hero"]`,
   *  minus a CTA (a legal document is a reading destination, not a
   *  conversion page — see `LegalHero.tsx`'s own header). */
  hero: {
    /** Small section marker label (e.g. "Legal"). */
    label: string;
    /** Page heading (e.g. "Privacy Policy"). */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
  };
  /** Visible "draft pending legal review" honesty banner, rendered directly
   *  under the hero — the standing disclosure that this is an in-house
   *  document, not yet reviewed by outside counsel. */
  banner: string;
  /** Pre-formatted effective-date line (e.g. "Effective August 19, 2026").
   *  Kept as one formatted string rather than a raw date value, since
   *  Arabic date formatting differs from a generic `Intl` call this
   *  content layer would otherwise have to hardcode. */
  effective: string;
  /** Table-of-contents landmark label (e.g. "On this page"). */
  tocLabel: string;
  /** Small uppercase tag shown on every `"note"`-kind {@link LegalBlock}
   *  (e.g. "Placeholder — pending counsel"), so a reader can tell a flagged
   *  gap apart from finished policy text without reading its body first. */
  tbdLabel: string;
  /** The document's sections, in reading and ToC order. */
  sections: LegalSection[];
}

/**
 * One link entry in the 404 page's link row — home + 2–3 top pages to guide
 * users back into the site.
 */
export interface NotFoundLink {
  /** Button label (e.g. "Back to home"). */
  label: string;
  /** Locale-less internal route the button links to. */
  href: string;
}

/**
 * Content for the 404 page (`/[...rest]`) — the catch-all that triggers when
 * a route does not exist within the matched locale. Ported from
 * `backup/scripe-static/404.html` + `js/lang-ar.js`: a large typographic
 * "404" treatment with lime accent, title/message copy, and a button row
 * (home + the platform and 2–3 top-level solution pages) that guide users
 * back into the site. Metadata sets `robots: { index: false }` to prevent
 * indexing of error pages.
 */
export interface NotFoundContent {
  /** Page-level metadata strings. */
  meta: {
    /** Page title (the layout's `"%s · SCRIPE"` template wraps it). */
    title: string;
    /** Meta/OG description. */
    description: string;
  };
  /** 404 hero section copy. */
  hero: {
    /** Status eyebrow (e.g. "404"). */
    code: string;
    /** Status label (e.g. "Not found"). */
    label: string;
    /** Page heading — the main error message. */
    title: string;
    /** Supporting sentence explaining what happened. */
    subtitle: string;
  };
  /** Link row buttons (home + top pages). */
  links: NotFoundLink[];
}
