/**
 * ArticlesGrid (`#articles`) — the article card grid, and the section this
 * task's brief singles out as the card grammar the future blog inherits:
 * whatever card shape ships here today is what a real published article
 * will render inside once the MDX pipeline lands (see `ResourceItem`'s doc
 * comment in `src/content/types.ts`), so the layout is deliberately the
 * same card language `GuidesGrid.tsx` establishes (icon tile + title + tag
 * badge + summary), not a simplified placeholder version of it.
 *
 * Header uses the accent-dot + plain `<h2>` device, matching `GuidesGrid.tsx`
 * — see that file's header for why this page reserves the tracked-uppercase
 * marker for the hero and FAQ only. Every article today is an honest "Coming
 * soon" card, ported verbatim from `backup/scripe-static/resources.html`'s
 * `#articles` section — no article has a reading page yet, so cards render
 * as plain `<article>`s, never a `<Link>` that would 404. A Server
 * Component; `Reveal` is the only client leaf.
 */
import type { ResourcesContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ArticleIcon } from "./icons";

export interface ArticlesGridProps {
  /** The articles slice of the resources page content. */
  content: ResourcesContent["articles"];
}

/**
 * Renders the articles header and its card grid.
 *
 * @param props - See {@link ArticlesGridProps}.
 */
export function ArticlesGrid({ content }: ArticlesGridProps) {
  return (
    <Section id="articles" className="scroll-mt-24">
      <Reveal className="flex items-center gap-2.5">
        <span className="bg-accent inline-block size-2.5 rounded-full" aria-hidden="true" />
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-h1)]">
          {content.title}
        </h2>
      </Reveal>
      <Reveal className="mt-3 max-w-[62ch]">
        <p className="text-text-secondary text-[length:var(--fs-lead)] text-pretty">{content.subtitle}</p>
      </Reveal>

      <div
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        data-rv-stagger
        style={{ "--rv-stagger-step": "90ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.slug} y={20}>
            <article className="atmo-panel flex h-full flex-col gap-4 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="border-border-subtle text-accent-text grid size-9 shrink-0 place-items-center rounded-md border">
                  <ArticleIcon />
                </span>
                <h3 className="font-display text-text-primary min-w-0 flex-1 text-[length:var(--fs-lead)] font-semibold text-pretty">
                  {item.title}
                </h3>
              </div>
              <p className="text-text-secondary flex-1 text-[length:var(--fs-small)] text-pretty">{item.summary}</p>
              {item.tag && (
                <span className="border-border-subtle text-text-muted self-start rounded-xs border px-2 py-0.5 text-[length:var(--fs-meta)] whitespace-nowrap">
                  {item.tag}
                </span>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
