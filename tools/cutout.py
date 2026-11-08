"""Remove the plain white studio background from supplier product photos.

Only background pixels connected to the image border are touched; the product
itself (colors, print, texture) is left untouched. Near-white background is
converted to alpha ("color to alpha" against white) so the original soft
contact shadows survive as semi-transparent shadows.
Usage: python3 tools/cutout.py <in.jpg> <out.png> [threshold=200]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage


def cutout(src, dst, thr=200):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    near_white = a.min(axis=2) * 255 > thr
    lab, n = ndimage.label(near_white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    # include the 2px anti-aliased fringe around the background region
    region = ndimage.binary_dilation(bg, iterations=2)
    # color-to-alpha against white
    alpha_c = (1.0 - a).max(axis=2)
    alpha = np.where(region, alpha_c, 1.0)
    # gentle curve so faint paper noise becomes fully transparent
    alpha = np.where(region, np.clip((alpha - 0.025) / 0.975, 0, 1), alpha)
    safe = np.maximum(alpha, 1e-4)[..., None]
    rgb = np.where(region[..., None], 1.0 - (1.0 - a) / safe, a)
    rgb = np.clip(rgb, 0, 1)
    out = np.dstack([rgb, alpha])
    img = Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        pad = 12
        x0, y0, x1, y1 = bbox
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))
    img.save(dst, optimize=True)
    return img.size


if __name__ == "__main__":
    thr = float(sys.argv[3]) if len(sys.argv) > 3 else 200
    print(cutout(sys.argv[1], sys.argv[2], thr))
