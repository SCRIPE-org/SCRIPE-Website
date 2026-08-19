"use client";

/**
 * HeroChapterPlate — conditional-mount wrapper for one corner chapter's
 * establishing photograph.
 *
 * The sibling of `HeroArmedPlate.tsx` (which does the same job for the
 * midground/finale/foreground `<Image>` plates) with two differences, both
 * forced by what a chapter still has to do:
 *
 * 1. IT RENDERS A `background-image`, NOT AN IMAGE ELEMENT. The stills are
 *    art-directed per viewport shape — a 21:9 frame shown on a phone is 17%
 *    of itself, so `home.css` §2c swaps in a 3:4 window of the same
 *    photograph under `@media (max-aspect-ratio: 3 / 4)`. `next/image` can
 *    negotiate a WIDTH but not a CROP, and a picture element would need its
 *    own source set duplicated here rather than sitting beside the other
 *    plate URLs in the stylesheet. A CSS background resolves exactly one URL
 *    per viewport shape, from the same place §2's base plate is authored.
 *
 * 2. IT GATES ON THREE THINGS, NOT TWO. Armed and dark theme, as the other
 *    plates do — plus `hero-reach-store.ts`'s per-chapter threshold, so the
 *    three stills mount one at a time as the flight approaches each beat.
 *    A reader who arms the hero and never scrolls past the intro downloads
 *    none of them; one who stops after chapter 01 downloads one.
 *
 * The gate is a real unmount, not a CSS hide, for the reason
 * `hero-armed-store.ts` sets out at length: the project's contract is that
 * bytes are withheld by the absence of the element, never by a stylesheet
 * rule about it. (Browsers do skip `background-image` fetches for
 * `display: none` subtrees, where a source-carrying image element is fetched
 * regardless — but that is an observed behaviour to benefit from, not the
 * thing being relied on.)
 *
 * THEME. `nightOnly` is not a prop here because there is no other option:
 * all three delivered chapter stills are night frames (catalog §1, P5/P6/P7)
 * and no day set exists. In light theme the flight keeps the single
 * golden-hour plate and its three camera moves — the same shape the hero had
 * before this component existed. Documented in `Hero.tsx`'s header as the
 * one place the day film is knowingly a step behind the night one.
 */
import { useSyncExternalStore } from "react";
import { getHeroArmedServerSnapshot, getHeroArmedSnapshot, subscribeHeroArmed } from "@/lib/hero-armed-store";
import { getHeroReachServerSnapshot, getHeroReachSnapshot, subscribeHeroReach } from "@/lib/hero-reach-store";
import { getThemeServerSnapshot, getThemeSnapshot, subscribeTheme } from "@/lib/theme-mode-store";

export interface HeroChapterPlateProps {
  /** Zero-based corner chapter index (0 = CLUBS, 1 = VENUES,
   *  2 = INTELLIGENCE). Selects both the photograph — via
   *  `.hero-chapter-film[data-chapter]` in `home.css` §2 — and the reach
   *  threshold this plate waits for. */
  index: number;
}

/**
 * Renders the chapter's photograph once the flight is armed, the theme is
 * dark, and the camera has reached this chapter; `null` otherwise.
 *
 * @param props - See {@link HeroChapterPlateProps}.
 */
export function HeroChapterPlate({ index }: HeroChapterPlateProps) {
  const armed = useSyncExternalStore(subscribeHeroArmed, getHeroArmedSnapshot, getHeroArmedServerSnapshot);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const reach = useSyncExternalStore(subscribeHeroReach, getHeroReachSnapshot, getHeroReachServerSnapshot);

  if (!armed || theme !== "dark" || reach < index) return null;

  return <div className="hero-chapter-film" data-chapter={index} />;
}
