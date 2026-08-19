/**
 * English content for the Sports Academies solution page (`/solutions/sports-academies`).
 *
 * Ported from `backup/scripe-static/solutions/sports-academies.html`: hero,
 * "focus" capability grid and "numbers" KPI strip ported near-verbatim,
 * trimmed to a curated six capabilities (the legacy page's own nine, minus
 * Communication and Payments — both already carried by Sports Clubs/Venues'
 * own capability lists, kept here distinct around the development pathway).
 * `painPoints` is new structure — see `SolutionContent`'s doc comment in
 * `src/content/types.ts`; its three items are composed from the legacy
 * hero's own "development evidence survives the season" framing and the
 * operating-day section's copy, not new claims.
 */
import type { SolutionContent } from "../types";

export const solutionAcademiesContent: SolutionContent = {
  meta: {
    title: "Sports Academies",
    description:
      "SCRIPE for sports academies: development programs, athletes, parents, coaches, attendance, subscriptions, payments, communication and performance evidence.",
    breadcrumbHome: "Home",
    breadcrumbSolutions: "Solutions",
    breadcrumbCurrent: "Sports Academies",
  },
  hero: {
    eyebrow: "Sports Academies",
    title: "Development is a programme, not a timetable.",
    subtitle:
      "Programs, athletes, guardians, coaches, attendance, subscriptions and payments in one rhythm — so development evidence survives the season it was collected in.",
    primaryCta: "Book a demo",
    secondaryCta: "See pricing",
    imageAlt:
      "A training ground at misty dawn — cones, ladders and hurdles laid out in exact rows across the grass, sunrise breaking behind the treeline",
    snapshot: {
      label: "What this looks like",
      stats: [
        { label: "Programs", value: "31" },
        { label: "Sessions per week", value: "412" },
        { label: "Attendance marked", value: "97%" },
      ],
    },
  },
  painPoints: {
    title: "What a term actually loses.",
    subtitle: "Programmes run on paper registers and phone calls until the group gets too big to hold in memory. That's where the evidence starts leaking.",
    items: [
      {
        title: "Progress that doesn't travel",
        description:
          "A coach's observations live in a notebook, so trial evidence and selection decisions get retyped, or forgotten, at every stage change.",
      },
      {
        title: "Guardians who hear it last",
        description:
          "Session changes, payment due dates and attendance updates go out by phone call and word of mouth, one guardian at a time.",
      },
      {
        title: "Renewals chased by hand",
        description:
          "Term and monthly plans, sibling discounts and outstanding balances get tracked on a sheet that falls out of date the day it's opened.",
      },
    ],
  },
  capabilities: {
    title: "What sports academies actually run on.",
    subtitle: "Programs, groups and sessions with attendance, subscriptions and guardian communication attached.",
    items: [
      {
        icon: "layers",
        title: "Development programs",
        description: "Programs, groups and sessions structured by stage, not improvised each term.",
      },
      {
        icon: "squad",
        title: "Athletes",
        description: "One record per athlete, carried across groups, sports and seasons.",
      },
      {
        icon: "member",
        title: "Parents",
        description: "Guardians receive session, attendance and payment updates without a phone call.",
      },
      {
        icon: "check",
        title: "Attendance",
        description: "Marked at the session, offline-capable, and closed the same day it happened.",
      },
      {
        icon: "repeat",
        title: "Subscriptions",
        description: "Term and monthly plans that renew on the rule you set, with sibling pricing handled.",
      },
      {
        icon: "trend",
        title: "Performance",
        description: "Attendance, progression and trial evidence read together across the development pathway.",
      },
    ],
  },
  outcomes: {
    title: "One place the numbers agree.",
    subtitle: "Same definitions across every module, reconciled the same day the sessions happened.",
    stats: [
      { value: "31", label: "Programs" },
      { value: "412", label: "Sessions per week" },
      { value: "97%", label: "Attendance marked" },
      { value: "+124", label: "Members this month" },
    ],
  },
  otherSolutions: {
    title: "Organized differently? The system underneath is the same.",
  },
  cta: {
    title: "Explore SCRIPE for Sports Academies",
    subtitle: "Bring your programmes, groups and guardians into one operating rhythm — mapped with your team before you test it.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
