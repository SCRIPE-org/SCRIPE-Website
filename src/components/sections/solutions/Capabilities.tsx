/**
 * Capabilities — the shared "what this actually runs on" section of the
 * solution page template: an accent-dotted header (the same device
 * `src/components/sections/platform/CapabilityGroup.tsx` uses for its own
 * family headers, not the tracked-uppercase `Eyebrow` kicker — that stays
 * reserved for the page's one hero marker) above a responsive icon-tile
 * grid.
 *
 * Tiles are deliberately borderless rows (an icon tile + heading + sentence,
 * the same idiom `src/components/sections/platform/ModuleRow.tsx` uses for
 * its feature bullets) rather than bordered `Card`s — the hub page's
 * solution grid is this template's one legitimate card moment; repeating
 * `Card` here for a same-page feature listing would be the generic-grid
 * default the design doctrine warns against. Ported from
 * `backup/scripe-static/solutions/*.html`'s "focus" section. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { AccentId, SolutionContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS } from "./accents";
import { CapabilityIcon } from "./CapabilityIcon";

export interface CapabilitiesProps {
  /** The capabilities slice of the solution page's content. */
  content: SolutionContent["capabilities"];
  /** Product-world accent identity for this solution. */
  accent: AccentId;
}

/**
 * Renders the capabilities header and its icon-tile grid.
 *
 * @param props - See {@link CapabilitiesProps}.
 */
export function Capabilities({ content, accent }: CapabilitiesProps) {
  return (
    <Section className="border-border-subtle border-t">
      <Reveal className="flex items-center gap-2.5">
        <span className={`inline-block size-2.5 rounded-full ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
        <h2 className="font-display text-text-primary text-[length:var(--fs-h1)] font-semibold text-balance [font-variation-settings:'wdth'_114]">
          {content.title}
        </h2>
      </Reveal>
      <Reveal className="mt-3 max-w-[62ch]">
        <p className="text-text-secondary text-[length:var(--fs-lead)] text-pretty">{content.subtitle}</p>
      </Reveal>

      <div
        className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
        data-rv-stagger
        style={{ "--rv-stagger-step": "70ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.title} y={14}>
            <div className="flex items-center gap-3">
              <CapabilityIcon icon={item.icon} className={ACCENT_TEXT_CLASS[accent]} />
              <h3 className="font-display text-text-primary min-w-0 text-[length:var(--fs-h3)] font-semibold">
                {item.title}
              </h3>
            </div>
            <p className="text-text-secondary mt-3 text-[length:var(--fs-small)] leading-relaxed text-pretty">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
