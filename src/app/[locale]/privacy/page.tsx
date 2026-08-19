/**
 * Privacy Policy page — a standard, honest, plain-language document covering
 * this marketing website, written to close a real launch blocker: the
 * Contact page's demo-request form collects a visitor's name, email,
 * organization and message, and no policy anywhere on the site described
 * that. See `src/content/en/privacy.ts`'s file header for the full evidence
 * trail behind every factual claim, and for why several facts (a legal
 * entity name, a retention schedule, cross-border transfer safeguards) are
 * marked as pending outside-counsel review rather than invented.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("privacy", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are the shared `LegalHero`/
 * `LegalArticle` server components under `src/components/sections/legal/`
 * (the same template `/terms` renders through — see those files' own
 * headers), and the only client leaves on the page are the shared `Reveal`
 * primitive. Page-specific styles live in `src/styles/legal.css`, imported
 * here so they ship with both `/privacy` and `/terms` only.
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
 * Privacy Policy metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<LegalPageContent>("privacy", locale);

  return pageMetadata({
    locale,
    path: "/privacy",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the Privacy Policy page: breadcrumb structured data followed by
 * the shared legal-document hero and article body.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<LegalPageContent>("privacy", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/privacy` },
        ])}
      />

      <LegalHero content={content.hero} banner={content.banner} effective={content.effective} />
      <LegalArticle sections={content.sections} tocLabel={content.tocLabel} tbdLabel={content.tbdLabel} />
    </>
  );
}
