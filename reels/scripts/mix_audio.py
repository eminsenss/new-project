"""FFmpeg ile final ses miksi ve videoya bağlama.

- Seslendirme cümleleri src/timeline.json'daki zamanlara yerleştirilir.
- Müzik, seslendirme konuşurken sidechain kompresörle otomatik kısılır (ducking).
- İki geçişli loudnorm: -14 LUFS entegre, -1.5 dBTP (Instagram/Reels için uygun).

Kullanım: python3 scripts/mix_audio.py out/video-raw.mp4 out/art-elektronik-kampanya-reels.mp4
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src/timeline.json").read_text(encoding="utf-8"))
DUR = TL["durationInFrames"] / TL["fps"]
PUB = ROOT / "public"
video_in, video_out = sys.argv[1], sys.argv[2]
mix_wav = ROOT / "out/mix_premaster.wav"
final_wav = ROOT / "out/mix_final.wav"

MUSIC_GAIN_DB = -6.5   # müziğin genel seviyesi (seslendirmesiz bölümler)
VO_GAIN_DB = 0.0

VO_TARGET_LUFS = -17.0  # her cümle aynı algılanan seviyeye getirilir


def lufs(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = out[out.rindex("Integrated loudness"):]
    return float(tail.split("I:")[1].split("LUFS")[0])


inputs = ["-i", str(PUB / "audio/music.wav")]
chains = []
labels = []
for i, vo in enumerate(TL["voiceover"], start=1):
    inputs += ["-i", str(PUB / vo["file"])]
    ms = int(round(vo["start"] * 1000))
    g = VO_TARGET_LUFS - lufs(PUB / vo["file"])
    chains.append(f"[{i}:a]aresample=48000,volume={g:.2f}dB,pan=stereo|c0=c0|c1=c0,adelay={ms}|{ms}[v{i}]")
    labels.append(f"[v{i}]")

n = len(labels)
graph = ";".join(chains) + ";" + "".join(labels) + (
    f"amix=inputs={n}:normalize=0,apad=whole_dur={DUR},atrim=0:{DUR},volume={VO_GAIN_DB}dB[vo];"
    "[vo]asplit=2[vomix][vokey];"
    f"[0:a]aresample=48000,volume={MUSIC_GAIN_DB}dB[m];"
    "[m][vokey]sidechaincompress=threshold=0.04:ratio=4.5:attack=60:release=650:knee=6:makeup=1[mduck];"
    f"[vomix][mduck]amix=inputs=2:normalize=0,atrim=0:{DUR},afade=t=out:st={DUR - 0.6}:d=0.6[out]"
)
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[out]", "-ar", "48000", "-c:a", "pcm_s24le", str(mix_wav)], check=True)

# loudnorm 1. geçiş (ölçüm)
meas = subprocess.run(
    ["ffmpeg", "-hide_banner", "-i", str(mix_wav), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
    capture_output=True, text=True, check=True,
).stderr
js = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
print("ölçüm:", {k: js[k] for k in ("input_i", "input_tp", "input_lra")})

# loudnorm 2. geçiş (uygulama)
ln = (
    f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
    f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mix_wav), "-af", ln + ",aresample=48000", "-c:a", "pcm_s24le", str(final_wav)], check=True)

# videoya bağla: Instagram uyumlu H.264 High, yuv420p (TV aralığı), BT.709, 30 fps, 2 sn GOP
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", video_in, "-i", str(final_wav), "-map", "0:v:0", "-map", "1:a:0",
     "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p",
     "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-level:v", "4.2",
     "-r", "30", "-g", "60", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
     "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-shortest", "-movflags", "+faststart", video_out],
    check=True,
)
print("yazıldı:", video_out)
