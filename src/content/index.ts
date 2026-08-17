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
import { homeContent as homeAr } from "./ar/home";

/**
 * Maps each registered page to its content for every locale.
 *
 * Declared `Partial` because pages register incrementally as they are
 * built — an id from PageId with no entry here simply has not been ported
 * yet, and getContent() throws a clear error if it is requested.
 */
export const CONTENT_REGISTRY: Partial<Record<PageId, Record<Locale, unknown>>> = {
  home: { en: homeEn, ar: homeAr },
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
