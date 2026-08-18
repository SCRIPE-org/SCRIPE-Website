/**
 * English content for the Multi-Sports Organizations solution page
 * (`/solutions/multi-sports-organizations`).
 *
 * Ported from `backup/scripe-static/solutions/multi-sports-organizations.html`:
 * hero, "focus" capability grid and "numbers" KPI strip ported near-verbatim
 * (the legacy hero's `<br/>`-broken three-line headline is composed here as
 * one plain sentence — `SolutionContent["hero"]["title"]` is plain text, and
 * the hero component's own `text-balance` rule already gives a short
 * headline like this a clean wrap without hardcoded line breaks). Capability
 * items are the legacy page's own eight, trimmed to a curated six (dropping
 * Multiple sports and Business intelligence — Multiple sports is already the
 * page's own thesis stated in the hero and dashboard's "Sports" stat, and
 * Business intelligence overlaps Combined KPIs). `painPoints` is new
 * structure — see `SolutionContent`'s doc comment in `src/content/types.ts`;
 * its three items are composed from the legacy operating-day section's own
 * "the part nobody sees" framing and the page's own KPI/branch-management
 * copy, not new claims.
 */
import type { SolutionContent } from "../types";

export const solutionMultiSportContent: SolutionContent = {
  meta: {
    title: "Multi-Sports Organizations",
    description:
      "SCRIPE for multi-sports organizations: many branches, many sports, centralized operations, combined KPIs, permissions, reporting and business intelligence.",
    breadcrumbHome: "Home",
    breadcrumbSolutions: "Solutions",
    breadcrumbCurrent: "Multi-Sports Organizations",
  },
  hero: {
    eyebrow: "Multi-Sports Organizations",
    title: "Many branches. Many sports. One operational picture.",
    subtitle:
      "Centralized operations across branches and sports: combined KPIs, branch management, scoped permissions, group reporting and the business intelligence that reads all of it together.",
    primaryCta: "Book a demo",
    secondaryCta: "See pricing",
    snapshot: {
      label: "What this looks like",
      stats: [
        { label: "Branches", value: "4" },
        { label: "Sports", value: "7" },
        { label: "One reporting line", value: "Group" },
      ],
      note: "Sample data — replaced with yours during onboarding.",
    },
  },
  painPoints: {
    title: "What the board actually asks for.",
    subtitle: "Past a second branch, the question stops being \"how did today go\" and becomes \"how did today go, everywhere\" — and that's where the exports start.",
    items: [
      {
        title: "Five exports, one deck",
        description:
          "Group revenue, membership, attendance and utilization get pulled branch by branch and reassembled by hand before anyone sees the whole picture.",
      },
      {
        title: "Permissions or duplicates",
        description:
          "Without scoped access, a branch manager either sees every other branch's numbers or gets a duplicated, disconnected copy of the system to manage their own.",
      },
      {
        title: "A new branch means a rebuild",
        description:
          "Opening, pausing or restructuring a branch drags the definitions the rest of the organization already agreed on into question.",
      },
    ],
  },
  capabilities: {
    title: "What multi-sports organizations actually run on.",
    subtitle: "Centralized operations, combined KPIs, branch management, permissions and group reporting.",
    items: [
      {
        icon: "branches",
        title: "Multiple branches",
        description: "Each branch runs its own timetable, staff and pricing, without duplicating a single member record.",
      },
      {
        icon: "hub",
        title: "Centralized operations",
        description: "One definition of a session, a member and a payment, applied everywhere.",
      },
      {
        icon: "chart",
        title: "Combined KPIs",
        description: "Group revenue, membership, attendance and utilization on one line, not five exports.",
      },
      {
        icon: "building",
        title: "Branch management",
        description: "Open, pause or restructure a branch without rebuilding the organization around it.",
      },
      {
        icon: "lock",
        title: "Permissions",
        description: "Roles scoped per branch and per module, so people see the operation they are responsible for.",
      },
      {
        icon: "document",
        title: "Reporting",
        description: "Board-level reporting built from the record rather than re-keyed into a deck.",
      },
    ],
  },
  outcomes: {
    title: "One place the numbers agree.",
    subtitle: "Same definitions across every module, reconciled the same day the sessions happened.",
    stats: [
      { value: "4", label: "Branches" },
      { value: "7", label: "Sports" },
      { value: "12,400", label: "Total members" },
      { value: "SAR 214K", label: "Group revenue" },
    ],
    note: "Sample data — indicative of a mid-size organization.",
  },
  otherSolutions: {
    title: "Organized differently? The system underneath is the same.",
  },
  cta: {
    title: "Explore SCRIPE for Multi-Sports Organizations",
    subtitle: "Bring every branch and every sport onto one reporting line — scoped, permissioned and reconciled the same day.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
    note: "Sales-assisted onboarding · typically live within one season break.",
  },
};
