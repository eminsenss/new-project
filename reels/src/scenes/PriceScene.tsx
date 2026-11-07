import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { StudioBackground } from "../components/Overlays";
import { Camera, DVR } from "../components/Products";
import { Eyebrow } from "../components/Text";
import { C, FONT_BODY, FONT_HEAD, SAFE, easeInOut, easeOut } from "../theme";

const PriceChars: React.FC<{ text: string; size: number; delay: number; stagger?: number; color?: string }> = ({ text, size, delay, stagger = 2, color = C.offWhite }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", overflow: "hidden", paddingBottom: size * 0.06 }}>
      {text.split("").map((ch, i) => {
        const p = interpolate(f, [delay + i * stagger, delay + i * stagger + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: size,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color,
              fontVariantNumeric: "tabular-nums",
              transform: `translateY(${(1 - p) * 100}%)`,
              opacity: p,
              filter: `blur(${(1 - p) * 6}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// SAHNE 5 — 22.4–28.0 sn: fiyat. En az 4 sn rahat okunur.
export const PriceScene: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const flash = interpolate(f, [0, 4, 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(f, [0, duration], [1.0, 1.03], { easing: easeInOut });
  const prodIn = interpolate(f, [0, 30], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const sweep = interpolate(f, [36, 66], [-0.3, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut });
  const chip = interpolate(f, [22, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const line2 = interpolate(f, [30, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const exit = interpolate(f, [duration - 10, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <StudioBackground spotY={66} glow="rgba(40,70,220,0.16)" />
      {/* fiyat vuruşunda yumuşak ışık */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 30%, rgba(90,120,255,0.28), rgba(0,0,0,0) 70%)", opacity: flash }} />

      {/* ürün yerleşimi: 4 kamera + kayıt cihazı */}
      <AbsoluteFill style={{ transform: `scale(${drift}) translateY(${(1 - prodIn) * 40}px)`, transformOrigin: "50% 75%", opacity: prodIn * exit }}>
        {/* zemin yansıması */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1250, height: 400, background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0) 70%)" }} />
        <Camera x={275} y={890} width={340} delay={2} floatPhase={0} />
        <Camera x={765} y={890} width={340} delay={6} floatPhase={30} />
        <Camera x={275} y={1060} width={340} delay={10} floatPhase={60} />
        <Camera x={765} y={1060} width={340} delay={14} floatPhase={90} />
        <div style={{ position: "absolute", left: 255, top: 1225, perspective: 1800 }}>
          <div style={{ position: "absolute", left: 30, top: 140, width: 540, height: 70, borderRadius: "50%", background: "rgba(0,0,0,0.85)", filter: "blur(26px)" }} />
          <DVR width={540} />
        </div>
      </AbsoluteFill>

      {/* fiyat bloğu */}
      <div style={{ position: "absolute", left: SAFE.left + 8, top: 300, opacity: exit }}>
        <Eyebrow delay={4}>TOPLAM FİYAT</Eyebrow>
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 22, marginTop: 14 }}>
          <PriceChars text="27.000" size={214} delay={8} />
          <div style={{ marginBottom: 24 }}>
            <PriceChars text="TL" size={112} delay={20} color="#8FA2FF" />
          </div>
          {/* parıltı süpürmesi */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 100 - 10}%, rgba(255,255,255,0.35) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 10}%)`,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: chip, transform: `translateY(${(1 - chip) * 16}px)` }}>
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "0.02em",
              color: "#fff",
              background: `linear-gradient(180deg, ${C.maroon}, ${C.maroonDeep})`,
              padding: "10px 24px 12px",
              borderRadius: 14,
              boxShadow: "0 12px 30px rgba(138,22,22,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            KDV DAHİL
          </span>
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: "0.04em",
            color: C.offWhite,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 14}px)`,
          }}
        >
          MONTAJ VE KURULUM DAHİL
        </div>
      </div>
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", fontFamily: FONT_BODY, fontSize: 22, fontWeight: 500, color: "rgba(242,238,231,0.45)", letterSpacing: "0.04em", opacity: line2 * exit }}>
        Görseller temsilidir.
      </div>
    </AbsoluteFill>
  );
};
