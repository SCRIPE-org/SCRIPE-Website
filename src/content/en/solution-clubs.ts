/**
 * English content for the Sports Clubs solution page (`/solutions/sports-clubs`).
 *
 * Ported from `backup/scripe-static/solutions/sports-clubs.html`: hero
 * (headline, subtitle and "what this looks like" snapshot), the "focus"
 * capability grid and the "numbers" KPI strip are ported near-verbatim,
 * trimmed to a curated six capabilities (the legacy page's own eight, minus
 * the two least differentiated — Reports and Club operations, both already
 * implied by the platform-wide Reports module one click away). `painPoints`
 * is new structure this rebuild's `SolutionContent` interface introduces —
 * see that interface's doc comment in `src/content/types.ts` for why it
 * replaces the legacy "operating day" meters/board mockup rather than
 * porting it; its three items are composed from the legacy hero subtitle's
 * own "5pm question" framing and the operating-day section's own copy, not
 * new claims.
 */
import type { SolutionContent } from "../types";

export const solutionClubsContent: SolutionContent = {
  meta: {
    title: "Sports Clubs",
    description:
      "SCRIPE for sports clubs: teams, members, the competition calendar, attendance, payments, coaches and reports on one connected record.",
    breadcrumbHome: "Home",
    breadcrumbSolutions: "Solutions",
    breadcrumbCurrent: "Sports Clubs",
  },
  hero: {
    eyebrow: "Sports Clubs",
    title: "Run the club, not the spreadsheet.",
    subtitle:
      "Teams, members, the competition calendar, attendance, payments and coaches on one connected record — so the 5pm question is answered before anyone asks it.",
    primaryCta: "Book a demo",
    secondaryCta: "See pricing",
    imageAlt:
      "A floodlit pitch after rain at night — empty dugout benches, a tactics board leaning against them, and studded boot prints along the wet touchline",
    snapshot: {
      label: "What this looks like",
      stats: [
        { label: "Squads", value: "14" },
        { label: "Members", value: "1,860" },
        { label: "Fixtures this month", value: "23" },
      ],
      note: "Sample data — replaced with yours during onboarding.",
    },
  },
  painPoints: {
    title: "The questions that used to wait until 5pm.",
    subtitle: "Every club runs into the same friction once membership crosses a few hundred. SCRIPE is built around exactly this list.",
    items: [
      {
        title: "Who's actually free tonight",
        description:
          "Squad availability lives in someone's head or a group chat, so the training plan gets confirmed by asking around, not by looking anything up.",
      },
      {
        title: "Fixtures, chased not scheduled",
        description:
          "Competition dates, travel and availability sit in separate calendars, so a clash surfaces the week of the match instead of the week it was set.",
      },
      {
        title: "The books close late",
        description:
          "Match fees, subscriptions and outstanding balances get reconciled at the end of the month against a spreadsheet nobody fully trusts.",
      },
    ],
  },
  capabilities: {
    title: "What sports clubs actually run on.",
    subtitle: "Squads, membership, the competition calendar, attendance and payments on one connected record.",
    items: [
      {
        icon: "squad",
        title: "Teams and squads",
        description: "Squads by age group and sport, selected from the same member record the rest of the club reads.",
      },
      {
        icon: "member",
        title: "Members",
        description: "Profiles, guardians, documents and history that survive a change of squad, branch or season.",
      },
      {
        icon: "trophy",
        title: "Competition calendar",
        description: "Fixtures, travel and availability on the calendar coaches and guardians already follow.",
      },
      {
        icon: "check",
        title: "Attendance",
        description: "Marked pitchside in seconds, offline when the pitch has no signal, closed the same day.",
      },
      {
        icon: "card",
        title: "Payments",
        description: "Subscriptions, match fees and outstanding balances attached to the session that generated them.",
      },
      {
        icon: "badge",
        title: "Coaches",
        description: "Rosters, session plans, cover requests and weekly load for the people running the sessions.",
      },
    ],
  },
  outcomes: {
    title: "One place the numbers agree.",
    subtitle: "Same definitions across every module, reconciled the same day the sessions happened.",
    stats: [
      { value: "14", label: "Squads" },
      { value: "1,860", label: "Members" },
      { value: "23", label: "Fixtures this month" },
      { value: "97%", label: "Attendance marked" },
    ],
    note: "Sample data — indicative of a mid-size organization.",
  },
  otherSolutions: {
    title: "Organized differently? The system underneath is the same.",
  },
  cta: {
    title: "Explore SCRIPE for Sports Clubs",
    subtitle: "We map your squads, fixtures and coaching staff before the demo, so you see your own matchweek running on SCRIPE.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
