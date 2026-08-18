/**
 * Contact page — the site's only form and its one true conversion surface: a
 * typography-led hero followed by a two-column "conversation" (the
 * demo-request form beside a "what happens next" + honest contact-channel
 * side panel), collapsing to a single stacked column under `lg`.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("contact", locale)` — parity between locales is enforced by
 * `src/content/parity.test.ts`), the hero and side panel are server
 * components under `src/components/sections/contact/`, and the ONE client
 * leaf on the whole page is `ContactForm` — see that component's file header
 * for the full behavioral contract (client validation, focus management,
 * bot defenses, and the exact split between this content pipeline and
 * `messages/*.json`'s `forms` namespace).
 *
 * Until Task 22 wires the real backend lead endpoint (design spec §5.2),
 * `ContactForm` submits through a local stub
 * (`src/lib/leads/submit-lead-stub.ts`) that always resolves the honest
 * "not yet connected" state — see that file's header for the exact contract
 * the real Server Action must keep when it replaces the stub.
 */
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactExpect } from "@/components/sections/contact/ContactExpect";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { getContent } from "@/content";
import type { ContactContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";
import { Section } from "@/components/ui/Section";

/** Resolves the route param to a valid locale (defaulting like the layout). */
async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Contact page metadata: canonical/hreflang/OG via {@link pageMetadata}.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent<ContactContent>("contact", locale);

  return pageMetadata({
    locale,
    path: "/contact",
    title: content.meta.title,
    description: content.meta.description,
  });
}

/**
 * Renders the contact page: breadcrumb structured data followed by the
 * hero, then the form beside the "what happens next" side panel.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const content = getContent<ContactContent>("contact", locale);
  const origin = siteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumb([
          { name: content.meta.breadcrumbHome, url: `${origin}/${locale}` },
          { name: content.meta.breadcrumbCurrent, url: `${origin}/${locale}/contact` },
        ])}
      />

      <ContactHero content={content.hero} />

      <Section id="form" className="!pt-0">
        <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <ContactForm content={content.form} />
          <ContactExpect expect={content.expect} channels={content.channels} />
        </div>
      </Section>
    </>
  );
}
