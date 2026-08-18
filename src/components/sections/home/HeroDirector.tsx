"use client";

/**
 * HeroDirector — arms and drives the Camera-Hero's scroll-scrubbed flight.
 *
 * The hero's motion client leaf (the other, `HeroArmedPlate.tsx`, only
 * conditionally mounts an `<Image>` — see its own header). Renders nothing;
 * on mount it calls `loadGsap()` (the sanctioned lazy loader — GSAP +
 * ScrollTrigger never enter the initial route chunk) and, only if that
 * resolves:
 *
 * 1. sets `data-armed` on the hero root, flipping the CSS into cinematic
 *    mode (tall scroll track, sticky stage, plate/beat/rail/scanline layers
 *    visible, flight-plan strip hidden — see `src/styles/home.css`), and
 *    flips `src/lib/hero-armed-store.ts`'s flag so the three armed-only
 *    plate images (mounted by `HeroArmedPlate`) actually enter the DOM;
 * 2. builds one scrubbed timeline over the whole track that flies the
 *    background rig, midground and foreground plates each along their own
 *    depth-scaled copy of {@link CAMERA_PATH} (transform-only: scale +
 *    x/yPercent + rotateX — see `flyPath`), crossfades in the finale plate,
 *    and choreographs the type beats (autoAlpha + y — never layout
 *    properties);
 * 3. mirrors flight progress onto the chapter rail by toggling
 *    `data-active` per tick (CSS owns the transition).
 *
 * `loadGsap()` returns `null` server-side and under
 * `prefers-reduced-motion: reduce`, so this component arms nothing there —
 * the server-rendered static frame (background plate only, no parallax)
 * simply remains, which is the designed degraded state. The scanline and
 * every beat only move with scroll (scrub), i.e. under direct user control
 * — no self-running motion, so no WCAG 2.2.2 pause control is required.
 *
 * CAMERA MATH (Task G2 — the three-chapter path)
 * ------------------------------------------------------------------------
 * Task E2 bought real travel (peak scale 1.60, pans to ±15) at the price of
 * a 560svh track: five corner chapters plus a finale, 6,048px of hero on an
 * 11,813px page — more than half the site was one photograph, and the first
 * link below the fold sat at y≈6,893. G2 cuts the track to 220svh and the
 * corner chapters from five to three, because two of the five were not
 * distinct SHOTS: "Academies" framed the same crop of the plate as "Clubs"
 * (the audit's "five chapters of the same picture"), and the copy for both
 * dropped chapters already exists below the fold.
 *
 * The rule this path is built on: three destinations, three quadrants,
 * three scales, no two beats sharing a crop.
 *
 *   0.24  CLUBS         (−x, −y)  s 1.53  the lit clubhouse colonnade and
 *                                         members' walkway — the
 *                                         organization's built home
 *   0.46  VENUES        (+x, −y)  s 1.58  the Olympic pool and padel courts
 *                                         — the bookable surfaces
 *   0.68  INTELLIGENCE  (−x, +y)  s 1.68  a tight push onto the floodlit
 *                                         match pitch inside the bowl —
 *                                         the deepest point of the flight
 *
 * The three x/y sign pairs are mutually exclusive quadrants, scale rises
 * monotonically to a single peak at the last beat, and the pull-back to
 * 1.20 then releases all of it at once into the finale. Denser, not faster:
 * the flight makes three large moves where it used to make five small ones.
 *
 * Fix round (screenshots in the task report): the clubs keyframe first sat
 * at (−12.5, −3.5) s 1.46, which framed stadium, practice pitches, pool and
 * courts all at once — a wide establishing shot that repeated most of what
 * the intro frame had already shown, and re-committed the exact sin the
 * audit named. Pushing it to (−14, −6.5) s 1.53 crops the pool and the open
 * sky out and fills the frame with the colonnade's lit arcade instead, so
 * clubs reads as architecture, venues as water and court surface, and
 * intelligence as turf. Three subjects, not three crops of one.
 *
 * Coverage guard (conservative form, as documented since Task 13): at scale
 * `s`, a pan is safe while |x|,|y| ≤ L(s) = (s − 1) / (2s) × 100. This is
 * intentionally stricter than the exact geometry (GSAP writes
 * `translate(...) scale(...)`, so percent translations are NOT multiplied
 * by the scale — the exact symmetric bound is (s − 1) × 50), leaving the
 * difference as guaranteed slack. `transform-origin` is 50% 42%, so the
 * vertical margins are asymmetric: overscan above the origin is 0.84×L
 * (42/50) for downward pans (+y) and 1.16×L (58/50) for upward pans (−y).
 *
 * Per-keyframe margin audit (L = (s−1)/(2s)×100; slack = limit − |used|):
 *
 *   at    scale   L      x used  x slack  y used  y limit        y slack
 *   0.00  1.14   6.14    0       6.14     0       —              —
 *   0.24  1.53  17.32  −14.0     3.32    −6.5     20.09 (1.16L) 13.59
 *   0.46  1.58  18.35  +13.0     5.35   −10.5     21.29 (1.16L) 10.79
 *   0.68  1.68  20.24  −11.5     8.74    +8.5     17.00 (0.84L)  8.50
 *   0.86  1.20   8.33    0       8.33    −2.0      9.67 (1.16L)  7.67
 *   1.00  1.24   9.68    0       9.68    −3.0     11.23 (1.16L)  8.23
 *
 * Tightest margin: 3.32 percentage points (x at the 0.24 clubs move) —
 * marginally SAFER than E2's 3.19, on top of the conservative-vs-exact
 * slack above (÷s ≈ another 30% of L at these scales).
 *
 * Depth-scaled layers: `flyPath` multiplies every excursion by the layer's
 * depth, so the mid and foreground plates travel further than the table
 * above. The midground (DEPTH_MID 1.10) clears the conservative bound at
 * every keyframe — tightest is 3.01 (x at 0.24: s 1.583, L 18.41, |x| 15.4).
 * The foreground (DEPTH_NEAR 1.85) exceeds the CONSERVATIVE bound at 0.24
 * (|x| 25.90 vs L 24.75) but clears the EXACT bound with 23.1 points to
 * spare ((s−1)×50 = 49.03 at s 1.9805) — the same condition E2's path had
 * at its own 0.63 peak, and harmless either way: the foreground is a
 * transparent-centre bokeh overlay whose edges reveal nothing when they
 * cross the frame.
 *
 * Peak upscale: the background plate is 1915×821, object-cover onto a
 * 1920×1080 stage is ×1.315, and the camera's peak 1.68 takes the total to
 * ×2.21 — a hair above E2's ×2.10 at its own peak, and still inside what
 * the night grade plus the `.hero-grain` overlay mask (home.css §2).
 *
 * rotateX tilt: the stage carries `perspective: 1500px` (home.css) and each
 * keyframe tips the ground plane by `tilt` degrees (max 2.6°). At 2.6° on a
 * ~1080px-tall plate the far edge's projected shrink is ≈ 1500/(1500+540·
 * sin 2.6°) ≈ 1.6% — comfortably inside the tightest 3.19pp margin. The
 * rig and midground receive the SAME tilt (never depth-scaled: a tilt
 * difference would shear the cutout off its own background copy); only the
 * foreground bokeh (transparent center, nothing to reveal) exaggerates it.
 *
 * Layer depth model: `flyPath` walks the SAME `CAMERA_PATH` keyframes for
 * every layer but scales each leg's "excursion from rest" (scale delta
 * from 1, and every x/y pan) by that layer's depth factor — depth 1
 * reproduces the rig's own path exactly; DEPTH_MID/DEPTH_NEAR make the
 * mid/foreground plates travel further per scroll unit, which is what
 * reads as parallax. DEPTH_MID stays low (1.10) because the midground is a
 * cutout of subjects that also exist in the background plate — every extra
 * point of depth is a visible "ghost" offset from its own source pixels at
 * these pan amplitudes; the foreground (pure overlay, no source twin) is
 * where depth is spent. The finale plate gets no `flyPath` call at all:
 * it's a static "cut" to a different (nadir) framing, only ever animated
 * by its own opacity crossfade.
 *
 * Rest-state contract: every plate's static CSS transform in home.css MUST
 * equal the depth-scaled keyframe 0 — rig scale(1.14), mid scale(1.154)
 * [1+0.14×1.10], fg scale(1.259) [1+0.14×1.85] — GSAP's first scrubbed
 * render reads the live computed transform as its tween start value.
 *
 * Accessibility contract (controller ruling): informative layers — the
 * `<h1>` intro, the finale block and the CTA row — are faded with plain
 * `opacity`, NEVER `autoAlpha` (whose `visibility: hidden` would remove
 * them from the accessibility tree and tab order for most of the flight).
 * The CTA row therefore stays tabbable while transparent; a
 * `:focus-within` rule in home.css force-reveals it for keyboard users,
 * and `pointerEvents` set-tweens (below) stop mouse users from clicking
 * an invisible control mid-flight without touching keyboard focusability.
 * Only the `aria-hidden` corner beats and plate layers (decorative, see
 * Hero.tsx) keep `autoAlpha`/plain opacity as noted per layer.
 *
 * RTL note: camera x-moves are physical on purpose — the photographic
 * plates never mirror, so a fly-over reads identically in both directions.
 * Text beats are positioned by logical CSS properties and need no JS
 * handling.
 */
import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";
import { setHeroArmed } from "@/lib/hero-armed-store";

/**
 * One camera keyframe: `at` is timeline progress (0–1 over the whole scroll
 * track); `scale`/`x`/`y` are the base rig transform at that instant
 * (`x`/`y` in percent of the plate's own size, depth ×1.0); `tilt` is the
 * rotateX in degrees (applied un-scaled to rig+mid, ×TILT_NEAR to the
 * foreground — see the camera-math header for why).
 *
 * The six keyframes are: intro hold, one per corner chapter (clubs →
 * clubhouse colonnade, venues → pool + courts dive, intelligence → tight
 * push onto the match pitch), the pull-back to the organization finale, and
 * a settle drift. Margins per keyframe are audited in the header table.
 */
const CAMERA_PATH = [
  { at: 0.0, scale: 1.14, x: 0, y: 0, tilt: 0 },
  { at: 0.24, scale: 1.53, x: -14, y: -6.5, tilt: 2.0 },
  { at: 0.46, scale: 1.58, x: 13, y: -10.5, tilt: 2.6 },
  { at: 0.68, scale: 1.68, x: -11.5, y: 8.5, tilt: 2.2 },
  { at: 0.86, scale: 1.2, x: 0, y: -2, tilt: 0.5 },
  { at: 1.0, scale: 1.24, x: 0, y: -3, tilt: 0.7 },
] as const;

/** Midground plate depth multiplier. Kept LOW on purpose: the midground is
 *  a cutout of subjects that also exist in the background plate, so its
 *  parallax offset is simultaneously a ghost offset from its own source
 *  pixels — at E2's pan amplitudes (±11.5 vs the old ±3.4) 1.10 is the
 *  ceiling before the stadium rim visibly doubles. Its absolute travel is
 *  still ~3× the old path's. */
const DEPTH_MID = 1.1;

/** Foreground plate depth multiplier — the strongest parallax layer and
 *  where E2 spends the depth budget (1.4 → 1.85): the source is a mostly
 *  transparent cutout with no twin in the background plate, so large
 *  excursions can't ghost and its own edges reveal nothing (transparent). */
const DEPTH_NEAR = 1.85;

/** Foreground tilt exaggeration (rig+mid tilt is never scaled — header). */
const TILT_NEAR = 1.3;

/** Progress at which each corner beat's caption is fully on screen — one
 *  per CAMERA_PATH corner keyframe, in the same order. */
const BEAT_IN = [0.24, 0.46, 0.68] as const;

/** How long (in progress units) a caption takes to enter / to leave. */
const BEAT_FADE = 0.055;

/** How long a caption holds at full opacity after arriving, before its exit
 *  tween starts. BEAT_FADE + BEAT_HOLD + BEAT_FADE = 0.22 — just inside the
 *  0.22 spacing between corner keyframes, so caption N's exit lands exactly
 *  where caption N+1's entrance begins (a baton pass, never an overlap) and
 *  no caption is ever mid-flight alone with a frame it does not describe.
 *  On the 220svh track that is ~285px of scroll per caption. */
const BEAT_HOLD = 0.11;

/** Progress buckets mapping scroll position to the active rail tick:
 *  index i is active while progress < RAIL_BOUNDS[i]; the last tick is
 *  active beyond the final bound. Five ticks now (intro + four chapters),
 *  each bound set slightly AHEAD of its caption's entrance so the rail
 *  leads the beat rather than trailing it. */
const RAIL_BOUNDS = [0.17, 0.4, 0.62, 0.8] as const;

/**
 * Mounts the flight. Renders `null`; all work happens in the effect. See
 * the file header for the arming contract.
 */
export function HeroDirector() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    void (async () => {
      const mods = await loadGsap();
      if (!mods || cancelled) return;

      const root = document.querySelector<HTMLElement>("[data-hero-root]");
      if (!root) return;

      // Late-arming guard: arming grows the hero into a ~2.2-viewport scroll
      // track. If the user has already scrolled past the static frame (slow
      // network, restored scroll position), inserting that much scroll would
      // yank the page out from under them — the static hero is the designed
      // experience for that session instead.
      if (window.scrollY > window.innerHeight * 0.4) return;

      const { gsap } = mods;

      root.setAttribute("data-armed", "");
      // Mounts the midground/finale/foreground `<Image>`s inside their
      // always-present wrapper divs (see `HeroArmedPlate.tsx` +
      // `src/lib/hero-armed-store.ts`) — the wrapper's CSS `display: none`
      // alone does not stop the browser from fetching an unmounted image's
      // resource, so this store gate is what actually stops the download
      // under reduced-motion/no-JS, not the CSS.
      setHeroArmed(true);

      const ticks = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-tick]"));
      let activeTick = -1;
      const setActiveTick = (progress: number) => {
        let next = RAIL_BOUNDS.findIndex((bound) => progress < bound);
        if (next === -1) next = RAIL_BOUNDS.length;
        if (next === activeTick) return;
        activeTick = next;
        ticks.forEach((tick, i) => {
          if (i === next) tick.setAttribute("data-active", "");
          else tick.removeAttribute("data-active");
        });
      };

      const ctx = gsap.context(() => {
        const stage = root.querySelector<HTMLElement>(".hero-stage");
        const beats = gsap.utils.toArray<HTMLElement>("[data-hero-beat]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActiveTick(self.progress),
          },
        });

        // Camera flight: one continuous transform-only path per plate layer.
        // `flyPath` walks CAMERA_PATH's legs and scales each leg's excursion
        // from rest (scale delta from 1, and x/y) by `depth`; the rotateX
        // tilt is depth-INDEPENDENT (`tiltFactor`, 1 for rig+mid — see the
        // camera-math header). Independent tweens per layer (not a shared
        // transform inherited from a parent) keep every leg self-contained
        // and exactly reversal-safe.
        const flyPath = (selector: string, depth: number, tiltFactor = 1) => {
          for (let i = 1; i < CAMERA_PATH.length; i++) {
            const prev = CAMERA_PATH[i - 1];
            const next = CAMERA_PATH[i];
            tl.to(
              selector,
              {
                scale: 1 + (next.scale - 1) * depth,
                xPercent: next.x * depth,
                yPercent: next.y * depth,
                rotateX: next.tilt * tiltFactor,
                duration: next.at - prev.at,
                ease: "power1.inOut",
              },
              prev.at,
            );
          }
        };

        flyPath("[data-hero-rig]", 1);
        flyPath("[data-hero-plate-mid]", DEPTH_MID);
        flyPath("[data-hero-plate-fg]", DEPTH_NEAR, TILT_NEAR);

        // Intro departs: statement/tagline + CTAs + hint clear the frame.
        // Informative layers (h1, CTA row) fade with plain `opacity` so they
        // never leave the accessibility tree — see the file header. The
        // aria-hidden hint may use autoAlpha freely. On the 220svh track the
        // statement holds for the first 0.09 of progress (~117px of scroll)
        // and is clear of the frame by 0.17, well before the first caption
        // starts entering at 0.185.
        tl.to("[data-hero-intro]", { opacity: 0, y: -34, duration: 0.08, ease: "power2.in" }, 0.09);
        tl.to("[data-hero-ctas]", { opacity: 0, y: -24, duration: 0.07, ease: "power2.in" }, 0.1);
        // Transparent controls must not catch stray clicks mid-flight; a
        // reversed scrub past a set() restores the previous value, so this
        // stays correct scrolling both ways. Keyboard focus is unaffected by
        // pointer-events (the :focus-within rule in home.css reveals the row).
        tl.set("[data-hero-ctas]", { pointerEvents: "none" }, 0.18);
        tl.to("[data-hero-hint]", { autoAlpha: 0, duration: 0.05 }, 0.04);

        // Authoritative "all captions hidden" at the head of the timeline.
        // Without it, a backwards scroll-seek could stack two to four
        // captions on top of each other: the per-beat exit `to()` tweens
        // record their start value LAZILY on first render, so a seek that
        // lands before a never-yet-rendered exit tween makes GSAP capture
        // whatever is on the element right then (often a fully visible
        // caption) and re-apply it at ratio 0. Pinning every beat to
        // autoAlpha 0 at position 0 means that lazy capture can only ever
        // read the hidden state, so at most the one caption whose own
        // fromTo covers the playhead is visible. The `set` sits first in the
        // child order, so each beat's own tweens still override it for their
        // own window.
        tl.set(beats, { autoAlpha: 0 }, 0);

        // Corner beats: caption in as the camera arrives, out as it leaves.
        // Every fromTo below sets `immediateRender: false` — with the GSAP
        // default, a later-positioned fromTo applies its `from` state the
        // moment the timeline is built, which would hide the CTA row (and
        // pre-position every beat) at progress 0. The armed-mode CSS already
        // hides beats/finale until their tween runs, so nothing flashes.
        beats.forEach((beat, i) => {
          const arrive = BEAT_IN[i] ?? 0;
          tl.fromTo(
            beat,
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: BEAT_FADE, ease: "power2.out", immediateRender: false },
            arrive - BEAT_FADE,
          );
          tl.to(beat, { autoAlpha: 0, y: -26, duration: BEAT_FADE, ease: "power2.in" }, arrive + BEAT_HOLD);
        });

        // Finale plate: crossfades in as the destination beat's background —
        // a deliberate cut to the nadir framing, not a continuation of the
        // pan, so it has no `flyPath` tween of its own (see file header).
        // Decorative (aria-hidden): autoAlpha is fine here, unlike the
        // informative text/CTA layers below.
        tl.fromTo(
          "[data-hero-plate-finale]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.1, ease: "power1.inOut", immediateRender: false },
          0.8,
        );

        // Finale: destination chapter + the CTAs return, centered. Both are
        // informative — plain `opacity`, never autoAlpha (file header). The
        // last caption's exit finishes at 0.845, so the destination block
        // lands on an empty frame rather than under a leaving lower-third.
        tl.fromTo(
          "[data-hero-finale]",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out", immediateRender: false },
          0.86,
        );
        tl.set("[data-hero-ctas]", { pointerEvents: "auto" }, 0.89);
        tl.fromTo(
          "[data-hero-ctas]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.07, ease: "power2.out", immediateRender: false },
          0.89,
        );

        // Signal scanline: one full sweep, strictly scroll-bound.
        tl.fromTo(
          "[data-hero-scanline]",
          { y: 0 },
          { y: () => stage?.offsetHeight ?? 0, duration: 1, immediateRender: false },
          0,
        );
      }, root);

      setActiveTick(0);

      cleanup = () => {
        ctx.revert();
        root.removeAttribute("data-armed");
        setHeroArmed(false);
        ticks.forEach((tick) => tick.removeAttribute("data-active"));
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
