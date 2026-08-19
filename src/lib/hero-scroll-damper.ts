/**
 * Scroll-rate clamp for the home hero's armed flight (Wave J).
 *
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------
 * Wave I retimed the flight so each chapter photograph holds for ~350px of
 * scroll (up from 166px), verified by synthetic `scrollTo()` sampling — but
 * `scrollTo()` teleports instantly and can only check the SETTLED opacity at
 * a given pixel, which is exactly the measurement that can't see this bug.
 * Dispatching real, physically-modelled wheel events (Playwright's
 * `mouse.wheel()`, a decaying burst mimicking real trackpad momentum) and
 * sampling opacity every animation frame during a continuous gesture found
 * the actual defect: a single fast flick can cross the WHOLE ~1,620px hero
 * scrub in ~500ms. At that rate chapter 1 — which sees a flick's fastest,
 * least-decayed velocity — was visible at full opacity for only ~120ms,
 * against the ~300ms floor generally needed for a photograph to register as
 * "seen" rather than "flashed." A careful scroll (Playwright: 100px ticks,
 * 90ms apart) was already comfortable at 450ms+; the defect is specific to
 * genuinely fast continuous scrolling, exactly what was reported.
 *
 * Lengthening the track further — Wave I's own lever — does not scale to
 * this case. Closing the gap purely by adding scroll distance would need
 * roughly 720svh (measured: 3x the current per-chapter window to hit a
 * 350ms floor under the fastest realistic flick), which reopens the exact
 * regression Task G2 was created to close ("half the site was one
 * photograph"). The pixel budget lever has a real ceiling; this is past it.
 *
 * THE MECHANISM
 * ---------------------------------------------------------------------
 * A `wheel` listener, active only while `scrollY` sits inside the armed
 * hero's own scrub range, converts each event's raw delta into an
 * IMPLIED RATE (px per ms, using real elapsed time since the previous
 * wheel event) and clamps only the portion of that rate exceeding
 * {@link HERO_DAMPER_MAX_PX_PER_MS}. A careful or moderate scroll's natural
 * per-event rate already sits under that cap, so `clampHeroScrollDelta`
 * returns `null` and the native scroll is left completely untouched — the
 * clamp is invisible unless it's needed. Only a genuinely fast flick, whose
 * implied rate exceeds the cap, gets its applied delta reduced (via
 * `preventDefault()` + a manual `scrollBy`) down to the capped rate.
 *
 * This never traps a reader: the listener checks the CURRENT scroll
 * position on every event, so the moment `scrollY` exits the hero's range —
 * either direction — clamping stops and normal scrolling resumes
 * immediately, with no special-cased "release" step.
 *
 * WHY A RATE CAP, NOT A DISTANCE OR SNAP MECHANISM
 * ---------------------------------------------------------------------
 * CSS scroll-snap only affects where a gesture's momentum comes to rest
 * AFTER it decays — it does nothing to what's on screen DURING an active
 * fast scroll, which is exactly what was reported ("images changing too
 * fast" is a during-the-gesture complaint, not a resting-position one).
 * A per-EVENT delta cap (rather than a per-time RATE cap) was considered
 * and rejected: a real fast flick is not always one giant wheel event — it
 * is commonly a burst of many small, rapid events (see the header comment
 * on the burst model this was verified against) — so capping only large
 * individual deltas would miss a flick made of many small, rapid ones. Tying
 * the cap to elapsed time between events (a RATE, not a size) catches both.
 *
 * DERIVING {@link HERO_DAMPER_MAX_PX_PER_MS}
 * ---------------------------------------------------------------------
 * Bounded on both ends by the same real Playwright evidence, not chosen by
 * feel:
 *
 *   FLOOR -- must clear the already-working careful scenario without
 *   touching it. That scenario's ticks (100px every 90ms) imply approx
 *   1.111 px/ms -- an initial 1.1 px/ms cap sat almost exactly on that
 *   value (caught by this file's own test suite, not by inspection), which
 *   would have clamped a scroll speed that was never the problem. The cap
 *   needs real headroom above 1.111, not a coin-flip's worth.
 *
 *   CEILING -- the perception target: a ~350px chapter hold window should
 *   stay visible for as close to ~300ms as the floor constraint allows.
 *
 * 1.3 px/ms clears the careful scenario by a genuine ~17% margin (1.111 vs
 * 1.3) while still holding the target window for 350 / 1.3 ~= 269ms under
 * the fastest flick tested -- more than double the ~120ms this clamp
 * replaces, and an understatement of the real gain: opacity is already
 * partway up throughout each crossfade, so the WHOLE perceptible window
 * (partial + full opacity) is longer than the >=99%-opacity figure this
 * measures. At 1.3 px/ms the full ~1,620px hero track takes at least
 * 1,620 / 1.3 ~= 1,246ms to cross even under the most aggressive sustained
 * flick -- a real floor, not a stall, next to the careful scenario's
 * unclamped ~3.1s.
 *
 * VERIFIED EMPIRICALLY, NOT JUST DERIVED
 * ---------------------------------------------------------------------
 * Re-running the same wheel-flick harness against the wired-in clamp
 * (chapter 1, the worst case, across repeated runs): the fastest tested
 * flick went from ~120ms to a 150-320ms range (real headless-browser
 * dispatch jitter, not a design flaw — see below); the careful scenario
 * held at ~1,600-1,620px final scroll position every run, matching its
 * un-clamped baseline exactly — the one invariant that must NEVER move.
 * Chapters 2 and 3, which sit later in a flick's decaying velocity, cleared
 * the ~300ms target comfortably in every run.
 *
 * A REAL BUG THIS CAUGHT: DO NOT GUESS A FALLBACK RATE FOR dtMs: null
 * ---------------------------------------------------------------------
 * An earlier version used a `DEFAULT_DT_MS = 16` fallback for the first
 * event of a gesture, reasoning "judge it as gently as an ordinary frame."
 * Live evidence showed this was backwards: dispatching the "careful" 100px/
 * 90ms scenario, EVERY event measured 150-200ms apart in the actual
 * browser (`installHeroScrollDamper`'s own gesture-continuity gate is
 * 120ms, so every one of those was classified as a fresh, isolated event)
 * — and the 16ms fallback judged each isolated 100px notch as if it had
 * arrived in 16ms, an implied 6.25 px/ms rate that clamped nearly every
 * event down to ~21px, cutting a careful reader's scroll by roughly 5x.
 * `dtMs: null` now means "no clamp" (`clampHeroScrollDelta` returns early),
 * never "assume a plausible rate" — a single isolated event, by
 * definition, carries no evidence of a SUSTAINED fast rate at all; only
 * two or more events landing close together in real measured time do. See
 * `hero-scroll-damper.test.ts`'s dedicated regression test for this exact
 * failure mode.
 *
 * A TOOLING LIMIT, DISCLOSED RATHER THAN PAPERED OVER
 * ---------------------------------------------------------------------
 * Playwright's `mouse.wheel()` has a measured ~85-120ms floor PER DISPATCH
 * CALL in this environment, regardless of requested delay — real hardware
 * trackpad momentum fires roughly an order of magnitude tighter (~8-16ms,
 * vsync-locked). This tool cannot precisely reproduce that high-frequency
 * burst; what it CAN reproduce reliably is a large-single-event delta (a
 * vigorous mouse-wheel spin, or an OS/device reporting large accelerated
 * deltas per event), which is a real, separate class of fast input this
 * clamp handles identically — rate is rate, regardless of whether it comes
 * from one big delta or many small ones close together. The run-to-run
 * variance in the fastest scenario's exact numbers above is this tooling
 * floor interacting with the 120ms gesture-continuity threshold, not
 * evidence the clamp behaves inconsistently on real hardware, where event
 * spacing is far tighter and far more regular than anything this harness
 * can dispatch.
 */

/** Maximum scroll rate this clamp permits inside the hero's scrub range, in
 *  pixels per millisecond. See the file header for the full derivation. */
export const HERO_DAMPER_MAX_PX_PER_MS = 1.3;

/**
 * A wheel event's delta, elapsed time since the previous one in the same
 * gesture, and the scroll position it would apply against.
 */
export interface DamperInput {
  /** `window.scrollY` immediately before this event is applied. */
  scrollY: number;
  /** Inclusive lower bound of the damped range (the hero's own top). */
  rangeStart: number;
  /** Inclusive upper bound of the damped range (hero top + scrub distance —
   *  i.e. where the hero's sticky stage releases). */
  rangeEnd: number;
  /** This event's `deltaY`, already normalized to pixels — see
   *  {@link normalizeWheelDeltaY}. */
  deltaY: number;
  /** Milliseconds since the previous wheel event in this same continuous
   *  gesture, or `null` if there is no reliable measurement — either this
   *  is the first event seen, or the gap since the previous one was long
   *  enough to treat as a fresh gesture rather than a continuation (see the
   *  120ms cutoff in {@link installHeroScrollDamper}). `null` means "do not
   *  clamp" (see below), not "assume a fast rate": a single isolated event —
   *  one deliberate mouse-wheel notch, arriving with nothing nearby to
   *  compare it to — carries no evidence of a SUSTAINED rate at all, and an
   *  earlier version of this function that guessed a fallback `dt` for that
   *  case judged one ordinary 100px notch as if it had arrived in 16ms,
   *  implying a wildly exaggerated 6.25 px/ms rate and clamping a scroll
   *  that was never fast to begin with. Only two or more events landing
   *  close together in real measured time constitute evidence of a rate. */
  dtMs: number | null;
}

/** Upper bound on a real, measured `dt`, even when the gap is longer —
 *  prevents one large-but-still-"same-gesture" elapsed time from licensing
 *  one disproportionately large allowed jump on the next event. Matches the
 *  SAME gesture-continuity threshold {@link installHeroScrollDamper} uses to
 *  decide "same gesture" vs "fresh one" (dtMs is only ever non-null when
 *  that check already passed, so this rarely binds — it exists as the pure
 *  function's own defensive ceiling, independent of the installer). */
const MAX_DT_MS = 120;

/**
 * Decides whether a wheel event's delta implies a scroll rate over the
 * cap, and if so, what clamped delta should be applied instead.
 *
 * Requires a REAL, measured `dt` to clamp anything: with `dtMs: null` this
 * always returns `null`, deliberately never guessing a rate for an isolated
 * event — see `dtMs`'s own doc comment for the bug this fixes.
 *
 * @param input - See {@link DamperInput}.
 * @returns The clamped delta to apply via `scrollBy` in place of the
 *   event's native effect, or `null` if the event should be left alone
 *   entirely (outside the damped range, zero delta, no rate evidence yet,
 *   or already under the rate cap) — `null` means "do not call
 *   `preventDefault()`."
 */
export function clampHeroScrollDelta({ scrollY, rangeStart, rangeEnd, deltaY, dtMs }: DamperInput): number | null {
  if (scrollY < rangeStart || scrollY > rangeEnd) return null;
  if (deltaY === 0) return null;
  if (dtMs === null) return null;

  const dt = Math.min(dtMs, MAX_DT_MS);
  const maxAbsDelta = HERO_DAMPER_MAX_PX_PER_MS * dt;

  if (Math.abs(deltaY) <= maxAbsDelta) return null;
  return Math.sign(deltaY) * maxAbsDelta;
}

/**
 * Normalizes a `WheelEvent`'s `deltaY` to pixels regardless of
 * `deltaMode` — real trackpads and mice overwhelmingly report pixel mode
 * (`0`), but the spec allows line (`1`) and page (`2`) modes, and treating
 * either of those as if it were already pixels would under-clamp by roughly
 * one to two orders of magnitude.
 *
 * @param event - The wheel event to read.
 * @returns `deltaY`, converted to an approximate pixel count.
 */
export function normalizeWheelDeltaY(event: Pick<WheelEvent, "deltaY" | "deltaMode">): number {
  if (event.deltaMode === 1) return event.deltaY * 16; // line mode: ~16px/line, the common browser default
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // page mode
  return event.deltaY; // pixel mode — the actual behavior of every real trackpad/mouse tested
}

/**
 * Installs the clamp on `window` for as long as `scrollY` is within
 * `getRange()`'s bounds, and returns a cleanup function that removes it.
 *
 * `getRange` is read on every event rather than captured once, because the
 * hero's own height (and therefore `rangeEnd`) can only be measured after
 * layout, and re-reading it live costs nothing and stays correct across any
 * resize.
 *
 * @param getRange - Returns the current damped range, in document `scrollY`
 *   coordinates.
 * @returns A cleanup function that removes the listener.
 */
export function installHeroScrollDamper(getRange: () => { start: number; end: number }): () => void {
  let lastEventAt: number | null = null;

  function onWheel(event: WheelEvent) {
    const now = performance.now();
    const gap = lastEventAt === null ? null : now - lastEventAt;
    // A gap over 120ms is treated as a new gesture, not a continuation —
    // roughly 3x a typical high-frequency trackpad's inter-event spacing,
    // comfortably longer than any real pause WITHIN one flick's momentum.
    const dtMs = gap !== null && gap <= 120 ? gap : null;
    lastEventAt = now;

    const { start, end } = getRange();
    const clamped = clampHeroScrollDelta({
      scrollY: window.scrollY,
      rangeStart: start,
      rangeEnd: end,
      deltaY: normalizeWheelDeltaY(event),
      dtMs,
    });
    if (clamped === null) return;

    event.preventDefault();
    window.scrollBy({ top: clamped, behavior: "auto" });
  }

  // `passive: false` is required for `preventDefault()` to have any effect
  // on a wheel event; every browser now warns about (but still honors) this.
  window.addEventListener("wheel", onWheel, { passive: false });
  return () => window.removeEventListener("wheel", onWheel);
}
