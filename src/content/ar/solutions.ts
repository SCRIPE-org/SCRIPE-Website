/**
 * Arabic content for the solutions hub page (`/solutions`).
 *
 * Ported from the authored Arabic dictionary `backup/scripe-static/js/lang-ar.js`
 * (authored Arabic, not mirrored English — see `src/content/ar/home.ts`'s
 * header for the same convention), matching `src/content/en/solutions.ts`
 * key for key. Every string below traces to a dictionary entry keyed by its
 * English `data-i18n` id (e.g. `four-ways-sport-is-organized-one-system`,
 * `choose-your-shape`, `same-platform-different-centre-of-gravity`,
 * `what-never-changes`, `not-sure-which-shape-you-are`) except
 * `meta.description`, which the dictionary never carried (the legacy
 * `<meta>` tag was static English only) and is authored here in the same
 * register, composed from the dictionary's own vocabulary for this page's
 * hero and grid.
 */
import type { SolutionsHubContent } from "../types";

export const solutionsContent: SolutionsHubContent = {
  meta: {
    title: "الحلول",
    description: "أربع طرق لتنظيم الرياضة — الأندية والأكاديميات والمنشآت والمنظمات متعددة الرياضات — على نظام تشغيل واحد.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "الحلول",
  },
  hero: {
    eyebrow: "الحلول",
    title: "أربع طرق لتنظيم الرياضة. نظام واحد تحتها.",
    subtitle: "الأندية والأكاديميات والمنشآت والمنظمات متعددة الرياضات تدير أيامًا مختلفة. لكنها تعمل على السجل نفسه.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "استكشف المنصة",
  },
  grid: {
    title: "ابدأ من حيث تقف منظمتك فعلًا.",
    subtitle: "كل حل هو المنصة نفسها، مهيّأة حول التشغيل الذي تديره بالفعل.",
    items: [
      {
        title: "الأندية الرياضية",
        description: "الفرق والعضوية وروزنامة المسابقات والحضور والمدفوعات في سجل واحد متصل.",
        cta: "استكشف SCRIPE للأندية الرياضية",
        href: "/solutions/sports-clubs",
        accent: "club",
        stats: [
          { label: "الفرق", value: "14" },
          { label: "الأعضاء", value: "1,860" },
          { label: "مباريات هذا الشهر", value: "23" },
        ],
      },
      {
        title: "الأكاديميات الرياضية",
        description: "برامج ومجموعات وحصص مرتبط بها الحضور والاشتراكات والتواصل مع أولياء الأمور.",
        cta: "استكشف SCRIPE للأكاديميات الرياضية",
        href: "/solutions/sports-academies",
        accent: "academy",
        stats: [
          { label: "البرامج", value: "31" },
          { label: "حصص أسبوعيًا", value: "412" },
          { label: "الحضور المُسجَّل", value: "97%" },
        ],
      },
      {
        title: "المنشآت الرياضية",
        description: "الإتاحة والحجز المفرد والمتكرر وقواعد التسعير وتسجيل الدخول ومعدل الاستخدام في ساعات الذروة.",
        cta: "استكشف SCRIPE للمنشآت الرياضية",
        href: "/solutions/sports-venues",
        accent: "venue",
        stats: [
          { label: "الملاعب", value: "9" },
          { label: "حجوزات هذا الأسبوع", value: "268" },
          { label: "معدل الاستخدام", value: "92%" },
        ],
      },
      {
        title: "المنظمات متعددة الرياضات",
        description: "تشغيل مركزي، ومؤشرات مجمّعة، وإدارة فروع، وصلاحيات، وتقارير على مستوى المجموعة.",
        cta: "استكشف SCRIPE للمنظمات متعددة الرياضات",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
        stats: [
          { label: "الفروع", value: "4" },
          { label: "الرياضات", value: "7" },
          { label: "خط تقارير واحد", value: "المجموعة" },
        ],
      },
    ],
  },
  compare: {
    title: "المنصة نفسها. مركز ثقل مختلف.",
    subtitle: "كل حل يمكنه تشغيل كل وحدة. هذه هي التي تعتمد عليها كل منظمة أولًا.",
    columns: [
      {
        title: "الأندية الرياضية",
        cta: "استكشف SCRIPE للأندية الرياضية",
        href: "/solutions/sports-clubs",
        accent: "club",
        features: ["الفرق والتشكيلات", "الأعضاء", "روزنامة المسابقات", "الحضور", "المدفوعات", "المدربون", "التقارير"],
      },
      {
        title: "الأكاديميات الرياضية",
        cta: "استكشف SCRIPE للأكاديميات الرياضية",
        href: "/solutions/sports-academies",
        accent: "academy",
        features: ["برامج التطوير", "اللاعبون", "أولياء الأمور", "المدربون", "الحضور", "الاشتراكات", "المدفوعات"],
      },
      {
        title: "المنشآت الرياضية",
        cta: "استكشف SCRIPE للمنشآت الرياضية",
        href: "/solutions/sports-venues",
        accent: "venue",
        features: ["الكورتات", "الملاعب", "المسابح", "الحجوزات", "الإتاحة", "المدفوعات", "معدل الاستخدام"],
      },
      {
        title: "المنظمات متعددة الرياضات",
        cta: "استكشف SCRIPE للمنظمات متعددة الرياضات",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
        features: ["فروع متعددة", "رياضات متعددة", "تشغيل مركزي", "مؤشرات مجمّعة", "الصلاحيات", "التقارير"],
      },
    ],
  },
  shared: {
    title: "السجل تحتها هو نفسه في الأربعة جميعًا.",
    cta: "استكشف المنصة",
    href: "/platform",
    points: [
      "سجل عضو واحد عبر الرياضات والفرق والفروع",
      "الحصص والملاعب والطاقم تُحجز معًا في خطوة واحدة",
      "المدفوعات مُطابَقة مع ما جرى حجزه فعلًا",
      "الحضور يُغلق في اليوم نفسه الذي حدث فيه",
      "تقارير مبنية من السجل، لا معادة الإدخال",
    ],
  },
  cta: {
    title: "لست متأكدًا أي شكل يناسبك؟",
    subtitle: "معظم المنظمات أكثر من شكل واحد. نحدد ذلك مع فريق التشغيل لديك قبل تهيئة أي شيء.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
