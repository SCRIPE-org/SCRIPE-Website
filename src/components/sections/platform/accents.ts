/**
 * Accent-identity class maps shared by the platform page sections.
 *
 * A page-scoped copy of `src/components/sections/home/accents.ts`'s
 * contract (kept separate rather than imported cross-page, so each page's
 * section folder stays self-contained): content files
 * (`src/content/{en,ar}/platform.ts`) store only an `AccentId`; these maps
 * translate it to the semantic Tailwind utilities wired in
 * `src/app/globals.css`, so both themes are correct by construction and no
 * section ever hardcodes a hex value. `lime` maps to the brand accent tokens
 * (`--accent` fill role / `--accent-text` foreground role); the four
 * product-world identities map to their `--accent-*` tokens.
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
