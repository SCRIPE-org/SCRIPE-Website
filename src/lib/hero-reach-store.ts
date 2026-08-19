/**
 * Home hero "flight reach" external store.
 *
 * The second half of the hero's byte-gating contract. `hero-armed-store.ts`
 * answers "is the cinematic flight running at all"; this one answers "how far
 * along it has the reader actually got", so the three chapter stills
 * (`public/media/hero/chapter-*`) can be mounted one at a time as the camera
 * approaches each beat instead of all three the moment the flight arms.
 *
 * Why a second store rather than a wider armed flag: the two gates have
 * different lifetimes. Armed is a property of the SESSION (GSAP loaded, not
 * reduced-motion, not server) and flips exactly twice. Reach is a property of
 * the SCROLL and is written from `ScrollTrigger`'s `onUpdate`, i.e. on every
 * scrubbed frame. Keeping them apart means the armed subscribers
 * (`HeroArmedPlate` ×3) never re-render on scroll, and the only components
 * that do are the three that have something to mount.
 *
 * Why it is MONOTONIC (`setHeroReach` only ever raises the value): once a
 * chapter still is in the DOM it stays there. Scrolling back up must not
 * unmount it — the photograph is already in the browser's cache, but an
 * unmount/remount cycle would re-decode it and, on a cold cache mid-scroll,
 * could re-request it. A reader scrubbing the flight back and forth should
 * pay for each plate exactly once.
 *
 * The value is the index of the furthest chapter whose plate should exist:
 * `-1` = none (the SSR / pre-hydration / no-JS / reduced-motion default, and
 * the state of an armed-but-unscrolled hero), `0` = chapter 01's plate,
 * `2` = all three. `HeroDirector` is the only writer; `HeroChapterPlate` is
 * the only reader.
 *
 * A plain module-level singleton, for the same reason `hero-armed-store.ts`
 * is one: there is exactly one Camera-Hero per page.
 */

/** Sentinel for "no chapter reached yet". */
const NONE = -1;

/** Index of the furthest chapter whose still should be mounted. */
let reach = NONE;

/** Subscribers notified whenever {@link setHeroReach} raises the value. */
const listeners = new Set<() => void>();

/**
 * Raises the reach to `value` and notifies subscribers. Ignores any value
 * that is not higher than the current one — see the file header on why this
 * is monotonic.
 *
 * @param value - Index of the chapter the flight has now reached.
 */
export function setHeroReach(value: number): void {
  if (value <= reach) return;
  reach = value;
  listeners.forEach((listener) => listener());
}

/**
 * Resets the reach to "none". Called only from `HeroDirector`'s cleanup,
 * alongside `setHeroArmed(false)`, so a re-mounted hero starts from an
 * unmounted plate set rather than inheriting the previous flight's progress.
 */
export function resetHeroReach(): void {
  if (reach === NONE) return;
  reach = NONE;
  listeners.forEach((listener) => listener());
}

/**
 * Current reach, for `useSyncExternalStore`'s `getSnapshot`.
 *
 * @returns The furthest chapter index reached, or `-1`.
 */
export function getHeroReachSnapshot(): number {
  return reach;
}

/**
 * Server/pre-hydration snapshot for `useSyncExternalStore` — always `-1`:
 * the flight has never been scrolled during SSR.
 *
 * @returns `-1`, unconditionally.
 */
export function getHeroReachServerSnapshot(): number {
  return NONE;
}

/**
 * Subscribes to reach changes, for `useSyncExternalStore`'s `subscribe`.
 *
 * @param listener - Called with no arguments after every value change.
 * @returns An unsubscribe function.
 */
export function subscribeHeroReach(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
