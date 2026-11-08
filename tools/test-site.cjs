// End-to-end checks + screenshots for the homepage demo.
// Usage: node tools/serve.mjs site 4173 &  NODE_PATH=$(npm root -g) node tools/test-site.cjs http://localhost:4173/
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.argv[2] || 'http://localhost:4173/';
const OUT = path.resolve(__dirname, '../docs/screenshots');
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? ' — ' + info : ''}`); };

const VIEWPORTS = [
  ['360', { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }],
  ['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ['430', { viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true }],
  ['768', { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true }],
  ['1024', { viewport: { width: 1024, height: 768 } }],
  ['1440', { viewport: { width: 1440, height: 900 } }],
];

async function revealAll(page) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

(async () => {
  const browser = await chromium.launch();

  // ---------- layout checks at every width ----------
  for (const [name, opts] of VIEWPORTS) {
    const ctx = await browser.newContext({ ...opts, deviceScaleFactor: name === '1440' || name === '390' ? 2 : 1, locale: 'tr-TR' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}/new-${name}-fold.png` });
    await revealAll(page);
    const m = await page.evaluate(() => {
      const imgs = [...document.images];
      const tooSmall = [...document.querySelectorAll('main *, footer *, header *')].filter((e) => e.childElementCount === 0 && e.textContent.trim() && e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => e.textContent.trim().slice(0, 30));
      const smallTargets = [...document.querySelectorAll('main a, main button, header button, .dock > *')].filter((e) => { const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.height < 40 || r.width < 40) && !e.closest('.card__title,.footer,.tile,.promo__list,.mega,.note'); }).map((e) => (e.textContent.trim() || e.getAttribute('aria-label') || e.className).slice(0, 30));
      return {
        scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
        broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        h1: document.querySelectorAll('h1').length,
        tooSmall, smallTargets,
      };
    });
    ok(`[${name}] yatay taşma yok`, m.scrollW <= m.clientW, `${m.scrollW}/${m.clientW}`);
    ok(`[${name}] kırık görsel yok`, m.broken.length === 0, m.broken.join(', '));
    ok(`[${name}] tek H1`, m.h1 === 1);
    ok(`[${name}] 12 px altı metin yok`, m.tooSmall.length === 0, m.tooSmall.slice(0, 5).join(' | '));
    ok(`[${name}] dokunma hedefleri ≥ 40 px`, m.smallTargets.length === 0, m.smallTargets.slice(0, 6).join(' | '));
    ok(`[${name}] konsol/ağ hatası yok`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await page.screenshot({ path: `${OUT}/new-${name}-full.png`, fullPage: true });
    await ctx.close();
  }

  // ---------- interactions (mobile 390 + desktop 1440) ----------
  for (const [name, opts] of [['390', VIEWPORTS[1][1]], ['1440', VIEWPORTS[5][1]]]) {
    const ctx = await browser.newContext({ ...opts, locale: 'tr-TR', deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const mobile = name === '390';

    // filters
    await page.locator('#urunler').scrollIntoViewIfNeeded();
    await page.click('[data-filter="organizer"]');
    await page.waitForTimeout(400);
    const visible = await page.$$eval('.card', (cs) => cs.filter((c) => !c.hidden).map((c) => c.dataset.cat));
    ok(`[${name}] filtre: Organizer`, visible.length === 3 && visible.every((c) => c === 'organizer'), visible.join(','));
    await page.click('[data-filter="all"]');

    // add to quote
    await page.click('.card[data-id="maslak-fm"] [data-add]');
    await page.waitForTimeout(300);
    await page.click('.card[data-id="ortakoy-l"] [data-add]');
    await page.waitForTimeout(900);
    const badge = await page.textContent(mobile ? '.dock [data-count]' : '.hbtn--quote [data-count]');
    ok(`[${name}] teklif listesine ekleme + rozet`, badge.trim() === '2', `rozet=${badge}`);
    const toastVisible = await page.isVisible('[data-toast].is-on');
    ok(`[${name}] bildirim (toast) görünür`, toastVisible);
    if (name === '1440') await page.screenshot({ path: `${OUT}/new-1440-toast.png` });

    // open drawer
    await page.click(mobile ? '.dock__quote' : '.hbtn--quote');
    await page.waitForTimeout(700);
    ok(`[${name}] teklif listesi açılıyor`, await page.isVisible('#quote[open]'));
    const n = await page.$$eval('#quote .qitem', (l) => l.length);
    ok(`[${name}] listede 2 ürün`, n === 2, `n=${n}`);
    // qty change
    await page.fill('#quote .qitem[data-qid="maslak-fm"] [data-qty]', '250');
    await page.waitForTimeout(150);
    const sub = await page.textContent('[data-subtotal]');
    ok(`[${name}] adet → ara toplam (250×670 + 1×208)`, sub.replace(/\s/g, '').includes('167.708,00'), sub);
    await page.click('#quote .qitem[data-qid="ortakoy-l"] [data-step="1"]');
    const q2 = await page.inputValue('#quote .qitem[data-qid="ortakoy-l"] [data-qty]');
    ok(`[${name}] + butonu adet artırır`, q2 === '2');
    await page.screenshot({ path: `${OUT}/new-${name}-quote-list.png` });
    // remove
    await page.click('#quote .qitem[data-qid="ortakoy-l"] [data-remove]');
    await page.waitForTimeout(200);
    ok(`[${name}] listeden çıkarma`, (await page.$$eval('#quote .qitem', (l) => l.length)) === 1);
    // form validation
    await page.click('[data-go="form"]');
    await page.click('button[form="qform"]');
    const errs = await page.$$eval('.field__err', (l) => l.length);
    ok(`[${name}] form doğrulama hataları`, errs >= 3, `hata=${errs}`);
    await page.fill('#f-company', 'Örnek Holding A.Ş.');
    await page.fill('#f-name', 'Ayşe Yılmaz');
    await page.fill('#f-email', 'ayse@ornek.com.tr');
    await page.selectOption('#f-tech', 'Gofre');
    await page.fill('#f-note', 'Kapakta tek renk logo, 250 adet.');
    await page.check('input[name="kvkk"]');
    await page.click('button[form="qform"]');
    await page.waitForTimeout(400);
    const ref = await page.textContent('.sumcard__ref b');
    ok(`[${name}] demo talep özeti + referans`, /^DEMO-\d{6}-[A-Z0-9]{4}$/.test(ref.trim()), ref);
    const demoNote = await page.textContent('.ok');
    ok(`[${name}] "gönderilmedi" demo uyarısı`, demoNote.includes('hiçbir yere gönderilmedi'));
    await page.screenshot({ path: `${OUT}/new-${name}-quote-summary.png` });
    // persistence
    await page.keyboard.press('Escape');
    await page.reload({ waitUntil: 'networkidle' });
    const persisted = await page.textContent(mobile ? '.dock [data-count]' : '.hbtn--quote [data-count]');
    ok(`[${name}] liste tarayıcıda korunuyor`, persisted.trim() === '1');

    // search
    if (mobile) await page.click('.dock [data-open-search]'); else await page.keyboard.press('/');
    await page.waitForTimeout(300);
    ok(`[${name}] arama açılıyor`, await page.isVisible('#search[open]'));
    await page.fill('#q', 'organizer');
    await page.waitForTimeout(600);
    const sres = await page.$$eval('.sres', (l) => l.length);
    const scat = await page.$$eval('.scat', (l) => l.length);
    ok(`[${name}] arama sonuçları (ürün+kategori)`, sres > 3 && scat >= 1, `ürün=${sres} kategori=${scat}`);
    await page.fill('#q', 'kucuksu');
    await page.waitForTimeout(400);
    ok(`[${name}] Türkçe karakter duyarsız arama`, (await page.$$eval('.sres', (l) => l.map((x) => x.textContent))).some((t) => t.includes('Küçüksu')));
    await page.fill('#q', 'kristal');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/new-${name}-search.png` });
    await page.click('.sres [data-sadd]');
    await page.waitForTimeout(300);
    const b3 = await page.textContent(mobile ? '.dock [data-count]' : '.hbtn--quote [data-count]');
    ok(`[${name}] aramadan teklife ekleme`, b3.trim() === '2', b3);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    ok(`[${name}] arama ESC ile kapanıyor`, !(await page.isVisible('#search[open]')));

    // technique tabs
    await page.locator('#kisisellestirme').scrollIntoViewIfNeeded();
    await page.click('#tab-lazer');
    await page.waitForTimeout(300);
    const panelOk = await page.evaluate(() => !document.querySelector('#panel-lazer').hidden && document.querySelector('#panel-gofre').hidden);
    ok(`[${name}] baskı tekniği sekmeleri`, panelOk);
    await page.focus('#tab-lazer'); await page.keyboard.press('ArrowRight');
    ok(`[${name}] sekmeler klavye ile`, await page.evaluate(() => document.activeElement.id === 'tab-serigrafi' && !document.querySelector('#panel-serigrafi').hidden));

    if (mobile) {
      await page.click('.hbtn--menu');
      await page.waitForTimeout(500);
      ok(`[${name}] mobil menü açılıyor`, await page.isVisible('#menu[open]'));
      await page.click('#menu summary >> nth=1');
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${OUT}/new-390-menu.png` });
      await page.click('#menu [data-close]');
      await page.waitForTimeout(300);
      ok(`[${name}] mobil menü kapanıyor`, !(await page.isVisible('#menu[open]')));
    } else {
      await page.evaluate(() => scrollTo(0, 0));
      await page.click('[data-mega]');
      await page.waitForTimeout(500);
      ok(`[${name}] mega menü açılıyor`, await page.isVisible('#mega'));
      await page.screenshot({ path: `${OUT}/new-1440-megamenu.png` });
      await page.keyboard.press('Escape');
      ok(`[${name}] mega menü ESC ile kapanıyor`, !(await page.isVisible('#mega')));
    }
    ok(`[${name}] etkileşimlerde JS hatası yok`, errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- reduced motion ----------
  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await rm.newPage();
  await rp.goto(URL, { waitUntil: 'networkidle' });
  const anim = await rp.evaluate(() => getComputedStyle(document.querySelector('.band__track')).animationName);
  const revealOpacity = await rp.evaluate(() => getComputedStyle(document.querySelector('.reveal')).opacity);
  ok('[reduced-motion] kayan bant durur, içerik gizlenmez', anim === 'none' && revealOpacity === '1', `${anim}/${revealOpacity}`);
  await rm.close();

  await browser.close();
  const failed = results.filter((r) => !r.pass);
  fs.writeFileSync(path.resolve(__dirname, '../docs/test-results.json'), JSON.stringify({ date: new Date().toISOString(), total: results.length, failed: failed.length, results }, null, 1));
  console.log(`\n${results.length - failed.length}/${results.length} PASS`);
  process.exit(failed.length ? 1 : 0);
})();
