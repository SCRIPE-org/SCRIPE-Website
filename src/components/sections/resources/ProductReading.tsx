/**
 * ProductReading (`#product`) — the product reference grid: one deep link
 * per platform capability module, into `/platform#<id>`.
 *
 * No accent-dot header marker here (unlike `GuidesGrid.tsx`/`ArticlesGrid.tsx`):
 * a single dot would misrepresent a section whose thirteen tiles each carry
 * their own distinct product-world accent, so this header is a plain `<h2>`
 * only — the same "no marker where there is no single accent to represent"
 * call `src/components/sections/solutions/HubGrid.tsx` makes for its own
 * four-accent grid.
 *
 * Tiles are real links (unlike the honest placeholder cards in
 * `GuidesGrid.tsx`/`ArticlesGrid.tsx`) because every module they point at
 * already has a real, shipped section on `/platform` — captions are ported
 * verbatim from `backup/scripe-static/resources.html`'s `#product` section.
 * Per `ProductReadingEntry`'s doc comment in `src/content/types.ts`, this
 * list is a hand-copied parallel of `PlatformContent["groups"]`'s thirteen
 * modules, not an import — this content layer keeps every page's file
 * self-contained. A Server Component; `Reveal` is the only client leaf.
 */
import type { ResourcesContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_TEXT_CLASS } from "./accents";
import { ModuleIcon } from "./icons";

export interface ProductReadingProps {
  /** The product-reading slice of the resources page content. */
  content: ResourcesContent["productReading"];
}

/**
 * Renders the product reference header and its link-tile grid.
 *
 * @param props - See {@link ProductReadingProps}.
 */
export function ProductReading({ content }: ProductReadingProps) {
  return (
    <Section id="product" className="scroll-mt-24">
      <Reveal className="max-w-[720px]">
        <h2 className="atmo-title font-display text-text-primary text-[length:var(--fs-h1)]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-3 text-[length:var(--fs-lead)] text-pretty">{content.subtitle}</p>
      </Reveal>

      <div
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        data-rv-stagger
        style={{ "--rv-stagger-step": "60ms" } as React.CSSProperties}
      >
        {content.items.map((item) => (
          <Reveal key={item.id} y={16}>
            <Link
              href={`/platform#${item.id}`}
              className="group border-border-subtle bg-surface-raised hover:border-border-strong hover:bg-surface-overlay atmo-lift flex h-full flex-col gap-2 rounded-lg border p-5 transition-colors duration-[var(--motion-quick)]"
            >
              <div className="flex items-center gap-3">
                <span className={`shrink-0 ${ACCENT_TEXT_CLASS[item.accent]}`}>
                  <ModuleIcon id={item.id} />
                </span>
                <h3 className="text-text-primary min-w-0 flex-1 truncate text-[length:var(--fs-lead)] font-semibold">
                  {item.name}
                </h3>
                <span
                  className="rtl-flip text-text-muted group-hover:text-text-primary shrink-0 transition-colors duration-[var(--motion-quick)]"
                  aria-hidden="true"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
              <p className="text-text-secondary text-[length:var(--fs-small)] text-pretty">{item.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
