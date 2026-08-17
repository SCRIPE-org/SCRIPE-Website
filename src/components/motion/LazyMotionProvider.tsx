"use client";

/**
 * Fusion motion primitive — LazyMotionProvider.
 *
 * Thin wrapper around Motion's `LazyMotion` for the "micro-interactions"
 * tier of the motion doctrine (CSS-first for reveals/choreography, Motion
 * for small interactive gestures — hover/press/drag feedback, layout
 * animations — GSAP reserved for signature cinematic moments). `features`
 * is pinned to `domAnimation` (the smaller of Motion's two bundles: covers
 * animate/exit/hover/tap/drag but not the layout-animation additions in
 * `domMax`), and `strict` is set so any `motion.div` used underneath without
 * going through the re-exported `m` below throws in development instead of
 * silently pulling in the full, un-tree-shaken animation engine.
 *
 * Deliberately NOT mounted at the root layout. Most of this site's pages
 * are static marketing sections with no micro-interactions at all — mounting
 * `LazyMotion` globally would ship its bundle (small, but not zero) to every
 * route regardless of whether that route uses `m` at all. Instead, whichever
 * section actually needs `m.*` components wraps *itself* in
 * `<LazyMotionProvider>`, so the import (and the code-split chunk behind it)
 * only loads on pages that use it. This mirrors the `loadGsap()` pattern in
 * `src/lib/gsap.ts`: motion tooling is opt-in per consumer, never ambient.
 */
import { LazyMotion, domAnimation, m } from "motion/react";
import type { ReactNode } from "react";

export interface LazyMotionProviderProps {
  children?: ReactNode;
}

/**
 * Scopes `domAnimation` to `children`. Wrap the smallest subtree that
 * actually uses `m` components — a single interactive section, not a whole
 * page — so the win from lazy-loading isn't undone by over-wrapping.
 */
export function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Re-exported so consumers import both the provider and its matching
 * animation-primitive from one place: `import { LazyMotionProvider, m }
 * from "@/components/motion/LazyMotionProvider"`. `m` components (`m.div`,
 * `m.button`, ...) only animate correctly when rendered underneath a
 * mounted `LazyMotionProvider` — using them outside one is the "strict"
 * violation mentioned above.
 */
export { m };
