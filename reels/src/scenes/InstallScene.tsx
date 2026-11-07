import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { RevealLine } from "../components/Text";
import { C, FONT_HEAD, SAFE, easeOut } from "../theme";

const Clip: React.FC<{ src: string; duration: number; fadeIn: number; from: number; to: number }> = ({ src, duration, fadeIn, from, to }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" });
  const s = interpolate(f, [0, duration], [from, to]);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ width: 1080, height: 1920, transform: `scale(${s})`, filter: "contrast(1.08) saturate(0.82) brightness(0.92)" }}
      />
    </AbsoluteFill>
  );
};

// SAHNE 4 — 16.8–22.4 sn: montaj (matkap) + kurulum (bağlantı) gerçek stok görüntü
export const InstallScene: React.FC<{ duration: number; split: number }> = ({ duration, split }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const pill = interpolate(f, [26, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const exitAt = duration - 10;
  const out = interpolate(f, [exitAt, exitAt + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", opacity: fadeIn }}>
      <Sequence durationInFrames={split + 8}>
        <Clip src="video/install1.mp4" duration={split + 8} fadeIn={1} from={1.04} to={1.1} />
      </Sequence>
      <Sequence from={split - 8} durationInFrames={duration - split + 8}>
        <Clip src="video/install2.mp4" duration={duration - split + 8} fadeIn={14} from={1.03} to={1.09} />
      </Sequence>
      {/* tonlama + metin için üst karartma */}
      <AbsoluteFill style={{ background: "rgba(20,40,90,0.14)", mixBlendMode: "color" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,6,8,0.92) 0%, rgba(5,6,8,0.75) 26%, rgba(5,6,8,0.0) 46%, rgba(5,6,8,0) 80%, rgba(5,6,8,0.55) 100%)" }} />

      <div style={{ position: "absolute", left: SAFE.left + 8, top: 300 }}>
        <RevealLine size={92} delay={14} exitAt={exitAt}>
          MONTAJ + KURULUM
        </RevealLine>
        <div style={{ marginTop: 22, opacity: pill * out, transform: `translateY(${(1 - pill) * 18}px)` }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#fff",
              background: C.blue,
              padding: "14px 30px 18px",
              borderRadius: 18,
              boxShadow: "0 16px 40px rgba(30,63,230,0.45)",
            }}
          >
            DAHİL
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
