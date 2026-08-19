/**
 * Arabic content for the Multi-Sports Organizations solution page
 * (`/solutions/multi-sports-organizations`).
 *
 * Hero, capability and outcome strings are ported from the authored Arabic
 * dictionary `backup/scripe-static/js/lang-ar.js`, matched to
 * `src/content/en/solution-multi-sport.ts` key for key (see that file's own
 * header for which legacy `data-i18n` keys they trace to — e.g.
 * `mso.headline`, `centralized-operations-across-branches-and-sports-co`,
 * `each-branch-runs-its-own-timetable-staff`,
 * `bring-every-branch-and-every-sport-onto`). `hero.title` composes the
 * legacy `mso.headline` dictionary entry's three `<br/>`-separated lines
 * ("فروع متعددة.<br/>رياضات متعددة.<br/>صورة تشغيلية واحدة.") as one plain
 * sentence, matching `src/content/en/solution-multi-sport.ts`'s own
 * treatment of the English headline. The "Group revenue" outcome figure was
 * originally kept identical to `src/content/ar/platform.ts`'s single-org
 * revenue stat ("SAR 214K") for numeral-convention consistency — but a
 * ship-readiness audit correctly flagged that as the SAME revenue figure
 * standing for a 1,860-member single organization on one page and a
 * 4-branch, 12,400-member group on this one, an internal inconsistency a
 * careful reader could catch. It is now "SAR 1.4M", its own distinct figure,
 * proportionate to the sibling KPIs in this same structured stats row
 * ("4", "7", "12,400"), all Western digits — a stats row is a structured
 * data slot, not free-form prose, so it follows the site's "Western
 * numerals held constant" rule rather than the dictionary's literal digits.
 * `meta.description` and the entire `painPoints` section have no dictionary
 * entry (new structure — see `SolutionContent`'s doc comment in
 * `src/content/types.ts`) and are authored here in the same register.
 */
import type { SolutionContent } from "../types";

export const solutionMultiSportContent: SolutionContent = {
  meta: {
    title: "المنظمات متعددة الرياضات",
    description: "SCRIPE للمنظمات متعددة الرياضات: فروع متعددة، ورياضات متعددة، وتشغيل مركزي، ومؤشرات مجمّعة، وصلاحيات، وتقارير، وذكاء أعمال.",
    breadcrumbHome: "الرئيسية",
    breadcrumbSolutions: "الحلول",
    breadcrumbCurrent: "المنظمات متعددة الرياضات",
  },
  hero: {
    eyebrow: "المنظمات متعددة الرياضات",
    title: "فروع متعددة. رياضات متعددة. صورة تشغيلية واحدة.",
    subtitle: "تشغيل مركزي عبر الفروع والرياضات: مؤشرات مجمّعة، وإدارة فروع، وصلاحيات محددة، وتقارير على مستوى المجموعة، وذكاء الأعمال الذي يقرأها كلها معًا.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
    imageAlt:
      "مجمّع رياضي من الجو عند الساعة الذهبية — استاد ومسبح بطول خمسين مترًا وملاعب كرة قدم ومجموعة ملاعب تنس موزّعة على حرم واحد",
    snapshot: {
      label: "كيف يبدو ذلك",
      stats: [
        { label: "الفروع", value: "4" },
        { label: "الرياضات", value: "7" },
        { label: "خط تقارير واحد", value: "المجموعة" },
      ],
    },
  },
  painPoints: {
    title: "ما الذي يطلبه مجلس الإدارة فعلًا.",
    subtitle: "بعد الفرع الثاني، يتوقف السؤال عن كونه «كيف سار اليوم» ليصبح «كيف سار اليوم، في كل مكان» — ومن هناك تبدأ ملفات التصدير.",
    items: [
      {
        title: "خمسة ملفات تصدير، وعرض واحد",
        description: "تُسحب إيرادات المجموعة والعضوية والحضور ومعدل الاستخدام فرعًا بفرع، ثم تُجمَّع يدويًا قبل أن يرى أحد الصورة الكاملة.",
      },
      {
        title: "صلاحيات أو نُسخ مكررة",
        description: "دون وصول محدد بدقة، إما يرى مدير الفرع أرقام كل الفروع الأخرى، أو يحصل على نسخة مكررة ومنفصلة من النظام لإدارة فرعه فقط.",
      },
      {
        title: "فرع جديد يعني إعادة بناء",
        description: "يسحب فتح فرع أو إيقافه أو إعادة هيكلته التعريفات التي اتفقت عليها بقية المنظمة إلى نقاش من جديد.",
      },
    ],
  },
  capabilities: {
    title: "ما الذي تعمل عليه المنظمات متعددة الرياضات فعلًا.",
    subtitle: "تشغيل مركزي، ومؤشرات مجمّعة، وإدارة فروع، وصلاحيات، وتقارير على مستوى المجموعة.",
    items: [
      {
        icon: "branches",
        title: "فروع متعددة",
        description: "كل فرع يدير جدوله وطاقمه وتسعيره — دون تكرار سجل عضو واحد.",
      },
      {
        icon: "hub",
        title: "تشغيل مركزي",
        description: "تعريف واحد للحصة وللعضو وللدفعة، مُطبَّق في كل مكان.",
      },
      {
        icon: "chart",
        title: "مؤشرات مجمّعة",
        description: "إيرادات المجموعة والعضويات والحضور ومعدل الاستخدام على سطر واحد، لا خمسة ملفات تصدير.",
      },
      {
        icon: "building",
        title: "إدارة الفروع",
        description: "افتح فرعًا أو أوقفه أو أعد هيكلته دون إعادة بناء المنظمة حوله.",
      },
      {
        icon: "lock",
        title: "الصلاحيات",
        description: "أدوار محددة لكل فرع ولكل وحدة، ليرى كل شخص التشغيل المسؤول عنه.",
      },
      {
        icon: "document",
        title: "التقارير",
        description: "تقارير على مستوى مجلس الإدارة تُبنى من السجل بدل إعادة إدخالها في عرض تقديمي.",
      },
    ],
  },
  outcomes: {
    title: "مكان واحد تتفق فيه الأرقام.",
    subtitle: "التعريفات نفسها عبر كل وحدة، مُطابَقة في اليوم نفسه الذي جرت فيه الحصص.",
    stats: [
      { value: "4", label: "الفروع" },
      { value: "7", label: "الرياضات" },
      { value: "12,400", label: "إجمالي الأعضاء" },
      { value: "SAR 1.4M", label: "إيرادات المجموعة" },
    ],
  },
  otherSolutions: {
    title: "منظمة بشكل مختلف؟ النظام تحتها هو نفسه.",
  },
  cta: {
    title: "استكشف SCRIPE للمنظمات متعددة الرياضات",
    subtitle: "اجمع كل فرع وكل رياضة على خط تقارير واحد — بصلاحيات محددة ومطابقة في اليوم نفسه.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "استكشف المنصة",
    note: "تهيئة بمرافقة فريق المبيعات · يُحدَّد الجدول الزمني أثناء التخطيط.",
  },
};
