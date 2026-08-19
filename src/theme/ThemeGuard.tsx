"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LOCKED_THEME, THEME_LOCKED_TO_DARK } from "@/theme/theme-lock";

const STORAGE_KEY = "scripe-theme";

/**
 * Belt-and-suspenders guard for the dark-first theme surviving locale
 * switches.
 *
 * Root cause (confirmed live): `[locale]/layout.tsx` IS the root layout — it
 * returns `<html>` — so switching locale (`LocaleSwitch`) is a client-side
 * navigation across a dynamic route segment. React re-commits the `<html>`
 * element on that transition, applying only the attributes it manages via
 * JSX props (`lang`, `dir`, `className`). `data-theme` and
 * `style.colorScheme` were only ever set imperatively, outside React's
 * props for `<html>` — once by `THEME_SCRIPT` on first paint, once by
 * `ThemeToggle` on click — so React's commit silently drops them: `<html>`
 * ends up with no `data-theme`, `colors.css`'s unprefixed `:root` (light)
 * rules take over, and the page reads as "switched to light" even though
 * `localStorage` still holds the correct explicit choice untouched. This
 * was reproduced with Playwright: after a stored-dark visitor clicks the
 * locale switch, `data-theme` goes from `"dark"` to `null` while
 * `localStorage.scripe-theme` stays `"dark"` the whole time — a pure DOM
 * desync, not a storage bug. A hard/direct navigation is unaffected because
 * `THEME_SCRIPT` re-runs on the fresh document.
 *
 * Fix: re-derive `data-theme` (and the two things that ride with it) from
 * storage every time the pathname changes — that fires on every locale
 * switch, in both directions, since `next/navigation`'s `usePathname`
 * (unlike next-intl's locale-stripped one) includes the locale segment —
 * and again on window focus, to catch any other transition that clobbers
 * the same way. Each write is guarded by a value check, so the common case
 * (nothing lost) touches the DOM zero times and never flickers.
 */
export function ThemeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    reassertTheme();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("focus", reassertTheme);
    return () => window.removeEventListener("focus", reassertTheme);
  }, []);

  return null;
}

function reassertTheme() {
  // Theming is deferred (see `theme-lock.ts`): while the lock holds, the
  // stored preference is suspended rather than read — including for visitors
  // who chose light before the lock shipped and would otherwise be stranded
  // on the half-finished theme with the toggle gone.
  const stored = THEME_LOCKED_TO_DARK ? LOCKED_THEME : window.localStorage.getItem(STORAGE_KEY);
  const dark = stored !== "light";
  const theme = dark ? "dark" : "light";
  const root = document.documentElement;

  if (root.getAttribute("data-theme") !== theme) root.setAttribute("data-theme", theme);
  if (root.style.colorScheme !== theme) root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  const color = dark ? "#0B0B0E" : "#F4F5F1";
  if (meta && meta.getAttribute("content") !== color) meta.setAttribute("content", color);
}
