import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Logo, StudioBackground } from "../components/Overlays";
import { WhatsAppGlyph } from "../components/Products";
import { Eyebrow, RevealLine } from "../components/Text";
import { C, FONT_BODY, FONT_HEAD, easeOut } from "../theme";

// Kullanıcının verdiği numara: 0 531 237 3040 (okunabilirlik için 0531 237 30 40 biçiminde gruplanır)
export const PHONE = "0531 237 30 40";

// SAHNE 6 — 28.0–35.0 sn: logo + teklif çağrısı + iletişim
export const CtaScene: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const logoP = interpolate(f, [4, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const ring = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const wa = interpolate(f, [26, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const foot = interpolate(f, [38, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const breathe = 1 + Math.sin(f / 26) * 0.006;
  const glint = interpolate(f, [110, 150], [-0.3, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <StudioBackground spotY={26} glow="rgba(40,70,230,0.22)" />
      {/* logonun arkasında genişleyen ince halka */}
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 470 - 270,
          width: 540,
          height: 540,
          borderRadius: "50%",
          border: "2px solid rgba(110,135,255,0.35)",
          transform: `scale(${0.8 + ring * 0.35})`,
          opacity: (1 - ring) * 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 195,
          top: 275,
          width: 390,
          opacity: logoP,
          transform: `scale(${(0.92 + 0.08 * logoP) * breathe})`,
          filter: `drop-shadow(0 24px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(60,90,255,${0.25 * logoP}))`,
        }}
      >
        <Logo size={390} />
        {/* logoya hafif ışık geçişi (logo biçimi değişmez) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${glint * 100 - 12}%, rgba(255,255,255,0.22) ${glint * 100}%, rgba(255,255,255,0) ${glint * 100 + 12}%)`,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <div style={{ position: "absolute", top: 715, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Eyebrow delay={16} color="rgba(242,238,231,0.82)" size={36}>
          EVİNİZ VE İŞ YERİNİZ İÇİN
        </Eyebrow>
        <div style={{ marginTop: 18 }}>
          <RevealLine size={96} delay={20}>
            HEMEN TEKLİF ALIN
          </RevealLine>
        </div>
      </div>

      {/* WhatsApp + telefon */}
      <div style={{ position: "absolute", top: 960, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: wa, transform: `translateY(${(1 - wa) * 20}px)` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "24px 44px 24px 34px",
            borderRadius: 999,
            background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
            boxShadow: "inset 0 0 0 2px rgba(37,211,102,0.55), 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(37,211,102,0.12)",
          }}
        >
          <WhatsAppGlyph size={86} color={C.whatsapp} />
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 84, letterSpacing: "-0.01em", color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {PHONE}
          </div>
        </div>
      </div>

      {/* alt bilgi */}
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, textAlign: "center", opacity: foot, transform: `translateY(${(1 - foot) * 14}px)` }}>
        <div style={{ width: 120, height: 3, margin: "0 auto 30px", borderRadius: 2, background: `linear-gradient(90deg, ${C.blue}, ${C.maroon})` }} />
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 50, letterSpacing: "0.08em", color: C.offWhite }}>ART ELEKTRONİK</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 38, letterSpacing: "0.22em", color: "rgba(242,238,231,0.75)", marginTop: 12 }}>DİYARBAKIR</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, color: "#9DB0FF", marginTop: 22 }}>@art.elektronik21</div>
      </div>
    </AbsoluteFill>
  );
};
