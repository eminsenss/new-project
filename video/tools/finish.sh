#!/usr/bin/env bash
# Final delivery encode: Remotion master → broadcast-safe yuv420p (TV range, BT.709),
# exact 35.000 s, +faststart for instant playback on Instagram / web.
set -euo pipefail
in="${1:-out/master-remotion.mp4}"; out="${2:-out/nur-ajanda-reels-35s.mp4}"
ffmpeg -hide_banner -loglevel error -y -i "$in" -t 35 \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 -g 60 -bf 2 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames -of compact "$out"
