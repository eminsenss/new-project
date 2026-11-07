import React from "react";
import { Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { easeOut } from "../theme";

export const CAMERA_ASPECT = 1248 / 610;

/**
 * Yüklenen gerçek kamera ürün fotoğrafı (arka planı temizlenmiş, oranı/yazısı değiştirilmemiş).
 * Ayna çevirme YAPILMAZ: üzerindeki marka yazısı olduğu gibi korunur.
 */
export const Camera: React.FC<{
  x: number; // merkez
  y: number; // merkez
  width: number;
  delay?: number;
  floatPhase?: number;
  rotate?: number;
  brightness?: number;
  shadow?: boolean;
}> = ({ x, y, width, delay = 0, floatPhase = 0, rotate = 0, brightness = 0.94, shadow = true }) => {
  const f = useCurrentFrame();
  const h = width / CAMERA_ASPECT;
  const p = interpolate(f, [delay, delay + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const float = Math.sin((f + floatPhase) / 38) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - h / 2,
        width,
        height: h,
        opacity: p,
        transform: `translate(${(1 - p) * -26}px, ${(1 - p) * 34 + float}px) scale(${0.965 + 0.035 * p}) rotate(${rotate}deg)`,
        filter: `blur(${(1 - p) * 6}px)`,
      }}
    >
      {shadow && (
        <div
          style={{
            position: "absolute",
            left: width * 0.18,
            top: h * 0.86,
            width: width * 0.72,
            height: h * 0.16,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.75)",
            filter: `blur(${Math.round(width * 0.035)}px)`,
            transform: `translateY(${-float * 0.6}px)`,
          }}
        />
      )}
      <Img
        src={staticFile("img/camera.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: `brightness(${brightness}) contrast(1.05) drop-shadow(0 18px 22px rgba(0,0,0,0.45))`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ DVR */
/** Marka içermeyen, temsili 4 kanallı DVR kayıt cihazı (CSS 3D ile çizilir). */
export const DVR: React.FC<{ width?: number; ledBlink?: boolean }> = ({ width = 560, ledBlink = true }) => {
  const f = useCurrentFrame();
  const W = width;
  const D = width * 0.74;
  const H = width * 0.13;
  const hddOn = ledBlink ? (Math.floor(f / 4) % 5 !== 0 ? 1 : 0.35) : 1;
  const face: React.CSSProperties = { position: "absolute", backfaceVisibility: "hidden" };
  return (
    <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d", transform: "rotateX(-26deg) rotateY(-24deg)" }}>
      {/* üst yüz */}
      <div
        style={{
          ...face,
          width: W,
          height: D,
          top: (H - D) / 2,
          transform: `rotateX(90deg) translateZ(${H / 2}px)`,
          borderRadius: 6,
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, rgba(0,0,0,0) 1px 3px), linear-gradient(200deg, #42464E 0%, #24272C 42%, #15171A 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* havalandırma yarıkları */}
        <div style={{ position: "absolute", left: W * 0.12, right: W * 0.12, top: D * 0.12, height: D * 0.16, display: "grid", gridTemplateColumns: "repeat(22, 1fr)", gap: W * 0.012 }}>
          {Array.from({ length: 44 }).map((_, i) => (
            <div key={i} style={{ background: "#0B0C0E", borderRadius: 3, boxShadow: "inset 0 1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)" }} />
          ))}
        </div>
        {/* ışık yansıması */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)" }} />
      </div>
      {/* ön yüz */}
      <div
        style={{
          ...face,
          width: W,
          height: H,
          transform: `translateZ(${D / 2}px)`,
          borderRadius: 5,
          background: "linear-gradient(180deg, #34383F 0%, #16181B 16%, #0C0D0F 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          padding: `0 ${W * 0.05}px`,
          boxSizing: "border-box",
          gap: W * 0.03,
        }}
      >
        {[
          { c: "#3D6BFF", o: 1, l: "PWR" },
          { c: "#45E08A", o: hddOn, l: "HDD" },
          { c: "#45E08A", o: 0.9, l: "NET" },
        ].map((led) => (
          <div key={led.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: H * 0.12, height: H * 0.12, borderRadius: "50%", background: led.c, opacity: led.o, boxShadow: `0 0 ${H * 0.18}px ${led.c}` }} />
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: H * 0.13, color: "rgba(255,255,255,0.38)", letterSpacing: "0.08em", fontWeight: 600 }}>{led.l}</div>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        {/* USB yuvası */}
        <div style={{ width: W * 0.045, height: H * 0.17, borderRadius: 2, background: "#050506", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }} />
      </div>
      {/* sağ yan yüz */}
      <div
        style={{
          ...face,
          width: D,
          height: H,
          left: (W - D) / 2,
          transform: `rotateY(90deg) translateZ(${W / 2}px)`,
          borderRadius: 5,
          background: "linear-gradient(180deg, #24272C 0%, #101113 30%, #08090A 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      />
      {/* sol yan yüz (görünmez ama kenar için) */}
      <div style={{ ...face, width: D, height: H, left: (W - D) / 2, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, background: "#0D0E10" }} />
    </div>
  );
};

/* ------------------------------------------------------------------ HDD */
/** Marka içermeyen, temsili 3.5" 500 GB harddisk. */
export const HDD: React.FC<{ width?: number }> = ({ width = 260 }) => {
  const W = width;
  const L = width * 1.45;
  const T = width * 0.1;
  const face: React.CSSProperties = { position: "absolute", backfaceVisibility: "hidden" };
  const screws = [
    [0.07, 0.05], [0.93, 0.05], [0.07, 0.95], [0.93, 0.95], [0.07, 0.5], [0.93, 0.5],
  ];
  return (
    <div style={{ position: "relative", width: W, height: T, transformStyle: "preserve-3d", transform: "rotateX(-38deg) rotateY(28deg)" }}>
      {/* üst plaka */}
      <div
        style={{
          ...face,
          width: W,
          height: L,
          top: (T - L) / 2,
          transform: `rotateX(90deg) translateZ(${T / 2}px)`,
          borderRadius: 8,
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0.03) 1px 2px), linear-gradient(150deg, #E3E6EA 0%, #A9AEB5 38%, #D3D7DC 58%, #8E949B 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
        }}
      >
        {screws.map(([sx, sy], i) => (
          <div key={i} style={{ position: "absolute", left: sx * W - 7, top: sy * L - 7, width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F4F5F7, #6E737A)", boxShadow: "0 1px 1px rgba(0,0,0,0.4)" }} />
        ))}
        {/* etiket */}
        <div
          style={{
            position: "absolute",
            left: W * 0.14,
            right: W * 0.14,
            top: L * 0.16,
            height: L * 0.5,
            borderRadius: 6,
            background: "linear-gradient(180deg, #F7F6F3, #E9E7E2)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            padding: W * 0.06,
            boxSizing: "border-box",
            fontFamily: "'Inter Tight', sans-serif",
            color: "#1A1C20",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: W * 0.17, letterSpacing: "-0.02em", lineHeight: 1 }}>500 GB</div>
          <div style={{ fontWeight: 600, fontSize: W * 0.06, marginTop: W * 0.025, color: "#555", letterSpacing: "0.05em" }}>3.5" SATA HDD</div>
          {[0.82, 0.64, 0.74, 0.5].map((w, i) => (
            <div key={i} style={{ height: W * 0.018, width: `${w * 100}%`, background: "rgba(0,0,0,0.16)", borderRadius: 2, marginTop: W * 0.035 }} />
          ))}
          <div style={{ marginTop: W * 0.05, height: W * 0.1, width: "70%", background: "repeating-linear-gradient(90deg, #222 0 2px, transparent 2px 4px, #222 4px 5px, transparent 5px 8px, #222 8px 11px, transparent 11px 13px)" }} />
        </div>
      </div>
      {/* ön kenar */}
      <div style={{ ...face, width: W, height: T, transform: `translateZ(${L / 2}px)`, borderRadius: 3, background: "linear-gradient(180deg, #9CA1A8, #50555C)" }} />
      {/* yan kenar */}
      <div style={{ ...face, width: L, height: T, left: (W - L) / 2, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, borderRadius: 3, background: "linear-gradient(180deg, #8A9097, #3F444A)" }} />
      <div style={{ ...face, width: L, height: T, left: (W - L) / 2, transform: `rotateY(90deg) translateZ(${W / 2}px)`, borderRadius: 3, background: "linear-gradient(180deg, #8A9097, #3F444A)" }} />
    </div>
  );
};

/* ------------------------------------------------------------------ Monitör */
const pad2 = (n: number) => String(n).padStart(2, "0");

const FeedTile: React.FC<{ src: string; label: string; startSec: number }> = ({ src, label, startSec }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.floor(startSec + f / fps);
  const time = `22:${pad2(47 + Math.floor(total / 60))}:${pad2(total % 60)}`;
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) saturate(0.92) brightness(0.98)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)" }} />
      <div style={{ position: "absolute", left: 12, top: 10, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 19, color: "#fff", letterSpacing: "0.06em", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>{label}</div>
      <div style={{ position: "absolute", left: 12, bottom: 9, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>{time}</div>
    </div>
  );
};

export const Monitor: React.FC<{ width?: number }> = ({ width = 940 }) => {
  const bezel = 14;
  const screenW = width - bezel * 2;
  const screenH = (screenW * 9) / 16;
  return (
    <div style={{ width, position: "relative" }}>
      <div
        style={{
          width,
          height: screenH + bezel * 2 + 6,
          borderRadius: 18,
          background: "linear-gradient(180deg, #1B1D21, #0A0B0C)",
          boxShadow: "0 50px 90px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.18)",
          padding: bezel,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div style={{ width: screenW, height: screenH, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4, background: "#020203", borderRadius: 4, overflow: "hidden", position: "relative" }}>
          <FeedTile src="video/feed1.mp4" label="KAM 1" startSec={3} />
          <FeedTile src="video/feed2.mp4" label="KAM 2" startSec={3} />
          <FeedTile src="video/feed3.mp4" label="KAM 3" startSec={3} />
          <FeedTile src="video/feed4.mp4" label="KAM 4" startSec={3} />
          {/* ekran parlaması */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 45%)", pointerEvents: "none" }} />
        </div>
      </div>
      {/* ayak */}
      <div style={{ width: 90, height: 120, margin: "0 auto", background: "linear-gradient(90deg, #121316, #2A2D32 50%, #121316)", clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
      <div style={{ width: 360, height: 18, margin: "0 auto", borderRadius: 9, background: "linear-gradient(180deg, #2C2F35, #0E0F11)", boxShadow: "0 18px 30px rgba(0,0,0,0.7)" }} />
    </div>
  );
};

/* ------------------------------------------------------------------ İkon */
export const WhatsAppGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = "#25D366" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="WhatsApp">
    <path
      fill={color}
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  </svg>
);
