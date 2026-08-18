/**
 * Arabic content for the 404 page (`[...rest]`).
 *
 * Ported from `backup/scripe-static/js/lang-ar.js`'s translations for the
 * `data-i18n` keys `backup/scripe-static/404.html` uses — see
 * `src/content/en/notFound.ts`'s header for the product framing note. Copy
 * is authored Arabic, not a translation of English; the meaning and hierarchy
 * are kept while phrasing naturally reads to an Arabic operations director.
 *
 * Digits stay Western (`404`, not `٤٠٤`) per the design spec's Arabic
 * typography rule ("Western numerals held constant").
 */
import type { NotFoundContent } from "../types";

export const notFoundContent: NotFoundContent = {
  meta: {
    title: "الصفحة غير موجودة",
    description: "هذا المسار في SCRIPE غير موجود.",
  },
  hero: {
    code: "404",
    label: "غير موجود",
    title: "هذا المسار غير موجود.",
    subtitle:
      "ربما انتقلت الصفحة. المنصة والحلول الأربعة والأسعار والمصادر جميعها على بُعد نقرة واحدة.",
  },
  links: [
    {
      label: "العودة إلى الرئيسية",
      href: "/",
    },
    {
      label: "استكشف المنصة",
      href: "/platform",
    },
  ],
};
