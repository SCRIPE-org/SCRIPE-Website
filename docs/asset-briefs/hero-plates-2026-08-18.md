## 8. ASSET PROMPTS — elevated multi-plate hero (production-ready)

The hero ships v1 on the incumbent `public/media/campus.jpg` (1.0MB JPEG,
golden-hour aerial, graded to night in CSS). The elevated version needs the
four assets below. Integration contract for every plate: **21:9-safe center
composition** (all key subjects inside the central 16:9, nothing critical in
the outer 12% — the camera pans up to ±11% and scales to 1.33), minimum
**3440×1476** (21:9) with 2× headroom preferred, **no text, no watermarks,
no people's identifiable faces**, and a grade that already lives in the brand
world: obsidian/deep-petrol night (#0B0B0E–#0E1522 shadows), warm sodium/
floodlight practicals, and a single signal-lime (#C0FF00) accent element per
plate at most.

### Asset 1 — Background plate: the campus at night (base environment)
> Ultra-wide aerial establishing shot of a modern multi-sport campus at
> night, seen from a drone at ~120m altitude, 25° downward tilt. Composition:
> one large floodlit football stadium upper-right third, an Olympic outdoor
> swimming pool lower-left third glowing turquoise from underwater lights,
> two five-a-side training pitches and four padel courts between them,
> connected by walkways with warm path lighting; a low clubhouse building
> with lit windows on the right edge of the central safe zone. Camera: aerial
> drone, 24mm full-frame equivalent, f/5.6, everything in focus. Lighting:
> deep blue-black night sky (no stars needed), cool moonlight ambient,
> warm amber floodlights on the stadium, turquoise pool glow, sodium-warm
> window light — high dynamic range but crushed, cinematic shadows. Colors:
> obsidian #0B0B0E to deep petrol #0E1522 shadow field, warm amber #FFBE78
> practicals, one thin signal-lime #C0FF00 LED line running along the main
> walkway. Materials: wet-look asphalt, dewy grass with visible mow lines,
> still pool water with slight ripple. Mood: calm, precise, "the operation
> at rest, still running." Background: city glow faded to black at the
> horizon. Aspect ratio 21:9, minimum 3440×1476. No text, no people in
> foreground, no lens flare across the safe zone.

### Asset 2 — Midground plate: stadium + pool cutout layer (parallax mid)
> The same campus scene's hero structures isolated for a parallax midground
> layer: the floodlit stadium and the glowing pool with their immediate
> surroundings, rendered on a fully transparent background (alpha PNG).
> Same camera (aerial 24mm, 25° tilt), same night grade as the background
> plate (obsidian shadows, amber floodlights, turquoise pool), identical
> perspective so it registers exactly over Asset 1 at 100% scale. Soft
> 2–3px feathered edges, no halo. Aspect ratio 21:9 canvas, minimum
> 3440×1476, subjects inside the central 16:9. PNG with alpha. No text.

### Asset 3 — Foreground plate: signal-lit foreground edge (parallax near)
> Foreground parallax layer on transparent background (alpha PNG): the top
> edge of a floodlight mast and a sliver of dark tree canopy entering from
> the bottom-left and bottom-right corners only (lowest 18% of frame),
> heavily out of focus (f/1.8 bokeh, 85mm compression feel), silhouetted
> near-black #0B0B0E with a faint rim of warm floodlight, and one barely
> visible signal-lime #C0FF00 edge-light kissing the mast rim. Center 70% of
> the canvas fully transparent and empty — this layer must never cover the
> type zone. Aspect ratio 21:9 canvas, minimum 3440×1476. PNG with alpha.
> Mood: depth, night air, cinema. No text.

### Asset 4 — Finale plate: the operational picture (destination beat)
> The same campus from directly overhead (nadir, 90° top-down, ~200m), at
> night, composed like a living map: stadium, pool, pitches and courts
> reading as clean geometric shapes in the darkness, each surface lit its
> own temperature (amber stadium, turquoise pool, cool-white courts),
> walkway LED line in signal-lime #C0FF00 connecting all of them like a
> circuit trace. Camera: nadir aerial, 24mm, perfectly rectilinear.
> Grade: obsidian #0B0B0E field, surfaces glowing out of black, subtle
> vignette. Mood: "many branches, one picture" made literal — the campus as
> a dashboard. All subjects inside the central 16:9 of a 21:9 frame,
> minimum 3440×1476. No text, no icons, no UI overlays.

**Integration plan when assets land:** Asset 1 replaces `campus.jpg` as the
rig's base `<Image>`; Assets 2–3 stack as sibling layers inside `.hero-rig`
with their own GSAP depth multipliers (mid ×1.15, near ×1.4 of rig motion);
Asset 4 becomes a second plate that crossfades in across the finale segment
(0.76→0.86) — all additive changes inside `Hero.tsx` + `CAMERA_PATH`.

## 9. Files touched

- `src/app/[locale]/page.tsx` (rewritten)
- `src/content/types.ts`, `src/content/en/home.ts`, `src/content/ar/home.ts`
- `src/components/sections/home/`: `Hero.tsx`, `HeroDirector.tsx`,
  `TrustStrip.tsx`, `ProductFamily.tsx`, `PlatformOverview.tsx`,
  `SolutionsGrid.tsx`, `AutomationStory.tsx`, `BranchesStory.tsx`,
  `ClosingCta.tsx`, `ArrowLink.tsx`, `accents.ts`
- `src/styles/home.css`
- `public/media/campus.jpg` (copied from backup; backup untouched)
