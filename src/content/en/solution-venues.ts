/**
 * English content for the Sports Venues solution page (`/solutions/sports-venues`).
 *
 * Ported from `backup/scripe-static/solutions/sports-venues.html`: hero,
 * "focus" capability grid and "numbers" KPI strip ported near-verbatim,
 * trimmed to a curated six capabilities (the legacy page's own nine, minus
 * Pools, Peak hours and Venue operations — Pools/Peak hours are folded into
 * Fields/Utilization's own descriptions rather than repeated as separate
 * tiles, and Venue operations is the least differentiated of the nine).
 * `painPoints` is new structure — see `SolutionContent`'s doc comment in
 * `src/content/types.ts`; its three items are composed from the legacy
 * hero's own "booked to capacity, not chaos" framing and the operating-day
 * section's copy, not new claims.
 */
import type { SolutionContent } from "../types";

export const solutionVenuesContent: SolutionContent = {
  meta: {
    title: "Sports Venues",
    description:
      "SCRIPE for sports venues: courts, fields, pools, reservations, availability, payments, utilization and peak-hour demand on one grid.",
    breadcrumbHome: "Home",
    breadcrumbSolutions: "Solutions",
    breadcrumbCurrent: "Sports Venues",
  },
  hero: {
    eyebrow: "Sports Venues",
    title: "Booked to capacity, not to chaos.",
    subtitle:
      "Courts, fields and pools with real availability, one-off and recurring reservations, pricing rules, payments and the utilization numbers that decide the next season.",
    primaryCta: "Book a demo",
    secondaryCta: "See pricing",
    imageAlt:
      "Four padel courts seen from directly above at night — one lit with two players mid-rally, the other three dark but fully marked out",
    snapshot: {
      label: "What this looks like",
      stats: [
        { label: "Surfaces", value: "9" },
        { label: "Bookings this week", value: "268" },
        { label: "Utilization", value: "92%" },
      ],
    },
  },
  painPoints: {
    title: "What the wall planner doesn't show.",
    subtitle: "Every venue hits the same ceiling once bookings outgrow a whiteboard: what's actually free right now, and which hours are worth selling harder.",
    items: [
      {
        title: "Availability, by phone call",
        description:
          "What's actually free right now isn't what the wall planner says this morning — so reception confirms it by walking over and checking.",
      },
      {
        title: "Held slots that never release",
        description:
          "A reservation held against an unpaid booking blocks the surface indefinitely, instead of freeing itself when payment doesn't land.",
      },
      {
        title: "Peak hours nobody has priced",
        description:
          "Demand shifts by hour and by sport across a season, but without a utilization number attached, unsold capacity stays invisible until it's gone.",
      },
    ],
  },
  capabilities: {
    title: "What sports venues actually run on.",
    subtitle: "Availability, one-off and recurring booking, pricing rules, check-in and peak-hour utilization.",
    items: [
      {
        icon: "pin",
        title: "Courts",
        description: "Glass courts, indoor halls and outdoor surfaces with their own rules and pricing.",
      },
      {
        icon: "pitch",
        title: "Fields",
        description: "Eleven-a-side, five-a-side, training pitches and pool lanes held with the coach and the slot together.",
      },
      {
        icon: "calendar",
        title: "Reservations",
        description: "One-off and recurring bookings that survive a fixture clash or a maintenance window.",
      },
      {
        icon: "clock",
        title: "Availability",
        description: "What is actually free right now — not what the wall planner said this morning.",
      },
      {
        icon: "card",
        title: "Payments",
        description: "Held slots release when payment does not land; paid slots reconcile the same day.",
      },
      {
        icon: "trend",
        title: "Utilization",
        description: "Surface-by-surface utilization and peak-hour demand, so unsold capacity surfaces while it can still be sold.",
      },
    ],
  },
  outcomes: {
    title: "One place the numbers agree.",
    subtitle: "Same definitions across every module, reconciled the same day the sessions happened.",
    stats: [
      { value: "9", label: "Surfaces" },
      { value: "268", label: "Bookings this week" },
      { value: "92%", label: "Utilization" },
      { value: "+18%", label: "Peak-hour demand" },
    ],
  },
  otherSolutions: {
    title: "Organized differently? The system underneath is the same.",
  },
  cta: {
    title: "Explore SCRIPE for Sports Venues",
    subtitle: "Put every court, field and pool on one grid — and see the peak hours you are currently selling by hand.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
