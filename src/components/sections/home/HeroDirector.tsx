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
 *    x/yPercent + rotateX — see `flyPath`), crossfades each corner
 *    chapter's own establishing still in and out over its beat
 *    ({@link CHAPTER_IN}), crossfades in the finale plate, and choreographs
 *    the type beats (autoAlpha + y — never layout properties);
 * 3. mirrors flight progress onto the chapter rail by toggling
 *    `data-active` per tick (CSS owns the transition), and onto the chapter
 *    stills' mount gate ({@link CHAPTER_REACH_AT}), so each still's bytes
 *    are only spent once the flight is actually approaching its beat.
 *
 * `loadGsap()` returns `null` server-side and under
 * `prefers-reduced-motion: reduce`, so this component arms nothing there —
 * the server-rendered static frame (background plate only, no parallax)
 * simply remains, which is the designed degraded state. The scanline and
 * every beat only move with scroll (scrub), i.e. under direct user control
 * — no self-running motion, so no WCAG 2.2.2 pause control is required.
 *
 * CAMERA MATH (Task G2's three-chapter path, retimed in Wave I)
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
 * WAVE I — WHY THE TRACK IS 280svh AND NOT 220svh
 * ------------------------------------------------------------------------
 * G2 sized the 220svh track for what the hero contained AT THE TIME: three
 * camera moves and three captions over one aerial. Task H2 then added three
 * full-bleed establishing photographs, each needing its own entrance, hold
 * and exit — into a budget that had already been spent. The stills got the
 * remainder, and the remainder was not enough:
 *
 *   on 220svh the scrubbed distance is 2,376 − 1,080 = 1,296px, and each
 *   still held at FULL opacity for 0.128 of that — 166px, about a wheel
 *   notch and a half. Reported from the outside as "the transition between
 *   images is too fast, some images are hidden".
 *
 * The three levers on that, cheapest first, and what each actually bought:
 *
 *   1. REDISTRIBUTE (free). The intro held the bare aerial for 214px and the
 *      settle drift spent 181px on almost nothing. Reclaiming both buys
 *      ~188px total — split three ways, +63px of hold each. Real, and not
 *      close to sufficient on its own.
 *   2. LENGTHEN (costs page height). 280svh puts the scrubbed distance at
 *      3,024 − 1,080 = 1,944px. With the crossfades held at their existing
 *      ABSOLUTE lengths (65px in, 54px out — see CHAPTER_FADE on why short
 *      matters) each still now holds for 0.180 of the track = 350px, a 111%
 *      increase. The hero grows 2,376 → 3,024px on a ~9,299px page: 32.5%
 *      of it, against the 51.2% G2 was called in to fix and the 27.5% it
 *      achieved. G2's win is kept; it is not undone.
 *   3. DECODE-WARM (costs one image). Lengthening also grows every mount
 *      lead in absolute terms (260 → 389px), but chapter 01's entrance is
 *      too early in the track for any scroll-triggered gate to give it
 *      enough — so it is warmed at arm time instead. See the effect body.
 *
 * Every timing constant below was re-derived from these two numbers (1,944px
 * of scroll; crossfades fixed in px), never nudged by feel. Where a value's
 * job is to hold a RELATIONSHIP — the intro clearing before the first
 * caption, a caption's baton pass to the next — it was converted so that its
 * absolute scroll distance is unchanged, which is why several of them shrank
 * in progress units while getting longer on screen.
 *
 * The camera geometry is untouched: scale, x, y and tilt are identical at
 * every keyframe and only `at` moved, so the per-keyframe margin audit
 * below carries over exactly as computed.
 *
 *   0.157 CLUBS         (−x, −y)  s 1.53  the lit clubhouse colonnade and
 *                                         members' walkway — the
 *                                         organization's built home
 *   0.398 VENUES        (+x, −y)  s 1.58  the Olympic pool and padel courts
 *                                         — the bookable surfaces
 *   0.639 INTELLIGENCE  (−x, +y)  s 1.68  a tight push onto the floodlit
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
 *   0.000 1.14   6.14    0       6.14     0       —              —
 *   0.157 1.53  17.32  −14.0     3.32    −6.5     20.09 (1.16L) 13.59
 *   0.398 1.58  18.35  +13.0     5.35   −10.5     21.29 (1.16L) 10.79
 *   0.639 1.68  20.24  −11.5     8.74    +8.5     17.00 (0.84L)  8.50
 *   0.882 1.20   8.33    0       8.33    −2.0      9.67 (1.16L)  7.67
 *   1.000 1.24   9.68    0       9.68    −3.0     11.23 (1.16L)  8.23
 *
 * Tightest margin: 3.32 percentage points (x at the 0.157 clubs move) —
 * marginally SAFER than E2's 3.19, on top of the conservative-vs-exact
 * slack above (÷s ≈ another 30% of L at these scales).
 *
 * Depth-scaled layers: `flyPath` multiplies every excursion by the layer's
 * depth, so the mid and foreground plates travel further than the table
 * above. The midground (DEPTH_MID 1.10) clears the conservative bound at
 * every keyframe — tightest is 3.01 (x at 0.157: s 1.583, L 18.41, |x| 15.4).
 * The foreground (DEPTH_NEAR 1.85) exceeds the CONSERVATIVE bound at 0.157
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
 *
 * WAVE J — A SCROLL-RATE CLAMP, ON TOP OF THE RETIMED TRACK
 * ------------------------------------------------------------------------
 * Wave I's retime was verified with `scrollTo()` sampling, which can only
 * check the SETTLED opacity at an exact pixel — never what a continuous
 * gesture actually exposes in wall-clock time. Dispatching real, physically
 * modelled wheel events (a decaying burst mimicking trackpad momentum) and
 * sampling every animation frame during the scroll found what that
 * measurement couldn't: a single fast flick can still cross the whole
 * ~1,620px scrub in ~500ms, giving chapter 1 — which sees a flick's fastest,
 * least-decayed velocity — only ~120ms of full-opacity visibility, against
 * the ~300ms floor a photograph generally needs to register as seen rather
 * than flashed. A careful scroll was already comfortable at 450ms+; the
 * defect is specific to genuinely fast continuous scrolling.
 *
 * Closing that gap with MORE track does not scale here: matching the target
 * purely by lengthening would need roughly 720svh (3x the current
 * per-chapter window), which reopens the exact "half the site is one
 * photograph" regression Task G2 was created to close. `installHeroScrollDamper`
 * (`src/lib/hero-scroll-damper.ts`) takes the other lever instead: a
 * `wheel` listener, active only while `scrollY` sits inside this hero's own
 * scrub range, that clamps a fast flick's IMPLIED RATE down to a derived
 * ceiling — a careful or moderate scroll's natural rate already sits under
 * it and is left completely untouched (verified both by that file's own
 * unit tests and by re-running the same wheel-flick harness against the
 * wired-in clamp — see the task report for the before/after numbers). See
 * that file's header for the full derivation and why a rate clamp, not a
 * scroll-snap or per-event size cap, is the right mechanism.
 */
import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";
import { setHeroArmed } from "@/lib/hero-armed-store";
import { installHeroScrollDamper } from "@/lib/hero-scroll-damper";
import { resetHeroReach, setHeroReach } from "@/lib/hero-reach-store";

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
  { at: 0.157, scale: 1.53, x: -14, y: -6.5, tilt: 2.0 },
  { at: 0.398, scale: 1.58, x: 13, y: -10.5, tilt: 2.6 },
  { at: 0.639, scale: 1.68, x: -11.5, y: 8.5, tilt: 2.2 },
  { at: 0.882, scale: 1.2, x: 0, y: -2, tilt: 0.5 },
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
const BEAT_IN = [0.157, 0.398, 0.639] as const;

/**
 * CHAPTER STILL TIMELINE (Task H2, retimed in Wave I)
 * --------------------------------------------------------------------------
 * Each corner beat crossfades from the aerial to its own establishing
 * photograph (`Hero.tsx`'s CHAPTER STILLS note explains why a crossfade and
 * not a cut). Four numbers per chapter, all derived rather than chosen:
 *
 *   in      = BEAT_IN[i] − 0.050          the picture leads its caption in
 *   up      = in + CHAPTER_FADE           fully up ~33px before the caption
 *   out     = outEnd − CHAPTER_FADE_OUT
 *   outEnd  = the next PICTURE event      (see below)
 *
 * The rule for `outEnd` is that a still clears exactly where the next thing
 * the frame has to show begins: chapters 01 and 02 hand over to the next
 * still's own entrance (0.348, 0.589), chapter 03 hands over to the finale
 * plate's crossfade (0.830). Deriving it that way means two photographs are
 * never dissolving through each other with the aerial underneath — the one
 * failure mode a three-layer crossfade stack has.
 *
 *   i  in     up     out    outEnd  caption in / out      hands over to
 *   0  0.107  0.140  0.320  0.348   0.120 / 0.324-0.361   chapter 02's still
 *   1  0.348  0.381  0.561  0.589   0.361 / 0.565-0.602   chapter 03's still
 *   2  0.589  0.622  0.802  0.830   0.602 / 0.806-0.843   the finale plate
 *
 * So in every beat the photograph arrives just before the words and leaves
 * just before them: the picture announces the place, the caption confirms
 * it, the picture releases the frame, the caption follows it out.
 *
 * Each window is 0.241 of the track (468px) and each still holds at full
 * opacity for 0.180 of it (350px, up from 166px before Wave I). The three
 * windows tile the track back-to-back with no gap and no overlap, which is
 * what makes the outEnd rule above land exactly on the next entrance.
 */
const CHAPTER_IN = [0.107, 0.348, 0.589] as const;

/** Where each still has fully released the frame — see the table above. */
const CHAPTER_OUT_END = [0.348, 0.589, 0.83] as const;

/** Crossfade durations, in progress units. The entrance is longer than the
 *  exit because it is dissolving ONTO a moving aerial (a slow dissolve reads
 *  as arriving) while the exit is releasing back to it.
 *
 *  Kept SHORT ON SCREEN on purpose, which is a statement about pixels, not
 *  progress units. Two dense photographs dissolving through each other
 *  produce a double exposure for as long as both are legible, and the only
 *  levers on that band are the ease (see the tweens) and the duration. So
 *  Wave I's longer track did NOT lengthen them: 0.033 / 0.028 of 1,944px is
 *  65px in and 54px out, the same scroll distance 0.05 / 0.042 of 1,296px
 *  bought before. With a `power2.inOut` curve the mix passes through the
 *  35–65% band in ~13px of scroll either way.
 *
 *  Every pixel the longer track added therefore goes to the still's own hold,
 *  which is the part worth looking at: 0.180 of the track at full opacity per
 *  chapter — 350px, up from 166px. That ratio is the whole fix. */
const CHAPTER_FADE = 0.033;
const CHAPTER_FADE_OUT = 0.028;

/**
 * Each still's own push, played across its whole visible window.
 *
 * `from` is the rest scale every chapter plate holds in CSS (the same
 * rest-state contract the other plates keep). `to` deepens beat by beat —
 * 1.18 / 1.20 / 1.24 — rhyming with CAMERA_PATH's own monotonic 1.53 / 1.58
 * / 1.68, so the flight gets more committed the further in it goes on both
 * layers at once.
 *
 * NO PAN, deliberately. CAMERA_PATH pans to ±14% because it is hunting for a
 * subject inside a wide aerial; a chapter still is already ON its subject, so
 * the same excursion would push the dugout, the lit court or the coach out of
 * frame. The compositional work is done by `transform-origin` instead (per
 * chapter, in `home.css` §2) — which the coverage guard likes: at
 * |x| = |y| = 0 every scale ≥ 1 covers the stage from any origin, so these
 * three layers contribute nothing to the per-keyframe margin audit above.
 *
 * Peak upscale: 1915×821 (or 1844×853) under `cover` on a 1920×1080 stage is
 * ×1.315, and ×1.24 at the deepest push takes it to ×1.63 — well short of the
 * base plate's ×2.21, which is why `build-media-assets.mjs` encodes the
 * chapter stills at a lower AVIF quality than the plates.
 */
const CHAPTER_PUSH = [
  { from: 1.06, to: 1.18 },
  { from: 1.06, to: 1.2 },
  { from: 1.06, to: 1.24 },
] as const;

/**
 * Progress at which each chapter still is MOUNTED (not shown) — one lead
 * time of 0.20 ahead of its own entrance, i.e. ~389px of scroll on the
 * 280svh track, which is the decode head start each plate gets.
 *
 * Chapter 01's entry is 0 because its gate is not here at all: its crossfade
 * starts 0.107 into the track, so no scroll-triggered threshold can give it
 * a useful lead, and `HeroDirector` warms it at arm time instead (see the
 * effect body for the trade). Chapters 02 and 03 keep the 0.20 lead, derived
 * as CHAPTER_IN[i] − 0.20.
 *
 * This is the byte gate. `HeroChapterPlate` renders nothing until the reach
 * store reaches its index, so an armed hero that is never scrolled costs one
 * still rather than three, and a reader who stops inside chapter 01 pays for
 * exactly that one.
 *
 * If a plate has not finished decoding when its crossfade begins, the
 * degraded state is exactly the hero that shipped before this feature: the
 * aerial is still underneath, so the beat plays over the base plate's own
 * camera move. A late plate is a missed cut, never a hole — but a missed cut
 * on EVERY fast scroll is what Wave I treats as a defect rather than a
 * graceful degradation, which is why the leads grew and 01 is pre-warmed.
 */
const CHAPTER_REACH_AT = [0, 0.148, 0.389] as const;

/** How long (in progress units) a caption takes to enter / to leave. */
const BEAT_FADE = 0.037;

/** How long a caption holds at full opacity after arriving, before its exit
 *  tween starts. BEAT_FADE + BEAT_HOLD + BEAT_FADE = 0.241 — exactly the
 *  0.241 spacing between corner keyframes, so caption N's exit lands exactly
 *  where caption N+1's entrance begins (a baton pass, never an overlap) and
 *  no caption is ever mid-flight alone with a frame it does not describe.
 *  On the 280svh track that is ~468px of scroll per caption, up from ~285px:
 *  the caption grew with its photograph, so the words are still on screen for
 *  the whole time the picture is. */
const BEAT_HOLD = 0.167;

/** Progress buckets mapping scroll position to the active rail tick:
 *  index i is active while progress < RAIL_BOUNDS[i]; the last tick is
 *  active beyond the final bound. Five ticks (intro + four chapters), each
 *  bound set slightly AHEAD of its caption's entrance so the rail leads the
 *  beat rather than trailing it.
 *
 *  Every bound is derived from the caption timeline, never chosen by feel.
 *  Caption N runs `BEAT_IN[N] − BEAT_FADE` → `BEAT_IN[N] + BEAT_HOLD +
 *  BEAT_FADE`, so a bound has two jobs at once: lead the INCOMING caption's
 *  entrance by a hair, and sit late enough in the OUTGOING caption's exit
 *  that the rail never names a chapter while a legible caption still says a
 *  different one. Audited (outgoing opacity uses the exit tween's
 *  `power2.in`, i.e. 1 − t²):
 *
 *    bound   value  incoming enters  lead    outgoing clears  still visible
 *    [0]     0.117  0.120 (Clubs)    0.003   —                —
 *    [1]     0.356  0.361 (Venues)   0.005   0.361            25%
 *    [2]     0.597  0.602 (Intel.)   0.005   0.602            25%
 *    [3]     0.864  0.885 (finale)   0.021   0.843             0%
 *
 *  Task G3 established this rule the hard way: bound [3] was then 0.80,
 *  which jumped the rail to ORGANIZATION while the INTELLIGENCE lower-third
 *  was still at ~99% opacity and left the two contradicting each other for
 *  ~58px of scroll. It was the one bound not derived from its neighbour
 *  caption's exit. Wave I's retime re-derives all four from the same rule, so
 *  the property G3 bought is preserved by construction rather than by having
 *  been checked once: on the new timing the outgoing caption is a 25% ghost
 *  at bounds [1] and [2], and at [3] it has left the frame entirely (0.843)
 *  a full 0.021 before the finale block enters at 0.885. */
const RAIL_BOUNDS = [0.117, 0.356, 0.597, 0.864] as const;

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

      // Late-arming guard: arming grows the hero into a ~2.8-viewport scroll
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
      // Chapter 01's still is warmed HERE rather than behind a scroll
      // threshold. Its crossfade begins 0.107 into the track (~208px of
      // scroll), which is less decode time than a full-bleed AVIF reliably
      // gets — and a still that has not decoded when its crossfade starts is
      // an invisible beat, the defect Wave I fixes. Mounting it at arm time
      // spends its bytes against the seconds the reader is already giving the
      // title card. Chapters 02/03 stay scroll-gated (CHAPTER_REACH_AT) where
      // the lead is ~389px and sufficient. The cost, stated plainly: an armed
      // hero that is never scrolled now pays for one photograph where it used
      // to pay for none.
      setHeroReach(0);

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

      // Chapter-still mount gate. Monotonic by construction (the store
      // ignores any value not higher than the current one), so scrubbing
      // back up never unmounts a photograph that has already been paid for —
      // see `hero-reach-store.ts`.
      const setChapterReach = (progress: number) => {
        for (let i = CHAPTER_REACH_AT.length - 1; i >= 0; i--) {
          if (progress >= CHAPTER_REACH_AT[i]) {
            setHeroReach(i);
            return;
          }
        }
      };

      const ctx = gsap.context(() => {
        const stage = root.querySelector<HTMLElement>(".hero-stage");
        const beats = gsap.utils.toArray<HTMLElement>("[data-hero-beat]");
        const chapterPlates = gsap.utils.toArray<HTMLElement>("[data-hero-plate-chapter]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActiveTick(self.progress);
              setChapterReach(self.progress);
            },
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
        // aria-hidden hint may use autoAlpha freely. These four positions
        // were converted to the 280svh track by preserving their absolute
        // scroll distance, not their progress values: the statement still
        // holds for the first ~117px of scroll (0.060 of progress, was 0.09
        // of a shorter track) and is still clear of the frame ~13px before
        // the first caption starts entering, now at 0.120.
        tl.to("[data-hero-intro]", { opacity: 0, y: -34, duration: 0.053, ease: "power2.in" }, 0.06);
        tl.to("[data-hero-ctas]", { opacity: 0, y: -24, duration: 0.047, ease: "power2.in" }, 0.067);
        // Transparent controls must not catch stray clicks mid-flight; a
        // reversed scrub past a set() restores the previous value, so this
        // stays correct scrolling both ways. Keyboard focus is unaffected by
        // pointer-events (the :focus-within rule in home.css reveals the row).
        tl.set("[data-hero-ctas]", { pointerEvents: "none" }, 0.12);
        tl.to("[data-hero-hint]", { autoAlpha: 0, duration: 0.033 }, 0.027);

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

        // Chapter stills: the camera arrives somewhere real. Same authoritative
        // "all hidden at position 0" pin the captions carry, for the same
        // lazy-capture reason — without it a backwards seek could leave two
        // opaque photographs stacked over the aerial.
        tl.set(chapterPlates, { autoAlpha: 0 }, 0);

        chapterPlates.forEach((plate, i) => {
          const enter = CHAPTER_IN[i];
          const clear = CHAPTER_OUT_END[i];
          const push = CHAPTER_PUSH[i];

          // Crossfade. Decorative and aria-hidden (Hero.tsx), so autoAlpha is
          // fine — `visibility: hidden` between beats also lets the browser
          // skip rasterising a full-screen layer it is not showing.
          //
          // `power2.inOut`, not `power1`: both the aerial and the still are
          // dense, mid-tone photographs, and a LINEAR dissolve spends a third
          // of its run in the 35–65% band where both are legible at once —
          // read live (pre-Wave-I timing) at progress 0.355, where the
          // dugout ghosted through the
          // pool and two sets of pitch markings crossed. An S-curve traverses
          // that band in roughly half the scroll while holding the clean ends
          // longer, so the same dissolve reads as a cut-on-motion rather than
          // a double exposure.
          tl.fromTo(
            plate,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: CHAPTER_FADE, ease: "power2.inOut", immediateRender: false },
            enter,
          );
          tl.to(
            plate,
            { autoAlpha: 0, duration: CHAPTER_FADE_OUT, ease: "power2.inOut" },
            clear - CHAPTER_FADE_OUT,
          );

          // The still's own push, spanning its whole visible window so the
          // move is already under way when it dissolves in and still running
          // when it dissolves out — the arrival reads as a continuation of
          // the camera, not a freeze frame. Scale only; see CHAPTER_PUSH.
          tl.fromTo(
            plate,
            { scale: push.from },
            { scale: push.to, duration: clear - enter, ease: "power1.inOut", immediateRender: false },
            enter,
          );
        });

        // Finale plate: crossfades in as the destination beat's background —
        // a deliberate cut to the nadir framing, not a continuation of the
        // pan, so it has no `flyPath` tween of its own (see file header).
        // Decorative (aria-hidden): autoAlpha is fine here, unlike the
        // informative text/CTA layers below.
        tl.fromTo(
          "[data-hero-plate-finale]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.067, ease: "power1.inOut", immediateRender: false },
          0.83,
        );

        // Finale: destination chapter + the CTAs return, centered. Both are
        // informative — plain `opacity`, never autoAlpha (file header). The
        // last caption's exit finishes at 0.843, so the destination block
        // lands on an empty frame rather than under a leaving lower-third.
        tl.fromTo(
          "[data-hero-finale]",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.053, ease: "power2.out", immediateRender: false },
          0.885,
        );
        tl.set("[data-hero-ctas]", { pointerEvents: "auto" }, 0.91);
        tl.fromTo(
          "[data-hero-ctas]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.047, ease: "power2.out", immediateRender: false },
          0.91,
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

      // See the file header (WAVE J) for why this exists and how the cap
      // was derived. Scoped to exactly the range GSAP is scrubbing over —
      // outside it, scrolling is completely native and untouched.
      const removeScrollDamper = installHeroScrollDamper(() => ({
        start: root.offsetTop,
        end: root.offsetTop + Math.max(0, root.getBoundingClientRect().height - window.innerHeight),
      }));

      cleanup = () => {
        removeScrollDamper();
        ctx.revert();
        root.removeAttribute("data-armed");
        setHeroArmed(false);
        resetHeroReach();
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
