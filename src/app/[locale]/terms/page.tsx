/**
 * Terms of Service page — the sibling of `/privacy`, rendered through the
 * exact same shared template (`LegalHero`/`LegalArticle`, see those files'
 * own headers for why the two pages are one template rather than two). See
 * `src/content/en/terms.ts`'s file header for the evidence trail behind
 * every factual claim (sales-assisted onboarding, indicative pricing,
 * no third-party links), and for why a governing law/jurisdiction and a
 * legal entity name are marked as pending outside-counsel review rather
 * than invented.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("terms", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`). Page-specific styles live in
 * `src/styles/legal.css`, already imported by `/privacy` — Next.js
 * deduplicates the shared stylesheet rather than shipping it twice.
 */
import "@/styles/legal.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalArticle } from "@/components/sections/legal/LegalArticle";
import { LegalHero } from "@/components/sections/legal/LegalHero";
import { getContent } from "@/content";
import type { LegalPageContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Terms of Service metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<LegalPageContent>("terms", locale);

  return pageMetadata({
    locale,
    path: "/terms",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the Terms of Service page: breadcrumb structured data followed by
 * the shared legal-document hero and article body.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Terms({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<LegalPageContent>("terms", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/terms` },
        ])}
      />

      <LegalHero content={content.hero} banner={content.banner} effective={content.effective} />
      <LegalArticle sections={content.sections} tocLabel={content.tocLabel} tbdLabel={content.tbdLabel} />
    </>
  );
}
