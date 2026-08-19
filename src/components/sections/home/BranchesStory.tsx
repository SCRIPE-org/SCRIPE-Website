/**
 * BranchesStory (`#branches`) — the multi-branch convergence: many branches,
 * one organization, one operational picture (ground slate `09 / Branches` —
 * see `Slate.tsx`).
 *
 * Task E3 recomposes the old single-row chip strip into a real convergence
 * diagram inside a deep panel (`.conv`, `src/styles/home.css` §13): a 2×2
 * grid of elevated branch chips (accent-dotted `.chip-lit` surfaces) →
 * fading connector rail → the organization node (brand mark on its own lit
 * surface) → rail → the operational picture, set in the brand accent with a
 * soft glow — the section's one lime moment and the destination of the
 * whole story. The `.gs-branches` atmosphere pools cool light at the
 * diagram's center. Rails are symmetric fades (direction-proof — no
 * chevrons to flip); on narrow viewports the diagram stacks vertically and
 * the rails turn vertical with it. A Server Component; `Reveal` is the only
 * client leaf.
 */
import type { HomeContent } from "@/content/types";
import { BrandMark } from "@/components/chrome/BrandMark";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { Slate } from "./Slate";

export interface BranchesStoryProps {
  /** The branches slice of the home page content. */
  content: HomeContent["branches"];
}

/**
 * Renders the branches header, the convergence diagram and the link out to
 * the multi-sports solution page.
 *
 * @param props - See {@link BranchesStoryProps}.
 */
export function BranchesStory({ content }: BranchesStoryProps) {
  return (
    <Section id="branches" className="gs gs-branches scroll-mt-24">
      <Reveal className="max-w-[1040px]">
        <Slate no="09" label={content.stamp} />
        <h2 className="gs-title">{content.title}</h2>
        <p className="text-text-secondary mt-4 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={22} className="mt-9">
        <div className="panel panel-deep p-7 sm:p-9">
          <div className="conv">
            <div className="grid w-[320px] max-w-full grid-cols-2 gap-2.5" data-rv-stagger>
              {content.chips.map((chip) => (
                <Reveal key={chip.name} y={8}>
                  <span className="chip-lit text-text-secondary flex min-h-9 items-center justify-center gap-2 rounded-full px-3 text-[length:var(--fs-meta)] whitespace-nowrap">
                    <span
                      className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[chip.accent]}`}
                      aria-hidden="true"
                    />
                    {chip.name}
                  </span>
                </Reveal>
              ))}
            </div>
            <span className="conv-rail" aria-hidden="true" />
            <span className="conv-node chip-lit text-text-primary text-[length:var(--fs-small)] font-medium">
              <BrandMark size={22} decorative />
              {content.orgLabel}
            </span>
            <span className="conv-rail" aria-hidden="true" />
            <span className="conv-dest text-[length:var(--fs-small)]">{content.pictureLabel}</span>
          </div>
        </div>
      </Reveal>

      <div className="mt-7">
        <ArrowLink href="/solutions/multi-sports-organizations">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
