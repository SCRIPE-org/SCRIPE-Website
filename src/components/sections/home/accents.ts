/**
 * Accent-identity class maps shared by the home page sections.
 *
 * Content files (`src/content/{en,ar}/home.ts`) store only an `AccentId`;
 * these maps translate it to the semantic Tailwind utilities wired in
 * `src/app/globals.css`, so both themes are correct by construction and no
 * section ever hardcodes a hex value. `lime` maps to the brand accent
 * tokens (`--accent` fill role / `--accent-text` foreground role); the four
 * product-world identities map to their `--accent-*` tokens.
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
 * Inline CSS-variable value for `--pf-accent`, the hover-wash color the
 * product-family rows use (see `.pf-row` in `src/styles/home.css`).
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
 * `CardAccent` for `SolutionsGrid`'s cards. `"lime"` — the one member
 * `AccentId` carries that `CardAccent` doesn't — is the brand accent itself,
 * never a product-world identity, and `HomeContent["solutions"]["items"]`
 * (see `src/content/{en,ar}/home.ts`) never assigns it to a solution card;
 * an exhaustive switch narrows type-safely instead of an unchecked
 * `as CardAccent` cast that would silently accept a `"lime"` value `Card`
 * has no border class for.
 *
 * @param accent - The solution entry's accent identity.
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
