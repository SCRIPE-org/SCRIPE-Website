"use client";

/**
 * HeroArmedPlate — conditional-mount wrapper for the Camera-Hero's
 * armed-only plate images (midground, finale, foreground).
 *
 * Reads `src/lib/hero-armed-store.ts`'s external store and renders its
 * `next/image` ONLY while the hero is armed; otherwise renders `null`. This
 * is a genuine unmount, not a CSS hide — the underlying `<img>` (and its
 * network request) does not exist in the DOM at all until `HeroDirector`
 * flips the store, which never happens under `prefers-reduced-motion:
 * reduce`, on the server, or before hydration. See the store's own header
 * for why a CSS-only `display: none` wrapper (still present here, on the
 * always-rendered parent `<div>` in `Hero.tsx`, for GSAP's selector-based
 * tweens and layout) was not enough on its own.
 *
 * `loading="lazy"` + `fetchPriority="low"` are kept even though the mount
 * itself already gates the fetch: belt-and-braces so that if the hero is
 * armed while still off-screen (a fast-scrolling keyboard user tabbing past
 * it), this plate never contends with in-viewport, higher-priority
 * requests.
 */
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { getHeroArmedServerSnapshot, getHeroArmedSnapshot, subscribeHeroArmed } from "@/lib/hero-armed-store";

export interface HeroArmedPlateProps {
  /** The plate photograph's path under `public/`. */
  src: string;
}

/**
 * Renders the plate's `next/image` once armed, `null` before that.
 *
 * @param props - See {@link HeroArmedPlateProps}.
 */
export function HeroArmedPlate({ src }: HeroArmedPlateProps) {
  const armed = useSyncExternalStore(subscribeHeroArmed, getHeroArmedSnapshot, getHeroArmedServerSnapshot);

  if (!armed) return null;

  return (
    <Image src={src} alt="" fill sizes="100vw" className="object-cover" loading="lazy" fetchPriority="low" />
  );
}
