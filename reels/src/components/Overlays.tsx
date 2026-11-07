import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";

/** Hafif film greni — her karede rastgele kaydırılan döşeme doku. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${f}`) * 512);
  const y = Math.floor(random(`gy${f}`) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("img/grain.png")})`,
        backgroundSize: "512px 512px",
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: "overlay",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Stüdyo arka planı: antrasit zemin, üstten yumuşak spot ışık. */
export const StudioBackground: React.FC<{ spotY?: number; glow?: string; children?: React.ReactNode }> = ({ spotY = 52, glow = "rgba(40,70,220,0.10)", children }) => (
  <AbsoluteFill style={{ background: "#0A0B0D" }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 45% at 50% ${spotY}%, #2A2D33 0%, #17191D 45%, #0A0B0D 100%)`,
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 30% at 50% ${spotY + 8}%, ${glow}, rgba(0,0,0,0) 70%)` }} />
    {children}
  </AbsoluteFill>
);

export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("img/logo.png")} style={{ width: size, height: "auto", display: "block", ...style }} />
);
