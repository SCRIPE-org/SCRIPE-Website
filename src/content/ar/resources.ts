/**
 * Arabic content for the resources page (`/resources`).
 *
 * Mirrors `src/content/en/resources.ts` key-for-key (enforced by
 * `src/content/parity.test.ts`). Every string is ported verbatim from the
 * authored Arabic dictionary `backup/scripe-static/js/lang-ar.js` — hero,
 * guide cards, the FAQ's eight question/answer pairs, all thirteen
 * product-resources captions, the article cards and the closing CTA all
 * have an approved entry there; nothing in this file is newly composed
 * copy. `productReading.items[].id`/`accent` are locale-invariant (an
 * anchor slug and a design-token identity, not display text) and match
 * `src/content/en/resources.ts` exactly.
 */
import type { ResourcesContent } from "../types";

export const resourcesContent: ResourcesContent = {
  meta: {
    title: "الموارد",
    description:
      "موارد SCRIPE: أدلة الإعداد، والأسئلة التي يطرحها مسؤولو التشغيل قبل التحدث إلى المبيعات، ومرجع المنتج لكل وحدة، والمقالات فور نشرها.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "الموارد",
  },
  hero: {
    label: "الموارد",
    title: "كل ما يستحق القراءة قبل أن تقرر.",
    subtitle: "أدلة إعداد، والأسئلة التي يطرحها مسؤولو التشغيل فعلًا، ومرجع لكل وحدة في المنصة.",
    primaryCta: "تحدث إلى المبيعات",
  },
  guides: {
    label: "الأدلة",
    title: "كيف تُعِدّ المنظمات SCRIPE.",
    subtitle: "مكتوبة مع فرق التشغيل التي تقوم بها. تُنشر كل واحدة فور اكتمالها — لا شيء هنا حشو.",
    items: [
      {
        kind: "guide",
        slug: "mapping-your-programs-into-scripe",
        title: "ربط برامجك داخل SCRIPE",
        summary: "كيف تُبنى البرامج والمجموعات والحصص قبل استيراد أول عضو.",
        tag: "قيد الإعداد",
      },
      {
        kind: "guide",
        slug: "moving-a-season-mid-year",
        title: "نقل موسم في منتصف العام",
        summary: "ما يُنقل، وما يُترك، وكيف يُحمل سجل الحضور معه.",
        tag: "قيد الإعداد",
      },
      {
        kind: "guide",
        slug: "setting-pricing-rules-for-surfaces",
        title: "ضبط قواعد التسعير للملاعب",
        summary: "تسعير الأعضاء والضيوف والحجز المتكرر للملاعب والميادين وحارات المسبح.",
        tag: "قيد الإعداد",
      },
      {
        kind: "guide",
        slug: "rolling-out-the-coach-app",
        title: "إطلاق تطبيق المدرب",
        summary: "إيصال القوائم وخطط الحصص وتسجيل الحضور دون إنترنت إلى أيدي المدربين.",
        tag: "قيد الإعداد",
      },
    ],
    note: "الأدلة قيد الإعداد. اطلب الموضوع الذي تحتاجه وسنرسله فور كتابته.",
  },
  faq: {
    label: "الأسئلة",
    title: "قبل أن تتحدث إلى المبيعات.",
    items: [
      {
        question: "ما هو SCRIPE؟",
        answer:
          "نظام تشغيل رياضي. الأعضاء والبرامج والحصص والملاعب والحجوزات والمدفوعات والتقارير تعمل على سجل واحد متصل بدل أدوات منفصلة.",
      },
      {
        question: "لمن SCRIPE؟",
        answer:
          "الأندية والأكاديميات والمنشآت والمنظمات متعددة الفروع — الملّاك والمديرون ومسؤولو التشغيل والمدربون وموظفو الاستقبال.",
      },
      {
        question: "هل يمكنني إدارة عدة فروع؟",
        answer: "نعم. كل فرع يدير جدوله وطاقمه، بينما تقرأ تقارير المجموعة عبرها جميعًا دون سجلات مكررة.",
      },
      {
        question: "هل يمكنني إدارة رياضات مختلفة؟",
        answer:
          "البرامج والملاعب والحجوزات لا ترتبط برياضة بعينها — البادل والسباحة وكرة السلة والتنس والجمباز تعمل بجانب كرة القدم.",
      },
      {
        question: "هل يمكنني إدارة الحجوزات والمدفوعات؟",
        answer: "نعم. الحجوزات المفردة والمتكررة وقواعد التسعير والدفع وتسجيل الدخول على الشبكة نفسها، ومُطابَقة في اليوم نفسه.",
      },
      {
        question: "هل يمكن للمدربين استخدام SCRIPE؟",
        answer:
          "خطط الحصص والقوائم والحضور مُفعَّلة بالفعل في السجل؛ أما تطبيق المدرب المخصص، بتسجيل حضور دون إنترنت، فقيد الإطلاق حاليًا.",
      },
      {
        question: "هل يمكن لأولياء الأمور الدخول إلى المنصة؟",
        answer:
          "يتلقى أولياء الأمور تحديثات الحصص والحضور اليوم. أما البوابة المخصصة لهم فهي ضمن خارطة الطريق لا الإصدار الحالي.",
      },
      {
        question: "هل توجد نسخة تجريبية مجانية؟",
        answer:
          "تُعدّ النسخ التجريبية مع فريقنا لتُربط برامجك وملاعبك وطاقمك قبل أن تجربها. اطلب واحدة وسنحددها معك.",
      },
    ],
  },
  productReading: {
    label: "مصادر المنتج",
    title: "مرجع لكل وحدة.",
    subtitle: "ثلاث عشرة قدرة، وما تفعله كل واحدة، وما الذي تحل محله. كل منها يربط مباشرة بصفحة المنصة.",
    items: [
      {
        id: "members",
        name: "الأعضاء",
        description: "سجل واحد لكل لاعب وولي أمر وموظف — يُحمل عبر كل فرع ورياضة وموسم.",
        accent: "academy",
      },
      {
        id: "subscriptions",
        name: "الاشتراكات",
        description: "مدد وخطط شهرية وحزم متكررة تتجدد وفق القاعدة التي تضعها، لا وفق ذاكرة أحد.",
        accent: "club",
      },
      {
        id: "reservations",
        name: "الحجوزات",
        description: "التوفر والحجز المفرد والمتكرر وقواعد التسعير وتسجيل الدخول على شبكة واحدة.",
        accent: "venue",
      },
      {
        id: "payments",
        name: "المدفوعات",
        description: "الرسوم والفواتير والتسوية مرتبطة بما تم حجزه فعلًا.",
        accent: "lime",
      },
      {
        id: "attendance",
        name: "الحضور",
        description: "يُسجَّل ملعبيًا، في ثوانٍ، حتى دون إنترنت — ويُغلق في اليوم نفسه.",
        accent: "academy",
      },
      {
        id: "competitions",
        name: "المسابقات",
        description: "المباريات والفرق والتنقلات والنتائج على التقويم نفسه الذي يقرأه باقي النادي.",
        accent: "club",
      },
      {
        id: "coaches",
        name: "إدارة المدربين",
        description: "القوائم وخطط الحصص والتغطية والحمل التدريبي — لمن يديرون الحصص فعلًا.",
        accent: "fi",
      },
      {
        id: "parents",
        name: "أولياء الأمور",
        description: "يتلقى أولياء الأمور تحديثات الحصص والحضور والمدفوعات التي كانت تصل عبر مكالمة هاتفية.",
        accent: "academy",
      },
      {
        id: "notifications",
        name: "الإشعارات",
        description: "تُبلَّغ المنظمة بما تغيّر بينما لا يزال هناك وقت للتصرف.",
        accent: "lime",
      },
      {
        id: "crm",
        name: "إدارة علاقات العملاء",
        description: "الاستفسارات والتجارب والمتابعات تُتبَّع حتى تتحول إلى عضوية.",
        accent: "lime",
      },
      {
        id: "reports",
        name: "التقارير",
        description: "الصورة التشغيلية التي يطلبها مجلس الإدارة، مبنية من السجل لا مُعاد كتابتها في عرض تقديمي.",
        accent: "venue",
      },
      {
        id: "analytics",
        name: "التحليلات",
        description: "أنماط لا تراها في جدول زمني: ساعات الذروة، الأوقات غير المباعة، الرياضات التي تحمل الأسبوع.",
        accent: "venue",
      },
      {
        id: "branches",
        name: "الفروع",
        description: "كل فرع يدير يومه بنفسه. تقرأ المجموعة صورة تشغيلية واحدة عبرها جميعًا.",
        accent: "lime",
      },
    ],
  },
  articles: {
    label: "المقالات",
    title: "تُنشر فور كتابتها.",
    subtitle: "لا أرشيف سابق، ولا دراسات حالة مُختلقة. يمتلئ هذا القسم بعد الإطلاق.",
    items: [
      {
        kind: "article",
        slug: "notes-on-running-sport",
        title: "ملاحظات في إدارة الرياضة",
        summary: "مقالات قصيرة عن التشغيل، تُكتب وقت حدوثه. تُنشر عند الإطلاق.",
        tag: "قريبًا",
      },
      {
        kind: "article",
        slug: "product-updates",
        title: "تحديثات المنتج",
        summary: "ما أُطلق، وما تغيّر، وما الذي يحل محله. يُنشر عند الإطلاق.",
        tag: "قريبًا",
      },
      {
        kind: "article",
        slug: "onboarding-notes",
        title: "ملاحظات التهيئة",
        summary: "كيف تبدو الأسابيع الأربعة الأولى مع فريق تشغيل.",
        tag: "قريبًا",
      },
    ],
  },
  cta: {
    title: "لم تجد ما تبحث عنه؟",
    subtitle: "اطرح سؤالك مباشرة — سيجيب عليه أحد مسؤولي التشغيل، وغالبًا ما يصبح الدليل التالي.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "تحدث إلى المبيعات",
    note: "تهيئة بمرافقة فريق المبيعات · يُحدَّد الجدول الزمني أثناء التخطيط.",
  },
};
