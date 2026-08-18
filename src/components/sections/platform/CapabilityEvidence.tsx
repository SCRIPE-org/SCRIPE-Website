/**
 * CapabilityEvidence — the product-evidence panel every capability module
 * row carries, in the same honest spirit as the home page's operations
 * board (`PlatformOverview`'s `.board`): real-shaped product data, always
 * badged as illustrative.
 *
 * One component renders all five evidence shapes a module's content can
 * declare (`ModuleEvidence["kind"]` in `src/content/types.ts`) rather than
 * thirteen bespoke panel designs: `"rows"` (a record list — a member, a
 * payment, a fixture...), `"stats"` (a headline-figure strip), `"meters"` (a
 * labelled percentage list), `"grid"` (Reservations' booking-style time
 * grid) and `"chips"` (Branches' labelled pill cluster). Every variant
 * shares the same header (an accent dot in the module's own family color,
 * the panel's own title, and a "Sample data"-style badge) and an optional
 * footer note, so the thirteen panels read as one system.
 *
 * A single-accent discipline replaces the legacy static page's per-row
 * rainbow of unrelated semantic colors (positive/attention/interactive
 * tokens mixed with product-accent tokens row by row): here every panel
 * uses exactly one accent (its module's own family color) for the header
 * dot, stat rules and meter fills, and reserves `EvidenceTone` (positive /
 * attention / neutral) only for status-carrying badges — the same
 * positive-is-jade, attention-is-rust convention `PlatformOverview`'s
 * `TONE_CLASS` already established on the home page.
 *
 * Task E4: the panel's old one-off `shadow-[...]` moved onto the shared
 * elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`) — the
 * same edge-highlight + shadow-2 recipe every other raised sub-page surface
 * now uses, in place of a bespoke box-shadow value.
 *
 * A Server Component — no hooks, no client JS.
 */
import type { AccentId, EvidenceTone, ModuleEvidence } from "@/content/types";
import { ACCENT_DOT_CLASS } from "./accents";

export interface CapabilityEvidenceProps {
  /** The module's evidence panel content. */
  evidence: ModuleEvidence;
  /** The owning module's product-family accent — carries through the
   *  header dot, stat rules and meter fills. */
  accent: AccentId;
}

/** Trailing-badge / slot-cell classes per {@link EvidenceTone}, reusing the
 *  home page's jade-positive / rust-attention convention; `"neutral"` is an
 *  uncolored bordered chip. */
const TONE_CLASS: Record<EvidenceTone, string> = {
  positive: "text-accent-venue border-border-subtle",
  attention: "text-accent-club border-border-subtle",
  neutral: "text-text-secondary border-border-subtle",
};

/** Shared panel header: accent dot, title label, and a trailing badge. */
function PanelHead({ title, badge, accent }: { title: string; badge: string; accent: AccentId }) {
  return (
    <div className="border-border-subtle flex flex-wrap items-center gap-3 border-b px-6 py-4">
      <span className={`inline-block size-2 rounded-[2px] ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
      <span className="text-text-primary text-[length:var(--fs-small)] font-medium">{title}</span>
      <span className="flex-1" />
      <span className="border-border-subtle text-text-muted rounded-full border px-3 py-1 text-[length:var(--fs-meta)] whitespace-nowrap">
        {badge}
      </span>
    </div>
  );
}

/** Shared footer note, rendered under any variant's body when present. */
function PanelNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <div className="border-border-subtle border-t px-6 py-4">
      <span className="text-text-muted text-[length:var(--fs-meta)] text-pretty">{note}</span>
    </div>
  );
}

/**
 * Renders a module's evidence panel, switching on `evidence.kind`.
 *
 * @param props - See {@link CapabilityEvidenceProps}.
 */
export function CapabilityEvidence({ evidence, accent }: CapabilityEvidenceProps) {
  return (
    <div className="atmo-panel overflow-hidden rounded-lg">
      <PanelHead title={evidence.title} badge={evidence.badge} accent={accent} />

      {evidence.kind === "rows" && (
        <>
          <ul className="m-0 list-none p-0">
            {evidence.rows.map((row, index) => (
              <li
                key={`${row.primary}-${index}`}
                className="border-border-subtle flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-6 py-4 last:border-b-0"
              >
                {row.leading && (
                  <span className="text-text-muted w-9 shrink-0 text-[length:var(--fs-small)] font-medium">
                    {row.leading}
                  </span>
                )}
                <span className="min-w-0 flex-1 basis-40">
                  <span className="text-text-primary block text-[length:var(--fs-small)] font-medium">
                    {row.primary}
                  </span>
                  {row.secondary && (
                    <span className="text-text-muted block text-[length:var(--fs-meta)]">{row.secondary}</span>
                  )}
                </span>
                {row.trailing && (
                  <span
                    className={`rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] font-medium whitespace-nowrap ${TONE_CLASS[row.trailingTone ?? "neutral"]}`}
                  >
                    {row.trailing}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <PanelNote note={evidence.note} />
        </>
      )}

      {evidence.kind === "stats" && (
        <div className="flex flex-wrap">
          {evidence.stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border-subtle grid min-w-0 flex-1 basis-40 gap-1.5 border-t border-s px-6 py-6 first:border-s-0"
            >
              <span className={`inline-block h-0.5 w-5 ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
              <span className="font-display text-text-primary text-[1.625rem] leading-[1.05] font-semibold tracking-[-0.015em] tabular-nums whitespace-nowrap [font-variation-settings:'wdth'_114]">
                {stat.value}
              </span>
              <span className="text-text-muted text-[length:var(--fs-small)]">{stat.label}</span>
              {stat.caption && <span className="text-text-muted text-[length:var(--fs-meta)]">{stat.caption}</span>}
            </div>
          ))}
        </div>
      )}

      {evidence.kind === "meters" && (
        <>
          <div className="grid gap-5 px-6 py-6">
            {evidence.meters.map((meter) => (
              <div key={meter.label} className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary text-[length:var(--fs-small)]">{meter.label}</span>
                  <span className="text-text-muted text-[length:var(--fs-meta)] tabular-nums">{meter.percent}%</span>
                </div>
                <span className="bg-surface-overlay block h-1.5 overflow-hidden rounded-full">
                  <span
                    className={`cap-meter-fill block h-full rounded-full ${ACCENT_DOT_CLASS[accent]}`}
                    style={{ width: `${meter.percent}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
          <PanelNote note={evidence.note} />
        </>
      )}

      {evidence.kind === "grid" && (
        <>
          <div className="grid gap-3 px-6 py-6">
            <div className="grid grid-cols-4 gap-2">
              {evidence.times.map((time) => (
                <span key={time} className="text-text-muted text-center text-[length:var(--fs-meta)] tabular-nums">
                  {time}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {evidence.slots.map((slot, index) => (
                <span
                  key={`${slot.label}-${index}`}
                  className={`border-border-subtle grid min-h-9 place-items-center rounded-sm border text-[length:var(--fs-meta)] whitespace-nowrap ${TONE_CLASS[slot.tone]}`}
                >
                  {slot.label}
                </span>
              ))}
            </div>
          </div>
          <PanelNote note={evidence.note} />
        </>
      )}

      {evidence.kind === "chips" && (
        <>
          <div className="flex flex-wrap gap-2 px-6 py-6">
            {evidence.chips.map((chip) => (
              <span
                key={chip.label}
                className="border-border-subtle text-text-secondary inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-[length:var(--fs-meta)] whitespace-nowrap"
              >
                <span className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
                {chip.label}
              </span>
            ))}
          </div>
          <PanelNote note={evidence.note} />
        </>
      )}
    </div>
  );
}
