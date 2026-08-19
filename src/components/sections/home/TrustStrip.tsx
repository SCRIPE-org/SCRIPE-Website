/**
 * TrustStrip (`#trusted`) — honest positioning strip, and the first beat of
 * the ground sequence (slate `05 / Trusted` — see `Slate.tsx`).
 *
 * The quietest section on the page by design: a centered slate + heading +
 * sentence, nothing else. A cleanup-wave audit flagged the section's former
 * five-pill category row ("Football Clubs" / "Sports Academies" / ...) as
 * reading like a customer-logo wall by position and styling even though the
 * copy itself never claimed a named customer — sitting where a "trusted by"
 * strip conventionally carries real marks is enough to imply them. Removed
 * rather than re-skinned: the heading + subtitle alone already state the
 * honest claim (who SCRIPE is built for) without borrowing a logo-wall's
 * visual authority to say it. Atmosphere: the `.gs-trusted` recipe (a cool
 * overhead glow — the hero stage's hand-off light; dark theme only, see
 * `src/styles/home.css` §13). Rhythm is compressed below the shared Section
 * default — this is a bridge, not a destination. A Server Component;
 * `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { Slate } from "./Slate";

export interface TrustStripProps {
  /** The trusted slice of the home page content. */
  content: HomeContent["trusted"];
}

/**
 * Renders the trust strip.
 *
 * @param props - See {@link TrustStripProps}.
 */
export function TrustStrip({ content }: TrustStripProps) {
  return (
    <Section
      id="trusted"
      className="gs gs-trusted scroll-mt-24 !py-[clamp(var(--space-9),6vh,var(--space-10))]"
    >
      <Reveal className="mx-auto max-w-[680px] text-center">
        <Slate no="05" label={content.stamp} center />
        <h2 className="gs-title gs-title-sm">{content.title}</h2>
        <p className="text-text-secondary mx-auto mt-3 max-w-[56ch] text-[length:var(--fs-body)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>
    </Section>
  );
}
