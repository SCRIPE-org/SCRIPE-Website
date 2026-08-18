/**
 * OperatingPrinciples (`#principles`) — "Four things we hold to.", ported
 * from `backup/scripe-static/company.html`'s "How we build" section.
 *
 * Rendered as borderless icon-tile rows — the same idiom
 * `src/components/sections/solutions/Capabilities.tsx` uses for its own
 * "what this actually runs on" grid (see that file's header for why a
 * bordered `Card` grid would be the generic-grid default here) — plus one
 * addition genuinely earned by this section's own heading: a tabular-nums
 * ordinal (`01`–`04`, derived from array position, never stored as content)
 * beside each tile. This is NOT the banned per-section "01 / 02 / 03"
 * eyebrow scaffolding (see the frontend design doctrine's absolute-bans
 * list) — no other section on this page, or this site, numbers itself; it
 * is a single, deliberate numbered sequence inside the one section whose own
 * copy is literally "Four things we hold to," where the count is the point.
 *
 * A Server Component; `Reveal` is the only client leaf.
 */
import type { CompanyContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_TEXT_CLASS } from "./accents";
import { PrincipleIcon } from "./icons";

export interface OperatingPrinciplesProps {
  /** The principles slice of the company page content. */
  content: CompanyContent["principles"];
}

/**
 * Renders the operating-principles header and its numbered icon-row grid.
 *
 * @param props - See {@link OperatingPrinciplesProps}.
 */
export function OperatingPrinciples({ content }: OperatingPrinciplesProps) {
  return (
    <Section id="principles" className="scroll-mt-24">
      <Reveal className="flex items-center gap-2.5">
        <span className="bg-accent inline-block size-2.5 rounded-full" aria-hidden="true" />
        <h2 className="font-display text-text-primary text-[length:var(--fs-h1)] font-semibold text-balance [font-variation-settings:'wdth'_114]">
          {content.title}
        </h2>
      </Reveal>
      <Reveal className="mt-3 max-w-[62ch]">
        <p className="text-text-secondary text-[length:var(--fs-lead)] text-pretty">{content.subtitle}</p>
      </Reveal>

      <div
        className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "80ms" } as React.CSSProperties}
      >
        {content.items.map((item, index) => (
          <Reveal key={item.id} y={16}>
            <div className="flex items-center justify-between">
              <span
                className={`border-border-subtle grid size-9 shrink-0 place-items-center rounded-md border ${
                  item.accent ? ACCENT_TEXT_CLASS[item.accent] : "text-text-secondary"
                }`}
                aria-hidden="true"
              >
                <PrincipleIcon id={item.id} />
              </span>
              <span className="font-display text-text-tertiary text-[length:var(--fs-h3)] tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
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
