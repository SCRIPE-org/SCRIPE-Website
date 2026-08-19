# `assets/` — the single source of truth for every image on the site

Everything under `public/media/` is **generated** from this folder by
`scripts/build-media-assets.mjs` (`npm run media:build`). Nothing under
`public/media/` is a source for anything, and nothing here is served to a
browser.

That direction used to be muddled: the hero's night encodes read their source
from `public/media/hero/plate-background.png`, which meant a 2.25 MB PNG shipped
in every deploy purely to be a build input, while no browser ever requested it
(the stylesheet only ever asks for `.avif` / `.webp`). It now lives at
`hero/night-background.png` and the deploy is 2.25 MB lighter.

## The rule

**Files are named for the job they do, never for what the generator called
them.** A name like `Empty Stadium Under Floodlights.png` describes a
photograph; `hero/chapter-01-clubs.png` describes a *decision*. When a frame is
replaced, the new file takes the old name and nothing else in the repo changes.

Lowercase, kebab-case, no spaces.

## Layout

```
assets/
  brand/    the 3D brand mark and app icon, as delivered
  hero/     the home hero's own film — named by role in the flight
  pages/    one framed photograph per page slot — <page>-<subject>
  unused/   delivered frames nothing consumes — named for WHY they lost
```

### `hero/`

| file | role |
| --- | --- |
| `night-background.png` | the night film's base plate — the static frame, and the armed flight's deepest layer |
| `night-midground.png` | stadium + pool cutout (alpha), the parallax middle layer |
| `night-foreground.png` | bokeh floodlight overlay (alpha), the topmost parallax layer |
| `night-finale.png` | the nadir "living map" the flight cuts to at the end |
| `day-background.png` | the day film's base plate (light theme) |
| `chapter-01-clubs.png` | beat 01's establishing still — the clubhouse and its dugout |
| `chapter-02-venues.png` | beat 02's establishing still — the lit court grid |
| `chapter-03-intelligence.png` | beat 03's establishing still — night training, coach from behind |

The four `night-*` files are byte-identical (hash-verified) to the plates that
were already in production; they were moved here rather than re-generated, so
the encodes did not change.

### `pages/`

| file | slot |
| --- | --- |
| `platform-operations-desk.png` | `/platform` — the dashboard strip |
| `company-ops-room.png` | `/company` |
| `pricing-city-hubs.png` | `/pricing` |
| `solution-clubs-sideline.png` | `/solutions/sports-clubs` |
| `solution-academies-dawn.png` | `/solutions/sports-academies` |
| `solution-venues-courts.png` | `/solutions/sports-venues` |
| `solution-multisport-masterplan.png` | `/solutions/multi-sports-organizations` — **interim**, a day-graded frame standing in for a night one that was never delivered |

### `unused/`

Kept deliberately. Each filename carries its own reason, so no decision here
has to be rediscovered by looking at pictures again:

- **`*-white-walkway*.png`** (four night frames) — these render the campus
  walkway as a **white** line. The production plates render it in signal lime,
  and that lime thread is load-bearing: `home.css`'s `.hero-bloom` is authored
  as "the campus walkway's own light temperature", and `.hero-stamp` carries a
  shadow specifically so it stays separable over it. Swapping them in would be
  a lateral move at best and a brand regression at worst.
- **`day-midground-DEFECTIVE-tilt-shift-red-fringe.png`** — shot at a closer
  tilt-shift/miniature angle that does not match its background plate (the
  parallax layers would not line up), plus a red fringe along the stadium
  roofline. Needs regenerating, not repairing.
- **`platform-desk-peopled-legible-screen.png`** and
  **`platform-desk-peopled-portrait-legible-screen.png`** — both are good
  photographs, and both show a **legible spreadsheet UI** on the monitor. On a
  page headlined *"every module resolves into one dashboard"* a reader would
  reasonably take that screen as our software. That makes it fabricated product
  evidence rather than decoration, which is why the empty room won the slot.

## Adding an image

1. Drop the file here under the name of the **job**, in the right folder.
2. Add an entry to `HERO_PLATES` or `PHOTO_MASTERS` in
   `scripts/build-media-assets.mjs`, with a comment saying what the frame
   contains and why it was chosen.
3. `npm run media:build`.
4. Point a consumer at the generated path.

Never hand-convert a file into `public/media/` — the script is the only writer,
which is what keeps the outputs reproducible and the deploy free of inputs.
