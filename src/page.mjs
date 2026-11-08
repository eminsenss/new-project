import { SITE, RETRIEVED, CONTACT, SWATCH, PRODUCTS, FILTERS, TAXONOMY, TECHNIQUES, BINDINGS } from './data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tl = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(n);
const ext = (path) => `${SITE}${path}`;

export function makePicture(manifest) {
  return function pic(key, { alt, sizes = '100vw', cls = '', eager = false, priority = false, w, h } = {}) {
    const m = manifest[`img/${key}`];
    if (!m) throw new Error(`missing image ${key}`);
    const set = (fmt) => m.sizes.map((s) => `assets/img/${key}-${s}.${fmt} ${s}w`).join(', ');
    const mid = m.sizes[Math.min(1, m.sizes.length - 1)];
    return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="assets/img/${key}-${mid}.webp" width="${w || m.w}" height="${h || m.h}" alt="${esc(alt)}" ${eager ? 'loading="eager"' : 'loading="lazy"'} decoding="async"${priority ? ' fetchpriority="high"' : ''}></picture>`;
  };
}

const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-search" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.4-2.1L21 21"/></symbol>
<symbol id="i-list" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5L15.5 19l-3.5 1.5L8.5 19l-3 1.5V5A1.5 1.5 0 0 1 7 3.5ZM9 8.5h6M9 12h6"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M3.5 8h17M3.5 16h17"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="m5.5 5.5 13 13m0-13-13 13"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M4 12h15m-5.5-6L19.5 12l-6 6"/></symbol>
<symbol id="i-arrow-ne" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7m-8.5 0H17v8.5"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-minus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M5 12h14"/></symbol>
<symbol id="i-trash" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M4.5 7h15M10 11v6m4-6v6M6.5 7l1 12.5h9l1-12.5M9.5 7V4.5h5V7"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M5 4h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5L20 15v4a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></symbol>
<symbol id="i-ig" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Zm4.5 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm5-10.2v.1"/></symbol>
<symbol id="i-yt" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M21 8.2a3 3 0 0 0-2-2C17.3 5.7 12 5.7 12 5.7s-5.3 0-7 .5a3 3 0 0 0-2 2A31 31 0 0 0 2.6 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2 2c1.7.5 7 .5 7 .5s5.3 0 7-.5a3 3 0 0 0 2-2 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5 3-5 3Z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 21s6.5-6.1 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 14.9 12 21 12 21Zm0-8.7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></symbol>
</svg>`;

function logo(white = false) {
  return `<img src="assets/brand/nur-ajanda-logo${white ? '-white' : ''}.svg" width="226" height="49" alt="Nur Ajanda Promosyon">`;
}

function productCard(p, pic, i) {
  const price = p.price ? `<span class="price">${tl(p.price)}</span> <span class="vat">+ KDV</span>` : '<span class="price price--ask">Fiyat için sorunuz</span>';
  const swatches = p.colors.length
    ? `<div class="swatches" aria-label="${p.colors.length} renk seçeneği: ${esc(p.colors.join(', '))}">${p.colors.slice(0, 7).map((c) => `<span style="--sw:${SWATCH[c] || '#999'}" title="${esc(c)}"></span>`).join('')}<em>${p.colors.length} renk</em></div>`
    : '';
  const print = p.print.length ? `<li><span>Baskı</span>${esc(p.print.join(' · '))}</li>` : '';
  const second = p.alt2 ? pic(p.alt2, { alt: '', sizes: '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 70vw', cls: 'card__img card__img--alt' }) : '';
  const thumbM = p.img;
  return `<article class="card reveal" data-cat="${p.cat}" data-id="${p.id}" data-name="${esc(p.name)}" data-model="${esc(p.model)}" data-price="${p.price || ''}" data-url="${ext(p.url)}" data-thumb="assets/img/${thumbM}-360.webp" style="--i:${i % 4}">
  <a class="card__media${p.alt2 ? ' has-alt' : ''}" href="${ext(p.url)}" aria-label="${esc(p.name)} — ürün sayfası (nurajanda.com)">
    ${pic(p.img, { alt: p.alt, sizes: '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 70vw', cls: 'card__img' })}
    ${second}
    <span class="card__code">${esc(p.model)}</span>
  </a>
  <div class="card__body">
    <h3 class="card__title"><a href="${ext(p.url)}">${esc(p.name)}</a></h3>
    <ul class="card__specs">${p.specs.map((s) => `<li>${esc(s)}</li>`).join('')}${print}</ul>
    ${swatches}
    <div class="card__foot">
      <p class="card__price">${price}</p>
      <button class="btn-add" type="button" data-add aria-label="${esc(p.name)} ürününü teklif listesine ekle">${icon('plus')}<span>Teklife ekle</span></button>
    </div>
  </div>
</article>`;
}

export function renderPage({ manifest, css, criticalPreloads, origImage }) {
  const pic = makePicture(manifest);
  const year = 2026;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Nur Ajanda', url: `${SITE}/`,
        logo: `${SITE}/image/catalog/logo/site-logo-1.png`, email: CONTACT.email, telephone: '+90 212 567 78 03',
        sameAs: [CONTACT.instagram, CONTACT.youtube],
        description: 'Kurumsal ajanda, defter imalatı ve promosyon ürünleri. 32 yıllık sektör tecrübesi, İstanbul’da 3.620 m² üretim tesisi.',
        address: { '@type': 'PostalAddress', streetAddress: 'Maltepe Mah. Hastane Yolu Sk. No:6 Kat:1-2-3-4', addressLocality: 'Zeytinburnu', addressRegion: 'İstanbul', addressCountry: 'TR' },
        contactPoint: [{ '@type': 'ContactPoint', telephone: '+90 212 567 78 03', contactType: 'sales', areaServed: 'TR', availableLanguage: ['tr'] }],
      },
      {
        '@type': 'Store', '@id': `${SITE}/#showroom`, name: 'Nur Ajanda Showroom', parentOrganization: { '@id': `${SITE}/#organization` },
        telephone: '+90 212 567 78 03',
        address: { '@type': 'PostalAddress', streetAddress: 'Davutpaşa Cad. Kazım Dinçol San. Sit. No:81/132', addressLocality: 'Zeytinburnu', addressRegion: 'İstanbul', addressCountry: 'TR' },
      },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Nur Ajanda', inLanguage: 'tr-TR', publisher: { '@id': `${SITE}/#organization` },
        potentialAction: { '@type': 'SearchAction', target: `${SITE}/index.php?route=product/search&search={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      {
        '@type': 'ItemList', name: 'Öne çıkan kurumsal ürünler', itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'Product', name: p.name, sku: p.model, url: ext(p.url), brand: { '@type': 'Brand', name: 'Nur Ajanda' },
            ...(origImage(p.url) ? { image: origImage(p.url) } : {}),
            offers: { '@type': 'Offer', priceCurrency: 'TRY', price: p.price.toFixed(2), url: ext(p.url),
              priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price.toFixed(2), priceCurrency: 'TRY', valueAddedTaxIncluded: false } } },
        })),
      },
    ],
  };
  const featured = PRODUCTS.map((p, i) => productCard(p, pic, i)).join('\n');
  const filters = FILTERS.map(([id, label], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-filter="${id}" aria-pressed="${i === 0}">${label}<span class="chip__n">${id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === id).length}</span></button>`).join('');

  const mega = TAXONOMY.map((g) => `<div class="mega__group"><a class="mega__head" href="${ext(g.url)}">${esc(g.name)}</a><ul>${g.items.map(([n, u]) => `<li><a href="${ext(u)}">${esc(n)}</a></li>`).join('')}</ul></div>`).join('');
  const mobileCats = TAXONOMY.map((g, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(g.name)}<span class="acc__n">${g.items.length}</span></summary><ul><li><a href="${ext(g.url)}">Tümünü gör</a></li>${g.items.map(([n, u]) => `<li><a href="${ext(u)}">${esc(n)}</a></li>`).join('')}</ul></details>`).join('');

  const tech = TECHNIQUES.map((t, i) => `<button type="button" role="tab" class="tech__tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="tech__num">0${i + 1}</span><span class="tech__name">${esc(t.name)}</span><span class="tech__short">${esc(t.short)}</span></button>`).join('');
  const techPanels = TECHNIQUES.map((t, i) => `<div class="tech__panel" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}"${i === 0 ? '' : ' hidden'}>
    <div class="tech__visual">${pic(t.img, { alt: t.imgAlt, sizes: '(min-width: 1000px) 34vw, 80vw' })}</div>
    <div class="tech__copy"><h3>${esc(t.name)}</h3><p>${esc(t.text)}</p>
      <p class="tech__on-label">Bu tekniğin sunulduğu ürünlerden</p>
      <ul class="tech__on">${t.on.map(([n, u]) => `<li><a href="${ext(u)}">${esc(n)}${icon('arrow-ne', 'icon icon--xs')}</a></li>`).join('')}</ul>
    </div></div>`).join('');

  const promoGroups = TAXONOMY.slice(4).map((g) => `<li><a href="${ext(g.url)}"><span>${esc(g.name)}</span>${icon('arrow-ne')}</a></li>`).join('');

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.classList.add('js')</script>
<title>Kurumsal Ajanda, Defter ve Promosyon Ürünleri Üreticisi | Nur Ajanda</title>
<meta name="description" content="Kurumsal ajanda, özel baskılı defter, organizer ve kurumsal hediyelik setler. 32 yıllık tecrübe, İstanbul’da 3.620 m² üretim tesisi. Ürünleri seçin, teklif listenizi oluşturun.">
<!-- TASARIM DEMOSU: arama motorlarında indexlenmez. Canlıya alınırken noindex kaldırılıp canonical eklenmelidir. -->
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="googlebot" content="noindex, nofollow">
<meta name="theme-color" content="#f3efe8">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="Nur Ajanda">
<meta property="og:title" content="Kurumsal ajandada markanızın imzası — Nur Ajanda">
<meta property="og:description" content="Ajanda, defter, organizer ve kurumsal hediye setleri; tasarımdan ciltlemeye İstanbul’daki tesisimizde üretim.">
<meta property="og:image" content="assets/og/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Nur Ajanda kurumsal ajanda ve defter koleksiyonu">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/brand/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
${criticalPreloads}
<link rel="stylesheet" href="assets/css/main.css?v=${css}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
${SPRITE}
<a class="skip" href="#main">İçeriğe geç</a>
<div class="demo-bar" role="note">
  <p><strong>Tasarım demosu</strong><span class="demo-bar__long"> — nurajanda.com için alternatif anasayfa konsepti.</span> Gerçek sipariş veya teklif gönderilmez.</p>
</div>

<header class="header" data-header>
  <div class="header__inner wrap">
    <a class="brand" href="./" aria-label="Nur Ajanda anasayfa">${logo()}</a>
    <nav class="nav" aria-label="Ana menü">
      <ul>
        <li class="nav__mega">
          <button type="button" class="nav__link" aria-expanded="false" aria-controls="mega" data-mega>Koleksiyonlar<svg class="icon icon--chev" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="m7 10 5 5 5-5"/></svg></button>
          <div class="mega" id="mega" hidden>
            <div class="mega__inner wrap">
              <div class="mega__grid">${mega}</div>
              <a class="mega__feature" href="${ext('/tum-urunler')}">
                ${pic('p/17782-3-atasehir-konsept-crop', { alt: 'Farklı renklerde Ataşehir tarihsiz defterler üst üste', sizes: '280px' })}
                <span>Tüm ürünleri gör ${icon('arrow')}</span>
              </a>
            </div>
          </div>
        </li>
        <li><a class="nav__link" href="#urunler">Öne çıkanlar</a></li>
        <li><a class="nav__link" href="#kisisellestirme">Kişiselleştirme</a></li>
        <li><a class="nav__link" href="#uretim">Üretim</a></li>
        <li><a class="nav__link" href="#iletisim">İletişim</a></li>
      </ul>
    </nav>
    <div class="header__actions">
      <button type="button" class="hbtn hbtn--search" data-open-search aria-label="Ürün veya kategori ara">${icon('search')}<span class="hbtn__label">Ürün ara</span><kbd>/</kbd></button>
      <button type="button" class="hbtn hbtn--quote" data-open-quote aria-label="Teklif listesi, 0 ürün">${icon('list')}<span class="hbtn__label">Teklif listesi</span><span class="badge" data-count>0</span></button>
      <button type="button" class="hbtn hbtn--menu" data-open-menu aria-label="Menüyü aç">${icon('menu')}</button>
    </div>
  </div>
</header>

<main id="main">
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__inner wrap">
    <div class="hero__copy">
      <p class="eyebrow hero__eyebrow"><span class="dot"></span>Kurumsal ajanda · Defter · Promosyon</p>
      <h1 class="hero__title" id="hero-title"><span class="line"><span>Kurumsal ajandada</span></span> <span class="line"><em>markanızın imzası<span class="stop">.</span></em></span></h1>
      <p class="hero__lead">Ajanda, defter, organizer ve kurumsal hediye setlerini logonuzla; tasarımdan ciltlemeye kadar İstanbul’daki tesisimizde üretiyoruz.</p>
      <div class="hero__cta">
        <a class="btn btn--ink" href="#koleksiyonlar">Koleksiyonu keşfet ${icon('arrow')}</a>
        <button type="button" class="btn btn--line" data-open-quote>Teklif listesi oluştur</button>
      </div>
      <dl class="hero__facts">
        <div><dt>32 yıl</dt><dd>sektör tecrübesi</dd></div>
        <div><dt>3.620 m²</dt><dd>üretim tesisi</dd></div>
        <div><dt>Tek çatı</dt><dd>tasarım, baskı, cilt</dd></div>
      </dl>
    </div>
    <div class="hero__stage" data-stage aria-label="Öne çıkan ürünler: Bostancı-DS ajanda, Didim-K organizer ajanda ve 0510-640-L roller kalem">
      <div class="hero__disc" data-depth="0.15"></div>
      <figure class="hero__item hero__item--a" data-depth="0.35">${pic('c/15015-1-bostanci-dikisli-siyah', { alt: 'Bostancı-DS siyah dikişli günlük ajanda, kapakta kabartma 2026', sizes: '(min-width: 1000px) 30vw, 52vw', eager: true, priority: true })}</figure>
      <figure class="hero__item hero__item--b" data-depth="0.7">${pic('c/13212-1-didim-kirmizi', { alt: 'Didim-K kırmızı organizer ajanda, metal tokalı', sizes: '(min-width: 1000px) 25vw, 44vw', eager: true })}</figure>
      <figure class="hero__item hero__item--c" data-depth="1">${pic('c/14145-2-0510-640-lacivert', { alt: '0510-640-L lacivert roller kalem', sizes: '(min-width: 1000px) 7vw, 14vw', eager: true })}</figure>
      <a class="hero__tag" href="${ext('/bostanci-ds-dikisli-gunluk-ajanda')}" data-depth="0.5"><span class="hero__tag-k">Bostancı-DS</span><span>Dikişli günlük ajanda · 20 × 28 cm</span></a>
    </div>
  </div>
  <a class="hero__scroll" href="#koleksiyonlar" aria-label="Koleksiyonlara in"><span></span></a>
</section>

<section class="band" aria-label="Kişiselleştirme ve cilt teknikleri">
  <div class="band__track" aria-hidden="true">
    ${[0, 1].map(() => `<p>${['Gofre', 'UV baskı', 'Lazer', 'Serigrafi', 'Ofset baskı', 'Spiral cilt', 'Gizli spiral', 'Tel dikiş', 'Karton kapak'].map((t) => `<span>${t}</span>`).join('<i>✦</i>')}<i>✦</i></p>`).join('')}
  </div>
  <p class="sr-only">Uygulanan teknikler: gofre, UV baskı, lazer, serigrafi, ofset baskı; spiral, gizli spiral, tel dikiş ve karton kapak cilt.</p>
</section>

<section class="section collections" id="koleksiyonlar" aria-labelledby="col-title">
  <div class="wrap">
    <header class="section__head reveal">
      <p class="eyebrow">01 — Koleksiyonlar</p>
      <h2 id="col-title" class="h2">Her kurumsal ihtiyaca <em>bir koleksiyon.</em></h2>
      <p class="section__lead">Promosyon ajandadan lüks hediyelik setlere; ürün gruplarına tek dokunuşla ulaşın.</p>
    </header>
    <div class="bento">
      <a class="tile tile--hero reveal" href="${ext('/ajanda-ve-defterler')}">
        <div class="tile__media mask">${pic('p/17782-3-atasehir-konsept-crop', { alt: 'Füme, taba, kırmızı, yeşil ve lacivert Ataşehir tarihsiz defterler üst üste', sizes: '(min-width: 1000px) 56vw, 100vw' })}</div>
        <div class="tile__cap"><span class="tile__n">6 alt grup</span><h3>Ajanda ve Defterler</h3><p>Tarihli ajandalar, tarihsiz defterler, yerli üretim promosyon defterler.</p><span class="tile__go">${icon('arrow')}</span></div>
      </a>
      <a class="tile tile--side reveal" href="${ext('/organizerler')}" style="--i:1">
        <div class="tile__media mask">${pic('p/15896-2-silivri-imaj-2-crop', { alt: 'Silivri-G gri kılıflı defter ahşap masa üzerinde', sizes: '(min-width: 1000px) 40vw, 100vw' })}</div>
        <div class="tile__cap"><span class="tile__n">Metal toka · hesap makinesi</span><h3>Organizerler</h3><p>Kılıflı defterler ve organizer ajandalar.</p><span class="tile__go">${icon('arrow')}</span></div>
      </a>
      <a class="tile tile--side tile--half tile--tint reveal" href="${ext('/kalem-setleri')}" style="--i:2">
        <div class="tile__media tile__media--obj">${pic('c/9101-1-0505-80', { alt: '0505-80 roller ve tükenmez kalem seti mantar desenli kutuda', sizes: '(min-width: 1000px) 30vw, 46vw' })}</div>
        <div class="tile__cap"><span class="tile__n">Roller · tükenmez</span><h3>Kalem Setleri</h3><p>Kutulu, hediyeye hazır kalem setleri.</p><span class="tile__go">${icon('arrow')}</span></div>
      </a>
      <a class="tile tile--wide tile--half reveal" href="${ext('/luks-hediyelik-setler')}">
        <div class="tile__media mask">${pic('p/16270-1-datca-konsept', { alt: 'Datça hediyelik set kutusu, su yüzeyi fonunda', sizes: '(min-width: 1000px) 46vw, 46vw' })}</div>
        <div class="tile__cap"><span class="tile__n">Lüks ve kurumsal</span><h3>Hediyelik Setler</h3><p>Defter, kalem ve aksesuarlı hediye kutuları.</p><span class="tile__go">${icon('arrow')}</span></div>
      </a>
      <a class="tile tile--wide reveal" href="${ext('/masa-setleri-ve-sumenleri')}" style="--i:1">
        <div class="tile__media mask">${pic('p/17177-1-kral-5101-konsept-crop', { alt: 'Kral kristal masa seti', sizes: '(min-width: 1000px) 46vw, 100vw' })}</div>
        <div class="tile__cap"><span class="tile__n">Ahşap · deri · kristal</span><h3>Masa Setleri</h3><p>Makam masaları için masa setleri ve sümenler.</p><span class="tile__go">${icon('arrow')}</span></div>
      </a>
    </div>
    <div class="promo reveal">
      <div class="promo__head"><h3>Kurumsal promosyon ürünleri</h3><p>Kalem, termos, saat, anahtarlık, teknolojik ürünler ve daha fazlası.</p></div>
      <ul class="promo__list">${promoGroups}</ul>
    </div>
  </div>
</section>

<section class="section featured" id="urunler" aria-labelledby="feat-title">
  <div class="wrap">
    <header class="section__head section__head--row reveal">
      <div><p class="eyebrow">02 — Öne çıkanlar</p>
      <h2 id="feat-title" class="h2">Seçkin ürünler, <em>gerçek detaylar.</em></h2></div>
      <div class="filters" role="group" aria-label="Ürün grubuna göre filtrele">${filters}</div>
    </header>
    <div class="grid" data-grid aria-live="polite">
${featured}
    </div>
    <p class="note">Fiyatlar, nurajanda.com’da ${RETRIEVED} tarihinde listelenen KDV hariç birim fiyatlardır. Güncel fiyat ve kişiselleştirme detayları teklif aşamasında netleşir.</p>
  </div>
</section>

<section class="section custom" id="kisisellestirme" aria-labelledby="custom-title">
  <div class="wrap">
    <header class="section__head reveal">
      <p class="eyebrow eyebrow--light">03 — Kurumsal kişiselleştirme</p>
      <h2 id="custom-title" class="h2">Logonuz, ürünün kendisi <em>kadar özenle.</em></h2>
      <p class="section__lead">Kurumsal kimliğinizi ürünün malzemesine uygun teknikle uyguluyoruz. Matbaa ve ciltleme dahil süreç, İstanbul’daki tesisimizde kendi bünyemizde yürür.</p>
    </header>
    <div class="tech reveal">
      <div class="tech__tabs" role="tablist" aria-label="Baskı teknikleri">${tech}</div>
      <div class="tech__panels">${techPanels}</div>
    </div>
    <div class="bind reveal">
      <p class="bind__label">Ciltleme seçenekleri</p>
      <ul>${BINDINGS.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="section make" id="uretim" aria-labelledby="make-title">
  <div class="wrap make__grid">
    <header class="make__head reveal">
      <p class="eyebrow">04 — Üretim gücü</p>
      <h2 id="make-title" class="h2">32 yıllık tecrübe. <em>Tek çatı altında üretim.</em></h2>
      <p class="section__lead">Zeytinburnu’ndaki yüksek kapasiteli merkezimizde matbaa ve ciltleme süreçleri tam entegre çalışır. Haftalık ve günlük ajandalardan VIP ajandalara, spiralli defterlerden bloknotlara kadar ürünlerinizi taahhüt edilen sürede teslim ederiz.</p>
    </header>
    <dl class="stats">
      <div class="stat reveal"><dt><span data-count-to="32">32</span><small>yıl</small></dt><dd>sektör tecrübesi</dd></div>
      <div class="stat reveal"><dt><span data-count-to="3620" data-format="tr">3.620</span><small>m²</small></dt><dd>4 katlı modern üretim tesisi</dd></div>
      <div class="stat reveal"><dt><span data-count-to="40">40</span><small>kişi</small></dt><dd>uzman kadro</dd></div>
      <div class="stat reveal"><dt><span data-count-to="5">5</span><small>teknik</small></dt><dd>ciltleme seçeneği</dd></div>
    </dl>
    <figure class="make__fig reveal">
      <div class="mask">${pic('c/13252-4-gizli-spiralli-ajanda-ic', { alt: 'Tarihli, ofset baskılı günlük ajanda iç sayfaları ve spiral cilt', sizes: '(min-width: 1000px) 40vw, 92vw' })}</div>
      <figcaption>İç sayfa baskısından cilde — gizli spiralli günlük ajanda.</figcaption>
    </figure>
    <div class="places reveal">
      <div class="place"><h3>Showroom</h3><p>${esc(CONTACT.showroom)}</p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent('Nur Ajanda Davutpaşa Cad. Kazım Dinçol San. Sit. Zeytinburnu İstanbul')}" rel="noopener" target="_blank">${icon('pin', 'icon icon--xs')}Yol tarifi</a></div>
      <div class="place"><h3>Fabrika</h3><p>${esc(CONTACT.factory)}</p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent('Maltepe Mah. Hastane Yolu Sk. No:6 Zeytinburnu İstanbul')}" rel="noopener" target="_blank">${icon('pin', 'icon icon--xs')}Yol tarifi</a></div>
    </div>
  </div>
</section>

<section class="section quote" id="teklif" aria-labelledby="quote-title">
  <div class="wrap quote__grid">
    <header class="reveal">
      <p class="eyebrow">05 — Teklif alın</p>
      <h2 id="quote-title" class="h2">Listenizi oluşturun, <em>gerisini birlikte netleştirelim.</em></h2>
    </header>
    <ol class="steps">
      <li class="reveal"><span>01</span><h3>Ürünleri ekleyin</h3><p>Kartlardaki “Teklife ekle” ile ya da aramadan istediğiniz ürünleri listeye alın.</p></li>
      <li class="reveal"><span>02</span><h3>Adet ve baskıyı belirtin</h3><p>Her ürün için adet girin; baskı tekniği, teslim tarihi ve notlarınızı ekleyin.</p></li>
      <li class="reveal"><span>03</span><h3>Talep özetinizi alın</h3><p>Referans numaralı özetiniz hazırlanır; ekibimiz detayları sizinle netleştirir.</p></li>
    </ol>
    <div class="quote__cta reveal">
      <button type="button" class="btn btn--red btn--lg" data-open-quote>Teklif listesini aç <span class="badge badge--light" data-count>0</span></button>
      <p class="quote__alt">ya da doğrudan ulaşın:
        <a href="${CONTACT.phoneHref}">${icon('phone', 'icon icon--xs')}${CONTACT.phone}</a>
        <a href="${CONTACT.whatsappHref}" rel="noopener" target="_blank">${icon('wa', 'icon icon--xs')}WhatsApp</a>
        <a href="mailto:${CONTACT.email}">${icon('mail', 'icon icon--xs')}${CONTACT.email}</a>
      </p>
      <p class="quote__demo">Demo: bu arayüz talep özeti oluşturur, hiçbir veri gönderilmez.</p>
    </div>
  </div>
</section>
</main>

<footer class="footer" id="iletisim">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <a href="./" class="brand brand--light" aria-label="Nur Ajanda anasayfa">${logo(true)}</a>
      <p>32 yıllık sektör tecrübesi, 3.620 m² modern üretim tesisi ve güçlü matbaa altyapısıyla kurumsal ajanda, defter ve promosyon ürünleri.</p>
      <div class="social"><a href="${CONTACT.instagram}" rel="noopener" target="_blank" aria-label="Instagram: @nurajandaa">${icon('ig')}</a><a href="${CONTACT.youtube}" rel="noopener" target="_blank" aria-label="YouTube: @NurAjanda">${icon('yt')}</a></div>
    </div>
    <nav class="footer__col" aria-label="Koleksiyonlar">
      <h2>Koleksiyonlar</h2>
      <ul>${TAXONOMY.slice(0, 7).map((g) => `<li><a href="${ext(g.url)}">${esc(g.name)}</a></li>`).join('')}<li><a href="${ext('/tum-urunler')}">Tüm ürünler</a></li></ul>
    </nav>
    <nav class="footer__col" aria-label="Kurumsal">
      <h2>Kurumsal</h2>
      <ul><li><a href="${ext('/hakkimizda')}">Hakkımızda</a></li><li><a href="${ext('/banka-hesap-bilgilerimiz')}">Banka hesap bilgileri</a></li><li><a href="${ext('/iletisim')}">İletişim formu</a></li><li><a href="${ext('/kvkk-aydinlatma-metnini')}">K.V.K.K. aydınlatma metni</a></li></ul>
    </nav>
    <div class="footer__col footer__contact">
      <h2>İletişim</h2>
      <ul>
        <li><a href="${CONTACT.phoneHref}">${icon('phone', 'icon icon--xs')}${CONTACT.phone}</a></li>
        <li><a href="${CONTACT.whatsappHref}" rel="noopener" target="_blank">${icon('wa', 'icon icon--xs')}${CONTACT.whatsapp}</a></li>
        <li><a href="mailto:${CONTACT.email}">${icon('mail', 'icon icon--xs')}${CONTACT.email}</a></li>
      </ul>
      <address><strong>Showroom</strong>${esc(CONTACT.showroom)}</address>
      <address><strong>Fabrika</strong>${esc(CONTACT.factory)}</address>
    </div>
  </div>
  <div class="wrap footer__base">
    <p>© ${year} nurajanda.com — Tüm hakları saklıdır.</p>
    <p>Bu sayfa nurajanda.com için hazırlanmış bir tasarım konseptidir. Ürün görselleri ve bilgileri nurajanda.com’dan alınmıştır.</p>
  </div>
</footer>

<nav class="dock" aria-label="Hızlı erişim">
  <button type="button" data-open-menu>${icon('grid')}<span>Kategoriler</span></button>
  <button type="button" data-open-search>${icon('search')}<span>Ara</span></button>
  <button type="button" data-open-quote class="dock__quote">${icon('list')}<span>Teklif</span><span class="badge" data-count>0</span></button>
  <a href="${CONTACT.whatsappHref}" rel="noopener" target="_blank">${icon('wa')}<span>WhatsApp</span></a>
</nav>

<dialog class="sheet sheet--menu" id="menu" aria-label="Menü">
  <div class="sheet__head">${logo()}<button type="button" class="hbtn" data-close aria-label="Menüyü kapat">${icon('close')}</button></div>
  <div class="sheet__body">
    <ul class="mnav">
      <li><a href="#koleksiyonlar" data-close-link>Koleksiyonlar</a></li>
      <li><a href="#urunler" data-close-link>Öne çıkanlar</a></li>
      <li><a href="#kisisellestirme" data-close-link>Kişiselleştirme</a></li>
      <li><a href="#uretim" data-close-link>Üretim</a></li>
      <li><a href="#teklif" data-close-link>Teklif al</a></li>
    </ul>
    <p class="sheet__label">Tüm kategoriler</p>
    <div class="accs">${mobileCats}</div>
    <div class="sheet__contact"><a class="btn btn--ink btn--block" href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a><a class="btn btn--line btn--block" href="${CONTACT.whatsappHref}" rel="noopener" target="_blank">${icon('wa')}WhatsApp ile yazın</a></div>
  </div>
</dialog>

<dialog class="search" id="search" aria-label="Ürün ara">
  <form class="search__bar" role="search" data-search-form>
    ${icon('search')}
    <label class="sr-only" for="q">Ürün, model kodu veya kategori</label>
    <input id="q" name="q" type="search" placeholder="Ürün, model kodu veya kategori ara…" autocomplete="off" enterkeyhint="search" spellcheck="false">
    <button type="button" class="hbtn" data-close aria-label="Aramayı kapat">${icon('close')}</button>
  </form>
  <div class="search__body" data-results aria-live="polite">
    <p class="search__label">Popüler aramalar</p>
    <div class="search__chips">${['Organizer', 'Gizli spiralli', 'Kalem seti', 'Hediyelik set', 'Kristal masa seti', 'Tarihsiz defter'].map((s) => `<button type="button" class="chip" data-q="${s}">${s}</button>`).join('')}</div>
  </div>
</dialog>

<dialog class="drawer" id="quote" aria-labelledby="quote-dialog-title">
  <div class="drawer__head">
    <div><p class="eyebrow">Teklif listesi</p><h2 id="quote-dialog-title" data-step-title>Seçtiğiniz ürünler</h2></div>
    <button type="button" class="hbtn" data-close aria-label="Teklif listesini kapat">${icon('close')}</button>
  </div>
  <ol class="drawer__steps" aria-label="Adımlar"><li class="is-on" data-step-dot="list">Ürünler</li><li data-step-dot="form">Bilgiler</li><li data-step-dot="summary">Özet</li></ol>
  <div class="drawer__body" data-quote-body></div>
  <div class="drawer__foot" data-quote-foot></div>
</dialog>

<div class="toast" role="status" aria-live="polite" data-toast></div>
<script type="module" src="assets/js/app.js?v=${css}"></script>
</body>
</html>`;
}
