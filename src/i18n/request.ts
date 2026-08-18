/**
 * next-intl's per-request config — resolves which locale is active for the
 * current render and loads that locale's message bundle.
 *
 * Locale source: `next/root-params`, not the (deprecated) `requestLocale`
 * promise that `getRequestConfig`'s callback used to receive. `root-params`
 * is a Next.js 16.3+ compiler feature: for every segment folder under
 * `src/app` written as `[paramName]`, Next.js generates a matching
 * `next/root-params` export (codegen'd into `.next/types/root-params.d.ts`,
 * wired via `next-env.d.ts`) that resolves to that segment's matched value
 * from anywhere in the Server Component tree — no prop drilling, and no
 * per-page opt-in call needed for it to work correctly during static
 * generation. This repo's only root segment is `src/app/[locale]`, so the
 * generated export is `locale()`.
 *
 * Because this file is the single place that reads the locale for
 * next-intl's config, and root-params makes that value available on every
 * render (including prerendering) without a page-level call, the
 * `setRequestLocale()` calls that page components used to make are gone —
 * see the next-intl root-params migration guide
 * (https://next-intl.dev/blog/nextjs-root-params) for why that call existed
 * only as a stopgap for locale availability during static generation before
 * `next/root-params` existed.
 *
 * Behavior preserved from the pre-migration version: an unrecognized locale
 * value still falls back to `routing.defaultLocale` here (the actual 404 for
 * an invalid `[locale]` segment happens one layer up, in
 * `app/[locale]/layout.tsx`'s own `hasLocale` guard, which is unaffected by
 * this file's locale source).
 */
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  const requested = await rootParams.locale();
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
