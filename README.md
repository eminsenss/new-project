# Nur Ajanda — Premium Anasayfa Konsepti + 35 sn Reels Reklam Filmi

Potansiyel müşteri sunumu için hazırlanmış **bağımsız bir tasarım demosu**. Canlı nurajanda.com sitesine, alan adına veya sunucusuna hiçbir şekilde dokunulmamıştır.

| Çıktı | Konum |
|---|---|
| 1. Çalışan anasayfa demosu | `site/` (statik — herhangi bir sunucuda çalışır) |
| 2. Mobil + masaüstü ekran görüntüleri | `docs/screenshots/` (yeni) · `docs/analysis/` (mevcut site) |
| 3. 35 sn MP4 reklam filmi | `video/out/nur-ajanda-reels-35s.mp4` (+ kapak: `video/out/poster-cover.jpg`) |
| 4. Kaynak dosyalar | `src/` (sayfa şablonu + doğrulanmış veri), `site/assets/`, `video/src/`, `tools/` |
| 5. Görsel kaynak listesi | `docs/IMAGE-SOURCES.md` |
| 6. Test ve uygulama özeti | `docs/TEST-REPORT.md` · Lighthouse raporları `docs/lighthouse/` |
| Mevcut site analizi | `docs/analysis/ANALYSIS.md` |
| Reklam filmi sahne planı | `docs/REELS-STORYBOARD.md` |

## Hızlı başlangıç

```bash
npm install            # yalnızca görsel/font derlemesi için (sharp, @fontsource)
npm run serve          # → http://localhost:4173
```
`site/` klasörü derlenmiş haldedir; Node olmadan da açılabilir: `cd site && python3 -m http.server 4173`.

### Paylaşılabilir demo bağlantısı
Bu ortamda barındırma (hosting) erişimi olmadığından herkese açık bağlantı oluşturulmadı. `site/` klasörü olduğu gibi şu servislerden birine sürükle-bırak ile yüklenebilir: Netlify Drop, Cloudflare Pages, Vercel veya GitHub Pages (Settings → Pages → `site/` klasörü). Sayfa `noindex` olduğu ve `robots.txt` tüm taramayı engellediği için arama motorlarına düşmez.

> Görseller ve marka varlıkları Nur Ajanda'ya aittir; kamuya açık ticari yayından önce kullanım izni yazılı olarak teyit edilmelidir (bkz. `docs/IMAGE-SOURCES.md`).

## Sonuçlar (özet)

- **E2E testler:** 81/81 PASS — 360/390/430/768/1024/1440 px, teklif akışı, arama, filtreler, menüler, reduced-motion.
- **Lighthouse (yerel):** Mobil 97 / 100 / 100 · Masaüstü 100 / 100 / 100 (Performans / Erişilebilirlik / En İyi Uygulamalar). SEO 66 yalnızca bilinçli `noindex` nedeniyle; noindex kaldırılmış kopyada SEO 100.
- **Video:** 1080×1920, 30 fps, 1050 kare = tam 35,000 sn, H.264 High yuv420p + AAC, −14 LUFS, özgün müzik.

## Yeniden derleme

```bash
npm run build:images                     # assets-src → site/assets/img (AVIF + WebP, artımlı)
node tools/build-html.mjs                # src/page.mjs + src/data.mjs → site/index.html
NODE_PATH=$(npm root -g) node tools/test-site.cjs http://localhost:4173/   # E2E testler + ekran görüntüleri
```
Yardımcı araçlar: `tools/trace_logo.py` (logo vektörleştirme), `tools/cutout.py` (beyaz stüdyo fonunu şeffaflaştırma), `tools/image_sources.py` (kaynak listesi).

## Tasarım kararları (özet)

- **Art direction — "ivory kağıt":** Nur Ajanda'nın ürettiği ajanda kağıdından ilham alan sıcak kağıt tonu (#F3EFE8), mürekkep siyahı (#161412) ve logo kırmızısı (#EC1B24) yalnızca aksan olarak. Hero'daki çizgili disk ve kırmızı nokta, ajanda sayfası motifine gönderme.
- **Tipografi:** Instrument Serif (editoryal başlıklar, italik vurgular) + Manrope (arayüz ve metin). Self-host, Türkçe karakter alt kümeleri, metrik uyumlu yedek fontlar (CLS = 0).
- **Gerçek içerik:** Tüm ürünler, fiyatlar (KDV hariç, 8 Kasım 2026), ölçüler, baskı teknikleri, adresler ve kurumsal bilgiler nurajanda.com'dan alındı (`data/nurajanda-snapshot-2026-11-08.json`). Uydurma istatistik, müşteri logosu veya yorum yok.
- **B2B teklif akışı:** Teklif listesi (ekle/çıkar/adet), talep bilgileri formu, referans numaralı talep özeti, kopyala/yazdır. Hiçbir veri gönderilmez; arayüzde açıkça "demo" olarak belirtilir.
- **Mobil öncelikli:** Başparmak bölgesinde sabit alt eylem çubuğu (Kategoriler · Ara · Teklif · WhatsApp), yatay kaydırmalı ürün rayı, ≥ 44 px dokunma hedefleri.
- **Teknoloji:** Framework'süz statik HTML/CSS/JS (JS ≈ 10 KB, CSS ≈ 11 KB, HTML ≈ 16 KB — gzip), üçüncü taraf CDN bağımlılığı yok, AVIF/WebP + `srcset`, lazy-load, `<dialog>` tabanlı erişilebilir modallar.

## Klasör yapısı

```
site/                  Yayınlanabilir demo (index.html, assets/, robots.txt)
src/                   Sayfa şablonu (page.mjs) ve doğrulanmış içerik (data.mjs)
assets-src/            Kaynak görseller: originals (nurajanda.com JPG), cutouts, thumbs, brand
data/                  nurajanda.com veri anlık görüntüsü + görsel manifesti
tools/                 Derleme, test, logo/görsel işleme betikleri
video/                 Remotion projesi, özgün müzik üreticisi, render çıktısı
docs/                  Analiz, ekran görüntüleri, test raporu, görsel kaynakları, storyboard
```
