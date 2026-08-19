/**
 * ProductFamily (`#product`) — the three SCRIPE products as elevated ledger
 * cards with abstract product-UI vignettes (ground slate `05 / Product
 * family` — see `Slate.tsx`).
 *
 * Presentation thesis (Task E3 evolution of the row system): products are
 * lines of one operating system, so they still read as full-width ledger
 * entries — but each entry is now a real card surface on the elevation ramp
 * (`.pf-card`, `src/styles/home.css` §13) instead of a naked hairline row,
 * and each carries a mini operations display at its end: an abstract CSS/SVG
 * vignette in the product's own accent, echoing the platform's
 * operations-board language (booking grid for Venue, session rhythm for
 * Academy, pitch diagram for Football Intelligence). Vignettes are
 * illustrative geometry, aria-hidden, with NO invented figures or labels —
 * never data claims. The accent identity carries through the marker dot,
 * tagline color, vignette ink (`--vg-accent`) and the row's hover wash
 * (`.pf-row`, §10). Product names stay Latin in both locales (proper
 * nouns), isolated with `<bdi>`. Rows stagger in (`data-rv-stagger`); the
 * vignette "monitor" is turned toward the reader (physical rotateY, flipped
 * in RTL via `--tilt-dir`). A Server Component; `Reveal` is the only client
 * leaf.
 */
import type { AccentId, HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS, ACCENT_VAR } from "./accents";
import { ArrowLink } from "./ArrowLink";
import { Slate } from "./Slate";

/** Booking-grid vignette (Venue): a week of slot cells — some filled, one
 *  held (dashed). Deterministic pattern, purely illustrative. */
function VenueVignette() {
  const filled = new Set([1, 2, 5, 9, 10, 12, 16, 17, 23, 25]);
  const held = 19;
  return (
    <div className="vg-grid">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className={
            i === held ? "vg-cell vg-cell-hold" : filled.has(i) ? "vg-cell vg-cell-fill" : "vg-cell"
          }
        />
      ))}
    </div>
  );
}

/** Session-rhythm vignette (Academy): attendance dot rows + progress bars. */
function AcademyVignette() {
  const rows: Array<{ dots: boolean[]; fill: number }> = [
    { dots: [true, true, true, false, true], fill: 72 },
    { dots: [true, true, false, true, true], fill: 84 },
    { dots: [true, false, true, true, false], fill: 56 },
  ];
  return (
    <div className="vg-rhythm">
      {rows.map((row, r) => (
        <div className="vg-rhythm-row" key={r}>
          {row.dots.map((on, d) => (
            <span key={d} className={on ? "vg-dot vg-dot-fill" : "vg-dot"} />
          ))}
          <span className="vg-bar">
            <span className="vg-bar-fill" style={{ inlineSize: `${row.fill}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Pitch-diagram vignette (Football Intelligence): pitch outline, position
 *  dots, two dashed movement lines. */
function FiVignette() {
  return (
    <svg className="vg-pitch" viewBox="0 0 240 132" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="228" height="120" rx="6" stroke="currentColor" strokeOpacity="0.45" />
      <line x1="120" y1="6" x2="120" y2="126" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="120" cy="66" r="17" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="6" y="40" width="26" height="52" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="208" y="40" width="26" height="52" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M62 96 L104 70 L150 84" stroke="currentColor" strokeOpacity="0.6" strokeDasharray="3 4" />
      <path d="M104 34 L158 46" stroke="currentColor" strokeOpacity="0.6" strokeDasharray="3 4" />
      {[
        [42, 66],
        [62, 96],
        [104, 34],
        [104, 70],
        [150, 84],
        [158, 46],
        [190, 66],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="currentColor" fillOpacity="0.85" />
      ))}
    </svg>
  );
}

/** Vignette registry, keyed by the product's accent identity. */
const VIGNETTE: Partial<Record<AccentId, () => React.ReactNode>> = {
  venue: VenueVignette,
  academy: AcademyVignette,
  fi: FiVignette,
};

export interface ProductFamilyProps {
  /** The product-family slice of the home page content. */
  content: HomeContent["productFamily"];
}

/**
 * Renders the product family ledger cards.
 *
 * @param props - See {@link ProductFamilyProps}.
 */
export function ProductFamily({ content }: ProductFamilyProps) {
  return (
    <Section id="product" className="gs gs-product scroll-mt-24">
      <Reveal className="max-w-[1040px]">
        <Slate no="05" label={content.stamp} />
        <h2 className="gs-title">{content.title}</h2>
        <p className="text-text-secondary mt-4 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="mt-9 grid gap-5" data-rv-stagger>
        {content.products.map((product) => {
          const Vignette = VIGNETTE[product.accent];
          return (
            <Reveal key={product.name} y={18}>
              <article
                className="pf-card pf-row grid items-center gap-x-8 gap-y-6 p-6 sm:p-8 md:grid-cols-12"
                style={
                  {
                    "--pf-accent": ACCENT_VAR[product.accent],
                    "--vg-accent": ACCENT_VAR[product.accent],
                  } as React.CSSProperties
                }
              >
                <div className="md:col-span-4">
                  <p className="text-text-muted flex items-center gap-2.5 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal">
                    <span
                      className={`inline-block size-2 rounded-full ${ACCENT_DOT_CLASS[product.accent]}`}
                      aria-hidden="true"
                    />
                    <bdi>SCRIPE</bdi>
                  </p>
                  <h3 className="font-display text-text-primary mt-2 text-[length:var(--fs-h1)] leading-[1.08] font-semibold [font-variation-settings:'wdth'_118]">
                    <bdi>{product.name}</bdi>
                  </h3>
                  <p
                    className={`mt-2 text-[length:var(--fs-small)] font-medium ${ACCENT_TEXT_CLASS[product.accent]}`}
                  >
                    {product.tagline}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-text-secondary max-w-[46ch] text-[length:var(--fs-body)] text-pretty">
                    {product.description}
                  </p>
                  <div className="mt-4">
                    <ArrowLink href={product.href}>{product.cta}</ArrowLink>
                  </div>
                </div>
                {Vignette ? (
                  <div className="vg md:col-span-4" aria-hidden="true">
                    <Vignette />
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
