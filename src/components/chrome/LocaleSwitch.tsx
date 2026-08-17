/**
 * Segmented EN / ع locale switcher.
 *
 * Server Component — no "use client", no hooks. Reads the active locale via
 * `getLocale()` from `next-intl/server`, which resolves from the request
 * config next-intl already populated via `setRequestLocale()` in
 * `src/app/[locale]/layout.tsx`. That's a deliberately different mechanism
 * from `headers()`/`cookies()`: those are Next.js "Dynamic APIs" that force
 * a route out of static generation the moment they're called, which would
 * undo `generateStaticParams`/`dynamicParams = false` for every single page
 * (this component renders inside `NavBar`, which is in the root layout —
 * shared by every route). `getLocale()` carries none of that cost.
 *
 * Known limitation: each `Link` targets `pathname` (the site root by
 * default), not necessarily the exact page the visitor is currently on.
 * The reason is structural, not an oversight — `NavBar`/`LocaleSwitch` are
 * rendered once from the shared root layout, which in the Next.js App
 * Router has no way to learn which leaf page produced `children` without
 * either a Client Component (`usePathname()`, which the task's "use client"
 * budget reserves for `MegaMenu`/`MobileNav`/`ThemeToggle` only) or a
 * Dynamic API (which breaks static prerendering site-wide, per above).
 * `pathname` is exposed as a prop specifically so a future page-level
 * composition change can pass the real current path down once one of those
 * trade-offs is revisited.
 */
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/ui/cx";

/** Props for {@link LocaleSwitch}. */
export interface LocaleSwitchProps {
  /** Internal, locale-less pathname both links target. Defaults to the site
   *  root — see the file header for why "the current page" isn't reliably
   *  known at this position in the tree today. */
  pathname?: string;
}

const OPTION_CLASSES =
  "inline-flex min-w-8 items-center justify-center rounded-[calc(var(--radius-sm)-2px)] px-2 py-1 text-[length:var(--fs-meta)] font-semibold transition-colors duration-[var(--motion-quick)]";

/**
 * Renders the `EN / ع` segmented pair. Each side is a `Link` to the same
 * `pathname` with the other locale forced via the `locale` prop; the active
 * side carries `aria-current="true"` and a filled background.
 *
 * @param props - See {@link LocaleSwitchProps}.
 */
export async function LocaleSwitch({ pathname = "/" }: LocaleSwitchProps) {
  const locale = await getLocale();
  const t = await getTranslations("common");

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
