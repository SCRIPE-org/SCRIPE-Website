/**
 * `robots.txt` generator.
 *
 * Preview/staging deployments must never be indexed — a crawler that finds
 * a Vercel preview URL and indexes it produces duplicate-content SEO
 * penalties and can leak unfinished pages into search results. `VERCEL_ENV`
 * is the authoritative signal Vercel sets on every deployment (`production`,
 * `preview`, or `development`); an exact `"production"` match allows
 * indexing. Locally (`VERCEL_ENV` unset) this also falls through to
 * disallow-all, which is the safe default for a `next dev`/`next build`
 * run on a machine that was never meant to be crawled.
 *
 * `VERCEL_ENV` alone was a de-index TRAP for any non-Vercel production
 * deploy (self-hosted, another PaaS, a container) — that host never sets
 * `VERCEL_ENV`, so a real production launch would silently ship
 * `Disallow: /` forever with no way to opt in. `SITE_INDEXABLE=true` is the
 * escape hatch: an explicit, deliberately-set env var (documented in
 * `.env.example`) that allows indexing on any host, Vercel or not. Still
 * defaults closed — indexing requires ONE of the two signals, never assumed.
 */
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

/**
 * Builds the site's `robots.txt`.
 *
 * @returns Allow-all with a `sitemap:` pointer when indexing is allowed
 *   (`VERCEL_ENV === "production"` OR `SITE_INDEXABLE === "true"`);
 *   disallow-all everywhere else (previews, local dev, CI builds).
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.VERCEL_ENV === "production" || process.env.SITE_INDEXABLE === "true";

  if (indexable) {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${siteUrl()}/sitemap.xml`,
    };
  }

  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
