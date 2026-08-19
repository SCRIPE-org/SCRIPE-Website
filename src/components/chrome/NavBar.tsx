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
 * it rather than a fully opaque bar. In light theme the `site-nav` class
 * (styled in `globals.css`, Task E5) upgrades that surface to the designed
 * "lit room" chrome — frosted white glass, ink hairline, floating shadow —
 * while the dark bar stays exactly as composed here.
 *
 * Renders `MobileNav` for viewports below `lg`, passing it already-rendered
 * `LocaleSwitch`/`ThemeToggle` instances so both controls are composed once,
 * in one place, and reused in both the desktop row and the mobile sheet.
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
// import { ThemeToggle } from "@/components/chrome/ThemeToggle";
// ^ Theming is deferred and the site ships dark-only — see
//   `src/theme/theme-lock.ts` for why, and for the one-flag procedure that
//   brings this control and both storage reads back. The component itself is
//   untouched and still works; it is simply not mounted.
import { BrandMark } from "./BrandMark";
import { LocaleSwitch } from "./LocaleSwitch";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { PRIMARY_CTA, PRIMARY_NAV, SIGN_IN_CTA } from "./ia";

/**
 * Renders the header: skip link, brand lockup, primary nav, locale/theme
 * controls, CTAs, and the mobile nav trigger. See the file header for the
 * full composition contract.
 */
export async function NavBar() {
  const t = await getTranslations();

  return (
    <header className="site-nav border-border-subtle bg-surface-page/85 sticky start-0 end-0 top-0 z-[var(--z-nav)] border-b backdrop-blur-md">
      {/* First focusable element on every page: visually hidden until it
          receives keyboard focus, then it's the first thing announced.
          Every box-affecting utility here is behind `focus:` on purpose.
          `sr-only` sets `padding: 0` alongside `width/height: 1px`, but an
          unprefixed `px-4 py-2` in the same class list wins that cascade —
          which inflated the hidden link to a real 32x16 positioned box in
          the header's corner. In LTR it sat at x = -1 (harmless-looking but
          still a stray box); in RTL its auto static position resolved to the
          inline-end edge, putting it at x = 362..391 in a 390px viewport and
          pushing content past the viewport edge. Padding only applies once
          the link is actually visible. */}
      <a
        href="#main"
        className="bg-surface-raised text-text-primary sr-only rounded-md text-[length:var(--fs-small)] font-medium focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-[var(--z-toast)] focus:px-4 focus:py-2"
      >
        {t("common.skipToContent")}
      </a>

      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center gap-6 px-[clamp(var(--space-5),4vw,var(--space-9))]">
        <Link href="/" aria-label={t("nav.home")} className="inline-flex shrink-0 items-center gap-2.5">
          <BrandMark size={26} alt={t("common.brand")} priority />
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
          {/* <ThemeToggle /> — withdrawn while theming is deferred (theme-lock.ts) */}
          <a href={SIGN_IN_CTA.href} className="text-text-secondary hover:text-text-primary text-[length:var(--fs-small)] font-medium">
            {t(SIGN_IN_CTA.labelKey)}
          </a>
          <Button href={PRIMARY_CTA.href} size="md">
            {t(PRIMARY_CTA.labelKey)}
          </Button>
        </div>

        <div className="ms-auto lg:hidden">
          {/* themeToggle omitted while theming is deferred (theme-lock.ts) */}
          <MobileNav localeSwitch={<LocaleSwitch />} />
        </div>
      </div>
    </header>
  );
}
