/**
 * Contact page — the site's only form and its one true conversion surface: a
 * typography-led hero followed by a two-column "conversation" (the
 * demo-request form beside a "what happens next" + honest contact-channel
 * side panel), collapsing to a single stacked column under `lg` — UNTIL a
 * submission is confirmed, at which point `ContactForm` takes over the whole
 * width with the site's own biggest brand moment (the same obsidian/lime
 * "horizon" panel every page's closing CTA ends on) instead of leaving a
 * small card in one grid cell beside empty space. See `ContactForm.tsx`'s
 * header for that branch.
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
 * `ContactForm` submits through the real Server Action
 * (`src/lib/leads/submit-lead.ts`), which posts to the backend lead endpoint
 * (design spec §5.2) at `process.env.LEADS_ENDPOINT` — until that env var is
 * set (see `.env.example`), every validated submission still resolves the
 * honest "not yet connected" state rather than a fabricated success. See
 * that file's header for the full delivery/spam/logging contract.
 *
 * Task E4 added this page's first page-scoped stylesheet
 * (`src/styles/contact.css`, imported here so it ships with this route
 * only) — before that, every surface on this page ran on Tailwind utilities
 * alone; the new file hosts only the hero's ground-atmosphere glow rule.
 */
import "@/styles/contact.css";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
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

      {/* `ContactExpect` is passed as `children` rather than imported by
          `ContactForm` directly: `ContactForm` is this page's one "use
          client" leaf (see its own header), and a Client Component that
          imports a Server Component into its own module bundles that
          component's code to the client too — silently costing
          `ContactExpect` the zero-client-bundle-weight guarantee ITS OWN
          header documents. Passing it as a server-rendered `children` prop
          keeps it a true Server Component; `ContactForm` only ever sees its
          already-rendered output, and can still choose whether to render
          that slot at all (it hides `children` entirely once a submission is
          confirmed — see `ContactForm.tsx`'s header for why). */}
      <Section id="form" className="!pt-0">
        <ContactForm content={content.form}>
          <ContactExpect expect={content.expect} channels={content.channels} />
        </ContactForm>
      </Section>
    </>
  );
}
