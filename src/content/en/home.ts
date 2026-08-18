/**
 * English content for the home page — full eight-section composition.
 *
 * Every string is ported from the legacy static site's home page
 * (`backup/scripe-static/index.html`, referenced below by its `data-i18n`
 * keys) except where noted:
 *
 * - `meta` mirrors the legacy `<title>`/`<meta name="description">`.
 * - `hero` ports the `data-story` cinema hero: wordmark scene, the five
 *   chapter captions (`data-cap` 1–5), the progress-rail labels
 *   (`data-tick`), the scroll hint, and the closing scene's two CTAs.
 * - `productFamily` is the one recomposed section: the current Sports
 *   Operations OS product framing (SCRIPE Venue / Academy / Football
 *   Intelligence) presented with approved copy lines — descriptions reuse
 *   `courts-fields-pools-reservations-and-utilization`,
 *   `development-programs-coaches-parents-and-athletes-in` and
 *   `rosters-session-plans-cover-and-load-for` (the last from
 *   `backup/scripe-static/platform.html`); the heading/subtitle are composed
 *   from the same claims vocabulary, no new metrics or claims invented.
 * - all other sections port their legacy section verbatim (`#trusted`,
 *   `#platform`, `#solutions`, `#automation`, `#branches`, `.sc-cta-section`).
 *   The legacy trust strip's internal production note ("Category placeholders
 *   — replace with partner marks once approved") is intentionally dropped:
 *   it was an authoring note, not public copy.
 */
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  meta: {
    title: "SCRIPE — The Operating System for Modern Sports Organizations",
    description:
      "One connected platform for clubs, academies, venues and multi-sport organizations: members, subscriptions, reservations, payments, attendance, competitions, coaching and business intelligence.",
    breadcrumbHome: "Home",
  },
  hero: {
    wordmark: "SCRIPE",
    tagline: "The Operating System for Modern Sports Organizations",
    plateAlt:
      "Aerial view of a sports campus at golden hour — main stadium, swimming pool and training pitches in one frame",
    scrollHint: "Scroll to fly over",
    railIntro: "Intro",
    chapters: [
      {
        rail: "Clubs",
        title: "Sports Clubs",
        subtitle: "Teams, Members and the Competition Calendar",
      },
      {
        rail: "Academies",
        title: "Sports Academies",
        subtitle: "Development Programs, Parents and Coach Management",
      },
      {
        rail: "Venues",
        title: "Sports Venues",
        subtitle: "Courts, Fields and Pools booked to capacity, not chaos.",
      },
      {
        rail: "Intelligence",
        title: "Football Intelligence",
        subtitle: "Specialist Coach Management",
      },
      {
        rail: "Organization",
        title: "Multi-Sports Organization",
        subtitle: "Many Branches, Many Sports, One Operational Picture",
      },
    ],
    primaryCta: "Book a demo",
    secondaryCta: "Talk to sales",
  },
  trusted: {
    title: "Trusted by modern sports organizations",
    subtitle: "One platform for clubs, academies, venues and multi-sport organizations.",
    categories: [
      "Football Clubs",
      "Sports Academies",
      "Padel Clubs",
      "Swimming Academies",
      "Sports Venues",
    ],
  },
  productFamily: {
    title: "Three products. One operating system.",
    subtitle:
      "Every product runs on the same connected record. Start where your organization actually sits — nothing gets re-entered or reconciled twice.",
    products: [
      {
        name: "Venue",
        tagline: "Facility operations & booking",
        description: "Courts, fields, pools, reservations and utilization.",
        cta: "Explore Sports Venues",
        href: "/solutions/sports-venues",
        accent: "venue",
      },
      {
        name: "Academy",
        tagline: "Multi-sport academy operations",
        description: "Development programs, coaches, parents and athletes in one rhythm.",
        cta: "Explore Sports Academies",
        href: "/solutions/sports-academies",
        accent: "academy",
      },
      {
        name: "Football Intelligence",
        tagline: "Football-specific coach intelligence",
        description:
          "Rosters, session plans, cover and load — for the people who actually run the sessions.",
        cta: "Explore the platform",
        href: "/platform",
        accent: "fi",
      },
    ],
  },
  platform: {
    label: "Platform",
    title: "Everything your sports organization needs. One operating system.",
    subtitle:
      "SCRIPE brings memberships, reservations, payments, coaching, competitions, communication and business intelligence into one connected platform.",
    primaryCta: "Explore the platform",
    secondaryCta: "Book a demo",
    board: {
      title: "Today · Tuesday",
      badge: "Product evidence",
      rows: [
        {
          time: "16:30",
          activity: "U12 · Technical block",
          detail: "Pitch 2 · 90 min",
          owner: "A. Haddad",
          status: "Confirmed",
          tone: "positive",
        },
        {
          time: "17:00",
          activity: "U14 · Small-sided",
          detail: "Five-a-side · 60 min",
          owner: "M. Osman",
          status: "In session",
          tone: "live",
        },
        {
          time: "17:30",
          activity: "Swim squad · Lanes 3–5",
          detail: "Olympic pool · 75 min",
          owner: "L. Farah",
          status: "Confirmed",
          tone: "positive",
        },
        {
          time: "18:00",
          activity: "Padel · Court 1",
          detail: "Member booking · 90 min",
          owner: "Reception",
          status: "Paid",
          tone: "positive",
        },
        {
          time: "18:45",
          activity: "U16 · Position trials",
          detail: "Main stadium · 120 min",
          owner: "K. Nasser",
          status: "Needs coach",
          tone: "attention",
        },
      ],
    },
    modules: [
      { name: "Members", accent: "academy" },
      { name: "Subscriptions", accent: "club" },
      { name: "Reservations", accent: "venue" },
      { name: "Payments", accent: "lime" },
      { name: "Attendance", accent: "academy" },
      { name: "Competitions", accent: "club" },
      { name: "Coach management", accent: "fi" },
      { name: "Reports", accent: "venue" },
    ],
    deepLink: "See all 13 capabilities on the platform page",
  },
  solutions: {
    title: "Four ways sport is organized. One system underneath.",
    subtitle: "Pick the shape that matches your organization — the record underneath is the same.",
    items: [
      {
        title: "Sports Clubs",
        description: "Teams, members, competitions and club operations from one place.",
        cta: "Explore Sports Clubs",
        href: "/solutions/sports-clubs",
        accent: "club",
      },
      {
        title: "Sports Academies",
        description: "Development programs, coaches, parents and athletes in one rhythm.",
        cta: "Explore Sports Academies",
        href: "/solutions/sports-academies",
        accent: "academy",
      },
      {
        title: "Sports Venues",
        description: "Courts, fields, pools, reservations and utilization.",
        cta: "Explore Sports Venues",
        href: "/solutions/sports-venues",
        accent: "venue",
      },
      {
        title: "Multi-Sports Organizations",
        description: "Multiple branches, multiple sports, one operational picture.",
        cta: "Explore Multi-Sports Organizations",
        href: "/solutions/multi-sports-organizations",
        accent: "fi",
      },
    ],
    compareCta: "Compare all four solutions",
  },
  automation: {
    title: "Your operations should run themselves.",
    subtitle:
      "One booking sets off the whole chain — reservation, payment, roster, reminder, attendance, report.",
    steps: [
      { title: "Member books training", caption: "From the member app or reception." },
      { title: "Reservation confirmed", caption: "Surface, coach and time held at once." },
      { title: "Payment recorded", caption: "Charged on the rule that fits the slot." },
      { title: "Coach notified", caption: "Roster and session plan on the phone." },
      { title: "Attendance tracked", caption: "Marked pitchside, offline if needed." },
      { title: "Dashboard updated", caption: "Reconciled and reportable the same day." },
    ],
    deepLink: "See the automation and notification modules",
  },
  branches: {
    title: "One organization. Every branch. One operational picture.",
    subtitle:
      "Each branch keeps its own timetable and staff. Group reporting reads across all of them without duplicate records.",
    chips: [
      { name: "Cairo", accent: "fi" },
      { name: "Maadi", accent: "venue" },
      { name: "Nasr City", accent: "academy" },
      { name: "Alexandria", accent: "club" },
    ],
    orgLabel: "One organization",
    pictureLabel: "One operational picture",
    deepLink: "Explore SCRIPE for multi-sports organizations",
  },
  closing: {
    title: "Ready to run your sports organization differently?",
    subtitle:
      "Bring your teams, members, venues, coaches and operations together in one powerful platform.",
    primaryCta: "Book a Demo",
    secondaryCta: "Start Free Trial",
    pricingLink: "See pricing",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
