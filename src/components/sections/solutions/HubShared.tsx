/**
 * HubShared — "the record underneath is the same in all four": a split
 * layout pairing the hub's closing argument (heading + deep link into the
 * platform page) with a bordered checklist panel of what never changes
 * between solutions.
 *
 * Ported from `backup/scripe-static/solutions.html`'s "shared" section.
 *
 * Task E4: the checklist panel moved from a flat `border` onto the shared
 * elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`). A
 * Server Component; `Reveal` is the only client leaf.
 */
import type { SolutionsHubContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export interface HubSharedProps {
  /** The shared-value slice of the hub's content. */
  content: SolutionsHubContent["shared"];
}

/**
 * Renders the split "what never changes" section.
 *
 * @param props - See {@link HubSharedProps}.
 */
export function HubShared({ content }: HubSharedProps) {
  return (
    <Section className="border-border-subtle border-t">
      <div className="flex flex-wrap items-center gap-10 lg:gap-14">
        <Reveal className="min-w-0 flex-1 basis-[420px]">
          <h2 className="atmo-title font-display text-text-primary max-w-[520px] text-[length:var(--fs-display)] text-balance">
            {content.title}
          </h2>
          <div className="mt-6">
            <Button href={content.href} size="lg">
              {content.cta}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100} y={20} className="min-w-0 flex-1 basis-[420px]">
          <div className="atmo-panel grid gap-3.5 rounded-lg p-7">
            {content.points.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-muted mt-1 shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="text-text-secondary text-[length:var(--fs-small)] text-pretty">{point}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
