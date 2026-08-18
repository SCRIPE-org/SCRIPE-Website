/**
 * Home hero — the Camera-Hero: a scroll-scrubbed virtual camera flight over
 * the SCRIPE campus environment.
 *
 * A Server Component that renders the hero's complete dual-mode DOM (see
 * `src/styles/home.css` for the two-mode contract):
 *
 * - Static frame (default): full-viewport background plate under a night
 *   grade, the statement `<h1>` + tagline + both CTAs centered, and the four
 *   chapters as a flowing "flight plan" strip below the stage. This is the
 *   no-JS, reduced-motion and pre-hydration experience — a single flattened
 *   image layer, full content, no motion/parallax dependencies.
 * - Armed mode: `HeroDirector` arms the cinematic flight after `loadGsap()`
 *   resolves — the section becomes a tall scroll track, chapters become
 *   scrubbed camera beats, and the flight-plan strip hides because the same
 *   information now plays as the flight itself. The mid/foreground plates
 *   and the finale plate reveal too, but are rendered by `HeroArmedPlate`
 *   (this file's other client leaf), which only MOUNTS its `<Image>` once
 *   armed — a plain CSS `display: none` on their wrapper doesn't stop the
 *   browser fetching an unmounted `<img>`'s resource, so those three plates
 *   would otherwise download on every load, including no-JS/reduced-motion
 *   sessions that never arm. See `HeroArmedPlate.tsx` + `src/lib/
 *   hero-armed-store.ts` for the conditional-mount contract.
 *
 * HEADLINE SYSTEM (Task E2): the `<h1>` is a two-line value-proposition
 * statement, not the wordmark (the wordmark lives in the nav only). Line 1
 * (`headline.top`) sets in condensed-light Archivo; line 2
 * (`headline.pre|accent|post`) sets in extended-heavy Archivo with ONE
 * lime-accented keyword — the width-axis contrast between the two lines is
 * the typographic signature. Content keeps the accent as its own field so
 * each locale places it wherever its grammar puts it. Arabic renders the
 * same structure in Noto Kufi (no wdth axis — weight contrast only; see
 * `:lang(ar)` rules in home.css).
 *
 * THEME-ADAPTIVE FILM (Task G3): the stage is no longer night in both
 * themes. Dark theme flies the night film; light theme flies a golden-hour
 * DAY film. Two mechanisms, split by what each has to survive:
 *
 * - The BASE plate swaps in pure CSS. `.hero-plate` is a `background-image`
 *   driven by the `--hero-plate` custom property, which `home.css` §2
 *   re-points under `[data-theme="light"]`. A theme is only ever known in
 *   the browser (`data-theme` is written pre-paint from localStorage — see
 *   `src/theme/theme-script.ts`), so a server-rendered `<img srcset>` could
 *   not choose, and rendering both plates would download both (a
 *   `display: none` `<img>` still fetches — the trap
 *   `src/lib/hero-armed-store.ts` documents at length). A CSS background
 *   fetches exactly the plate the active theme resolves to, needs no
 *   JavaScript, and leaves static prerender completely untouched: BOTH
 *   themes' static/no-JS/reduced-motion frames are correct. The cost is
 *   losing `next/image`, so the AVIF/WebP encodes it would have negotiated
 *   are built as real files by `scripts/build-media-assets.mjs` and selected
 *   with `image-set()`. `role="img"` + `aria-label` keep the plate in the
 *   accessibility tree exactly as `<Image alt>` did.
 * - The PARALLAX plates gate on theme at MOUNT (`HeroArmedPlate`'s
 *   `nightOnly`), because the day set is incomplete: the owner's round-2
 *   drop still owes a day midground, foreground and finale (catalog §2).
 *   Until they land, the day film runs base plate + the shared foreground
 *   bokeh, and simply has no midground or finale layer — the flight still
 *   completes (the destination beat lands on the pulled-back base plate
 *   instead of cutting to a nadir shot). Armed mode is client-only, so a
 *   mount-time theme read is safe there in a way it is not for the base
 *   plate.
 *
 * Plate architecture (four plates, `public/media/hero/plate-*`):
 * - `plate-background` (`.hero-rig > .hero-plate`) — the base environment,
 *   always visible, driven by `CAMERA_PATH` at depth ×1.0. The only plate
 *   shown in static/no-JS/reduced-motion mode, and the only one that exists
 *   in both a night and a day cut today.
 * - `plate-midground` (`.hero-plate-mid`, armed-only) — stadium+pool cutout
 *   (alpha PNG), its own depth ×DEPTH_MID tween.
 * - `plate-foreground` (`.hero-plate-fg`, armed-only) — bokeh floodlight
 *   mast + tree canopy corners on a transparent center (alpha PNG), its own
 *   depth ×DEPTH_NEAR tween. Purely decorative: `aria-hidden` +
 *   pointer-events none, layered in front of everything (including the type
 *   layer) like a lens element in the rig.
 * - `plate-finale` (`.hero-plate-finale`, armed-only) — the nadir
 *   "operational picture" shot, crossfades in via opacity across scrub
 *   0.80→0.90 as the destination beat's background; static (no
 *   `CAMERA_PATH` tween) so it reads as a deliberate cut, not a
 *   continuation of the pan.
 *
 * The mid/foreground/finale plates are DOM SIBLINGS of `.hero-rig` (not
 * nested children of it): each gets its own independent, self-contained
 * transform-only GSAP tween computing an absolute depth-scaled path
 * (`HeroDirector`'s `flyPath` helper) rather than an additional transform
 * layered on top of the rig's own. Z-order back to front: background <
 * mid < finale < night-grade/signal accents < type (intro/finale text +
 * CTAs) < corner beats < foreground bokeh (topmost).
 *
 * CHAPTER SET (Task G2): the flight carries THREE corner chapters — 01
 * CLUBS, 02 VENUES, 03 INTELLIGENCE — plus the destination beat, down from
 * five corners. The cut chapter (Academies) framed the same crop of the
 * plate as Clubs, so it cost a fifth of the track for a shot the viewer had
 * already seen; its copy is carried below the fold by the trust strip, the
 * Academy product row and the solutions grid, all of which link out to
 * `/solutions/sports-academies`. Nothing was removed from the page, only
 * from the photograph.
 *
 * BEAT DESIGN LANGUAGE (Task E2): chapters 1–3 render as cinematic
 * lower-thirds — an outlined oversized chapter number (lime text-stroke), a
 * 1px lime rule, a mono-spaced meta stamp (`01 / CLUBS`), then the chapter
 * title + subtitle. The rail is a designed object: a hairline track with
 * mono two-digit stamps (00 = intro) and a glowing lime dot on the active
 * tick. The scroll cue is a thin line + chevron drift (no words), gated by
 * `prefers-reduced-motion` in CSS.
 *
 * Accessibility contract for the armed flight (controller ruling):
 * - The `<h1>`, the finale block and the CTA row are informative — they are
 *   NEVER `aria-hidden` and GSAP fades them with plain `opacity` (never
 *   `visibility`), so they stay in the accessibility tree and the CTA
 *   buttons stay in the tab order for the entire scroll track. A
 *   `:focus-within` rule in home.css force-reveals the CTA row for keyboard
 *   users who reach it while transparent.
 * - The corner beat captions (chapters 1–3) are decorative narration — the
 *   same information exists in the flight-plan strip (static mode) and in
 *   the sections below (`#product`, `#solutions`), so the beat containers
 *   are `aria-hidden` and keep the `autoAlpha` visual choreography.
 */
import type { HomeContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { HeroArmedPlate } from "./HeroArmedPlate";
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
      {/* `night-zone` (Task E5): the stage keeps the FILM's own token grade
          in both themes — the re-pin keeps the CTA lime-400-on-ink and every
          accent full-brightness when the page around the film is in light
          mode. Task G3 makes the photograph theme-adaptive but not this: the
          day cut is still a graded film (white type over a warm ND grad),
          not a light-mode UI surface, so its controls stay on the film's
          palette. Deliberately on the stage only, never on `.hero` itself:
          the flight-plan strip below belongs to the lit room. */}
      <div className="hero-stage night-zone">
        {/* Camera rig: transform-driven base plate container. Always visible
            (static and armed) — the single flattened layer under no-JS/
            reduced-motion. */}
        <div className="hero-rig" data-hero-rig>
          {/* The theme-adaptive base plate. Its photograph is a CSS
              `background-image` (`--hero-plate`, home.css §2), not an
              `<img>` — see the file header for why that is the only shape
              that stays correct in both themes with no JavaScript. `role`
              + `aria-label` restore the semantics `<Image alt>` carried;
              the label is written to describe the campus without naming a
              time of day, since which film a reader is looking at is a
              client-side fact this server-rendered attribute cannot know. */}
          <div className="hero-plate" role="img" aria-label={content.plateAlt} />
        </div>

        {/* Parallax mid layer (armed-only): stadium + pool cutout, its own
            depth ×DEPTH_MID tween (HeroDirector's `flyPath`). Sibling of
            `.hero-rig`, not nested inside it — see the file header. The
            wrapper div (GSAP's tween target, `[data-hero-plate-mid]`) always
            renders; `HeroArmedPlate` only MOUNTS the `<Image>` itself once
            armed, so this plate never downloads under reduced-motion/no-JS —
            see `HeroArmedPlate.tsx`'s header. `nightOnly`: the day film has
            no midground cutout yet — the delivered one has a tilt-shift
            camera mismatch and a matting artifact and was rejected
            (catalog §3), so light theme mounts no midground at all rather
            than compositing a plate that would not sit on its own
            background. */}
        <div className="hero-plate-mid" data-hero-plate-mid aria-hidden="true">
          <HeroArmedPlate src="/media/hero/plate-midground.png" nightOnly />
        </div>

        {/* Finale plate (armed-only): the nadir "operational picture" shot,
            crossfades in via opacity 0.76→0.86 as the destination beat's
            background. Always below the type layer. Conditional-mount — see
            the midground plate's comment above. `nightOnly`: no day finale
            exists (catalog §2 — nothing in the batch reads as a daylight
            top-down "living map", and there is no stand-in). In light theme
            the destination beat simply plays over the pulled-back day plate,
            which is a complete frame, not a hole. */}
        <div className="hero-plate-finale" data-hero-plate-finale aria-hidden="true">
          <HeroArmedPlate src="/media/hero/plate-finale.png" nightOnly />
        </div>

        {/* Night grade + brand atmosphere. Order: cooling tint < legibility
            grade < lime horizon bloom < film grain (masks plate upscale
            during the flight's close passes) < crop-mark corners. */}
        <div className="hero-tint" aria-hidden="true" />
        <div className="hero-grade" aria-hidden="true" />
        <div className="hero-bloom" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-corners" aria-hidden="true" />
        <span className="hero-scanline" data-hero-scanline aria-hidden="true" />

        {/* Center column: intro ⇄ finale swap zone + the shared CTA row. */}
        <div className="hero-center">
          <div className="hero-swap">
            <div className="hero-intro" data-hero-intro>
              <h1 className="hero-statement">
                <span className="hero-statement-top hero-enter">{content.headline.top}</span>
                <span className="hero-statement-main hero-enter hero-enter-2">
                  {content.headline.pre}
                  <em className="hero-statement-accent">{content.headline.accent}</em>
                  {content.headline.post}
                </span>
              </h1>
              <p className="hero-tagline hero-enter hero-enter-3">{content.tagline}</p>
            </div>
            <div className="hero-finale" data-hero-finale>
              <span className="hero-finale-rule" aria-hidden="true" />
              <p className="hero-stamp">
                {stamp(content.chapters.length - 1)}&nbsp;/&nbsp;{finale.rail}
              </p>
              <p className="hero-finale-title">{finale.title}</p>
              <p className="hero-beat-subtitle">{finale.subtitle}</p>
            </div>
          </div>

          <div className="hero-enter hero-enter-4 flex flex-wrap items-center justify-center gap-3" data-hero-ctas>
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

        {/* Corner beats: chapters 1–3 as cinematic lower-thirds (armed mode
            only) — outlined chapter number, lime rule, mono meta stamp,
            title, subtitle. aria-hidden: decorative narration — the same
            chapters are exposed to AT via the flight-plan strip (static) and
            the sections below (armed); see the file header. */}
        {corners.map((chapter, index) => (
          <div className="hero-beat" data-hero-beat aria-hidden="true" key={chapter.rail}>
            <span className="hero-beat-no">{stamp(index)}</span>
            <div className="hero-beat-body">
              <p className="hero-stamp">
                {stamp(index)}&nbsp;/&nbsp;{chapter.rail}
              </p>
              <p className="hero-beat-title">{chapter.title}</p>
              <p className="hero-beat-subtitle">{chapter.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Progress rail: intro (00) + all chapters (armed mode, wide
            viewports) — hairline track, mono stamps, lime active dot. */}
        <div className="hero-rail" aria-hidden="true">
          {[content.railIntro, ...content.chapters.map((chapter) => chapter.rail)].map((label, index) => (
            <div className="hero-tick" data-hero-tick key={label}>
              <span className="hero-tick-label">{label}</span>
              <span className="hero-tick-no">{String(index).padStart(2, "0")}</span>
              <span className="hero-tick-dot" />
            </div>
          ))}
        </div>

        {/* Scroll cue: thin line + chevron drift — wordless, decorative,
            drift gated by prefers-reduced-motion in home.css. */}
        <div className="hero-hint" data-hero-hint aria-hidden="true">
          <span className="hero-hint-line" />
          <svg
            className="hero-hint-chevron"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 10 7 7 7-7" />
          </svg>
        </div>

        {/* Foreground bokeh overlay (armed-only): floodlight mast + tree
            canopy corners on a transparent center, its own depth ×DEPTH_NEAR
            tween. Topmost layer — sits in front of everything, including the
            type layer, like a lens element on the rig. Purely decorative and
            inert: aria-hidden, no pointer events, never blocks interaction.
            Conditional-mount — see the midground plate's comment above.
            SHARED by both films (no `nightOnly`): the plate is a heavily
            defocused near-black canopy silhouette with warm rim light, and
            silhouetted foliage against a bright sky is as much a daylight
            look as a night one. Its floodlight mast is lit, which is one
            beat wrong at sunrise — the day-mode grade in home.css §2 dims
            this layer to hold that in check until the true day foreground
            lands (catalog §2 calls the same substitution cosmetic debt, not
            a blocker). */}
        <div className="hero-plate-fg" data-hero-plate-fg aria-hidden="true">
          <HeroArmedPlate src="/media/hero/plate-foreground.png" />
        </div>
      </div>

      {/* Flight plan: the chapters as flowing content (static mode only). */}
      <div className="hero-plan">
        {content.chapters.map((chapter, index) => (
          <div className="hero-plan-item" key={chapter.rail}>
            <p className="hero-plan-rail">
              {stamp(index)}&nbsp;/&nbsp;{chapter.rail}
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
