/**
 * English content for the company page (`/company`).
 *
 * Ported verbatim from `backup/scripe-static/company.html`: page-header
 * (hero) → `#mission` (mission copy paired with the "Product vision"
 * checklist) → "How we build" (four operating-principle cards) → `#legal`
 * ("Working with us") → closing CTA. No fact is invented — the legacy page
 * never carried a team bio, an office address, or a company history, and
 * this port doesn't add one.
 *
 * `principles.items` accent assignment is new editorial structure (the
 * legacy page's own icon tiles used three ad-hoc inline color overrides plus
 * one plain/unaccented tile — not this codebase's `AccentId` system, which
 * didn't exist yet). Mapped here by what each principle is actually about,
 * not by copying the legacy colors 1:1:
 * - "Sports operations" → `lime`, the brand-wide accent, matching the
 *   legacy tile's own `--accent-primary` color and this principle's role as
 *   the central, everything-runs-through-this claim.
 * - "One connected record" → no accent (`undefined`), matching the legacy
 *   tile verbatim: it used the plain `.sc-icon-tile` class with no color
 *   override, the one principle of the four the legacy page itself did not
 *   single out with a brand color.
 * - "Multi-sport by default" → `academy`, because `CLAUDE.md`'s current
 *   product framing names the Academy product line's own scope as
 *   "multi-sport core" — the clearest real tie between this principle and
 *   one of the three Sports Operations OS products, not an arbitrary color
 *   rotation.
 * - "Technology that stays out of the way" → `venue`, whose jade tone reads
 *   closest to the legacy tile's own `--positive` green among the accents
 *   this codebase actually defines.
 */
import type { CompanyContent } from "../types";

export const companyContent: CompanyContent = {
  meta: {
    title: "Company",
    description:
      "SCRIPE is the operational partner behind modern sports organizations — the mission, the product vision, and how sports operations and technology meet.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Company",
  },
  hero: {
    label: "Company",
    title: "The operational partner behind modern sports organizations.",
    subtitle:
      "SCRIPE exists for the part of sport nobody photographs — the timetable, the cover request, the term payment, the attendance sheet.",
    primaryCta: "Book a Demo",
    secondaryCta: "Explore the platform",
    imageAlt:
      "A darkened operations room at night, one desk lamp lit and the chair empty, overlooking a floodlit sports campus through the window",
  },
  mission: {
    label: "Mission",
    title: "Make the operation the easiest part of running sport.",
    scenario:
      "Tuesday, 4:52pm. Three pitches, five groups, two coaches out, one guardian on the phone. This is the part nobody sees — and the part that decides everything. SCRIPE connects it into one system so the answer is already there when the question arrives.",
    audience:
      "We build for owners, directors and operations leaders, with coaches and reception staff as the people who actually live in the product every day. Every module earns its place by removing a step someone is currently doing by hand.",
  },
  vision: {
    label: "Product vision",
    items: [
      "Every session, pitch and athlete on one operating rhythm",
      "Operations answered before anyone has to ask",
      "Evidence that survives the season it was collected in",
      "One operational picture across branches and sports",
    ],
  },
  principles: {
    label: "How we build",
    title: "Four things we hold to.",
    subtitle: "Not a manifesto — the constraints the product is actually designed against.",
    items: [
      {
        id: "operations",
        title: "Sports operations",
        description:
          "The work that decides everything happens between sessions: who is covering pitch two, which lane is free, whether the term was paid. SCRIPE is built around that work, not around a dashboard.",
        accent: "lime",
      },
      {
        id: "record",
        title: "One connected record",
        description:
          "Athletes, guardians, coaches, programs, sessions, surfaces, bookings and payments share one record. Nothing is re-entered, and nothing has to be reconciled twice.",
      },
      {
        id: "multi-sport",
        title: "Multi-sport by default",
        description:
          "Programs, surfaces and bookings are sport-agnostic. Padel, swimming, basketball, tennis and gymnastics run beside football on the same grid.",
        accent: "academy",
      },
      {
        id: "technology",
        title: "Technology that stays out of the way",
        description:
          "Offline-capable where the pitch has no signal, fast where reception is busy, and quiet where the operation is already working.",
        accent: "venue",
      },
    ],
  },
  legal: {
    label: "Working with us",
    title: "Sales-assisted, from first call to first season.",
    body: "There is no self-service provisioning. Programs, surfaces and staff are mapped with your team before anything goes live — and privacy, terms and data handling are covered in that same conversation.",
    note: "Privacy policy, terms of service and data-processing documentation are not published on this site yet — they are issued as part of onboarding. Request them at any point before signing.",
  },
  cta: {
    title: "Talk to the people building it.",
    subtitle: "Bring the operation you actually run. We will show you where SCRIPE fits and where it does not.",
    primaryCta: "Book a Demo",
    secondaryCta: "See pricing",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
