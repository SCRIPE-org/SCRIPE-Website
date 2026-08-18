/**
 * CapabilityGroup — one product-family grouping: an accent-dotted family
 * name, its one-sentence blurb, and its capability modules as alternating
 * `ModuleRow`s under a shared hairline divider.
 *
 * The family name uses the same accent-dot + label device
 * `ProductFamily.tsx`'s row markers use on the home page (not the tracked
 * uppercase `Eyebrow` kicker — that device is reserved for the page's one
 * hero marker, so it never repeats as scaffolding across all five groups).
 * A Server Component; `Reveal` is the only client leaf.
 */
import type { CapabilityGroup as CapabilityGroupContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { ACCENT_DOT_CLASS } from "./accents";
import { ModuleRow } from "./ModuleRow";

export interface CapabilityGroupProps {
  /** The group's content. */
  group: CapabilityGroupContent;
}

/**
 * Renders one family group: header + its modules' alternating rows.
 *
 * @param props - See {@link CapabilityGroupProps}.
 */
export function CapabilityGroup({ group }: CapabilityGroupProps) {
  return (
    <div id={group.id} className="cap-anchor">
      <Reveal className="border-border-subtle border-t pt-10">
        <div className="flex items-center gap-2.5">
          <span className={`inline-block size-2.5 rounded-full ${ACCENT_DOT_CLASS[group.accent]}`} aria-hidden="true" />
          <h2 className="font-display text-text-primary text-[length:var(--fs-h2)] font-semibold [font-variation-settings:'wdth'_114]">
            <bdi>{group.name}</bdi>
          </h2>
        </div>
        <p className="text-text-secondary mt-3 max-w-[62ch] text-[length:var(--fs-body)] text-pretty">
          {group.blurb}
        </p>
      </Reveal>

      <div>
        {group.modules.map((module, index) => (
          <ModuleRow key={module.id} module={module} accent={group.accent} index={index} />
        ))}
      </div>
    </div>
  );
}
