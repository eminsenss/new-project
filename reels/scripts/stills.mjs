// Önizleme kareleri: node scripts/stills.mjs <çıktı-klasörü> <kare1,kare2,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, framesArg] = process.argv.slice(2);
const frames = framesArg.split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME || null;
const composition = await selectComposition({ serveUrl, id: "ArtElektronikReels", browserExecutable });
for (const frame of frames) {
  const output = path.join(outDir, `frame_${String(frame).padStart(4, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 90, browserExecutable });
  console.log("ok", output);
}
