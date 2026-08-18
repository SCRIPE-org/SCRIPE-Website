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
 *
 * SECOND GATE (Task G3 — theme-adaptive hero): `nightOnly` adds the theme to
 * the same mount contract. The hero now flies a night film in dark theme and
 * a golden-hour day film in light, and the day set is incomplete — the
 * owner's round-2 drop still owes a day midground, a day foreground and a
 * day finale (`docs/asset-briefs/delivered-images-catalog-2026-08-19.md`
 * §2). The two plates that have no day counterpart at all (midground,
 * finale) therefore carry `nightOnly`, so in light theme they are not merely
 * hidden but never mounted, and their bytes are never spent on a film that
 * would not have used them. The foreground bokeh is shared by both films and
 * carries no flag. When the day plates arrive, each gains a `daySrc` here
 * (or its own entry) — a file swap plus one prop, not a rewrite.
 */
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { getHeroArmedServerSnapshot, getHeroArmedSnapshot, subscribeHeroArmed } from "@/lib/hero-armed-store";
import { getThemeServerSnapshot, getThemeSnapshot, subscribeTheme } from "@/lib/theme-mode-store";

export interface HeroArmedPlateProps {
  /** The plate photograph's path under `public/`. */
  src: string;
  /** When true, the plate only mounts in dark theme — for layers the day
   *  film has no counterpart for yet. Defaults to false (shared by both
   *  films). See the file header. */
  nightOnly?: boolean;
}

/**
 * Renders the plate's `next/image` once armed (and, for `nightOnly` plates,
 * only in dark theme); `null` otherwise.
 *
 * @param props - See {@link HeroArmedPlateProps}.
 */
export function HeroArmedPlate({ src, nightOnly = false }: HeroArmedPlateProps) {
  const armed = useSyncExternalStore(subscribeHeroArmed, getHeroArmedSnapshot, getHeroArmedServerSnapshot);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  if (!armed) return null;
  if (nightOnly && theme !== "dark") return null;

  return (
    <Image src={src} alt="" fill sizes="100vw" className="object-cover" loading="lazy" fetchPriority="low" />
  );
}
