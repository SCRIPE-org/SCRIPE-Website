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
