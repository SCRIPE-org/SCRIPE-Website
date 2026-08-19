/**
 * LegalHero — the typography-led intro shared by the Privacy Policy
 * (`/privacy`) and Terms of Service (`/terms`) pages.
 *
 * A page-scoped sibling of `src/components/sections/resources/ResourcesHero.tsx`
 * (same "small lime-rule marker + `<h1>` + subtitle" shape — see that file's
 * own header for why interior pages open on type rather than the home page's
 * cinematic camera hero), but with NO call-to-action: a legal document is a
 * reading destination a visitor was sent to for one specific reason, not a
 * conversion surface, and a "Book a Demo" button under a privacy policy would
 * misrepresent the moment.
 *
 * Genuinely shared (not a page-scoped copy like `ResourcesFaq.tsx` documents
 * for the FAQ pattern) because `/privacy` and `/terms` are two instances of
 * exactly the same document template differing only in copy — see
 * `LegalPageContent`'s own doc comment in `src/content/types.ts` for the full
 * reasoning.
 *
 * The one addition beyond the shared hero shape: a visible, honest
 * draft-review banner + effective-date line, rendered directly under the
 * subtitle in the `accent-club` (rust) "attention" color `Field.tsx`'s
 * validation-error text already establishes as this design system's nearest
 * warm/flag color (no dedicated status token exists yet — see that file's
 * own comment). A Server Component; `Reveal` is the only client leaf.
 */
import type { LegalPageContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface LegalHeroProps {
  /** The hero slice of the legal page content. */
  content: LegalPageContent["hero"];
  /** The "draft pending legal review" honesty banner. */
  banner: string;
  /** The pre-formatted effective-date line. */
  effective: string;
}

/** Rust "attention" triangle-alert glyph marking the draft-review banner —
 *  ported from the lucide `triangle-alert` glyph, matching this codebase's
 *  established 24x24/stroke-currentColor icon vocabulary (see
 *  `src/components/sections/company/icons.tsx`'s own header). */
function BannerGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <path d="M21.73 18 13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/**
 * Renders the shared legal-document hero: marker, heading, subtitle, and the
 * draft-review banner + effective date.
 *
 * @param props - See {@link LegalHeroProps}.
 */
export function LegalHero({ content, banner, effective }: LegalHeroProps) {
  return (
    <Section className="atmo atmo-grain lg-hero-atmo !pb-[clamp(var(--space-8),6vh,var(--space-10))]">
      <Reveal className="max-w-[900px]">
        <p className="text-accent-text flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em]">
          <span className="bg-accent inline-block h-px w-6" aria-hidden="true" />
          {content.label}
        </p>
        <h1 className="atmo-title font-display text-text-primary mt-5 text-[length:var(--fs-display)] text-balance">
          {content.title}
        </h1>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <Reveal delay={90} y={16} className="mt-8 max-w-[720px]">
        <div
          role="note"
          className="border-accent-club/35 bg-accent-club/[0.07] text-accent-club flex items-start gap-3 rounded-lg border px-5 py-4"
        >
          <BannerGlyph />
          <div className="flex flex-col gap-1.5">
            <p className="text-text-primary text-[length:var(--fs-small)] font-medium text-pretty">{banner}</p>
            <p className="text-text-muted text-[length:var(--fs-meta)]">{effective}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
