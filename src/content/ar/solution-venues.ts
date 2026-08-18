/**
 * Arabic content for the Sports Venues solution page (`/solutions/sports-venues`).
 *
 * Hero, capability and outcome strings are ported from the authored Arabic
 * dictionary `backup/scripe-static/js/lang-ar.js`, matched to
 * `src/content/en/solution-venues.ts` key for key (see that file's own
 * header for which legacy `data-i18n` keys they trace to — e.g.
 * `booked-to-capacity-not-to-chaos`,
 * `courts-fields-and-pools-with-real-availability`,
 * `glass-courts-indoor-halls-and-outdoor-surfaces`,
 * `put-every-court-field-and-pool-on`). The Fields and Utilization
 * capability descriptions merge two legacy tiles each (Fields folds in
 * Pools; Utilization folds in Peak hours — see the English file's header for
 * why) and are composed here from the dictionary's own translations of both
 * source tiles (`eleven-a-side-five-a-side-and` + `lanes-squad-blocks-and-public-swim-managed`;
 * `surface-by-surface-utilization-so-unsold-capacity` +
 * `where-demand-actually-sits-by-hour-and`) rather than a literal single
 * dictionary entry. `meta.description` and the entire `painPoints` section
 * have no dictionary entry (new structure — see `SolutionContent`'s doc
 * comment in `src/content/types.ts`) and are authored here in the same
 * register.
 */
import type { SolutionContent } from "../types";

export const solutionVenuesContent: SolutionContent = {
  meta: {
    title: "المنشآت الرياضية",
    description: "SCRIPE للمنشآت الرياضية: الملاعب والحجوزات والإتاحة والمدفوعات ومعدل الاستخدام والطلب في ساعات الذروة على شبكة واحدة.",
    breadcrumbHome: "الرئيسية",
    breadcrumbSolutions: "الحلول",
    breadcrumbCurrent: "المنشآت الرياضية",
  },
  hero: {
    eyebrow: "المنشآت الرياضية",
    title: "محجوزة بالكامل، لا بالفوضى.",
    subtitle: "ملاعب وميادين ومسابح بإتاحة حقيقية، وحجوزات مفردة ومتكررة، وقواعد تسعير، ومدفوعات، وأرقام الاستخدام التي تحدد الموسم القادم.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
    imageAlt:
      "أربعة ملاعب بادل من الأعلى مباشرة ليلًا — واحد مضاء وفيه لاعبان في وسط تبادل، والثلاثة الأخرى مظلمة لكن خطوطها واضحة",
    snapshot: {
      label: "كيف يبدو ذلك",
      stats: [
        { label: "الملاعب", value: "9" },
        { label: "حجوزات هذا الأسبوع", value: "268" },
        { label: "معدل الاستخدام", value: "92%" },
      ],
      note: "بيانات تجريبية — تُستبدل ببياناتك أثناء التهيئة.",
    },
  },
  painPoints: {
    title: "ما لا تُظهره لوحة الجدولة على الحائط.",
    subtitle: "كل منشأة تصطدم بالسقف نفسه بمجرد أن تتجاوز الحجوزات لوحة بيضاء: ما المتاح فعلًا الآن، وأي الساعات تستحق تسويقًا أقوى.",
    items: [
      {
        title: "الإتاحة عبر مكالمة هاتفية",
        description: "ما هو متاح فعلًا الآن ليس ما تقوله لوحة الجدولة هذا الصباح — فيتأكد الاستقبال من ذلك بالذهاب والتحقق شخصيًا.",
      },
      {
        title: "حجوزات محجوزة لا تتحرر",
        description: "يبقى الملعب محجوزًا إلى أجل غير مسمى مقابل حجز غير مدفوع، بدل أن يتحرر تلقائيًا عندما لا يصل الدفع.",
      },
      {
        title: "ساعات ذروة لم يُسعّرها أحد",
        description: "يتحرك الطلب بحسب الساعة والرياضة على مدار الموسم، لكن دون رقم استخدام مرتبط به، تبقى الطاقة غير المباعة غير مرئية حتى تضيع.",
      },
    ],
  },
  capabilities: {
    title: "ما الذي تعمل عليه المنشآت الرياضية فعلًا.",
    subtitle: "الإتاحة والحجز المفرد والمتكرر وقواعد التسعير وتسجيل الدخول ومعدل الاستخدام في ساعات الذروة.",
    items: [
      {
        icon: "pin",
        title: "الكورتات",
        description: "ملاعب زجاجية وصالات مغلقة وملاعب مكشوفة، لكل منها قواعده وتسعيره.",
      },
      {
        icon: "pitch",
        title: "الملاعب",
        description: "ملاعب الأحد عشر والخماسي والتدريب وحارات السباحة، محجوزة مع المدرب والتوقيت في خطوة واحدة.",
      },
      {
        icon: "calendar",
        title: "الحجوزات",
        description: "حجوزات مفردة ومتكررة تصمد أمام تعارض مباراة أو نافذة صيانة.",
      },
      {
        icon: "clock",
        title: "الإتاحة",
        description: "ما المتاح فعلًا الآن — لا ما قاله المخطط الجداري هذا الصباح.",
      },
      {
        icon: "card",
        title: "المدفوعات",
        description: "المواعيد المحجوزة تُفرج إذا لم تصل الدفعة؛ والمدفوعة تُطابَق في اليوم نفسه.",
      },
      {
        icon: "trend",
        title: "معدل الاستخدام",
        description: "معدل استخدام لكل ملعب على حدة والطلب في ساعات الذروة، لتظهر الطاقة غير المباعة وهي ما تزال قابلة للبيع.",
      },
    ],
  },
  outcomes: {
    title: "مكان واحد تتفق فيه الأرقام.",
    subtitle: "التعريفات نفسها عبر كل وحدة، مُطابَقة في اليوم نفسه الذي جرت فيه الحصص.",
    stats: [
      { value: "9", label: "الملاعب" },
      { value: "268", label: "حجوزات هذا الأسبوع" },
      { value: "92%", label: "معدل الاستخدام" },
      { value: "+18%", label: "الطلب في ساعات الذروة" },
    ],
    note: "بيانات تجريبية — تمثّل منظمة متوسطة الحجم.",
  },
  otherSolutions: {
    title: "منظمة بشكل مختلف؟ النظام تحتها هو نفسه.",
  },
  cta: {
    title: "استكشف SCRIPE للمنشآت الرياضية",
    subtitle: "ضع كل ملعب وميدان ومسبح على شبكة واحدة — وسترى ساعات الذروة التي تبيعها يدويًا اليوم.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "استكشف المنصة",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
