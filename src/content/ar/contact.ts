/**
 * Arabic content for the contact page (`/contact`).
 *
 * Ported from `backup/scripe-static/js/lang-ar.js`'s translations for the
 * `data-i18n` keys `backup/scripe-static/contact.html` uses — see
 * `src/content/en/contact.ts`'s header for the section-by-section mapping.
 * `meta.description` has no legacy equivalent (the static site never
 * localized `<meta>` tags — the exact gap this rebuild's real per-locale
 * routing fixes), so it is composed here from the same "book a demo" /
 * "tell us how the organization is set up" phrases the legacy dictionary
 * already supplies elsewhere on this page, rather than a freshly invented
 * claim.
 *
 * Digits stay Western (`30`, not `٣٠`) per the design spec's Arabic
 * typography rule ("Western numerals held constant") — matching
 * `src/content/ar/pricing.ts`'s own numerals, not `lang-ar.js`'s prose
 * strings, which still carry legacy Eastern Arabic-Indic digits in a couple
 * of spots the spec's rule postdates.
 */
import type { ContactContent } from "../types";

export const contactContent: ContactContent = {
  meta: {
    title: "تواصل معنا",
    description:
      "احجز عرضًا توضيحيًا من SCRIPE. أخبرنا كيف تُدار منظمتك وسنربط برامجك وملاعبك وطاقمك قبل المكالمة.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "تواصل معنا",
  },
  hero: {
    label: "تواصل معنا",
    title: "احجز عرضًا توضيحيًا على تشغيلك أنت.",
    subtitle:
      "أحضر الفروع والرياضات وحجم الموسم الذي تديره فعليًا. سنُريك أين يناسبك SCRIPE — وأين لا يناسبك.",
  },
  form: {
    eyebrow: "احجز عرضًا توضيحيًا",
    intro: "أخبرنا كيف تُدار منظمتك وسنربط برامجك وملاعبك وطاقمك قبل المكالمة.",
    placeholders: {
      name: "عمر درويش",
      email: "you@organization.com",
      organization: "نادي القاهرة الرياضي",
      phone: "+20 100 000 0000",
      message: "كم فرعًا، وأي رياضات، وما الذي تعمل عليه اليوم.",
    },
    hints: {
      phone: "اختياري — يساعدنا على الوصول إليك أسرع.",
      type: "اختياري — يخبرنا أي الوحدات نعرضها أولًا.",
    },
    submitCta: "احجز عرضًا توضيحيًا",
    footnote: "تهيئة بمرافقة فريق المبيعات · يُحدَّد الجدول الزمني أثناء التخطيط.",
  },
  expect: {
    label: "ما الذي يحدث بعد ذلك",
    items: [
      "مكالمة مدتها 30 دقيقة مع مسؤول تشغيل، لا نص محفوظ",
      "برامجك وملاعبك وطاقمك مربوطة قبل العرض",
      "الوحدات التي تناسب تشغيلك، على جدولك أنت",
      "خطة مؤكدة مع فريقك قبل توقيع أي شيء",
    ],
  },
  channels: {
    items: [
      {
        id: "email",
        label: "البريد الإلكتروني",
        value: "لم يُنشر بعد",
        note: "نعمل على تجهيز بريد مُراقَب.",
      },
      {
        id: "phone",
        label: "الهاتف",
        value: "لم يُنشر بعد",
        note: "لا يوجد خط هاتفي بعد.",
      },
      {
        id: "response",
        label: "الرد",
        value: "غير مُتاح بعد",
        note: "تهيئة بمرافقة فريق المبيعات، دون تفعيل ذاتي.",
      },
    ],
  },
};
