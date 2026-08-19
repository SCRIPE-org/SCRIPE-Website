/**
 * THEMING IS DEFERRED — the site ships dark-only.
 *
 * SCRIPE's identity is the obsidian night-cinematic film; light was always
 * the second theme rather than a peer. It is designed and it works (the
 * Elevation Wave built it properly — light hero identity, sections, pricing
 * and nav all scored in the 84–98 band), but it is not finished to the
 * standard the dark film reached, and two known gaps are art-direction
 * decisions rather than code:
 *
 *   1. The hero's three chapter photographs are night frames only. In light
 *      theme the flight has no chapter stills at all, so the day film is
 *      structurally a step behind the night one.
 *   2. The day base plate is a DIFFERENT FACILITY than the night plate, so
 *      switching theme silently relocates the campus.
 *
 * Rather than ship a second theme that is visibly the lesser one, the toggle
 * is withdrawn and dark is forced until those are closed.
 *
 * WHAT THIS FLAG DOES, AND WHAT IT DELIBERATELY DOES NOT DO
 * --------------------------------------------------------------------------
 * It is a lock, not a demolition. Every light-theme token, selector and
 * component survives untouched in `src/styles/` and `ThemeToggle.tsx` still
 * exists and still works — nothing has to be rebuilt when theming resumes.
 * Three consumers read this flag and only three:
 *
 *   - `theme-script.ts`  — the pre-paint resolver stops consulting storage
 *   - `ThemeGuard.tsx`   — the re-assert stops consulting storage
 *   - `NavBar.tsx`       — the toggle is not rendered, desktop or mobile
 *
 * Both storage readers are locked on purpose. A visitor who chose light
 * BEFORE this shipped still has `scripe-theme: "light"` in their browser, and
 * a lock that only hid the button would leave exactly those people on the
 * half-finished theme with no way back. Forcing at both read sites means the
 * stored value is ignored while the lock holds and honoured again the moment
 * it lifts — so nobody's preference is destroyed, only suspended.
 *
 * TO RESUME THEMING: set this to `false`. That is the whole procedure — the
 * toggle returns, both resolvers consult storage again, and any preference a
 * visitor set before the lock is still there to be read.
 */
export const THEME_LOCKED_TO_DARK = true;

/** The theme the lock pins to, and the brand default when it lifts. */
export const LOCKED_THEME = "dark" as const;
