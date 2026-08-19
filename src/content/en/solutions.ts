/**
 * English content for the solutions hub page (`/solutions`).
 *
 * Ported from `backup/scripe-static/solutions.html`: hero → four-card
 * solution grid → comparison grid → "what never changes" shared value
 * proposition → closing CTA. The grid's `title`/`description`/`cta`/`href`
 * strings match `src/content/en/home.ts`'s `solutions.items` verbatim (both
 * are the legacy site's own copy for the same four cards) so the same
 * product claim reads identically wherever it appears; `stats` and the
 * compare grid's `features` are ported from the legacy hub page's own card
 * and comparison markup, not new claims.
 *
 * The accent identity per solution — club = rust, academy = teal,
 * venue = jade, multi-sport = fi/indigo — mirrors
 * `src/components/chrome/ia.ts`'s `SOLUTIONS` mega-menu mapping and
 * `src/content/en/home.ts`'s `solutions.items`, kept consistent everywhere
 * the four shapes appear.
 */
import type { SolutionsHubContent } from "../types";

export const solutionsContent: SolutionsHubContent = {
  meta: {
    title: "Solutions",
    description:
      "Four ways sport is organized — clubs, academies, venues and multi-sports organizations — on one operating system.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Solutions",
  },
  hero: {
    eyebrow: "Solutions",
    title: "Four ways sport is organized. One system underneath.",
    subtitle:
      "Clubs, academies, venues and multi-sports organizations run different days. They run on the same record.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
  },
  grid: {
    title: "Start where your organization actually sits.",
    subtitle: "Each solution is the same platform, configured around the operation you already run.",
    items: [
      {
        title: "Sports Clubs",
        description: "Squads, membership, the competition calendar, attendance and payments on one connected record.",
        cta: "Explore SCRIPE for Sports Clubs",
        href: "/solutions/sports-clubs",
        accent: "club",
        stats: [
          { label: "Squads", value: "14" },
          { label: "Members", value: "1,860" },
          { label: "Fixtures this month", value: "23" },
        ],
      },
      {
        title: "Sports Academies",
        description: "Programs, groups and sessions with attendance, subscriptions and guardian communication attached.",
        cta: "Explore SCRIPE for Sports Academies",
        href: "/solutions/sports-academies",
        accent: "academy",
        stats: [
          { label: "Programs", value: "31" },
          { label: "Sessions per week", value: "412" },
          { label: "Attendance marked", value: "97%" },
        ],
      },
      {
        title: "Sports Venues",
        description: "Availability, one-off and recurring booking, pricing rules, check-in and peak-hour utilization.",
        cta: "Explore SCRIPE for Sports Venues",
        href: "/solutions/sports-venues",
        accent: "venue",
        stats: [
          { label: "Surfaces", value: "9" },
          { label: "Bookings this week", value: "268" },
          { label: "Utilization", value: "92%" },
        ],
      },
      {
        title: "Multi-Sports Organizations",
        description: "Centralized operations, combined KPIs, branch management, permissions and group reporting.",
        cta: "Explore SCRIPE for Multi-Sports Organizations",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
        stats: [
          { label: "Branches", value: "4" },
          { label: "Sports", value: "7" },
          { label: "One reporting line", value: "Group" },
        ],
      },
    ],
  },
  compare: {
    title: "Same platform. Different centre of gravity.",
    subtitle: "Every solution can run every module. These are the ones each organization leans on first.",
    columns: [
      {
        title: "Sports Clubs",
        cta: "Explore SCRIPE for Sports Clubs",
        href: "/solutions/sports-clubs",
        accent: "club",
        features: ["Teams and squads", "Members", "Competition calendar", "Attendance", "Payments", "Coaches", "Reports"],
      },
      {
        title: "Sports Academies",
        cta: "Explore SCRIPE for Sports Academies",
        href: "/solutions/sports-academies",
        accent: "academy",
        features: ["Development programs", "Athletes", "Parents", "Coaches", "Attendance", "Subscriptions", "Payments"],
      },
      {
        title: "Sports Venues",
        cta: "Explore SCRIPE for Sports Venues",
        href: "/solutions/sports-venues",
        accent: "venue",
        features: ["Courts", "Fields", "Pools", "Reservations", "Availability", "Payments", "Utilization"],
      },
      {
        title: "Multi-Sports Organizations",
        cta: "Explore SCRIPE for Multi-Sports Organizations",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
        features: [
          "Multiple branches",
          "Multiple sports",
          "Centralized operations",
          "Combined KPIs",
          "Permissions",
          "Reporting",
        ],
      },
    ],
  },
  shared: {
    title: "The record underneath is the same in all four.",
    cta: "Explore the platform",
    href: "/platform",
    points: [
      "One member record across sports, squads and branches",
      "Sessions, surfaces and staff held together in one action",
      "Payments reconciled against what was actually booked",
      "Attendance closed the same day it happened",
      "Reporting built from the record, not re-keyed",
    ],
  },
  cta: {
    title: "Not sure which shape you are?",
    subtitle: "Most organizations are more than one. We scope it with your operations team before anything is configured.",
    primaryCta: "Book a demo",
    secondaryCta: "See pricing",
    note: "Sales-assisted onboarding · timeline set during scoping.",
  },
};
