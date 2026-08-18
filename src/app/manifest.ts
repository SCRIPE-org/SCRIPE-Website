/**
 * Web app manifest (`manifest.webmanifest`).
 *
 * Minimal PWA metadata — SCRIPE's public site is not an installable app
 * today, but a manifest still improves the "Add to Home Screen"/mobile tab
 * presentation and is a standard SEO/PWA-readiness check. Only references
 * the SVG brand mark that actually exists at `public/brand/` (copied from
 * `backup/scripe-static/assets/brand/`); do not add PNG icon entries until
 * real rasterized icon assets are produced — an icon entry pointing at a
 * non-existent file is worse than no manifest at all.
 */
import type { MetadataRoute } from "next";

/**
 * Builds the site's web app manifest.
 *
 * @returns Manifest fields: name/description, obsidian theme + background
 *   color (matches `<meta name="theme-color">` in
 *   `src/app/[locale]/layout.tsx`), standalone display, and the single SVG
 *   brand icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SCRIPE",
    short_name: "SCRIPE",
    description: "The Operating System for Modern Sports Organizations.",
    start_url: "/",
    display: "standalone",
    theme_color: "#0B0B0E",
    background_color: "#0B0B0E",
    icons: [
      {
        src: "/brand/scripe-logo-dark.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
