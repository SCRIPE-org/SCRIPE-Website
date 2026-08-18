/**
 * Solutions hub page — the four organization shapes SCRIPE configures for:
 * a typography-led hero, a four-card gateway grid, a comparison grid, the
 * "what never changes" shared value proposition, and a closing CTA.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("solutions", locale)` — parity between locales is enforced
 * by `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/solutions/`, and the only client leaf on the
 * page is the shared `Reveal` primitive. Page-specific styles live in
 * `src/styles/solutions.css`, shared with the `[slug]` template (see that
 * file's header for why) and imported here so both routes ship it.
 */
import "@/styles/solutions.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { JsonLd } from "@/components/seo/JsonLd";
import { HubCompare } from "@/components/sections/solutions/HubCompare";
import { HubCta } from "@/components/sections/solutions/HubCta";
import { HubGrid } from "@/components/sections/solutions/HubGrid";
import { HubHero } from "@/components/sections/solutions/HubHero";
import { HubShared } from "@/components/sections/solutions/HubShared";
import { getContent } from "@/content";
import type { SolutionsHubContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Solutions hub metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<SolutionsHubContent>("solutions", locale);

  return pageMetadata({
    locale,
    path: "/solutions",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the solutions hub: breadcrumb structured data followed by the
 * hero, the four-card grid, the comparison grid, the shared value section
 * and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function SolutionsHub({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<SolutionsHubContent>("solutions", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/solutions` },
        ])}
      />

      <HubHero content={content.hero} />
      <HubGrid content={content.grid} />
      <HubCompare content={content.compare} />
      <HubShared content={content.shared} />
      <HubCta content={content.cta} />
    </>
  );
}
