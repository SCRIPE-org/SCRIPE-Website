/**
 * Arabic content for the home page — full eight-section composition.
 *
 * Ported from the authored Arabic dictionary
 * `backup/scripe-static/js/lang-ar.js` (authored Arabic, not mirrored
 * English — see that file's header), matching src/content/en/home.ts key for
 * key. Conventions carried over from the dictionary:
 *
 * - Latin product names (SCRIPE, Venue, Academy, Football Intelligence as
 *   product lockups), sample figures, times and staff initials stay as
 *   authored there — initials are translated (e.g. "أ. حداد"), board times
 *   keep Latin digits exactly as the legacy markup did.
 * - Eastern Arabic numerals appear where the dictionary itself authored them
 *   (e.g. "الحارات ٣–٥", "القدرات الـ١٣").
 *
 * Strings with no dictionary entry (the recomposed product-family section
 * heading/taglines and `meta.description`) are authored here in the same
 * register — operations-director Arabic, composed from the dictionary's own
 * vocabulary; descriptions and CTAs reuse existing dictionary lines
 * (`courts-fields-pools-reservations-and-utilization`,
 * `development-programs-coaches-parents-and-athletes-in`,
 * `rosters-session-plans-cover-and-load-for`, `explore-*`).
 */
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  meta: {
    title: "SCRIPE — نظام تشغيل المنظمات الرياضية الحديثة",
    description:
      "منصة واحدة متصلة للأندية والأكاديميات والمنشآت والمنظمات متعددة الرياضات: الأعضاء والاشتراكات والحجوزات والمدفوعات والحضور والمسابقات والتدريب وذكاء الأعمال.",
    breadcrumbHome: "الرئيسية",
  },
  hero: {
    wordmark: "SCRIPE",
    tagline: "نظام تشغيل المنظمات الرياضية الحديثة",
    plateAlt: "منظر جوي لمجمع رياضي ليلاً — ملعب مضاء بالأنوار ومسبح متوهج وملاعب تدريب يصلها ممشى مضاء",
    scrollHint: "مرّر للتحليق فوق المكان",
    railIntro: "المقدمة",
    chapters: [
      {
        rail: "الأندية",
        title: "الأندية الرياضية",
        subtitle: "الفرق والأعضاء وروزنامة المسابقات",
      },
      {
        rail: "الأكاديميات",
        title: "الأكاديميات الرياضية",
        subtitle: "برامج التطوير وأولياء الأمور وإدارة المدربين",
      },
      {
        rail: "المنشآت",
        title: "المنشآت الرياضية",
        subtitle: "ملاعب وميادين ومسابح محجوزة بالكامل، لا بالفوضى.",
      },
      {
        rail: "الذكاء",
        title: "ذكاء كرة القدم",
        subtitle: "إدارة متخصصة للمدربين",
      },
      {
        rail: "المنظمة",
        title: "منظمة متعددة الرياضات",
        subtitle: "فروع متعددة، رياضات متعددة، صورة تشغيلية واحدة",
      },
    ],
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "تحدث إلى المبيعات",
  },
  trusted: {
    title: "موضع ثقة المنظمات الرياضية الحديثة",
    subtitle: "منصة واحدة للأندية والأكاديميات والمنشآت والمنظمات متعددة الرياضات.",
    categories: [
      "أندية كرة القدم",
      "الأكاديميات الرياضية",
      "أندية البادل",
      "أكاديميات السباحة",
      "المنشآت الرياضية",
    ],
  },
  productFamily: {
    title: "ثلاثة منتجات. نظام تشغيل واحد.",
    subtitle:
      "كل المنتجات تعمل على السجل المتصل نفسه. ابدأ من حيث تقف منظمتك فعلًا — لا شيء يُعاد إدخاله أو تُعاد مطابقته مرتين.",
    products: [
      {
        name: "Venue",
        tagline: "تشغيل المنشآت والحجوزات",
        description: "ملاعب وميادين ومسابح وحجوزات ومعدل استخدام.",
        cta: "استكشف المنشآت الرياضية",
        href: "/solutions/sports-venues",
        accent: "venue",
      },
      {
        name: "Academy",
        tagline: "تشغيل الأكاديميات متعددة الرياضات",
        description: "برامج التطوير والمدربون وأولياء الأمور واللاعبون في إيقاع واحد.",
        cta: "استكشف الأكاديميات الرياضية",
        href: "/solutions/sports-academies",
        accent: "academy",
      },
      {
        name: "Football Intelligence",
        tagline: "ذكاء تدريبي متخصص في كرة القدم",
        description: "القوائم وخطط الحصص والبدلاء والحمل — لمن يديرون الحصص فعلًا.",
        cta: "استكشف المنصة",
        href: "/platform",
        accent: "fi",
      },
    ],
  },
  platform: {
    label: "المنصة",
    title: "كل ما تحتاجه منظمتك الرياضية. نظام تشغيل واحد.",
    subtitle:
      "يجمع SCRIPE العضويات والحجوزات والمدفوعات والتدريب والمسابقات والتواصل وذكاء الأعمال في منصة واحدة متصلة.",
    primaryCta: "استكشف المنصة",
    secondaryCta: "احجز عرضًا توضيحيًا",
    board: {
      title: "اليوم · الثلاثاء",
      badge: "دليل من المنتج",
      rows: [
        {
          time: "16:30",
          activity: "تحت ١٢ · بلوك فني",
          detail: "الملعب ٢ · ٩٠ دقيقة",
          owner: "أ. حداد",
          status: "مؤكد",
          tone: "positive",
        },
        {
          time: "17:00",
          activity: "تحت ١٤ · ملاعب مصغّرة",
          detail: "خماسي · ٦٠ دقيقة",
          owner: "م. عثمان",
          status: "حصة جارية",
          tone: "live",
        },
        {
          time: "17:30",
          activity: "فريق السباحة · الحارات ٣–٥",
          detail: "المسبح الأولمبي · ٧٥ دقيقة",
          owner: "ل. فرح",
          status: "مؤكد",
          tone: "positive",
        },
        {
          time: "18:00",
          activity: "بادل · ملعب ١",
          detail: "حجز عضو · ٩٠ دقيقة",
          owner: "الاستقبال",
          status: "مدفوع",
          tone: "positive",
        },
        {
          time: "18:45",
          activity: "تحت ١٦ · اختبارات المراكز",
          detail: "الملعب الرئيسي · ١٢٠ دقيقة",
          owner: "ك. ناصر",
          status: "يحتاج مدربًا",
          tone: "attention",
        },
      ],
    },
    modules: [
      { name: "الأعضاء", accent: "academy" },
      { name: "الاشتراكات", accent: "club" },
      { name: "الحجوزات", accent: "venue" },
      { name: "المدفوعات", accent: "lime" },
      { name: "الحضور", accent: "academy" },
      { name: "المسابقات", accent: "club" },
      { name: "إدارة المدربين", accent: "fi" },
      { name: "التقارير", accent: "venue" },
    ],
    deepLink: "شاهد القدرات الـ١٣ في صفحة المنصة",
  },
  solutions: {
    title: "أربع طرق لتنظيم الرياضة. نظام واحد تحتها.",
    subtitle: "اختر الشكل الذي يطابق منظمتك — والسجل تحته هو نفسه.",
    items: [
      {
        title: "الأندية الرياضية",
        description: "الفرق والأعضاء والمسابقات وتشغيل النادي من مكان واحد.",
        cta: "استكشف الأندية الرياضية",
        href: "/solutions/sports-clubs",
        accent: "club",
      },
      {
        title: "الأكاديميات الرياضية",
        description: "برامج التطوير والمدربون وأولياء الأمور واللاعبون في إيقاع واحد.",
        cta: "استكشف الأكاديميات الرياضية",
        href: "/solutions/sports-academies",
        accent: "academy",
      },
      {
        title: "المنشآت الرياضية",
        description: "ملاعب وميادين ومسابح وحجوزات ومعدل استخدام.",
        cta: "استكشف المنشآت الرياضية",
        href: "/solutions/sports-venues",
        accent: "venue",
      },
      {
        title: "المنظمات متعددة الرياضات",
        description: "فروع متعددة، رياضات متعددة، صورة تشغيلية واحدة.",
        cta: "استكشف المنظمات متعددة الرياضات",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
      },
    ],
    compareCta: "قارن الحلول الأربعة",
  },
  automation: {
    title: "يجب أن يدير تشغيلك نفسه بنفسه.",
    subtitle: "حجز واحد يُطلق السلسلة كاملة — الحجز، الدفع، القائمة، التذكير، الحضور، التقرير.",
    steps: [
      { title: "العضو يحجز تدريبًا", caption: "من تطبيق العضو أو من الاستقبال." },
      { title: "تأكيد الحجز", caption: "الملعب والمدرب والوقت تُحجز معًا دفعة واحدة." },
      { title: "تسجيل الدفعة", caption: "يُحتسب وفق القاعدة المناسبة للحصة." },
      { title: "إشعار المدرب", caption: "القائمة وخطة الحصة على الهاتف." },
      { title: "تتبّع الحضور", caption: "يُسجَّل بجانب الملعب، ودون إنترنت عند الحاجة." },
      { title: "تحديث لوحة التشغيل", caption: "مُطابَق وقابل للتقرير في اليوم نفسه." },
    ],
    deepLink: "شاهد وحدتَي الأتمتة والإشعارات",
  },
  branches: {
    title: "منظمة واحدة. كل فرع. صورة تشغيلية واحدة.",
    subtitle: "كل فرع يحتفظ بجدوله وطاقمه. وتقارير المجموعة تقرأ عبرها جميعًا دون سجلات مكررة.",
    chips: [
      { name: "القاهرة", accent: "fi" },
      { name: "المعادي", accent: "venue" },
      { name: "مدينة نصر", accent: "academy" },
      { name: "الإسكندرية", accent: "club" },
    ],
    orgLabel: "منظمة واحدة",
    pictureLabel: "صورة تشغيلية واحدة",
    deepLink: "استكشف SCRIPE للمنظمات متعددة الرياضات",
  },
  closing: {
    title: "مستعد لإدارة منظمتك الرياضية بشكل مختلف؟",
    subtitle: "اجمع فرقك وأعضاءك ومنشآتك ومدربيك وعملياتك في منصة واحدة قوية.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "ابدأ نسخة تجريبية",
    pricingLink: "اطّلع على الأسعار",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
