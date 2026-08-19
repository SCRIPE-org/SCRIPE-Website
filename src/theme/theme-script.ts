import { THEME_LOCKED_TO_DARK } from "@/theme/theme-lock";

/**
 * Pre-paint theme resolution. SCRIPE's brand is dark-first: the obsidian
 * night-cinematic identity is the product, not a "mode". A stored explicit
 * choice always wins (`"light"` -> light, `"dark"` -> dark); with no stored
 * value the site renders DARK, full stop. OS `prefers-color-scheme` is
 * intentionally NOT consulted on first visit — a visitor whose system prefers
 * light must still land on the dark brand, then opt into light via the
 * toggle. Light is an explicit user choice only, never an inferred default.
 *
 * WHILE `THEME_LOCKED_TO_DARK` HOLDS the storage read is compiled out and this
 * resolves to a constant `"dark"`. It stays a pre-paint script rather than
 * being deleted because it also owns `colorScheme` and the `theme-color` meta
 * tag, and because the storage read must come back with one flag flip. See
 * `theme-lock.ts` for why the read is suppressed rather than merely ignored.
 */
export const THEME_SCRIPT = `(function(){try{
var dark=${THEME_LOCKED_TO_DARK ? "true" : 'localStorage.getItem("scripe-theme")!=="light"'};
var e=document.documentElement;
e.setAttribute("data-theme",dark?"dark":"light");
e.style.colorScheme=dark?"dark":"light";
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",dark?"#0B0B0E":"#F4F5F1");
}catch(e){}})();`;

/**
 * Pre-paint script that removes the `no-js` class from `<html>` the instant
 * JS runs. `<html>` starts with `no-js` on it (set server-side in
 * `[locale]/layout.tsx`); CSS in `src/styles/motion-utilities.css` uses
 * `.no-js [data-rv]` to force reveal-gated content fully visible whenever
 * this script never gets to run (JS disabled/blocked) — so `data-rv`
 * content is never trapped hidden with no way to reveal it. Kept as its own
 * tiny sibling script (rather than folded into `THEME_SCRIPT`) so the theme
 * and motion concerns stay independently readable/removable.
 */
export const NO_JS_SCRIPT = `document.documentElement.classList.remove("no-js");`;
