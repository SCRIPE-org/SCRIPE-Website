/**
 * Active theme external store.
 *
 * A `useSyncExternalStore`-compatible reader for the `data-theme` attribute
 * that `src/theme/theme-script.ts` writes on `<html>` pre-paint and
 * `ThemeToggle.tsx` rewrites on click. Deliberately a READER, not a second
 * source of truth: the attribute on `<html>` stays the only place the theme
 * lives, so nothing here can drift out of sync with what CSS is rendering.
 *
 * Why an observer rather than an event the toggle fires: the attribute has
 * two writers (the pre-paint script and the toggle) and this store must be
 * correct for both, including the pre-paint one that runs long before any
 * React code exists. A `MutationObserver` on the one attribute is exact for
 * every writer, present and future, and costs nothing until something
 * actually mutates it.
 *
 * Why this exists at all: the home hero became theme-adaptive in Task G3 —
 * dark theme flies the night film, light theme the golden-hour day film. The
 * BASE plate swaps in pure CSS (`--hero-plate` in `src/styles/home.css`), so
 * the static/no-JS/pre-hydration frame is correct in both themes with no
 * JavaScript involved at all. But the day film's plate SET is incomplete —
 * the owner's round-2 drop still owes a day midground, a day foreground and
 * a day finale — so the armed flight has to mount a different number of
 * parallax layers per theme. That is a mount decision, not a style decision,
 * and it can only be made on the client (a statically prerendered page has
 * no theme). `HeroArmedPlate` reads this store for exactly that, on top of
 * the armed gate it already carries (`hero-armed-store.ts`).
 *
 * `getServerSnapshot` returns `"dark"`: SCRIPE is dark-first (see
 * `theme-script.ts` — no stored choice renders dark, OS preference is never
 * consulted), so dark is both the correct SSR value and the one that
 * hydrates without a mismatch for every first-time visitor.
 */

/** The two themes `data-theme` can hold. */
export type ThemeMode = "dark" | "light";

/** Subscribers notified whenever `data-theme` changes value. */
const listeners = new Set<() => void>();

/** Last value read from the DOM. Cached because `getSnapshot` must return a
 *  referentially stable result between real changes — reading the attribute
 *  on every call would be fine for a string, but caching also keeps the
 *  notify path honest (listeners only fire on an actual transition). */
let current: ThemeMode = "dark";

/** The live `MutationObserver`, created on first subscribe and disconnected
 *  when the last subscriber leaves. */
let observer: MutationObserver | null = null;

/**
 * Reads the current theme straight off `<html>`.
 *
 * @returns `"dark"` only for an explicit `data-theme="dark"`; `"light"`
 *   otherwise, including a missing attribute — matching `colors.css`'s own
 *   convention, where bare `:root` (no attribute required) IS the light
 *   palette and `[data-theme="dark"]` is the override. A missing attribute
 *   is unreachable in practice: `theme-script.ts` always writes an explicit
 *   `data-theme` pre-paint, defaulting to `"dark"` (the brand default) when
 *   no choice is stored, so a real visitor's `<html>` is never without it.
 *   This fallback exists only so this reader can never disagree with the
 *   CSS it is reading, per this file's own "nothing here can drift" header.
 */
function readTheme(): ThemeMode {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * Current theme, for `useSyncExternalStore`'s `getSnapshot`.
 *
 * @returns The cached `data-theme` value.
 */
export function getThemeSnapshot(): ThemeMode {
  return current;
}

/**
 * Server/pre-hydration snapshot — always `"dark"`, the brand default.
 *
 * @returns `"dark"`, unconditionally.
 */
export function getThemeServerSnapshot(): ThemeMode {
  return "dark";
}

/**
 * Subscribes to theme changes, for `useSyncExternalStore`'s `subscribe`.
 *
 * The first subscriber both syncs the cache to the DOM (catching the
 * pre-paint script's write, which happened before any React code ran) and
 * starts the observer; the last unsubscribe tears it down.
 *
 * @param listener - Called with no arguments after every value change.
 * @returns An unsubscribe function.
 */
export function subscribeTheme(listener: () => void): () => void {
  if (listeners.size === 0) {
    current = readTheme();
    observer = new MutationObserver(() => {
      const next = readTheme();
      if (next === current) return;
      current = next;
      listeners.forEach((fn) => fn());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}
