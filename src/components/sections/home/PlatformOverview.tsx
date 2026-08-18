/**
 * PlatformOverview (`#platform`) — the core narrative section: what the
 * operating system is, proven by a live-looking operations board.
 *
 * Split composition: a start column carrying the section's one marker
 * (small lime rule + label — deliberately the only section on the page with
 * this device), headline, supporting sentence and both CTAs; an end column
 * holding the operations-board evidence panel — a real schedule surface
 * with times, activities, owners and status chips, honestly badged as
 * product evidence. Below both: the platform's capability modules as an
 * accent-dotted chip row and the deep link to the full capability list.
 * Status tones map to themed accent tokens (`positive` = jade, `live` =
 * lime, `attention` = rust) so both themes hold contrast. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { HomeContent, StatusTone } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";
import { ArrowLink } from "./ArrowLink";

/** Status-chip classes per tone — themed accent text on a hairline chip. */
const TONE_CLASS: Record<StatusTone, string> = {
  positive: "text-accent-venue",
  live: "text-accent-text",
  attention: "text-accent-club",
};

export interface PlatformOverviewProps {
  /** The platform slice of the home page content. */
  content: HomeContent["platform"];
}

/**
 * Renders the platform overview split, the module chip row and the deep
 * link.
 *
 * @param props - See {@link PlatformOverviewProps}.
 */
export function PlatformOverview({ content }: PlatformOverviewProps) {
  return (
    <Section id="platform" className="scroll-mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="text-accent-text flex items-center gap-3 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
            <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
            {content.label}
          </p>
          <h2 className="font-display text-text-primary mt-5 text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
            {content.title}
          </h2>
          <p className="text-text-secondary mt-5 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/platform">{content.primaryCta}</Button>
            <Button href="/contact" variant="outline">
              {content.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal y={28} className="lg:col-span-7">
          <div className="border-border-subtle bg-surface-raised overflow-hidden rounded-lg border shadow-[0_24px_60px_-32px_rgba(0,0,0,0.4)]">
            <div className="border-border-subtle flex flex-wrap items-center gap-3 border-b px-6 py-4">
              <span className="bg-accent inline-block size-2 rounded-[2px]" aria-hidden="true" />
              <span className="text-text-primary text-[length:var(--fs-small)] font-medium">
                {content.board.title}
              </span>
              <span className="flex-1" />
              <span className="border-border-subtle text-text-muted rounded-full border px-3 py-1 text-[length:var(--fs-meta)]">
                {content.board.badge}
              </span>
            </div>
            <ul className="m-0 list-none p-0">
              {content.board.rows.map((row) => (
                <li
                  key={row.time}
                  className="border-border-subtle flex flex-wrap items-center gap-x-5 gap-y-1 border-b px-6 py-4 last:border-b-0"
                >
                  <span className="font-display text-text-muted w-12 text-[length:var(--fs-small)] font-semibold tabular-nums">
                    {row.time}
                  </span>
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="text-text-primary block text-[length:var(--fs-small)] font-medium">
                      {row.activity}
                    </span>
                    <span className="text-text-muted block text-[length:var(--fs-meta)]">
                      {row.detail}
                    </span>
                  </span>
                  <span className="text-text-muted hidden text-[length:var(--fs-meta)] sm:block">
                    {row.owner}
                  </span>
                  <span
                    className={`border-border-subtle rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] font-medium whitespace-nowrap ${TONE_CLASS[row.tone]}`}
                  >
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-wrap gap-2.5" data-rv-stagger>
        {content.modules.map((module) => (
          <Reveal key={module.name} y={8}>
            <span className="border-border-subtle text-text-secondary inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[length:var(--fs-small)] font-medium">
              <span
                className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[module.accent]}`}
                aria-hidden="true"
              />
              {module.name}
            </span>
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <ArrowLink href="/platform">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
