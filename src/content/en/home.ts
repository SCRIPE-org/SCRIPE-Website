/**
 * English content for the home page (hero section skeleton — Task 7 scope).
 *
 * Ported verbatim from the legacy static site's home page hero: see
 * backup/scripe-static/index.html, the `data-story` cinema hero block,
 * specifically its closing scene (`data-cap="5"`) — the only hero scene
 * that pairs a headline/subtitle with both hero CTAs in the source markup.
 * Source `data-i18n` keys: "multi-sports-organization",
 * "many-branches-many-sports-one-operational-picture", "book-a-demo-a83d",
 * "talk-to-sales". The "SCRIPE" eyebrow is the hero's own `<h1>` wordmark
 * (the "Intro" scene, `data-cap="0"`).
 */
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "SCRIPE",
    title: "Multi-Sports Organization",
    subtitle: "Many Branches, Many Sports, One Operational Picture",
    primaryCta: "Book a demo",
    secondaryCta: "Talk to sales",
  },
};
