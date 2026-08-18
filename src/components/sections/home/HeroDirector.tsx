"use client";

/**
 * HeroDirector — arms and drives the Camera-Hero's scroll-scrubbed flight.
 *
 * The hero's only client leaf. Renders nothing; on mount it calls
 * `loadGsap()` (the sanctioned lazy loader — GSAP + ScrollTrigger never
 * enter the initial route chunk) and, only if that resolves:
 *
 * 1. sets `data-armed` on the hero root, flipping the CSS into cinematic
 *    mode (tall scroll track, sticky stage, beats/rail/scanline visible,
 *    flight-plan strip hidden — see `src/styles/home.css`);
 * 2. builds one scrubbed timeline over the whole track that flies the
 *    camera rig along {@link CAMERA_PATH} (transform-only: scale +
 *    x/yPercent) and choreographs the type beats (autoAlpha + y — never
 *    layout properties);
 * 3. mirrors flight progress onto the chapter rail by toggling
 *    `data-active` per tick (CSS owns the transition).
 *
 * `loadGsap()` returns `null` server-side and under
 * `prefers-reduced-motion: reduce`, so this component arms nothing there —
 * the server-rendered static frame simply remains, which is the designed
 * degraded state. The scanline and every beat only move with scroll
 * (scrub), i.e. under direct user control — no self-running motion, so no
 * WCAG 2.2.2 pause control is required.
 *
 * RTL note: camera x-moves are physical on purpose — the photographic plate
 * never mirrors, so a fly-over reads identically in both directions. Text
 * beats are positioned by logical CSS properties and need no JS handling.
 */
import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";

/**
 * One camera keyframe: `at` is timeline progress (0–1 over the whole scroll
 * track); `scale`/`x`/`y` are the rig transform at that instant (`x`/`y` in
 * percent of the plate's own size). Coverage guard: at scale `s`, |x| and
 * |y| must stay below `(s - 1) / (2 * s) * 100` or the pan reveals a plate
 * edge — current values keep ~2% margin at every keyframe.
 *
 * The seven keyframes are: intro hold, one per corner chapter (clubs,
 * academies, venues, intelligence), the pull-back to the organization
 * finale, and a settle drift. Adding plates later extends this path without
 * touching the timeline construction below.
 */
const CAMERA_PATH = [
  { at: 0.0, scale: 1.06, x: 0, y: 0 },
  { at: 0.16, scale: 1.16, x: -4, y: -2 },
  { at: 0.32, scale: 1.22, x: 3, y: -5 },
  { at: 0.48, scale: 1.28, x: -2, y: -8 },
  { at: 0.64, scale: 1.33, x: 1.5, y: -11 },
  { at: 0.84, scale: 1.1, x: 0, y: -4 },
  { at: 1.0, scale: 1.13, x: 0, y: -4.5 },
] as const;

/** Progress at which each corner beat's caption is fully on screen. */
const BEAT_IN = [0.16, 0.32, 0.48, 0.64] as const;

/** How long (in progress units) a caption takes to enter / to leave. */
const BEAT_FADE = 0.05;

/** Progress buckets mapping scroll position to the active rail tick:
 *  index i is active while progress < RAIL_BOUNDS[i]; the last tick is
 *  active beyond the final bound. */
const RAIL_BOUNDS = [0.12, 0.28, 0.44, 0.6, 0.76] as const;

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

        // Camera flight: one continuous transform-only path over the rig.
        for (let i = 1; i < CAMERA_PATH.length; i++) {
          const prev = CAMERA_PATH[i - 1];
          const next = CAMERA_PATH[i];
          tl.to(
            "[data-hero-rig]",
            {
              scale: next.scale,
              xPercent: next.x,
              yPercent: next.y,
              duration: next.at - prev.at,
              ease: "power1.inOut",
            },
            prev.at,
          );
        }

        // Intro departs: wordmark/tagline + CTAs + hint clear the frame.
        tl.to("[data-hero-intro]", { autoAlpha: 0, y: -28, duration: 0.06, ease: "power2.in" }, 0.09);
        tl.to("[data-hero-ctas]", { autoAlpha: 0, y: -22, duration: 0.05, ease: "power2.in" }, 0.1);
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
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: BEAT_FADE, ease: "power2.out", immediateRender: false },
            arrive - BEAT_FADE / 2,
          );
          tl.to(beat, { autoAlpha: 0, y: -24, duration: BEAT_FADE, ease: "power2.in" }, arrive + 0.09);
        });

        // Finale: destination chapter + the CTAs return, centered.
        tl.fromTo(
          "[data-hero-finale]",
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out", immediateRender: false },
          0.8,
        );
        tl.fromTo(
          "[data-hero-ctas]",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out", immediateRender: false },
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
