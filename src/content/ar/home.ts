/**
 * Arabic content for the home page (hero section skeleton — Task 7 scope).
 *
 * Authored Arabic ported from backup/scripe-static/js/lang-ar.js, matching
 * the same hero scene as src/content/en/home.ts by the same source
 * `data-i18n` keys: "multi-sports-organization" -> "منظمة متعددة الرياضات",
 * "many-branches-many-sports-one-operational-picture" ->
 * "فروع متعددة، رياضات متعددة، صورة تشغيلية واحدة", "book-a-demo-a83d" ->
 * "احجز عرضًا توضيحيًا", "talk-to-sales" -> "تحدث إلى المبيعات". The
 * "SCRIPE" eyebrow is kept in Latin script, matching lang-ar.js's stated
 * convention of leaving Latin product names untranslated.
 */
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "SCRIPE",
    title: "منظمة متعددة الرياضات",
    subtitle: "فروع متعددة، رياضات متعددة، صورة تشغيلية واحدة",
    primaryCta: "احجز عرضًا توضيحيًا",
    secondaryCta: "تحدث إلى المبيعات",
  },
};
