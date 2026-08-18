/**
 * English content for the 404 page (`[...rest]`).
 *
 * Ported verbatim from `backup/scripe-static/404.html`: status marker (404)
 * → title ("This route does not exist") → supporting sentence → button row
 * (home, platform, and four solution cards). Copy and link structure stay
 * identical to the legacy page except for two changes:
 *
 * 1. The legacy page's four solution cards use the footer-accents row
 *    (`--accent-club`, `--accent-academy`, `--accent-venue`,
 *    `--accent-football` in the HTML tiles); the new AccentId system calls
 *    football-specific operations "football intelligence" (`fi` accent) rather
 *    than standalone "football" anymore (per the master product framing in
 *    CLAUDE.md). The tile for "Multi-Sports Organizations" (legacy
 *    `--accent-football`) here carries `fi` to stay true to the current
 *    product family structure.
 *
 * 2. The legacy page's links use full URLs to the old static site
 *    (e.g., `href="solutions/sports-clubs.html"`); these now use the new
 *    Fusion routes (`/solutions/sports-clubs`, locale-less, routed through
 *    next-intl `Link`).
 */
import type { NotFoundContent } from "../types";

export const notFoundContent: NotFoundContent = {
  meta: {
    title: "Page not found",
    description: "This SCRIPE route does not exist.",
  },
  hero: {
    code: "404",
    label: "Not found",
    title: "This route does not exist.",
    subtitle:
      "The page may have moved. The platform, the four solutions, pricing and resources are all one click away.",
  },
  links: [
    {
      label: "Back to home",
      href: "/",
    },
    {
      label: "Explore the platform",
      href: "/platform",
    },
  ],
};
