/**
 * PlatformOverview (`#platform`) — the core narrative section: what the
 * operating system is, proven by a live-looking operations board (ground
 * slate `06 / Platform` — see `Slate.tsx`; the slate reuses this section's
 * existing `label` content key).
 *
 * Split composition: a start column carrying the slate, headline, supporting
 * sentence and both CTAs; an end column holding the operations-board
 * evidence panel — a real schedule surface with times, activities, owners
 * and status chips, honestly badged as product evidence (row names and
 * times are a staged example, not live customer data — the single header
 * badge says so). A cleanup wave removed a second, redundant mono
 * "Illustrative" tag that used to sit beside that badge: doubling the same
 * disclosure read as defensive over-explaining rather than honest. The
 * canonical "this is sample data" footnote for the product itself lives on
 * `/platform`'s per-module evidence panels (`CapabilityEvidence.tsx`) —
 * this teaser board keeps its one plain badge and nothing more. Task E3
 * gives the board 3D presence: it rests slightly turned toward the copy like a desk
 * monitor (`.board-scene`/`.board-3d`, `src/styles/home.css` §13 — physical
 * rotation, flipped in RTL via `--tilt-dir`), levels flat on hover, and —
 * where CSS scroll-driven animation is supported and motion allowed —
 * swings in from a deeper angle as the section enters. The section ground
 * is the `.gs-platform` atmosphere (faint schedule-grid lines + a cool glow
 * behind the board; dark theme only). The board's "in session" row carries
 * the section's one lime moment (`.board-live`). Below both: the platform's
 * capability modules as elevated accent-dotted chips and the deep link to
 * the full capability list. Status tones map to themed accent tokens
 * (`positive` = jade, `live` = lime, `attention` = rust) so both themes
 * hold contrast. A Server Component; `Reveal` is the only client leaf.
 */
import type { HomeContent, StatusTone } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { Slate } from "./Slate";

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
    <Section id="platform" className="gs gs-platform scroll-mt-24">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Slate no="06" label={content.label} />
          {/* Interlude scale, not the full display tier: this heading lives
              in a 5-of-12 column beside the operations board, and `--fs-display`
              (now 5.5rem at wide viewports — Task G2) would run it to six or
              seven lines in that measure. The ramp's second rung is the
              correct tier for a column-constrained heading. */}
          <h2 className="gs-title gs-title-sm">{content.title}</h2>
          <p className="text-text-secondary mt-4 max-w-[58ch] text-[length:var(--fs-lead)] text-pretty">
            {content.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/platform">{content.primaryCta}</Button>
            <Button href="/contact" variant="outline">
              {content.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal y={28} className="lg:col-span-7">
          <div className="board-scene">
            <div className="board-3d panel overflow-hidden">
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
                    className={`border-border-subtle flex flex-wrap items-center gap-x-5 gap-y-1 border-b px-6 py-4 last:border-b-0 ${
                      row.tone === "live" ? "board-live" : ""
                    }`}
                  >
                    <span className="font-mono text-text-muted w-12 text-[length:var(--fs-small)] font-semibold tabular-nums">
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
          </div>
        </Reveal>
      </div>

      <div className="mt-10 flex flex-wrap gap-2.5" data-rv-stagger>
        {content.modules.map((module) => (
          <Reveal key={module.name} y={8}>
            <span className="chip-lit text-text-secondary inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[length:var(--fs-small)] font-medium">
              <span
                className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[module.accent]}`}
                aria-hidden="true"
              />
              {module.name}
            </span>
          </Reveal>
        ))}
      </div>

      <div className="mt-7">
        <ArrowLink href="/platform">{content.deepLink}</ArrowLink>
      </div>
    </Section>
  );
}
