"""Writes docs/IMAGE-SOURCES.md: every product photo used in the site and the video,
with its original URL on nurajanda.com and the product page it was taken from."""
import json, re, os, glob

snap = json.load(open('data/nurajanda-snapshot-2026-11-08.json'))
img2page = {}
for d in snap['details']:
    for p in d['imgs']:
        img2page[p.split('/')[-1]] = (f"https://nurajanda.com/image/{p}.jpg", d['url'], d['name'])

html = open('site/index.html', encoding='utf-8').read()
site_used = sorted(set(re.findall(r'assets/img/[cp]/([^"\s]+?)-\d+\.(?:webp|avif)', html)))
video_used = sorted(os.path.splitext(os.path.basename(f))[0] for f in glob.glob('video/public/img/*') if 'grain' not in f)

def edit_note(name):
    notes = []
    if os.path.exists(f'assets-src/cutouts/{name}.webp'):
        notes.append('beyaz stüdyo fonu şeffaflaştırıldı (ürün piksel değişmedi)')
    if name.endswith('-crop'):
        notes.append('üst/alt beyaz boşluk kırpıldı')
    return '; '.join(notes) or 'değişiklik yok (yalnızca yeniden boyutlandırma/sıkıştırma)'

rows = []
for name in sorted(set(site_used) | set(video_used)):
    base = name[:-5] if name.endswith('-crop') else name
    src = img2page.get(base)
    where = ' + '.join(w for w, used in (('Site', name in site_used), ('Video', name in video_used)) if used)
    if src:
        rows.append(f"| `{name}` | {where} | [{src[2]}]({src[1]}) | {src[0]} | {edit_note(name)} |")
    else:
        rows.append(f"| `{name}` | {where} | — | (kategori/listeleme görseli) | {edit_note(name)} |")

thumbs = len(glob.glob('site/assets/img/t/*.webp'))
out = f"""# Görsel Kaynakları

Bu demodaki **tüm ürün görselleri** nurajanda.com'dan alınmıştır (erişim: {snap['retrieved']}). Hiçbir ürün görseli yapay zekâ ile üretilmemiş, ürünlerin rengi, yazısı veya formu değiştirilmemiştir. Yapılan işlemler: yeniden boyutlandırma, AVIF/WebP sıkıştırma, beyaz stüdyo fonunun şeffaflaştırılması (yalnızca kenara bağlı beyaz alan) ve fotoğraf kenarındaki beyaz boşlukların kırpılması.

> ⚠️ **Kullanım izni:** Bu çalışma, potansiyel müşteriye (Nur Ajanda) sunulacak bir tasarım demosudur. Görseller ve marka varlıkları Nur Ajanda'ya ve/veya ürün tedarikçilerine aittir. Demo kamuya açık ticari bir yayına dönüştürülmeden önce görsel kullanım haklarının Nur Ajanda ile yazılı olarak teyit edilmesi gerekir.

## Marka

| Varlık | Kaynak | İşlem |
|---|---|---|
| Logo (`site/assets/brand/nur-ajanda-logo.svg`, `-white.svg`, favicon) | https://nurajanda.com/image/catalog/logo/site-logo-1.png (226×49 px) | `tools/trace_logo.py` ile birebir vektörleştirildi (potrace, orijinal renkler: #EC1B24 / siyah). Beyaz versiyon koyu zeminler içindir. |

## Ürün görselleri

| Dosya | Kullanım | Ürün sayfası | Orijinal görsel | İşlem |
|---|---|---|---|---|
{chr(10).join(rows)}

## Arama dizini küçük görselleri

`site/assets/img/t/` altındaki {thumbs} küçük görsel, nurajanda.com kategori listelerindeki 300×300 ürün görsellerinden (`/image/cache/catalog/tedarikci/etkin/urunler/...-300x300.webp`) 160×160 px'e küçültülmüştür. Ürün adı/fiyat/URL eşleşmeleri `data/nurajanda-snapshot-2026-11-08.json` dosyasındadır.

## Fontlar ve müzik

| Varlık | Lisans |
|---|---|
| Instrument Serif (Instrument) | SIL Open Font License 1.1 — @fontsource/instrument-serif |
| Manrope (Mikhail Sharanda) | SIL Open Font License 1.1 — @fontsource-variable/manrope |
| Reklam müziği `video/public/audio/nur-ajanda-score.wav` | Bu proje için `video/tools/make_music.py` ile sıfırdan sentezlendi; örnek (sample), loop veya üçüncü taraf kayıt içermez. |
| Film greni dokusu `video/public/img/grain.png` | Rastgele gürültüden üretildi. |
"""
os.makedirs('docs', exist_ok=True)
open('docs/IMAGE-SOURCES.md', 'w', encoding='utf-8').write(out)
print(len(rows), 'rows')
