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
 * Content for the home page — the full eight-section composition:
 * hero → trusted → product family → platform → solutions → automation →
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
    /** The SCRIPE wordmark (always Latin). */
    wordmark: string;
    /** Brand tagline rendered inside the `<h1>` under the wordmark. */
    tagline: string;
    /** Alt text for the campus plate photograph. */
    plateAlt: string;
    /** Scroll-affordance hint under the stage. */
    scrollHint: string;
    /** Progress-rail label for the intro beat. */
    railIntro: string;
    /** The five camera chapters, in flight order. The last chapter is the
     *  destination beat that carries the CTAs in armed (cinematic) mode. */
    chapters: HeroChapter[];
    /** Label of the primary call-to-action button. */
    primaryCta: string;
    /** Label of the secondary call-to-action button. */
    secondaryCta: string;
  };
  /** Honest positioning strip (`#trusted`) — categories, never fake logos. */
  trusted: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** Organization categories SCRIPE is built for. */
    categories: string[];
  };
  /** Product family section (`#product`) — the three SCRIPE products. */
  productFamily: {
    /** Section heading. */
    title: string;
    /** Supporting sentence. */
    subtitle: string;
    /** The three products, in presentation order. */
    products: ProductEntry[];
  };
  /** Platform overview (`#platform`) — narrative + operations-board evidence. */
  platform: {
    /** Small section marker label. */
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
      /** Honesty badge shown at the panel header end. */
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
    /** Secondary CTA label (start free trial). */
    secondaryCta: string;
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
    /** The "what this looks like" mini evidence panel beside the hero copy. */
    snapshot: {
      /** Panel label (e.g. "What this looks like"). */
      label: string;
      /** Three illustrative metrics. */
      stats: SolutionStat[];
      /** Honesty note under the stats (sample data, not live). */
      note: string;
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
    /** Honesty note under the strip (sample data, not live). */
    note: string;
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
