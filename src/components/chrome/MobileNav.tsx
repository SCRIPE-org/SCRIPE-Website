"use client";

/**
 * Hamburger trigger + full-screen navigation sheet for viewports below the
 * `lg` breakpoint, where `NavBar`'s desktop nav/CTA row is hidden.
 *
 * Client Component because it owns open state, a real focus trap and a
 * scroll lock — one of the "use client" boundaries in the site chrome
 * (alongside `MegaMenu`, `LocaleSwitch` and `ThemeToggle`). `localeSwitch`
 * and `themeToggle` still arrive as already-rendered nodes from `NavBar`
 * rather than being imported and instantiated here directly: `NavBar`
 * renders each control exactly once and reuses that same composition point
 * for both the desktop row and this sheet, instead of each surface owning
 * its own separate instance.
 *
 * Behavior contract: Escape closes and returns focus to the toggle button;
 * Tab/Shift+Tab cycle only through the sheet's own focusable elements
 * (Tab from the last item wraps to the first, Shift+Tab from the first
 * wraps to the last) — the header hamburger/X toggle button is a DOM
 * sibling of the sheet, not inside it, so it is excluded from that cycle
 * exactly as the legacy `backup/scripe-static/js/navbar.js` implementation
 * excluded it; body scroll is locked (`overflow`/`touchAction: "none"`)
 * while open and restored on close; clicking any link inside the sheet
 * closes it so route changes never leave the sheet stuck open underneath
 * the new page.
 *
 * The sheet also carries `role="dialog" aria-modal="true"`, which instructs
 * assistive technology to treat everything outside it as inert — so the
 * header toggle button, despite being visually reachable, is not a valid
 * close control for a screen-reader user while the dialog is open. The
 * sheet therefore renders its OWN close button as the first focusable child
 * (visually hidden via the same `sr-only`/`focus:not-sr-only` treatment
 * `NavBar.tsx`'s skip-to-content link already uses, so it adds no visible
 * duplicate of the header's X for sighted users, but is reachable by
 * keyboard Tab and by touch screen-reader swipe navigation either way).
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";
import { ACCENT_DOT_CLASS, PRIMARY_CTA, PRIMARY_NAV, SIGN_IN_CTA, SOLUTIONS } from "./ia";

/** Props for {@link MobileNav}. */
export interface MobileNavProps {
  /** A rendered `LocaleSwitch` instance, supplied by `NavBar` so both
   *  surfaces share one composition point (see the file header). */
  localeSwitch: ReactNode;
  /** A rendered `ThemeToggle` instance, supplied by `NavBar`. */
  themeToggle: ReactNode;
}

/** Finds every currently-visible, focusable element inside `root`, in DOM
 *  (tab) order — the focus trap's cycle boundary. */
function focusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(
    (el) => el.offsetParent !== null,
  );
}

/**
 * Renders the hamburger toggle button and, while open, the full-screen nav
 * sheet. See the file header for the full behavior contract.
 *
 * @param props - See {@link MobileNavProps}.
 */
export function MobileNav({ localeSwitch, themeToggle }: MobileNavProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const panelId = useId();

  // Focus trap + Escape + scroll lock, all scoped to the open lifetime so
  // nothing runs (or needs cleaning up) while the sheet is closed.
  useEffect(() => {
    if (!open) return;

    const first = focusableElements(sheetRef.current)[0];
    first?.focus();

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusableElements(sheetRef.current);
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [open]);

  // Hand focus back to the toggle button on close — but only for a close
  // that happened while the sheet still had focus (Escape, outside click,
  // a link navigating away); not on first mount.
  useEffect(() => {
    if (!open && wasOpen.current) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  function onSheetClick(event: ReactMouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="border-border-subtle text-text-primary inline-flex size-11 items-center justify-center rounded-full border"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          ref={sheetRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.siteNav")}
          onClick={onSheetClick}
          className="bg-surface-page fixed start-0 end-0 top-[72px] bottom-0 z-[var(--z-overlay)] overflow-y-auto"
        >
          {/* Close control INSIDE the dialog boundary — see the file header
              for why the header's own hamburger/X toggle doesn't satisfy
              this for assistive technology. Visually hidden until focused,
              same convention as NavBar.tsx's skip-to-content link, so
              sighted users see no duplicate of the header's X. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("nav.closeMenu")}
            className="bg-surface-raised text-text-primary sr-only rounded-full border border-border-subtle focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[var(--z-toast)] focus:inline-flex focus:size-11 focus:items-center focus:justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <nav aria-label={t("nav.primary")} className="flex flex-col px-6 py-2">
            {PRIMARY_NAV.map((item) =>
              item.hasMenu ? (
                <div key={item.key} className="border-border-subtle border-b">
                  <button
                    type="button"
                    aria-expanded={solutionsOpen}
                    aria-controls={`${panelId}-solutions`}
                    onClick={() => setSolutionsOpen((v) => !v)}
                    className="text-text-primary flex min-h-14 w-full items-center justify-between gap-3 text-[length:var(--fs-lead)] font-semibold"
                  >
                    <span>{t(item.labelKey)}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={cx("shrink-0 transition-transform duration-[var(--motion-quick)]", solutionsOpen && "rotate-180")}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {solutionsOpen && (
                    <div id={`${panelId}-solutions`} className="grid gap-1 pb-4">
                      {SOLUTIONS.map((solution) => (
                        <Link
                          key={solution.key}
                          href={solution.href}
                          className="text-text-secondary flex min-h-11 items-center gap-3 ps-4 text-[length:var(--fs-small)]"
                        >
                          <span aria-hidden="true" className={cx("size-1.5 shrink-0 rounded-[2px]", ACCENT_DOT_CLASS[solution.accent])} />
                          {t(solution.labelKey)}
                        </Link>
                      ))}
                      <Link href={item.href} className="text-accent-text flex min-h-11 items-center gap-3 ps-4 text-[length:var(--fs-small)] font-semibold">
                        {t("nav.allSolutions")}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="border-border-subtle text-text-primary flex min-h-14 items-center text-[length:var(--fs-lead)] font-semibold"
                >
                  {t(item.labelKey)}
                </Link>
              ),
            )}
          </nav>

          <div className="border-border-subtle flex items-center gap-4 border-b px-6 py-6">
            {localeSwitch}
            {themeToggle}
          </div>

          <div className="grid gap-4 px-6 py-7">
            <Button href={PRIMARY_CTA.href} size="lg" className="justify-center">
              {t(PRIMARY_CTA.labelKey)}
            </Button>
            {SIGN_IN_CTA.external ? (
              <a href={SIGN_IN_CTA.href} className="text-text-secondary text-center text-[length:var(--fs-small)] font-medium">
                {t(SIGN_IN_CTA.labelKey)}
              </a>
            ) : (
              <Link href={SIGN_IN_CTA.href} className="text-text-secondary text-center text-[length:var(--fs-small)] font-medium">
                {t(SIGN_IN_CTA.labelKey)}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
