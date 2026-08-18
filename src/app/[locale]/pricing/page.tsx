/**
 * Pricing page — the static shell: a typography-led hero, the billing
 * toggle plus three plan cards, a full comparison table, an FAQ, and a
 * closing CTA.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("pricing", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/pricing/`, and the only client leaf on the page
 * is `BillingToggle` (see that file's header for why it needs to be one).
 * Page-specific styles live in `src/styles/pricing.css`, imported here so
 * they ship with this route only.
 *
 * Structured data is a `BreadcrumbList` only — no `Offer`/`AggregateOffer`
 * schema, per the design spec's SEO section: SCRIPE has no single public
 * fixed price (it varies by currency/country and is confirmed per
 * organization before signing), so asserting a price to search engines
 * would be a false claim. The FAQ section similarly emits no FAQPage schema
 * (see `PricingFaq.tsx`'s header).
 */
import "@/styles/pricing.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClosingCta } from "@/components/sections/pricing/ClosingCta";
import { ComparisonTable } from "@/components/sections/pricing/ComparisonTable";
import { PlanCards } from "@/components/sections/pricing/PlanCards";
import { PricingFaq } from "@/components/sections/pricing/PricingFaq";
import { PricingHero } from "@/components/sections/pricing/PricingHero";
import { getContent } from "@/content";
import type { PricingContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Pricing page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<PricingContent>("pricing", locale);

  return pageMetadata({
    locale,
    path: "/pricing",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the pricing page: breadcrumb structured data followed by the
 * hero, the plan cards, the comparison table, the FAQ and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const content = getContent<PricingContent>("pricing", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/pricing` },
        ])}
      />

      <PricingHero content={content.hero} />
      <PlanCards billing={content.billing} plans={content.plans} plansFootnote={content.plansFootnote} />
      <ComparisonTable content={content.comparison} plans={content.plans} />
      <PricingFaq content={content.faq} />
      <ClosingCta content={content.cta} />
    </>
  );
}
