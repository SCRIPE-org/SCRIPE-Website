/**
 * BranchesStory (`#branches`) — the multi-branch convergence: many branches,
 * one organization, one operational picture.
 *
 * The section's artifact is a convergence flow inside a raised panel: four
 * example branch chips (accent-dotted) → chevron → the organization node
 * (brand mark + label) → chevron → the operational picture, set in the
 * brand's accent text color as the destination of the whole story. Chevrons
 * are direction-semantic and flip in RTL (`.rtl-flip`). A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";
import { ArrowLink } from "./ArrowLink";

/** Small forward chevron used between convergence stages. */
function FlowChevron() {
  return (
    <span className="rtl-flip text-text-muted grid place-items-center" aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </span>
  );
}

export interface BranchesStoryProps {
  /** The branches slice of the home page content. */
  content: HomeContent["branches"];
}

/**
 * Renders the branches header, the convergence panel and the link out to
 * the multi-sports solution page.
 *
 * @param props - See {@link BranchesStoryProps}.
 */
export function BranchesStory({ content }: BranchesStoryProps) {
  return (
    <Section id="branches" className="scroll-mt-24">
      <Reveal className="max-w-[760px]">
        <h2 className="font-display text-text-primary text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={22} className="mt-12">
        <div className="border-border-subtle bg-surface-raised flex flex-wrap items-center gap-5 rounded-lg border p-7">
          <div className="flex min-w-0 flex-wrap gap-2" data-rv-stagger>
            {content.chips.map((chip) => (
              <Reveal key={chip.name} y={8}>
                <span className="border-border-subtle text-text-secondary inline-flex min-h-7 items-center gap-2 rounded-full border px-3 text-[length:var(--fs-meta)] whitespace-nowrap">
                  <span
                    className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[chip.accent]}`}
                    aria-hidden="true"
                  />
                  {chip.name}
                </span>
              </Reveal>
            ))}
          </div>
          <FlowChevron />
          <span className="text-text-primary inline-flex items-center gap-2.5 text-[length:var(--fs-small)] font-medium whitespace-nowrap">
            <BrandMark size={22} className="text-text-primary shrink-0" />
            {content.orgLabel}
          </span>
          <FlowChevron />
          <span className="text-accent-text text-[length:var(--fs-small)] font-semibold whitespace-nowrap">
            {content.pictureLabel}
          </span>
        </div>
      </Reveal>

      <div className="mt-8">
        <ArrowLink href="/solutions/multi-sports-organizations">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
