/**
 * ResourcesFaq (`#faq`) — the resources page's own question/answer list, and
 * this content's original home: `src/content/en/pricing.ts`'s own FAQ
 * section borrows this exact "Questions" / "Before you talk to sales."
 * heading from here (see that file's header), not the other way around.
 *
 * Native `<details>`/`<summary>` per item — the same accessible-disclosure
 * pattern `src/components/sections/pricing/PricingFaq.tsx` establishes (see
 * that file's own header for the full reasoning: zero client JS, free
 * keyboard operability and screen-reader semantics, multiple items allowed
 * open at once, no FAQPage JSON-LD per the design spec's SEO section). This
 * is a page-scoped copy of that same markup rather than a shared component,
 * per this codebase's established "self-contained page folder" convention —
 * see `src/components/sections/platform/accents.ts`'s header for that
 * convention's own rationale.
 */
import type { ResourcesContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface ResourcesFaqProps {
  /** The FAQ slice of the resources page content. */
  content: ResourcesContent["faq"];
}

/**
 * Renders the FAQ header and its disclosure list.
 *
 * @param props - See {@link ResourcesFaqProps}.
 */
export function ResourcesFaq({ content }: ResourcesFaqProps) {
  return (
    <Section id="faq" className="scroll-mt-24">
      <Reveal className="max-w-[720px]">
        <p className="text-accent-text flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h2 className="atmo-title font-display text-text-primary mt-5 text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h2>
      </Reveal>

      <Reveal y={20} className="atmo-panel mt-10 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-lg">
        {content.items.map((item) => (
          <details key={item.question} className="faq-item group px-6 py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start">
              <span className="text-text-primary text-[length:var(--fs-body)] font-medium">{item.question}</span>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="faq-chevron text-text-muted shrink-0"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="text-text-secondary max-w-[68ch] pb-5 text-[length:var(--fs-small)] text-pretty">
              {item.answer}
            </p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
