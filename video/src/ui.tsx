import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';

export const C = {
  paper: '#f3efe8', paper2: '#e9e3d8', paper3: '#ddd4c5', ink: '#161412', ink2: '#3c3732', muted: '#655e55',
  red: '#ec1b24', night: '#131211', onNight: '#f3efe8', onNight2: 'rgba(243,239,232,.72)',
};
export const SERIF = '"Instrument Serif", serif';
export const SANS = '"Manrope", sans-serif';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.7, 0, 0.2, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

/** 0→1 progress between start and start+dur (clamped, eased). */
export const prog = (f: number, start: number, dur: number, easing = easeOut) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- fonts (self-hosted, OFL) ---------- */
const FACES: [string, string, string, string][] = [
  ['Instrument Serif', 'normal', '400', 'instrument-serif-latin-400-normal.woff2'],
  ['Instrument Serif', 'normal', '400', 'instrument-serif-latin-ext-400-normal.woff2'],
  ['Instrument Serif', 'italic', '400', 'instrument-serif-latin-400-italic.woff2'],
  ['Instrument Serif', 'italic', '400', 'instrument-serif-latin-ext-400-italic.woff2'],
  ['Manrope', 'normal', '200 800', 'manrope-latin-wght-normal.woff2'],
  ['Manrope', 'normal', '200 800', 'manrope-latin-ext-wght-normal.woff2'],
];
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2C60-2C7F, U+A720-A7FF';
let fontsPromise: Promise<unknown> | null = null;
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    fontsPromise = fontsPromise ?? Promise.all(FACES.map(([fam, style, weight, file]) => {
      const ff = new FontFace(fam, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { style, weight, unicodeRange: file.includes('-ext-') ? LATIN_EXT : LATIN });
      return ff.load().then((f) => document.fonts.add(f));
    }));
    fontsPromise.then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
};

/* ---------- primitives ---------- */
export const Paper: React.FC<{ dark?: boolean; children?: React.ReactNode }> = ({ dark, children }) => (
  <AbsoluteFill style={{ background: dark ? `radial-gradient(120% 80% at 50% 55%, #1f1d1a 0%, ${C.night} 60%)` : `radial-gradient(130% 90% at 50% 45%, #f7f4ee 0%, ${C.paper} 55%, #ece6dc 100%)` }}>
    {children}
  </AbsoluteFill>
);

/** One line of display type revealed from a mask. */
export const Line: React.FC<{ f: number; at: number; size: number; italic?: boolean; color?: string; children: React.ReactNode; font?: string; weight?: number; tracking?: string; dur?: number }> = ({ f, at, size, italic, color = C.ink, children, font = SERIF, weight = 400, tracking = '-0.02em', dur = 26 }) => {
  const p = prog(f, at, dur);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, font: `${italic ? 'italic' : 'normal'} ${weight} ${size}px/1 ${font}`, letterSpacing: tracking, color, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
};

export const Eyebrow: React.FC<{ f: number; at: number; children: React.ReactNode; color?: string }> = ({ f, at, children, color = C.muted }) => {
  const p = prog(f, at, 20);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, font: `600 30px/1 ${SANS}`, letterSpacing: '0.16em', textTransform: 'uppercase', color }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: C.red, boxShadow: '0 0 0 6px rgba(236,27,36,.16)' }} />
      {children}
    </div>
  );
};

export const Chip: React.FC<{ f: number; at: number; children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ f, at, children, dark, style }) => {
  const p = prog(f, at, 18);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '18px 28px', borderRadius: 999, border: `2px solid ${dark ? 'rgba(243,239,232,.22)' : 'rgba(22,20,18,.18)'}`, background: dark ? 'rgba(243,239,232,.04)' : 'rgba(251,249,245,.75)', font: `600 34px/1 ${SANS}`, color: dark ? C.onNight : C.ink, opacity: p, transform: `translateY(${(1 - p) * 26}px)`, whiteSpace: 'nowrap', ...style }}>{children}</div>
  );
};

export type ProductProps = {
  src: string; w: number; ratio: number; x: number; y: number; rot?: number; scale?: number; opacity?: number;
  shadow?: number; z?: number; sheen?: number; dark?: boolean; style?: React.CSSProperties;
};
/** A real product photo (background removed) placed by its centre point, with soft contact shadow. */
export const Product: React.FC<ProductProps> = ({ src, w, ratio, x, y, rot = 0, scale = 1, opacity = 1, shadow = 1, z = 1, sheen = -1, dark, style }) => {
  const h = w * ratio;
  const url = staticFile(`img/${src}`);
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${scale})`, opacity, zIndex: z, ...style }}>
      <Img src={url} style={{ width: '100%', height: '100%', filter: `drop-shadow(0 ${40 * shadow}px ${46 * shadow}px rgba(0,0,0,${dark ? 0.55 : 0.28})) drop-shadow(0 ${8 * shadow}px ${10 * shadow}px rgba(0,0,0,${dark ? 0.35 : 0.16}))` }} />
      {sheen >= 0 && sheen <= 1 ? (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
          WebkitMaskImage: `url(${url})`, WebkitMaskSize: '100% 100%', maskImage: `url(${url})`, maskSize: '100% 100%',
          background: `linear-gradient(115deg, transparent ${mix(-40, 110, sheen) - 14}%, rgba(255,255,255,.34) ${mix(-40, 110, sheen)}%, transparent ${mix(-40, 110, sheen) + 14}%)`,
        }} />
      ) : null}
    </div>
  );
};

/** Notebook-page ruling that draws itself — brand motif from the website hero. */
export const Ruling: React.FC<{ f: number; at?: number; top: number; bottom: number; gap?: number; margin?: number; dark?: boolean }> = ({ f, at = 0, top, bottom, gap = 46, margin = 150, dark }) => {
  const rows = Math.floor((bottom - top) / gap);
  return (
    <AbsoluteFill>
      {Array.from({ length: rows }).map((_, i) => {
        const p = prog(f, at + i * 1.4, 34, easeInOut);
        return <div key={i} style={{ position: 'absolute', left: 0, top: top + i * gap, height: 2, width: `${p * 100}%`, background: dark ? 'rgba(243,239,232,.06)' : 'rgba(22,20,18,.07)' }} />;
      })}
      <div style={{ position: 'absolute', left: margin, top: top - 40, width: 3, height: (bottom - top + 40) * prog(f, at + 6, 40, easeInOut), background: C.red, opacity: 0.85 }} />
    </AbsoluteFill>
  );
};

export const Logo: React.FC<{ width: number; white?: boolean; style?: React.CSSProperties }> = ({ width, white, style }) => (
  <Img src={staticFile(`brand/nur-ajanda-logo${white ? '-white' : ''}.svg`)} style={{ width, height: (width * 49) / 226, ...style }} />
);

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const ox = (f * 137) % 512; const oy = (f * 293) % 512;
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile('img/grain.png')})`, backgroundPosition: `${ox}px ${oy}px`, mixBlendMode: 'overlay', opacity: 0.55, pointerEvents: 'none' }} />;
};

export const Vignette: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,${dark ? 0.35 : 0.08}) 100%)`, pointerEvents: 'none' }} />
);

/** Scene wrapper: opaque background revealed by a mask transition, optional exit drift. */
export const Scene: React.FC<{ f: number; dur: number; reveal: 'up' | 'left' | 'circle' | 'down'; dark?: boolean; children: React.ReactNode; edge?: boolean }> = ({ f, dur, reveal, dark, children, edge = true }) => {
  const p = prog(f, 0, 22, easeInOut);
  let clip = 'none';
  if (reveal === 'up') clip = `inset(${(1 - p) * 100}% 0 0 0)`;
  if (reveal === 'down') clip = `inset(0 0 ${(1 - p) * 100}% 0)`;
  if (reveal === 'left') clip = `inset(0 0 0 ${(1 - p) * 100}%)`;
  if (reveal === 'circle') clip = `circle(${p * 125}% at 50% 58%)`;
  const exit = prog(f, dur - 16, 16, easeIn);
  const push = interpolate(f, [0, dur], [1, 1.035]);
  const edgeStyle: React.CSSProperties | null = edge && p > 0 && p < 1 ? (
    reveal === 'up' ? { left: 0, right: 0, top: `${(1 - p) * 100}%`, height: 8 }
      : reveal === 'down' ? { left: 0, right: 0, top: `calc(${p * 100}% - 8px)`, height: 8 }
        : reveal === 'left' ? { top: 0, bottom: 0, left: `${(1 - p) * 100}%`, width: 8 } : null
  ) : null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <Paper dark={dark} />
        <AbsoluteFill style={{ transform: `scale(${push}) translateY(${-exit * 90}px)`, opacity: 1 - exit * 0.35 }}>{children}</AbsoluteFill>
        <Vignette dark={dark} />
      </AbsoluteFill>
      {edgeStyle ? <div style={{ position: 'absolute', background: C.red, ...edgeStyle }} /> : null}
    </AbsoluteFill>
  );
};

export const Swatches: React.FC<{ f: number; at: number; colors: string[]; size?: number }> = ({ f, at, colors, size = 34 }) => (
  <div style={{ display: 'flex', gap: 14 }}>
    {colors.map((c, i) => {
      const p = prog(f, at + i * 3, 14);
      return <span key={c} style={{ width: size, height: size, borderRadius: size, background: c, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.12)', transform: `scale(${p})` }} />;
    })}
  </div>
);
