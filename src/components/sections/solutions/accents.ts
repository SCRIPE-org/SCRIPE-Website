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
import type { CardAccent } from "@/components/ui/Card";

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

/**
 * Narrows the five-value `AccentId` down to `Card`'s four-value
 * `CardAccent` for `HubGrid`/`OtherSolutions`'s cards. `"lime"` — the one
 * member `AccentId` carries that `CardAccent` doesn't — is the brand accent
 * itself, never a product-world identity, and no solutions-hub card
 * (`src/content/{en,ar}/solutions.ts`) ever assigns it; an exhaustive switch
 * narrows type-safely instead of an unchecked `as CardAccent` cast that
 * would silently accept a `"lime"` value `Card` has no border class for.
 *
 * @param accent - The solution card's accent identity.
 * @returns The equivalent `CardAccent`.
 */
export function toCardAccent(accent: AccentId): CardAccent {
  switch (accent) {
    case "academy":
    case "venue":
    case "fi":
    case "club":
      return accent;
    case "lime":
      return "club";
  }
}
