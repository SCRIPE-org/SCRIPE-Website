# Image Prompts — Round 4 (1 image)

The `/platform` page's hero — the very top of the page, above "Everything
your sports organization needs. One operating system." — is still pure
type. At full width it leaves roughly half the section as bare dark ground
glow: the largest unphotographed area on the site outside the 404 page.

Drop the generated file in `assets\pages\` (same convention as before) and
tell Claude — the integration is three mechanical steps (register in
`scripts/build-media-assets.mjs`, add one `imageAlt` line to both locale
files) and the layout is already built and waiting for it
(`CapabilityHero.tsx`).

**UNIVERSAL RULE — append to every prompt below:**
> Photorealistic, real facilities, never 3D renders or illustration. No identifiable faces. No text, watermarks or logos anywhere. Cyan-teal water and warm sodium turf are the only saturated hues — nothing lime/green-yellow in the scene. Cinematic dynamic range, crushed shadows, no lens flare across the center. Center-safe: nothing critical in the outer 12%. Generate at the largest resolution available.

---

## Why this composition, not a repeat of one already on the site

Every photograph already on the site is spoken for and shouldn't be reused
here — reusing one would make `/platform` look like a copy of whichever
page it borrowed from:

- The home hero's three chapters are each **one subject** (a clubhouse, a
  court grid, a training pitch) — the opposite of what `/platform` needs to
  say, which is "many things, one system."
- The home hero's own **aerial establishing shot** already makes the
  "many things, one estate" argument from directly overhead — repeating
  that exact framing here would read as the same photo, not a new one.
- The four solution-page heroes are each **one surface type**, matching
  their own single-vertical subject.
- `/platform`'s own **dashboard-strip photo** (further down the page) is an
  **interior** — an empty operations desk at night. This one should be
  **exterior**, so the page doesn't show the same kind of shot twice.

What's actually missing from the set: a shot from **human/terrace height**
(not a drone looking straight down, not ground level looking at one court)
that catches **two or more different surface types adjoining in one
continuous frame** — which is the literal, physical version of "one
operating system" the way the dashboard photo is the physical version of
"reconciled the same day."

---

## 1. ⭐ NEEDED — The platform hero: terrace view across two disciplines

> Photograph taken from an elevated open-air terrace or upper walkway at a large sports campus, at night, looking down and across at a slight oblique angle — NOT a drone shot, NOT directly overhead. In the same continuous frame: a set of floodlit padel or tennis courts in the near-to-mid distance, and a floodlit football pitch beginning to reveal itself past them in the far distance, the two surfaces connected by a lit walkway or low retaining wall running through the frame. Foreground includes a hint of the terrace itself — a section of railing or the edge of a concrete ledge in the extreme lower corner, unobtrusive, establishing the elevated vantage point without becoming the subject. Turquoise court lighting in the near surfaces, warm sodium floodlight on the distant pitch, dark sky above, no moon or stars needed. Comfortable to crop tall: the vertical arrangement should read well from a 4:5 portrait crop — courts filling the lower two-thirds, the pitch and its floodlights receding into the upper third. Cinematic night photography, shallow-to-medium depth of field, long exposure quality to the light sources without motion blur on any static structure.

**If your generator can give you a genuine portrait framing directly, even better** — the same scene, native 4:5 (taller than wide), so nothing needs to be cropped at all:

> The same terrace view, courts and distant pitch in one continuous frame connected by a lit walkway, composed natively as a tall 4:5 vertical photograph rather than a wide one.

---

### Still open from earlier rounds (unchanged, not blocking)

- Light-theme hero chapters (three day-lit subjects) — only if you want the day film to close the gap with the night one.
- The optional 2× upscale of the four original hero plates.
