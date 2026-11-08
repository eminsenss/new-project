// Verified content for the Nur Ajanda homepage concept.
// Every product, price, spec, address and number below was taken from
// nurajanda.com on 8 Nov 2026 (see data/nurajanda-snapshot-2026-11-08.json).
export const SITE = 'https://nurajanda.com';
export const RETRIEVED = '8 Kasım 2026';

export const CONTACT = {
  phone: '0212 567 78 03',
  phoneHref: 'tel:+902125677803',
  whatsapp: '+90 553 333 06 87',
  whatsappHref: 'https://wa.me/905533330687',
  email: 'info@nurajanda.com',
  instagram: 'https://www.instagram.com/nurajandaa/',
  youtube: 'https://www.youtube.com/@NurAjanda',
  showroom: 'Davutpaşa Cad. Kazım Dinçol San. Sit. No:81/132, Zeytinburnu / İstanbul',
  factory: 'Maltepe Mah. Hastane Yolu Sk. No:6 Kat:1-2-3-4, Zeytinburnu / İstanbul',
};

export const SWATCH = {
  Lacivert: '#24427f', Füme: '#57585c', Gri: '#a3a3a0', Kırmızı: '#c7262c', Taba: '#b5703a',
  'Turkuaz Mavi': '#2a8bb5', 'Turkuaz Yeşil': '#279a8f', Siyah: '#1b1b1b', Yeşil: '#3c7a4c',
};

// cat: defter | organizer | kalem | hediyelik | masa
export const PRODUCTS = [
  {
    id: 'ortakoy-l', name: 'Ortaköy-L Tarihsiz Defter', model: 'Ortaköy-L', price: 208, cat: 'defter',
    url: '/ortakoy-l-tarihsiz-defter', img: 'c/14051-1-ortakoy-lacivert', w: 682, h: 1000,
    specs: ['15 × 21 cm', '224 sayfa, çizgili', '70 gr ivory kağıt', 'Kart ve telefon bölmesi'],
    print: ['Gofre', 'UV'], colors: ['Lacivert', 'Füme', 'Gri', 'Kırmızı', 'Taba', 'Turkuaz Mavi', 'Turkuaz Yeşil'],
    alt: 'Ortaköy-L lacivert termo deri kapaklı tarihsiz defter, ön kapakta kart ve telefon bölmesi',
  },
  {
    id: 'bostanci-ds', name: 'Bostancı-DS Dikişli Günlük Ajanda', model: 'Bostancı-DS', price: 386, cat: 'defter',
    url: '/bostanci-ds-dikisli-gunluk-ajanda', img: 'c/15015-1-bostanci-dikisli-siyah', w: 719, h: 1000,
    specs: ['20 × 28 cm', '336 sayfa', '70 gr ivory kağıt', 'Dikişli termo deri kapak'],
    print: ['Gofre', 'UV'], colors: ['Siyah', 'Kırmızı', 'Lacivert', 'Taba'],
    alt: 'Bostancı-DS siyah dikişli günlük ajanda, kapakta kabartma 2026 yazısı',
  },
  {
    id: 'hereke-g', name: 'Hereke-G Gizli Spiralli Günlük Ajanda', model: 'Hereke-G', price: 348, cat: 'defter',
    url: '/hereke-g-gizli-spiralli-gunluk-ajanda', img: 'c/13252-1-hereke-gri', w: 730, h: 1000,
    alt2: 'c/13252-4-gizli-spiralli-ajanda-ic', w2: 1000, h2: 698,
    specs: ['17,5 × 24 cm', '336 sayfa', '70 gr ivory kağıt', 'Gizli spiral cilt'],
    print: ['Gofre', 'Serigrafi', 'UV'], colors: ['Gri', 'Kırmızı', 'Lacivert', 'Siyah', 'Taba'],
    alt: 'Hereke-G gri gizli spiralli günlük ajanda, lastik bantlı kapak',
  },
  {
    id: 'maslak-fm', name: 'Maslak-FM Organizer Ajanda', model: 'Maslak-FM', price: 670, cat: 'organizer',
    url: '/maslak-fm-organizer-ajanda', img: 'c/16298-1-maslak-fume', w: 716, h: 1000,
    alt2: 'c/16298-2-maslak-ic', w2: 992, h2: 565,
    specs: ['18 × 23 cm, ajanda 15 × 21 cm', '352 sayfa', 'Metal toka', 'Hesap makinesi'],
    print: ['Gofre', 'Lazer'], colors: ['Füme', 'Kırmızı', 'Lacivert', 'Taba'],
    alt: 'Maslak-FM füme organizer ajanda, metal tokalı kapak',
  },
  {
    id: 'didim-k', name: 'Didim-K Organizer Ajanda', model: 'Didim-K', price: 670, cat: 'organizer',
    url: '/didim-k-organizer-ajanda', img: 'c/13212-1-didim-kirmizi', w: 800, h: 1000,
    alt2: 'c/13212-2-didim-ic', w2: 1000, h2: 522,
    specs: ['18 × 23 cm, ajanda 15 × 21 cm', '352 sayfa', 'Metal toka', 'Hesap makinesi'],
    print: ['Gofre', 'Lazer'], colors: ['Kırmızı', 'Lacivert', 'Siyah'],
    alt: 'Didim-K kırmızı organizer ajanda, metal tokalı termo deri kapak',
  },
  {
    id: 'burgaz-tb', name: 'Burgaz-TB Kılıflı Defter', model: 'Burgaz-TB', price: 398, cat: 'organizer',
    url: '/burgaz-tb-kilifli-defter', img: 'c/15897-1-burgaz-taba', w: 598, h: 1000,
    alt2: 'c/15897-3-burgaz-ic', w2: 1000, h2: 729,
    specs: ['Kılıf 14,5 × 23 cm', 'Defter 13 × 21 cm', '224 sayfa, çizgili', 'Metal toka'],
    print: ['Gofre', 'Lazer'], colors: ['Taba', 'Füme', 'Kırmızı', 'Lacivert'],
    alt: 'Burgaz-TB taba renk kılıflı defter, metal tokalı',
  },
  {
    id: '0505-330', name: '0505-330 Roller ve Tükenmez Kalem', model: '0505-330', price: 600, cat: 'kalem',
    url: '/0505-330-roller-ve-tukenmez-kalem', img: 'c/17183-1-0505-330-kutu', w: 1000, h: 817,
    specs: ['Roller + tükenmez kalem', 'Kutulu set'], print: [], colors: [],
    alt: '0505-330 roller ve tükenmez kalem seti, açık siyah hediye kutusunda',
  },
  {
    id: '0505-420', name: '0505-420 Roller ve Tükenmez Kalem', model: '0505-420', price: 586, cat: 'kalem',
    url: '/0505-420-roller-ve-tukenmez-kalem', img: 'c/7367-1-0505-420-kutu', w: 1000, h: 925,
    specs: ['Roller + tükenmez kalem', 'Kutulu set'], print: [], colors: [],
    alt: '0505-420 roller ve tükenmez kalem seti, siyah kutuda altın detaylı kalemler',
  },
  {
    id: 'abant', name: 'Abant Hediyelik Set', model: 'Abant', price: 4260, cat: 'hediyelik',
    url: '/abant-hediyelik-set', img: 'c/16901-1-abant-konsept', w: 828, h: 934,
    alt2: 'c/16901-2-ince-kutu', w2: 1000, h2: 501,
    specs: ['Kutu 37 × 31 × 6 cm', 'Çok parçalı kurumsal set'], print: [], colors: [],
    alt: 'Abant hediyelik set, açık kutu içinde defter, kalem ve teknolojik ürünler',
  },
  {
    id: 'canakkale', name: 'Çanakkale Hediyelik Set', model: 'Çanakkale', price: 2220, cat: 'hediyelik',
    url: '/canakkale-hediyelik-set', img: 'c/14926-1-canakkale-konsept', w: 918, h: 941,
    specs: ['Kutu 38 × 28 × 5,5 cm', 'Cilt bezi kutu'], print: [], colors: [],
    alt: 'Çanakkale hediyelik set, cilt bezi kaplı kutu içinde defter ve aksesuarlar',
  },
  {
    id: 'hilal-s', name: '0071 Hilal-S Deri Masa Seti', model: '0071 Hilal-S', price: 1600, cat: 'masa',
    url: '/0071-hilal-s-deri-masa-seti', img: 'c/17173-1-hilal-0071-siyah-v2', w: 1000, h: 580,
    specs: ['20 × 40 cm', 'Baskı alanı 20 × 55 mm'], print: [], colors: ['Siyah'],
    alt: '0071 Hilal-S siyah deri masa seti, saat ve kalemlikli',
  },
  {
    id: 'vera-0036', name: '0036 Vera Ahşap Masa Seti', model: '0036 Vera', price: 2400, cat: 'masa',
    url: '/0036-vera-ahsap-masa-seti', img: 'c/17168-1-vera-0036-v2', w: 1000, h: 726,
    specs: ['20 × 40 cm', 'Baskı alanı 130 × 55 mm'], print: [], colors: [],
    alt: '0036 Vera ahşap masa seti, örnek firma baskılı isimlik ve kalemlikler',
  },
];

export const FILTERS = [
  ['all', 'Tümü'], ['defter', 'Ajanda & Defter'], ['organizer', 'Organizer'],
  ['kalem', 'Kalem Setleri'], ['hediyelik', 'Hediyelik Setler'], ['masa', 'Masa Setleri'],
];

// Full taxonomy, URLs as on nurajanda.com
export const TAXONOMY = [
  { name: 'Ajanda ve Defterler', url: '/ajanda-ve-defterler', items: [
    ['Tarihli Ajandalar', '/tarihli-ajandalar'], ['Defterler', '/defterler'], ['Organizerler', '/organizerler'],
    ['Yerli Üretim Defterler', '/yerli-uretim-promosyon-defterler'], ['Ajanda Aksesuarları', '/ajanda-aksesuarlari'],
    ['Kırtasiye Defter Ürünleri', '/kirtasiye-defter-urunleri']] },
  { name: 'Kalemler', url: '/kalemler', items: [
    ['Kalem Setleri', '/kalem-setleri'], ['Metal Kalemler', '/metal-kalemler'], ['Doğa Dostu Kalemler', '/doga-dostu-kalemler'],
    ['Plastik Kalemler', '/plastik-kalemler']] },
  { name: 'Hediyelik Setler', url: '/luks-hediyelik-setler', items: [
    ['Lüks Hediyelik Setler', '/luks-hediyelik-setler'], ['Hediyelik Setler', '/hediyelik-setler']] },
  { name: 'Masa Setleri ve Sümenleri', url: '/masa-setleri-ve-sumenleri', items: [
    ['Masa Setleri', '/masa-setleri'], ['Kristal Masa Setleri', '/kristal-masa-setleri'], ['Masa Sümenleri', '/masa-sumenleri'],
    ['Masaüstü Organizerler', '/masaustu-organizerler']] },
  { name: 'Kağıt Ürünleri', url: '/kagit-urunleri', items: [
    ['Masa Takvimleri', '/masa-takvimleri'], ['Gemici Takvimler', '/gemici-takvimler'], ['Bloknotlar ve Sümenler', '/bloknotlar-ve-sumenler'],
    ['Karton Çantalar', '/karton-cantalar']] },
  { name: 'Termoslar ve Bardaklar', url: '/termoslar-ve-bardaklar', items: [
    ['Termoslar', '/termoslar'], ['Cam Ürünleri', '/cam-urunleri'], ['Seramik ve Porselen Ürünler', '/seramik-ve-porselen-urunler']] },
  { name: 'Teknolojik Ürünler', url: '/teknolojik-urunler', items: [
    ['Powerbank', '/powerbank'], ['Powerbank Organizerler', '/powerbank-organizerler'], ['Speakerlar', '/speakerlar'],
    ['USB Bellekler', '/usb-bellekler'], ['Telefon Standları', '/telefon-standlari'], ['Teknoloji Ürünleri', '/teknoloji-urunleri']] },
  { name: 'Saatler', url: '/saatler', items: [
    ['Metal Duvar Saatleri', '/metal-duvar-saatleri'], ['Metalize Duvar Saatleri', '/metalize-duvar-saatleri'],
    ['Bombe Cam Duvar Saatleri', '/bombe-cam-duvar-saatleri'], ['Plastik Duvar Saatleri', '/plastik-duvar-saatleri'],
    ['Saatli Duvar Tabloları', '/saatli-duvar-tablolari']] },
  { name: 'Kupa ve Plaketler', url: '/kupa-ve-plaketler', items: [
    ['Kristal Plaketler', '/kristal-plaketler'], ['Albüm Plaketler', '/album-plaketler'], ['Ahşap Plaketler', '/ahsap-plaketler'],
    ['Kupalar ve Madalyalar', '/kupalar-ve-madalyalar']] },
  { name: 'Tekstil Ürünleri', url: '/tekstil-urunleri', items: [['Şapka', '/sapka'], ['Tişörtler', '/tisortler']] },
  { name: 'Doğa Dostu Ürünler', url: '/doga-dostu-urunler', items: [
    ['Bitki Yetiştirme Setleri', '/bitki-yetistirme-setleri'], ['Geri Dönüşüm Ürünler', '/geri-donusum-urunler']] },
  { name: 'Diğer Ürünler', url: '/diger-urunler', items: [
    ['Anahtarlıklar', '/anahtarliklar'], ['Çantalar', '/cantalar'], ['Kartvizitlikler', '/kartvizitlikler'],
    ['Sekreter Bloknotlar', '/sekreter-bloknotlar'], ['Çakmaklar', '/cakmaklar'], ['Açacaklı Magnetler', '/acacakli-magnetler'],
    ['Araç ve Gereçler', '/arac-ve-gerecler'], ['Karışık Ürünler', '/karisik-urunler']] },
];

// Print techniques — offered-on lists come from each product's "Baskı" attribute on nurajanda.com
export const TECHNIQUES = [
  {
    id: 'gofre', name: 'Gofre', short: 'Isı ve basınçla iz',
    text: 'Termo deri kapaklara ısı ve basınçla uygulanan, mürekkepsiz kabartma iz. Sade, dokunulduğunda hissedilen ve kalıcı bir prestij detayı.',
    img: 'c/15015-1-bostanci-dikisli-siyah', w: 719, h: 1000, imgAlt: 'Bostancı-DS siyah ajanda, kapakta kabartma yıl detayı',
    on: [['Bostancı-DS', '/bostanci-ds-dikisli-gunluk-ajanda'], ['Ortaköy-L', '/ortakoy-l-tarihsiz-defter'], ['Maslak-FM', '/maslak-fm-organizer-ajanda'], ['Burgaz-TB', '/burgaz-tb-kilifli-defter']],
  },
  {
    id: 'uv', name: 'UV baskı', short: 'Renkli ve canlı',
    text: 'Kapak yüzeyine doğrudan, renkli ve detaylı logo baskısı. Çok renkli kurumsal kimlikleri olduğu gibi taşımak için ideal.',
    img: 'c/14051-1-ortakoy-lacivert', w: 682, h: 1000, imgAlt: 'Ortaköy-L lacivert tarihsiz defter',
    on: [['Ortaköy-L', '/ortakoy-l-tarihsiz-defter'], ['Ataşehir-FM', '/atasehir-fm-tarihsiz-defter'], ['Göztepe-L', '/goztepe-l-gizli-spiralli-gunluk-ajanda'], ['Hereke-G', '/hereke-g-gizli-spiralli-gunluk-ajanda']],
  },
  {
    id: 'lazer', name: 'Lazer', short: 'Hassas kazıma',
    text: 'Lazerle yüzeye işlenen ince detaylı uygulama. Keskin hatlı, aşınmaya dayanıklı ve zamansız bir görünüm.',
    img: 'c/16298-1-maslak-fume', w: 716, h: 1000, imgAlt: 'Maslak-FM füme organizer ajanda',
    on: [['Maslak-FM', '/maslak-fm-organizer-ajanda'], ['Didim-K', '/didim-k-organizer-ajanda'], ['Trabzon-L', '/trabzon-l-organizer-ajanda'], ['Silivri-G', '/silivri-g-kilifli-defter']],
  },
  {
    id: 'serigrafi', name: 'Serigrafi', short: 'Elek baskı',
    text: 'Elek baskı tekniğiyle düz, canlı ve opak renk uygulaması. Net logolar ve kurumsal renkler için güvenilir bir yöntem.',
    img: 'c/13252-1-hereke-gri', w: 730, h: 1000, imgAlt: 'Hereke-G gri gizli spiralli günlük ajanda',
    on: [['Hereke-G', '/hereke-g-gizli-spiralli-gunluk-ajanda'], ['Göztepe-L', '/goztepe-l-gizli-spiralli-gunluk-ajanda']],
  },
  {
    id: 'ofset', name: 'Ofset baskı', short: 'İç sayfa ve matbaa',
    text: 'Ajanda ve defter iç sayfaları ile kurumsal baskılar için yüksek çözünürlüklü ofset baskı; matbaa ve ciltleme aynı tesiste, entegre çalışır.',
    img: 'c/16298-3-organizer-ic-2', w: 1000, h: 702, imgAlt: 'Organizer ajandanın tarihli, baskılı iç sayfaları',
    on: [['Tarihli Ajandalar', '/tarihli-ajandalar'], ['Defterler', '/defterler']],
  },
];

export const BINDINGS = ['Spiral', 'Gizli spiral', 'Yapışkanlı (perfect binding)', 'Tel dikiş', 'Karton kapak'];
