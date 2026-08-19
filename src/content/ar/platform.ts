/**
 * Arabic content for the platform page — matching
 * `src/content/en/platform.ts` key for key. See that file's header for the
 * module→family grouping rationale (identical in both locales).
 *
 * Prose (leads, features, evidence titles/labels/captions/notes, the five
 * group blurbs) is ported from the authored Arabic dictionary
 * `backup/scripe-static/js/lang-ar.js` wherever a matching entry exists —
 * genuine authored Arabic, not a mirrored English sentence, including its
 * own choice of Eastern Arabic-Indic numerals inside translated captions
 * (e.g. "٩٧٪ مُسجَّل", "+٣٤٪ مقارنة بالموسم الماضي"). Strings the dictionary
 * has no entry for (`meta.description`, the five group `blurb`s, `nav.label`)
 * are authored here in the same operations-director register, composed only
 * from words the dictionary already uses for these modules.
 *
 * Numeral convention — a single rule applied consistently, resolving a real
 * inconsistency in the legacy markup itself: the legacy page wrapped some
 * evidence-panel figures in the translatable dictionary (getting Eastern
 * Arabic-Indic digits) and left others as bare, un-translated literals
 * (staying Western digits in the English markup regardless of the active
 * language) — apparently inconsistently, not by a documented rule. This file
 * resolves that by locale-invariance of the *field*, not the source
 * markup's incidental wrapping:
 * - `EvidenceStat.value` (the big standalone stat-strip figure),
 *   `EvidenceRow.trailing` when it is a bare number or currency amount (not
 *   a status word), `EvidenceMeter.percent` (typed `number`, rendered with a
 *   fixed "%" by the component) and the Reservations module's `times` grid
 *   header all stay identical Western-digit strings in both locale files —
 *   matching `ar/home.ts`'s own documented precedent for `board.rows[].time`
 *   ("board times keep Latin digits exactly as the legacy markup did"), so
 *   the platform page's product-evidence panels read as one consistent
 *   product surface regardless of interface language, the way a real app's
 *   UI numerals would. The one deliberate exception to a literal
 *   dictionary carry-over: Reports' revenue stat ("sar-214k") *does* have a
 *   dictionary entry ("٢١٤ ألف ريال"), but is kept as "SAR 214K" here anyway,
 *   for internal consistency with the two sibling stat cells in the same
 *   strip ("1,860", "97%") that the legacy page itself never wrapped.
 * - Everything else — including a time or count that appears inside a full
 *   translated sentence or caption (e.g. "١٦:٣٠", "+١٢٤ هذا الشهر") — follows
 *   the dictionary's own authored Arabic exactly, digits included, because
 *   those are genuine prose, not a structured data slot.
 *
 * Group `name` for the `venue`/`academy`/`fi` families stays the Latin
 * product proper noun ("Venue", "Academy", "Football Intelligence"),
 * mirroring `ar/home.ts`'s `productFamily.products[].name` convention
 * exactly (product names are proper nouns, never translated). `club` and
 * `platform-wide` are not product proper nouns, so their names are authored
 * Arabic category labels instead.
 */
import type { PlatformContent } from "../types";

export const platformContent: PlatformContent = {
  meta: {
    title: "المنصة",
    description:
      "كل ما تحتاجه منظمتك الرياضية في نظام تشغيل واحد: الأعضاء والاشتراكات والحجوزات والمدفوعات والحضور والمسابقات وإدارة المدربين وأولياء الأمور والإشعارات وإدارة العلاقات والتقارير والتحليلات والفروع.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "المنصة",
  },
  hero: {
    label: "المنصة",
    title: "كل ما تحتاجه منظمتك الرياضية. نظام تشغيل واحد.",
    subtitle:
      "ثلاث عشرة قدرة على سجل واحد متصل. فعّل الوحدات كلما نمت المنظمة — دون إعادة إدخال أو إعادة كتابة أو مطابقة مرتين.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اطّلع على الأسعار",
  },
  nav: {
    label: "فئات القدرات",
  },
  groups: [
    {
      id: "venue",
      name: "Venue",
      blurb: "الإتاحة، والصورة التشغيلية، وأنماط الطلب تحتها — كلها من السجل نفسه في كل مرة.",
      accent: "venue",
      modules: [
        {
          id: "reservations",
          name: "الحجوزات",
          lead: "الإتاحة والحجز المفرد والمتكرر وقواعد التسعير وتسجيل الدخول على شبكة واحدة.",
          features: [
            "الملاعب والمدربون والوقت تُحجز معًا في خطوة واحدة",
            "بلوكات متكررة تصمد أمام تعارض المباريات",
            "قواعد تسعير حسب الموعد ونوع العضوية والموسم",
            "تسجيل الدخول في الاستقبال أو من الهاتف",
          ],
          evidence: {
            kind: "grid",
            title: "ملعب ١ · الثلاثاء",
            badge: "بيانات تجريبية",
            times: ["16:00", "17:00", "18:00", "19:00"],
            slots: [
              { label: "مفتوح", tone: "neutral" },
              { label: "محجوز مؤقتًا", tone: "attention" },
              { label: "محجوز", tone: "positive" },
              { label: "محجوز", tone: "positive" },
            ],
            note: "المواعيد المحجوزة تُفرج تلقائيًا إذا لم تصل الدفعة.",
          },
        },
        {
          id: "reports",
          name: "التقارير",
          lead: "الصورة التشغيلية التي يطلبها مجلس إدارتك، مبنية من السجل بدل إعادة إدخالها في عرض تقديمي.",
          features: [
            "الإيرادات والعضوية والحضور ومعدل الاستخدام في عرض واحد",
            "لكل فرع، ولكل رياضة، ولكل موسم — التعريفات نفسها في كل مكان",
            "قابلة للتصدير دون مشروع بيانات",
            "مُطابَق في اليوم نفسه الذي جرت فيه الحصص",
          ],
          evidence: {
            kind: "stats",
            title: "نظرة عامة على التشغيل",
            badge: "بيانات تجريبية",
            stats: [
              { value: "SAR 214K", label: "الإيرادات", caption: "+٣٤٪ مقارنة بالموسم الماضي" },
              { value: "1,860", label: "الأعضاء النشطون", caption: "+١٢٤ هذا الشهر" },
              { value: "97%", label: "الحضور المُسجَّل", caption: "إغلاق في اليوم نفسه" },
            ],
          },
        },
        {
          id: "analytics",
          name: "التحليلات",
          lead: "أنماط لا تراها في جدول مواعيد: ساعات الذروة، والمواعيد غير المباعة، والرياضات التي تحمل الأسبوع.",
          features: [
            "الطلب في الذروة مُتتبَّع عبر الملاعب والرياضات",
            "الطاقة غير المباعة تظهر وهي ما تزال قابلة للبيع",
            "حمل المدربين موزون على عدد الحصص الفعلي",
            "مقارنة موسم بموسم على تعريف واحد",
          ],
          evidence: {
            kind: "meters",
            title: "معدل استخدام المنشأة",
            badge: "بيانات تجريبية",
            meters: [
              { label: "ملاعب البادل", percent: 98 },
              { label: "المسبح الأولمبي", percent: 91 },
              { label: "الملعب الرئيسي", percent: 84 },
              { label: "الملعب ٢", percent: 61 },
            ],
            note: "يبقى موعدان من خمسة مواعيد مسائية في الملعب ٢ دون بيع.",
          },
        },
      ],
    },
    {
      id: "academy",
      name: "Academy",
      blurb:
        "سجل واحد لكل لاعب، وحضور يُسجَّل بجانب الملعب في ثوانٍ، والتحديثات التي كان أولياء الأمور ينتظرونها بمكالمة هاتفية.",
      accent: "academy",
      modules: [
        {
          id: "members",
          name: "الأعضاء",
          lead: "سجل واحد لكل لاعب وولي أمر وموظف — ينتقل عبر كل فرع ورياضة وموسم.",
          features: [
            "الملفات وأولياء الأمور وجهات الطوارئ في سجل واحد",
            "فرق ومجموعات وبرامج دون إدخالات مكررة",
            "الملاحظات الطبية والمستندات والموافقات مرفقة",
            "سجل يبقى رغم تغيّر الفرع أو الرياضة",
          ],
          evidence: {
            kind: "rows",
            title: "سجل العضو",
            badge: "بيانات تجريبية",
            rows: [
              {
                primary: "حمزة كمال · تحت ١٤",
                secondary: "فصل دراسي بالأكاديمية · مرتبط بولي الأمر",
                trailing: "نشط",
                trailingTone: "positive",
              },
              {
                primary: "رنا صبري",
                secondary: "فريق السباحة · شهري",
                trailing: "نشط",
                trailingTone: "positive",
              },
              {
                primary: "يوسف عادل · تحت ١٦",
                secondary: "فترة تجريبية · تبقّت حصتان",
                trailing: "اختبار",
                trailingTone: "attention",
              },
              {
                primary: "ليلى فاروق",
                secondary: "عضو بادل · دخول ضيف",
                trailing: "نشط",
                trailingTone: "positive",
              },
            ],
            note: "سجل واحد تقرأه كل وحدة — لا أربع نسخ في أربع أدوات.",
          },
        },
        {
          id: "attendance",
          name: "الحضور",
          lead: "يُسجَّل بجانب الملعب في ثوانٍ، ودون إنترنت إن لم تكن هناك تغطية — ويُغلق في اليوم نفسه.",
          features: [
            "المدرب يسجّل القائمة من هاتفه",
            "يعمل دون إنترنت ويُزامن عند عودة التغطية",
            "الغياب يصل إلى ولي الأمر دون مكالمة هاتفية",
            "معدل الإغلاق في اليوم نفسه رقم، لا تخمين",
          ],
          evidence: {
            kind: "meters",
            title: "الحضور · هذا الأسبوع",
            badge: "٩٧٪ مُسجَّل",
            meters: [
              { label: "الاثنين", percent: 58 },
              { label: "الأربعاء", percent: 64 },
              { label: "الخميس", percent: 86 },
              { label: "السبت", percent: 94 },
            ],
          },
        },
        {
          id: "parents",
          name: "أولياء الأمور",
          lead: "يتلقى أولياء الأمور تحديثات الحصص والحضور والمدفوعات التي كانت تصل سابقًا بمكالمة هاتفية.",
          features: [
            "تحديثات الحصص والحضور تُرسل تلقائيًا",
            "تذكيرات الدفع قبل تاريخ الاستحقاق، لا بعده",
            "بيانات ولي الأمر مرتبطة بكل سجل لاعب",
            "بوابة مخصصة لأولياء الأمور مخطط لها، لم تُطلق بعد",
          ],
          roadmapNote: "بوابة أولياء الأمور ضمن خارطة الطريق",
          evidence: {
            kind: "rows",
            title: "ما الذي يصل إلى ولي الأمر",
            badge: "بيانات تجريبية",
            rows: [
              { primary: "تأكيد الحصة · بلوك فني تحت ١٤", secondary: "الثلاثاء ١٦:٣٠ · الملعب ٢" },
              { primary: "الحضور مُسجَّل · حاضر", secondary: "أُرسل ١٨:٠٤" },
              { primary: "دفعة الفصل مستحقة خلال ٥ أيام", secondary: "SAR 2,400" },
            ],
            note: "الإصدار الأول يرسل التحديثات. وبوابة أولياء الأمور ضمن خارطة الطريق.",
          },
        },
      ],
    },
    {
      id: "fi",
      name: "Football Intelligence",
      blurb: "القوائم وخطط الحصص والبدلاء والحمل — لمن يديرون الحصص فعلًا.",
      accent: "fi",
      modules: [
        {
          id: "coaches",
          name: "إدارة المدربين",
          lead: "القوائم وخطط الحصص والبدلاء والحمل — لمن يديرون الحصص فعلًا.",
          features: [
            "خطط الحصص والقوائم على هاتف المدرب",
            "طلبات البدلاء تُرفع وتُحل قبل صافرة البداية",
            "الحمل الأسبوعي ظاهر لكل مدرب، لا بالتخمين",
            "الملاحظات وتقارير الاختبارات تصل إلى الانتقاء دون إعادة كتابة",
          ],
          evidence: {
            kind: "rows",
            title: "حمل المدربين · حصص أسبوعيًا",
            badge: "بيانات تجريبية",
            rows: [
              { primary: "أ. حداد", secondary: "فني · تحت ١٢–١٤", trailing: "18", trailingTone: "neutral" },
              { primary: "م. عثمان", secondary: "ملاعب مصغّرة · تحت ١٤", trailing: "16", trailingTone: "neutral" },
              { primary: "ل. فرح", secondary: "فريق السباحة", trailing: "14", trailingTone: "neutral" },
              { primary: "ك. ناصر", secondary: "الاختبارات والانتقاء", trailing: "11", trailingTone: "neutral" },
            ],
          },
        },
      ],
    },
    {
      id: "club",
      name: "الأندية",
      blurb: "فصول تتجدد وفق القاعدة التي تضعها أنت، ومباريات على الروزنامة نفسها التي يقرأها بقية النادي.",
      accent: "club",
      modules: [
        {
          id: "subscriptions",
          name: "الاشتراكات",
          lead: "فصول وخطط شهرية وبلوكات متكررة تتجدد وفق القاعدة التي تضعها، لا وفق تذكّر أحدهم.",
          features: [
            "خطط فصلية وشهرية ومتكررة جنبًا إلى جنب",
            "نوافذ التجديد والإيقاف والحساب النسبي مُدارة داخل الخطة",
            "تسعير العائلة والإخوة دون حسابات يدوية",
            "كل تجديد ظاهر قبل استحقاقه، لا بعده",
          ],
          evidence: {
            kind: "stats",
            title: "الاشتراكات · هذا الأسبوع",
            badge: "بيانات تجريبية",
            stats: [
              { value: "11", label: "قيد التجديد", caption: "الأيام السبعة القادمة" },
              { value: "3", label: "متوقف مؤقتًا", caption: "تحديد تواريخ الاستئناف" },
              { value: "97%", label: "محصّل", caption: "معدل الدورة نفسها" },
            ],
          },
        },
        {
          id: "competitions",
          name: "المسابقات",
          lead: "المباريات والفرق والتنقلات والنتائج على الروزنامة نفسها التي يقرأها بقية النادي.",
          features: [
            "روزنامة المباريات مشتركة مع المدربين وأولياء الأمور",
            "انتقاء الفريق من سجل العضو نفسه",
            "ترتيبات الذهاب والإياب مرتبطة بالمباراة",
            "النتائج والجاهزية تغذّي الانتقاء التالي",
          ],
          evidence: {
            kind: "rows",
            title: "الأيام السبعة القادمة",
            badge: "بيانات تجريبية",
            rows: [
              {
                leading: "السبت",
                primary: "دوري تحت ١٦ · خارج الأرض",
                secondary: "٠٩:٠٠ · الإسكندرية",
                trailing: "تحديد الفريق",
                trailingTone: "positive",
              },
              {
                leading: "السبت",
                primary: "اختبارات زمن السباحة",
                secondary: "١٤:٠٠ · المسبح الأولمبي",
                trailing: "مؤكد",
                trailingTone: "positive",
              },
              {
                leading: "الأحد",
                primary: "ليلة أعضاء البادل",
                secondary: "١٩:٠٠ · الملاعب ١–٣",
                trailing: "مفتوح",
                trailingTone: "neutral",
              },
              {
                leading: "الاثنين",
                primary: "اختبارات المراكز · تحت ١٤",
                secondary: "١٧:٣٠ · الملعب الرئيسي",
                trailing: "يحتاج مدربًا",
                trailingTone: "attention",
              },
            ],
          },
        },
      ],
    },
    {
      id: "platform-wide",
      name: "عبر المنصة",
      blurb: "مدفوعات تُطابَق في اليوم نفسه، وتنبيهات تصل بينما لا يزال هناك وقت للتصرف، وصورة تشغيلية واحدة عبر كل فرع.",
      accent: "lime",
      modules: [
        {
          id: "payments",
          name: "المدفوعات",
          lead: "الرسوم والفواتير والمطابقة مرتبطة بما جرى حجزه فعلًا.",
          features: [
            "الدفعة تُسجَّل على الحصة، لا على صف في جدول",
            "الفواتير والإيصالات والمستردات من السجل نفسه",
            "الأرصدة المستحقة ظاهرة لكل عضو ولكل فرع",
            "مُطابَق في اليوم نفسه، وقابل للتقرير في اليوم نفسه",
          ],
          evidence: {
            kind: "rows",
            title: "أحدث المدفوعات",
            badge: "مُطابَق",
            rows: [
              {
                primary: "ح. كمال",
                secondary: "فصل الأكاديمية · تحت ١٤",
                trailing: "SAR 2,400",
                trailingTone: "positive",
              },
              {
                primary: "بادل · ملعب ٢",
                secondary: "حجز متكرر · ٨ أسابيع",
                trailing: "SAR 3,200",
                trailingTone: "positive",
              },
              {
                primary: "ر. صبري",
                secondary: "فريق السباحة · شهري",
                trailing: "SAR 850",
                trailingTone: "positive",
              },
              {
                primary: "شركات · ملعب ١",
                secondary: "بلوك الجمعة · ٦ أسابيع",
                trailing: "SAR 5,100",
                trailingTone: "positive",
              },
            ],
          },
        },
        {
          id: "notifications",
          name: "الإشعارات",
          lead: "تُبلَّغ المنظمة بما تغيّر بينما لا يزال هناك وقت للتصرف.",
          features: [
            "التذكيرات تُرسل قبل صافرة البداية، لا بعدها",
            "طلبات البدلاء والإلغاءات تُرفع فورًا",
            "إشعارات التجديد والدفع وفق جدول الخطة نفسها",
            "كل إشعار يعود إلى السجل الذي أطلقه",
          ],
          evidence: {
            kind: "rows",
            title: "إشعارات مفتوحة",
            badge: "٣ مفتوحة",
            rows: [
              { primary: "مطلوب مدرب بديل لاختبارات المراكز تحت ١٦.", secondary: "قبل ١٢ دقيقة" },
              { primary: "١١ اشتراكًا تتجدد هذا الأسبوع.", secondary: "قبل ساعة" },
              { primary: "صيانة الحارة ٤ في المسبح تُغلقها الخميس ٠٦:٠٠.", secondary: "قبل ٣ ساعات" },
            ],
          },
        },
        {
          id: "crm",
          name: "إدارة العلاقات",
          lead: "الاستفسارات والاختبارات والمتابعات مُتتبَّعة حتى تتحول إلى عضوية.",
          features: [
            "الاستفسارات تُلتقط من الاستقبال والهاتف والموقع",
            "حصص الاختبار تُحجز مباشرة على الشبكة الحقيقية",
            "متابعات لكل منها مسؤول وتاريخ",
            "معدل التحويل ظاهر لكل رياضة ولكل فرع",
          ],
          evidence: {
            kind: "stats",
            title: "المسار · هذا الشهر",
            badge: "بيانات تجريبية",
            stats: [
              { value: "184", label: "الاستفسارات" },
              { value: "96", label: "اختبارات محجوزة" },
              { value: "61", label: "تحوّل إلى عضوية", caption: "٣٣٪ من الاستفسارات" },
            ],
          },
        },
        {
          id: "branches",
          name: "الفروع",
          lead: "كل فرع يدير يومه. والمجموعة تقرأ صورة تشغيلية واحدة عبرها جميعًا.",
          features: [
            "جداول وطواقم وتسعير على مستوى الفرع",
            "تقارير المجموعة دون سجلات أعضاء مكررة",
            "أدوار وصلاحيات محددة لكل فرع",
            "مؤشرات مجمّعة للمنظمة، لا خمسة ملفات تصدير",
          ],
          evidence: {
            kind: "chips",
            title: "منظمة واحدة · ٤ فروع",
            badge: "عرض المجموعة",
            chips: [
              { label: "القاهرة · ٩٤٪" },
              { label: "المعادي · ٨٨٪" },
              { label: "مدينة نصر · ٨١٪" },
              { label: "الإسكندرية · ٧٦٪" },
            ],
            note: "معدل الاستخدام عبر ٧ رياضات و١٧ ملعبًا، على خط تقارير واحد.",
          },
        },
      ],
    },
  ],
  dashboard: {
    label: "تجربة المنتج",
    title: "كل وحدة تنتهي إلى لوحة تشغيل واحدة.",
    subtitle:
      "الإيرادات والأعضاء والحجوزات والحضور والفعاليات والمدفوعات والرؤى — تُقرأ معًا وتُطابَق في اليوم نفسه.",
    stats: [
      { value: "SAR 214K", label: "الإيرادات", caption: "+٣٤٪ مقارنة بالموسم الماضي" },
      { value: "1,860", label: "الأعضاء النشطون", caption: "+١٢٤ هذا الشهر" },
      { value: "97%", label: "الحضور المُسجَّل", caption: "إغلاق في اليوم نفسه" },
    ],
    imageAlt:
      "مكتب التشغيل في مجمع رياضي بعد الإغلاق: شاشات مطفأة وبطاقة تعريف على الطاولة، والملاعب والمضامير لا تزال مضاءة خلف النافذة.",
  },
  closing: {
    title: "شاهد المنصة على تشغيلك أنت.",
    subtitle: "نربط برامجك وملاعبك وطاقمك قبل أن تجربه — ليكون العرض على جدولك أنت، لا على جدولنا.",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "اختر حلًا",
    note: "تهيئة بمرافقة فريق المبيعات · التشغيل عادةً خلال فترة توقف موسم واحدة.",
  },
};
