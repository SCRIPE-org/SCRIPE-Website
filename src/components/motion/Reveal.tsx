"use client";

/**
 * Fusion motion primitive — Reveal.
 *
 * Wraps content that should fade + rise into place the first time it enters
 * the viewport. This is the CSS-first reveal from the motion doctrine: the
 * actual animation (opacity/transform, timing, easing, the reduced-motion
 * degrade) lives entirely in `src/styles/motion-utilities.css` as a
 * transition on `[data-rv]` / `[data-rv].rv-in`. This component's only job
 * is to add `data-rv` to its rendered element and flip on `.rv-in` once via
 * an IntersectionObserver — no JS animation library, no inline keyframes.
 *
 * Shared-observer design: a page built from these sections can easily mount
 * dozens of `Reveal`s (every card, every stat, every paragraph in a long
 * marketing page). A naive `new IntersectionObserver(...)` per instance
 * means dozens of independent observation loops for the browser to run every
 * scroll frame. Instead every `Reveal` on the page shares ONE
 * `IntersectionObserver`, keyed by a module-level `Map<Element, () =>
 * void>`: the observer's callback looks up which element fired and runs
 * that element's stored "reveal" callback. Because it's module-level (not
 * per-component-instance state), the observer and its map persist for the
 * lifetime of the page and are reused by every `Reveal` that mounts, which
 * is exactly the tradeoff we want here — cheap to create the 40th `Reveal`,
 * not just the 1st.
 *
 * One-shot: once an element reveals, it's `unobserve`d and dropped from the
 * map immediately (scrolling back up never re-hides it — reveal is an
 * entrance, not a toggle). On unmount before that happens, the effect
 * cleanup does the same unobserve + delete so neither the shared observer
 * nor the map ever holds a reference to a detached element.
 *
 * SSR-safe by construction, not by branching: the server and the pre-hydration
 * client render identical markup (`data-rv` present, `.rv-in` absent — CSS
 * alone decides the hidden state from that). `.rv-in` is added imperatively
 * via `classList` inside `useEffect`, entirely outside React's render output,
 * so there is nothing for React to reconcile and no hydration mismatch is
 * possible. If `IntersectionObserver` is unavailable (very old browser, or
 * running somewhere without DOM support), the element reveals immediately —
 * content is never trapped hidden waiting on a feature that doesn't exist.
 */
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type JSX,
  type ReactNode,
} from "react";

/** Fires when an observed element enters the viewport. */
type RevealCallback = () => void;

/** Module-level singleton — see the file header for why this is shared
 *  instead of one observer per `Reveal` instance. */
let sharedObserver: IntersectionObserver | null = null;

/** Element -> its one-shot reveal callback, for the shared observer above. */
const subscribers = new Map<Element, RevealCallback>();

/**
 * Lazily creates (once) and returns the shared reveal `IntersectionObserver`.
 * Returns `null` in any environment without `IntersectionObserver` (SSR, or
 * a browser old enough to lack it) — callers must treat `null` as "reveal
 * immediately, there's no observer to wait on."
 */
function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return null;
  }
  if (sharedObserver) {
    return sharedObserver;
  }

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const reveal = subscribers.get(entry.target);
        if (!reveal) continue;
        reveal();
        // One-shot: stop watching and forget this element as soon as it
        // has revealed once.
        sharedObserver?.unobserve(entry.target);
        subscribers.delete(entry.target);
      }
    },
    {
      threshold: 0.2,
      // Fire slightly before the element reaches the literal bottom edge of
      // the viewport so the reveal reads as "arriving," not "already stopped
      // moving before it starts."
      rootMargin: "0px 0px -10% 0px",
    },
  );
  return sharedObserver;
}

export interface RevealProps {
  /** Element/tag the reveal renders as. Defaults to `"div"`. */
  as?: keyof JSX.IntrinsicElements;
  /** Extra transition-delay in milliseconds, e.g. for hand-rolled stagger
   *  outside the CSS `data-rv-stagger` helper. Omit to use the CSS default. */
  delay?: number;
  /** Overrides the pre-reveal vertical offset (`--rv-y`) in pixels. Omit to
   *  use the CSS default (`1rem`). */
  y?: number;
  /** Merged onto the rendered element alongside the internal `data-rv`. */
  className?: string;
  children?: ReactNode;
}

/**
 * Renders `as` (default `"div"`) with `data-rv` set and an IntersectionObserver
 * subscription that adds `.rv-in` the first time the element scrolls into
 * view. See the file header for the shared-observer and SSR-safety design.
 */
export function Reveal({ as, delay, y, className, children }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = getSharedObserver();
    if (!observer) {
      // No IntersectionObserver support: reveal immediately rather than
      // leaving the element permanently at its hidden `[data-rv]` state.
      node.classList.add("rv-in");
      return;
    }

    subscribers.set(node, () => node.classList.add("rv-in"));
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      subscribers.delete(node);
    };
  }, []);

  const style: CSSProperties = {};
  if (delay !== undefined) {
    style.transitionDelay = `${delay}ms`;
  }
  if (y !== undefined) {
    (style as Record<string, string>)["--rv-y"] = `${y}px`;
  }

  return (
    <Tag ref={ref} data-rv="" className={className} style={style}>
      {children}
    </Tag>
  );
}
