/**
 * ShapeGlyph — the stroke icon for one of the four organization "shapes"
 * (club/academy/venue/multi-sport), keyed by its {@link AccentId}.
 *
 * The exact same iconography `src/components/sections/home/SolutionsGrid.tsx`
 * uses for its own four solution cards — a deliberate sitewide echo (same
 * shape, same icon, wherever it appears: the home page's solutions grid,
 * this section family's hub grid, and every solution page's "other
 * solutions" cross-links) rather than an accidental duplication. Kept as an
 * independent copy per the established "self-contained page folder"
 * convention (see `src/components/sections/solutions/accents.ts`'s header).
 * A Server Component — no hooks.
 */
import type { AccentId } from "@/content/types";
import { ACCENT_TEXT_CLASS } from "./accents";

const SHAPE_PATHS: Record<string, React.ReactNode> = {
  club: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  academy: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </>
  ),
  venue: (
    <>
      <circle cx="12" cy="10" r="3" />
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    </>
  ),
  fi: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20" />
      <path d="M12 2a14.5 14.5 0 0 1 0 20" />
      <path d="M2 12h20" />
    </>
  ),
};

export interface ShapeGlyphProps {
  /** Which of the four organization shapes to render. */
  accent: AccentId;
  /** Merged onto the outer bordered tile. */
  className?: string;
}

/**
 * Renders a bordered accent-colored tile holding the shape's stroke glyph.
 *
 * @param props - See {@link ShapeGlyphProps}.
 */
export function ShapeGlyph({ accent, className }: ShapeGlyphProps) {
  return (
    <span
      className={`border-border-subtle grid size-10 shrink-0 place-items-center rounded-md border ${ACCENT_TEXT_CLASS[accent]} ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SHAPE_PATHS[accent] ?? SHAPE_PATHS.club}
      </svg>
    </span>
  );
}
