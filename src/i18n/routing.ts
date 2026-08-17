import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  // Never set-cookie on cacheable HTML (spec §4.1) — locale is resolved from
  // the URL prefix and Accept-Language only, never persisted client-side.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export function dirFor(locale: string): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
