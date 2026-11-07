import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/inter-tight/800.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { ArtReels } from "./ArtReels";
import timeline from "./timeline.json";

// Yazı tiplerinin (Türkçe karakterler dahil) render öncesi yüklenmesini bekle
const fontHandle = delayRender("fonts");
const sample = "İŞĞÜÖÇıışğüöç 0123456789";
Promise.all([
  document.fonts.load(`800 100px "Inter Tight"`, sample),
  document.fonts.load(`700 100px "Inter Tight"`, sample),
  document.fonts.load(`600 100px "Inter Tight"`, sample),
  document.fonts.load(`500 40px "Inter"`, sample),
  document.fonts.load(`600 40px "Inter"`, sample),
  document.fonts.load(`700 40px "Inter"`, sample),
])
  .then(() => document.fonts.ready)
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ArtElektronikReels"
      component={ArtReels}
      durationInFrames={timeline.durationInFrames}
      fps={timeline.fps}
      width={1080}
      height={1920}
      defaultProps={{ withAudio: false }}
    />
  </>
);
