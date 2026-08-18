/**
 * Resources page — the static shell: a typography-led hero, the setup-guide
 * grid, an FAQ, the platform product reference grid, an articles grid, and a
 * closing CTA. Also the structure-ready future home of the blog (design spec
 * §5.3) — see `ResourceItem`'s doc comment in `src/content/types.ts` for the
 * exact contract a later MDX pipeline maps onto without restructuring this
 * page.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("resources", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/resources/`, and there is no client leaf on this
 * page beyond `Reveal` — the FAQ's `<details>`/`<summary>` disclosures need
 * zero JavaScript (see `ResourcesFaq.tsx`'s file header). Page-specific
 * styles live in `src/styles/resources.css`, imported here so they ship with
 * this route only.
 *
 * Structured data is a `BreadcrumbList` only — no `FAQPage` schema is
 * emitted for the `#faq` section, per the design spec's SEO section
 * (rich-result FAQ markup is deprecated as of 2026) — the same rule
 * `src/app/[locale]/pricing/page.tsx` documents for its own FAQ.
 */
import "@/styles/resources.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticlesGrid } from "@/components/sections/resources/ArticlesGrid";
import { ClosingCta } from "@/components/sections/resources/ClosingCta";
import { GuidesGrid } from "@/components/sections/resources/GuidesGrid";
import { ProductReading } from "@/components/sections/resources/ProductReading";
import { ResourcesFaq } from "@/components/sections/resources/ResourcesFaq";
import { ResourcesHero } from "@/components/sections/resources/ResourcesHero";
import { getContent } from "@/content";
import type { ResourcesContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Resources page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<ResourcesContent>("resources", locale);

  return pageMetadata({
    locale,
    path: "/resources",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the resources page: breadcrumb structured data followed by the
 * hero, the guides grid, the FAQ, the product reference grid, the articles
 * grid and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Resources({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const content = getContent<ResourcesContent>("resources", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/resources` },
        ])}
      />

      <ResourcesHero content={content.hero} />
      <GuidesGrid content={content.guides} />
      <ResourcesFaq content={content.faq} />
      <ProductReading content={content.productReading} />
      <ArticlesGrid content={content.articles} />
      <ClosingCta content={content.cta} />
    </>
  );
}
