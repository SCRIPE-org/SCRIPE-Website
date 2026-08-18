/**
 * Home hero "armed" external store.
 *
 * A minimal `useSyncExternalStore`-compatible store (subscribe/getSnapshot/
 * getServerSnapshot) holding one boolean: whether `HeroDirector` has armed
 * the Camera-Hero's cinematic flight (see that file's header for the arming
 * contract — `loadGsap()` resolved, not `prefers-reduced-motion`, not
 * server-side, and the late-arming scroll guard passed).
 *
 * Why this exists: the hero's midground/finale/foreground plates
 * (`public/media/hero/plate-{midground,finale,foreground}.png`) are
 * armed-only decoration — CSS hides their wrapper `<div>`s with
 * `display: none` until `[data-armed]` is set. `display: none` does NOT
 * stop a browser from fetching an `<img>`'s resource, though: the HTML
 * parser queues the request the moment it sees `src` on the element,
 * independent of how the stylesheet later renders it. Rendering those three
 * `next/image` calls unconditionally in `Hero.tsx` (a Server Component, so
 * they are always present in the initial HTML) therefore downloaded all
 * three plates on EVERY load, including no-JS and `prefers-reduced-motion:
 * reduce` sessions that never arm and never need them — verified spend: the
 * three plates never fetched under reduced motion once gated on this store.
 *
 * The fix is conditional MOUNTING, not just conditional CSS: `HeroArmedPlate`
 * (the only reader) renders its `<Image>` exclusively while this store's
 * snapshot is `true`, so the `<img>` (and therefore its network request)
 * simply does not exist in the DOM until the hero is actually armed.
 * `HeroDirector` (the only writer) flips the flag in lockstep with its own
 * `data-armed` attribute toggle, so "CSS says visible" and "image is
 * mounted" can never disagree.
 *
 * A plain module-level singleton (not React Context) is enough: there is
 * exactly one Camera-Hero per page, so there is nothing to key state by.
 */

/** Client-side armed flag. Starts `false` — the SSR/pre-hydration/no-JS/
 *  reduced-motion default, and the only value `HeroDirector` ever needs to
 *  flip away from on a real arm. */
let armed = false;

/** Subscribers notified on every {@link setHeroArmed} call that actually
 *  changes the flag. */
const listeners = new Set<() => void>();

/**
 * Sets the hero's armed flag and notifies subscribers if the value changed.
 * Called by `HeroDirector` only: `true` right after it sets `data-armed` on
 * the hero root, `false` in its cleanup (alongside removing the attribute).
 *
 * @param value - The new armed state.
 */
export function setHeroArmed(value: boolean): void {
  if (armed === value) return;
  armed = value;
  listeners.forEach((listener) => listener());
}

/**
 * Current armed flag, for `useSyncExternalStore`'s `getSnapshot`.
 *
 * @returns Whether the hero is currently armed.
 */
export function getHeroArmedSnapshot(): boolean {
  return armed;
}

/**
 * Server/pre-hydration snapshot for `useSyncExternalStore`'s
 * `getServerSnapshot` — always `false`: the hero is never armed during SSR.
 *
 * @returns `false`, unconditionally.
 */
export function getHeroArmedServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribes to armed-flag changes, for `useSyncExternalStore`'s
 * `subscribe`.
 *
 * @param listener - Called with no arguments after every value change.
 * @returns An unsubscribe function.
 */
export function subscribeHeroArmed(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
