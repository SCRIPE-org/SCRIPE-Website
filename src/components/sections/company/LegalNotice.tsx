/**
 * LegalNotice (`#legal`) — "Sales-assisted, from first call to first
 * season.", ported from `backup/scripe-static/company.html`'s "Working with
 * us" section.
 *
 * The `#legal` anchor id is load-bearing and must not change: the footer's
 * Privacy and Terms links (`src/components/chrome/ia.ts`) point at
 * `/company#legal` today, since no standalone privacy policy or terms page
 * is published yet — this section IS that page's honest stand-in ("these
 * documents are issued during onboarding, not published here"), not a
 * placeholder waiting to be replaced by real legal copy this task would have
 * to invent.
 *
 * Deliberately text-only, no CTA and no card: the legacy page's own `#legal`
 * section carried neither, and adding either here would misrepresent a
 * compliance/honesty notice as a conversion moment. A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { CompanyContent } from "@/content/types";
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
export function LegalNotice({ content }: LegalNoticeProps) {
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
      </Reveal>
    </Section>
  );
}
