/**
 * GuidesGrid (`#guides`) — the setup-guide card grid.
 *
 * Header uses the accent-dot + plain `<h2>` device
 * `src/components/sections/platform/CapabilityGroup.tsx` and
 * `src/components/sections/solutions/Capabilities.tsx` both use for their
 * own repeating section headers — not the tracked-uppercase `Eyebrow`-style
 * marker `ResourcesHero.tsx`/`ResourcesFaq.tsx` carry. This page has four
 * non-hero sections; repeating that hero marker on every one of them is
 * exactly the "eyebrow on every section" scaffolding the design doctrine
 * warns against, so — matching the platform/solutions precedent — only the
 * hero and the FAQ (which explicitly mirrors `PricingFaq.tsx`'s own marker,
 * per this task's brief) keep it.
 *
 * Every guide today is an honest "In preparation" card, ported verbatim from
 * `backup/scripe-static/resources.html`'s `#guides` section — no guide has a
 * reading page yet (see `ResourceItem`'s doc comment in
 * `src/content/types.ts` for the future-MDX contract these cards are
 * shaped for), so cards render as plain `<article>`s, never a `<Link>` that
 * would 404.
 *
 * Task E4: each card moved from a flat `border` onto the shared elevation
 * ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`), and the heading
 * onto the ground sequence's heavy title voice (`.atmo-title`). A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { ResourcesContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { GuideIcon } from "./icons";

export interface GuidesGridProps {
  /** The guides slice of the resources page content. */
  content: ResourcesContent["guides"];
}

/**
 * Renders the guides header and its card grid.
 *
 * @param props - See {@link GuidesGridProps}.
 */
export function GuidesGrid({ content }: GuidesGridProps) {
  return (
    <Section id="guides" className="scroll-mt-24">
      <Reveal className="flex items-center gap-2.5">
        <span className="bg-accent-academy inline-block size-2.5 rounded-full" aria-hidden="true" />
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-h1)]">
          {content.title}
        </h2>
      </Reveal>
      <Reveal className="mt-3 max-w-[62ch]">
        <p className="text-text-secondary text-[length:var(--fs-lead)] text-pretty">{content.subtitle}</p>
      </Reveal>

      <div
        className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.slug} y={20}>
            <article className="atmo-panel flex h-full flex-col gap-4 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="border-border-subtle text-accent-academy grid size-9 shrink-0 place-items-center rounded-md border">
                  <GuideIcon />
                </span>
                <h3 className="font-display text-text-primary min-w-0 flex-1 text-[length:var(--fs-h3)] font-semibold text-pretty">
                  {item.title}
                </h3>
              </div>
              <p className="text-text-secondary flex-1 text-[length:var(--fs-small)] text-pretty">{item.summary}</p>
              {item.tag && (
                <span className="border-border-subtle text-text-muted self-start rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] whitespace-nowrap">
                  {item.tag}
                </span>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      <p className="text-text-tertiary mt-6 text-[length:var(--fs-meta)]">{content.note}</p>
    </Section>
  );
}
