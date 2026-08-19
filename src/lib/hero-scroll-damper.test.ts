/**
 * Unit tests for the hero scroll damper's pure decision logic (Wave J).
 *
 * These test `clampHeroScrollDelta` and `normalizeWheelDeltaY` directly —
 * no browser, no wheel events, no timers — because the clamp's correctness
 * is a pure function of (position, delta, elapsed time) and every case
 * below is a specific claim from `hero-scroll-damper.ts`'s own header:
 * outside the range is untouched, gentle scrolling is untouched, only the
 * excess over the rate cap is removed, and the direction is preserved.
 * `hero-timing.test.ts` and manual Playwright wheel-event runs (see the
 * task report) cover the DOM-integration side — this file covers the math.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { clampHeroScrollDelta, HERO_DAMPER_MAX_PX_PER_MS, normalizeWheelDeltaY } from "./hero-scroll-damper";

const RANGE = { rangeStart: 0, rangeEnd: 1620 };

test("does nothing outside the damped range, even for an enormous delta", () => {
  assert.equal(clampHeroScrollDelta({ scrollY: -1, deltaY: 5000, dtMs: 16, ...RANGE }), null);
  assert.equal(clampHeroScrollDelta({ scrollY: 1621, deltaY: 5000, dtMs: 16, ...RANGE }), null);
});

test("does nothing right at the boundary values (inclusive range)", () => {
  // A huge delta AT the boundary is still inside the range and still clamps —
  // only strictly outside [rangeStart, rangeEnd] is exempt.
  assert.notEqual(clampHeroScrollDelta({ scrollY: 0, deltaY: 5000, dtMs: 16, ...RANGE }), null);
  assert.notEqual(clampHeroScrollDelta({ scrollY: 1620, deltaY: 5000, dtMs: 16, ...RANGE }), null);
});

test("leaves a zero delta alone", () => {
  assert.equal(clampHeroScrollDelta({ scrollY: 800, deltaY: 0, dtMs: 16, ...RANGE }), null);
});

test("a careful scroll's natural rate is never clamped", () => {
  // Scenario A from the real Playwright run: 100px every 90ms ≈ 1.111 px/ms.
  // An earlier 1.1 px/ms cap sat almost exactly on this value (see the file
  // header) -- this assertion exists specifically so that coincidence can
  // never silently recur.
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: 100, dtMs: 90, ...RANGE });
  assert.equal(result, null, "a careful scroll must never be touched by the clamp");
});

test("a moderate scroll right at the cap is left alone (boundary is <=, not <)", () => {
  const dt = 20;
  const exactlyAtCap = HERO_DAMPER_MAX_PX_PER_MS * dt;
  assert.equal(clampHeroScrollDelta({ scrollY: 800, deltaY: exactlyAtCap, dtMs: dt, ...RANGE }), null);
});

test("a fast flick is clamped down to exactly the rate cap for that dt", () => {
  const dt = 16;
  const fastDelta = 300; // far over the ~17.6px cap at dt=16
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: fastDelta, dtMs: dt, ...RANGE });
  assert.equal(result, HERO_DAMPER_MAX_PX_PER_MS * dt);
});

test("clamping preserves scroll direction (upward flicks clamp negative)", () => {
  const dt = 16;
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: -300, dtMs: dt, ...RANGE });
  assert.equal(result, -(HERO_DAMPER_MAX_PX_PER_MS * dt));
});

test("an isolated event with no measured dt is never clamped, no matter how large its delta", () => {
  // Regression test for a real bug found via live Playwright evidence, not
  // by inspection: an earlier version fell back to a plausible-sounding
  // 16ms "single frame" duration for dtMs: null, which judged one isolated,
  // entirely deliberate 100px mouse-wheel notch as if it had arrived in
  // 16ms -- an implied 6.25 px/ms rate that clamped a scroll which was
  // never fast. Measured live: Playwright's dispatched "careful" wheel
  // events land 150-200ms apart in a real browser (CDP/dispatch overhead,
  // not the 90ms the test requested), which is OVER the installer's 120ms
  // gesture-continuity threshold -- meaning EVERY event in that scenario
  // arrived as dtMs: null, and the 16ms fallback clamped nearly all of
  // them, cutting a careful reader's scroll down by roughly 5x. A single
  // isolated event carries no evidence of a SUSTAINED rate at all -- only
  // two or more events landing close together in real measured time do --
  // so dtMs: null must mean "no clamp," never "assume 16ms and clamp hard."
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: 300, dtMs: null, ...RANGE });
  assert.equal(result, null, "an isolated event (no measured dt) must never be clamped");
});

test("an oversized dt is capped at 120ms, not trusted verbatim", () => {
  const hugeDt = 5000; // a real stutter/tab-throttle gap, not a fresh gesture
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: 10000, dtMs: hugeDt, ...RANGE });
  assert.equal(result, HERO_DAMPER_MAX_PX_PER_MS * 120, "dt must be clamped to the 120ms ceiling before use");
});

test("the dt ceiling never undercuts a dt the installer's own gesture-continuity gate already allowed", () => {
  // Regression test for a real bug this suite caught before it ever reached
  // the DOM: an earlier 50ms MAX_DT_MS silently clamped a careful scroll's
  // own 90ms tick interval down to 50ms, shrinking its allowed delta before
  // the rate check ran at all. `installHeroScrollDamper` treats any gap up
  // to 120ms as "the same gesture" and passes its real value through
  // unmodified — so the pure function's own ceiling must never bind below
  // 120, or a value the installer considered legitimate gets silently
  // reduced here instead.
  const dt = 119; // just inside the installer's own continuation threshold
  const generousDelta = HERO_DAMPER_MAX_PX_PER_MS * dt - 1; // just under what dt=119 should allow
  const result = clampHeroScrollDelta({ scrollY: 800, deltaY: generousDelta, dtMs: dt, ...RANGE });
  assert.equal(result, null, "a delta the installer's own dt should have allowed must not be clamped");
});

test("normalizeWheelDeltaY passes pixel-mode deltas through unchanged", () => {
  assert.equal(normalizeWheelDeltaY({ deltaY: 120, deltaMode: 0 }), 120);
});

test("normalizeWheelDeltaY scales line-mode deltas to an approximate pixel count", () => {
  assert.equal(normalizeWheelDeltaY({ deltaY: 3, deltaMode: 1 }), 48);
});

test("normalizeWheelDeltaY scales page-mode deltas by the viewport height", () => {
  const originalHeight = globalThis.window?.innerHeight;
  // @ts-expect-error -- constructing a minimal window stub for this one case
  globalThis.window = { innerHeight: 900 };
  assert.equal(normalizeWheelDeltaY({ deltaY: 1, deltaMode: 2 }), 900);
  // @ts-expect-error -- restoring whatever was there before (undefined in Node)
  globalThis.window = originalHeight === undefined ? undefined : { innerHeight: originalHeight };
});
