/**
 * Accent-identity class map for the resources page's product reference grid.
 *
 * A page-scoped copy of `src/components/sections/platform/accents.ts`'s
 * contract (kept separate rather than imported cross-page, per this
 * codebase's established "self-contained page folder" convention): content
 * files store only an `AccentId`; this map translates it to the semantic
 * Tailwind utility wired in `src/app/globals.css`, so both themes are
 * correct by construction and no section ever hardcodes a hex value.
 */
import type { AccentId } from "@/content/types";

/** Foreground utility for a module glyph's accent color. */
export const ACCENT_TEXT_CLASS: Record<AccentId, string> = {
  academy: "text-accent-academy",
  venue: "text-accent-venue",
  fi: "text-accent-fi",
  club: "text-accent-club",
  lime: "text-accent-text",
};
