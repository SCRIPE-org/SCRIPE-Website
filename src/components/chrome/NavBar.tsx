/**
 * Site navigation bar.
 *
 * Server Component shell for the whole header: skip-to-content link, brand
 * lockup, primary nav (`PRIMARY_NAV` from `ia.ts`, with the Solutions entry
 * swapped for `MegaMenu`), `LocaleSwitch`, `ThemeToggle`, and the primary
 * "Book a Demo" CTA. Sticky (not fixed) — it occupies its normal document-
 * flow height, so `<main>` never needs a manual top-offset to compensate,
 * and sticks to the viewport top once the page scrolls past it. The surface
 * is a translucent, blurred page-color panel over whatever scrolls beneath
 * it rather than a fully opaque bar.
 *
 * Renders `MobileNav` for viewports below `lg`, passing it already-rendered
 * `LocaleSwitch`/`ThemeToggle` instances — see `MobileNav`'s file header for
 * why a Client Component can't import and instantiate `LocaleSwitch`
 * (a Server Component) itself.
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { PRIMARY_CTA, PRIMARY_NAV, SIGN_IN_CTA } from "./ia";

export async function NavBar() {
  const t = await getTranslations();

  return (
    <header className="border-border-subtle bg-surface-page/85 sticky inset-inline-0 top-0 z-[var(--z-nav)] border-b backdrop-blur-md">
      {/* First focusable element on every page: visually hidden until it
          receives keyboard focus, then it's the first thing announced. */}
      <a
        href="#main"
        className="bg-surface-raised text-text-primary sr-only rounded-md px-4 py-2 text-[length:var(--fs-small)] font-medium focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-[var(--z-toast)]"
      >
        {t("common.skipToContent")}
      </a>

      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center gap-6 px-[clamp(var(--space-5),4vw,var(--space-9))]">
        <Link href="/" aria-label={t("nav.home")} className="inline-flex shrink-0 items-center gap-2.5">
          <svg width="26" height="27" viewBox="0 0 96 100" fill="none" aria-hidden="true" className="text-text-primary shrink-0">
            <path fill="currentColor" d="M76 0H0V63H64V74H0V86L14 100H90V37H26V26H90V14L76 0Z" />
            <path style={{ fill: "var(--accent)" }} d="M82 0H94V12L82 0Z" />
          </svg>
          <span className="font-display text-text-primary text-[1.0625rem] font-semibold tracking-[0.08em]">
            {t("common.brand")}
          </span>
        </Link>

        <nav aria-label={t("nav.primary")} className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) =>
            item.hasMenu ? (
              <MegaMenu key={item.key} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="text-text-secondary hover:bg-surface-overlay hover:text-text-primary rounded-md px-3.5 py-2 text-[length:var(--fs-small)] font-medium transition-colors duration-[var(--motion-quick)]"
              >
                {t(item.labelKey)}
              </Link>
            ),
          )}
        </nav>

        <div className="ms-auto hidden items-center gap-4 lg:flex">
          <LocaleSwitch />
          <ThemeToggle />
          <a href={SIGN_IN_CTA.href} className="text-text-secondary hover:text-text-primary text-[length:var(--fs-small)] font-medium">
            {t(SIGN_IN_CTA.labelKey)}
          </a>
          <Button href={PRIMARY_CTA.href} size="md">
            {t(PRIMARY_CTA.labelKey)}
          </Button>
        </div>

        <div className="ms-auto lg:hidden">
          <MobileNav localeSwitch={<LocaleSwitch />} themeToggle={<ThemeToggle />} />
        </div>
      </div>
    </header>
  );
}
