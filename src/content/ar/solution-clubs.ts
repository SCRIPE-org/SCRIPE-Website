/**
 * Arabic content for the Sports Clubs solution page (`/solutions/sports-clubs`).
 *
 * Hero, capability and outcome strings are ported from the authored Arabic
 * dictionary `backup/scripe-static/js/lang-ar.js`, matched to
 * `src/content/en/solution-clubs.ts` key for key (see that file's own header
 * for which legacy `data-i18n` keys they trace to — e.g.
 * `run-the-club-not-the-spreadsheet`, `teams-members-the-competition-calendar-attendance-pa`,
 * `squads-by-age-group-and-sport-selected`,
 * `explore-scripe-for-sports-clubs`). `meta.description` and the entire
 * `painPoints` section have no dictionary entry (new structure — see
 * `SolutionContent`'s doc comment in `src/content/types.ts`) and are
 * authored here in the same operations-director register, composed from
 * the dictionary's own established vocabulary (`الفرق`، `الأعضاء`،
 * `الحضور`، `المدفوعات`).
 */
import type { SolutionContent } from "../types";

export const solutionClubsContent: SolutionContent = {
  meta: {
    title: "الأندية الرياضية",
    description: "SCRIPE للأندية الرياضية: الفرق والأعضاء وروزنامة المسابقات والحضور والمدفوعات والمدربون والتقارير في سجل واحد متصل.",
    breadcrumbHome: "الرئيسية",
    breadcrumbSolutions: "الحلول",
    breadcrumbCurrent: "الأندية الرياضية",
  },
  hero: {
    eyebrow: "الأندية الرياضية",
    title: "أدِر النادي، لا جدول البيانات.",
    subtitle: "الفرق والأعضاء وروزنامة المسابقات والحضور والمدفوعات والمدربون في سجل واحد متصل — ليكون سؤال الخامسة مساءً مُجابًا قبل أن يسأله أحد.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
    imageAlt:
      "ملعب مضاء بالكشافات بعد المطر ليلًا — مقاعد بدلاء فارغة، ولوح تكتيك مسند إليها، وآثار أحذية على خط التماس المبلل",
    snapshot: {
      label: "كيف يبدو ذلك",
      stats: [
        { label: "الفرق", value: "14" },
        { label: "الأعضاء", value: "1,860" },
        { label: "مباريات هذا الشهر", value: "23" },
      ],
      note: "بيانات تجريبية — تُستبدل ببياناتك أثناء التهيئة.",
    },
  },
  painPoints: {
    title: "الأسئلة التي كانت تنتظر حتى الخامسة مساءً.",
    subtitle: "كل نادٍ يصطدم بالاحتكاك نفسه بمجرد أن تتجاوز عضويته بضع مئات. SCRIPE مبني حول هذه القائمة بالذات.",
    items: [
      {
        title: "من المتاح فعلًا الليلة",
        description: "تبقى إتاحة اللاعبين في ذاكرة أحدهم أو في مجموعة محادثة، فيُؤكَّد جدول التدريب بالسؤال، لا بالرجوع إلى سجل.",
      },
      {
        title: "مباريات تُلاحَق لا تُجدوَل",
        description: "تتوزع مواعيد المسابقات والتنقلات والإتاحة على تقاويم منفصلة، فيظهر التعارض في أسبوع المباراة بدل أسبوع تحديدها.",
      },
      {
        title: "الحسابات تُقفل متأخرة",
        description: "تُطابَق رسوم المباريات والاشتراكات والأرصدة المستحقة في نهاية الشهر أمام جدول بيانات لا يثق فيه أحد تمامًا.",
      },
    ],
  },
  capabilities: {
    title: "ما الذي تعمل عليه الأندية الرياضية فعلًا.",
    subtitle: "الفرق والعضوية وروزنامة المسابقات والحضور والمدفوعات في سجل واحد متصل.",
    items: [
      {
        icon: "squad",
        title: "الفرق والتشكيلات",
        description: "فرق حسب الفئة العمرية والرياضة، تُنتقى من سجل العضو نفسه الذي يقرأه بقية النادي.",
      },
      {
        icon: "member",
        title: "الأعضاء",
        description: "ملفات وأولياء أمور ومستندات وسجل يبقى رغم تغيّر الفريق أو الفرع أو الموسم.",
      },
      {
        icon: "trophy",
        title: "روزنامة المسابقات",
        description: "المباريات والتنقلات والإتاحة على الروزنامة التي يتابعها المدربون وأولياء الأمور أصلًا.",
      },
      {
        icon: "check",
        title: "الحضور",
        description: "يُسجَّل بجانب الملعب في ثوانٍ، ودون إنترنت عند انقطاع التغطية، ويُغلق في اليوم نفسه.",
      },
      {
        icon: "card",
        title: "المدفوعات",
        description: "الاشتراكات ورسوم المباريات والأرصدة المستحقة مرتبطة بالحصة التي ولّدتها.",
      },
      {
        icon: "badge",
        title: "المدربون",
        description: "القوائم وخطط الحصص وطلبات البدلاء والحمل الأسبوعي — لمن يديرون الحصص.",
      },
    ],
  },
  outcomes: {
    title: "مكان واحد تتفق فيه الأرقام.",
    subtitle: "التعريفات نفسها عبر كل وحدة، مُطابَقة في اليوم نفسه الذي جرت فيه الحصص.",
    stats: [
      { value: "14", label: "الفرق" },
      { value: "1,860", label: "الأعضاء" },
      { value: "23", label: "مباريات هذا الشهر" },
      { value: "97%", label: "الحضور المُسجَّل" },
    ],
    note: "بيانات تجريبية — تمثّل منظمة متوسطة الحجم.",
  },
  otherSolutions: {
    title: "منظمة بشكل مختلف؟ النظام تحتها هو نفسه.",
  },
  cta: {
    title: "استكشف SCRIPE للأندية الرياضية",
    subtitle: "نربط فرقك ومبارياتك وجهازك الفني قبل العرض، لترى أسبوع مبارياتك أنت يعمل على SCRIPE.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "استكشف المنصة",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
