import "@/app/globals.css";
import { fontClassesFor } from "@/fonts";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/chrome/Footer";
import { NavBar } from "@/components/chrome/NavBar";
import { dirFor, routing } from "@/i18n/routing";
import { NO_JS_SCRIPT, THEME_SCRIPT } from "@/theme/theme-script";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

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
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
