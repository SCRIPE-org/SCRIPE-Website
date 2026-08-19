/**
 * Slate — the ground sequence's film-slate section marker (Task E3).
 *
 * Continues the hero rail's timecode below the fold: the hero flies chapters
 * 00–04, the ground sections run 05 PRODUCT FAMILY → 09 BRANCHES, each marked with
 * the same mono stamp grammar the hero's beats use (`NN / LABEL` —
 * `.hero-stamp` in `src/styles/home.css` §5; the slate's own styles live in
 * §13). The number is layout (Latin digits in both locales, the board-times
 * precedent), the label is locale content. Rules are decorative spans; the
 * stamp itself is real text, exposed to AT as "05 / Product family". A
 * Server Component — no hooks.
 *
 * The ground numbers have shifted twice, both times to keep the timecode
 * unbroken — it is only meaningful if it runs continuously from the flight
 * into the ground. Task G2 cut the hero's Academies chapter, so a five-beat
 * hero hands over at 05 rather than 06; Wave H removed the trust strip that
 * used to hold 05, so every ground section moved up one and the sequence now
 * runs 05 PRODUCT FAMILY → 09 BRANCHES.
 */

export interface SlateProps {
  /** Two-digit ground timecode (e.g. `"05"`). Latin digits, both locales. */
  no: string;
  /** Locale stamp label (e.g. `"Trusted"` / `"الثقة"`). */
  label: string;
  /** Centers the stamp between two flanking rules (for centered section
   *  headers). Default: start-aligned with one trailing rule. */
  center?: boolean;
}

/**
 * Renders the slate marker line.
 *
 * @param props - See {@link SlateProps}.
 */
export function Slate({ no, label, center = false }: SlateProps) {
  return (
    <p className={center ? "slate slate-center" : "slate"}>
      {center ? <span className="slate-rule" aria-hidden="true" /> : null}
      <span className="slate-stamp">
        {no}&nbsp;/&nbsp;{label}
      </span>
      <span className="slate-rule" aria-hidden="true" />
    </p>
  );
}
