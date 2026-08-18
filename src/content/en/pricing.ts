/**
 * English content for the pricing page (`/pricing`).
 *
 * Ported from `backup/scripe-static/pricing.html`: hero → billing-toggle
 * plan cards → full comparison table → closing CTA are the legacy page's
 * own copy, verbatim, including the three exact SAR figures
 * (Starter 990/9,900 · Growth 2,490/24,900 · Enterprise custom) and every
 * feature/comparison-row label. Nothing here rounds or rephrases a price.
 *
 * usePlanPicker cross-check (required by this task's brief): read
 * `SCRIPE-Frontend/src/modules/shared/auth/signup/src/presentation/viewmodels/usePlanPicker.ts`
 * end to end, plus its neighbors in `presentation/helpers/`
 * (`accountLogic.ts`, `currencyGeo.ts`, `planHelpers.ts`, `planPickerLogic.ts`)
 * and `data/helpers/` (`currencyGeo.ts`, `planPickerLogic.test.ts`), plus
 * `domain/entities/index.ts`. Finding: the signup plan picker has NO static
 * USD base-price constant for Starter/Growth/Enterprise (or any plan name)
 * anywhere in that module — `editions` (with `monthlyPrice`/`annualPrice`/
 * `currency`) comes entirely from `authContainer.signupRepository
 * .getEditions()`, an API call against the server-side catalog, and
 * `currency` itself comes from `getPricingContext()` (geo-detected) or a
 * dev-only `?__currency=` override. `SEEDED_CURRENCIES` (USD/EUR/SAR/EGP,
 * `usePlanPicker.ts` line 38) documents that those four currencies have
 * "hand-set native prices in the seeder" — a *backend* seeder, not a
 * frontend constant, and outside this repo's / this task's reach. A grep of
 * the entire signup module for the ported figures (990, 2490, 9900, 24900)
 * and for `monthlyPrice`/`basePrice` literals turned up nothing but generic
 * unrelated numbers in `planPickerLogic.test.ts`'s test fixtures. Given that,
 * every plan's `baseUsd` below is `null`, per the brief's instruction to
 * record `null` (not invent a figure) when no USD base is found.
 *
 * The FAQ reframes the legacy page's "how pricing works" section (three
 * info cards, not already a Q&A list — the legacy site's only true FAQ
 * accordion lives on `resources.html`, on a different topic) into six real
 * question/answer pairs: the first three map directly onto the three info
 * cards' own sentences (`priced-per-branch`, `sports-do-not-cost-extra`,
 * `sales-assisted-always` in `js/lang-ar.js`), rephrased as questions with
 * their answer bodies kept verbatim; the last three are new questions whose
 * answers are either arithmetic on the ported prices themselves (yearly
 * billing is exactly 10× the monthly figure for both Starter and Growth —
 * 990×10=9,900, 2,490×10=24,900 — matching the toggle's own "−2 months"
 * badge) or a direct restatement of a fact the comparison table below
 * already asserts (branch counts, Football Intelligence availability) —
 * never a new claim. The FAQ heading itself ("Questions" / "Before you talk
 * to sales.") reuses `resources.html`'s own already-approved FAQ heading
 * strings, which fit the pre-sales-call framing this page needs just as
 * well as the resources page's.
 */
import type { PricingContent } from "../types";

export const pricingContent: PricingContent = {
  meta: {
    title: "Pricing",
    description:
      "SCRIPE pricing: Starter, Growth and Enterprise, billed monthly or yearly and priced around branches, sports and volume. Indicative pricing, confirmed with your operations team before signing.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Pricing",
  },
  hero: {
    label: "Pricing",
    title: "Priced around branches, sports and volume.",
    subtitle:
      "Three plans, billed monthly or yearly. Every plan is confirmed with your operations team before signing — indicative figures below.",
    primaryCta: "Book a Demo",
    imageAlt:
      "Night aerial of a city with four separate sports facilities lit up across it — each a stadium, pool or court cluster of its own",
  },
  billing: {
    ariaLabel: "Billing period",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    yearlySavingsBadge: "−2 months",
    perMonthSuffix: "per month · per branch",
    perYearSuffix: "per year · per branch",
  },
  plans: [
    {
      id: "starter",
      name: "Starter",
      tagline: "For small academies.",
      accent: "academy",
      baseMonthly: 990,
      baseYearly: 9900,
      baseCurrency: "SAR",
      baseUsd: null,
      features: [
        "Members and subscriptions",
        "Programs, groups and sessions",
        "Attendance and reminders",
        "Payments and invoices",
        "Standard reports",
      ],
      cta: { label: "Book a Demo", href: "/contact" },
    },
    {
      id: "growth",
      name: "Growth",
      tagline: "For growing clubs and venues.",
      accent: "club",
      baseMonthly: 2490,
      baseYearly: 24900,
      baseCurrency: "SAR",
      baseUsd: null,
      highlight: true,
      badge: "Most chosen",
      features: [
        "Everything in Starter",
        "Reservations and pricing rules",
        "Competitions and squads",
        "Coach management",
        "CRM and notifications",
        "Business intelligence",
      ],
      cta: { label: "Book a Demo", href: "/contact" },
      footnote: "Includes onboarding with your operations team.",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "For multi-branch organizations.",
      accent: "venue",
      baseMonthly: null,
      baseYearly: null,
      baseCurrency: "SAR",
      baseUsd: null,
      customLabel: "Custom",
      customCaption: "Quoted on branches, sports and volume",
      features: [
        "Everything in Growth",
        "Multi-branch control and reporting",
        "Football Intelligence evidence",
        "Custom roles and permissions",
        "Priority onboarding and support",
      ],
      cta: { label: "Talk to sales", href: "/contact" },
    },
  ],
  plansFootnote: "Indicative pricing — every plan is confirmed with your operations team before signing.",
  comparison: {
    label: "Comparison",
    title: "What each plan actually includes.",
    subtitle: "Every plan runs on the same record. The difference is how much of the operation it covers.",
    columnHeader: "Compare plans",
    caption:
      "Every plan is confirmed with your operations team before signing. Trials are set up with our team so your programs, surfaces and staff are mapped before you test it.",
    includedLabel: "Included",
    notIncludedLabel: "Not included",
    groups: [
      {
        title: "Operations",
        rows: [
          {
            label: "Members and profiles",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Programs, groups and sessions",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Attendance and reminders",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Subscriptions and renewals",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Reservations and pricing rules",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Competitions and squads",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Coach management",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
        ],
      },
      {
        title: "Commercial",
        rows: [
          {
            label: "Payments and invoices",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Standard reports",
            values: [{ kind: "included" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "CRM and notifications",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Business intelligence",
            values: [{ kind: "excluded" }, { kind: "included" }, { kind: "included" }],
          },
          {
            label: "Multi-branch control and reporting",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
        ],
      },
      {
        title: "Organization",
        rows: [
          {
            label: "Branches included",
            values: [{ kind: "text", text: "1" }, { kind: "text", text: "1 (add branches)" }, { kind: "text", text: "Unlimited" }],
          },
          {
            label: "Football Intelligence evidence",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
          {
            label: "Custom roles and permissions",
            values: [{ kind: "excluded" }, { kind: "excluded" }, { kind: "included" }],
          },
          {
            label: "Onboarding",
            values: [
              { kind: "text", text: "Guided setup" },
              { kind: "text", text: "With your operations team" },
              { kind: "text", text: "Priority onboarding" },
            ],
          },
          {
            label: "Support",
            values: [{ kind: "text", text: "Standard" }, { kind: "text", text: "Standard" }, { kind: "text", text: "Priority" }],
          },
        ],
      },
    ],
  },
  faq: {
    label: "Questions",
    title: "Before you talk to sales.",
    items: [
      {
        question: "Why is pricing set per branch?",
        answer:
          "Starter and Growth are quoted per branch. Additional branches are added to the same organization, never set up as a second system.",
      },
      {
        question: "Do additional sports cost extra?",
        answer:
          "Programs, surfaces and bookings are sport-agnostic. Adding padel, swimming or basketball beside football does not change the plan.",
      },
      {
        question: "Is there a self-service trial?",
        answer:
          "There is no self-service provisioning. Trials and plans are scoped with our team so your programs, surfaces and staff are mapped first.",
      },
      {
        question: "What do I save by paying yearly?",
        answer:
          "Yearly billing charges ten months at the monthly rate instead of twelve — the two-month saving the toggle above shows for Starter and Growth.",
      },
      {
        question: "Can I add branches to my plan later?",
        answer:
          "Yes. Starter and Growth start with one branch, and additional branches are added to the same plan. Enterprise includes unlimited branches for multi-branch organizations.",
      },
      {
        question: "Is Football Intelligence included?",
        answer: "Football Intelligence evidence is included on Enterprise. Starter and Growth cover core operations first.",
      },
    ],
  },
  cta: {
    title: "Get a plan scoped to your operation.",
    subtitle: "Bring your branch count, sports and season volume — we will confirm the plan before anything is signed.",
    primaryCta: "Book a Demo",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
