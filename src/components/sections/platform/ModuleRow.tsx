/**
 * ModuleRow — one capability module's detail row: a text panel (name, an
 * honesty badge when the module carries one, lead sentence and four feature
 * bullets) alongside its `CapabilityEvidence` panel.
 *
 * Rows alternate which side carries the text vs. the evidence panel by
 * index parity, using CSS `order` rather than a physical `flex-direction`
 * flip — `order` reflows along the inline axis, which already follows
 * `dir`, so the zig-zag rhythm mirrors correctly in RTL with no
 * `[dir="rtl"]` override needed. A Server Component; `Reveal` is the only
 * client leaf.
 */
import type { AccentId, CapabilityModule } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { CapabilityEvidence } from "./CapabilityEvidence";

export interface ModuleRowProps {
  /** The module's content. */
  module: CapabilityModule;
  /** The owning group's product-family accent. */
  accent: AccentId;
  /** Position within the group — even indices lead with text, odd indices
   *  lead with the evidence panel. */
  index: number;
}

/**
 * Renders one alternating module detail row.
 *
 * @param props - See {@link ModuleRowProps}.
 */
export function ModuleRow({ module, accent, index }: ModuleRowProps) {
  const textFirst = index % 2 === 0;

  return (
    <div id={module.id} className="cap-anchor grid items-center gap-x-10 gap-y-8 py-10 md:grid-cols-12">
      <Reveal className={`md:col-span-5 ${textFirst ? "md:order-1" : "md:order-2"}`}>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-text-primary text-[length:var(--fs-h1)] font-semibold [font-variation-settings:'wdth'_114]">
            {module.name}
          </h3>
          {module.roadmapNote && (
            <span className="border-border-subtle text-text-muted rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] whitespace-nowrap">
              {module.roadmapNote}
            </span>
          )}
        </div>
        <p className="text-text-secondary mt-4 max-w-[52ch] text-[length:var(--fs-lead)] text-pretty">
          {module.lead}
        </p>
        <ul className="mt-6 grid list-none gap-3 p-0">
          {module.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
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
              <span className="text-text-secondary text-[length:var(--fs-small)] text-pretty">{feature}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal y={20} className={`md:col-span-7 ${textFirst ? "md:order-2" : "md:order-1"}`}>
        <CapabilityEvidence evidence={module.evidence} accent={accent} />
      </Reveal>
    </div>
  );
}
