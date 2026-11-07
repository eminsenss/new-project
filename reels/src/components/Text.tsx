import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_HEAD, easeOut, easeIn } from "../theme";

/** Satır satır maske içinden yukarı kayarak açılan başlık. */
export const RevealLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  exitAt?: number; // sahne içi kare; bu karede çıkış başlar
  size: number;
  weight?: number;
  color?: string;
  tracking?: string;
  font?: string;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, exitAt, size, weight = 800, color = C.offWhite, tracking = "-0.025em", font = FONT_HEAD, lineHeight = 1.02, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn });
  return (
    <div style={{ overflow: "hidden", paddingBottom: size * 0.08, marginBottom: -size * 0.08 }}>
      <div
        style={{
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight,
          letterSpacing: tracking,
          color,
          whiteSpace: "nowrap",
          transform: `translateY(${(1 - p) * 105 + out * -18}%)`,
          opacity: Math.min(1, p * 1.4) * (1 - out),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Başlık altında soldan sağa açılan ince vurgu çizgisi (logo mavi -> bordo). */
export const AccentRule: React.FC<{ delay?: number; width?: number; exitAt?: number; align?: "left" | "center" }> = ({ delay = 0, width = 180, exitAt, align = "left" }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: width * p,
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${C.blue}, #4F6BFF 55%, ${C.maroon})`,
        opacity: 1 - out,
        margin: align === "center" ? "0 auto" : undefined,
        boxShadow: `0 0 18px ${C.blueGlow}`,
      }}
    />
  );
};

/** Küçük, harf aralıklı üst etiket. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; color?: string; size?: number; exitAt?: number }> = ({ children, delay = 0, color = "#8FA2FF", size = 34, exitAt }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.28em",
        color,
        opacity: p * (1 - out),
        transform: `translateY(${(1 - p) * 14}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};
