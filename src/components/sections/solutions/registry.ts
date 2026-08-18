/**
 * Solutions slug registry — the single module that maps a `[slug]` URL
 * segment to its content `PageId` and product-world accent identity.
 *
 * `src/app/[locale]/solutions/[slug]/page.tsx` reads this (never a
 * hand-rolled `switch`/`if` chain) for `generateStaticParams`, content
 * lookup and accent selection, so the four solution pages render from one
 * template with zero per-slug branching. Mirrors
 * `src/components/chrome/ia.ts`'s `SOLUTIONS` mega-menu mapping — kept as an
 * independent map rather than importing it, the same "self-contained page
 * folder" convention `src/components/sections/platform/accents.ts` already
 * documents (chrome IA is about navigation entries/message keys; this is
 * about routing/content, a different concern that happens to share the same
 * four accent values).
 */
import type { AccentId, PageId } from "@/content/types";

/** URL slug for one of the four solution pages. */
export type SolutionSlug =
  | "sports-clubs"
  | "sports-academies"
  | "sports-venues"
  | "multi-sports-organizations";

/** A solution page's content id and accent identity. */
export interface SolutionRegistryEntry {
  /** The slug itself, repeated here so a lookup result is self-describing. */
  slug: SolutionSlug;
  /** The content pipeline id `getContent()` reads this solution from. */
  pageId: Extract<
    PageId,
    "solutionClubs" | "solutionAcademies" | "solutionVenues" | "solutionMultiSport"
  >;
  /** Product-world accent identity carried through the whole template. */
  accent: AccentId;
}

/**
 * Slug → registry entry. Object key order is the canonical display order
 * used wherever the four solutions are listed together (the hub grid, the
 * "other solutions" cross-links).
 */
export const SOLUTION_REGISTRY: Record<SolutionSlug, SolutionRegistryEntry> = {
  "sports-clubs": { slug: "sports-clubs", pageId: "solutionClubs", accent: "club" },
  "sports-academies": { slug: "sports-academies", pageId: "solutionAcademies", accent: "academy" },
  "sports-venues": { slug: "sports-venues", pageId: "solutionVenues", accent: "venue" },
  "multi-sports-organizations": {
    slug: "multi-sports-organizations",
    pageId: "solutionMultiSport",
    accent: "fi",
  },
};

/** Every solution slug, in canonical display order. */
export const SOLUTION_SLUGS = Object.keys(SOLUTION_REGISTRY) as SolutionSlug[];

/** Narrows an arbitrary route param to {@link SolutionSlug}. */
export function isSolutionSlug(value: string): value is SolutionSlug {
  return Object.prototype.hasOwnProperty.call(SOLUTION_REGISTRY, value);
}
