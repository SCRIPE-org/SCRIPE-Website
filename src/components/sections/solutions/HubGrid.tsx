/**
 * HubGrid (`#all`) — the hub's four solution gateways.
 *
 * A genuine four-way choice, so `Card` is the honest affordance here — the
 * same "one card grid on the page" contract
 * `src/components/sections/home/SolutionsGrid.tsx` documents for its own,
 * near-identical grid (that component's cards link to the same four routes;
 * this one adds each card's mini stat row, ported from the legacy hub
 * page's own richer cards). Each card also gets a subtle accent-tinted
 * hover wash (`.sol-grid-card`, `src/styles/solutions.css` §4) — the same
 * idiom `src/styles/home.css` §10 gives the home page's product-family
 * rows.
 *
 * Task E4: the section sits on a quiet centered ground glow (`.atmo`,
 * `.sol-grid-atmo` in `solutions.css` §1b) and each card gains the shadow
 * half of the shared elevation ramp (`.atmo-lift` — not the full
 * `.atmo-panel` recipe, which would fight `Card`'s own `border-t-*`
 * accent-edge contract; see `atmo-lift`'s own comment in
 * `src/styles/tokens/atmosphere.css`). A Server Component; `Reveal` is the
 * only client leaf.
 */
import type { SolutionsHubContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ACCENT_VAR, toCardAccent } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { ShapeGlyph } from "./ShapeGlyph";

export interface HubGridProps {
  /** The grid slice of the hub's content. */
  content: SolutionsHubContent["grid"];
}

/**
 * Renders the grid header and the four solution cards.
 *
 * @param props - See {@link HubGridProps}.
 */
export function HubGrid({ content }: HubGridProps) {
  return (
    <Section id="all" className="atmo sol-grid-atmo scroll-mt-24">
      <Reveal className="max-w-[1040px]">
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div
        className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.href} y={20}>
            <Card
              accent={toCardAccent(item.accent)}
              className="atmo-lift sol-grid-card flex h-full flex-col gap-5"
              style={{ "--sol-accent": ACCENT_VAR[item.accent] } as React.CSSProperties}
            >
              <ShapeGlyph accent={item.accent} />
              <div className="flex-1">
                <h3 className="font-display text-text-primary text-[length:var(--fs-lead)] font-semibold">
                  {item.title}
                </h3>
                <p className="text-text-secondary mt-2 text-[length:var(--fs-small)] leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
              <div className="border-border-subtle grid gap-1.5 border-t pt-4">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-text-secondary min-w-0 flex-1 truncate text-[length:var(--fs-meta)]">
                      {stat.label}
                    </span>
                    <span className="text-text-muted text-[length:var(--fs-meta)] tabular-nums whitespace-nowrap">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
              <ArrowLink href={item.href}>{item.cta}</ArrowLink>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
