/**
 * MissionVision (`#mission`) — the company page's paired mission/vision
 * composition: flowing mission copy beside a bordered "Product vision"
 * checklist panel, exactly the two-column layout
 * `backup/scripe-static/company.html`'s own `#mission` section already
 * used. Kept as one section (one `Reveal`-staggered pair, one anchor id)
 * rather than split into two, since the legacy page never treated vision as
 * a separate page region — it is the mission's own supporting evidence.
 *
 * The checklist reuses the exact muted stroke glyph
 * `src/components/sections/pricing/PlanCards.tsx`'s `CheckGlyph` already
 * establishes for a feature checklist (ambient/neutral, not a "positive vs.
 * negative" comparison glyph) — kept as an independent copy per this
 * codebase's "self-contained page folder" convention, not a cross-page
 * import. The panel itself is the `Card` UI primitive: the one place on this
 * page a bordered surface is the right affordance (a single evidence panel
 * paired against prose, not a repeating grid — see
 * `src/components/ui/Card.tsx`'s own header on when a card earns its place).
 *
 * Neither column carries the tracked-uppercase eyebrow marker `CompanyHero`
 * reserves as this page's one hero device — matching the
 * `Capabilities.tsx`/`GuidesGrid.tsx` precedent of a plain accent-dot + `<h2>`
 * for every non-hero section, so the marker isn't repeated into the
 * "eyebrow on every section" scaffolding the design doctrine warns against.
 * A Server Component; `Reveal` is the only client leaf.
 */
import type { CompanyContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export interface MissionVisionProps {
  /** The mission slice of the company page content. */
  mission: CompanyContent["mission"];
  /** The paired vision-checklist slice. */
  vision: CompanyContent["vision"];
}

/** Muted checklist glyph — see this file's header for why it's a
 *  page-scoped copy of `PlanCards.tsx`'s `CheckGlyph`. */
function CheckGlyph() {
  return (
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
      className="text-text-secondary mt-0.5 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Renders the mission copy beside the product-vision checklist panel.
 *
 * @param props - See {@link MissionVisionProps}.
 */
export function MissionVision({ mission, vision }: MissionVisionProps) {
  return (
    <Section id="mission" className="scroll-mt-24">
      <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="flex items-center gap-2.5">
            <span className="bg-accent inline-block size-2.5 rounded-full" aria-hidden="true" />
            <h2 className="font-display text-text-primary text-[length:var(--fs-h1)] font-semibold text-balance [font-variation-settings:'wdth'_114]">
              {mission.title}
            </h2>
          </div>
          <p className="text-text-secondary mt-6 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
            {mission.scenario}
          </p>
          <p className="text-text-tertiary mt-4 max-w-[62ch] text-[length:var(--fs-body)] text-pretty">
            {mission.audience}
          </p>
        </Reveal>

        <Reveal y={20} delay={90}>
          {/* No padding override: Card's own `p-6` is left as-is rather than
              layered with a conflicting `p-7` — see this file's header for
              why every other `<Card>` caller in this codebase only ever adds
              non-conflicting utilities (gap, flex, hover) rather than
              re-declaring a property Card itself already sets. */}
          <Card className="grid gap-5">
            <span className="text-accent-text text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {vision.label}
            </span>
            <ul className="m-0 grid list-none gap-3 p-0">
              {vision.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckGlyph />
                  <span className="text-text-primary text-[length:var(--fs-small)] text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
