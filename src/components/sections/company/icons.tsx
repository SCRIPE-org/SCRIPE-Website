/**
 * Stroke icons for the company page's operating-principles grid, keyed by
 * each {@link CompanyPrinciple}'s own `id`.
 *
 * Every path is ported verbatim from `backup/scripe-static/company.html`'s
 * "How we build" section — the same vocabulary
 * `src/components/sections/resources/icons.tsx` and
 * `src/components/sections/solutions/CapabilityIcon.tsx` each keep their own
 * self-contained copy of, per this codebase's established "self-contained
 * page folder" convention. Unknown ids fall back to a generic dot glyph
 * rather than rendering nothing, so a content typo never produces a blank
 * tile.
 *
 * A Server Component — no hooks.
 */
import type { CompanyPrinciple } from "@/content/types";

/** One glyph per {@link CompanyPrinciple.id}. */
const PRINCIPLE_ICON_PATHS: Record<string, React.ReactNode> = {
  /** Sports operations — "activity" (a pulse line). */
  operations: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
  /** One connected record — "layers". */
  record: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  /** Multi-sport by default — "globe". */
  "multi-sport": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20" />
      <path d="M12 2a14.5 14.5 0 0 1 0 20" />
      <path d="M2 12h20" />
    </>
  ),
  /** Technology that stays out of the way — "shield-check". */
  technology: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

/** Fallback glyph for an unrecognized principle id — a plain dot. */
const FALLBACK_PRINCIPLE_ICON = <circle cx="12" cy="12" r="3" />;

export interface PrincipleIconProps {
  /** A {@link CompanyPrinciple}'s `id` (e.g. `"operations"`). */
  id: string;
}

/** Renders one operating principle's stroke glyph. */
export function PrincipleIcon({ id }: PrincipleIconProps) {
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
      {PRINCIPLE_ICON_PATHS[id] ?? FALLBACK_PRINCIPLE_ICON}
    </svg>
  );
}
