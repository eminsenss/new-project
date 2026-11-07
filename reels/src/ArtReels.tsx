import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Grain, Vignette } from "./components/Overlays";
import { CtaScene } from "./scenes/CtaScene";
import { Hook } from "./scenes/Hook";
import { InstallScene } from "./scenes/InstallScene";
import { PriceScene } from "./scenes/PriceScene";
import { ProductScene } from "./scenes/ProductScene";
import { SystemScene } from "./scenes/SystemScene";
import timeline from "./timeline.json";

const XF = 10; // sahneler arası yumuşak geçiş (kare)

export const ArtReels: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const { fps } = useVideoConfig();
  const s = timeline.scenes;
  const seq = (from: number, to: number, first = false) => ({
    from: first ? from : from - XF,
    durationInFrames: first ? to - from : to - from + XF,
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence {...seq(s.hook.from, s.hook.to, true)} name="1 Kanca">
        <Hook duration={s.hook.to - s.hook.from} />
      </Sequence>
      <Sequence {...seq(s.product.from, s.product.to)} name="2 Ürün">
        <ProductScene duration={s.product.to - s.product.from + XF} />
      </Sequence>
      <Sequence {...seq(s.system.from, s.system.to)} name="3 Sistem">
        <SystemScene duration={s.system.to - s.system.from + XF} split={s.system.split - s.system.from + XF} />
      </Sequence>
      <Sequence {...seq(s.install.from, s.install.to)} name="4 Kurulum">
        <InstallScene duration={s.install.to - s.install.from + XF} split={s.install.split - s.install.from + XF} />
      </Sequence>
      <Sequence {...seq(s.price.from, s.price.to)} name="5 Fiyat">
        <PriceScene duration={s.price.to - s.price.from + XF} />
      </Sequence>
      <Sequence {...seq(s.cta.from, s.cta.to)} name="6 CTA">
        <CtaScene duration={s.cta.to - s.cta.from + XF} />
      </Sequence>

      <Vignette strength={0.5} />
      <Grain opacity={0.06} />

      {/* Önizleme (Studio) için ses; final miks FFmpeg ile yapılır (scripts/mix_audio.sh) */}
      {withAudio && (
        <>
          <Audio src={staticFile("audio/music.wav")} volume={0.35} />
          {timeline.voiceover.map((v) => (
            <Sequence key={v.file} from={Math.round(v.start * fps)}>
              <Audio src={staticFile(v.file)} />
            </Sequence>
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};
