# Test ve Uygulama Özeti

Tarih: 8 Kasım 2026 · Ortam: Linux bulut konteyneri, Chromium 1243 (Playwright), yerel statik sunucu (`tools/serve.mjs`, gzip açık)

## 1. Web sitesi — otomatik uçtan uca testler

Komut: `NODE_PATH=$(npm root -g) node tools/test-site.cjs http://localhost:4173/` · Ham sonuç: `docs/test-results.json`

**Sonuç: 81 / 81 PASS**

| Grup | Kontroller | Sonuç |
|---|---|---|
| Yerleşim — 360, 390, 430, 768, 1024, 1440 px | Yatay taşma yok · kırık görsel yok · tek H1 · 12 px altı metin yok · dokunma hedefleri ≥ 40 px · konsol/ağ hatası yok (6 genişlik × 6 kontrol) | 36/36 |
| Ürün filtreleri | "Organizer" filtresi yalnızca 3 organizer kartını gösterir | ✅ (mobil + masaüstü) |
| Teklif listesi | Karttan ekleme, rozet sayacı, bildirim, çekmece açılışı, adet girişi → ara toplam (250 × 670 + 1 × 208 = ₺167.708,00), + butonu, listeden çıkarma, tarayıcıda kalıcılık | ✅ (mobil + masaüstü) |
| Talep formu | Boş gönderimde 4 erişilebilir hata mesajı · geçerli verilerle `DEMO-YYAAGG-XXXX` referanslı özet · "hiçbir yere gönderilmedi" uyarısı | ✅ |
| Arama | `/` kısayolu / alt çubuk ile açılır · "organizer" → 12 ürün + kategori · Türkçe karakter duyarsız ("kucuksu" → Küçüksu) · aramadan teklife ekleme · ESC ile kapanma | ✅ |
| Baskı tekniği sekmeleri | Tıklama ve klavye (ok tuşları) ile panel değişimi, ARIA tablist | ✅ |
| Menüler | Mobil menü aç/kapa + akordeon · masaüstü mega menü aç / ESC ile kapa | ✅ |
| Hareket tercihi | `prefers-reduced-motion: reduce` → kayan bant durur, hiçbir içerik gizli kalmaz | ✅ |

Ekran görüntüleri: `docs/screenshots/` — her genişlik için ilk ekran (`*-fold`) ve tam sayfa (`*-full`), ayrıca teklif listesi, talep özeti, arama, mobil menü, mega menü ve bildirim durumları.

### Manuel görsel kontroller ve yapılan düzeltmeler
Geliştirme sırasında ekran görüntüleriyle tespit edilip düzeltilen hatalar:
- Baskı tekniği panellerinin hepsi aynı anda görünüyordu (`display:grid`, `hidden` niteliğini eziyordu) → `[hidden]{display:none}`.
- Koleksiyon görselleri kutuyu doldurmuyordu; bazı fotoğraflarda beyaz şerit vardı → `picture{height:100%}` + kaynak fotoğraflar kırpıldı.
- Ürün kartında görsel taşması → `object-fit: contain` ile sabit oranlı alan.
- Mobil hero'da ürün kompozisyonu ilk ekranın altında kalıyordu → mobilde sıralama: başlık → ürün sahnesi → açıklama.
- Aramada vurgulanan kelime kategori satırının düzenini bozuyordu; 360 px'de çok büyük tutarlarda teklif satırı taşıyordu → düzeltildi, yeniden doğrulandı.
- Kaydırma ipucu 26 px'di (dokunma hedefi testi) → 44 × 54 px.

## 2. Lighthouse (12.x, yerel sunucu)

Raporlar: `docs/lighthouse/lighthouse-mobile.html`, `docs/lighthouse/lighthouse-desktop.html`

| | Performans | Erişilebilirlik | En İyi Uygulamalar | SEO |
|---|---|---|---|---|
| Mobil (simüle yavaş 4G + 4× CPU) | **97** | **100** | **100** | 66* |
| Masaüstü | **100** | **100** | **100** | 66* |
| Üretim kopyası (noindex kaldırılmış) | — | — | — | **100** |

| Metrik | Mobil | Masaüstü |
|---|---|---|
| First Contentful Paint | 1,4 sn | 0,4 sn |
| Largest Contentful Paint | 2,3 sn | 0,5 sn |
| Total Blocking Time | 100 ms | 0 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 1,5 sn | 0,5 sn |

\* SEO 66'nın tek nedeni `is-crawlable` denetimidir: demo, talimat gereği `noindex, nofollow` meta etiketi ve `robots.txt` (`Disallow: /`) ile arama motorlarına kapatılmıştır. Aynı sayfa noindex kaldırılıp canonical eklendiğinde SEO skoru 100'dür (`docs/lighthouse/seo-production-copy.json`).

> Ölçümler yerel sunucuda alınmıştır; gerçek barındırma ortamında sunucu yanıt süresi ve ağ gecikmesine göre değerler değişir. Karşılaştırma için mevcut nurajanda.com'da ölçülen TTFB 3–5 sn, FCP 3,6–6 sn'dir (bkz. `docs/analysis/ANALYSIS.md`).

## 3. SEO uygulaması
- Tek H1 ("Kurumsal ajandada markanızın imzası"), bölüm başına H2, kart/başlık başına H3.
- `<title>`: "Kurumsal Ajanda, Defter ve Promosyon Ürünleri Üreticisi | Nur Ajanda" · meta description (155 karakter) · `lang="tr"`.
- Open Graph + Twitter Card, 1200×630 OG görseli (`site/assets/og/og-image.jpg`, gerçek ürünlerle).
- JSON-LD: `Organization` (iletişim, adres, sosyal), `Store` (showroom), `WebSite` + `SearchAction` (gerçek arama URL'si), `ItemList` → 12 `Product` + `Offer` (TRY, KDV hariç birim fiyat, gerçek ürün görseli URL'leri).
- Anlamlı `alt` metinleri (ürün adı + renk + öne çıkan özellik); kategori bağlantıları nurajanda.com'un mevcut temiz URL'lerine gider.
- Anahtar ifadeler doğal kullanıldı: kurumsal ajanda, özel baskılı defter (meta), organizer, kurumsal hediyelik setler, promosyon ürünleri.
- Demo koruması: `meta robots noindex`, `X-Robots-Tag` (yerel sunucu), `robots.txt Disallow: /`. Canlıya alınırken bu üçü kaldırılıp canonical eklenmelidir (HTML'de not olarak belirtildi).

## 4. Performans uygulaması
- Framework yok; HTML 16 KB, CSS 11 KB, JS 10 KB (gzip). Üçüncü taraf script/CDN yok.
- Self-host fontlar, Türkçe alt kümeleri, kritik fontlar `preload`, metrik uyumlu yedek fontlar (CLS 0).
- Görseller AVIF + WebP, `srcset/sizes`, `width/height`, hero görseli `fetchpriority="high"` + preload, diğerleri lazy-load.
- Arama dizini (112 ürün) yalnızca arama ilk açıldığında yüklenir.

## 5. Erişilebilirlik
- Atlama bağlantısı, görünür odak halkası, `<dialog>` tabanlı modallar (odak tuzağı + ESC), ARIA tablist, `aria-live` bildirimler, form hata mesajları `aria-describedby` ile bağlı.
- Metin kontrastı WCAG AA (ikincil metin #655E55 / zemin #F3EFE8 = 5,58:1; koyu zeminde ikincil metin 10,4:1).
- `prefers-reduced-motion` desteği; hiçbir içerik yalnızca animasyona bağlı değil.

## 6. Reklam filmi doğrulaması

| Kontrol | Sonuç |
|---|---|
| Çözünürlük / oran | 1080 × 1920 · 9:16 ✅ |
| Kare hızı / kare sayısı | 30 fps · 1050 kare (ffprobe `-count_frames` ile sayıldı) ✅ |
| Süre | Video 35,000 sn · ses 35,000 sn · konteyner 35,000 sn ✅ |
| Codec | H.264 High @ L4.2, yuv420p (TV aralığı, BT.709), `+faststart` · AAC-LC 48 kHz stereo 256 kb/s ✅ |
| Bütünlük | `ffmpeg -v error -f null` tam çözme: hata yok ✅ |
| Ses seviyesi | −14,0 LUFS entegre, tepe −3,3 dBFS ✅ |
| İlk saniyede hareket | 0,0 sn ile 0,2 sn kareleri arasında ortalama piksel farkı 24,8 (ürün düşüşü + çizgi animasyonu) ✅ |
| Müzik–kurgu senkronu | 5/11/17/23/29 sn kesmelerinin her birinden önce yüksek bant swell'i −46 dB → −27 dB'ye yükseliyor; 0 sn'de açılış vuruşu; son 0,2 sn −61,6 dB (temiz bitiş) ✅ |
| CTA okunurluğu | "Teklif listenizi oluşturun" (44 px kalın, kırmızı zemin) + "nurajanda.com" (82 px) 31–35 sn arası sabit; tüm yazılar Reels arayüz güvenli alanı içinde ✅ |
| Görsel kontrol | 18 karelik kontakt sayfası incelendi; organizer sahnesindeki solan etiket çakışması düzeltilip yeniden render edildi ✅ |

Kapak önerisi: `video/out/poster-cover.jpg` (3. saniye), kapanış karesi: `video/out/poster-cta.jpg`.

## 7. Bilinen sınırlamalar
- Herkese açık demo bağlantısı oluşturulamadı (bu ortamda barındırma hesabı yok). `site/` klasörü Netlify Drop / Cloudflare Pages / Vercel / GitHub Pages'e doğrudan yüklenebilir.
- Seslendirme eklenmedi (doğal Türkçe TTS aracı yok); önerilen seslendirme metni `docs/REELS-STORYBOARD.md` içinde.
- Fiyatlar 8 Kasım 2026 anlık görüntüsüdür; canlı stok bilgisi demo kapsamında değildir.
- Kategori ve ürün bağlantıları mevcut nurajanda.com sayfalarına yönlenir (demo yalnızca anasayfadır).
- Görsel kullanım izinleri kamuya açık ticari yayından önce Nur Ajanda ile teyit edilmelidir.
