import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { StudioBackground } from "../components/Overlays";
import { DVR, HDD, Monitor } from "../components/Products";
import { AccentRule, RevealLine } from "../components/Text";
import { C, FONT_BODY, SAFE, easeInOut, easeOut } from "../theme";

const Disclaimer: React.FC<{ text: string; top: number; delay?: number }> = ({ text, top, delay = 20 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [delay, delay + 15], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 500, fontSize: 24, color: C.offWhite, opacity: o, letterSpacing: "0.04em" }}>
      {text}
    </div>
  );
};

// 3a — monitörde dört kamera görüntüsü
const MonitorPart: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const push = interpolate(f, [0, duration + 12], [1.0, 1.06], { easing: easeInOut });
  const rise = interpolate(f, [0, 24], [40, 0], { extrapolateRight: "clamp", easing: easeOut });
  const exitAt = duration - 8;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <StudioBackground spotY={46} glow="rgba(45,90,255,0.22)" />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 640,
            transform: `translateY(${rise}px) scale(${push}) rotateY(-9deg) rotateX(2deg)`,
            transformOrigin: "50% 40%",
          }}
        >
          <Monitor width={940} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.left + 8, top: 300 }}>
        <RevealLine size={140} delay={12} exitAt={exitAt}>
          GECE
        </RevealLine>
        <RevealLine size={140} delay={17} exitAt={exitAt}>
          GÖRÜŞÜ
        </RevealLine>
        <div style={{ marginTop: 26 }}>
          <AccentRule delay={26} width={190} exitAt={exitAt} />
        </div>
      </div>
      <Disclaimer text="Ekrandaki görüntüler temsilidir." top={1330} delay={18} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; x: number; y: number; delay: number; lineTo: { dx: number; dy: number } }> = ({ text, x, y, delay, lineTo }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const len = Math.hypot(lineTo.dx, lineTo.dy);
  const ang = (Math.atan2(lineTo.dy, lineTo.dx) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: len * p, height: 2, background: "rgba(242,238,231,0.55)", transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: lineTo.dx - 7, top: lineTo.dy - 7, width: 14, height: 14, borderRadius: "50%", background: "#5D7BFF", boxShadow: "0 0 14px rgba(93,123,255,0.9)", opacity: p }} />
      <div
        style={{
          position: "absolute",
          left: -6,
          top: -62,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.06em",
          color: C.offWhite,
          whiteSpace: "nowrap",
          opacity: p,
          transform: `translateY(${(1 - p) * 10}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 3b — kayıt cihazı, harddisk ve ekipmanlar
const EquipmentPart: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const dvrIn = interpolate(f, [4, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const hddIn = interpolate(f, [12, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const drift = interpolate(f, [0, duration], [1.0, 1.04], { easing: easeInOut });
  const listIn = interpolate(f, [34, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const exitAt = duration - 8;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <StudioBackground spotY={55} />
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: "50% 60%" }}>
        {/* DVR */}
        <div style={{ position: "absolute", left: 170, top: 820, perspective: 1800, opacity: dvrIn, transform: `translateY(${(1 - dvrIn) * 40}px)` }}>
          <div style={{ position: "absolute", left: 40, top: 150, width: 560, height: 70, borderRadius: "50%", background: "rgba(0,0,0,0.8)", filter: "blur(26px)" }} />
          <DVR width={560} />
        </div>
        {/* HDD */}
        <div style={{ position: "absolute", left: 640, top: 1080, perspective: 1600, opacity: hddIn, transform: `translateY(${(1 - hddIn) * 40}px)` }}>
          <div style={{ position: "absolute", left: -10, top: 120, width: 300, height: 60, borderRadius: "50%", background: "rgba(0,0,0,0.75)", filter: "blur(22px)" }} />
          <HDD width={230} />
        </div>
        <Label text="4 KANAL KAYIT CİHAZI" x={100} y={760} delay={24} lineTo={{ dx: 190, dy: 90 }} />
        <Label text="500 GB HARDDİSK" x={470} y={1345} delay={34} lineTo={{ dx: 260, dy: -120 }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: SAFE.left + 8, top: 300 }}>
        <RevealLine size={112} delay={12} exitAt={exitAt}>
          KAYIT CİHAZI
        </RevealLine>
        <RevealLine size={112} delay={17} exitAt={exitAt}>
          VE EKİPMANLAR
        </RevealLine>
        <div style={{ marginTop: 26 }}>
          <AccentRule delay={26} width={190} exitAt={exitAt} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1405,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: "0.02em",
          color: "rgba(242,238,231,0.78)",
          opacity: listIn,
          transform: `translateY(${(1 - listIn) * 12}px)`,
        }}
      >
        100 m kablo · 5A adaptör · BNC ve bağlantılar
      </div>
    </AbsoluteFill>
  );
};

// SAHNE 3 — 11.2–16.8 sn
export const SystemScene: React.FC<{ duration: number; split: number }> = ({ duration, split }) => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={split} name="3a Monitör">
        <MonitorPart duration={split} />
      </Sequence>
      <Sequence from={split - 10} durationInFrames={duration - split + 10} name="3b Ekipman">
        <EquipmentPart duration={duration - split + 10} />
      </Sequence>
    </AbsoluteFill>
  );
};
