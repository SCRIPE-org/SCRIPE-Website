/**
 * `sitemap.xml` generator.
 *
 * Crosses {@link ROUTES} with every locale in `src/i18n/routing.ts` to emit
 * one entry per route per locale, each carrying `alternates.languages` so
 * crawlers can find the sibling-locale URL (and the `x-default` fallback)
 * without a second round trip. This is the only place that turns
 * `src/lib/seo/metadata.ts`'s route table into the sitemap's URL set — page
 * tasks do not need their own sitemap wiring.
 */
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { ROUTES, siteUrl } from "@/lib/seo/metadata";

/**
 * Builds the site's sitemap: `ROUTES.length * routing.locales.length`
 * entries (13 routes × 2 locales today).
 *
 * @returns The sitemap entries Next.js serializes to `sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();

  return ROUTES.flatMap((route) => {
    const suffix = route.path === "/" ? "" : route.path;
    const urlFor = (locale: (typeof routing.locales)[number]) => `${origin}/${locale}${suffix}`;
    const enUrl = urlFor("en");
    const languages = { en: enUrl, ar: urlFor("ar"), "x-default": enUrl };

    return routing.locales.map((locale) => ({
      url: urlFor(locale),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });
}
