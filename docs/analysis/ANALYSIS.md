# nurajanda.com — Mevcut Anasayfa Analizi

Tarih: 8 Kasım 2026 · Yöntem: HTML kaynağı incelemesi, kategori/ürün sayfası taraması (≈45 sayfa), Playwright ile masaüstü (1440×900) ve mobil (iPhone 13, 390×844) ekran görüntüleri ve tarayıcı performans ölçümleri.

> Not: Ölçümler bulut test ortamından alındı. Bu ortamda üçüncü taraf CDN'ler (cdn.jsdelivr.net, Google Fonts, Bootstrap CDN) ağ politikası nedeniyle engelli olduğundan bazı ikonlar ekran görüntülerinde boş görünüyor. Bu durum gerçek kullanıcıda olmayabilir; yine de sitenin görsel bütünlüğünün **dış CDN'lere bağımlı** olduğunu gösteriyor.

Ekran görüntüleri: `current-desktop-fold.png`, `current-desktop-full.jpg`, `current-mobile-fold.png`, `current-mobile-full.jpg`

---

## 1. Özet

| Alan | Durum | Öncelik |
|---|---|---|
| Marka algısı / görsel kalite | Ürün fotoğrafları kaliteli ama sunum jenerik e-ticaret şablonu gibi; marka hikâyesi en alta gömülü | Yüksek |
| İçerik hiyerarşisi | **H1 yok**; 9 adet H2, aynı tanıtım metni sayfada 3 kez tekrar ediyor | Yüksek |
| Performans | TTFB ≈ 3–5 sn, ≈100 istek, ≈2 MB, 32 script, 12 CSS dosyası, jQuery 2.1.1 + Bootstrap 3 | Yüksek |
| Mobil navigasyon | Yüzen WhatsApp/telefon/kırmızı butonlar içeriğin üstüne biniyor; dokunma alanları küçük | Yüksek |
| Teklif deneyimi | "Teklif listem" var (iyi), fakat adet/not/baskı tercihi gibi B2B bilgileri listeye eklenmeden önce görünmüyor | Orta |
| SEO | Başlık sadece "Nur Ajanda"; meta açıklama mevcut; JSON-LD (Organization, WebSite, SearchAction) mevcut — iyi | Orta |
| Tipografi | 12 px altı 85 metin öğesi (masaüstü), 25 öğe (mobil); kart buton metinleri iki satıra kırılıyor | Orta |

## 2. Görsel kalite ve marka algısı

- **Güçlü yanlar:** Ürün fotoğrafları 1000×1000 px, temiz beyaz fon, tutarlı ışık. Ürün yelpazesi geniş ve kategoriler net.
- **Hero banner** ("Markanızı Her Yerde Görünür Kılın") yazı + ürün görselini tek bir raster görselde birleştiriyor: metin taranamıyor, mobilde ayrı bir görsel gerekiyor, ölçeklenince bulanıklaşıyor.
- "En Çok Arananlar" afişlerinde **üçüncü taraf markaların ürünleri** (ör. STANLEY logolu termos) görünüyor; kurumsal güven ve görsel hak açısından risk.
- Kırmızı daire çerçeveli kategori görselleri farklı ışık/arka planlardan geliyor; bütünlük zayıf.
- Bazı görseller yapay zekâ ile üretilmiş izlenimi veriyor (ör. "Yerli Üretim Defterler" kategorisindeki `chatgpt-image-…` dosya adlı görsel, fuar standı footer görseli). Premium marka algısı için gerçek üretim/ürün fotoğrafı tercih edilmeli.
- Yazım hataları: "Powebank", "Sürdürülebilir Ünler"; tanıtım metninde çıplak `&nbsp;` görünüyor.

## 3. UI/UX ve içerik hiyerarşisi

- Ana mesaj (32 yıl tecrübe, 3.620 m² tesis, matbaa altyapısı) sayfanın en altında, "Devamını oku" içinde kalıyor. Kurumsal alıcı için en önemli güven sinyalleri görünmüyor.
- Ürün listeleri birbirine benzeyen 4 karusel ("Kampanyalı", "Kurumsal Yılbaşı", "Günün Ürünleri"…) — farklılaşma yok, sayfa uzuyor.
- Kartlarda "Stok güncelleniyor…" metni canlı veri gelene kadar boş durum olarak görünüyor.
- Kişiselleştirme (gofre, UV, lazer, serigrafi, ofset baskı, ciltleme seçenekleri) **sadece ürün detay sayfalarında ve Hakkımızda'da** geçiyor; anasayfada B2B müşterinin ilk sorusu olan "logomu nasıl uygularsınız?" cevapsız.
- Ürünlere erişim: üst menüde 8 ana grup + açılır alt kategoriler var (iyi), ancak "Hediyelik Setler", "Masa Setleri", "Termoslar" gibi gruplar ana barda değil.

## 4. Mobil navigasyon

- Sağ kenarda sabit 3 yüzen buton (lacivert, yeşil WhatsApp, kırmızı) kategori ve ürün kartlarının üzerine biniyor.
- Hamburger yerine "Anasayfa / Kurumsal / İletişim" metin linkleri; ürün gruplarına ulaşmak için ayrı bir yol gerekiyor.
- "Listeme Ekle" butonları 2 satıra kırılıyor, dokunma hedefi ~40 px.
- Tek elle kullanım için alt bölgede (başparmak alanı) birincil aksiyon yok.

## 5. SEO altyapısı

- ✅ `lang="tr"`, meta description, Open Graph, Twitter Card, Organization/LocalBusiness/WebSite JSON-LD, temiz kategori URL'leri (`/ajanda-ve-defterler`, `/kalem-setleri`).
- ❌ `<title>` sadece "Nur Ajanda" — "kurumsal ajanda", "promosyon" gibi aranan ifadeler başlıkta yok.
- ❌ Sayfada H1 yok; ürün isimleri H3, bölüm başlıkları H2.
- ❌ og:image 226×49 px logo — paylaşımda çok küçük görünür (önerilen 1200×630).
- ⚠️ Aynı uzun tanıtım paragrafı 3 kez tekrar ediyor (ince/tekrarlı içerik sinyali).
- ⚠️ Hakkımızda'da "2007 yılında kurulan" ve "32 yıllık sektör tecrübesi" ifadeleri birlikte geçiyor; tutarlılık müşteriyle teyit edilmeli (demo, firmanın kendi ifadesi olan "32 yıllık sektör tecrübesi"ni kullanır).

## 6. Performans (ölçüm: Playwright, bulut ortam)

İki ayrı ölçümün aralığı:

| Metrik | Masaüstü (1440×900) | Mobil (iPhone 13) |
|---|---|---|
| TTFB (sunucu yanıtı) | 4,5 – 5,0 sn | 3,1 – 4,6 sn |
| First Contentful Paint | 5,2 – 6,0 sn | 3,6 – 5,2 sn |
| load olayı | 6,5 – 7,0 sn | 5,2 – 6,6 sn |
| İstek sayısı / aktarım | 101–109 / ≈2,1 MB | 101 / ≈2,1 MB |
| Script / CSS dosyası | 32 / 12 | 32 / 12 |

- Sunucu yanıt süresi (TTFB) en büyük darboğaz; sayfa önbelleği (full-page cache) ve CDN önerilir.
- jQuery 2.1.1 (2014) + Bootstrap 3 + OwlCarousel + çok sayıda inline script → ana iş parçacığı yükü.
- Görseller WebP (iyi) ama karuselde görünmeyen onlarca görsel ilk yüklemede isteniyor.

## 7. Kurumsal teklif deneyimi

- ✅ "Teklif Listeme Ekle" her kartta var; header'da liste sayacı mevcut.
- ❌ Adet, baskı tekniği, teslim tarihi, logo/not gibi alanlar listeye eklerken sorulmuyor.
- ❌ Fiyatlar "+ KDV" birim fiyat olarak gösteriliyor ama baskı/kişiselleştirme maliyetinin dahil olup olmadığı belirtilmiyor.
- ❌ Teklif listesinin bir özeti / referans numarası yok.

## 8. Yeni tasarımda bu bulgulara verilen cevaplar

| Sorun | Demo çözümü |
|---|---|
| H1 yok, zayıf başlık | Tek H1 ("Kurumsal ajandada markanızın imzası"), anahtar kelimeli `<title>`, mantıklı H2/H3 |
| Güven sinyalleri gömülü | "Üretim" bölümü: 32 yıl · 3.620 m² · 4 katlı tesis · 40 kişilik kadro · ofset baskı · 5 ciltleme tekniği (hepsi sitedeki ifadelerden) |
| Kişiselleştirme görünmüyor | İnteraktif "Baskı teknikleri" bölümü — her teknik, onu sunan gerçek ürünlerle eşleşir |
| Tekrarlı karuseller | Tek "Öne çıkanlar" alanı + kategori filtreleri |
| Mobilde yüzen butonlar | Başparmak bölgesinde sabit alt eylem çubuğu (Kategoriler · Ara · Teklif · WhatsApp) |
| Teklif akışı | Adet, baskı tercihi, not; referans numaralı talep özeti (demo — gönderim yok) |
| Performans | Framework'süz statik sayfa, self-host fontlar, AVIF/WebP, lazy-load, CDN bağımlılığı yok |
| Hero raster banner | Gerçek HTML başlık + gerçek ürün fotoğraflarından 2.5D kompozisyon |
