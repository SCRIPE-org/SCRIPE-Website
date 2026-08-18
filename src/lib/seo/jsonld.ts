/**
 * JSON-LD structured data builders.
 *
 * Each `build*` function returns a plain, JSON-serializable object shaped to
 * a schema.org type — no React, no rendering. `src/components/seo/JsonLd.tsx`
 * is the only sanctioned place that turns a builder's output into markup, via
 * {@link serializeJsonLd}. Task 12 and individual page tasks import these
 * exact function names, so the field names and shapes here are a contract:
 * do not rename or restructure without updating every consumer.
 *
 * Deliberately out of scope: FAQPage/HowTo schema (not used anywhere on the
 * site), and `offers` on SoftwareApplication (SCRIPE has no single public
 * fixed price — pricing varies by currency/country, so asserting a price in
 * structured data would be a false claim to search engines).
 */

/** Supported site locales, matching `src/i18n/routing.ts`. */
export type Locale = "en" | "ar";

/** schema.org `Organization` node for SCRIPE, as returned by {@link buildOrganization}. */
export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

/** schema.org `SoftwareApplication` node for SCRIPE, as returned by {@link buildSoftwareApplication}. */
export interface SoftwareApplicationJsonLd {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  inLanguage: Locale;
}

/** A single crumb passed to {@link buildBreadcrumb}. */
export interface BreadcrumbInputItem {
  name: string;
  url: string;
}

/** One `ListItem` entry inside a {@link BreadcrumbJsonLd}. */
export interface BreadcrumbListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

/** schema.org `BreadcrumbList` node, as returned by {@link buildBreadcrumb}. */
export interface BreadcrumbJsonLd {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbListItem[];
}

/**
 * Builds the sitewide `Organization` JSON-LD node for SCRIPE.
 *
 * @param siteUrl - The site's canonical origin (e.g. `https://www.scripe.org`),
 *   no trailing slash. Env-driven so this works across environments.
 * @returns A plain `Organization` object. `logo` points at `/brand/logo.png`
 *   under `siteUrl` — a real 500x500 PNG shipped at `public/brand/logo.png`
 *   (copied from `backup/scripe-static/assets/images/scripe-logo.png`, the
 *   same source mark as `public/brand/scripe-logo-{dark,light}.svg`, just a
 *   raster export — Google's structured-data logo guidance recommends a
 *   raster format over SVG). `sameAs` is intentionally empty: no fabricated
 *   social profile links.
 */
export function buildOrganization(siteUrl: string): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SCRIPE",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.png`,
    sameAs: [],
  };
}

/**
 * Builds the sitewide `SoftwareApplication` JSON-LD node for SCRIPE.
 *
 * @param siteUrl - The site's canonical origin, no trailing slash.
 * @param locale - The locale of the page this node is embedded on. Determines
 *   both `url` (locale-prefixed) and `inLanguage`.
 * @returns A plain `SoftwareApplication` object. `offers` is deliberately
 *   omitted — SCRIPE pricing varies by currency/country and there is no
 *   single public fixed price to assert in structured data.
 */
export function buildSoftwareApplication(
  siteUrl: string,
  locale: Locale,
): SoftwareApplicationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SCRIPE",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
  };
}

/**
 * Builds a `BreadcrumbList` JSON-LD node from an ordered list of crumbs.
 *
 * @param items - The trail from the site root to the current page, in
 *   display order. `position` is derived from array order (1-based), so
 *   callers must pass items already in the correct sequence.
 * @returns A plain `BreadcrumbList` object with one `ListItem` per input
 *   item, `position` 1..n and `item` set to each crumb's `url`.
 */
export function buildBreadcrumb(items: BreadcrumbInputItem[]): BreadcrumbJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}

/**
 * Serializes a JSON-LD payload for safe injection into a `<script
 * type="application/ld+json">` tag.
 *
 * `JSON.stringify` alone is not enough: if a builder's input ever contains
 * the literal substring `</script>` (e.g. an untrusted page title), it would
 * close the script tag early and let the rest be parsed as HTML/script. This
 * is the ONLY sanctioned escaping step — `src/components/seo/JsonLd.tsx`
 * calls it rather than reimplementing the replace inline, so the contract
 * stays testable and single-sourced.
 *
 * @param data - Any JSON-serializable JSON-LD payload (an `Organization`,
 *   `SoftwareApplication`, `BreadcrumbList`, or similar plain object).
 * @returns The JSON string with every `<` replaced by its Unicode escape
 *   (`<`), so no raw `<` — and therefore no `</script>` — can appear in
 *   the output.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
