"use client";

/**
 * Desktop Solutions mega-menu.
 *
 * Self-contained: reads `SOLUTIONS` from `ia.ts` and translates its own
 * labels via `useTranslations()`, so `NavBar` renders it with zero props.
 * Client Component because it owns open/close state and keyboard behavior —
 * it is one of exactly three "use client" boundaries in the site chrome
 * (the others are `MobileNav` and `ThemeToggle`).
 *
 * Interaction contract:
 * - Opens on click (toggle) and on hover-intent (mouse enters the trigger or
 *   panel); closes ~140ms after the pointer leaves both, matching the
 *   legacy `backup/scripe-static/js/navbar.js` hover-intent delay so a
 *   diagonal mouse path between trigger and panel doesn't flicker-close it.
 * - Closes on Escape (returning focus to the trigger), on outside pointer-
 *   down, and when focus leaves the trigger+panel entirely.
 * - Keyboard: Enter/Space activates the trigger button natively (opens);
 *   ArrowDown on the trigger opens the panel and moves focus to the first
 *   item; ArrowUp/ArrowDown inside the panel move between items (wrapping);
 *   Escape inside the panel closes and returns focus to the trigger.
 *
 * The trigger carries `aria-haspopup="menu"` per the task contract, but the
 * panel intentionally does not use `role="menu"`/`role="menuitem"` — the
 * WAI-ARIA Authoring Practices reserve that role pair for application-style
 * action menus, not navigation link groups, and screen readers announce
 * `menuitem`s as menu commands rather than links. The items stay real,
 * normally-tabbable `<a>` elements; arrow-key movement between them is a
 * progressive enhancement layered on top via manual `.focus()` calls, not a
 * roving-tabindex widget.
 */
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ACCENT_DOT_CLASS, SOLUTIONS } from "./ia";
import { cx } from "@/components/ui/cx";

const CLOSE_DELAY_MS = 140;

export function MegaMenu() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();

  const cancelScheduledClose = useCallback(() => {
    if (closeTimer.current !== undefined) {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const openMenu = useCallback(
    (focusFirstItem = false) => {
      cancelScheduledClose();
      setOpen(true);
      if (focusFirstItem) {
        requestAnimationFrame(() => itemRefs.current[0]?.focus());
      }
    },
    [cancelScheduledClose],
  );

  const closeMenu = useCallback(
    (returnFocus = false) => {
      cancelScheduledClose();
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [cancelScheduledClose],
  );

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [cancelScheduledClose]);

  // Escape (anywhere) and outside pointer-down both close the panel while
  // it's open. Scoped to an effect keyed on `open` so no listener sits on
  // the document while the menu is closed.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu(true);
    }
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, closeMenu]);

  useEffect(() => cancelScheduledClose, [cancelScheduledClose]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(true);
    }
  }

  function onItemKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      itemRefs.current[(index + 1) % SOLUTIONS.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      itemRefs.current[(index - 1 + SOLUTIONS.length) % SOLUTIONS.length]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    }
  }

  return (
    <div className="relative" onMouseEnter={() => openMenu()} onMouseLeave={scheduleClose}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          "inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[length:var(--fs-small)] font-medium transition-colors duration-[var(--motion-quick)]",
          open ? "bg-surface-overlay text-text-primary" : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
        )}
      >
        <span>{t("nav.solutions")}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cx("shrink-0 transition-transform duration-[var(--motion-quick)]", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        onMouseEnter={() => openMenu()}
        onMouseLeave={scheduleClose}
        onFocus={() => openMenu()}
        onBlur={(event) => {
          if (!panelRef.current?.contains(event.relatedTarget as Node | null)) scheduleClose();
        }}
        className="absolute inset-inline-start-0 top-full z-[var(--z-megamenu)] mt-2 w-[min(640px,90vw)] rounded-lg border border-border-subtle bg-surface-overlay p-5 shadow-[0_8px_24px_rgb(0,0,0,0.18)]"
      >
        <div className="grid gap-1 sm:grid-cols-2">
          {SOLUTIONS.map((item, index) => (
            <Link
              key={item.key}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={item.href}
              onKeyDown={(event) => onItemKeyDown(event, index)}
              onClick={() => closeMenu()}
              className="group flex items-start gap-3 rounded-md p-3 transition-colors duration-[var(--motion-quick)] hover:bg-surface-raised"
            >
              <span
                aria-hidden="true"
                className={cx("mt-1.5 size-2 shrink-0 rounded-[2px]", ACCENT_DOT_CLASS[item.accent])}
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[length:var(--fs-small)] font-semibold text-text-primary">{t(item.labelKey)}</span>
                <span className="text-[length:var(--fs-small)] text-text-secondary">{t(item.descriptionKey)}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-4">
          <Link
            href="/solutions"
            onClick={() => closeMenu()}
            className="inline-flex items-center gap-1.5 text-[length:var(--fs-small)] font-semibold text-accent-text"
          >
            {t("nav.allSolutions")}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="rtl:-scale-x-100"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <span className="text-[length:var(--fs-meta)] text-text-muted">{t("nav.megaMeta")}</span>
        </div>
      </div>
    </div>
  );
}
