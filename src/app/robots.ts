/**
 * `robots.txt` generator.
 *
 * Preview/staging deployments must never be indexed — a crawler that finds
 * a Vercel preview URL and indexes it produces duplicate-content SEO
 * penalties and can leak unfinished pages into search results. `VERCEL_ENV`
 * is the authoritative signal Vercel sets on every deployment (`production`,
 * `preview`, or `development`); only an exact `"production"` match allows
 * indexing. Locally (`VERCEL_ENV` unset) this also falls through to
 * disallow-all, which is the safe default for a `next dev`/`next build`
 * run on a machine that was never meant to be crawled.
 */
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

/**
 * Builds the site's `robots.txt`.
 *
 * @returns Allow-all with a `sitemap:` pointer in production; disallow-all
 *   everywhere else (previews, local dev, CI builds).
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "production") {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${siteUrl()}/sitemap.xml`,
    };
  }

  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
