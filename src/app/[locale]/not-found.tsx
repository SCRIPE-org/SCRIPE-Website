/**
 * 404 not-found page — triggered by the catch-all [...rest] route when no
 * matching path exists within the matched locale.
 *
 * A Server Component: content comes from the typed content pipeline
 * (`getContent("notFound", locale)`), rendered as a large typographic "404"
 * treatment with lime accent over obsidian ground, title/message copy, and a
 * button row (home + platform) that guide users back into the site.
 * Page-specific styles live in `src/styles/not-found.css`, imported so they
 * ship with this route only. Metadata export is not needed here — Next.js's
 * not-found() function sets noindex automatically via its built-in behavior
 * (when a route's notFound.tsx is rendered, robots: index false is implicit),
 * and a title override is not required since the layout metadata's template
 * handles all title composition on this page.
 */
import "@/styles/not-found.css";
import { getLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import type { NotFoundContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Renders the 404 not-found page: obsidian hero panel with large "404"
 * treatment, title/message copy, and a button row (home + platform) to guide
 * users back.
 *
 * The locale is read from the request context via getLocale() — next-intl
 * automatically provides this after the [locale] segment has validated and
 * set the locale via setRequestLocale() in the layout.
 */
export default async function NotFound() {
  // Get the locale that was set in the layout's request context
  const localeString = await getLocale();
  const locale = localeString as Locale;

  const content = getContent<NotFoundContent>("notFound", locale);

  return (
    <Section>
      <div className="nf-hero-panel">
        <div className="nf-hero-horizon" aria-hidden="true" />
        <div className="nf-hero-bloom" aria-hidden="true" />

        <div className="relative z-10 px-[clamp(var(--space-5),4vw,var(--space-9))] py-[clamp(var(--space-9),8vh,var(--space-11))]">
          <Reveal className="grid gap-6 max-w-[720px]">
            {/* Status marker + label */}
            <div className="flex items-center gap-3">
              <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
                {content.hero.code}
              </span>
              <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
              <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
                {content.hero.label}
              </span>
            </div>

            {/* Large 404 display */}
            <div className="nf-404-display" aria-hidden="true">
              {content.hero.code}
            </div>

            {/* Title */}
            <h1 className="font-display text-text-primary text-[length:var(--fs-display)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.28] [&:lang(ar)]:tracking-normal">
              {content.hero.title}
            </h1>

            {/* Message */}
            <p className="text-text-secondary text-[length:var(--fs-lead)] text-pretty max-w-[62ch]">
              {content.hero.subtitle}
            </p>

            {/* Link row */}
            <div className="flex flex-wrap gap-3 pt-2">
              {content.links.map((link) => (
                <Button key={link.href} href={link.href} size="lg">
                  {link.label}
                </Button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
