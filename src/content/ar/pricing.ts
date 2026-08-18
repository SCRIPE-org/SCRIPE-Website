/**
 * Arabic content for the pricing page (`/pricing`).
 *
 * Mirrors `src/content/en/pricing.ts` key-for-key (enforced by
 * `src/content/parity.test.ts`). Every string that has an approved
 * translation in `backup/scripe-static/js/lang-ar.js` is ported verbatim
 * from there (the SAR figures themselves are numeric and locale-invariant —
 * both files store the exact same `990`/`9900`/`2490`/`24900`, and per the
 * task's hard rule, price digits stay Western numerals in both locales).
 * The FAQ's four newly-composed question/answer pairs (yearly saving,
 * adding branches later, Football Intelligence availability, and the
 * questions themselves) are original Arabic copy built entirely from
 * already-approved `lang-ar.js` vocabulary for the underlying facts —
 * see `src/content/en/pricing.ts`'s file header for the English originals
 * and their grounding.
 */
import type { PricingContent } from "../types";

export const pricingContent: PricingContent = {
  meta: {
    title: "الأسعار",
    description:
      "أسعار SCRIPE: خطط البداية والنمو والمؤسسات، تُفوتر شهريًا أو سنويًا وتُسعَّر على أساس الفروع والرياضات والحجم. أسعار استرشادية، تُؤكَّد مع فريق التشغيل لديك قبل التوقيع.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "الأسعار",
  },
  hero: {
    label: "الأسعار",
    title: "التسعير على أساس الفروع والرياضات والحجم.",
    subtitle:
      "ثلاث خطط، تُفوتر شهريًا أو سنويًا. كل خطة تُؤكَّد مع فريق التشغيل لديك قبل التوقيع — والأرقام أدناه استرشادية.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "ابدأ نسخة تجريبية",
  },
  billing: {
    ariaLabel: "فترة الفوترة",
    monthlyLabel: "شهريًا",
    yearlyLabel: "سنويًا",
    yearlySavingsBadge: "−شهران",
    perMonthSuffix: "شهريًا · لكل فرع",
    perYearSuffix: "سنويًا · لكل فرع",
  },
  plans: [
    {
      id: "starter",
      name: "البداية",
      tagline: "للأكاديميات الصغيرة.",
      accent: "academy",
      baseMonthly: 990,
      baseYearly: 9900,
      baseCurrency: "SAR",
      baseUsd: null,
      features: [
        "الأعضاء والاشتراكات",
        "البرامج والمجموعات والحصص",
        "الحضور والتذكيرات",
        "المدفوعات والفواتير",
        "تقارير قياسية",
      ],
      cta: { label: "ابدأ نسخة تجريبية", href: "/contact" },
    },
    {
      id: "growth",
      name: "النمو",
      tagline: "للأندية والمنشآت النامية.",
      accent: "club",
      baseMonthly: 2490,
      baseYearly: 24900,
      baseCurrency: "SAR",
      baseUsd: null,
      highlight: true,
      badge: "الأكثر اختيارًا",
      features: [
        "كل ما في خطة البداية",
        "الحجوزات وقواعد التسعير",
        "المسابقات والفرق",
        "إدارة المدربين",
        "إدارة العلاقات والإشعارات",
        "ذكاء الأعمال",
      ],
      cta: { label: "احجز عرضًا توضيحيًا", href: "/contact" },
      footnote: "يشمل التهيئة مع فريق التشغيل لديك.",
    },
    {
      id: "enterprise",
      name: "المؤسسات",
      tagline: "للمنظمات متعددة الفروع.",
      accent: "venue",
      baseMonthly: null,
      baseYearly: null,
      baseCurrency: "SAR",
      baseUsd: null,
      customLabel: "حسب الطلب",
      customCaption: "يُسعَّر على أساس الفروع والرياضات والحجم",
      features: [
        "كل ما في خطة النمو",
        "تحكم وتقارير متعددة الفروع",
        "أدلة ذكاء كرة القدم",
        "أدوار وصلاحيات مخصصة",
        "تهيئة ودعم بأولوية",
      ],
      cta: { label: "تحدث إلى المبيعات", href: "/contact" },
    },
  ],
  plansFootnote: "أسعار استرشادية — كل خطة تُؤكَّد مع فريق التشغيل لديك قبل التوقيع.",
  comparison: {
    label: "المقارنة",
    title: "ما تشمله كل خطة فعلًا.",
    subtitle: "كل خطة تعمل على السجل نفسه. الفارق هو مقدار ما تغطيه من التشغيل.",
    columnHeader: "قارن الخطط",
    caption:
      "كل خطة تُؤكَّد مع فريق التشغيل لديك قبل التوقيع. والنسخ التجريبية تُعدّ مع فريقنا لتُربط برامجك وملاعبك وطاقمك قبل أن تجربها.",
    includedLabel: "مشمول",
    notIncludedLabel: "غير مشمول",
    groups: [
      {
        title: "التشغيل",
        rows: [
          {
            label: "الأعضاء والملفات",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "البرامج والمجموعات والحصص",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "الحضور والتذكيرات",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "الاشتراكات والتجديدات",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "الحجوزات وقواعد التسعير",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "المسابقات والفرق",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "إدارة المدربين",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
        ],
      },
      {
        title: "تجاري",
        rows: [
          {
            label: "المدفوعات والفواتير",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "تقارير قياسية",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "إدارة العلاقات والإشعارات",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "ذكاء الأعمال",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "تحكم وتقارير متعددة الفروع",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
        ],
      },
      {
        title: "المنظمة",
        rows: [
          {
            label: "الفروع المشمولة",
            values: [{ kind: "text", text: "1" }, { kind: "text", text: "1 (أضف فروعًا)" }, { kind: "text", text: "غير محدود" }],
          },
          {
            label: "أدلة ذكاء كرة القدم",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
          {
            label: "أدوار وصلاحيات مخصصة",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
          {
            label: "التهيئة",
            values: [
              { kind: "text", text: "إعداد موجَّه" },
              { kind: "text", text: "مع فريق التشغيل لديك" },
              { kind: "text", text: "تهيئة ذات أولوية" },
            ],
          },
          {
            label: "الدعم",
            values: [{ kind: "text", text: "قياسي" }, { kind: "text", text: "قياسي" }, { kind: "text", text: "أولوية" }],
          },
        ],
      },
    ],
  },
  faq: {
    label: "الأسئلة",
    title: "قبل أن تتحدث إلى المبيعات.",
    items: [
      {
        question: "لماذا يُحسب السعر لكل فرع؟",
        answer: "تُسعَّر خطتا البداية والنمو لكل فرع. وتُضاف الفروع الإضافية إلى المنظمة نفسها، لا كنظام ثانٍ.",
      },
      {
        question: "هل تكلّف الرياضات الإضافية أكثر؟",
        answer:
          "البرامج والملاعب والحجوزات لا ترتبط برياضة بعينها. إضافة البادل أو السباحة أو كرة السلة بجانب كرة القدم لا تغيّر الخطة.",
      },
      {
        question: "هل يوجد تفعيل ذاتي للنسخة التجريبية؟",
        answer: "لا يوجد تفعيل ذاتي. تُحدَّد النسخ التجريبية والخطط مع فريقنا لتُربط برامجك وملاعبك وطاقمك أولًا.",
      },
      {
        question: "كم أوفر عند الدفع سنويًا؟",
        answer:
          "تحتسب الفوترة السنوية لخطتَي البداية والنمو عشرة أشهر بسعر الاشتراك الشهري بدلاً من اثني عشر شهرًا — وهو توفير الشهرين نفسه الذي يظهره المفتاح أعلاه.",
      },
      {
        question: "هل يمكنني إضافة فروع لاحقًا؟",
        answer:
          "نعم. تبدأ خطتا البداية والنمو بفرع واحد، وتُضاف الفروع الإضافية إلى الخطة نفسها. وتشمل خطة المؤسسات عددًا غير محدود من الفروع للمنظمات متعددة الفروع.",
      },
      {
        question: "هل ذكاء كرة القدم مشمول؟",
        answer: "تشمل خطة المؤسسات أدلة ذكاء كرة القدم. أما خطتا البداية والنمو فتُركّزان على التشغيل الأساسي أولًا.",
      },
    ],
  },
  cta: {
    title: "احصل على خطة مفصّلة على تشغيلك.",
    subtitle: "أحضر عدد فروعك ورياضاتك وحجم موسمك — وسنؤكد الخطة قبل توقيع أي شيء.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "ابدأ نسخة تجريبية",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
