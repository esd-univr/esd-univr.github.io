#!/usr/bin/env python3
"""
Builds the self-hosted icon font in `src/styles/fonts/` from upstream Material Symbols.

This is a **maintenance tool, not part of the build.** Its output is committed, so
`npm ci && npm run build` needs neither Python nor the 14 MB upstream font package. Run it
only when the glyph list below changes.

    npm pack @fontsource-variable/material-symbols-rounded@5.3.3   # or npm i -D the package
    tar -xzf fontsource-variable-material-symbols-rounded-5.3.3.tgz
    python3 scripts/build-icon-font.py package/files/material-symbols-rounded-latin-full-normal.woff2

Upstream ships a 6597-glyph variable font: 5.3 MB with every axis, 960 kB for the smallest
single-axis cut. This site uses one glyph, so the font is pinned to one point in the design
space (FILL 0, wght 400, GRAD 0, opsz 24 — the values `readme.md` fixes for the icon layer)
and then subset to the codepoints actually referenced by `src/components/Icon.astro`. Pinning
first is what removes the variation tables; subsetting alone would leave them behind.

Ligature access (`<span class="icon">open_in_new</span>`) is deliberately not supported: it
would need the Latin letters and the `liga` feature in the subset, and a font that failed to
load would print the words "open in new" in the page. A codepoint degrades to blank instead.

Requires `fonttools` (`pip install fonttools brotli`); fontTools >= 4.40 is enough.
"""

import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# Keep in step with GLYPHS in src/components/Icon.astro. The codepoint is pinned rather than
# looked up: upstream maps several private-use codepoints onto one glyph (open_in_new answers to
# both U+E895 and U+E89E), and only the one in Google's published codepoints list is safe to
# hard-code in markup. The lookup below asserts the font agrees.
GLYPHS = {"open_in_new": 0xE89E}

# The icon layer's fixed instance — outlined, weight 400, so the stroke matches the 1px rules.
INSTANCE = {"FILL": 0, "GRAD": 0, "opsz": 24, "wght": 400}

OUT = pathlib.Path("src/styles/fonts/material-symbols-rounded-subset.woff2")


def main(source: str) -> None:
    font = TTFont(source)
    cmap = font.getBestCmap()
    for glyph, codepoint in GLYPHS.items():
        found = cmap.get(codepoint)
        if found != glyph:
            raise SystemExit(f"U+{codepoint:04X} is {found!r} in {source}, expected {glyph!r}")
        print(f"{glyph} -> U+{codepoint:04X}")
    codepoints = list(GLYPHS.values())

    instancer.instantiateVariableFont(font, INSTANCE, inplace=True, updateFontNames=True)
    options = subset.Options(hinting=False, desubroutinize=True, notdef_outline=False)
    options.layout_features = []
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)

    font.flavor = "woff2"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(OUT)
    print(f"{OUT} — {OUT.stat().st_size} bytes, {font['maxp'].numGlyphs} glyphs")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
