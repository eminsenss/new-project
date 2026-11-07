import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AccentRule, RevealLine } from "../components/Text";
import { SAFE, easeInOut } from "../theme";

// SAHNE 1 — 0–5.6 sn: akşam, kapanmış dükkânlar. Yavaş, kontrollü yatay kaydırma.
export const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, duration], [0, 1], { easing: easeInOut });
  const imgH = 1920 * 1.1;
  const imgW = imgH * (3600 / 2397);
  const x = interpolate(t, [0, 1], [-120, -640]);
  const scale = interpolate(t, [0, 1], [1.0, 1.06]);
  // ilk kare siyah olmasın (Reels kapak karesi): görüntü %55 parlaklıkla başlar
  const fadeIn = interpolate(f, [0, 10], [0.55, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(f, [duration - 12, duration], [1, 0.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", opacity: fadeIn }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("img/street.jpg")}
          style={{
            position: "absolute",
            height: imgH,
            width: imgW,
            top: -90,
            left: 0,
            transform: `translateX(${x}px) scale(${scale})`,
            transformOrigin: "40% 50%",
            filter: "brightness(0.66) contrast(1.12) saturate(0.78)",
          }}
        />
      </AbsoluteFill>
      {/* soğuk gece tonlaması */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,18,40,0.35) 0%, rgba(8,18,40,0.15) 45%, rgba(4,6,10,0.9) 78%, rgba(3,4,6,0.97) 100%)" }} />
      <AbsoluteFill style={{ background: "rgba(20,40,90,0.18)", mixBlendMode: "color" }} />

      <div style={{ position: "absolute", left: SAFE.left + 8, top: 1060, opacity: exit }}>
        <RevealLine size={140} delay={10}>İŞ YERİNİZ</RevealLine>
        <RevealLine size={140} delay={16}>GÜVENDE Mİ?</RevealLine>
        <div style={{ marginTop: 34 }}>
          <AccentRule delay={28} width={210} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
