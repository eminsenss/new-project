# Art Elektronik — Instagram Reels kampanya videosu

4 kameralı güvenlik sistemi kampanyası (27.000 TL, KDV ve montaj dahil) için 1080×1920, 30 fps, 35 sn dikey reklam videosu.
Tamamı kodla üretilir: **Remotion (React)** görüntü, **Piper TTS** seslendirme, **Python** müzik sentezi, **FFmpeg** ses miksi.

Final çıktı: `../art-elektronik-kampanya-reels.mp4`

## Sahne planı

| # | Süre | Ekran yazısı | Seslendirme |
|---|---|---|---|
| 1 | 0.0–5.6 | İŞ YERİNİZ GÜVENDE Mİ? | İş yeriniz kapandığında, güvenliğinden emin olmak ister misiniz? |
| 2 | 5.6–11.2 | 4 KAMERALI GÜVENLİK SİSTEMİ | Art Elektronik'ten dört kameralı güvenlik sistemi. |
| 3 | 11.2–16.8 | GECE GÖRÜŞÜ → KAYIT CİHAZI VE EKİPMANLAR | Gece görüşü, kayıt sistemi ve gerekli ekipmanlarıyla birlikte. |
| 4 | 16.8–22.4 | MONTAJ + KURULUM DAHİL | Üstelik montajı ve kurulumu da dahil. |
| 5 | 22.4–28.0 | 27.000 TL · KDV DAHİL · MONTAJ VE KURULUM DAHİL | Hepsi, KDV dahil sadece yirmi yedi bin lira. |
| 6 | 28.0–35.0 | Logo · EVİNİZ VE İŞ YERİNİZ İÇİN · HEMEN TEKLİF ALIN · WhatsApp 0531 237 30 40 · ART ELEKTRONİK · DİYARBAKIR · @art.elektronik21 | Detaylı bilgi ve kurulum için hemen Art Elektronik'e ulaşın. |

Zamanlamalar `src/timeline.json` içindedir; hem görüntü hem ses miksi bu dosyayı okur.

## Yeniden üretme

```bash
npm install
# (isteğe bağlı) müziği yeniden sentezle
python3 scripts/make_music.py public/audio/music.wav
# görüntü (sessiz)
npx remotion render src/index.ts ArtElektronikReels out/video-raw.mp4 --muted --codec=h264 --crf=16
# ses miksi + bağlama (-14 LUFS, -1.5 dBTP)
python3 scripts/mix_audio.py out/video-raw.mp4 ../art-elektronik-kampanya-reels.mp4
# önizleme kareleri
node scripts/stills.mjs out/stills 100,260,380,470,560,640,770,1000
```

Studio'da sesli önizleme: `npx remotion studio` → props'ta `withAudio: true`.

Bu bulut ortamında Chromium yolu `REMOTION_CHROME` ortam değişkeniyle verildi; normal bir bilgisayarda gerekmez.

## Güvenli alan

Kritik yazılar y=270…1480 ve x=72…1008 aralığında tutuldu (Reels üst başlık, alt açıklama ve sağ buton alanları dışında).

Lisanslar: `ASSET_LICENSES.md`.
