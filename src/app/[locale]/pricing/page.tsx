/**
 * Pricing page — the static shell: a typography-led hero, the billing
 * toggle plus three plan cards, a full comparison table, an FAQ, and a
 * closing CTA.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("pricing", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), and sections are server components under
 * `src/components/sections/pricing/`. `BillingToggle` was originally the
 * page's only client leaf (see that file's header for why it needs to be
 * one); Task 21's live geo-currency pricing added four more —
 * `PricingCurrencyProvider`, `LivePrices`, `CurrencySelect` and
 * `CurrencyNote`, all under "Live geo-currency pricing" below — without
 * turning any Server Component section into a Client Component itself.
 * Page-specific styles live in `src/styles/pricing.css`, imported here so
 * they ship with this route only.
 *
 * Structured data is a `BreadcrumbList` only — no `Offer`/`AggregateOffer`
 * schema, per the design spec's SEO section: SCRIPE has no single public
 * fixed price (it varies by currency/country and is confirmed per
 * organization before signing), so asserting a price to search engines
 * would be a false claim. The FAQ section similarly emits no FAQPage schema
 * (see `PricingFaq.tsx`'s header).
 *
 * ## Live geo-currency pricing (Task 21)
 *
 * The whole returned body is wrapped in `PricingCurrencyProvider` — the one
 * shared client-state module `LivePrices` (mounted here, at the end of the
 * page) and `CurrencySelect`/`CurrencyNote` (mounted inside `PlanCards`,
 * next to the billing toggle and under the plan grid respectively)
 * coordinate through. See that Provider's own header for why a Context
 * Provider is the right shape for state shared between three components
 * that aren't one another's parent. `LivePrices` needs the baked SAR
 * baseline for every convertible price slot to convert FROM — `priceSlots`
 * below derives that list straight from `content.plans` (the same content
 * `PlanCards` itself renders from), one `{ slot, baseSar }` pair per
 * amount-priced plan × billing cycle, so it can never drift out of sync
 * with what `PlanCards.tsx`'s `data-price-slot` markup actually renders.
 * Enterprise (`baseMonthly`/`baseYearly: null`) is naturally excluded by the
 * `null` check — it has no numeric SAR baseline to convert.
 */
import "@/styles/pricing.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClosingCta } from "@/components/sections/pricing/ClosingCta";
import { ComparisonTable } from "@/components/sections/pricing/ComparisonTable";
import { LivePrices, type PriceSlot } from "@/components/sections/pricing/LivePrices";
import { PlanCards } from "@/components/sections/pricing/PlanCards";
import { PricingCurrencyProvider } from "@/components/sections/pricing/PricingCurrencyProvider";
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
 * Derives `LivePrices`' `slots` prop from `content.plans` — one
 * `{ slot, baseSar }` pair per amount-priced plan × billing cycle, matching
 * `PlanCards.tsx`'s `data-price-slot="<planId>-<cycle>"` values exactly.
 * Enterprise (or any future custom-quoted plan) is skipped: `baseMonthly`/
 * `baseYearly` are `null` for it, so there is no SAR figure to convert.
 *
 * @param plans - `content.plans`, in the same order `PlanCards.tsx` renders.
 * @returns The convertible price slots for this page's `LivePrices` mount.
 */
function priceSlotsFromPlans(plans: PricingContent["plans"]): PriceSlot[] {
  return plans.flatMap((plan) =>
    plan.baseMonthly !== null && plan.baseYearly !== null
      ? [
          { slot: `${plan.id}-monthly`, baseSar: plan.baseMonthly },
          { slot: `${plan.id}-yearly`, baseSar: plan.baseYearly },
        ]
      : [],
  );
}

/**
 * Renders the pricing page: breadcrumb structured data followed by the
 * hero, the plan cards, the comparison table, the FAQ and the closing CTA,
 * all wrapped in `PricingCurrencyProvider` (see this file's header) so the
 * live-currency client leaves can coordinate.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);

  const content = getContent<PricingContent>("pricing", locale);
  const origin = siteUrl();

  return (
    <PricingCurrencyProvider>
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

      {/* Renders nothing — a DOM-writing effect only. See LivePrices.tsx's
          header for why it mounts here rather than inside PlanCards. */}
      <LivePrices slots={priceSlotsFromPlans(content.plans)} />
    </PricingCurrencyProvider>
  );
}
