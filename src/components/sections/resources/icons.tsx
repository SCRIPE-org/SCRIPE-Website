/**
 * Stroke icons for the resources page — a guide-card glyph, an article-card
 * glyph, and one glyph per platform capability module for the product
 * reference grid, keyed by {@link ProductReadingEntry.id}.
 *
 * Every path is ported from (or, for the two card glyphs, identical to) the
 * icon set `backup/scripe-static/resources.html` already used on this exact
 * page — the same vocabulary `src/components/sections/platform/CapabilityIcon.tsx`
 * and `src/components/sections/solutions/CapabilityIcon.tsx` each keep their
 * own self-contained copy of, per this codebase's established "self-contained
 * page folder" convention (see `src/components/sections/solutions/accents.ts`'s
 * header). Unknown module ids fall back to a generic dot glyph rather than
 * rendering nothing, so a content typo never produces a blank tile.
 *
 * A Server Component — no hooks.
 */

/** One glyph per platform capability module id (`ProductReadingEntry["id"]`). */
const MODULE_ICON_PATHS: Record<string, React.ReactNode> = {
  /** Members — "users". */
  members: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  /** Subscriptions — "repeat". */
  subscriptions: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  /** Reservations — "calendar-check". */
  reservations: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  /** Payments — "credit-card". */
  payments: (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  /** Attendance — "check-square". */
  attendance: (
    <>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  /** Competitions — "trophy". */
  competitions: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
  /** Coach Management — "clipboard-list". */
  coaches: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </>
  ),
  /** Parents — "user-plus". */
  parents: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </>
  ),
  /** Notifications — "bell". */
  notifications: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  /** CRM — concentric-rings "target". */
  crm: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  /** Reports — "bar-chart". */
  reports: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  /** Analytics — "trending-up". */
  analytics: (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  /** Branches — "git-branch". */
  branches: (
    <>
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M6 3v12" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
};

/** Fallback glyph for an unrecognized module id — a plain dot. */
const FALLBACK_MODULE_ICON = <circle cx="12" cy="12" r="3" />;

/** Guide-card glyph — "book-open". */
const GUIDE_ICON = (
  <>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </>
);

/** Article-card glyph — "file-text". */
const ARTICLE_ICON = (
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </>
);

/** Shared stroke-SVG wrapper every glyph below renders through. */
function StrokeSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export interface ModuleIconProps {
  /** A {@link ProductReadingEntry}'s `id` (e.g. `"members"`). */
  id: string;
}

/** Renders one platform capability module's stroke glyph. */
export function ModuleIcon({ id }: ModuleIconProps) {
  return <StrokeSvg>{MODULE_ICON_PATHS[id] ?? FALLBACK_MODULE_ICON}</StrokeSvg>;
}

/** Renders the guide-card glyph (identical across every guide card, matching
 *  the legacy page's own single fixed icon for this section). */
export function GuideIcon() {
  return <StrokeSvg>{GUIDE_ICON}</StrokeSvg>;
}

/** Renders the article-card glyph (identical across every article card,
 *  matching the legacy page's own single fixed icon for this section). */
export function ArticleIcon() {
  return <StrokeSvg>{ARTICLE_ICON}</StrokeSvg>;
}
