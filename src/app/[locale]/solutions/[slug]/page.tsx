/**
 * Solution page template — the ONE render every solution
 * (`/solutions/sports-clubs`, `/solutions/sports-academies`,
 * `/solutions/sports-venues`, `/solutions/multi-sports-organizations`)
 * shares: hero → pain points → capabilities → outcomes → cross-links to the
 * other three solutions → closing CTA.
 *
 * All four render from `SolutionContent` (`src/content/types.ts`) with zero
 * per-slug branching — the only per-solution input is the registry's own
 * `accent` (`src/components/sections/solutions/registry.ts`), which flows
 * into every section as a prop. `slug` is a nested dynamic segment under
 * `[locale]`: this route's own `generateStaticParams` returns only the four
 * slugs (locale comes from the parent `[locale]/layout.tsx`'s own
 * `generateStaticParams` — Next.js crosses the two automatically), and
 * `dynamicParams = false` means any slug outside the four registered ones
 * 404s rather than rendering on demand.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent(pageId, locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/solutions/`, and the only client leaf on the
 * page is the shared `Reveal` primitive. Page-specific styles live in
 * `src/styles/solutions.css`, shared with the hub (see that file's header).
 */
import "@/styles/solutions.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Capabilities } from "@/components/sections/solutions/Capabilities";
import { Outcomes } from "@/components/sections/solutions/Outcomes";
import { OtherSolutions } from "@/components/sections/solutions/OtherSolutions";
import { PainPoints } from "@/components/sections/solutions/PainPoints";
import { isSolutionSlug, SOLUTION_REGISTRY, SOLUTION_SLUGS } from "@/components/sections/solutions/registry";
import { SolutionCta } from "@/components/sections/solutions/SolutionCta";
import { SolutionHero } from "@/components/sections/solutions/SolutionHero";
import { getContent } from "@/content";
import type { SolutionContent, SolutionsHubContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Returns the four solution slugs to prerender. Locale is supplied by the
 * parent `[locale]` segment's own `generateStaticParams` — Next.js crosses
 * this route's params with the parent's, so returning only `slug` here
 * still produces all eight (four slugs × two locales) static pages.
 */
export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

/** No slug outside {@link SOLUTION_SLUGS} is rendered, at build or at runtime. */
export const dynamicParams = false;

/**
 * Solution page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]`/`[slug]` segments.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSolutionSlug(slug)) notFound();

  const locale = await resolveLocale(params);
  const entry = SOLUTION_REGISTRY[slug];
  const content = getContent<SolutionContent>(entry.pageId, locale);

  return pageMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders one solution page: breadcrumb structured data followed by the
 * hero, pain points, capabilities, outcomes, cross-links to the other three
 * solutions, and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]`/`[slug]` segments.
 */
export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  if (!isSolutionSlug(slug)) notFound();

  const locale = await resolveLocale(params);

  const entry = SOLUTION_REGISTRY[slug];
  const content = getContent<SolutionContent>(entry.pageId, locale);
  const hub = getContent<SolutionsHubContent>("solutions", locale);
  const otherSolutions = hub.grid.items.filter((item) => item.href !== `/solutions/${slug}`);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbSolutions, url: `${origin}/${locale}/solutions` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/solutions/${slug}` },
        ])}
      />

      <SolutionHero content={content.hero} accent={entry.accent} slug={entry.slug} />
      <PainPoints content={content.painPoints} accent={entry.accent} />
      <Capabilities content={content.capabilities} accent={entry.accent} />
      <Outcomes content={content.outcomes} accent={entry.accent} />
      <OtherSolutions title={content.otherSolutions.title} items={otherSolutions} />
      <SolutionCta content={content.cta} />
    </>
  );
}
