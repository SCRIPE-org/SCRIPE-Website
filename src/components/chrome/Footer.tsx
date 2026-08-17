/**
 * Site footer.
 *
 * Server Component — renders the brand lockup, `FOOTER_COLUMNS` from
 * `ia.ts`, the social row (channels with no published URL yet render as
 * muted text, never a guessed link) and the legal/rights line. Quiet visual
 * register throughout: muted text, subtle borders, no accent fills — the
 * footer is reference material, not another call-to-action surface.
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/ui/cx";
import { BrandMark } from "./BrandMark";
import { ACCENT_DOT_CLASS, FOOTER_COLUMNS, SOCIAL_LINKS } from "./ia";

/**
 * Renders the footer: brand lockup + tagline + socials, `FOOTER_COLUMNS`,
 * and the rights line. See the file header for the full contract.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border-subtle border-t">
      <div className="mx-auto max-w-[1360px] px-[clamp(var(--space-5),4vw,var(--space-9))] py-[clamp(var(--space-9),8vh,var(--space-12))]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <Link href="/" aria-label={t("nav.home")} className="inline-flex w-fit items-center gap-2">
              <BrandMark size={22} className="text-text-primary" />
              <span className="font-display text-text-primary text-[1rem] font-semibold tracking-[0.08em]">{t("common.brand")}</span>
            </Link>
            <p className="text-text-secondary max-w-[26ch] text-[length:var(--fs-small)]">{t("footer.tagline")}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {SOCIAL_LINKS.map((social) =>
                social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary text-[length:var(--fs-small)]"
                  >
                    {social.label}
                  </a>
                ) : (
                  <span key={social.label} className="text-text-muted text-[length:var(--fs-small)]">
                    {social.label}
                  </span>
                ),
              )}
            </div>
            {SOCIAL_LINKS.every((social) => social.href === null) && (
              <p className="text-text-muted text-[length:var(--fs-meta)]">{t("footer.socialNote")}</p>
            )}
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.key} aria-label={t(column.titleKey)} className="flex flex-col gap-3">
              <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold uppercase tracking-[0.14em] [&:lang(ar)]:normal-case [&:lang(ar)]:tracking-normal">
                {t(column.titleKey)}
              </span>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <Link
                    key={link.labelKey + link.href}
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary inline-flex items-center gap-2 text-[length:var(--fs-small)]"
                  >
                    {link.accent && (
                      <span aria-hidden="true" className={cx("size-1.5 shrink-0 rounded-[2px]", ACCENT_DOT_CLASS[link.accent])} />
                    )}
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <div className="border-border-subtle mt-10 flex flex-col items-start gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-text-muted text-[length:var(--fs-meta)]">{t("footer.rights", { year })}</span>
        </div>
      </div>
    </footer>
  );
}
