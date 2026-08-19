/**
 * English content for the platform page — the full thirteen-capability
 * catalog.
 *
 * Every module's copy (name, lead, four feature bullets, evidence panel) is
 * ported verbatim from the legacy static site
 * (`backup/scripe-static/platform.html`, referenced below by its
 * `data-i18n` keys), including its sample figures — every number here
 * (attendance percentages, coach loads, branch utilization) already appeared
 * on the legacy page as illustrative "product evidence," not live data.
 *
 * The legacy page listed all thirteen modules in one flat list. This file
 * additionally groups them into five product-accent families — new
 * editorial structure the legacy page never had, composed here for the
 * sticky subnav and family headers Task 14's brief calls for:
 *
 * - `venue` (jade) — Reservations, Reports, Analytics. Reports and Analytics
 *   are the two modules whose own evidence panels are read across surfaces
 *   and utilization (Analytics' evidence is literally titled "Venue
 *   utilization"); Reservations is the venue-facing module `home.ts`
 *   already accents `venue`.
 * - `academy` (teal) — Members, Attendance, Parents. `home.ts` already
 *   accents Members and Attendance `academy`; Parents (guardians, the
 *   academy-world's development-program audience) joins them.
 * - `fi` (indigo) — Coach Management alone. `home.ts` already accents it
 *   `fi`, and its own lead sentence is reused verbatim as the Football
 *   Intelligence product description in `home.ts`'s `productFamily` section
 *   — a specialist, single-module family by design, matching the product
 *   framing where Football Intelligence is important but not one of the
 *   three horizontal products.
 * - `club` (rust) — Subscriptions, Competitions. `home.ts` already accents
 *   both `club` (membership/renewal and fixture administration).
 * - `lime` (platform-wide) — Payments, Notifications, CRM, Branches. Payments
 *   is `lime` in `home.ts` already; the other three are cross-cutting
 *   infrastructure that every family reads from — Notifications' own sample
 *   feed literally spans a coach-cover alert (academy), a subscription
 *   renewal count (club) and a pool-maintenance notice (venue) in one panel,
 *   which is the clearest evidence in the source copy itself that it is not
 *   one family's capability.
 *
 * `meta.description` is authored here (the legacy `<meta>` tag was static
 * English only, never run through the client-side language swap — the exact
 * defect this rebuild's `hreflang`/locale-URL model fixes). The five group
 * `blurb` strings are also new — each composed only from words its own
 * modules' approved lead sentences already use, no new claims.
 *
 * The legacy page's separate thirteen-tile quick-nav grid and its full
 * "product experience" fake-dashboard mockup section are intentionally not
 * ported: the sticky subnav (five family links) replaces the tile grid per
 * the brief ("keep it lightweight"), and `dashboard` below reprises the
 * Reports module's own three stats as the page's closing payoff statement
 * instead of re-describing them inside a hand-built app-chrome screenshot.
 * The legacy automation-chain section is not repeated here either — it is
 * already the home page's `#automation` section, one click away, and this
 * page's job is the capability catalog the home page only points into.
 */
import type { PlatformContent } from "../types";

export const platformContent: PlatformContent = {
  meta: {
    title: "Platform",
    description:
      "Everything your sports organization needs, in one operating system: members, subscriptions, reservations, payments, attendance, competitions, coach management, parents, notifications, CRM, reports, analytics and branches.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Platform",
  },
  hero: {
    label: "Platform",
    title: "Everything your sports organization needs. One operating system.",
    subtitle:
      "Thirteen capabilities on one connected record. Switch modules on as the organization grows — nothing has to be re-entered, re-keyed or reconciled twice.",
    primaryCta: "Book a Demo",
    secondaryCta: "See pricing",
    imageAlt:
      "An elevated terrace view at night over a lit padel and tennis court complex, with a floodlit football pitch beyond it connected by a lit walkway.",
  },
  nav: {
    label: "Capability families",
  },
  groups: [
    {
      id: "venue",
      name: "Venue",
      blurb:
        "Availability, the operating picture and the demand patterns underneath it — read from the same record every time.",
      accent: "venue",
      modules: [
        {
          id: "reservations",
          name: "Reservations",
          lead: "Availability, one-off and recurring booking, pricing rules and check-in on one grid.",
          features: [
            "Surfaces, coaches and time held together in one action",
            "Recurring blocks that survive a fixture clash",
            "Pricing rules by slot, member type and season",
            "Check-in at reception or on the phone",
          ],
          evidence: {
            kind: "grid",
            title: "Court 1 · Tuesday",
            badge: "Sample data",
            times: ["16:00", "17:00", "18:00", "19:00"],
            slots: [
              { label: "Open", tone: "neutral" },
              { label: "Held", tone: "attention" },
              { label: "Booked", tone: "positive" },
              { label: "Booked", tone: "positive" },
            ],
            note: "Held slots release automatically when payment does not land.",
          },
        },
        {
          id: "reports",
          name: "Reports",
          lead: "The operating picture your board asks for, built from the record rather than re-keyed into a deck.",
          features: [
            "Revenue, membership, attendance and utilization in one view",
            "Per branch, per sport, per season — same definitions everywhere",
            "Exportable without a data project",
            "Reconciled the same day the sessions happened",
          ],
          evidence: {
            kind: "stats",
            title: "Operations overview",
            badge: "Sample data",
            stats: [
              { value: "SAR 214K", label: "Revenue", caption: "+34% vs last season" },
              { value: "1,860", label: "Active members", caption: "+124 this month" },
              { value: "97%", label: "Attendance marked", caption: "Same-day close" },
            ],
          },
        },
        {
          id: "analytics",
          name: "Analytics",
          lead: "Patterns you would not see on a timetable: peak hours, unsold slots, sports that carry the week.",
          features: [
            "Peak-hour demand tracked across surfaces and sports",
            "Unsold capacity surfaced while it can still be sold",
            "Coach load balanced against real session counts",
            "Season-over-season comparison on one definition",
          ],
          evidence: {
            kind: "meters",
            title: "Venue utilization",
            badge: "Sample data",
            meters: [
              { label: "Padel courts", percent: 98 },
              { label: "Olympic pool", percent: 91 },
              { label: "Main stadium", percent: 84 },
              { label: "Pitch 2", percent: 61 },
            ],
            note: "Two of five evening slots on Pitch 2 stay unsold.",
          },
        },
      ],
    },
    {
      id: "academy",
      name: "Academy",
      blurb:
        "One record per athlete, attendance marked pitchside, and the updates guardians used to wait for by phone call.",
      accent: "academy",
      modules: [
        {
          id: "members",
          name: "Members",
          lead: "One record per athlete, guardian and staff member — carried across every branch, sport and season.",
          features: [
            "Profiles, guardians and emergency contacts on one record",
            "Squads, groups and programs without duplicate entries",
            "Medical notes, documents and consents attached",
            "History that survives a change of branch or sport",
          ],
          evidence: {
            kind: "rows",
            title: "Member record",
            badge: "Sample data",
            rows: [
              {
                primary: "Hamza Kamal · U14",
                secondary: "Academy term · guardian linked",
                trailing: "Active",
                trailingTone: "positive",
              },
              {
                primary: "Rana Sabri",
                secondary: "Swim squad · monthly",
                trailing: "Active",
                trailingTone: "positive",
              },
              {
                primary: "Yusuf Adel · U16",
                secondary: "Trial period · 2 sessions left",
                trailing: "Trial",
                trailingTone: "attention",
              },
              {
                primary: "Layla Farouk",
                secondary: "Padel member · guest access",
                trailing: "Active",
                trailingTone: "positive",
              },
            ],
            note: "One record, read by every module — not four copies in four tools.",
          },
        },
        {
          id: "attendance",
          name: "Attendance",
          lead: "Marked pitchside, in seconds, offline if the pitch has no signal — and closed the same day.",
          features: [
            "Coach marks the roster from the phone",
            "Works offline and syncs when signal returns",
            "Absences reach guardians without a phone call",
            "Same-day close rate is a number, not a guess",
          ],
          evidence: {
            kind: "meters",
            title: "Attendance · this week",
            badge: "Sample data",
            meters: [
              { label: "Monday", percent: 58 },
              { label: "Wednesday", percent: 64 },
              { label: "Thursday", percent: 86 },
              { label: "Saturday", percent: 94 },
            ],
          },
        },
        {
          id: "parents",
          name: "Parents",
          lead: "Guardians receive the session, attendance and payment updates that used to arrive by phone call.",
          features: [
            "Session and attendance updates sent automatically",
            "Payment reminders before the due date, not after",
            "Guardian contacts linked to every athlete record",
            "A dedicated guardian portal is planned, not shipped",
          ],
          roadmapNote: "Guardian portal on the roadmap",
          evidence: {
            kind: "rows",
            title: "What a guardian receives",
            badge: "Sample data",
            rows: [
              { primary: "Session confirmed · U14 technical block", secondary: "Tuesday 16:30 · Pitch 2" },
              { primary: "Attendance marked · present", secondary: "Sent 18:04" },
              { primary: "Term payment due in 5 days", secondary: "SAR 2,400" },
            ],
            note: "Release 1 sends updates. A guardian portal is on the roadmap.",
          },
        },
      ],
    },
    {
      id: "fi",
      name: "Football Intelligence",
      blurb: "Rosters, session plans, cover and load — for the people who actually run the sessions.",
      accent: "fi",
      modules: [
        {
          id: "coaches",
          name: "Coach Management",
          lead: "Rosters, session plans, cover and load — for the people who actually run the sessions.",
          features: [
            "Session plans and rosters on the coach's phone",
            "Cover requests raised and resolved before kick-off",
            "Weekly load visible per coach, not per guess",
            "Observations and trial notes reach selection without retyping",
          ],
          evidence: {
            kind: "rows",
            title: "Coach load · sessions per week",
            badge: "Sample data",
            rows: [
              { primary: "A. Haddad", secondary: "Technical · U12–U14", trailing: "18", trailingTone: "neutral" },
              { primary: "M. Osman", secondary: "Small-sided · U14", trailing: "16", trailingTone: "neutral" },
              { primary: "L. Farah", secondary: "Swimming squad", trailing: "14", trailingTone: "neutral" },
              { primary: "K. Nasser", secondary: "Trials and selection", trailing: "11", trailingTone: "neutral" },
            ],
          },
        },
      ],
    },
    {
      id: "club",
      name: "Club",
      blurb:
        "Terms that renew on the rule you set, and fixtures kept on the same calendar the rest of the club already reads.",
      accent: "club",
      modules: [
        {
          id: "subscriptions",
          name: "Subscriptions",
          lead: "Terms, monthly plans and recurring blocks that renew on the rule you set, not on someone remembering.",
          features: [
            "Term, monthly and recurring plans side by side",
            "Renewal windows, pauses and pro-rata handled in the plan",
            "Family and sibling pricing without manual maths",
            "Every renewal visible before it lands, not after",
          ],
          evidence: {
            kind: "stats",
            title: "Subscriptions · this week",
            badge: "Sample data",
            stats: [
              { value: "11", label: "Renewing", caption: "Next 7 days" },
              { value: "3", label: "Paused", caption: "Resume dates set" },
              { value: "97%", label: "Collected", caption: "Same-cycle rate" },
            ],
          },
        },
        {
          id: "competitions",
          name: "Competitions",
          lead: "Fixtures, squads, travel and results kept on the same calendar the rest of the club reads.",
          features: [
            "Fixture calendar shared with coaches and guardians",
            "Squad selection from the same member record",
            "Home and away logistics attached to the fixture",
            "Results and availability feed the next selection",
          ],
          evidence: {
            kind: "rows",
            title: "Next 7 days",
            badge: "Sample data",
            rows: [
              {
                leading: "Sat",
                primary: "U16 league · away",
                secondary: "09:00 · Alexandria",
                trailing: "Squad set",
                trailingTone: "positive",
              },
              {
                leading: "Sat",
                primary: "Swim time trials",
                secondary: "14:00 · Olympic pool",
                trailing: "Confirmed",
                trailingTone: "positive",
              },
              {
                leading: "Sun",
                primary: "Padel members night",
                secondary: "19:00 · Courts 1–3",
                trailing: "Open",
                trailingTone: "neutral",
              },
              {
                leading: "Mon",
                primary: "Position trials · U14",
                secondary: "17:30 · Main stadium",
                trailing: "Needs coach",
                trailingTone: "attention",
              },
            ],
          },
        },
      ],
    },
    {
      id: "platform-wide",
      name: "Platform-wide",
      blurb:
        "Payments reconciled the same day, alerts raised while there is still time to act, and one operational picture across every branch.",
      accent: "lime",
      modules: [
        {
          id: "payments",
          name: "Payments",
          lead: "Charges, invoices and reconciliation attached to the thing that was actually booked.",
          features: [
            "Payment recorded against the session, not a spreadsheet row",
            "Invoices, receipts and refunds from the same record",
            "Outstanding balances visible per member and per branch",
            "Reconciled the same day, reportable the same day",
          ],
          evidence: {
            kind: "rows",
            title: "Recent payments",
            badge: "Sample data",
            rows: [
              {
                primary: "H. Kamal",
                secondary: "Academy term · U14",
                trailing: "SAR 2,400",
                trailingTone: "positive",
              },
              {
                primary: "Padel · Court 2",
                secondary: "Recurring booking · 8 weeks",
                trailing: "SAR 3,200",
                trailingTone: "positive",
              },
              {
                primary: "R. Sabri",
                secondary: "Swim squad · monthly",
                trailing: "SAR 850",
                trailingTone: "positive",
              },
              {
                primary: "Corporate · Pitch 1",
                secondary: "Friday block · 6 weeks",
                trailing: "SAR 5,100",
                trailingTone: "positive",
              },
            ],
          },
        },
        {
          id: "notifications",
          name: "Notifications",
          lead: "The organization is told what changed while there is still time to act on it.",
          features: [
            "Reminders sent before kick-off, not after it",
            "Cover requests and cancellations raised immediately",
            "Renewal and payment notices on the plan's own schedule",
            "Every notice traces back to the record that triggered it",
          ],
          evidence: {
            kind: "rows",
            title: "Open notifications",
            badge: "Sample data",
            rows: [
              { primary: "Coach cover needed for U16 position trials.", secondary: "12 min ago" },
              { primary: "11 subscriptions renew this week.", secondary: "1 hour ago" },
              { primary: "Pool lane 4 maintenance closes Thursday 06:00.", secondary: "3 hours ago" },
            ],
          },
        },
        {
          id: "crm",
          name: "CRM",
          lead: "Enquiries, trials and follow-ups tracked to the point where they become a member.",
          features: [
            "Enquiries captured from reception, phone and web",
            "Trial sessions booked straight onto the real grid",
            "Follow-ups owned by a person, with a date",
            "Conversion visible per sport and per branch",
          ],
          evidence: {
            kind: "stats",
            title: "Pipeline · this month",
            badge: "Sample data",
            stats: [
              { value: "184", label: "Enquiries" },
              { value: "96", label: "Trials booked" },
              { value: "61", label: "Converted", caption: "33% of enquiries" },
            ],
          },
        },
        {
          id: "branches",
          name: "Branches",
          lead: "Every branch runs its own day. The group reads one operational picture across all of them.",
          features: [
            "Branch-level timetables, staff and pricing",
            "Group reporting without duplicate member records",
            "Roles and permissions scoped per branch",
            "Combined KPIs for the organization, not five exports",
          ],
          evidence: {
            kind: "chips",
            title: "One organization · 4 branches",
            badge: "Sample data",
            chips: [
              { label: "Cairo · 94%" },
              { label: "Maadi · 88%" },
              { label: "Nasr City · 81%" },
              { label: "Alexandria · 76%" },
            ],
            note: "Utilization across 7 sports and 17 surfaces, on one reporting line.",
          },
        },
      ],
    },
  ],
  dashboard: {
    label: "Product experience",
    title: "Every module resolves into one dashboard.",
    subtitle:
      "Revenue, members, reservations, attendance, events, payments and insights — read together, reconciled the same day.",
    stats: [
      { value: "SAR 214K", label: "Revenue", caption: "+34% vs last season" },
      { value: "1,860", label: "Active members", caption: "+124 this month" },
      { value: "97%", label: "Attendance marked", caption: "Same-day close" },
    ],
    imageAlt:
      "The operations desk at a sports campus after closing: dark monitors and a lanyard left on the counter, the floodlit pitches and courts still lit through the window.",
  },
  closing: {
    title: "See the platform against your own operation.",
    subtitle:
      "We map your programs, surfaces and staff before you test it — so the demo is your timetable, not ours.",
    primaryCta: "Book a Demo",
    secondaryCta: "Choose a solution",
    note: "Sales-assisted onboarding · timeline set during scoping.",
  },
};
