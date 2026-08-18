"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * SCRIPE is dark-first: the pre-paint script in `theme-script.ts` renders
 * DARK by default whenever no explicit choice is stored, regardless of OS
 * `prefers-color-scheme`. This toggle is the ONLY way a visitor reaches
 * light mode — it always writes an explicit `"dark"` / `"light"` value to
 * storage, so once used the choice sticks and OS preference never overrides
 * it (in either direction).
 *
 * What the toggle actually switches (Task E5, "cinema screen in a lit
 * room"): the world AROUND the film. The home hero stage and every
 * closing-CTA end card are fixed night surfaces in both themes
 * (`.night-zone`, `src/styles/tokens/atmosphere.css`); flipping to light
 * turns the nav, sections and sub-pages into the daylight studio (tinted
 * paper, white cards, studio shadows, obsidian-chip CTAs — see
 * `colors.css`'s header) while the film itself never regrades.
 */
const STORAGE_KEY = "scripe-theme";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0B0B0E" : "#F4F5F1");
}

export function ThemeToggle() {
  const t = useTranslations("common");
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // One-time mount read of the data-theme attribute the pre-paint script
    // already set on <html>. document is unavailable during SSR/render, so
    // this can't be computed as initial state — it must happen post-mount.
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external DOM attribute, not derived from props/state
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  if (theme === null) {
    return (
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="border-border-subtle inline-flex size-10 items-center justify-center rounded-full border"
      />
    );
  }

  const isDark = theme === "dark";

  function handleToggle() {
    const next: Theme = isDark ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={t("themeToggleLabel")}
      aria-pressed={isDark}
      className="border-border-subtle text-text-primary hover:bg-surface-overlay inline-flex size-10 items-center justify-center rounded-full border transition-colors"
    >
      {isDark ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
