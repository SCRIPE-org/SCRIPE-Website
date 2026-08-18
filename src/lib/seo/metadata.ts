/**
 * Shared SEO metadata primitives.
 *
 * Three things live here because every consumer needs all three together:
 * - {@link siteUrl} resolves the canonical origin every absolute URL in the
 *   site's metadata is built from (canonicals, OG/twitter URLs, sitemap
 *   entries, `robots.txt`'s `sitemap:` line, JSON-LD `url`/`logo` fields).
 * - {@link ROUTES} is the single indexable-route table. `src/app/sitemap.ts`
 *   walks it to emit one entry per route per locale; later page tasks may
 *   read it to look up a page's own `changeFrequency`/`priority`.
 * - {@link pageMetadata} is the `generateMetadata` helper every page task
 *   (and the root `src/app/[locale]/layout.tsx`) calls to produce a
 *   `Metadata` object with a correct canonical, hreflang alternates, and
 *   OpenGraph/Twitter tags, without re-deriving that shape by hand per page.
 *
 * Never hardcode `https://www.scripe.org` (or any other origin) outside
 * {@link siteUrl} — every other module that needs the site's origin calls it.
 */
import type { Metadata } from "next";
import type { PageId } from "@/content/types";
import type { Locale } from "@/i18n/routing";

/**
 * Resolves the site's canonical origin.
 *
 * Reads `process.env.SITE_URL` — authoritative on Vercel, where it is set
 * per environment (production vs. preview) — and strips any trailing
 * slash so callers can safely concatenate a leading-slash path onto the
 * result. Falls back to the production origin so code paths that run
 * without a `.env` (unit tests, a bare `next build` locally) still produce
 * valid absolute URLs instead of `undefined`-tainted ones.
 *
 * @returns The site origin, e.g. `https://www.scripe.org` — never a
 *   trailing slash.
 */
export function siteUrl(): string {
  const configured = process.env.SITE_URL ?? "https://www.scripe.org";
  return configured.replace(/\/+$/, "");
}

/** One entry in the indexable route table. See {@link ROUTES}. */
export interface RouteEntry {
  /** The page's identifier in `src/content/types.ts`'s `PageId` union. */
  id: PageId;
  /** Locale-agnostic path, e.g. `/solutions/sports-clubs`. Root is `/`. */
  path: string;
  /** `sitemap.xml`'s `<changefreq>` hint for this route. */
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** `sitemap.xml`'s `<priority>` hint for this route, `0`–`1`. */
  priority: number;
}

/**
 * The site's indexable route table: every {@link PageId} except `notFound`
 * (which by definition is never a real, indexable page).
 *
 * `src/app/sitemap.ts` is this table's only consumer today — it crosses
 * `ROUTES` with `routing.locales` to emit one sitemap entry per route per
 * locale. Page tasks that need their own `changeFrequency`/`priority` (e.g.
 * to keep a page's own metadata consistent with its sitemap entry) may read
 * it too; nothing about this table is sitemap-only.
 *
 * Ordering mirrors the site's primary navigation (see `messages/en.json`'s
 * `nav` keys), not priority — read `priority` for ranking, not array order.
 */
export const ROUTES: ReadonlyArray<RouteEntry> = [
  { id: "home", path: "/", changeFrequency: "weekly", priority: 1.0 },
  { id: "platform", path: "/platform", changeFrequency: "monthly", priority: 0.9 },
  { id: "solutions", path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  {
    id: "solutionClubs",
    path: "/solutions/sports-clubs",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    id: "solutionAcademies",
    path: "/solutions/sports-academies",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    id: "solutionVenues",
    path: "/solutions/sports-venues",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    id: "solutionMultiSport",
    path: "/solutions/multi-sports-organizations",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { id: "pricing", path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { id: "resources", path: "/resources", changeFrequency: "weekly", priority: 0.7 },
  { id: "company", path: "/company", changeFrequency: "yearly", priority: 0.5 },
  { id: "contact", path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

/** Options accepted by {@link pageMetadata}. */
export interface PageMetadataOptions {
  /** The page's active locale. */
  locale: Locale;
  /** Locale-agnostic path, e.g. `/pricing` or `/` for the home page. Matches
   *  a {@link RouteEntry.path} for indexable pages. */
  path: string;
  /** Page title. Rendered as-is here; the root layout's `title.template`
   *  (`"%s · SCRIPE"`) wraps it for the `<title>` tag. */
  title: string;
  /** Page meta description, and the OpenGraph/Twitter description. */
  description: string;
}

/**
 * Pixel dimensions and alt text of `src/app/[locale]/opengraph-image.tsx`'s
 * generated image. Duplicated here (rather than imported) because that file
 * is a Next.js special route file — importing it would pull `next/og` and
 * `node:fs` into every page's metadata resolution. Keep these two literals
 * in sync with that file's own `size`/`alt` exports if either ever changes.
 */
const OG_IMAGE_SIZE = { width: 1200, height: 630 };
const OG_IMAGE_ALT = "SCRIPE — Sports Operations OS";

/**
 * Builds a page's `Metadata` object: canonical URL, hreflang alternates
 * (`en`, `ar`, and `x-default` pointing at the `en` URL), and matching
 * OpenGraph/Twitter tags.
 *
 * Every page task's `generateMetadata` calls this — it is the only
 * sanctioned way to produce a page's canonical/alternates/OG shape, so a
 * site-wide change (e.g. adding a new locale) only has to happen here.
 *
 * @param opts - See {@link PageMetadataOptions}.
 * @returns A `Metadata` object ready to return from `generateMetadata`.
 */
export function pageMetadata({ locale, path, title, description }: PageMetadataOptions): Metadata {
  const origin = siteUrl();
  const suffix = path === "/" ? "" : path;
  const urlFor = (loc: Locale) => `${origin}/${loc}${suffix}`;
  const canonical = urlFor(locale);
  const enUrl = urlFor("en");
  // The locale-scoped OG image route (`src/app/[locale]/opengraph-image.tsx`)
  // only auto-attaches itself to the page.tsx living in that exact segment
  // folder (the home page) — every other page defines its own `openGraph`
  // object via this function, which replaces rather than merges with that
  // auto-attached image, so every non-home page silently shipped without an
  // `og:image`/`twitter:image` tag. Setting `images` explicitly here fixes
  // every page (including home) with one consistent, locale-correct URL.
  const ogImageUrl = `${origin}/${locale}/opengraph-image`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        ar: urlFor("ar"),
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "SCRIPE",
      // Plain "en"/"ar" — not "en_US"/"ar_AR" — to match the site's own
      // two-locale model (src/i18n/routing.ts) rather than inventing a
      // region SCRIPE doesn't otherwise track.
      locale,
      type: "website",
      images: [{ url: ogImageUrl, ...OG_IMAGE_SIZE, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
