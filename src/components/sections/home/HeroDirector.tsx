"use client";

/**
 * HeroDirector — arms and drives the Camera-Hero's scroll-scrubbed flight.
 *
 * The hero's only client leaf. Renders nothing; on mount it calls
 * `loadGsap()` (the sanctioned lazy loader — GSAP + ScrollTrigger never
 * enter the initial route chunk) and, only if that resolves:
 *
 * 1. sets `data-armed` on the hero root, flipping the CSS into cinematic
 *    mode (tall scroll track, sticky stage, plate/beat/rail/scanline layers
 *    visible, flight-plan strip hidden — see `src/styles/home.css`);
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
 * CAMERA MATH (Task E2 — the "felt travel" path)
 * ------------------------------------------------------------------------
 * The previous path was dampened ×0.85 to protect a below-target plate
 * (1915×821) from upscale softness — and the flight became imperceptible
 * (peak scale 1.28, pans ≤ ±3.4). E2 reverses that trade: real travel wins,
 * and the upscale softness at close passes is masked by the night grade +
 * film grain overlay (`.hero-grain`, home.css) — a standard colorist move.
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
 *   0.15  1.34  12.69   −9.5     3.19    +3.2     10.66 (0.84L)  7.46
 *   0.31  1.42  14.79   +8.5     6.29    +4.5     12.42 (0.84L)  7.92
 *   0.47  1.52  17.11  +11.5     5.61   −11.0     19.85 (1.16L)  8.85
 *   0.63  1.60  18.75  −15.0     3.75    −6.0     21.75 (1.16L) 15.75
 *   0.82  1.18   7.63    0       7.63    −2.5      8.85 (1.16L)  6.35
 *   1.00  1.22   9.02    0       9.02    −3.2     10.46 (1.16L)  7.26
 *
 * Tightest margin: 3.19 percentage points (x at the 0.15 clubs dive) — on
 * top of the conservative-vs-exact slack above (÷s ≈ another 25% of L).
 *
 * Task E2 fix round: the 0.63 intelligence keyframe originally panned
 * (−11, +5.5) at scale 1.46 — the same quadrant and near-identical
 * magnitude as the 0.15 clubs keyframe's (−9.5, +3.2) at scale 1.34, so the
 * two beats read as the same shot (same wide establishing crop: pool,
 * courts and stadium bowl all in frame together). Retuned to (−15, −6) at
 * scale 1.60 — the path's new peak: x pushed further into the same side
 * (past the courts, isolating the clubhouse's lit colonnade/walkway) while
 * y flips sign (into the one quadrant no other keyframe uses, −x/−y) and
 * the deeper zoom crops the practice pitch and open sky out of frame
 * entirely. Verified via scroll-position screenshots at progress 0.15 and
 * 0.63 (script + captures in the task report) — the two beats now read as
 * an establishing wide shot vs. a tight architectural detail, unmistakably
 * different places. y limit is 1.16L here (was 0.84L) because the pan
 * direction flipped from +y to −y — see the asymmetric-origin note above.
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

/**
 * One camera keyframe: `at` is timeline progress (0–1 over the whole scroll
 * track); `scale`/`x`/`y` are the base rig transform at that instant
 * (`x`/`y` in percent of the plate's own size, depth ×1.0); `tilt` is the
 * rotateX in degrees (applied un-scaled to rig+mid, ×TILT_NEAR to the
 * foreground — see the camera-math header for why).
 *
 * The seven keyframes are: intro hold, one per corner chapter (clubs →
 * clubhouse/stadium east, academies → training pitches, venues → pool dive,
 * intelligence → stadium bowl), the pull-back to the organization finale,
 * and a settle drift. Margins per keyframe are audited in the header table.
 */
const CAMERA_PATH = [
  { at: 0.0, scale: 1.14, x: 0, y: 0, tilt: 0 },
  { at: 0.15, scale: 1.34, x: -9.5, y: 3.2, tilt: 1.6 },
  { at: 0.31, scale: 1.42, x: 8.5, y: 4.5, tilt: 2.2 },
  { at: 0.47, scale: 1.52, x: 11.5, y: -11, tilt: 2.6 },
  { at: 0.63, scale: 1.6, x: -15, y: -6, tilt: 2.0 },
  { at: 0.82, scale: 1.18, x: 0, y: -2.5, tilt: 0.5 },
  { at: 1.0, scale: 1.22, x: 0, y: -3.2, tilt: 0.7 },
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

/** Progress at which each corner beat's caption is fully on screen. */
const BEAT_IN = [0.15, 0.31, 0.47, 0.63] as const;

/** How long (in progress units) a caption takes to enter / to leave. */
const BEAT_FADE = 0.05;

/** Progress buckets mapping scroll position to the active rail tick:
 *  index i is active while progress < RAIL_BOUNDS[i]; the last tick is
 *  active beyond the final bound. */
const RAIL_BOUNDS = [0.12, 0.27, 0.43, 0.59, 0.76] as const;

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

      // Late-arming guard: arming grows the hero into a ~5.6-viewport scroll
      // track. If the user has already scrolled past the static frame (slow
      // network, restored scroll position), inserting that much scroll would
      // yank the page out from under them — the static hero is the designed
      // experience for that session instead.
      if (window.scrollY > window.innerHeight * 0.4) return;

      const { gsap } = mods;

      root.setAttribute("data-armed", "");

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
        // aria-hidden hint may use autoAlpha freely.
        tl.to("[data-hero-intro]", { opacity: 0, y: -34, duration: 0.06, ease: "power2.in" }, 0.08);
        tl.to("[data-hero-ctas]", { opacity: 0, y: -24, duration: 0.05, ease: "power2.in" }, 0.09);
        // Transparent controls must not catch stray clicks mid-flight; a
        // reversed scrub past a set() restores the previous value, so this
        // stays correct scrolling both ways. Keyboard focus is unaffected by
        // pointer-events (the :focus-within rule in home.css reveals the row).
        tl.set("[data-hero-ctas]", { pointerEvents: "none" }, 0.14);
        tl.to("[data-hero-hint]", { autoAlpha: 0, duration: 0.04 }, 0.05);

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
            arrive - BEAT_FADE / 2,
          );
          tl.to(beat, { autoAlpha: 0, y: -26, duration: BEAT_FADE, ease: "power2.in" }, arrive + 0.09);
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
          0.76,
        );

        // Finale: destination chapter + the CTAs return, centered. Both are
        // informative — plain `opacity`, never autoAlpha (file header).
        tl.fromTo(
          "[data-hero-finale]",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.07, ease: "power2.out", immediateRender: false },
          0.8,
        );
        tl.set("[data-hero-ctas]", { pointerEvents: "auto" }, 0.84);
        tl.fromTo(
          "[data-hero-ctas]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.06, ease: "power2.out", immediateRender: false },
          0.84,
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
