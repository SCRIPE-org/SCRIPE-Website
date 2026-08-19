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

      {/* Wave K: the hero's own background plate is a CSS `background-image`
          (home.css §2 — see Hero.tsx's header for why it isn't an `<img>`),
          which the browser's preload scanner cannot discover until the
          stylesheet is parsed AND the element is laid out — measurably later
          than an `<img>` or an explicit preload hint, and the direct cause of
          the reported "screen is black until the image loads." Only possible
          to fix cleanly now that theming is locked to dark
          (`src/theme/theme-lock.ts`): the plate's URL used to depend on
          client-resolved theme state, which a server-rendered preload hint
          cannot know; with the lock, the dark plate IS the only plate any
          visitor is served, so its path is a build-time constant. AVIF only
          (the format `--hero-plate` lists first, and what `home.css` prefers
          whenever the browser supports it) — a browser without AVIF support
          simply ignores this hint and falls through to the WebP `home.css`
          already declares, so nothing is lost for that minority. Two links,
          not one, mirroring the exact `(max-aspect-ratio: 3 / 4)` breakpoint
          `home.css` §1b uses to choose between the landscape and portrait
          crop — preloading the wrong one would waste bandwidth on every
          visitor whose aspect ratio doesn't match it.
          REVISIT WHEN THE THEME LOCK LIFTS: this becomes two plates × two
          themes, and a server-rendered preload can only ever pick one theme
          confidently — see the lock's own file for the restore procedure. */}
      <link
        rel="preload"
        as="image"
        href="/media/hero/plate-background.avif"
        type="image/avif"
        media="(min-aspect-ratio: 3.0001/4)"
      />
      <link
        rel="preload"
        as="image"
        href="/media/hero/plate-background-portrait.avif"
        type="image/avif"
        media="(max-aspect-ratio: 3/4)"
      />

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
