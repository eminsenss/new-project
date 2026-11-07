"""Art Elektronik Reels — özgün müzik altlığı (kodla sentezlenir, telif riski yoktur).

85.714 BPM -> 1 vuruş = 0.7 sn, 1 ölçü = 2.8 sn.
Sahne geçişleri ölçü başlarına denk gelir: 5.6 / 11.2 / 16.8 / 22.4 / 28.0 sn.
Kullanım: python3 make_music.py <çıktı.wav>
"""
import sys
import numpy as np
from scipy import signal

SR = 48000
DUR = 35.0
BEAT = 0.7
BAR = 4 * BEAT
N = int(SR * (DUR + 3.0))  # reverb kuyruğu için pay
rng = np.random.default_rng(21)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t_arr(n):
    return np.arange(n) / SR


def env_adsr(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain
    na, nr = int(a * SR), int(r * SR)
    na = min(na, n)
    e[:na] = np.linspace(0, sustain, na) ** 1.5
    if nr > 0 and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def polyblep_saw(freq, n, phase0=0.0):
    t = t_arr(n)
    dt = freq / SR
    ph = (phase0 + freq * t) % 1.0
    y = 2 * ph - 1
    # polyBLEP band-limit
    m1 = ph < dt
    x = ph[m1] / dt
    y[m1] -= x + x - x * x - 1
    m2 = ph > 1 - dt
    x = (ph[m2] - 1) / dt
    y[m2] -= x * x + x + x + 1
    return y


def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def place(buf, x, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= buf.shape[1]:
        return
    j = min(buf.shape[1], i + len(x))
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[0, i:j] += x[: j - i] * gain * l
    buf[1, i:j] += x[: j - i] * gain * r


# ---------------------------------------------------------------- akorlar
DM = [50, 53, 57, 64]      # Dm(add9)
BB = [46, 50, 53, 57]      # Bbmaj7
F_ = [53, 57, 60, 67]      # F(add9)
C_ = [48, 52, 55, 62]      # C(add9)
ROOT = {"Dm": 38, "Bb": 34, "F": 41, "C": 36}
CH = {"Dm": DM, "Bb": BB, "F": F_, "C": C_}
# ölçü başına akor (0..12)
PROG = ["Dm", "Bb", "Dm", "Bb", "F", "C", "Dm", "C", "F", "C", "Bb", "F", "F"]

pad = np.zeros((2, N))
pluck = np.zeros((2, N))
bass = np.zeros((2, N))
drums = np.zeros((2, N))
fx = np.zeros((2, N))

# ---------------------------------------------------------------- pad
for bi, name in enumerate(PROG):
    start = bi * BAR - (0.6 if bi > 0 else 0)
    length = BAR + 1.6
    if bi == len(PROG) - 1:
        length = DUR - start + 2.5
    n = int(length * SR)
    chord = np.zeros(n)
    for k, m in enumerate(CH[name]):
        for det, pan_amt in ((-7, -1), (0, 0), (7, 1)):
            f = midi(m) * 2 ** (det / 1200)
            chord += polyblep_saw(f, n, rng.random()) * (0.5 if det == 0 else 0.35)
    # yavaş açılan filtre: girişte koyu, fiyatta daha parlak
    bright = 900 + (1300 if 8 <= bi <= 9 else 500 if bi >= 10 else 0)
    chord = lp(chord, bright, 2)
    chord = lp(chord, bright * 1.6, 1)
    e = env_adsr(n, 1.1 if bi > 0 else 2.6, 1.4)
    chord *= e
    level = 0.055 if bi < 2 else 0.06
    if bi >= 8:
        level = 0.07
    place(pad, chord, max(0, start), level, -0.25)
    place(pad, np.roll(chord, 240), max(0, start), level, 0.25)

# alçak drone (giriş gerilimi)
n = int(6.5 * SR)
dr = np.sin(2 * np.pi * midi(26) * t_arr(n)) + 0.4 * np.sin(2 * np.pi * midi(38) * t_arr(n))
dr *= env_adsr(n, 2.0, 1.8) * 0.12
place(pad, dr, 0.0, 1.0)

# ---------------------------------------------------------------- arpej (pluck)
def pluck_note(m, dur=0.42, bright=1.0):
    n = int(dur * SR)
    t = t_arr(n)
    f = midi(m)
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.2 * np.exp(-t * 18) * bright
    y = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 7.5)
    y += 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 12)
    y *= np.minimum(1, t / 0.004)
    return y

PATTERN = [0, 2, 1, 3, 2, 1, 3, 2]
for bi in range(2, 12):
    notes = [m + 12 for m in CH[PROG[bi]]]
    step = BEAT / 2
    if 8 <= bi <= 9:
        step = BEAT / 4  # fiyat bölümünde daha canlı
    count = int(BAR / step)
    for s in range(count):
        m = notes[PATTERN[s % len(PATTERN)]]
        vel = 0.85 if s % 2 == 0 else 0.6
        g = 0.05 * vel * (0.5 if step < BEAT / 2 else 1.0)  # fiyat bölümünde seslendirmeye yer aç
        if bi >= 10:
            g *= max(0.0, 1 - (bi - 10 + s / count) / 2.2)
        pan = -0.35 if s % 2 == 0 else 0.35
        place(pluck, pluck_note(m), bi * BAR + s * step, g, pan)

# dotted-8th gecikme (stereo)
d = int(BEAT * 0.75 * SR)
pl = pluck.copy()
for rep in range(1, 5):
    g = 0.38 ** rep
    sh = d * rep
    pluck[0, sh:] += lp(pl[1 if rep % 2 else 0, :-sh], 3500) * g
    pluck[1, sh:] += lp(pl[0 if rep % 2 else 1, :-sh], 3500) * g

# ---------------------------------------------------------------- bas
for bi in range(2, 12):
    f = midi(ROOT[PROG[bi]])
    for s in range(8):
        n = int(BEAT / 2 * SR)
        t = t_arr(n)
        y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
        y = np.tanh(1.6 * y)
        e = np.minimum(1, t / 0.06) * np.exp(-t * 2.5)
        g = 0.11
        if bi >= 10:
            g *= max(0.0, 1 - (bi - 10 + s / 8) / 2.0)
        place(bass, lp(y * e, 420), bi * BAR + s * BEAT / 2, g)

# ---------------------------------------------------------------- davul
def kick():
    n = int(0.6 * SR)
    t = t_arr(n)
    f = 42 + 85 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t * 5.5)
    y[: int(0.003 * SR)] += rng.normal(0, 0.3, int(0.003 * SR))
    return lp(y, 2500)


def hat(decay=40):
    n = int(0.12 * SR)
    t = t_arr(n)
    return hp(rng.normal(0, 1, n), 7000, 2) * np.exp(-t * decay)


def tick():
    n = int(0.05 * SR)
    t = t_arr(n)
    return bp(rng.normal(0, 1, n), 2500, 6000) * np.exp(-t * 120)


K = kick()
for bi in range(2, 10):
    beats = [0, 2] if bi < 8 else [0, 1, 2, 3]
    for b in beats:
        place(drums, K, bi * BAR + b * BEAT, 0.32)
    for e8 in range(8):
        if e8 % 2 == 1:
            place(drums, hat(), bi * BAR + e8 * BEAT / 2, 0.035, 0.3)
# girişte saat tıkı (gerilim) — çok kısık
for b in range(2, 8):
    place(drums, tick(), b * BEAT, 0.05, -0.2)
# CTA bölümünde tek yumuşak kick
place(drums, K, 10 * BAR, 0.25)

# ---------------------------------------------------------------- efektler
def whoosh(dur=0.9, lo=300, hi=5000, rev=False):
    n = int(dur * SR)
    t = t_arr(n)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    blocks = 24
    for k in range(blocks):
        a, b = k * n // blocks, (k + 1) * n // blocks
        fr = lo * (hi / lo) ** (k / blocks)
        out[a:b] = bp(x, max(60, fr * 0.7), min(SR / 2 - 100, fr * 1.4))[a:b]
    e = np.sin(np.pi * t / dur) ** 2
    out *= e
    return out[::-1] if rev else out


for tcut in (5.6, 11.2, 16.8):
    place(fx, whoosh(0.8), tcut - 0.55, 0.05, -0.3)
    place(fx, whoosh(0.8), tcut - 0.53, 0.05, 0.3)

# riser (ölçü 7) -> fiyat vuruşu
n = int(BAR * SR)
t = t_arr(n)
rs = whoosh(BAR, 250, 9000) * (t / BAR) ** 2.2 * 2.2
place(fx, rs, 7 * BAR, 0.11, -0.2)
place(fx, np.roll(rs, 300), 7 * BAR, 0.11, 0.2)

# fiyat vuruşu (22.4 sn)
n = int(2.6 * SR)
t = t_arr(n)
f = 34 + 40 * np.exp(-t * 6)
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
boom += lp(rng.normal(0, 1, n), 900) * np.exp(-t * 7) * 0.35
place(fx, boom, 8 * BAR, 0.42)

# CTA geçişi için yumuşak ters swell
place(fx, whoosh(1.2, 400, 6000), 10 * BAR - 1.1, 0.045)

# ---------------------------------------------------------------- reverb
def make_ir(rt60=2.4, length=3.0):
    n = int(length * SR)
    t = t_arr(n)
    decay = np.exp(-6.9 * t / rt60)
    irl = lp(rng.normal(0, 1, n), 6000) * decay
    irr = lp(rng.normal(0, 1, n), 6000) * decay
    pre = int(0.02 * SR)
    irl = np.concatenate([np.zeros(pre), irl])
    irr = np.concatenate([np.zeros(pre), irr])
    return irl / np.sqrt(np.sum(irl**2)), irr / np.sqrt(np.sum(irr**2))


irl, irr = make_ir()
send = pad * 0.35 + pluck * 0.6 + fx * 0.25 + drums * 0.08
wet = np.stack([
    signal.fftconvolve(send[0], irl)[:N],
    signal.fftconvolve(send[1], irr)[:N],
])
mix = pad + pluck + bass + drums + fx + wet * 0.55

# ---------------------------------------------------------------- master
mix = hp(mix, 30, 2)
# yumuşak "glue": hafif doygunluk + son fade
peak = np.max(np.abs(mix))
mix = mix / peak * 0.85
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
n_out = int(DUR * SR)
mix = mix[:, :n_out]
fade = int(1.6 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade) ** 1.6
fi = int(0.03 * SR)
mix[:, :fi] *= np.linspace(0, 1, fi)
mix = mix / np.max(np.abs(mix)) * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
import wave
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print("yazıldı:", out, f"{n_out / SR:.2f} sn")
