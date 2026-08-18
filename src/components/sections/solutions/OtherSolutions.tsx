/**
 * OtherSolutions — the solution page template's cross-link section: the
 * other three solution shapes, each a `Card` with its own accent edge, the
 * shared `ShapeGlyph`, title, description and deep link — the identical
 * pattern `src/components/sections/home/SolutionsGrid.tsx` uses for its own
 * four-card grid on the home page (the same genuine "pick a shape" choice,
 * one click deeper).
 *
 * Content is not stored per solution page — `src/app/[locale]/solutions/[slug]/page.tsx`
 * derives `items` from `SolutionsHubContent["grid"]["items"]` (the hub's own
 * content, already registered under the `"solutions"` `PageId`), filtering
 * out the current slug, so the other three solutions' title/description/href
 * are authored exactly once rather than four times over.
 *
 * Task E4: each card gains the shadow half of the shared elevation ramp
 * (`.atmo-lift` — not the full `.atmo-panel` recipe, which would fight
 * `Card`'s own `border-t-*` accent-edge contract; see `atmo-lift`'s own
 * comment in `src/styles/tokens/atmosphere.css`). A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { SolutionsHubCard } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { toCardAccent } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { ShapeGlyph } from "./ShapeGlyph";

export interface OtherSolutionsProps {
  /** Section heading. */
  title: string;
  /** The other three solution cards (current slug already filtered out). */
  items: SolutionsHubCard[];
}

/**
 * Renders the cross-link header and the other three solution cards.
 *
 * @param props - See {@link OtherSolutionsProps}.
 */
export function OtherSolutions({ title, items }: OtherSolutionsProps) {
  return (
    <Section className="border-border-subtle border-t">
      <Reveal>
        <h2 className="atmo-title font-display text-text-primary max-w-[62ch] text-[length:var(--fs-h1)]">
          {title}
        </h2>
      </Reveal>

      <div
        className="mt-9 grid gap-5 sm:grid-cols-3"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {items.map((item) => (
          <Reveal key={item.href} y={16}>
            <Card accent={toCardAccent(item.accent)} className="atmo-lift flex h-full flex-col gap-4">
              <ShapeGlyph accent={item.accent} />
              <div className="flex-1">
                <h3 className="font-display text-text-primary text-[length:var(--fs-h3)] font-semibold">
                  {item.title}
                </h3>
                <p className="text-text-secondary mt-2 text-[length:var(--fs-small)] leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
              <ArrowLink href={item.href}>{item.cta}</ArrowLink>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
