/**
 * Content registry and typed accessor for the server-only content pipeline.
 *
 * Pages register their bilingual content here as they are ported from the
 * legacy static site. getContent() is the single read path page components
 * use to pull typed, locale-specific copy — callers never import a page's
 * en/ar content files directly.
 */
import type { Locale, PageId } from "./types";
import { homeContent as homeEn } from "./en/home";
import { platformContent as platformEn } from "./en/platform";
import { solutionsContent as solutionsEn } from "./en/solutions";
import { solutionClubsContent as solutionClubsEn } from "./en/solution-clubs";
import { solutionAcademiesContent as solutionAcademiesEn } from "./en/solution-academies";
import { solutionVenuesContent as solutionVenuesEn } from "./en/solution-venues";
import { solutionMultiSportContent as solutionMultiSportEn } from "./en/solution-multi-sport";
import { pricingContent as pricingEn } from "./en/pricing";
import { resourcesContent as resourcesEn } from "./en/resources";
import { companyContent as companyEn } from "./en/company";
import { contactContent as contactEn } from "./en/contact";
import { homeContent as homeAr } from "./ar/home";
import { platformContent as platformAr } from "./ar/platform";
import { solutionsContent as solutionsAr } from "./ar/solutions";
import { solutionClubsContent as solutionClubsAr } from "./ar/solution-clubs";
import { solutionAcademiesContent as solutionAcademiesAr } from "./ar/solution-academies";
import { solutionVenuesContent as solutionVenuesAr } from "./ar/solution-venues";
import { solutionMultiSportContent as solutionMultiSportAr } from "./ar/solution-multi-sport";
import { pricingContent as pricingAr } from "./ar/pricing";
import { resourcesContent as resourcesAr } from "./ar/resources";
import { companyContent as companyAr } from "./ar/company";
import { contactContent as contactAr } from "./ar/contact";

/**
 * Maps each registered page to its content for every locale.
 *
 * Declared `Partial` because pages register incrementally as they are
 * built — an id from PageId with no entry here simply has not been ported
 * yet, and getContent() throws a clear error if it is requested.
 */
export const CONTENT_REGISTRY: Partial<Record<PageId, Record<Locale, unknown>>> = {
  home: { en: homeEn, ar: homeAr },
  platform: { en: platformEn, ar: platformAr },
  solutions: { en: solutionsEn, ar: solutionsAr },
  solutionClubs: { en: solutionClubsEn, ar: solutionClubsAr },
  solutionAcademies: { en: solutionAcademiesEn, ar: solutionAcademiesAr },
  solutionVenues: { en: solutionVenuesEn, ar: solutionVenuesAr },
  solutionMultiSport: { en: solutionMultiSportEn, ar: solutionMultiSportAr },
  pricing: { en: pricingEn, ar: pricingAr },
  resources: { en: resourcesEn, ar: resourcesAr },
  company: { en: companyEn, ar: companyAr },
  contact: { en: contactEn, ar: contactAr },
};

/**
 * Looks up typed content for a page/locale pair.
 *
 * @param page - Page identifier to load content for.
 * @param locale - Active locale to read.
 * @returns The page's content, cast to the caller-supplied type `T`.
 * @throws If `page` has not been registered in CONTENT_REGISTRY, or the
 *   registered entry has no content for `locale`.
 */
export function getContent<T>(page: PageId, locale: Locale): T {
  const entry = CONTENT_REGISTRY[page];
  if (!entry) {
    throw new Error(
      `[content] No content registered for page "${page}". Add src/content/en/${page}.ts ` +
        `and src/content/ar/${page}.ts, then register them in CONTENT_REGISTRY.`,
    );
  }
  const value = entry[locale];
  if (value === undefined) {
    throw new Error(`[content] Page "${page}" has no content registered for locale "${locale}".`);
  }
  return value as T;
}
