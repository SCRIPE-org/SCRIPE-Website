/**
 * ProductFamily (`#product`) — the three SCRIPE products as an editorial
 * row system, not a card grid.
 *
 * Presentation thesis: products are lines of one operating system, so they
 * render as full-width ledger rows divided by hairlines — each row a lockup
 * of the SCRIPE wordmark over the product name, its accent-colored category
 * line, a one-sentence description and an explore link. The accent identity
 * carries through three quiet signals: the marker dot, the tagline color and
 * the row's hover wash (`.pf-row` in `src/styles/home.css`) — no accent
 * borders, no identical cards. Product names stay Latin in both locales
 * (proper nouns), isolated with `<bdi>` so Arabic sentence flow is
 * unaffected. A Server Component; `Reveal` is the only client leaf.
 */
import type { HomeContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS, ACCENT_VAR } from "./accents";
import { ArrowLink } from "./ArrowLink";

export interface ProductFamilyProps {
  /** The product-family slice of the home page content. */
  content: HomeContent["productFamily"];
}

/**
 * Renders the product family rows.
 *
 * @param props - See {@link ProductFamilyProps}.
 */
export function ProductFamily({ content }: ProductFamilyProps) {
  return (
    <Section id="product" className="scroll-mt-24">
      <Reveal className="max-w-[720px]">
        <h2 className="font-display text-text-primary text-[length:var(--fs-display)] leading-[1.06] font-semibold text-balance [font-variation-settings:'wdth'_114] [&:lang(ar)]:[font-variation-settings:normal] [&:lang(ar)]:leading-[1.3]">
          {content.title}
        </h2>
        <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
          {content.subtitle}
        </p>
      </Reveal>

      <div className="border-border-subtle mt-12 border-t">
        {content.products.map((product) => (
          <Reveal key={product.name}>
            <article
              className="pf-row border-border-subtle grid items-center gap-x-8 gap-y-4 border-b py-8 md:grid-cols-12 md:py-10"
              style={{ "--pf-accent": ACCENT_VAR[product.accent] } as React.CSSProperties}
            >
              <div className="md:col-span-5">
                <p className="text-text-muted flex items-center gap-2.5 text-[length:var(--fs-meta)] font-semibold tracking-[0.14em] uppercase [&:lang(ar)]:tracking-normal">
                  <span
                    className={`inline-block size-2 rounded-full ${ACCENT_DOT_CLASS[product.accent]}`}
                    aria-hidden="true"
                  />
                  <bdi>SCRIPE</bdi>
                </p>
                <h3 className="font-display text-text-primary mt-2 text-[length:var(--fs-h1)] leading-[1.08] font-semibold [font-variation-settings:'wdth'_114]">
                  <bdi>{product.name}</bdi>
                </h3>
                <p
                  className={`mt-2 text-[length:var(--fs-small)] font-medium ${ACCENT_TEXT_CLASS[product.accent]}`}
                >
                  {product.tagline}
                </p>
              </div>
              <p className="text-text-secondary max-w-[52ch] text-[length:var(--fs-body)] text-pretty md:col-span-5">
                {product.description}
              </p>
              <div className="md:col-span-2 md:justify-self-end">
                <ArrowLink href={product.href}>{product.cta}</ArrowLink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
