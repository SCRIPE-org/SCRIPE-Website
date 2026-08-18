/**
 * Catch-all route handler for unmatched paths within `[locale]`.
 *
 * When a user navigates to any route that doesn't match a prerendered page
 * (e.g., `/foo/bar/baz` or any typo inside a valid locale path), Next.js
 * triggers this catch-all which immediately calls `notFound()` — Next.js's
 * built-in router function that renders the `not-found.tsx` file defined in
 * the same directory segment. This handler exports nothing visible; it's
 * purely a mechanism to trigger the 404 rendering chain for any unmatched
 * in-locale navigation.
 *
 * The `[...rest]` segment pattern means:
 * - Matches any path like `/en/undefined`, `/en/path/to/nothing`, etc.
 * - Does NOT match the root `[locale]` itself (e.g., `/en` still renders
 *   the index page from `[locale]/page.tsx`).
 * - Invalid locales are already caught by `[locale]/layout.tsx`'s
 *   `hasLocale()` guard before reaching this file.
 */
import { notFound } from "next/navigation";

/**
 * Catch-all page for unmatched routes — triggers the 404 handler.
 * @param props - Route params (ignored; we only need to trigger notFound()).
 */
export default function CatchAll() {
  notFound();
}
