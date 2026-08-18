/**
 * CapabilityIcon — the stroke glyph for one capability tile in a solution
 * page's capabilities grid, keyed by the icon id each
 * `SolutionCapability["icon"]` content field names.
 *
 * Every path below is ported from (or, for `pitch` and `hub`, drawn to
 * match the stroke weight and corner radius of) the icon set
 * `backup/scripe-static/solutions/*.html`'s own "focus" grid already used —
 * the same vocabulary `src/components/sections/platform/ModuleRow.tsx` and
 * `src/components/sections/home/SolutionsGrid.tsx` draw their own icons
 * from, so a capability tile reads as the same icon language as the rest of
 * the site, not a bespoke set invented for this page. Unknown keys fall
 * back to `check` rather than rendering nothing, so a content typo never
 * produces a blank tile.
 *
 * A Server Component — no hooks.
 */

const ICON_PATHS: Record<string, React.ReactNode> = {
  /** Teams and squads (Clubs); Athletes (Academies) — "users". */
  squad: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  /** Members (Clubs); Parents (Academies) — "user-plus". */
  member: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </>
  ),
  /** Competition calendar (Clubs) — "trophy". */
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
  /** Attendance (Clubs, Academies) — "check-square". */
  check: (
    <>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  /** Payments (Clubs, Venues) — "credit-card". */
  card: (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  /** Coaches (Clubs) — "clipboard-list". */
  badge: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </>
  ),
  /** Development programs (Academies) — "layers". */
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  /** Subscriptions (Academies) — "repeat". */
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  /** Performance (Academies); Utilization (Venues) — "trending-up". */
  trend: (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  /** Courts (Venues) — "map-pin". */
  pin: (
    <>
      <circle cx="12" cy="10" r="3" />
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    </>
  ),
  /** Fields (Venues) — a top-down pitch diagram (center line + kick-off circle). */
  pitch: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M12 4v16" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  /** Reservations (Venues) — "calendar-check". */
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  /** Availability (Venues) — "clock". */
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  /** Multiple branches (Multi-sport) — "git-branch". */
  branches: (
    <>
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M6 3v12" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  /** Centralized operations (Multi-sport) — a radiating hub. */
  hub: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.22 4.22l2.83 2.83" />
      <path d="M16.95 16.95l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.22 19.78l2.83-2.83" />
      <path d="M16.95 7.05l2.83-2.83" />
    </>
  ),
  /** Combined KPIs (Multi-sport) — "bar-chart". */
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  /** Branch management (Multi-sport) — "building-2". */
  building: (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </>
  ),
  /** Permissions (Multi-sport) — "lock". */
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  /** Reporting (Multi-sport) — "file-text". */
  document: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
};

export interface CapabilityIconProps {
  /** Icon id (a {@link SolutionCapability}'s `icon` field). */
  icon: string;
  /** Merged onto the outer bordered tile. */
  className?: string;
}

/**
 * Renders a bordered tile holding the capability's stroke glyph.
 *
 * @param props - See {@link CapabilityIconProps}.
 */
export function CapabilityIcon({ icon, className }: CapabilityIconProps) {
  return (
    <span
      className={`border-border-subtle grid size-9 shrink-0 place-items-center rounded-md border ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICON_PATHS[icon] ?? ICON_PATHS.check}
      </svg>
    </span>
  );
}
