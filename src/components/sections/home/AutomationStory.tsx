/**
 * AutomationStory (`#automation`) — one booking sets off the whole chain
 * (ground slate `09 / Automation` — see `Slate.tsx`).
 *
 * The page's one numbered STEP sequence (distinct from the ground slates'
 * timecode), because the content genuinely IS a sequence: six operational
 * steps triggered by a single booking. The chain lives on a control-desk
 * surface (`.auto-panel`, `src/styles/home.css` §13 — elevation ramp +
 * ambient key light at the chain's start corner, on the section's raised
 * ground band). Each step renders a lit instrument roundel (`.auto-no`,
 * mono digits), a connecting rail whose lime fill draws as the section
 * scrolls through the viewport (CSS scroll-driven `.auto-rail-fill`,
 * reduced-motion-gated with a filled fallback — §11; the fill is this
 * section's one lime moment), the step title and its caption. Steps stagger
 * in with the shared `Reveal` choreography. The rail's fill direction
 * follows reading direction via a targeted `[dir="rtl"]` transform-origin
 * override. A Server Component; `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "./ArrowLink";
import { Slate } from "./Slate";

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
    <Section id="automation" className="gs gs-automation scroll-mt-24">
      <Reveal className="max-w-[1040px]">
        <Slate no="09" label={content.stamp} />
        <h2 className="gs-title">{content.title}</h2>
        <p className="text-text-secondary mt-4 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="auto-panel mt-9 px-7 py-8 sm:px-9">
        <ol
          className="relative m-0 grid list-none gap-x-4 gap-y-8 p-0 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]"
          data-rv-stagger
          style={{ "--rv-stagger-step": "80ms" } as React.CSSProperties}
        >
          {content.steps.map((step, index) => (
            <Reveal as="li" key={step.title} y={14}>
              <div className="flex items-center gap-3">
                <span className="auto-no" aria-hidden="true">
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

      <div className="mt-7">
        <ArrowLink href="/platform">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
