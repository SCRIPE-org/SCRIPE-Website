"use client";

/**
 * Segmented EN / ع locale switcher.
 *
 * Client Component so it can read the visitor's actual current pathname via
 * `usePathname()` from `@/i18n/navigation` and switch language while staying
 * on the same page — e.g. switching from `/en/pricing` lands on `/ar/pricing`,
 * not the site root. This is a controller-level override of this chrome's
 * general "server component where possible" default: a Server Component
 * version (used earlier) can't know the current leaf pathname from the
 * shared root layout without either a Dynamic API (`headers()`/`cookies()`,
 * which forces every page out of static generation since this renders
 * site-wide) or a Client Component — `usePathname()` is the sanctioned way
 * in through that trade-off. `useLocale()` similarly replaces the earlier
 * `getLocale()` call now that this runs client-side.
 */
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cx } from "@/components/ui/cx";

const OPTION_CLASSES =
  "inline-flex min-w-8 items-center justify-center rounded-[calc(var(--radius-sm)-2px)] px-2 py-1 text-[length:var(--fs-meta)] font-semibold transition-colors duration-[var(--motion-quick)]";

/**
 * Renders the `EN / ع` segmented pair. Each side is a `Link` to the current
 * pathname with the other locale forced via the `locale` prop, so switching
 * language keeps the visitor on the same page; the active side carries
 * `aria-current="true"` and a filled background.
 */
export function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <span role="group" aria-label={t("langSwitchLabel")} className="border-border-subtle inline-flex items-center gap-0.5 rounded-sm border p-0.5">
      <Link
        href={pathname}
        locale="en"
        lang="en"
        aria-current={locale === "en" ? "true" : undefined}
        aria-label="English"
        className={cx(
          OPTION_CLASSES,
          locale === "en" ? "bg-surface-overlay text-text-primary" : "text-text-secondary hover:text-text-primary",
        )}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ar"
        lang="ar"
        aria-current={locale === "ar" ? "true" : undefined}
        aria-label="العربية"
        className={cx(
          OPTION_CLASSES,
          locale === "ar" ? "bg-surface-overlay text-text-primary" : "text-text-secondary hover:text-text-primary",
        )}
      >
        ع
      </Link>
    </span>
  );
}
