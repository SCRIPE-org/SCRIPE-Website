/**
 * English content for the resources page (`/resources`).
 *
 * Ported from `backup/scripe-static/resources.html`: hero → guides
 * (`#guides`) → FAQ (`#faq`) → product resources (`#product`) → articles
 * (`#articles`) → closing CTA are the legacy page's own copy, verbatim,
 * including every guide/article's honest "In preparation"/"Coming soon"
 * status word (the legacy page shipped zero completed guides and zero
 * published articles at the time this was ported — nothing here invents a
 * finished piece that does not exist) and all thirteen product-resources
 * tile captions.
 *
 * `productReading.items` reuses the same thirteen module ids/names/accents
 * `src/content/en/platform.ts` already establishes for `PlatformContent`
 * (Members, Subscriptions, Reservations, Payments, Attendance, Competitions,
 * Coach Management, Parents, Notifications, CRM, Reports, Analytics,
 * Branches — see `ProductReadingEntry`'s doc comment in `src/content/types.ts`
 * for why this is a hand-copied parallel list rather than an import), in the
 * legacy page's own tile order. Each `description` is the legacy tile's
 * caption verbatim.
 *
 * The FAQ's eight question/answer pairs are the legacy page's own accordion
 * content (`js/faq.js`), unchanged — the exact same "Before you talk to
 * sales" framing `src/content/en/pricing.ts` borrows the heading from, but
 * this is that heading's original home.
 */
import type { ResourcesContent } from "../types";

export const resourcesContent: ResourcesContent = {
  meta: {
    title: "Resources",
    description:
      "SCRIPE resources: setup guides, the questions operations leaders ask before talking to sales, product reference for every module, and articles as they are published.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Resources",
  },
  hero: {
    label: "Resources",
    title: "Everything worth reading before you decide.",
    subtitle:
      "Setup guides, the questions operations leaders actually ask, and a reference for every module in the platform.",
    primaryCta: "Talk to sales",
  },
  guides: {
    label: "Guides",
    title: "How organizations set SCRIPE up.",
    subtitle:
      "Written with the operations teams doing it. Published as each one is finished — nothing here is filler.",
    items: [
      {
        kind: "guide",
        slug: "mapping-your-programs-into-scripe",
        title: "Mapping your programs into SCRIPE",
        summary: "How programs, groups and sessions are structured before the first member is imported.",
        tag: "In preparation",
      },
      {
        kind: "guide",
        slug: "moving-a-season-mid-year",
        title: "Moving a season mid-year",
        summary: "What to migrate, what to leave behind, and how attendance history is carried across.",
        tag: "In preparation",
      },
      {
        kind: "guide",
        slug: "setting-pricing-rules-for-surfaces",
        title: "Setting pricing rules for surfaces",
        summary: "Member, guest and recurring pricing on courts, pitches and pool lanes.",
        tag: "In preparation",
      },
      {
        kind: "guide",
        slug: "rolling-out-the-coach-app",
        title: "Rolling out the Coach App",
        summary: "Getting rosters, session plans and offline attendance into coaches' hands.",
        tag: "In preparation",
      },
    ],
    note: "Guides are in preparation. Ask for the topic you need and we will send it when it is written.",
  },
  faq: {
    label: "Questions",
    title: "Before you talk to sales.",
    items: [
      {
        question: "What is SCRIPE?",
        answer:
          "A sports operations system. Members, programs, sessions, surfaces, bookings, payments and reporting run on one connected record instead of separate tools.",
      },
      {
        question: "Who is SCRIPE for?",
        answer:
          "Clubs, academies, venues and multi-branch organizations — owners, directors, operations leads, coaches and reception staff.",
      },
      {
        question: "Can I manage multiple branches?",
        answer:
          "Yes. Each branch runs its own timetable and staff, while group reporting reads across all of them without duplicate records.",
      },
      {
        question: "Can I manage different sports?",
        answer:
          "Programs, surfaces and bookings are sport-agnostic — padel, swimming, basketball, tennis and gymnastics run alongside football.",
      },
      {
        question: "Can I manage reservations and payments?",
        answer:
          "Yes. One-off and recurring bookings, pricing rules, payment and check-in sit on the same grid, reconciled the same day.",
      },
      {
        question: "Can coaches use SCRIPE?",
        answer:
          "Session plans, rosters and attendance already live in the record; a dedicated Coach App with offline marking is rolling out now.",
      },
      {
        question: "Can parents access the platform?",
        answer:
          "Guardians receive session and attendance updates today. A dedicated guardian portal is on the roadmap rather than in the current release.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Trials are set up with our team so your programs, surfaces and staff are mapped before you test it. Request one and we will scope it with you.",
      },
    ],
  },
  productReading: {
    label: "Product resources",
    title: "A reference for every module.",
    subtitle:
      "Thirteen capabilities, what each one does, and what it replaces. Each links straight into the platform page.",
    items: [
      {
        id: "members",
        name: "Members",
        description: "One record per athlete, guardian and staff member — carried across every branch, sport and season.",
        accent: "academy",
      },
      {
        id: "subscriptions",
        name: "Subscriptions",
        description: "Terms, monthly plans and recurring blocks that renew on the rule you set, not on someone remembering.",
        accent: "club",
      },
      {
        id: "reservations",
        name: "Reservations",
        description: "Availability, one-off and recurring booking, pricing rules and check-in on one grid.",
        accent: "venue",
      },
      {
        id: "payments",
        name: "Payments",
        description: "Charges, invoices and reconciliation attached to the thing that was actually booked.",
        accent: "lime",
      },
      {
        id: "attendance",
        name: "Attendance",
        description: "Marked pitchside, in seconds, offline if the pitch has no signal — and closed the same day.",
        accent: "academy",
      },
      {
        id: "competitions",
        name: "Competitions",
        description: "Fixtures, squads, travel and results kept on the same calendar the rest of the club reads.",
        accent: "club",
      },
      {
        id: "coaches",
        name: "Coach Management",
        description: "Rosters, session plans, cover and load — for the people who actually run the sessions.",
        accent: "fi",
      },
      {
        id: "parents",
        name: "Parents",
        description: "Guardians receive the session, attendance and payment updates that used to arrive by phone call.",
        accent: "academy",
      },
      {
        id: "notifications",
        name: "Notifications",
        description: "The organization is told what changed while there is still time to act on it.",
        accent: "lime",
      },
      {
        id: "crm",
        name: "CRM",
        description: "Enquiries, trials and follow-ups tracked to the point where they become a member.",
        accent: "lime",
      },
      {
        id: "reports",
        name: "Reports",
        description: "The operating picture your board asks for, built from the record rather than re-keyed into a deck.",
        accent: "venue",
      },
      {
        id: "analytics",
        name: "Analytics",
        description: "Patterns you would not see on a timetable: peak hours, unsold slots, sports that carry the week.",
        accent: "venue",
      },
      {
        id: "branches",
        name: "Branches",
        description: "Every branch runs its own day. The group reads one operational picture across all of them.",
        accent: "lime",
      },
    ],
  },
  articles: {
    label: "Articles",
    title: "Published as they are written.",
    subtitle: "No back catalogue, no invented case studies. This section fills up after launch.",
    items: [
      {
        kind: "article",
        slug: "notes-on-running-sport",
        title: "Notes on running sport",
        summary: "Short pieces on operations, written as they happen. Published at launch.",
        tag: "Coming soon",
      },
      {
        kind: "article",
        slug: "product-updates",
        title: "Product updates",
        summary: "What shipped, what changed, and what it replaces. Published at launch.",
        tag: "Coming soon",
      },
      {
        kind: "article",
        slug: "onboarding-notes",
        title: "Onboarding notes",
        summary: "What the first four weeks with an operations team actually look like.",
        tag: "Coming soon",
      },
    ],
  },
  cta: {
    title: "Can't find what you need?",
    subtitle: "Ask the question directly — an operations lead will answer it, and it usually becomes the next guide.",
    primaryCta: "Book a Demo",
    secondaryCta: "Talk to sales",
    note: "Sales-assisted onboarding · timeline set during scoping.",
  },
};
