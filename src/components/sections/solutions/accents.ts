/**
 * Accent-identity class maps shared by the solutions hub and solution-page
 * template sections.
 *
 * A page-scoped copy of `src/components/sections/home/accents.ts`'s
 * contract (kept separate rather than imported cross-page, per that file's
 * own header). Content/registry data store only an `AccentId`; these maps
 * translate it to the semantic Tailwind utilities wired in
 * `src/app/globals.css`, so both themes are correct by construction and no
 * section ever hardcodes a hex value.
 */
import type { AccentId } from "@/content/types";

/** Background utility for small accent marker dots. */
export const ACCENT_DOT_CLASS: Record<AccentId, string> = {
  academy: "bg-accent-academy",
  venue: "bg-accent-venue",
  fi: "bg-accent-fi",
  club: "bg-accent-club",
  lime: "bg-accent",
};

/** Foreground utility for accent-colored text/icons. */
export const ACCENT_TEXT_CLASS: Record<AccentId, string> = {
  academy: "text-accent-academy",
  venue: "text-accent-venue",
  fi: "text-accent-fi",
  club: "text-accent-club",
  lime: "text-accent-text",
};

/** Border utility for accent-colored rules/edges. */
export const ACCENT_BORDER_CLASS: Record<AccentId, string> = {
  academy: "border-accent-academy",
  venue: "border-accent-venue",
  fi: "border-accent-fi",
  club: "border-accent-club",
  lime: "border-accent",
};

/**
 * Inline CSS-variable value for `--sol-accent`, the hover-wash/underline
 * color a few solution-template elements read (see `src/styles/solutions.css`).
 */
export const ACCENT_VAR: Record<AccentId, string> = {
  academy: "var(--accent-academy)",
  venue: "var(--accent-venue)",
  fi: "var(--accent-fi)",
  club: "var(--accent-club)",
  lime: "var(--accent)",
};
