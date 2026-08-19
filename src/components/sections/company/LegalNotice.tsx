/**
 * LegalNotice (`#legal`) — "Sales-assisted, from first call to first
 * season.", ported from `backup/scripe-static/company.html`'s "Working with
 * us" section.
 *
 * The `#legal` anchor id is preserved for any inbound link that still
 * targets it, but Task G4 repointed the footer's Privacy/Terms links
 * (`src/components/chrome/ia.ts`) at the new standalone `/privacy` and
 * `/terms` pages instead of `/company#legal` — this section is no longer
 * their honest stand-in, since real documents now exist. `content.note`
 * (`src/content/{en,ar}/company.ts`) was rewritten to match: it no longer
 * claims no policy is published, and this component now links to both new
 * pages directly (reusing the `footer.privacy`/`footer.terms` message keys
 * the footer itself already uses, rather than duplicating that translated
 * label a third time — the same key-reuse precedent
 * `ContactContent`'s doc comment documents for its organization-type
 * select).
 *
 * Deliberately text-first with a plain link row, no CTA button and no card:
 * the legacy page's own `#legal` section carried neither, and a full button
 * pair would misrepresent a compliance/honesty notice as a conversion
 * moment. A Server Component (now async for `getTranslations`, the same
 * pattern `Footer.tsx` uses); `Reveal` is the only client leaf.
 */
import { getTranslations } from "next-intl/server";
import type { CompanyContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface LegalNoticeProps {
  /** The legal slice of the company page content. */
  content: CompanyContent["legal"];
}

/**
 * Renders the "working with us" / legal-honesty section.
 *
 * @param props - See {@link LegalNoticeProps}.
 */
export async function LegalNotice({ content }: LegalNoticeProps) {
  const t = await getTranslations();

  return (
    <Section id="legal" className="scroll-mt-24">
      <Reveal className="max-w-[720px]">
        <div className="flex items-center gap-2.5">
          <span className="bg-accent inline-block size-2.5 rounded-full" aria-hidden="true" />
          <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-h2)]">
            {content.title}
          </h2>
        </div>
        <p className="text-text-secondary mt-5 text-[length:var(--fs-lead)] text-pretty">{content.body}</p>
        <p className="text-text-tertiary mt-4 text-[length:var(--fs-small)] text-pretty">{content.note}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="text-accent-text text-[length:var(--fs-small)] font-medium underline underline-offset-4 hover:no-underline">
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" className="text-accent-text text-[length:var(--fs-small)] font-medium underline underline-offset-4 hover:no-underline">
            {t("footer.terms")}
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
