# Delivered Images Catalog — 2026-08-19

> Cataloging pass over the 16 PNGs dropped in `assets/hero-plates/new/` against the
> 17-prompt `image-prompt-pack-2026-08-18.md`. Every file was opened and viewed with
> the Read tool; nothing below is inferred from filenames alone. No files were moved,
> renamed, or copied — this document is the only artifact this pass produced.

**Source facts used below** (already measured, not re-derived): all landscape files
are 1915×821 or 1844×853; portraits are 1122×1402; alpha (RGBA, colortype 6) is
present on exactly three files — *Cinematic Stadium Lights and Foliage Overlay*,
*Golden-Hour Sports Complex Diorama*, *Illuminated Stadium and Pool Complex*.

---

## 1. Mapping table

| # | Delivered filename | Prompt / slot | Confidence | Quality verdict (from viewing it) |
|---|---|---|---|---|
| 1 | `Aerial Night Sports Complex Panorama.png` | **P1** — night background plate (replaces `plate-background.png`) | Probable — **wins** the slot | Near-identical layout to the current production `plate-background.png` (pool bottom-left, two pitches, 4 padel courts, stadium top-right, clubhouse, lime walkway line). Clean, well-exposed, no artifacts. This is the strongest and safest background candidate. |
| 2 | `Illuminated Sports Complex at Night-1.png` | **P1** — night background, competing candidate | Probable — **loses** to #1 | Same night-aerial family but a materially different layout: an extra, disconnected second pitch sits isolated top-right outside the main complex, and the building arrangement doesn't match the existing production plate. Good image on its own, wrong scene for a drop-in replacement. Kept as a mood alternate, not selected. |
| 3 | `Cinematic Stadium Lights and Foliage Overlay.png` | **P3** — night foreground bokeh (alpha, replaces `plate-foreground.png`) | Certain | Clean silhouette, correctly empty in the center 70%, soft feathered edges, no halo. Directly usable as-is; matches the old foreground's concept and slightly upgrades it (design pattern reads more clearly). |
| 4 | `Empty Stadium Under Floodlights.png` | **P5** — Chapter CLUBS (night) | Certain | Excellent match: dugout, folded tactics board, wet reflective surfaces, dark main stand, floodlit pitch beyond. Strong "matchday over" mood, no defects. |
| 5 | `Four Sports Hubs Across the Night City.png` | **P13** — /pricing hero | Certain | Four distinct lit facility islands across a dark city grid, exactly the "argues per-branch pricing before the copy does" brief. One island (top-left) is visibly thinner content (just two pitches vs. the other three having stadium+pool+courts), a minor asymmetry, not a defect. |
| 6 | `Golden-Hour Aerial Sports Complex.png` | **P14** — day background plate | Probable — **wins** the slot | Same camera family and mood as the night establishing shot (elevated oblique, stadium/pool/courts/clubhouse), golden light, soft mist, no lit floodlights — matches the "operation waking up" brief. Not pixel-identical to the night layout (an extra pitch at the far left edge and an indoor arena building on the right that aren't in the night version), but far closer than the competing candidate. |
| 7 | `Golden-Hour Sports Complex Diorama.png` | **P15** — day midground cutout (alpha) | Certain slot / **defect found** | Correctly isolated on transparency, but two problems: (a) a visible red/magenta fringing artifact along the stadium roofline (right side, upper edge) — a matting bleed, not a stylistic choice; (b) the camera reads as a much closer, lower, tilt-shift/"miniature diorama" angle than the wide, gentle-tilt establishing background — see §3. |
| 8 | `Illuminated Sports Complex at Night-1.png` | *(see row 2)* | — | — |
| 9 | `Illuminated Sports Complex at Night.png` | **P4** — night finale, nadir "operational picture" (replaces `plate-finale.png`) | Certain | Near-overhead nadir shot, same layout as the current `plate-finale.png`, clean geometric read (amber stadium, turquoise pool, cool-white courts, lime walkway line). Strong drop-in replacement, slightly crisper composition than the original. |
| 10 | `Illuminated Stadium and Pool Complex.png` | **P2** — night midground cutout (alpha, replaces `plate-midground.png`) | Certain | Clean cutout, correctly isolated, feathered edges, no visible halo. Subject placement (pool front-left, stadium back-right) matches the winning P1 background reasonably well — see §3 for the perspective check. |
| 11 | `Midnight Paddle Courts from Above.png` | **P11** — /solutions/sports-venues hero | Certain | The strongest single image in the batch. Near-nadir 4-court grid, one lit court with two motion-blurred, unidentifiable players, the other three dark-but-marked. Exactly "capacity as a picture." |
| 12 | `Misty Dawn Soccer Training Ground.png` | **P10** — /solutions/sports-academies hero | Certain | Excellent: blue-hour mist, cones/ladders/markers in precise rows, warm sun edge on the treeline, no people. Matches the brief's "one blue-hour exception" note precisely. |
| 13 | `Modern Sports Complex at Night.png` | **P6** — Chapter VENUES (night) | Certain | Warm-lit glass clubhouse facade with silhouetted interior furniture (no faces), padel courts in the foreground reading as a booking grid, stadium visible top-left. Courts are shot at a moderate oblique angle rather than strictly "near-nadir" as the brief asked, but the booking-grid read still lands. |
| 14 | `Night Operations Room Overlooking Sports Complex.png` | **P8** — /company hero | Certain | Precise match: dark room, single warm desk lamp, silhouetted empty chair, walkie-talkie and notebook on the desk, campus glowing through the window (stadium amber, pool turquoise, courts cool-white). One of the strongest images delivered. |
| 15 | `Night Soccer Training Under Floodlights.png` | **P7** — Chapter INTELLIGENCE (night) | Certain | Coach seen from behind (back only, no face) with visible breath fog, small group mid-drill among cones/ladders. Players are frozen rather than heavily motion-blurred, but at this distance/size none are identifiable — brief intent preserved. |
| 16 | `Rainy Night at the Soccer Sideline.png` | **P9** — /solutions/sports-clubs hero | Certain | Empty benches, tactics board, wet boot prints (rain rather than dew, same visual idea), floodlit pitch falling to black beyond. Strong mood match. |
| — | `Aerial Sports Complex Masterplan.png` | **Off-brief / no clean slot** | Unclear | Beautiful, high-production daytime aerial, but it's a different, much larger complex (extra pitches both sides, parking lots, basketball courts, indoor arena, criss-crossing roads) shot from a steeper near-top-down angle — not the 25°-tilt family used everywhere else. Doesn't satisfy P14 (composition must match the night establishing shot) and can't satisfy P12 either (P12 requires night grade; this is golden-hour day). Treat as a bonus asset with no assigned slot rather than force it into one. |

That accounts for all 16 files (one row, #8, is a duplicate reference to row 2's file, since it competes for the same P1 slot rather than filling a distinct one).

**Slots with a winner chosen where two files competed:**
- **P1 (night background):** `Aerial Night Sports Complex Panorama.png` wins over `Illuminated Sports Complex at Night-1.png` — layout fidelity to the existing production plate is the deciding factor, since P1's own brief is "replaces plate-background."
- **P14 (day background):** `Golden-Hour Aerial Sports Complex.png` wins over `Aerial Sports Complex Masterplan.png` — same reasoning; the Masterplan is a different scene entirely.

---

## 2. Gap list — prompts with no delivered image

Of 17 prompts, **14 are covered** (one with a clear single winner picked from two candidates each for P1 and P14) and **3 have nothing delivered**:

| Prompt | Slot | Criticality |
|---|---|---|
| **P12** — /solutions/multi-sports-organizations hero (`21:9`, night, ~350m altitude, "many disciplines, one estate") | Sub-page hero | **Medium.** The page has no image at all without it — there's no fallback candidate in the batch that fits (the Masterplan image is day-graded and the wrong angle). Blocks that one sub-page from shipping with a real photo. |
| **P16** — day foreground bokeh (`21:9`, transparent PNG, warm backlit morning rim) | Day hero, foreground layer | **Low-medium**, see below — the night foreground can plausibly stand in. |
| **P17** — day finale, nadir "living map" at morning (`21:9`) | Day hero, finale layer | **High for a complete day theme.** Without it, the theme-adaptive hero cannot finish its day-mode flight — there is no day equivalent of "the operational picture" beat at all. |

### Is the day set complete enough to drive a theme-adaptive hero?

**No — it's 2 of 4 plates.** Day background (P14, via the Masterplan/Golden-Hour pair)
and day midground (P15) are present. Day foreground (P16) and day finale (P17) are
both missing.

**Can the night foreground double for both themes?** I looked at
`Cinematic Stadium Lights and Foliage Overlay.png` specifically with this question in
mind. It's a heavily defocused, near-black silhouette of a floodlight mast and tree
canopy with warm rim-light on the foliage edges, center 70% transparent. Silhouetted
foliage against a bright sky is a very common look in daylight photography too, so
purely as a *shape*, it would composite over a golden-hour background without looking
obviously wrong. The one honest flaw: the floodlight mast is lit and glowing in this
plate, which makes no narrative sense laid over a sunrise scene ("no floodlights lit"
is explicit in the day briefs) — a careful viewer would notice a stadium light glowing
at dawn. **Verdict: usable as a stopgap, not a deliberate design choice.** It closes
the gap well enough to ship a day theme without waiting on a regeneration, but it
should be replaced with a true day foreground (prompt below) when there's time —
it's cosmetic debt, not a blocker.

The **day finale (P17) has no such workaround** — there is no image in the batch,
night or day, that reads as a top-down "living map" in daylight color. This is the
one gap that actually stops a complete day-mode flight from being assembled today.

---

## 3. Composition compatibility check (background vs. midground cutout)

The hero rig flies a camera over layered plates; the midground cutout has to sit at
the *same* virtual camera position as its background or the parallax breaks (buildings
sliding relative to their own shadows, roofline seams visible, etc.). I compared each
pair directly.

### Night pair: `Aerial Night Sports Complex Panorama.png` (bg) vs. `Illuminated Stadium and Pool Complex.png` (mid, alpha)

**Compatible — no blocking defect found.** Both frames place the pool bottom-left and
the stadium top-right in closely matching proportions of the canvas, the stadium's
asymmetric partial roof canopy (roofed on the far/upper stand only) appears in the
same position and orientation in both, the running track curvature reads at a
consistent radius, and the three floodlight-mast positions (left of bowl, top-center,
right of bowl) line up. This reads as a real matching pair, consistent with the brief
("same aerial 24mm camera, 25° tilt, identical perspective"). Minor scale/position
nudging during compositing should be expected as normal integration work, not
evidence of a mismatched camera.

### Day pair: `Golden-Hour Aerial Sports Complex.png` (bg) vs. `Golden-Hour Sports Complex Diorama.png` (mid, alpha)

**Mismatch — flag this as a real defect, not just polish.** The background is a wide,
gently-tilted aerial photograph (consistent with the "drone ~120m, 25° tilt" family
used everywhere else). The midground cutout, by contrast, reads as a noticeably
closer, lower, more steeply raking angle with the strong perspective convergence and
selective-focus "toy model" look typical of a tilt-shift/diorama render — which is
exactly what its filename calls it. This isn't a subtle nudge-to-align difference;
it's a different simulated lens and camera height. Laid over the background plate at
100% scale, the stadium and pool would visibly not sit where the background's own
stadium/pool structures are, and the two would not share a horizon line. Combined
with the red-fringe matting artifact noted in §1, **this file should not be used
as-is for the day midground** — regenerate it (prompt in §5) rather than trying to
force-align it in compositing.

---

## 4. Resolution verdict

All landscape files measure 1915×821 or 1844×853. Both fall well short of the prompt
pack's own stated minimum for 21:9 plates — **4000×1715**. The delivered width is
roughly **48%** of that spec (1915/4000), i.e. about a quarter of the pixel area. The
same shortfall applies to the four portrait crops: delivered at 1122×1402 against a
stated minimum of 2400×3000, roughly **47%** of spec.

The reason the pack demanded 4000px in the first place lines up with the stated
camera behavior: a hero plate zooming to ~1.5–1.6× on a viewport up to 1440p-class
(≈2560px wide) needs roughly 2560 × 1.6 ≈ **4096px** of source width to stay pixel-for-
pixel — which is almost exactly the 4000px the pack asked for. The delivered
1915/1844px sources are short of that requirement by more than 2×, meaning the
browser will have to upscale the image by roughly 2.1× at full zoom on a large
display. That is enough to produce visible softening in fine detail — grass mow
lines, distant city lights, window mullions, foliage texture — exactly the kind of
detail these compositions lean on.

On smaller/more common desktop viewports (≈1440px CSS width, which is also common on
HiDPI laptop screens where the OS/browser already downsamples for crispness), the
same math needs roughly 2304px at 1.6× zoom — the delivered assets cover about 83%
of that, which is a much milder, likely-acceptable softness.

**Recommendation: a combination of (a) and (b), not (c).**
- **(a) Upscale externally**, at minimum, the four plates that are actually in the
  camera rig and get pushed to full zoom: the winning night background/midground/
  foreground/finale, and the winning day background/midground once the day set is
  complete. A 2× AI upscale (Topaz, ESRGAN, etc.) would land close to the pack's own
  4000×1715 target and remove the visible-softness risk on large displays.
- **(b) Also cap max camera zoom** to roughly 1.2–1.3× (down from 1.5–1.6×) as a cheap,
  immediate mitigation, especially for the chapter stills and sub-page heroes, which
  are less likely to get the upscaling treatment and are viewed as static images where
  softness is easier to notice than during a moving camera pass.
- **Not (c) acceptable as-is** — the shortfall versus the pack's own spec is too large
  (2×+ at the top of the target viewport range) to call this a non-issue.

---

## 5. Regeneration prompts

For the confirmed gaps and the one confirmed defect. Same style/rule set as the
source pack — the "UNIVERSAL RULE" (photorealistic, no faces, no text/watermarks/
logos, cyan-teal water + warm sodium turf as the only saturated hues, cinematic
dynamic range, no lens flare across center) still applies to all of these.

### Regenerate — P12, /solutions/multi-sports-organizations hero (missing entirely)
> The widest campus frame: high-altitude night aerial (~350m) showing the full
> multi-sport estate as distinct lit zones separated by dark ground — stadium, pool
> complex, court cluster, training pitches — each zone its own light temperature.
> 21:9, minimum 4000×1715. Mood: many disciplines, one estate.

### Regenerate — P16, day foreground bokeh (missing; night version is a workable stopgap)
> Foreground parallax layer on transparency: top of a floodlight mast (unlit — no
> floodlight glow, it's daytime) and dark tree canopy entering only from the bottom
> corners (lowest 18% of frame), heavily out of focus (85mm f/1.8 bokeh), warm
> backlit morning rim-light on the foliage edges instead of night silhouette warmth.
> Center 70% fully transparent and empty. 21:9, transparent PNG, minimum 4000×1715.

### Regenerate — P17, day finale (missing entirely; blocks a complete day-mode flight)
> The nadir "living map" at morning: same geometry as the night finale, surfaces
> reading in natural daylight color (green turf, turquoise pool, pale courts), long
> soft shadows giving the map relief, walkway line reading as a pale painted stripe
> rather than a lit line. Perfectly rectilinear, subtle vignette. 21:9, minimum
> 4000×1715. Mood: many branches, one picture, in daylight.

### Regenerate — P15, day midground cutout (delivered file has a camera-angle mismatch and a matting defect)
> The stadium + pool isolated on transparency, shot as a **wide, gently-tilted aerial
> photograph** — drone at ~120m, 25° downward tilt, 24mm full-frame — matching the
> established day background plate's camera exactly. Explicitly NOT a tilt-shift or
> miniature/diorama effect: normal depth of field throughout, no selective blur, no
> exaggerated perspective convergence. Golden-hour morning grade matching the
> background precisely. Feathered edges, no color fringing at the alpha boundary.
> 21:9, transparent PNG, minimum 4000×1715.

---

## 6. Proposed integration plan

File-by-file destination mapping for the follow-up integration task. Kept in
kebab-case to match the existing `public/media/hero/plate-*.png` convention. Two
notes from checking the actual codebase (`Hero.tsx`, `HeroDirector.tsx`):

- Only `public/media/hero/` exists today under `public/media/`; `company/`,
  `solutions/`, and `pricing/` media folders don't exist yet, so those destinations
  below are a proposed new structure, not an existing one.
- The three "chapter subject plate" prompts (P5/P6/P7 — Clubs/Venues/Intelligence)
  are **not currently wired as separate images** in the hero rig — today the CLUBS/
  VENUES/INTELLIGENCE chapters are camera pushes into corners of the *same* single
  background/midground plate (see `HeroDirector.tsx` keyframe comments). Dropping
  these three files in only makes them available on disk; swapping the rig to
  actually cut to a different photo per chapter is a code change, out of scope for
  this read-only catalog.

| Delivered file | Destination | Notes |
|---|---|---|
| `Aerial Night Sports Complex Panorama.png` | `public/media/hero/plate-background.png` | Replace existing. Drop-in. |
| `Illuminated Stadium and Pool Complex.png` | `public/media/hero/plate-midground.png` | Replace existing. Drop-in, alpha already correct. |
| `Cinematic Stadium Lights and Foliage Overlay.png` | `public/media/hero/plate-foreground.png` | Replace existing. Drop-in, alpha already correct. |
| `Illuminated Sports Complex at Night.png` | `public/media/hero/plate-finale.png` | Replace existing. Drop-in. |
| `Golden-Hour Aerial Sports Complex.png` | `public/media/hero/plate-background-day.png` | New day-theme asset; requires `Hero.tsx`/theme code to consume it. |
| `Golden-Hour Sports Complex Diorama.png` | *(hold — do not integrate)* | Regenerate per §5 first; the camera-angle mismatch would visibly break parallax if shipped. |
| *(gap)* | `public/media/hero/plate-foreground-day.png` | Ship `Cinematic Stadium Lights and Foliage Overlay.png` here as a stopgap (see §2), replace once P16 is regenerated. |
| *(gap)* | `public/media/hero/plate-finale-day.png` | Blocked until P17 is regenerated — no stand-in exists. |
| `Empty Stadium Under Floodlights.png` | `public/media/hero/chapter-clubs.png` | Needs `HeroDirector.tsx` rig change to actually cut to it. |
| `Modern Sports Complex at Night.png` | `public/media/hero/chapter-venues.png` | Same as above. |
| `Night Soccer Training Under Floodlights.png` | `public/media/hero/chapter-intelligence.png` | Same as above. |
| `Night Operations Room Overlooking Sports Complex.png` | `public/media/company/hero.png` | New folder. |
| `Rainy Night at the Soccer Sideline.png` | `public/media/solutions/hero-sports-clubs.png` | New folder. |
| `Misty Dawn Soccer Training Ground.png` | `public/media/solutions/hero-sports-academies.png` | New folder. |
| `Midnight Paddle Courts from Above.png` | `public/media/solutions/hero-sports-venues.png` | New folder. |
| *(gap)* | `public/media/solutions/hero-multi-sports-organizations.png` | Blocked until P12 is regenerated. |
| `Four Sports Hubs Across the Night City.png` | `public/media/pricing/hero.png` | New folder. |
| `Illuminated Sports Complex at Night-1.png` | *(park — not integrated)* | Losing P1 candidate; keep in `assets/hero-plates/new/` as a mood alternate, no destination assigned. |
| `Aerial Sports Complex Masterplan.png` | *(park — not integrated)* | Off-brief, no matching slot; keep as a bonus asset for a possible future page, no destination assigned. |

All of the above are recommendations for the *next* task, not actions taken here —
this pass made no file changes.
