/**
 * Platform page — the capability catalog: a typography-led hero, thirteen
 * capability modules grouped into five product-accent families behind a
 * sticky subnav, a consolidated dashboard strip, and a closing CTA.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("platform", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), sections are server components under
 * `src/components/sections/platform/`, and the only client leaves on the
 * page are the shared `Reveal` primitive and `CapabilitySubnav` (its
 * scroll-driven active-link state). Page-specific styles live in
 * `src/styles/platform.css`, imported here so they ship with this route
 * only.
 */
import "@/styles/platform.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { CapabilityGroup } from "@/components/sections/platform/CapabilityGroup";
import { CapabilityHero } from "@/components/sections/platform/CapabilityHero";
import { CapabilitySubnav } from "@/components/sections/platform/CapabilitySubnav";
import { ClosingCta } from "@/components/sections/platform/ClosingCta";
import { DashboardStrip } from "@/components/sections/platform/DashboardStrip";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import type { PlatformContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Platform page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<PlatformContent>("platform", locale);

  return pageMetadata({
    locale,
    path: "/platform",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the platform page: breadcrumb structured data followed by the
 * hero, the sticky subnav, the five capability groups, the dashboard strip
 * and the closing CTA.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Platform({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const content = getContent<PlatformContent>("platform", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/platform` },
        ])}
      />

      <CapabilityHero content={content.hero} />

      <CapabilitySubnav
        label={content.nav.label}
        items={content.groups.map((group) => ({ id: group.id, name: group.name, accent: group.accent }))}
      />

      {/* Default (1360px) container width throughout — matching the hero,
          dashboard strip and closing CTA, and the subnav's own inner width,
          so no section's content edge shifts as the reader scrolls. */}
      <Section>
        {/* A modest gap, not a full section gap: each `CapabilityGroup`
            already opens on its own hairline rule (the family-boundary
            marker) with its own top padding, so the gap here only needs to
            clear the previous group's last module row before that rule —
            stacking a large gap on top of the rule's own padding would read
            as a doubled, redundant break. */}
        <div className="grid gap-4">
          {content.groups.map((group) => (
            <CapabilityGroup key={group.id} group={group} />
          ))}
        </div>
      </Section>

      <DashboardStrip content={content.dashboard} />
      <ClosingCta content={content.closing} />
    </>
  );
}
