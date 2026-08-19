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
 * markup and none of the maintenance surface.
 *
 * WAVE I: the section now carries the page's only photograph, between the
 * heading and the stats. `/platform` had no imagery at all — thirteen modules
 * and a stats row, entirely typographic — and this is the one claim on it that
 * asks to be shown somewhere real.
 *
 * The photograph is an EMPTY operations room, and that is the whole point. A
 * section headlined "every module resolves into one dashboard" is precisely
 * where a generated screenshot stops being decoration and becomes fabricated
 * product evidence: a reader would take it as what our software looks like.
 * Two delivered alternates that DO show a legible screen are parked unused for
 * that reason (`assets/unused/platform-desk-peopled-*`). The room makes the
 * honest version of the same argument — somebody runs this place, and they
 * close the day at this desk — and the stats directly below it stay the actual
 * evidence, which is what they always were.
 *
 * Task E4: the marker reuses the hero's mono film-grammar (see
 * `CapabilityHero.tsx`'s header), the strip sits in a quiet cool ground glow
 * (`.atmo`, `.cap-dashboard-atmo` in `platform.css` §5 — no grain, this
 * section is a content payoff, not a hero-toned moment), and the stat panel
 * moves off its old one-off `shadow-[...]` onto the shared elevation ramp
 * (`.atmo-panel`, `src/styles/tokens/atmosphere.css`). A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { PlatformContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { PlatePhoto } from "@/components/ui/PlatePhoto";
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
    <Section id="dashboard" className="atmo cap-dashboard-atmo cap-anchor">
      <Reveal className="mx-auto max-w-[720px] text-center">
        <p className="text-accent-text flex items-center justify-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h2 className="atmo-title font-display text-text-primary mt-5 text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h2>
        <p className="text-text-secondary mx-auto mt-5 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal y={24} className="mt-12">
        {/* 1915×821 native 21:9 — a wide room shot whose subject is the length
            of the desk against the glass, so it keeps its own ratio rather
            than being cropped to the 4:5 the sub-page heroes use. `sizes`
            mirrors `Section`'s own max width. */}
        <PlatePhoto
          src="/media/platform/operations-desk.webp"
          alt={content.imageAlt}
          width={1915}
          height={821}
          sizes="(min-width: 1200px) 1120px, 100vw"
        />
      </Reveal>

      <Reveal y={24} className="mt-10">
        <div className="atmo-panel overflow-hidden rounded-lg">
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
