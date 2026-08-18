/**
 * PricingFaq (`#faq`) — the pricing page's question/answer list.
 *
 * Native `<details>`/`<summary>` per item rather than the legacy static
 * page's own hand-rolled JS accordion (`backup/scripe-static/js/faq.js`,
 * used on `resources.html`): the browser already provides open/close state,
 * keyboard operability (`Enter`/`Space` on the focused `<summary>`) and
 * screen-reader semantics for free, so this needs zero client JS — a Server
 * Component, full stop. Unlike the legacy accordion, multiple items may be
 * open at once; nothing about these six questions depends on only one
 * answer being visible at a time, so the simpler native behavior is a
 * strict improvement here, not a missing feature. Per the design spec's SEO
 * section, no FAQPage JSON-LD is emitted for this content — it is plain,
 * crawlable page markup only (rich-result FAQ schema is deprecated as of
 * 2026).
 */
import type { PricingContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface PricingFaqProps {
  /** The FAQ slice of the pricing page content. */
  content: PricingContent["faq"];
}

/**
 * Renders the FAQ header and its disclosure list.
 *
 * @param props - See {@link PricingFaqProps}.
 */
export function PricingFaq({ content }: PricingFaqProps) {
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
