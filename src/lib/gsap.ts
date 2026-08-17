/**
 * Fusion motion primitive — the GSAP loader.
 *
 * GSAP is the third tier of the motion doctrine: reserved for signature
 * cinematic moments (a hero's timeline-driven entrance, a scroll-pinned
 * sequence) that CSS keyframes and Motion's `m` components can't express.
 * Everything else on the site should use CSS (`motion-utilities.css`) or
 * Motion (`LazyMotionProvider`) first — reach for GSAP only when a section
 * genuinely needs its sequencing/`ScrollTrigger` power.
 *
 * Because that need is rare, GSAP must never be part of the shared bundle:
 * `loadGsap()` is the ONLY sanctioned way to obtain `gsap`/`ScrollTrigger`
 * in this codebase. It dynamically `import()`s both, so the ~30–60kb GSAP +
 * ScrollTrigger payload only downloads on the specific pages that call it,
 * and it registers `ScrollTrigger` exactly once no matter how many sections
 * call `loadGsap()` on the same page (guarded by the module-level
 * `registered` flag below).
 *
 * Reduced-motion and SSR are both handled by returning `null` *before* the
 * dynamic `import()` runs, not after: a user with `prefers-reduced-motion:
 * reduce`, or code executing on the server, never pays for the GSAP chunk
 * at all — there's no "load it and then don't animate," the bytes simply
 * never transfer. Callers must treat `null` as "do nothing" (skip the
 * cinematic entrance, fall back to the section's static/CSS-revealed state)
 * rather than retrying or throwing.
 */

/** The `gsap` singleton's type, taken from the module itself rather than a
 *  named type export (GSAP's public API doesn't export one under a `GSAP`
 *  identifier) — this stays correct automatically if the dependency's types
 *  change shape on upgrade. */
type GsapInstance = (typeof import("gsap"))["gsap"];

/** The `ScrollTrigger` plugin class, same reasoning as {@link GsapInstance}. */
type ScrollTriggerCtor = (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];

/** Resolved value of {@link loadGsap} on success. */
export interface GsapModules {
  gsap: GsapInstance;
  ScrollTrigger: ScrollTriggerCtor;
}

/** Set once `ScrollTrigger` has been registered, so repeat `loadGsap()`
 *  calls (one per section that needs it) never re-register the plugin. */
let registered = false;

/**
 * Dynamically loads `gsap` and `gsap/ScrollTrigger`, registers the plugin
 * once, and returns both. Returns `null` WITHOUT importing anything when:
 *
 * - running server-side (`typeof window === "undefined"`) — GSAP animates
 *   the DOM, there's nothing for it to do during SSR; or
 * - the user has `prefers-reduced-motion: reduce` set — GSAP is exclusively
 *   used here for large-scale choreography (the kind reduced-motion users
 *   most want turned off), so this loader treats that preference as a hard
 *   gate rather than leaving each call site to remember to check it.
 *
 * @returns The loaded `{ gsap, ScrollTrigger }` pair, or `null` if GSAP
 *   should not run in the current environment. Callers should treat `null`
 *   as "render the static/CSS-only fallback for this moment."
 */
export async function loadGsap(): Promise<GsapModules | null> {
  if (typeof window === "undefined") {
    return null;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}
