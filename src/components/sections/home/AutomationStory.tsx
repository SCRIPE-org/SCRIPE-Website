/**
 * AutomationStory (`#automation`) — one booking sets off the whole chain.
 *
 * The page's one numbered sequence, because the content genuinely IS a
 * sequence: six operational steps triggered by a single booking. Each step
 * renders a tabular-nums roundel, a connecting rail whose lime fill draws
 * as the section scrolls through the viewport (CSS scroll-driven
 * `.auto-rail-fill`, reduced-motion-gated with a filled fallback — see
 * `src/styles/home.css` §11), the step title and its caption. Steps stagger
 * in with the shared `Reveal` choreography. The rail's fill direction
 * follows reading direction via a targeted `[dir="rtl"]` transform-origin
 * override. A Server Component; `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "./ArrowLink";

export interface AutomationStoryProps {
  /** The automation slice of the home page content. */
  content: HomeContent["automation"];
}

/**
 * Renders the automation header, the six-step chain and the deep link.
 *
 * @param props - See {@link AutomationStoryProps}.
 */
export function AutomationStory({ content }: AutomationStoryProps) {
  return (
    <Section id="automation" className="scroll-mt-24">
      <Reveal className="max-w-[760px]">
        <h2 className="font-display text-text-primary text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="border-border-subtle bg-surface-raised mt-12 rounded-lg border px-7 py-9 sm:px-9">
        <ol
          className="m-0 grid list-none gap-x-4 gap-y-9 p-0 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]"
          data-rv-stagger
          style={{ "--rv-stagger-step": "80ms" } as React.CSSProperties}
        >
          {content.steps.map((step, index) => (
            <Reveal as="li" key={step.title} y={14}>
              <div className="flex items-center gap-3">
                <span
                  className="border-border-strong bg-surface-page font-display text-text-secondary grid size-8 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-semibold tabular-nums"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < content.steps.length - 1 ? (
                  <span className="auto-rail" aria-hidden="true">
                    <span className="auto-rail-fill" />
                  </span>
                ) : (
                  <span className="bg-accent inline-block size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                )}
              </div>
              <p className="text-text-primary mt-4 text-[length:var(--fs-small)] font-medium">
                {step.title}
              </p>
              <p className="text-text-muted mt-1 text-[length:var(--fs-meta)] leading-relaxed text-pretty">
                {step.caption}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <ArrowLink href="/platform">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
