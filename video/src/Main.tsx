import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, SANS, SERIF, Chip, Eyebrow, Grain, Line, Logo, Paper, Product, Ruling, Scene, Swatches, easeIn, easeInOut, easeOut, mix, prog, useFonts } from './ui';

export const FPS = 30;
export const DURATION = 35 * FPS; // exactly 1050 frames

// scene starts (frames) — locked to the music (cuts at 5, 11, 17, 23, 29 s)
const S = { hook: 0, notes: 150, org: 330, custom: 510, gifts: 690, outro: 870 };
const SCENE_LEN = 195;

const R = {
  bostanci: ['15015-1-bostanci-dikisli-siyah.webp', 1000 / 719],
  didim: ['13212-1-didim-kirmizi.webp', 1000 / 800],
  pen: ['14145-2-0510-640-lacivert.webp', 1000 / 262],
  ortakoy: ['14051-1-ortakoy-lacivert.webp', 1000 / 682],
  maslak: ['16298-1-maslak-fume.webp', 1000 / 716],
  maslakIc: ['16298-2-maslak-ic.webp', 565 / 992],
  burgaz: ['15897-1-burgaz-taba.webp', 1000 / 598],
  trabzon: ['17547-1-trabzon-lacivert.webp', 1000 / 725],
  pens420: ['7367-1-0505-420-kutu.webp', 925 / 1000],
  abant: ['16901-1-abant-konsept.webp', 934 / 828],
  hilal: ['17173-1-hilal-0071-siyah-v2.webp', 580 / 1000],
} as const;
const img = (k: keyof typeof R) => ({ src: R[k][0], ratio: R[k][1] });

/* ===================== 0–5 s · HOOK ===================== */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sA = spring({ frame: f, fps, config: { damping: 17, mass: 1.1 } });
  const sB = spring({ frame: f - 14, fps, config: { damping: 16 } });
  const sC = spring({ frame: f - 26, fps, config: { damping: 15 } });
  const disc = prog(f, 0, 34);
  const drift = interpolate(f, [30, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = prog(f, 148, 18, easeIn);
  return (
    <AbsoluteFill>
      <Paper />
      <Ruling f={f} top={920} bottom={1780} margin={118} />
      <AbsoluteFill style={{ transform: `translateY(${-exit * 120}px)` }}>
        <div style={{ position: 'absolute', left: 120, top: 900, width: 920, height: 920, borderRadius: '50%', transform: `scale(${mix(0.82, 1, disc)})`, opacity: disc,
          background: `radial-gradient(circle at 40% 35%, #f8f5ef 0%, ${C.paper2} 60%, ${C.paper3} 100%)` }} />
        <Product {...img('bostanci')} w={590} x={500 + drift * -6} y={mix(1760, 1310, sA) - drift * 24} rot={mix(-22, -7, sA) + drift * 1.6} scale={mix(1.12, 1, sA)} sheen={prog(f, 62, 46, easeInOut)} />
        <Product {...img('didim')} w={460} x={mix(1400, 790, sB) + drift * 8} y={1470 - drift * 30} rot={mix(26, 6, sB) - drift * 1.2} z={2} />
        <Product {...img('pen')} w={104} x={mix(60, 205, sC)} y={mix(1960, 1500, sC) - drift * 40} rot={mix(-48, -16, sC)} z={3} />
        <div style={{ position: 'absolute', left: 90, top: 170, opacity: prog(f, 2, 20), transform: `translateY(${(1 - prog(f, 2, 20)) * -20}px)` }}><Logo width={340} /></div>
        <div style={{ position: 'absolute', left: 86, top: 300, zIndex: 10 }}>
          <Line f={f} at={6} size={172}>Markanız</Line>
          <Line f={f} at={15} size={172} italic>yıl boyu</Line>
          <Line f={f} at={24} size={172} italic>masada<span style={{ color: C.red, fontStyle: 'normal' }}>.</span></Line>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ===================== 5–11 s · AJANDA & DEFTER ===================== */
const Notebooks: React.FC = () => {
  const f = useCurrentFrame();
  const photoIn = prog(f, 22, 30, easeInOut);
  const swap = prog(f, 98, 26, easeInOut);
  const zoom = interpolate(f, [22, 130], [1.0, 1.14], { extrapolateRight: 'clamp' });
  const ortIn = prog(f, 104, 30);
  return (
    <Scene f={f} dur={SCENE_LEN} reveal="up">
      <div style={{ position: 'absolute', left: 90, top: 250 }}><Eyebrow f={f} at={10}>01 — Ajanda &amp; Defter</Eyebrow></div>
      <div style={{ position: 'absolute', left: 86, top: 320 }}>
        <Line f={f} at={18} size={126}>Tarihli ajandalar,</Line>
        <Line f={f} at={26} size={126} italic>tarihsiz defterler.</Line>
      </div>
      {/* phase A — real lifestyle photo, slow push-in */}
      <div style={{ position: 'absolute', left: 80, top: 640, width: 920, height: 610, borderRadius: 28, overflow: 'hidden', clipPath: `inset(${(1 - photoIn) * 100}% 0 0 0 round 28px)`, transform: `translateX(${-swap * 1100}px)`, boxShadow: '0 50px 80px -50px rgba(22,20,18,.5)' }}>
        <Img src={staticFile('img/17782-3-atasehir-konsept-crop.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '50% 60%' }} />
      </div>
      <div style={{ position: 'absolute', left: 90, top: 1300, display: 'flex', alignItems: 'center', gap: 26, opacity: prog(f, 46, 18) * (1 - swap), transform: `translateX(${-swap * 600}px)` }}>
        <span style={{ font: `600 38px/1.2 ${SANS}`, color: C.ink }}>Ataşehir-FM · 6 renk</span>
        <Swatches f={f} at={52} colors={['#57585c', '#c7262c', '#24427f', '#1b1b1b', '#b5703a', '#3c7a4c']} />
      </div>
      {/* phase B — Ortaköy-L with verified specs */}
      <Product {...img('ortakoy')} w={450} x={mix(1500, 330, ortIn)} y={1000} rot={mix(10, -4, ortIn)} scale={interpolate(f, [104, 195], [1, 1.05], { extrapolateLeft: 'clamp' })} />
      <div style={{ position: 'absolute', left: 600, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
        <Chip f={f} at={122}>15 × 21 cm</Chip>
        <Chip f={f} at={128}>224 sayfa</Chip>
        <Chip f={f} at={134}>70 gr ivory kağıt</Chip>
        <Chip f={f} at={140}>Kart ve telefon bölmesi</Chip>
        <Chip f={f} at={146} style={{ background: C.ink, color: C.paper, borderColor: C.ink }}>Gofre · UV baskı</Chip>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 1390, opacity: prog(f, 128, 20), font: `700 42px/1.2 ${SANS}`, color: C.ink }}>Ortaköy-L Tarihsiz Defter</div>
    </Scene>
  );
};

/* ===================== 11–17 s · ORGANIZER ===================== */
const Organizers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inA = spring({ frame: f - 16, fps, config: { damping: 18 } });
  const open = prog(f, 62, 30, easeInOut);
  const phaseB = prog(f, 120, 28, easeInOut);
  const sB1 = spring({ frame: f - 124, fps, config: { damping: 17 } });
  const sB2 = spring({ frame: f - 134, fps, config: { damping: 17 } });
  return (
    <Scene f={f} dur={SCENE_LEN} reveal="left">
      <div style={{ position: 'absolute', left: 90, top: 250 }}><Eyebrow f={f} at={14}>02 — Organizer</Eyebrow></div>
      <div style={{ position: 'absolute', left: 86, top: 320 }}>
        <Line f={f} at={18} size={126}>Organizer ve</Line>
        <Line f={f} at={26} size={126} italic>kılıflı defterler.</Line>
      </div>
      <AbsoluteFill style={{ transform: `translateY(${-phaseB * 40}px) scale(${mix(1, 0.72, phaseB)})`, transformOrigin: '50% 40%' }}>
        {/* interior revealed as the cover opens */}
        <div style={{ position: 'absolute', left: 90, top: 740, width: 900, height: 900 * R.maslakIc[1], opacity: open, transform: `scale(${mix(0.88, 1, open)})`, clipPath: `inset(0 ${(1 - open) * 50}% 0 0)` }}>
          <Img src={staticFile(`img/${R.maslakIc[0]}`)} style={{ width: '100%', filter: 'drop-shadow(0 40px 46px rgba(0,0,0,.26))' }} />
        </div>
        <div style={{ position: 'absolute', left: 540 - 270, top: mix(1700, 640, inA), width: 540, height: 540 * R.maslak[1], transformOrigin: '0% 50%', transform: `perspective(2200px) rotateY(${-open * 82}deg)`, opacity: 1 - prog(f, 80, 12) }}>
          <Img src={staticFile(`img/${R.maslak[0]}`)} style={{ width: '100%', filter: 'drop-shadow(0 40px 46px rgba(0,0,0,.28))' }} />
        </div>
        <div style={{ position: 'absolute', left: 90, top: 1400, display: 'flex', gap: 16, flexWrap: 'wrap', width: 900, opacity: 1 - prog(f, 116, 8) }}>
          <Chip f={f} at={84}>Metal toka</Chip>
          <Chip f={f} at={90}>Hesap makinesi</Chip>
          <Chip f={f} at={96}>352 sayfa</Chip>
        </div>
        <div style={{ position: 'absolute', left: 90, top: 1316, opacity: prog(f, 80, 18) * (1 - prog(f, 116, 8)), font: `700 42px/1.2 ${SANS}`, color: C.ink }}>Maslak-FM Organizer Ajanda</div>
      </AbsoluteFill>
      {/* phase B — more options */}
      <Product {...img('burgaz')} w={250} x={mix(-300, 290, sB1)} y={1190} rot={mix(-20, -5, sB1)} z={3} />
      <Product {...img('trabzon')} w={300} x={mix(1400, 770, sB2)} y={1180} rot={mix(20, 5, sB2)} z={3} />
      <div style={{ position: 'absolute', left: 90, top: 1440, width: 900, display: 'flex', justifyContent: 'space-between', opacity: prog(f, 146, 18), zIndex: 10 }}>
        <div><div style={{ font: `700 36px/1.2 ${SANS}`, color: C.ink }}>Burgaz-TB</div><div style={{ font: `500 30px/1.3 ${SANS}`, color: C.muted }}>Kılıflı defter</div></div>
        <div style={{ textAlign: 'right' }}><div style={{ font: `700 36px/1.2 ${SANS}`, color: C.ink }}>Trabzon-L</div><div style={{ font: `500 30px/1.3 ${SANS}`, color: C.muted }}>Organizer ajanda</div></div>
      </div>
    </Scene>
  );
};

/* ===================== 17–23 s · KİŞİSELLEŞTİRME ===================== */
const TECH = ['Gofre', 'UV baskı', 'Lazer', 'Serigrafi', 'Ofset baskı'];
const Custom: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sP = spring({ frame: f - 18, fps, config: { damping: 20 } });
  return (
    <Scene f={f} dur={SCENE_LEN} reveal="circle" dark edge={false}>
      <div style={{ position: 'absolute', left: 90, top: 250 }}><Eyebrow f={f} at={14} color={C.onNight2}>03 — Kişiselleştirme</Eyebrow></div>
      <div style={{ position: 'absolute', left: 86, top: 320 }}>
        <Line f={f} at={16} size={120} color={C.onNight}>Logonuz,</Line>
        <Line f={f} at={23} size={120} color={C.onNight}>ürünün kendisi</Line>
        <Line f={f} at={30} size={120} color={C.onNight} italic>kadar özenle.</Line>
      </div>
      <div style={{ position: 'absolute', left: 360, top: 760, width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(243,239,232,.16), rgba(243,239,232,.03) 70%, transparent)', opacity: sP }} />
      <Product {...img('bostanci')} w={520} x={mix(1300, 735, sP)} y={1120} rot={mix(12, -4, sP)} dark sheen={prog(f, 70, 50, easeInOut)} scale={interpolate(f, [18, 195], [1, 1.06])} />
      <div style={{ position: 'absolute', left: 90, top: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {TECH.map((t, i) => {
          const p = prog(f, 48 + i * 14, 20);
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
              <span style={{ font: `600 26px/1 ${SANS}`, color: C.red, letterSpacing: '.1em' }}>0{i + 1}</span>
              <span style={{ font: `italic 400 76px/1 ${SERIF}`, color: C.onNight }}>{t}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 90, top: 1440, width: 900, opacity: prog(f, 128, 22), transform: `translateY(${(1 - prog(f, 128, 22)) * 20}px)` }}>
        <div style={{ height: 2, background: 'rgba(243,239,232,.18)', marginBottom: 26 }} />
        <div style={{ font: `600 36px/1.3 ${SANS}`, color: C.onNight }}>Tasarımdan ciltlemeye tek çatı altında.</div>
        <div style={{ marginTop: 10, font: `500 32px/1.3 ${SANS}`, color: C.onNight2 }}>32 yıllık tecrübe · 3.620 m² üretim tesisi</div>
      </div>
    </Scene>
  );
};

/* ===================== 23–29 s · KALEM · MASA · HEDİYELİK ===================== */
const Gifts: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - 16, fps, config: { damping: 18 } });
  const b = spring({ frame: f - 34, fps, config: { damping: 17 } });
  const c = spring({ frame: f - 50, fps, config: { damping: 17 } });
  const t = interpolate(f, [60, 195], [0, 1], { extrapolateLeft: 'clamp' });
  const label = (at: number) => ({ opacity: prog(f, at, 18), transform: `translateY(${(1 - prog(f, at, 18)) * 14}px)` });
  const tag: React.CSSProperties = { position: 'absolute', zIndex: 10, padding: '14px 22px', borderRadius: 999, background: 'rgba(251,249,245,.92)', border: '2px solid rgba(22,20,18,.12)', font: `650 30px/1 ${SANS}`, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 20px 40px -24px rgba(22,20,18,.5)' };
  return (
    <Scene f={f} dur={SCENE_LEN} reveal="up">
      <div style={{ position: 'absolute', left: 90, top: 250 }}><Eyebrow f={f} at={14}>04 — Kurumsal hediye</Eyebrow></div>
      <div style={{ position: 'absolute', left: 86, top: 320 }}>
        <Line f={f} at={18} size={118}>Kalem, masa ve</Line>
        <Line f={f} at={26} size={118} italic>hediyelik setler.</Line>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 700, width: 820, height: 820, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, #f8f5ef 0%, ${C.paper2} 60%, ${C.paper3} 100%)`, transform: `scale(${mix(0.85, 1, a)})`, opacity: a }} />
      <Product {...img('abant')} w={600} x={mix(560, 590, t)} y={mix(1600, 1020, a) - t * 20} rot={-3} scale={mix(0.9, 1, a)} />
      <Product {...img('pens420')} w={420} x={mix(-400, 280, b) - t * 14} y={1300 - t * 34} rot={mix(-22, -7, b)} z={2} />
      <Product {...img('hilal')} w={470} x={mix(1500, 800, c) + t * 14} y={1370 - t * 44} rot={mix(18, 4, c)} z={3} />
      <div style={{ ...tag, left: 600, top: 700, ...label(64) }}>Abant Hediyelik Set</div>
      <div style={{ ...tag, left: 90, top: 1490 - 40, ...label(76) }}>0505-420 Kalem Seti</div>
      <div style={{ ...tag, left: 560, top: 1530 - 40, ...label(88) }}>Hilal-S Masa Seti</div>
    </Scene>
  );
};

/* ===================== 29–35 s · KAPANIŞ ===================== */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 12, 30);
  const cta = prog(f, 54, 22);
  const url = prog(f, 64, 24);
  const underline = prog(f, 80, 26, easeInOut);
  return (
    <Scene f={f} dur={10000} reveal="down">
      <Ruling f={f} at={4} top={1100} bottom={1760} margin={118} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', opacity: logo, transform: `scale(${mix(0.92, 1, logo)})`, filter: `blur(${(1 - logo) * 10}px)` }}>
        <Logo width={820} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Line f={f} at={30} size={84}>Kurumsal ajandada</Line>
        <Line f={f} at={38} size={84} italic>markanızın imzası<span style={{ color: C.red, fontStyle: 'normal' }}>.</span></Line>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1140, textAlign: 'center', opacity: prog(f, 46, 20), font: `500 34px/1.3 ${SANS}`, color: C.muted }}>32 yıllık tecrübe · İstanbul’da üretim</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <div style={{ padding: '26px 52px', borderRadius: 999, background: C.red, color: '#fff', font: `700 44px/1 ${SANS}`, opacity: cta, transform: `scale(${mix(0.9, 1, cta)})`, boxShadow: '0 30px 60px -30px rgba(208,26,42,.7)' }}>Teklif listenizi oluşturun</div>
        <div style={{ position: 'relative', opacity: url, transform: `translateY(${(1 - url) * 24}px)`, font: `800 82px/1 ${SANS}`, letterSpacing: '-0.02em', color: C.ink }}>
          nurajanda.com
          <div style={{ position: 'absolute', left: 0, bottom: -16, height: 6, width: `${underline * 100}%`, background: C.ink, borderRadius: 3 }} />
        </div>
      </div>
    </Scene>
  );
};

export const Main: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Sequence from={S.hook} durationInFrames={170} name="0–5 s Hook"><Hook /></Sequence>
      <Sequence from={S.notes} durationInFrames={SCENE_LEN} name="5–11 s Ajanda & Defter"><Notebooks /></Sequence>
      <Sequence from={S.org} durationInFrames={SCENE_LEN} name="11–17 s Organizer"><Organizers /></Sequence>
      <Sequence from={S.custom} durationInFrames={SCENE_LEN} name="17–23 s Kişiselleştirme"><Custom /></Sequence>
      <Sequence from={S.gifts} durationInFrames={SCENE_LEN} name="23–29 s Hediyelik"><Gifts /></Sequence>
      <Sequence from={S.outro} durationInFrames={DURATION - S.outro} name="29–35 s Kapanış"><Outro /></Sequence>
      <Grain />
      <Audio src={staticFile('audio/nur-ajanda-score.wav')} />
    </AbsoluteFill>
  );
};
