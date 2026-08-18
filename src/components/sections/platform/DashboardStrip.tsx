/**
 * DashboardStrip (`#dashboard`) — the catalog's closing payoff statement:
 * every module resolves into one dashboard, proven by reprising the
 * Reports module's own three stats rather than re-describing them inside a
 * separate hand-built mockup.
 *
 * The legacy static page's "product experience" section built a full
 * fake-app-chrome screenshot (sidebar rail, top bar, search field) around
 * these same figures; that scope is intentionally not ported here (see
 * `src/content/en/platform.ts`'s file header) — a wide three-stat strip
 * makes the same honest claim with the same evidence, at a fraction of the
 * markup and none of the maintenance surface. A Server Component; `Reveal`
 * is the only client leaf.
 */
import type { PlatformContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface DashboardStripProps {
  /** The dashboard slice of the platform page content. */
  content: PlatformContent["dashboard"];
}

/**
 * Renders the dashboard strip header and its three-stat evidence row.
 *
 * @param props - See {@link DashboardStripProps}.
 */
export function DashboardStrip({ content }: DashboardStripProps) {
  return (
    <Section id="dashboard" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-[720px] text-center">
        <p className="text-accent-text flex items-center justify-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h2 className="font-display text-text-primary mt-5 text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h2>
        <p className="text-text-secondary mx-auto mt-5 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={24} className="mt-12">
        <div className="border-border-subtle bg-surface-raised overflow-hidden rounded-lg border shadow-[0_24px_60px_-32px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border-subtle grid min-w-0 flex-1 basis-52 gap-1.5 border-s px-8 py-8 text-center first:border-s-0 sm:text-start"
              >
                <span
                  className="font-display text-text-primary mx-auto text-[length:var(--fs-h1)] leading-[1.05] font-semibold tracking-[-0.015em] tabular-nums sm:mx-0 [font-variation-settings:'wdth'_114]"
                >
                  {stat.value}
                </span>
                <span className="text-text-secondary text-[length:var(--fs-small)]">{stat.label}</span>
                {stat.caption && (
                  <span className="text-text-muted text-[length:var(--fs-meta)]">{stat.caption}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
