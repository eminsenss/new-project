"""Original score for the Nur Ajanda 35 s Reels ad — synthesized from scratch.

No samples, loops or third-party recordings are used: every sound (pad, mallet,
bass, kick, rim, shaker, swells) is generated here with numpy/scipy, so the
music is fully owned by the project and free of licensing restrictions.

Structure (120 BPM, half-time feel, 1 bar = 2 s) is locked to the edit:
  0–5 s   hook: impact + drone + rising mallet motif
  5–29 s  groove: four 6 s sections (3 bars each), swell into every cut
  29–35 s outro: logo hit at 29.0 s, resolve, fade to silence at 35.0 s
Usage: python3 tools/make_music.py public/audio/nur-ajanda-score.wav
"""
import sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 35.0
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
send = np.zeros(N)  # reverb send (mono)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= N:
        return
    j = min(N, i + len(x))
    buf[i:j] += x[: j - i] * gain


def add(x, t, gain=1.0, pan=0.0, rev=0.0):
    lg = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    rg = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    place(L, x, t, gain * lg)
    place(R, x, t, gain * rg)
    if rev:
        place(send, x, t, gain * rev)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    sus = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sus, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def lowpass(x, fc, order=2):
    sos = signal.butter(order, fc, 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def highpass(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


# ---------------- instruments ----------------
def mallet(m, dur=1.6, bright=1.0):
    """Soft felt mallet / celesta-like tone (additive, inharmonic partials)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(m)
    out = np.zeros(n)
    for k, (ratio, amp, dec) in enumerate([(1, 1.0, 1.9), (2.0, 0.32 * bright, 0.9), (3.0, 0.12 * bright, 0.5), (4.16, 0.08 * bright, 0.32), (5.43, 0.04 * bright, 0.2)]):
        out += amp * np.sin(2 * np.pi * f * ratio * t + k) * np.exp(-t / dec)
    att = np.minimum(1, t / 0.004)
    return out * att * 0.5


def pad(notes, dur, cutoff=1800):
    """Warm detuned-saw pad with slow attack."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in notes:
        f = midi(m)
        for det in (-0.09, 0.0, 0.08):
            ff = f * 2 ** (det / 12)
            for h in range(1, 10):
                out += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h
    out = lowpass(out, cutoff, 2)
    out *= env_adsr(n, 0.9, 0.5, 0.85, 1.2)
    lfo = 1 + 0.06 * np.sin(2 * np.pi * 0.25 * t)
    return out * lfo / (len(notes) * 9)


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    return lowpass(x, 420) * env_adsr(n, 0.01, 0.25, 0.7, 0.25) * 0.55


def kick():
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    freq = 46 + 95 * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(freq) / SR
    x = np.sin(ph) * np.exp(-t / 0.22)
    click = bandpass(rng.standard_normal(n), 1500, 5000) * np.exp(-t / 0.004) * 0.15
    return (x + click) * 0.9


def rim():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = bandpass(rng.standard_normal(n), 900, 4200) * np.exp(-t / 0.05)
    tone = np.sin(2 * np.pi * 410 * t) * np.exp(-t / 0.03) * 0.5
    return (x * 0.5 + tone) * 0.35


def shaker():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.012) * np.exp(-t / 0.035)
    return highpass(rng.standard_normal(n), 6500, 3) * e * 0.10


def swell(dur):
    """Filtered noise riser that lands on the next cut."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # sweep: blend of two band-passed layers
    lo = bandpass(x, 300, 1500)
    hi = bandpass(x, 2500, 9000)
    k = (t / dur) ** 2
    out = (lo * (1 - k) + hi * k) * (t / dur) ** 2.4
    out[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return out * 0.32


def impact(depth=1.0):
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    freq = 38 + 60 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.7)
    air = lowpass(rng.standard_normal(n), 2600) * np.exp(-t / 0.35) * 0.25
    return (boom * 0.8 + air) * depth


# ---------------- harmony ----------------
# Key: C major / A minor. One chord per bar (2 s).
CH = {
    'Fmaj9': ([53, 57, 60, 64, 67], 41),
    'Am9': ([57, 60, 64, 67, 71], 45),
    'G6': ([55, 59, 62, 64], 43),
    'Cmaj9': ([48, 55, 59, 62, 64], 36),
    'Em7': ([52, 55, 59, 62], 40),
    'Dm9': ([50, 53, 57, 60, 64], 38),
}
# bar start times from 5 s: 12 bars (5–29 s), outro bars at 29, 31, 33
groove = ['Fmaj9', 'Am9', 'G6', 'Fmaj9', 'Cmaj9', 'G6', 'Dm9', 'Am9', 'Em7', 'Fmaj9', 'G6', 'Am9']

# ---- hook 0–5 s ----
add(impact(0.9), 0.0, 0.85, 0, 0.35)
add(pad([45, 52, 57, 60, 64], 5.6, cutoff=900), 0.0, 0.9, 0, 0.5)
add(bass(33, 5.0), 0.0, 0.5)
motif = [(0.55, 76), (1.05, 79), (1.55, 81), (2.3, 84), (3.05, 83), (3.55, 79), (4.05, 81)]
for i, (t, m) in enumerate(motif):
    add(mallet(m, 1.8, 0.9), t, 0.55, -0.25 + 0.5 * (i % 2), 0.6)
add(swell(1.6), 5.0 - 1.6, 0.9, 0, 0.2)

# ---- groove 5–29 s ----
for b, name in enumerate(groove):
    t0 = 5.0 + b * 2.0
    notes, root = CH[name]
    add(pad(notes, 2.25, cutoff=1500 + 120 * (b % 3)), t0, 0.75, 0, 0.45)
    add(bass(root, 0.95), t0, 0.85)
    add(bass(root + (7 if b % 2 else 12), 0.9), t0 + 1.0, 0.6)
    # half-time drums: kick 1 and 3&, rim on 3
    add(kick(), t0, 0.95)
    add(kick(), t0 + 1.25, 0.55)
    add(rim(), t0 + 1.0, 0.8, 0.15, 0.25)
    for s in range(8):
        add(shaker(), t0 + s * 0.25, 0.9 if s % 2 else 0.55, 0.35, 0.05)
    # mallet arpeggio in 8ths, gently varied
    arp = sorted(set(n + 12 for n in notes))
    pattern = [0, 2, 1, 3, 2, 4, 1, 3]
    for s, p in enumerate(pattern):
        m = arp[p % len(arp)]
        add(mallet(m, 1.2, 0.85), t0 + s * 0.25, 0.3 if s % 2 else 0.4, -0.35 if s % 2 else 0.3, 0.5)

# swells into each scene cut
for cut in (11.0, 17.0, 23.0, 29.0):
    add(swell(1.5), cut - 1.5, 0.95, 0, 0.25)

# ---- outro 29–35 s ----
add(impact(1.0), 29.0, 0.95, 0, 0.45)
add(pad(CH['Cmaj9'][0] + [71], 6.0, cutoff=1300), 29.0, 0.9, 0, 0.6)
add(bass(36, 3.8), 29.0, 0.8)
for i, (t, m) in enumerate([(29.05, 72), (29.55, 76), (30.05, 79), (30.55, 83), (31.3, 84), (32.3, 79), (33.1, 76)]):
    add(mallet(m, 2.4, 0.8), t, 0.5, -0.3 + 0.6 * (i % 2), 0.7)

# ---------------- reverb (stereo convolution) ----------------
def ir(seed, length=2.4):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = np.arange(n) / SR
    x = r.standard_normal(n) * np.exp(-t / 0.55)
    x = lowpass(x, 6000)
    x[: int(0.012 * SR)] = 0  # pre-delay
    return x / np.sqrt(np.sum(x ** 2))


wetL = signal.fftconvolve(send, ir(11))[:N]
wetR = signal.fftconvolve(send, ir(12))[:N]
L += wetL * 0.55
R += wetR * 0.55

mix = np.stack([L, R], axis=1)
mix = highpass(mix.T, 28).T  # clean sub rumble
pre_peak = np.max(np.abs(mix))
mix = mix / pre_peak * 0.95          # headroom before the bus stage
mix = np.tanh(mix * 1.1) / np.tanh(1.1)  # very gentle soft-clip, no audible distortion
# final fade: silence exactly at 35.0 s
fade = np.ones(N)
fn = int(1.6 * SR)
fade[-fn:] = np.linspace(1, 0, fn) ** 1.6
mix *= fade[:, None]
mix[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))[:, None]
# level: peak-normalize to -1.5 dBFS, then trim so the integrated loudness lands
# near -14 LUFS (Instagram reference). Verified with ffmpeg ebur128 after rendering.
TRIM_DB = float(sys.argv[2]) if len(sys.argv) > 2 else -1.8
mix *= 10 ** (-1.5 / 20) / np.max(np.abs(mix))
mix *= 10 ** (TRIM_DB / 20)
print(f"pre-bus peak {pre_peak:.2f}, final peak {20*np.log10(np.max(np.abs(mix))):.1f} dBFS")
wavfile.write(sys.argv[1], SR, (mix * 32767).astype(np.int16))
print(f"wrote {sys.argv[1]}: {DUR:.2f}s, {SR} Hz stereo")
