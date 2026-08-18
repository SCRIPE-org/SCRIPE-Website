/**
 * Home hero — the Camera-Hero: a scroll-scrubbed virtual camera flight over
 * the SCRIPE campus environment.
 *
 * A Server Component that renders the hero's complete dual-mode DOM (see
 * `src/styles/home.css` for the two-mode contract):
 *
 * - Static frame (default): full-viewport background plate under a night
 *   grade, `<h1>` wordmark + tagline + both CTAs centered, and the five
 *   chapters as a flowing "flight plan" strip below the stage. This is the
 *   no-JS, reduced-motion and pre-hydration experience — a single flattened
 *   image layer, full content, no motion/parallax dependencies.
 * - Armed mode: `HeroDirector` (the only client leaf) arms the cinematic
 *   flight after `loadGsap()` resolves — the section becomes a tall scroll
 *   track, chapters become scrubbed camera beats, the mid/foreground plates
 *   and the finale plate reveal, and the flight-plan strip hides because
 *   the same information now plays as the flight itself.
 *
 * Plate architecture (four plates, `public/media/hero/plate-*.png`):
 * - `plate-background` (`.hero-rig > .hero-plate`) — the base environment,
 *   always visible, driven by `CAMERA_PATH` at depth ×1.0. The only plate
 *   shown in static/no-JS/reduced-motion mode.
 * - `plate-midground` (`.hero-plate-mid`, armed-only) — stadium+pool cutout
 *   (alpha PNG), its own depth ×1.15 tween.
 * - `plate-foreground` (`.hero-plate-fg`, armed-only) — bokeh floodlight
 *   mast + tree canopy corners on a transparent center (alpha PNG), its own
 *   depth ×1.4 tween. Purely decorative: `aria-hidden` + pointer-events
 *   none, layered in front of everything (including the type layer) like a
 *   lens element in the rig.
 * - `plate-finale` (`.hero-plate-finale`, armed-only) — the nadir
 *   "operational picture" shot, crossfades in via opacity across scrub
 *   0.76→0.86 as the destination beat's background; static (no
 *   `CAMERA_PATH` tween) so it reads as a deliberate cut, not a
 *   continuation of the pan.
 *
 * The mid/foreground/finale plates are DOM SIBLINGS of `.hero-rig` (not
 * nested children of it): each gets its own independent, self-contained
 * transform-only GSAP tween computing an absolute depth-scaled path
 * (`HeroDirector`'s `flyPath` helper) rather than an additional transform
 * layered on top of the rig's own (which would require dividing out the
 * parent's contribution at every keyframe to hit the target depth — more
 * fragile for no visual difference). Z-order back to front: background <
 * mid < finale < night-grade/signal accents < type (intro/finale text +
 * CTAs) < corner beats < foreground bokeh (topmost).
 *
 * Resolution note: the delivered plates are 1915×821 — below the
 * 3440×1476 (21:9, 2×) target the rig was designed for. `CAMERA_PATH`'s
 * peak scale is capped at 1.28 (down from a pre-asset placeholder of 1.33)
 * to keep the worst-case upscale ratio in check on common desktop
 * viewports; see the cap rationale in `HeroDirector.tsx`. Plates are
 * drop-in replaceable at higher resolution later — re-export the same
 * four filenames into `public/media/hero/` and lift the scale cap back
 * toward 1.33 if the new source supports it.
 *
 * Accessibility contract for the armed flight (controller ruling):
 * - The `<h1>`, the finale block and the CTA row are informative — they are
 *   NEVER `aria-hidden` and GSAP fades them with plain `opacity` (never
 *   `visibility`), so they stay in the accessibility tree and the CTA
 *   buttons stay in the tab order for the entire scroll track. A
 *   `:focus-within` rule in home.css force-reveals the CTA row for keyboard
 *   users who reach it while transparent.
 * - The corner beat captions (chapters 1–4) are decorative narration — the
 *   same information exists in the flight-plan strip (static mode) and in
 *   the sections below (`#product`, `#solutions`), so the beat containers
 *   are `aria-hidden` and keep the `autoAlpha` visual choreography.
 */
import Image from "next/image";
import type { HomeContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { HeroDirector } from "./HeroDirector";

/** Two-digit beat stamp (01-based) for a chapter index. */
function stamp(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export interface HeroProps {
  /** The hero slice of the home page content. */
  content: HomeContent["hero"];
}

/**
 * Renders the dual-mode camera hero. See the file header for the mode
 * contract; all armed-mode motion lives in {@link HeroDirector}.
 *
 * @param props - See {@link HeroProps}.
 */
export function Hero({ content }: HeroProps) {
  const corners = content.chapters.slice(0, -1);
  const finale = content.chapters[content.chapters.length - 1];

  return (
    <section className="hero" data-hero-root>
      <div className="hero-stage">
        {/* Camera rig: transform-driven base plate container. Always visible
            (static and armed) — the single flattened layer under no-JS/
            reduced-motion. */}
        <div className="hero-rig" data-hero-rig>
          <div className="hero-plate">
            <Image
              src="/media/hero/plate-background.png"
              alt={content.plateAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Parallax mid layer (armed-only): stadium + pool cutout, its own
            depth ×1.15 tween (HeroDirector's `flyPath`). Sibling of
            `.hero-rig`, not nested inside it — see the file header. */}
        <div className="hero-plate-mid" data-hero-plate-mid aria-hidden="true">
          <Image src="/media/hero/plate-midground.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>

        {/* Finale plate (armed-only): the nadir "operational picture" shot,
            crossfades in via opacity 0.76→0.86 as the destination beat's
            background. Always below the type layer. */}
        <div className="hero-plate-finale" data-hero-plate-finale aria-hidden="true">
          <Image src="/media/hero/plate-finale.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>

        {/* Night grade + brand signal accents. */}
        <div className="hero-tint" aria-hidden="true" />
        <div className="hero-grade" aria-hidden="true" />
        <div className="hero-corners" aria-hidden="true" />
        <span className="hero-scanline" data-hero-scanline aria-hidden="true" />

        {/* Center column: intro ⇄ finale swap zone + the shared CTA row. */}
        <div className="hero-center">
          <div className="hero-swap">
            <h1 className="hero-intro" data-hero-intro>
              <span className="hero-wordmark hero-enter">
                <bdi>{content.wordmark}</bdi>
              </span>
              <span className="hero-tagline hero-enter hero-enter-2">{content.tagline}</span>
            </h1>
            <div className="hero-finale" data-hero-finale>
              <p className="hero-stamp">
                {stamp(content.chapters.length - 1)} · {finale.rail}
              </p>
              <p className="hero-beat-title">{finale.title}</p>
              <p className="hero-beat-subtitle">{finale.subtitle}</p>
            </div>
          </div>

          <div className="hero-enter hero-enter-3 flex flex-wrap items-center justify-center gap-3" data-hero-ctas>
            <Button href="/contact" size="lg">
              {content.primaryCta}
            </Button>
            <Button
              href="/contact"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 active:bg-white/10"
            >
              {content.secondaryCta}
            </Button>
          </div>
        </div>

        {/* Corner beats: chapters 1–4 of the flight (armed mode only).
            aria-hidden: decorative narration — the same chapters are exposed
            to AT via the flight-plan strip (static) and the sections below
            (armed); see the file header's accessibility contract. */}
        {corners.map((chapter, index) => (
          <div className="hero-beat" data-hero-beat aria-hidden="true" key={chapter.rail}>
            <p className="hero-stamp">
              {stamp(index)} · {chapter.rail}
            </p>
            <p className="hero-beat-title">{chapter.title}</p>
            <p className="hero-beat-subtitle">{chapter.subtitle}</p>
          </div>
        ))}

        {/* Progress rail: intro + all chapters (armed mode, wide viewports). */}
        <div className="hero-rail" aria-hidden="true">
          {[content.railIntro, ...content.chapters.map((chapter) => chapter.rail)].map((label) => (
            <div className="hero-tick" data-hero-tick key={label}>
              <span className="hero-tick-label">{label}</span>
              <span className="hero-tick-dot" />
            </div>
          ))}
        </div>

        {/* Scroll affordance. */}
        <div className="hero-hint" data-hero-hint aria-hidden="true">
          <span className="hero-hint-label">{content.scrollHint}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>

        {/* Foreground bokeh overlay (armed-only): floodlight mast + tree
            canopy corners on a transparent center, its own depth ×1.4 tween.
            Topmost layer — sits in front of everything, including the type
            layer, like a lens element on the rig. Purely decorative and
            inert: aria-hidden, no pointer events, never blocks interaction. */}
        <div className="hero-plate-fg" data-hero-plate-fg aria-hidden="true">
          <Image src="/media/hero/plate-foreground.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>

      {/* Flight plan: the chapters as flowing content (static mode only). */}
      <div className="hero-plan">
        {content.chapters.map((chapter, index) => (
          <div className="hero-plan-item" key={chapter.rail}>
            <p className="hero-plan-rail">
              {stamp(index)} · {chapter.rail}
            </p>
            <h2 className="hero-plan-title">{chapter.title}</h2>
            <p className="hero-plan-subtitle">{chapter.subtitle}</p>
          </div>
        ))}
      </div>

      <HeroDirector />
    </section>
  );
}
