/**
 * CapabilityHero — the platform page's typography-led intro.
 *
 * The site's one cinematic hero belongs to the home page (`Hero.tsx`'s
 * scroll-scrubbed Camera-Hero); every interior page opens on type instead.
 * This is the page's single occurrence of the small marker device
 * `PlatformOverview` reserves as "the only section on the home page with
 * this device" — legitimate here as this page's own one hero marker, not a
 * repeated per-section eyebrow.
 *
 * Task E4: the marker is now set in the ground sequence's mono film-grammar
 * (`font-mono`, wide tracking — the same voice `home.css`'s `.slate-stamp`
 * uses for its timecode, minus the timecode itself: this page has no
 * flight/ground film to number) rather than the old tracked-uppercase sans
 * kicker, and the section sits on a quiet cool ground glow + grain
 * (`.atmo`/`.atmo-grain`, `.cap-hero-atmo` in `platform.css` §5) — this
 * page's one hero-toned moment. A Server Component; `Reveal` is the only
 * client leaf.
 *
 * WAVE J — a companion photograph, gated on arrival.
 * ---------------------------------------------------------------------
 * At full viewport width the single-column layout below leaves roughly half
 * the section as bare ground glow — the largest unphotographed area on the
 * site outside the (deliberately) typography-only 404 page. `PLATFORM_HERO_IMAGE`
 * names where that photograph will live once delivered; the layout below
 * reuses `SolutionHero.tsx`'s exact two-column device (type + framed
 * portrait, `flex-wrap` so it stacks on narrow viewports) rather than
 * inventing a second one, since the two heroes already share the mono
 * marker, the same `atmo`/grain ground and the same
 * type-block-then-CTA-row shape — the photo column is the one piece
 * `CapabilityHero` never had.
 *
 * The two-column layout activates SOLELY on `content.imageAlt` being
 * present — see its doc comment in `content/types.ts`. It is absent today,
 * so this renders single-column, byte-for-byte the same output as before
 * this change: `PLATFORM_HERO_IMAGE.src` points at a WebP that does not
 * exist yet, and `next/image` is never asked to resolve it while the gate is
 * closed. Landing the photograph is then the same three-step integration
 * `assets/README.md` and `SolutionHero.tsx`'s own header describe: drop the
 * source in `assets/pages/`, register it in `build-media-assets.mjs`, add
 * `imageAlt` to both locale files. Nothing here changes when that happens.
 */
import type { PlatformContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { PlatePhoto } from "@/components/ui/PlatePhoto";
import { Section } from "@/components/ui/Section";

/**
 * The hero's companion photograph. 4:5 portrait, matching the aspect every
 * `SolutionHero` frame already uses, so the day this lands the platform
 * page's hero reads as one more print in the same set rather than an
 * unrelated crop. Dimensions are the intended master size for
 * `scripts/build-media-assets.mjs` to encode against — update them together
 * with the real source once it exists; they are inert until `imageAlt` is
 * set (see the file header).
 */
const PLATFORM_HERO_IMAGE = { src: "/media/platform/hero.webp", width: 1122, height: 1402 };

export interface CapabilityHeroProps {
  /** The hero slice of the platform page content. */
  content: PlatformContent["hero"];
}

/**
 * Renders the platform page's hero: type block, plus a framed companion
 * photograph once one is registered in content (see the file header).
 *
 * @param props - See {@link CapabilityHeroProps}.
 */
export function CapabilityHero({ content }: CapabilityHeroProps) {
  const showImage = Boolean(content.imageAlt);

  const typeBlock = (
    <Reveal className={showImage ? "min-w-0 flex-1 basis-[480px]" : "max-w-[900px]"}>
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
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/contact" size="lg">
          {content.primaryCta}
        </Button>
        <Button href="/pricing" size="lg" variant="outline">
          {content.secondaryCta}
        </Button>
      </div>
    </Reveal>
  );

  return (
    <Section className="atmo atmo-grain cap-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      {showImage ? (
        <div className="flex flex-wrap items-center gap-10 lg:gap-14">
          {typeBlock}
          <Reveal delay={120} className="min-w-0 flex-1 basis-72 lg:max-w-[380px]">
            <PlatePhoto
              src={PLATFORM_HERO_IMAGE.src}
              alt={content.imageAlt ?? ""}
              width={PLATFORM_HERO_IMAGE.width}
              height={PLATFORM_HERO_IMAGE.height}
              sizes="(min-width: 64rem) 380px, (min-width: 40rem) 40vw, 90vw"
              priority
            />
          </Reveal>
        </div>
      ) : (
        typeBlock
      )}
    </Section>
  );
}
