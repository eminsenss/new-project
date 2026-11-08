"""Vectorize the official Nur Ajanda logo (site-logo-1.png, 226x49) into SVG.

Shapes are traced 1:1 from the original raster (no redesign): the image is
upscaled, split into its two brand colors (red / black) and traced with potrace.
Usage: python3 tools/trace_logo.py <site-logo-1.png> <out.svg> [<out-white.svg>]
"""
import sys
import numpy as np
from PIL import Image
import potrace

SCALE = 12
RED = "#EC1B24"   # sampled from the original logo
INK = "#111111"
INK_TEXT = "#2B2A29"  # sampled: "AJANDA / PROMOSYON" text tone


def to_path(bm_mask, sx, sy):
    bm = potrace.Bitmap(~bm_mask)  # potracer fills False pixels
    plist = bm.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                     alphamax=0.9, opticurve=True, opttolerance=0.25)
    parts = []
    f = lambda p: f"{p.x / sx:.3f} {p.y / sy:.3f}"
    for curve in plist:
        parts.append(f"M{f(curve.start_point)}")
        for seg in curve.segments:
            if seg.is_corner:
                parts.append(f"L{f(seg.c)}L{f(seg.end_point)}")
            else:
                parts.append(f"C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}")
        parts.append("Z")
    return "".join(parts)


def main(src, out, out_white=None):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    big = bg.convert("RGB").resize((w * SCALE, h * SCALE), Image.LANCZOS)
    a = np.asarray(big).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    redness = r - np.maximum(g, b)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    red = redness > 80
    dark = (lum < 140) & ~red
    xs = np.arange(w * SCALE)[None, :].repeat(h * SCALE, 0)
    split = 120 * SCALE  # left of the red divider: mark + NUR, right: descriptor text
    dark_mark = dark & (xs < split)
    dark_text = dark & (xs >= split)
    p_red = to_path(red, SCALE, SCALE)
    p_mark = to_path(dark_mark, SCALE, SCALE)
    p_text = to_path(dark_text, SCALE, SCALE)

    def svg(c_red, c_mark, c_text, title="Nur Ajanda Promosyon"):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}">'
                f'<title>{title}</title>'
                f'<path fill="{c_mark}" fill-rule="evenodd" d="{p_mark}"/>'
                f'<path fill="{c_text}" fill-rule="evenodd" d="{p_text}"/>'
                f'<path fill="{c_red}" fill-rule="evenodd" d="{p_red}"/></svg>')

    open(out, "w").write(svg(RED, INK, INK_TEXT))
    if out_white:
        open(out_white, "w").write(svg(RED, "#FFFFFF", "#FFFFFF"))
    print("ok", len(p_red), len(p_mark), len(p_text))


if __name__ == "__main__":
    main(*sys.argv[1:])
