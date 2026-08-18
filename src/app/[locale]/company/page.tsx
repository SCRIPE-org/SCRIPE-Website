/**
 * Company page — the smallest page in the fusion rebuild, and the one page
 * that speaks in the brand's own voice rather than a product's: a
 * typography-led statement hero, the mission paired with the product vision
 * checklist, four operating principles, the "working with us" / legal
 * honesty notice (`#legal`), and a closing CTA.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("company", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/company/`, and the only client leaf on the page
 * is the shared `Reveal` primitive. Page-specific styles live in
 * `src/styles/company.css`, imported here so they ship with this route only.
 */
import "@/styles/company.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClosingCta } from "@/components/sections/company/ClosingCta";
import { CompanyHero } from "@/components/sections/company/CompanyHero";
import { LegalNotice } from "@/components/sections/company/LegalNotice";
import { MissionVision } from "@/components/sections/company/MissionVision";
import { OperatingPrinciples } from "@/components/sections/company/OperatingPrinciples";
import { getContent } from "@/content";
import type { CompanyContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Company page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<CompanyContent>("company", locale);

  return pageMetadata({
    locale,
    path: "/company",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the company page: breadcrumb structured data followed by the
 * hero, the paired mission/vision section, the operating principles, the
 * legal notice and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Company({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<CompanyContent>("company", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/company` },
        ])}
      />

      <CompanyHero content={content.hero} />
      <MissionVision mission={content.mission} vision={content.vision} />
      <OperatingPrinciples content={content.principles} />
      <LegalNotice content={content.legal} />
      <ClosingCta content={content.cta} />
    </>
  );
}
