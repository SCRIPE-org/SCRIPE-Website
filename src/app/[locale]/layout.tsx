import type { Metadata } from "next";
import "@/app/globals.css";
import { fontClassesFor } from "@/fonts";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/chrome/Footer";
import { NavBar } from "@/components/chrome/NavBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { dirFor, routing, type Locale } from "@/i18n/routing";
import { buildOrganization } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";
import { ThemeGuard } from "@/theme/ThemeGuard";
import { LOCKED_THEME, THEME_LOCKED_TO_DARK } from "@/theme/theme-lock";
import { NO_JS_SCRIPT, THEME_SCRIPT } from "@/theme/theme-script";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

/**
 * Root metadata for every page under `[locale]` that does not set its own.
 *
 * `title.template` (`"%s · SCRIPE"`) applies to whatever title a page task's
 * own `generateMetadata` sets via {@link pageMetadata}; `title.default` is
 * the fallback used only where no page-level title exists yet (e.g. the
 * Task 8 smoke-test home page, until Task 13 gives it a real one). The
 * description is sourced from the `footer.tagline` message so this stays a
 * single piece of approved copy rather than a duplicate inline string.
 *
 * @param props.params - Resolves to the matched `[locale]` segment.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "footer" });

  return {
    ...pageMetadata({
      locale,
      path: "/",
      title: "SCRIPE — Sports Operations OS",
      description: t("tagline"),
    }),
    title: {
      default: "SCRIPE — Sports Operations OS",
      template: "%s · SCRIPE",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${fontClassesFor(locale as "en" | "ar")} no-js`}
      /* While theming is locked (`theme/theme-lock.ts`) the resolved theme is a
         BUILD-TIME CONSTANT, so it belongs in the server render rather than in a
         script the client has to run. The stylesheet treats a missing
         `data-theme` as light — bare `:root` IS the light palette — so without
         this attribute a visitor whose JS never runs (disabled, blocked, CSP
         failure, script error before the inline block) renders the withdrawn
         light theme in full. THEME_SCRIPT below still runs and still owns
         `color-scheme` and the `theme-color` meta; this just means the correct
         palette is already in the markup before it does. When the lock lifts
         this must go back to being script-resolved — a server-rendered constant
         would flash for anyone whose stored preference is light. */
      {...(THEME_LOCKED_TO_DARK ? { "data-theme": LOCKED_THEME } : {})}
      suppressHydrationWarning
    >
      <head>
        {/* Plain pre-paint inline scripts — correct and sufficient for every
            normal route. NOT sufficient for the [...rest] catch-all's
            notFound() render path: Next.js's initial response there is its
            own internal minimal shell (`<html id="__next_error__">`), and
            this real <head> only ever reaches the client serialized inside
            the streamed RSC payload, never applied as live <head> children,
            on that one boundary — next/script's `beforeInteractive` strategy
            was tried here too and made no difference (confirmed live; that
            strategy only targets the pre-hydration parse this boundary
            skips). See `not-found.tsx`'s file header for the fix that does
            work on that route (its own `afterInteractive` copy of
            THEME_SCRIPT) and the two other approaches ruled out first. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: NO_JS_SCRIPT }} />
        <meta name="theme-color" content="#0B0B0E" />
      </head>
      <body>
        <JsonLd data={buildOrganization(siteUrl())} />
        <ThemeGuard />
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
