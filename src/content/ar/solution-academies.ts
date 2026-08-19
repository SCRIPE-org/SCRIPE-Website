/**
 * Arabic content for the Sports Academies solution page (`/solutions/sports-academies`).
 *
 * Hero, capability and outcome strings are ported from the authored Arabic
 * dictionary `backup/scripe-static/js/lang-ar.js`, matched to
 * `src/content/en/solution-academies.ts` key for key (see that file's own
 * header for which legacy `data-i18n` keys they trace to — e.g.
 * `development-is-a-programme-not-a-timetable`,
 * `programs-athletes-guardians-coaches-attendance-subsc`,
 * `one-record-per-athlete-carried-across-groups`,
 * `bring-your-programmes-groups-and-guardians-into`). `meta.description` and
 * the entire `painPoints` section have no dictionary entry (new structure —
 * see `SolutionContent`'s doc comment in `src/content/types.ts`) and are
 * authored here in the same register, composed from the dictionary's own
 * established vocabulary (`البرامج`، `اللاعبون`، `أولياء الأمور`).
 */
import type { SolutionContent } from "../types";

export const solutionAcademiesContent: SolutionContent = {
  meta: {
    title: "الأكاديميات الرياضية",
    description: "SCRIPE للأكاديميات الرياضية: برامج التطوير واللاعبون وأولياء الأمور والمدربون والحضور والاشتراكات والمدفوعات والتواصل وأدلة الأداء.",
    breadcrumbHome: "الرئيسية",
    breadcrumbSolutions: "الحلول",
    breadcrumbCurrent: "الأكاديميات الرياضية",
  },
  hero: {
    eyebrow: "الأكاديميات الرياضية",
    title: "التطوير برنامج، لا جدول مواعيد.",
    subtitle: "البرامج واللاعبون وأولياء الأمور والمدربون والحضور والاشتراكات والمدفوعات في إيقاع واحد — لتبقى أدلة التطوير بعد الموسم الذي جُمعت فيه.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
    imageAlt:
      "ملعب تدريب عند فجر ضبابي — أقماع وسلالم وحواجز مصفوفة بدقة على العشب، والشروق يبزغ خلف صف الأشجار",
    snapshot: {
      label: "كيف يبدو ذلك",
      stats: [
        { label: "البرامج", value: "31" },
        { label: "حصص أسبوعيًا", value: "412" },
        { label: "الحضور المُسجَّل", value: "97%" },
      ],
    },
  },
  painPoints: {
    title: "ما الذي يضيع فعلًا خلال الفصل.",
    subtitle: "تعمل البرامج بسجلات ورقية ومكالمات هاتفية إلى أن تكبر المجموعة عن أن تُحفظ في الذاكرة. من هناك تبدأ الأدلة بالتسرّب.",
    items: [
      {
        title: "تقدّم لا ينتقل معه",
        description: "تبقى ملاحظات المدرب في دفتر، فتُعاد كتابة أدلة التجارب وقرارات الاختيار، أو تُنسى، عند كل انتقال بين المراحل.",
      },
      {
        title: "أولياء أمور يعرفون آخر الجميع",
        description: "تصل تغييرات الحصص ومواعيد الدفع وتحديثات الحضور بمكالمة هاتفية وكلمة شفهية، لولي أمر واحد في كل مرة.",
      },
      {
        title: "تجديدات تُلاحَق يدويًا",
        description: "تُتابَع الخطط الفصلية والشهرية وخصومات الإخوة والأرصدة المستحقة على ورقة تفقد صلاحيتها في اليوم الذي فُتحت فيه.",
      },
    ],
  },
  capabilities: {
    title: "ما الذي تعمل عليه الأكاديميات الرياضية فعلًا.",
    subtitle: "برامج ومجموعات وحصص مرتبط بها الحضور والاشتراكات والتواصل مع أولياء الأمور.",
    items: [
      {
        icon: "layers",
        title: "برامج التطوير",
        description: "برامج ومجموعات وحصص مبنية على المرحلة، لا مرتجلة كل فصل.",
      },
      {
        icon: "squad",
        title: "اللاعبون",
        description: "سجل واحد لكل لاعب، ينتقل عبر المجموعات والرياضات والمواسم.",
      },
      {
        icon: "member",
        title: "أولياء الأمور",
        description: "يتلقى أولياء الأمور تحديثات الحصص والحضور والمدفوعات دون مكالمة هاتفية.",
      },
      {
        icon: "check",
        title: "الحضور",
        description: "يُسجَّل في الحصة، ويعمل دون إنترنت، ويُغلق في اليوم نفسه الذي حدث فيه.",
      },
      {
        icon: "repeat",
        title: "الاشتراكات",
        description: "خطط فصلية وشهرية تتجدد وفق القاعدة التي تضعها، مع معالجة تسعير الإخوة.",
      },
      {
        icon: "trend",
        title: "الأداء",
        description: "الحضور والتقدّم وأدلة الاختبارات تُقرأ معًا عبر مسار التطوير.",
      },
    ],
  },
  outcomes: {
    title: "مكان واحد تتفق فيه الأرقام.",
    subtitle: "التعريفات نفسها عبر كل وحدة، مُطابَقة في اليوم نفسه الذي جرت فيه الحصص.",
    stats: [
      { value: "31", label: "البرامج" },
      { value: "412", label: "حصص أسبوعيًا" },
      { value: "97%", label: "الحضور المُسجَّل" },
      { value: "+124", label: "أعضاء هذا الشهر" },
    ],
  },
  otherSolutions: {
    title: "منظمة بشكل مختلف؟ النظام تحتها هو نفسه.",
  },
  cta: {
    title: "استكشف SCRIPE للأكاديميات الرياضية",
    subtitle: "اجمع برامجك ومجموعاتك وأولياء الأمور في إيقاع تشغيلي واحد — نُعدّه مع فريقك قبل أن تجربه.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "استكشف المنصة",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
