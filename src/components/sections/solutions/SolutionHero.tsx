/**
 * SolutionHero — the shared hero every solution page's `[slug]` template
 * opens on: a typography-led intro (in the same spirit as the platform
 * page's `CapabilityHero` — see that file's own header for why interior
 * pages open on type, not a cinematic camera hero) beside the legacy
 * static site's "what this looks like" mini evidence panel
 * (`backup/scripe-static/solutions/*.html`).
 *
 * The one structural difference from `CapabilityHero`: this hero's marker
 * rule, label and snapshot accents all read the page's own product-world
 * `accent` prop instead of the brand-wide lime `--accent-text` — the single
 * most visible signal that carries each solution's distinct personality
 * through the shared template (per the task brief's "distinct per-solution
 * personality via accent identity, single coherent template"). A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { AccentId, SolutionContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS } from "./accents";

export interface SolutionHeroProps {
  /** The hero slice of the solution page's content. */
  content: SolutionContent["hero"];
  /** Product-world accent identity for this solution. */
  accent: AccentId;
}

/**
 * Renders the solution page's hero: marker + heading + subtitle + CTAs
 * beside the accent-colored snapshot panel.
 *
 * @param props - See {@link SolutionHeroProps}.
 */
export function SolutionHero({ content, accent }: SolutionHeroProps) {
  return (
    <Section className="!pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <div className="flex flex-wrap items-center gap-10 lg:gap-14">
        <Reveal className="min-w-0 flex-1 basis-[480px]">
          <p
            className={`flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case ${ACCENT_TEXT_CLASS[accent]}`}
          >
            <span className={`inline-block h-px w-6 ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
            {content.eyebrow}
          </p>
          <h1 className="font-display text-text-primary mt-5 text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
            {content.title}
          </h1>
          <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact" size="lg">
              {content.primaryCta}
            </Button>
            <Button href="/pricing" size="lg" variant="outline">
              {content.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="min-w-0 flex-1 basis-72 lg:max-w-[320px]">
          <div className="border-border-subtle bg-surface-raised grid gap-3 rounded-lg border p-6">
            <span className={`text-[length:var(--fs-meta)] font-semibold ${ACCENT_TEXT_CLASS[accent]}`}>
              {content.snapshot.label}
            </span>
            {content.snapshot.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span
                  className={`inline-block size-1.5 shrink-0 rounded-[1px] ${ACCENT_DOT_CLASS[accent]}`}
                  aria-hidden="true"
                />
                <span className="text-text-secondary min-w-0 flex-1 truncate text-[length:var(--fs-small)]">
                  {stat.label}
                </span>
                <span className="text-text-muted text-[length:var(--fs-meta)] tabular-nums whitespace-nowrap">
                  {stat.value}
                </span>
              </div>
            ))}
            <span className="border-border-subtle text-text-muted border-t pt-3 text-[length:var(--fs-meta)] text-pretty">
              {content.snapshot.note}
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
