/**
 * PainPoints — the shared "friction this solution removes" section of the
 * solution page template.
 *
 * Recomposes the legacy static site's "operating day" meters + evidence
 * board mockup (`backup/scripe-static/solutions/*.html`) into concise named
 * frictions — see `SolutionContent`'s doc comment in `src/content/types.ts`
 * for why. Rendered as a hairline-divided list (echoing the home hero's
 * flight-plan strip, `src/styles/home.css` §8's `.hero-plan-item`), not
 * cards: three items is not the page's "genuine choice" moment (that is the
 * hub's solution grid), so a bordered `Card` here would be the lazy default
 * the design doctrine warns against. A Server Component; `Reveal` is the
 * only client leaf.
 */
import type { AccentId, SolutionContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";

export interface PainPointsProps {
  /** The pain-points slice of the solution page's content. */
  content: SolutionContent["painPoints"];
  /** Product-world accent identity for this solution. */
  accent: AccentId;
}

/**
 * Renders the pain-points header and its hairline-divided friction list.
 *
 * @param props - See {@link PainPointsProps}.
 */
export function PainPoints({ content, accent }: PainPointsProps) {
  return (
    <Section>
      <Reveal className="max-w-[720px]">
        <h2 className="font-display text-text-primary text-[length:var(--fs-h1)] font-semibold text-balance [font-variation-settings:'wdth'_114]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-4 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div
        className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-3"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.title} y={16} className="sol-pain-item">
            <span className={`sol-pain-rule ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
            <h3 className="font-display text-text-primary mt-4 text-[length:var(--fs-h3)] font-semibold text-balance">
              {item.title}
            </h3>
            <p className="text-text-secondary mt-3 text-[length:var(--fs-small)] leading-relaxed text-pretty">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
