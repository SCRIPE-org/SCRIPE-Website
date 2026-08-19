#!/usr/bin/env python3
"""SCRIPE — OG-card static font pipeline (Task G5).

WHY THIS SCRIPT EXISTS
-----------------------
`src/app/[locale]/opengraph-image.tsx` renders the social-share card through
`next/og` (`ImageResponse`), which is powered by Satori. Satori can only
parse TrueType/OpenType SFNT containers (`\\x00\\x01\\x00\\x00`, `"OTTO"`,
`"true"`) — never WOFF/WOFF2. Every font this project ships under
`src/fonts/*.woff2` is a *variable* WOFF2, so the OG route has been falling
back to Satori's bundled default font instead of real Archivo brand type
(see `opengraph-image.tsx`'s file header for the exact repro/error).

This script produces the missing asset: STATIC TrueType instances, pinned to
the exact weights the OG card actually uses, derived mechanically from the
variable fonts this project already owns (Archivo, Noto Sans Arabic — both
already vendored under `src/fonts/`, both already covered by this project's
existing font licensing). No glyphs are drawn or generated — this is pure
mechanical processing (axis-pinning + subsetting) of assets already in the
repo, the same class of operation `scripts/subset-fonts.mjs` performs.

METHOD
------
  1. INSTANCE — `fontTools.varLib.instancer.instantiateVariableFont()` pins
     every variable axis (`wght`, and `wdth` where present) to a single
     value, dropping `fvar`/`gvar`/`avar`/`STAT` and baking one static
     `glyf` outline set. This is the same operation design tools call "export
     a static instance"; fontTools is Google/Adobe's own reference
     implementation of the OpenType variable-font spec.
  2. SUBSET — `fontTools.subset` cuts each static instance down to the same
     Unicode block policy `scripts/subset-fonts.mjs` already uses for the
     site's main Latin/Arabic faces (full Basic Latin + Latin-1 Supplement +
     Latin Extended-A/B + General Punctuation + Currency + Arrows + Math for
     Latin; the Arabic blocks + Latin digits + bidi control characters for
     Arabic) — see LATIN_BLOCKS/ARABIC_BLOCKS below, copied verbatim from
     that script so both pipelines apply the identical policy. This is
     headroom for future OG copy edits, not a tight fit to today's two
     strings.
  3. Output is written as a raw `.ttf` (TrueType SFNT, uncompressed) — NOT
     `.woff2` — because Satori cannot parse the WOFF2 container regardless
     of whether the font inside is variable or static. `opengraph-image.tsx`
     signature-checks whatever it loads, so a `.ttf` here is what turns its
     `loadArchivoFont()`/Arabic loader from "always null" into "loads".

WEIGHTS
-------
Matches `opengraph-image.tsx`'s actual card design, not a guess:
  - Archivo ExtraBold (wght=800, wdth=100)  — the "SCRIPE" wordmark
    (`fontWeight: 800` in the card's JSX today).
  - Archivo Regular   (wght=400, wdth=100)  — the tagline (no `fontWeight`
    in the card's JSX today == CSS-initial `normal` == 400).
  - Noto Sans Arabic Regular (wght=400)     — Arabic-shaping trial for the
    tagline (see opengraph-image.tsx's file header for the outcome; Noto
    Sans, not Noto Kufi, because the tagline plays the same role the
    `footer.tagline` string does sitewide, which always renders through the
    BODY family (`--font-body-ar-base` -> Noto Sans Arabic), never the
    display family).

REQUIRES: `fontTools` (with the `woff2`/brotli extras — this repo's Python
already has both: `pip show fonttools brotli`). Never added to
`package.json`/`requirements.txt` — a local one-off Python tool, same
"don't add a project dependency for a build-time asset script" discipline
`scripts/subset-fonts.mjs` documents for `subset-font`. If missing:

    pip install fonttools brotli

USAGE
-----
    python scripts/build-og-fonts.py
    (or, if a `python3` shim is what's on PATH: python3 scripts/build-og-fonts.py)

Overwrites `src/fonts/og/*.ttf` in place — deterministic for a given set of
source `.woff2` files, safe to re-run any number of times. Re-run whenever
`src/fonts/Archivo-var.woff2` or `src/fonts/NotoSansArabic-var.woff2` is
replaced, or if the OG card's copy ever needs characters outside the kept
Latin/Arabic block policy.
"""

from __future__ import annotations

import pathlib
import sys

from fontTools import subset as ft_subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "src" / "fonts"
OUT_DIR = FONTS_DIR / "og"

# Copied verbatim from scripts/subset-fonts.mjs's LATIN_BLOCKS/ARABIC_BLOCKS
# so both pipelines apply the identical kept-character policy.
LATIN_BLOCKS = [
    (0x0000, 0x007F),  # Basic Latin
    (0x0080, 0x00FF),  # Latin-1 Supplement
    (0x0100, 0x017F),  # Latin Extended-A
    (0x0180, 0x024F),  # Latin Extended-B
    (0x2000, 0x206F),  # General Punctuation
    (0x20A0, 0x20CF),  # Currency Symbols
    (0x2190, 0x21FF),  # Arrows
    (0x2200, 0x22FF),  # Mathematical Operators
]
ARABIC_BLOCKS = [
    (0x0600, 0x06FF),  # Arabic
    (0x0750, 0x077F),  # Arabic Supplement
    (0x08A0, 0x08FF),  # Arabic Extended-A
]
LATIN_DIGITS = [ord(c) for c in "0123456789"]
RTL_CONTROLS = [
    0x061C, 0x200C, 0x200D, 0x200E, 0x200F, 0x202A, 0x202B, 0x202C, 0x202D,
    0x202E, 0x2066, 0x2067, 0x2068, 0x2069,
]


def block_unicodes(blocks: list[tuple[int, int]]) -> set[int]:
    """Expands `[start, end]` inclusive block tuples into a codepoint set."""
    out: set[int] = set()
    for start, end in blocks:
        out.update(range(start, end + 1))
    return out


def instance_and_subset(
    source: pathlib.Path,
    axis_limits: dict[str, float],
    unicodes: set[int],
    out_path: pathlib.Path,
) -> None:
    """Pins `source`'s variable axes to `axis_limits`, subsets the result to
    `unicodes`, and writes a static `.ttf` to `out_path`.

    @param source - Path to a variable `.woff2` under `src/fonts/`.
    @param axis_limits - e.g. `{"wght": 800, "wdth": 100}` — every axis the
      font declares must be pinned (a partial dict leaves the rest variable,
      which is not what any caller here wants).
    @param unicodes - Codepoints to keep; every glyph reachable only through
      a dropped codepoint is discarded too.
    @param out_path - Destination `.ttf` (parent directory is created if
      needed).
    """
    before_bytes = source.stat().st_size
    font = TTFont(str(source))

    static_font = instancer.instantiateVariableFont(font, axis_limits, inplace=False)
    # TTFont remembers the container flavor it was loaded from ("woff2" for
    # every source here); left alone, .save() re-compresses back to WOFF2
    # regardless of the ".ttf" filename. Force a raw SFNT container — the
    # entire point of this script is a format Satori can parse, and Satori
    # rejects WOFF2 (see this file's header and opengraph-image.tsx's).
    static_font.flavor = None

    options = ft_subset.Options()
    options.layout_features = ["*"]  # keep all GSUB/GPOS features (ligatures, marks, Arabic shaping tables)
    options.name_IDs = ["*"]
    options.notdef_glyph = True
    options.notdef_outline = True
    options.recalc_bounds = True
    options.recalc_timestamp = False
    options.desubroutinize = False
    subsetter = ft_subset.Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(static_font)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    static_font.save(str(out_path))

    after_bytes = out_path.stat().st_size
    delta = (1 - after_bytes / before_bytes) * 100
    print(
        f"  {out_path.relative_to(ROOT).as_posix()}  "
        f"{before_bytes} B (source) -> {after_bytes} B  ({delta:.1f}% smaller than source)"
    )


def main() -> int:
    try:
        import brotli  # noqa: F401  (required by fontTools to read the .woff2 sources)
    except ImportError:
        print(
            "fontTools needs the 'brotli' package installed to read .woff2 "
            "sources. Install with:\n\n    pip install fonttools brotli\n",
            file=sys.stderr,
        )
        return 1

    latin_unicodes = block_unicodes(LATIN_BLOCKS)
    arabic_unicodes = block_unicodes(ARABIC_BLOCKS) | set(LATIN_DIGITS) | set(RTL_CONTROLS)

    print("Instancing + subsetting OG-card static fonts (Task G5):\n")

    instance_and_subset(
        FONTS_DIR / "Archivo-var.woff2",
        {"wght": 800, "wdth": 100},
        latin_unicodes,
        OUT_DIR / "Archivo-ExtraBold.ttf",
    )
    instance_and_subset(
        FONTS_DIR / "Archivo-var.woff2",
        {"wght": 400, "wdth": 100},
        latin_unicodes,
        OUT_DIR / "Archivo-Regular.ttf",
    )

    print("\nDone. Re-run any time the source variable fonts change.")
    return 0


def arabic_trial(weight: float = 400.0) -> None:
    """Reproduces the Task G5 Arabic-shaping trial: not called by `main()`.

    `opengraph-image.tsx`'s `CONTENT` doc comment has the full story — a
    static instance produced exactly this way (and a Noto Kufi Arabic one
    instanced the same way at a different weight) both load into Satori
    fine but crash the instant Arabic text is shaped through them
    (`lookupType: 5 - substFormat: 3 is not yet supported`, thrown from
    `@vercel/og`'s bundled shaping code regardless of which Arabic face is
    used). Since the OG route never feeds Arabic text through either face
    today, this function — and the `.ttf` it would produce — is deliberately
    NOT part of `main()`'s default output: shipping an unused binary the
    route never reads would just be repo bloat with no consumer. Run this
    function directly (`python -c "from build_og_fonts import arabic_trial;
    arabic_trial()"` after `cd scripts`, or paste it into a REPL) to
    regenerate the exact instance that was tested, the moment this is worth
    revisiting.

    @param weight - Pinned `wght` axis value (400 = Regular, what was
      tested against Noto Sans Arabic; 600 = SemiBold was tested against
      Noto Kufi Arabic — swap `source` below to try that face instead).
    """
    arabic_unicodes = block_unicodes(ARABIC_BLOCKS) | set(LATIN_DIGITS) | set(RTL_CONTROLS)
    instance_and_subset(
        FONTS_DIR / "NotoSansArabic-var.woff2",
        {"wght": weight, "wdth": 100},
        arabic_unicodes,
        OUT_DIR / "NotoSansArabic-Regular.ttf",
    )


if __name__ == "__main__":
    raise SystemExit(main())
