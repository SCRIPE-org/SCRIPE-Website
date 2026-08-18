import type { Metadata } from "next";
import "@/app/globals.css";
import { fontClassesFor } from "@/fonts";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/chrome/Footer";
import { NavBar } from "@/components/chrome/NavBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { dirFor, routing, type Locale } from "@/i18n/routing";
import { buildOrganization } from "@/lib/seo/jsonld";
import { pageMetadata, siteUrl } from "@/lib/seo/metadata";
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

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${fontClassesFor(locale as "en" | "ar")} no-js`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: NO_JS_SCRIPT }} />
        <meta name="theme-color" content="#0B0B0E" />
      </head>
      <body>
        <JsonLd data={buildOrganization(siteUrl())} />
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
