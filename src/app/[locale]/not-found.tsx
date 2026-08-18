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
 *
 * Task E4: the panel now runs on the shared `.atmo-cta-*` obsidian/horizon/
 * bloom/grain recipe (`src/styles/tokens/atmosphere.css`) instead of its own
 * page-scoped copy, the status marker runs in the ground sequence's mono
 * film-grammar, and the title composes `.atmo-title`. This pass also fixed
 * a real contrast bug the elevation work exposed: the panel has always been
 * a fixed obsidian ground in BOTH themes (`.nf-hero-panel`'s/now
 * `.atmo-cta-panel`'s `background: var(--obsidian)` was never
 * theme-conditional), but the title/message/404-figure foregrounds were
 * theme tokens (`text-text-primary`/`text-text-secondary`/`var(--accent)`)
 * that flip to near-black in the light theme — illegible on a ground that
 * never lightens with it. Every `ClosingCta.tsx` on the site already
 * documents and applies the correct fix for this exact panel ("because the
 * panel is always dark, its foregrounds are fixed light values rather than
 * theme tokens"); this page now follows the same rule.
 *
 * Task E5 fix-round: `[locale]/layout.tsx`'s pre-paint THEME_SCRIPT never
 * executes on this route. Root cause (confirmed via raw HTML inspection):
 * when `notFound()` resolves through the `[...rest]` catch-all, Next.js's
 * initial response is its own internal minimal document shell
 * (`<html id="__next_error__">`) — the real `<head>` this layout renders
 * (including THEME_SCRIPT) is only ever serialized into the streamed RSC
 * payload as data, never applied as live `<head>` children, on this
 * specific boundary. This page's own real content (this panel) then
 * replaces that shell via a client-side patch, not the initial parse — so
 * any script tag needs to survive being inserted post-hydration, which
 * ruled out two more options besides the layout's own inert copy: a plain
 * `<script>` here in the body (confirmed live: DOM node present, JS still
 * never runs — inline scripts inserted by React outside the initial parse
 * don't self-execute) and next/script's `beforeInteractive` strategy in the
 * layout's `<head>` (meaningless here anyway — that strategy only affects
 * the pre-hydration parse this boundary skips). What DOES work, confirmed
 * live: next/script's `afterInteractive` strategy, which is Next's own
 * managed post-hydration script loader (`document.createElement` + insert,
 * not innerHTML) — reliable specifically because it's designed to attach
 * scripts to a document that's already interactive, exactly this page's
 * situation. So this page carries its own `afterInteractive` copy of the
 * exact same THEME_SCRIPT, so the one route where the layout's copy is
 * inert still lands on the correct stored theme within ~100ms of paint. It
 * reads the same `localStorage` key and sets the same `data-theme`/
 * `color-scheme`/theme-color as the layout's script — CSS custom properties
 * re-cascade the instant the attribute is set, so NavBar/Footer/page-ground
 * (all theme tokens, not JS-computed) repaint correctly too, not just this
 * panel. The brief pre-script flash (default light palette, same as every
 * other route's pre-paint window) is an accepted tradeoff for a rare error
 * path, not a design goal.
 */
import "@/styles/not-found.css";
import { getLocale } from "next-intl/server";
import Script from "next/script";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import type { NotFoundContent } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { THEME_SCRIPT } from "@/theme/theme-script";

/**
 * Renders the 404 not-found page: obsidian hero panel with large "404"
 * treatment, title/message copy, and a button row (home + platform) to guide
 * users back.
 *
 * The locale is read from the request context via getLocale() — next-intl
 * resolves this through `src/i18n/request.ts`'s per-request config, which
 * reads the matched `[locale]` segment via `next/root-params` (see that
 * file's header). No per-page or per-layout call is needed for this to be
 * available here.
 */
export default async function NotFound() {
  // Get the locale from next-intl's per-request config (see i18n/request.ts)
  const localeString = await getLocale();
  const locale = localeString as Locale;

  const content = getContent<NotFoundContent>("notFound", locale);

  return (
    <Section>
      {/* Fallback theme application for this route only — see the file
          header for why the layout's own copy is inert here, and why
          `afterInteractive` specifically (not a plain <script>, not
          `beforeInteractive`) is the one strategy that actually runs. */}
      <Script id="notfound-theme-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <div className="atmo-cta-panel night-zone">
        <span className="atmo-cta-horizon" aria-hidden="true" />
        <span className="atmo-cta-bloom" aria-hidden="true" />
        <span className="atmo-cta-grain" aria-hidden="true" />

        <div className="relative z-10 px-[clamp(var(--space-5),4vw,var(--space-9))] py-[clamp(var(--space-9),8vh,var(--space-11))]">
          <Reveal className="grid gap-6 max-w-[720px]">
            {/* Status marker + label — the ground sequence's mono
                film-grammar (see CapabilityHero.tsx's header), fixed light
                values rather than theme tokens: this panel is always
                obsidian in both themes. */}
            <div className="flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium uppercase tracking-[0.22em] text-[var(--lime-400)] [&:lang(ar)]:tracking-[0.06em]">
              <span>{content.hero.code}</span>
              <span className="inline-block h-px w-6 bg-[var(--lime-400)]" aria-hidden="true" />
              <span>{content.hero.label}</span>
            </div>

            {/* Large 404 display */}
            <div className="nf-404-display" aria-hidden="true">
              {content.hero.code}
            </div>

            {/* Title */}
            <h1 className="atmo-title font-display text-white text-[length:var(--fs-display)] text-balance">
              {content.hero.title}
            </h1>

            {/* Message */}
            <p className="text-white/78 text-[length:var(--fs-lead)] text-pretty max-w-[62ch]">
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
