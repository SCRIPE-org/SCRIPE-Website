/**
 * Home page — the full seven-section Fusion composition:
 * Camera-Hero → product family → platform → solutions → automation →
 * branches → closing CTA.
 *
 * Wave H removed the `#trusted` strip that used to sit between the hero and
 * the product family: a heading claiming trust with nothing under it (its
 * category-pill row had already been amputated for reading like a fake logo
 * wall). The ground sequence's film-slate timecode renumbered with it, so it
 * still runs contiguously from the hero's last beat — product family is now
 * `05`, branches `09`. `src/content/types.ts`'s `HomeContent` carries the
 * full reasoning and the condition for reinstating a trust section.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("home", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/home/`, and the only client leaves on the page
 * are the shared `Reveal` primitive and the hero's `HeroDirector` (which
 * lazy-loads GSAP after mount — never in the initial chunk). Page-specific
 * styles live in `src/styles/home.css`, imported here so they ship with
 * this route only.
 */
import "@/styles/home.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { JsonLd } from "@/components/seo/JsonLd";
import { AutomationStory } from "@/components/sections/home/AutomationStory";
import { BranchesStory } from "@/components/sections/home/BranchesStory";
import { ClosingCta } from "@/components/sections/home/ClosingCta";
import { Hero } from "@/components/sections/home/Hero";
import { PlatformOverview } from "@/components/sections/home/PlatformOverview";
import { ProductFamily } from "@/components/sections/home/ProductFamily";
import { SolutionsGrid } from "@/components/sections/home/SolutionsGrid";
import { getContent } from "@/content";
import type { HomeContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb, buildSoftwareApplication } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Home page metadata: canonical/hreflang/OG via {@link pageMetadata}, with
 * the title made absolute — the home page carries the full brand title and
 * must not receive the layout's `"%s · SCRIPE"` template suffix.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<HomeContent>("home", locale);

  return {
    ...pageMetadata({
      locale,
      path: "/",
      title: content.meta.title,
      description: content.meta.description,
    }),
    title: { absolute: content.meta.title },
  };
}

/**
 * Renders the home page: structured data (breadcrumb + software
 * application) followed by the seven sections in narrative order.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<HomeContent>("home", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
        ])}
      />
      <JsonLd data={buildSoftwareApplication(origin, locale)} />

      <Hero content={content.hero} />
      <ProductFamily content={content.productFamily} />
      <PlatformOverview content={content.platform} />
      <SolutionsGrid content={content.solutions} />
      <AutomationStory content={content.automation} />
      <BranchesStory content={content.branches} />
      <ClosingCta content={content.closing} />
    </>
  );
}
