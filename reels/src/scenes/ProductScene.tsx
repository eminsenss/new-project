import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { StudioBackground } from "../components/Overlays";
import { Camera } from "../components/Products";
import { AccentRule, RevealLine } from "../components/Text";
import { C, SAFE, easeInOut } from "../theme";

// SAHNE 2 — 5.6–11.2 sn: dört kamera sırayla kadraja gelir.
export const ProductScene: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, duration], [1.0, 1.035], { easing: easeInOut });
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const exitAt = duration - 12;
  const sweep = interpolate(f, [70, 120], [-0.4, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut });

  const cams = [
    { x: 300, y: 760, d: 14 },
    { x: 765, y: 900, d: 23 },
    { x: 300, y: 1100, d: 32 },
    { x: 765, y: 1240, d: 41 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <StudioBackground spotY={58} />
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: "50% 60%" }}>
        {cams.map((c, i) => (
          <Camera key={i} x={c.x} y={c.y} width={440} delay={c.d} floatPhase={i * 23} />
        ))}
        {/* tek seferlik yumuşak ışık süpürmesi */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 100 - 12}%, rgba(255,255,255,0.07) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 12}%)`,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: SAFE.left + 8, top: 300 }}>
        <RevealLine size={150} delay={12} exitAt={exitAt}>
          <span style={{ color: "#5D7BFF" }}>4</span> KAMERALI
        </RevealLine>
        <RevealLine size={98} delay={18} exitAt={exitAt} color={C.offWhite}>
          GÜVENLİK SİSTEMİ
        </RevealLine>
        <div style={{ marginTop: 28 }}>
          <AccentRule delay={30} width={190} exitAt={exitAt} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
