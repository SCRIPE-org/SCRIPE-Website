/**
 * Hero flight timing invariants (Wave I).
 *
 * `HeroDirector.tsx` documents its timeline as DERIVED rather than chosen: the
 * chapter windows tile the track exactly, each caption hands its baton to the
 * next, each rail bound leads its incoming caption by a sliver, and every
 * still holds long enough to read as an arrival rather than a flash. Those are
 * relationships between eight separate constants, and before this file the only
 * thing keeping them true was a comment block asserting they were — which is
 * exactly how the timeline drifted in the first place: Task H2 added three
 * photographs to a scroll budget Task G2 had already spent, and nothing failed.
 *
 * These tests read the constants out of the SOURCE rather than importing it.
 * `HeroDirector` is a `"use client"` module that pulls in GSAP, so importing it
 * under the node test runner would exercise the bundler, not the arithmetic.
 * Parsing is the narrower dependency: it cannot pass because a mock behaved,
 * and it fails loudly if a constant is renamed or reformatted.
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const SOURCE = readFileSync(new URL("./HeroDirector.tsx", import.meta.url), "utf8");

/** Scrubbed scroll distance of the armed hero, in CSS px, at a 1080px-tall
 *  viewport: a 280svh track minus the one sticky viewport that does not
 *  scrub. Every px figure below is progress × this. */
const TRACK_PX = 2.8 * 1080 - 1080;

/**
 * Reads a `const NAME = [a, b, c] as const;` numeric tuple out of the source.
 *
 * @param name - Exact identifier to read.
 * @returns The tuple's numbers, in source order.
 */
function readTuple(name: string): number[] {
  const match = SOURCE.match(new RegExp(`const ${name} = \\[([^\\]]*)\\] as const;`));
  assert.ok(match, `${name} not found as a tuple constant — was it renamed?`);
  return match[1]
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => !Number.isNaN(value));
}

/**
 * Reads a `const NAME = 0.123;` scalar out of the source.
 *
 * @param name - Exact identifier to read.
 * @returns The number.
 */
function readScalar(name: string): number {
  const match = SOURCE.match(new RegExp(`const ${name} = (-?[\\d.]+);`));
  assert.ok(match, `${name} not found as a scalar constant — was it renamed?`);
  return Number(match[1]);
}

/** Reads the `at` column of the CAMERA_PATH keyframe table. */
function readCameraAts(): number[] {
  const block = SOURCE.match(/const CAMERA_PATH = \[([\s\S]*?)\] as const;/);
  assert.ok(block, "CAMERA_PATH not found");
  return [...block[1].matchAll(/\{ at: ([\d.]+),/g)].map((m) => Number(m[1]));
}

const CHAPTER_IN = readTuple("CHAPTER_IN");
const CHAPTER_OUT_END = readTuple("CHAPTER_OUT_END");
const CHAPTER_REACH_AT = readTuple("CHAPTER_REACH_AT");
const BEAT_IN = readTuple("BEAT_IN");
const RAIL_BOUNDS = readTuple("RAIL_BOUNDS");
const CHAPTER_FADE = readScalar("CHAPTER_FADE");
const CHAPTER_FADE_OUT = readScalar("CHAPTER_FADE_OUT");
const BEAT_FADE = readScalar("BEAT_FADE");
const BEAT_HOLD = readScalar("BEAT_HOLD");

/** Floating-point comparison at the 3dp the constants are authored to. */
const near = (a: number, b: number, tolerance = 0.0015) => Math.abs(a - b) <= tolerance;

test("the armed hero's track is the 280svh Wave I retimed against", () => {
  const css = readFileSync(new URL("../../../styles/home.css", import.meta.url), "utf8");
  assert.match(css, /height: 280svh;/, "track height changed without retiming HeroDirector");
});

test("every chapter still holds at full opacity long enough to read as an arrival", () => {
  // The defect Wave I fixed: 166px of hold, about a wheel notch and a half.
  // 300px is the floor this timeline is allowed to regress to before the
  // complaint that produced it ("too fast, some images hidden") comes back.
  CHAPTER_IN.forEach((enter, i) => {
    const holdStart = enter + CHAPTER_FADE;
    const holdEnd = CHAPTER_OUT_END[i] - CHAPTER_FADE_OUT;
    const holdPx = (holdEnd - holdStart) * TRACK_PX;
    assert.ok(holdPx >= 300, `chapter ${i + 1} holds for only ${Math.round(holdPx)}px of scroll`);
  });
});

test("the chapter crossfades stay short in PIXELS, not in progress units", () => {
  // The anti-double-exposure constraint: two dense photographs may not be
  // legible at once for long. Lengthening the track must not lengthen these.
  assert.ok(near(CHAPTER_FADE * TRACK_PX, 65, 3), "entrance crossfade drifted off 65px");
  assert.ok(near(CHAPTER_FADE_OUT * TRACK_PX, 54, 3), "exit crossfade drifted off 54px");
});

test("chapter windows tile the track with no gap and no double exposure", () => {
  // A still clears exactly where the next PICTURE event begins, so two
  // photographs never dissolve through each other over the aerial.
  for (let i = 0; i < CHAPTER_IN.length - 1; i++) {
    assert.ok(
      near(CHAPTER_OUT_END[i], CHAPTER_IN[i + 1]),
      `chapter ${i + 1} clears at ${CHAPTER_OUT_END[i]} but chapter ${i + 2} enters at ${CHAPTER_IN[i + 1]}`,
    );
  }
});

test("the last chapter hands the frame to the finale plate's crossfade", () => {
  const finale = SOURCE.match(/\{ autoAlpha: 1, duration: [\d.]+, ease: "power1\.inOut"[^}]*\},\s*\n\s*([\d.]+),/);
  assert.ok(finale, "finale plate crossfade position not found");
  assert.ok(
    near(CHAPTER_OUT_END[CHAPTER_OUT_END.length - 1], Number(finale[1])),
    "chapter 03 does not clear exactly where the finale plate begins",
  );
});

test("each photograph leads its own caption in by the documented 0.050", () => {
  BEAT_IN.forEach((arrive, i) => {
    assert.ok(
      near(arrive - CHAPTER_IN[i], 0.05),
      `chapter ${i + 1}: picture leads caption by ${(arrive - CHAPTER_IN[i]).toFixed(3)}, not 0.050`,
    );
  });
});

test("each photograph is fully up before its caption is", () => {
  BEAT_IN.forEach((arrive, i) => {
    assert.ok(CHAPTER_IN[i] + CHAPTER_FADE < arrive, `chapter ${i + 1}'s caption lands before its picture`);
  });
});

test("captions pass the baton: caption N's exit ends where caption N+1 enters", () => {
  for (let i = 0; i < BEAT_IN.length - 1; i++) {
    const exitEnds = BEAT_IN[i] + BEAT_HOLD + BEAT_FADE;
    const nextEnters = BEAT_IN[i + 1] - BEAT_FADE;
    assert.ok(
      near(exitEnds, nextEnters),
      `caption ${i + 1} clears at ${exitEnds.toFixed(3)} but caption ${i + 2} enters at ${nextEnters.toFixed(3)}`,
    );
  }
});

test("a caption is on screen for as long as its photograph is", () => {
  // Both spans are 0.241 of the track by construction, so the words never
  // leave a picture unlabelled and never outlive it.
  const captionSpan = BEAT_FADE + BEAT_HOLD + BEAT_FADE;
  CHAPTER_IN.forEach((enter, i) => {
    assert.ok(
      near(CHAPTER_OUT_END[i] - enter, captionSpan, 0.002),
      `chapter ${i + 1}'s window and its caption's span disagree`,
    );
  });
});

test("every rail bound leads its incoming caption without ever naming the wrong one", () => {
  const entrances = [...BEAT_IN.map((arrive) => arrive - BEAT_FADE), 0.885];
  RAIL_BOUNDS.forEach((bound, i) => {
    const lead = entrances[i] - bound;
    assert.ok(lead > 0, `rail bound ${i} (${bound}) trails its caption's entrance`);
    assert.ok(lead <= 0.03, `rail bound ${i} leads by ${lead.toFixed(3)} — too early, it names a chapter first`);
    if (i > 0) {
      // The outgoing caption must be a ghost, never legible, when the rail moves.
      const exitStart = BEAT_IN[i - 1] + BEAT_HOLD;
      const t = Math.min(1, Math.max(0, (bound - exitStart) / BEAT_FADE));
      const opacity = 1 - t * t; // the exit tween's power2.in curve
      assert.ok(opacity <= 0.3, `rail bound ${i} moves while caption ${i} is still at ${Math.round(opacity * 100)}%`);
    }
  });
});

test("chapter 01 is warmed at arm time, not behind a scroll threshold", () => {
  // Its crossfade begins ~208px into the track, which no scroll-triggered
  // gate can give a useful decode lead — so HeroDirector calls setHeroReach(0)
  // during arming. This is the fix for "some images are hidden".
  assert.equal(CHAPTER_REACH_AT[0], 0, "chapter 01 must not be scroll-gated");
  assert.match(SOURCE, /setHeroArmed\(true\);[\s\S]{0,900}?setHeroReach\(0\);/, "chapter 01 is not warmed at arm time");
});

test("chapters 02 and 03 get a real decode lead before their crossfades", () => {
  for (let i = 1; i < CHAPTER_REACH_AT.length; i++) {
    const leadPx = (CHAPTER_IN[i] - CHAPTER_REACH_AT[i]) * TRACK_PX;
    assert.ok(leadPx >= 350, `chapter ${i + 1} gets only ${Math.round(leadPx)}px of decode lead`);
  }
});

test("the camera's corner keyframes sit exactly on their captions", () => {
  const ats = readCameraAts();
  const corners = ats.slice(1, 1 + BEAT_IN.length);
  corners.forEach((at, i) => {
    assert.ok(near(at, BEAT_IN[i]), `camera keyframe ${i + 1} (${at}) is off its caption (${BEAT_IN[i]})`);
  });
});

test("the camera's scale rises monotonically to a single peak, then releases", () => {
  const block = SOURCE.match(/const CAMERA_PATH = \[([\s\S]*?)\] as const;/);
  assert.ok(block);
  const scales = [...block[1].matchAll(/scale: ([\d.]+)/g)].map((m) => Number(m[1]));
  const peak = scales.indexOf(Math.max(...scales));
  assert.equal(peak, 3, "the flight's deepest push is no longer the intelligence beat");
  for (let i = 1; i <= peak; i++) {
    assert.ok(scales[i] > scales[i - 1], `scale does not rise into keyframe ${i}`);
  }
  assert.ok(scales[peak + 1] < scales[peak], "the pull-back does not release the push");
});

test("the flight's keyframes stay ordered and inside the track", () => {
  const ats = readCameraAts();
  assert.equal(ats[0], 0, "the camera path must start at progress 0");
  assert.equal(ats[ats.length - 1], 1, "the camera path must end at progress 1");
  for (let i = 1; i < ats.length; i++) {
    assert.ok(ats[i] > ats[i - 1], `camera keyframe ${i} is not after its predecessor`);
  }
});

test("nothing in the timeline is scheduled past the end of the track", () => {
  const last = BEAT_IN[BEAT_IN.length - 1] + BEAT_HOLD + BEAT_FADE;
  assert.ok(last < 1, "the final caption's exit runs off the end of the track");
  assert.ok(CHAPTER_OUT_END[CHAPTER_OUT_END.length - 1] < 1, "the final still never clears the frame");
});
