/**
 * Accent-identity class maps shared by the pricing page sections.
 *
 * A page-scoped copy of `src/components/sections/platform/accents.ts`'s
 * contract (kept separate rather than imported cross-page, so each page's
 * section folder stays self-contained): content files
 * (`src/content/{en,ar}/pricing.ts`) store only an `AccentId` per plan —
 * mirroring the legacy static page's own per-tier marker-dot colors, not a
 * claim about which SCRIPE product world a plan belongs to — and these maps
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
