/**
 * LegalArticle — the reading body shared by the Privacy Policy (`/privacy`)
 * and Terms of Service (`/terms`) pages: a sticky table of contents beside a
 * measured (`max-w-[68ch]`, matching `ResourcesFaq.tsx`'s own answer-column
 * precedent) column of numbered `<h2>` sections.
 *
 * Genuinely shared, not a page-scoped copy — see `LegalHero.tsx`'s header for
 * why `/privacy` and `/terms` are one template, not two.
 *
 * ============================================================================
 * WHY NO SCROLLSPY (unlike `CapabilitySubnav.tsx`)
 * ============================================================================
 * The platform page's subnav runs an `IntersectionObserver` to highlight
 * which of five capability-family groups the reader is currently scrolled
 * past. This ToC deliberately does not: a legal document with a dozen short
 * sections is read top-to-bottom or jumped-to once, not browsed by family the
 * way the platform page's five product groups are — the added client-side
 * complexity would buy nothing a reader actually needs. Every link is a
 * plain `<a href="#id">`, so it works with JS disabled and gets the browser's
 * native anchor jump (each section carries `scroll-mt-24`, matching every
 * other anchored section on this site).
 *
 * ============================================================================
 * WHY NO PER-SECTION `Reveal`
 * ============================================================================
 * Every other page's sections fade+rise into view on scroll via `Reveal`
 * (see that component's own header). This document's dozen-plus sections are
 * deliberately rendered plainly instead: a visitor lands here to read
 * carefully — possibly in a hurry, possibly mid-onboarding-conversation —
 * and choreographing that content into a slow reveal cadence would fight the
 * page's own job, which is to be read immediately and completely, not
 * discovered piece by piece. `Reveal` stays on `LegalHero.tsx`'s intro and
 * this component's own ToC panel, matching every other page's entrance, but
 * stops there.
 *
 * ============================================================================
 * RESPONSIVE TOC STRATEGY
 * ============================================================================
 * Two renders of the identical link list (`<TocList>`), one per viewport,
 * both server-rendered so neither depends on JS:
 * - `lg:` and up — a sticky `<nav>` in the grid's own left/inline-start
 *   column (`lg:sticky lg:top-24`, clearing the fixed 72px nav bar the same
 *   96px `scroll-mt-24` already reserves sitewide).
 * - Below `lg:` — a native `<details>` disclosure above the article, the
 *   same accessible, zero-JS pattern `ResourcesFaq.tsx`/`PricingFaq.tsx`
 *   already establish for FAQ items, reused here for a link list instead of
 *   a question/answer pair.
 * Tailwind's `hidden lg:*` / `lg:hidden` pair removes whichever one is not
 * showing from layout AND from the grid's auto-placement flow (a
 * `display:none` item is skipped by CSS Grid entirely), which is what lets
 * the `<nav>` land in column 1 and the `<article>` in column 2 at `lg:`
 * width with no explicit `grid-column` on either — see the two-column
 * `lg:grid-cols-[236px_1fr]` on the wrapping `<div>` below.
 */
import type { LegalBlock, LegalSection } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export interface LegalArticleProps {
  /** The document's sections, in reading and ToC order. */
  sections: LegalSection[];
  /** Table-of-contents landmark label (e.g. "On this page"). */
  tocLabel: string;
  /** Tag shown on every `"note"`-kind block (e.g. "Placeholder — pending
   *  counsel"). */
  tbdLabel: string;
}

/** Renders the ordered link list shared by the desktop `<nav>` and the
 *  mobile `<details>` disclosure. */
function TocList({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="text-text-secondary hover:text-text-primary hover:bg-surface-overlay flex items-baseline gap-2.5 rounded-md px-2.5 py-1.5 text-[length:var(--fs-small)] transition-colors duration-[var(--motion-quick)]"
          >
            <span aria-hidden="true" className="text-text-muted font-mono text-[length:var(--fs-meta)] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-pretty">{section.heading}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Renders one section's body blocks — paragraphs, bulleted lists, and
 *  flagged placeholder notes — in order. */
function BlockList({ blocks, tbdLabel }: { blocks: LegalBlock[]; tbdLabel: string }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          return (
            <p key={index} className="text-text-secondary text-[length:var(--fs-body)] text-pretty">
              {block.text}
            </p>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="m-0 grid list-none gap-2.5 p-0">
              {block.items.map((item) => (
                <li key={item} className="text-text-secondary flex items-start gap-3 text-[length:var(--fs-body)] text-pretty">
                  <span aria-hidden="true" className="bg-text-muted mt-[0.65em] inline-block size-1 shrink-0 rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        // "note" — a fact this in-house draft cannot honestly state yet
        // (legal entity, retention schedule, governing law...). Flagged
        // visually so it never reads as finished policy text — see this
        // file's header and `LegalBlock`'s own doc comment.
        return (
          <div key={index} className="border-accent-club/30 bg-accent-club/[0.05] rounded-md border px-4 py-3">
            <span className="text-accent-club text-[length:var(--fs-meta)] font-semibold tracking-[0.12em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {tbdLabel}
            </span>
            <p className="text-text-secondary mt-1.5 text-[length:var(--fs-small)] text-pretty italic">{block.text}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders the table of contents + the ordered document body.
 *
 * @param props - See {@link LegalArticleProps}.
 */
export function LegalArticle({ sections, tocLabel, tbdLabel }: LegalArticleProps) {
  return (
    <Section width="wide">
      <div className="grid gap-8 lg:grid-cols-[236px_1fr] lg:items-start lg:gap-16">
        {/* `aria-label` has to live on a real `<nav>`, not on `Reveal` —
            `RevealProps` doesn't declare or forward arbitrary attributes
            (it destructures a fixed prop list with no `...rest` spread), so
            an `aria-label` passed directly to `<Reveal as="nav">` is
            silently dropped from the rendered DOM despite type-checking
            without complaint. `Reveal` here only owns the inner surface's
            entrance animation; the `<nav>` itself owns the landmark label
            and the sticky/responsive-visibility positioning. */}
        <nav aria-label={tocLabel} className="hidden lg:sticky lg:top-24 lg:block">
          <Reveal y={16} className="atmo-panel border-border-subtle rounded-lg border p-5">
            <span className="text-accent-text mb-3 block text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
              {tocLabel}
            </span>
            <TocList sections={sections} />
          </Reveal>
        </nav>

        <details className="border-border-subtle bg-surface-raised rounded-lg border lg:hidden">
          <summary className="text-text-primary cursor-pointer list-none px-5 py-4 text-[length:var(--fs-small)] font-medium">
            {tocLabel}
          </summary>
          <div className="border-border-subtle border-t px-3 pt-2 pb-3">
            <TocList sections={sections} />
          </div>
        </details>

        <article className="flex min-w-0 max-w-[68ch] flex-col gap-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-text-primary text-[length:var(--fs-h2)] text-balance">{section.heading}</h2>
              <div className="mt-4">
                <BlockList blocks={section.blocks} tbdLabel={tbdLabel} />
              </div>
            </section>
          ))}
        </article>
      </div>
    </Section>
  );
}
