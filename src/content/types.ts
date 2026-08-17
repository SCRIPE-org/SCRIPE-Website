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
 * Content for the home page.
 *
 * Task 7 scope covers the hero section only; later page tasks extend this
 * interface as additional home page sections are ported from the legacy
 * static site.
 */
export interface HomeContent {
  /** Home page hero: headline block above the fold, with its two CTAs. */
  hero: {
    /** Short kicker label shown above the headline. */
    eyebrow: string;
    /** Primary hero headline. */
    title: string;
    /** Supporting sentence rendered under the headline. */
    subtitle: string;
    /** Label of the primary call-to-action button. */
    primaryCta: string;
    /** Label of the secondary call-to-action button. */
    secondaryCta: string;
  };
}
