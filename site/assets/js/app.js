/* Nur Ajanda — anasayfa konsepti etkileşimleri (framework'süz, ~ES2020) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const SITE = 'https://nurajanda.com';
const STORE_KEY = 'nurajanda-demo-quote-v1';
const fmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

/* ---------- entrance ---------- */
const start = () => requestAnimationFrame(() => root.classList.add('ready'));
if (document.fonts && document.fonts.status !== 'loaded') {
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 450))]).then(start);
} else start();
if (!reduceMotion) {
  setTimeout(() => $$('.hero__item').forEach((el) => el.classList.add('floating')), 2100);
}

/* ---------- sticky header ---------- */
const header = $('[data-header]');
const onScrollHeader = () => header.classList.toggle('is-stuck', scrollY > 8);
addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('.reveal, .mask').forEach((el) => io.observe(el));

/* ---------- count-up stats ---------- */
const counter = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    counter.unobserve(e.target);
    const el = e.target; const to = Number(el.dataset.countTo);
    const nf = new Intl.NumberFormat('tr-TR');
    if (reduceMotion) { el.textContent = nf.format(to); continue; }
    const t0 = performance.now(); const dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur); const v = Math.round(to * (1 - Math.pow(1 - k, 4)));
      el.textContent = nf.format(v);
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }
}, { threshold: 0.6 });
$$('[data-count-to]').forEach((el) => counter.observe(el));

/* ---------- hero depth: pointer + scroll parallax ---------- */
(() => {
  const stage = $('[data-stage]');
  if (!stage || reduceMotion) return;
  const layers = $$('[data-depth]', stage).map((el) => ({ el, d: Number(el.dataset.depth) }));
  let px = 0, py = 0, tx = 0, ty = 0, sy = 0, raf = 0, visible = true;
  const render = () => {
    raf = 0;
    tx += (px - tx) * 0.08; ty += (py - ty) * 0.08;
    for (const { el, d } of layers) {
      el.style.transform = `translate3d(${(tx * d * 22).toFixed(2)}px, ${(ty * d * 18 - sy * d * 0.12).toFixed(2)}px, 0)`;
    }
    if (Math.abs(px - tx) > 0.002 || Math.abs(py - ty) > 0.002) raf = requestAnimationFrame(render);
  };
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(render); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  if (finePointer) {
    $('.hero').addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2; kick();
    });
    $('.hero').addEventListener('pointerleave', () => { px = 0; py = 0; kick(); });
  }
  addEventListener('scroll', () => { sy = Math.min(scrollY, 900); kick(); }, { passive: true });
})();

/* ---------- dialogs ---------- */
const openDialogs = new Set();
function openDialog(dlg) {
  if (!dlg || dlg.open) return;
  closeMega();
  dlg.showModal();
  openDialogs.add(dlg);
  root.classList.add('is-locked');
}
function closeDialog(dlg) {
  if (!dlg || !dlg.open) return;
  dlg.close();
}
$$('dialog').forEach((dlg) => {
  dlg.addEventListener('close', () => { openDialogs.delete(dlg); if (!openDialogs.size) root.classList.remove('is-locked'); });
  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { closeDialog(dlg); return; }
    if (e.target.closest('[data-close-link]')) { closeDialog(dlg); return; }
    if (e.target === dlg) {
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeDialog(dlg);
    }
  });
});
const menu = $('#menu'), search = $('#search'), quote = $('#quote');
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open-menu],[data-open-search],[data-open-quote]');
  if (!t) return;
  if (t.hasAttribute('data-open-menu')) openDialog(menu);
  if (t.hasAttribute('data-open-search')) openSearch();
  if (t.hasAttribute('data-open-quote')) { [menu, search].forEach(closeDialog); openQuote(); }
});

/* ---------- mega menu ---------- */
const megaBtn = $('[data-mega]'); const mega = $('#mega');
let megaTimer = 0;
function setMega(open) {
  if (!megaBtn) return;
  megaBtn.setAttribute('aria-expanded', String(open));
  mega.hidden = !open;
}
function closeMega() { setMega(false); }
if (megaBtn) {
  megaBtn.addEventListener('click', () => setMega(megaBtn.getAttribute('aria-expanded') !== 'true'));
  const li = megaBtn.parentElement;
  if (finePointer) {
    li.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(() => setMega(true), 120); });
    li.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(() => setMega(false), 220); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mega.hidden) { setMega(false); megaBtn.focus(); } });
  document.addEventListener('click', (e) => { if (!mega.hidden && !li.contains(e.target)) setMega(false); });
  li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) setMega(false); });
}

/* ---------- product filters ---------- */
const grid = $('[data-grid]');
$$('[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  $$('[data-filter]').forEach((c) => { const on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
  let n = 0;
  $$('.card', grid).forEach((card) => {
    const show = f === 'all' || card.dataset.cat === f;
    card.hidden = !show;
    card.classList.remove('is-filtered-in');
    if (show) { card.style.setProperty('--n', n++); void card.offsetWidth; card.classList.add('is-filtered-in', 'is-in'); }
  });
  grid.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}));

/* ---------- technique tabs ---------- */
(() => {
  const tabs = $$('[role="tab"]');
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = e.key; let j = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % tabs.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (k === 'Home') j = 0; if (k === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });
})();

/* ==========================================================================
   Quote list (demo — nothing is sent anywhere)
   ========================================================================== */
const store = {
  load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(STORE_KEY, JSON.stringify(items)); } catch { /* private mode */ } },
};
let items = store.load().filter((i) => i && i.id && i.name);
let view = 'list';
let lastForm = null;

function commit() { store.save(items); syncBadges(); syncCards(); if (quote.open) renderQuote(); }
function count() { return items.length; }
function syncBadges() {
  const n = count();
  $$('[data-count]').forEach((b) => { if (b.textContent !== String(n)) { b.textContent = n; b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } });
  $$('[data-open-quote].hbtn--quote, .dock__quote').forEach((b) => b.setAttribute('aria-label', `Teklif listesi, ${n} ürün`));
}
function syncCards() {
  $$('.card').forEach((card) => {
    const btn = $('[data-add]', card); const inList = items.some((i) => i.id === card.dataset.id);
    btn.classList.toggle('is-added', inList);
    btn.innerHTML = inList ? `${icon('check')}<span>Listede</span>` : `${icon('plus')}<span>Teklife ekle</span>`;
    btn.setAttribute('aria-label', `${card.dataset.name} ${inList ? '— teklif listesinde, listeyi aç' : 'ürününü teklif listesine ekle'}`);
  });
}
function addItem(p, sourceImg) {
  const existing = items.find((i) => i.id === p.id);
  if (existing) { toast(`“${p.name}” zaten teklif listenizde.`, true); return; }
  items.push({ ...p, qty: Math.max(1, Number(p.min) || 1) });
  commit();
  if (sourceImg) fly(sourceImg);
  toast(`“${p.name}” teklif listesine eklendi.`, true);
}
function fromCard(card) {
  return { id: card.dataset.id, name: card.dataset.name, model: card.dataset.model, price: card.dataset.price ? Number(card.dataset.price) : null, url: card.dataset.url, thumb: card.dataset.thumb };
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const card = btn.closest('.card');
  if (!card) return;
  if (items.some((i) => i.id === card.dataset.id)) { openQuote(); return; }
  addItem(fromCard(card), $('.card__img img', card));
});

function fly(img) {
  if (reduceMotion || !img) return;
  const targets = [$('.hbtn--quote'), $('.dock__quote')].filter((t) => t && t.offsetParent !== null);
  const target = targets[0]; if (!target) return;
  const a = img.getBoundingClientRect(); const b = target.getBoundingClientRect();
  if (!a.width) return;
  const f = img.cloneNode(); f.className = 'flyer'; f.removeAttribute('loading');
  Object.assign(f.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
  document.body.appendChild(f);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2); const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = f.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.45)`, opacity: 0.95, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: 0.2 },
  ], { duration: 820, easing: 'cubic-bezier(.5,0,.2,1)' });
  anim.onfinish = () => f.remove();
}

let toastTimer = 0;
function toast(msg, withOpen) {
  const t = $('[data-toast]');
  t.innerHTML = `<span>${esc(msg)}</span>${withOpen ? '<button type="button" data-open-quote>Listeyi aç</button>' : ''}`;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 4200);
}

function openQuote() {
  view = 'list';
  renderQuote();
  openDialog(quote);
  $('[data-toast]').classList.remove('is-on');
}

const TECH_OPTS = ['Karar vermedim, önerinizi bekliyorum', 'Gofre', 'UV baskı', 'Lazer', 'Serigrafi', 'Ofset baskı (iç sayfa)'];
const subtotal = () => items.reduce((s, i) => s + (i.price ? i.price * i.qty : 0), 0);

function renderQuote() {
  const body = $('[data-quote-body]'); const foot = $('[data-quote-foot]'); const title = $('[data-step-title]');
  $$('[data-step-dot]').forEach((d) => d.classList.toggle('is-on', ['list', 'form', 'summary'].indexOf(d.dataset.stepDot) <= ['list', 'form', 'summary'].indexOf(view)));
  if (view === 'list') {
    title.textContent = 'Seçtiğiniz ürünler';
    if (!items.length) {
      const sugg = $$('.card').slice(0, 3).map((c) => `<li class="qitem"><img src="${esc(c.dataset.thumb)}" alt="" width="76" height="76"><div><h3>${esc(c.dataset.name)}</h3><p class="qitem__m">${c.dataset.price ? fmt.format(Number(c.dataset.price)) + ' + KDV' : 'Fiyat için sorunuz'}</p><div class="qitem__row"><button type="button" class="btn-add" data-sugg="${esc(c.dataset.id)}">${icon('plus')}<span>Teklife ekle</span></button></div></div></li>`).join('');
      body.innerHTML = `<div class="qempty"><p>Listeniz henüz boş.</p><p>Ürün kartlarındaki “Teklife ekle” ile ya da aramadan ürün ekleyebilirsiniz.</p></div><div class="qsugg"><p class="eyebrow">Hızlı başlangıç</p><ul>${sugg}</ul></div>`;
      foot.innerHTML = `<a class="btn btn--ink" href="#urunler" data-close>Ürünleri keşfet ${icon('arrow')}</a>`;
      return;
    }
    body.innerHTML = `<ul>${items.map((i) => `<li class="qitem" data-qid="${esc(i.id)}">
        ${i.thumb ? `<img src="${esc(i.thumb)}" alt="" width="76" height="76" loading="lazy">` : `<span class="qph" aria-hidden="true">${esc(i.name[0])}</span>`}
        <div>
          <h3><a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.name)}</a></h3>
          <p class="qitem__m">Model: ${esc(i.model || '—')} · ${i.price ? `${fmt.format(i.price)} + KDV / adet` : 'Fiyat için sorunuz'}</p>
          <div class="qitem__row">
            <div class="qty" role="group" aria-label="${esc(i.name)} adet">
              <button type="button" data-step="-1" aria-label="Adedi azalt">${icon('minus')}</button>
              <input type="number" inputmode="numeric" min="1" max="100000" value="${i.qty}" aria-label="Adet" data-qty>
              <button type="button" data-step="1" aria-label="Adedi artır">${icon('plus')}</button>
            </div>
            <div class="qitem__price">${i.price ? `Ara toplam<b>${fmt.format(i.price * i.qty)}</b>` : ''}</div>
          </div>
          <button type="button" class="qrm" data-remove>${icon('trash', 'icon icon--xs')}Listeden çıkar</button>
        </div></li>`).join('')}</ul>
      <p class="qnote">Ara toplam, nurajanda.com’daki KDV hariç birim fiyatlarla hesaplanan ön bilgidir. Kesin fiyat; adet ve baskı tercihine göre teklifte belirlenir.</p>`;
    foot.innerHTML = `<div class="qsum"><span>${items.length} ürün · ara toplam (KDV hariç)</span><strong data-subtotal>${fmt.format(subtotal())}</strong></div><button type="button" class="btn btn--ink" data-go="form">Devam et: talep bilgileri ${icon('arrow')}</button>`;
  } else if (view === 'form') {
    title.textContent = 'Talep bilgileri';
    const v = lastForm || {};
    const today = new Date().toISOString().slice(0, 10);
    body.innerHTML = `<form class="form" id="qform" novalidate>
      <div class="field"><label for="f-company">Firma adı</label><input id="f-company" name="company" autocomplete="organization" required value="${esc(v.company)}"></div>
      <div class="form__row">
        <div class="field"><label for="f-name">Ad soyad</label><input id="f-name" name="name" autocomplete="name" required value="${esc(v.name)}"></div>
        <div class="field"><label for="f-phone">Telefon <small>(isteğe bağlı)</small></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" value="${esc(v.phone)}"></div>
      </div>
      <div class="field"><label for="f-email">E-posta</label><input id="f-email" name="email" type="email" autocomplete="email" required value="${esc(v.email)}"></div>
      <div class="form__row">
        <div class="field"><label for="f-tech">Baskı tercihi</label><select id="f-tech" name="tech">${TECH_OPTS.map((o) => `<option${v.tech === o ? ' selected' : ''}>${o}</option>`).join('')}</select></div>
        <div class="field"><label for="f-date">İstenen teslim <small>(isteğe bağlı)</small></label><input id="f-date" name="date" type="date" min="${today}" value="${esc(v.date)}"></div>
      </div>
      <div class="field"><label for="f-note">Notunuz <small>(logo rengi, kişiselleştirme detayı vb.)</small></label><textarea id="f-note" name="note">${esc(v.note)}</textarea></div>
      <div class="field"><label class="check" style="display:flex;gap:10px;align-items:flex-start;font-weight:500"><input type="checkbox" name="kvkk" required style="width:22px;height:22px;min-height:0;margin-top:2px;flex:none"${v.kvkk ? ' checked' : ''}><span>Kişisel verilerin işlenmesine ilişkin <a href="${SITE}/kvkk-aydinlatma-metnini" target="_blank" rel="noopener" style="text-decoration:underline">K.V.K.K. aydınlatma metnini</a> okudum.</span></label></div>
      <p class="qnote">Demo arayüzü: bu form hiçbir yere veri göndermez; yalnızca tarayıcınızda bir talep özeti oluşturur.</p>
    </form>`;
    foot.innerHTML = `<div class="row"><button type="button" class="btn btn--line" data-go="list">Geri</button><button type="submit" form="qform" class="btn btn--red">Talep özetini oluştur</button></div>`;
    $('#qform').addEventListener('submit', onSubmit);
  } else {
    title.textContent = 'Talep özeti';
    const f = lastForm; const total = subtotal(); const ask = items.filter((i) => !i.price);
    body.innerHTML = `<div class="ok" role="status">${icon('check')}<span><strong>Demo talep özeti oluşturuldu.</strong> Bu bir tasarım demosudur — talebiniz hiçbir yere gönderilmedi.</span></div>
      <div class="sumcard">
        <div class="sumcard__ref"><span class="eyebrow">Referans</span><b>${esc(f.ref)}</b></div>
        <dl><dt>Tarih</dt><dd>${esc(f.created)}</dd><dt>Firma</dt><dd>${esc(f.company)}</dd><dt>Yetkili</dt><dd>${esc(f.name)}</dd><dt>E-posta</dt><dd>${esc(f.email)}</dd>${f.phone ? `<dt>Telefon</dt><dd>${esc(f.phone)}</dd>` : ''}<dt>Baskı</dt><dd>${esc(f.tech)}</dd>${f.date ? `<dt>Teslim</dt><dd>${esc(new Date(f.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }))}</dd>` : ''}${f.note ? `<dt>Not</dt><dd>${esc(f.note)}</dd>` : ''}</dl>
        <table><thead><tr><th>Ürün</th><th>Adet</th><th>Liste fiyatı</th></tr></thead>
        <tbody>${items.map((i) => `<tr><td>${esc(i.name)}<br><small style="color:var(--muted)">${esc(i.model || '')}</small></td><td>${i.qty.toLocaleString('tr-TR')}</td><td>${i.price ? fmt.format(i.price * i.qty) : 'Sorunuz'}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td colspan="2">Ara toplam (KDV hariç)</td><td>${fmt.format(total)}</td></tr></tfoot></table>
        ${ask.length ? `<p class="qnote">${ask.length} ürün için fiyat teklif aşamasında paylaşılır.</p>` : ''}
      </div>`;
    foot.innerHTML = `<div class="row"><button type="button" class="btn btn--line" data-copy>Özeti kopyala</button><button type="button" class="btn btn--ink" data-print>Yazdır / PDF</button></div><button type="button" class="btn btn--line" style="margin-top:10px;min-height:46px;border:0" data-go="list">Listeye dön</button>`;
  }
}

function onSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget; let firstBad = null;
  $$('.field__err', form).forEach((x) => x.remove());
  for (const el of $$('input,select,textarea', form)) {
    el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
    let msg = '';
    if (el.required && el.type === 'checkbox' && !el.checked) msg = 'Devam etmek için onaylayın.';
    else if (el.required && !el.value.trim()) msg = 'Bu alan gerekli.';
    else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value)) msg = 'Geçerli bir e-posta adresi girin.';
    if (msg) {
      const id = `${el.name}-err`; const p = document.createElement('p'); p.className = 'field__err'; p.id = id; p.textContent = msg;
      el.closest('.field').appendChild(p); el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id);
      firstBad = firstBad || el;
    }
  }
  if (firstBad) { firstBad.focus(); return; }
  const d = Object.fromEntries(new FormData(form).entries());
  const now = new Date();
  const ref = `DEMO-${now.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  lastForm = { ...d, kvkk: !!d.kvkk, ref, created: now.toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) };
  view = 'summary'; renderQuote();
  $('[data-quote-body]').scrollTop = 0;
  $('.ok', quote)?.setAttribute('tabindex', '-1'); $('.ok', quote)?.focus();
}

function summaryText() {
  const f = lastForm;
  const lines = [`Nur Ajanda — teklif talebi (DEMO, gönderilmedi)`, `Referans: ${f.ref}`, `Tarih: ${f.created}`, `Firma: ${f.company}`, `Yetkili: ${f.name}`, `E-posta: ${f.email}`];
  if (f.phone) lines.push(`Telefon: ${f.phone}`);
  lines.push(`Baskı tercihi: ${f.tech}`);
  if (f.date) lines.push(`İstenen teslim: ${f.date}`);
  if (f.note) lines.push(`Not: ${f.note}`);
  lines.push('', 'Ürünler:');
  items.forEach((i) => lines.push(`- ${i.name} (${i.model}) × ${i.qty}${i.price ? ` — ${fmt.format(i.price * i.qty)} + KDV` : ' — fiyat sorulacak'}`));
  lines.push('', `Ara toplam (KDV hariç, liste fiyatı): ${fmt.format(subtotal())}`);
  return lines.join('\n');
}

quote.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (go) { if (view === 'form' && go.dataset.go === 'list') saveDraft(); view = go.dataset.go; renderQuote(); $('[data-quote-body]').scrollTop = 0; return; }
  const sugg = e.target.closest('[data-sugg]');
  if (sugg) { const card = $(`.card[data-id="${CSS.escape(sugg.dataset.sugg)}"]`); if (card) addItem(fromCard(card)); return; }
  const li = e.target.closest('[data-qid]');
  if (li && e.target.closest('[data-remove]')) {
    const it = items.find((i) => i.id === li.dataset.qid);
    items = items.filter((i) => i.id !== li.dataset.qid); commit();
    toast(`“${it ? it.name : 'Ürün'}” listeden çıkarıldı.`);
    return;
  }
  const stepBtn = e.target.closest('[data-step]');
  if (li && stepBtn) {
    const it = items.find((i) => i.id === li.dataset.qid);
    it.qty = Math.min(100000, Math.max(1, it.qty + Number(stepBtn.dataset.step)));
    $('[data-qty]', li).value = it.qty; updateLine(li, it); store.save(items);
  }
  if (e.target.closest('[data-copy]')) {
    const txt = summaryText();
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Talep özeti panoya kopyalandı.'), () => toast('Kopyalama desteklenmiyor; Yazdır / PDF seçeneğini kullanın.'));
  }
  if (e.target.closest('[data-print]')) window.print();
});
quote.addEventListener('input', (e) => {
  const inp = e.target.closest('[data-qty]'); if (!inp) return;
  const li = inp.closest('[data-qid]'); const it = items.find((i) => i.id === li.dataset.qid);
  const v = Math.floor(Number(inp.value)); if (!Number.isFinite(v) || v < 1) return;
  it.qty = Math.min(100000, v); updateLine(li, it); store.save(items);
});
quote.addEventListener('change', (e) => { const inp = e.target.closest('[data-qty]'); if (inp) { const it = items.find((i) => i.id === inp.closest('[data-qid]').dataset.qid); inp.value = it.qty; } });
function updateLine(li, it) {
  const p = $('.qitem__price b', li); if (p && it.price) p.textContent = fmt.format(it.price * it.qty);
  const s = $('[data-subtotal]'); if (s) s.textContent = fmt.format(subtotal());
}
function saveDraft() { const f = $('#qform'); if (f) lastForm = { ...(lastForm || {}), ...Object.fromEntries(new FormData(f).entries()) }; }

/* ==========================================================================
   Search (catalog snapshot from nurajanda.com, lazy-loaded)
   ========================================================================== */
const TR = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
const norm = (s) => String(s || '').toLocaleLowerCase('tr').replace(/[çğıöşüâîû]/g, (c) => TR[c] || c).normalize('NFD').replace(/[̀-ͯ]/g, '');
let catalog = null; let cats = null; let active = -1;
const results = $('[data-results]'); const q = $('#q');
const initialResults = results.innerHTML;

async function loadCatalog() {
  if (catalog) return;
  try {
    const r = await fetch('assets/data/catalog.json');
    const data = await r.json();
    catalog = data.products.map((p) => ({ ...p, k: norm(`${p.n} ${p.m}`) }));
  } catch { catalog = []; }
  cats = [];
  $$('.mega__group').forEach((g) => {
    const head = $('.mega__head', g);
    cats.push({ n: head.textContent, u: head.href, g: '', k: norm(head.textContent) });
    $$('li a', g).forEach((a) => cats.push({ n: a.textContent, u: a.href, g: head.textContent, k: norm(a.textContent) }));
  });
}
function openSearch() {
  openDialog(search);
  q.focus(); q.select();
  loadCatalog();
}
function highlight(text, terms) {
  let out = esc(text);
  for (const t of terms) {
    if (t.length < 2) continue;
    const idx = norm(text).indexOf(t);
    if (idx > -1) { const raw = text.slice(idx, idx + t.length); out = out.replace(esc(raw), `<mark>${esc(raw)}</mark>`); }
  }
  return out;
}
async function runSearch() {
  const raw = q.value.trim();
  if (!raw) { results.innerHTML = initialResults; active = -1; return; }
  await loadCatalog();
  const terms = norm(raw).split(/\s+/).filter(Boolean);
  const score = (k) => terms.every((t) => k.includes(t)) ? terms.reduce((s, t) => s + (k.startsWith(t) ? 3 : k.includes(` ${t}`) ? 2 : 1), 0) : 0;
  const cs = cats.map((c) => [score(c.k), c]).filter(([s]) => s).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([, c]) => c);
  const ps = catalog.map((p) => [score(p.k), p]).filter(([s]) => s).sort((a, b) => b[0] - a[0]).slice(0, 12).map(([, p]) => p);
  const all = `${SITE}/index.php?route=product/search&search=${encodeURIComponent(raw)}`;
  if (!cs.length && !ps.length) {
    results.innerHTML = `<p class="search__empty">“${esc(raw)}” için bu sayfadaki ürün seçkisinde sonuç bulunamadı.</p><a class="search__all" href="${all}" target="_blank" rel="noopener">nurajanda.com’da tüm ürünlerde ara ${icon('arrow-ne', 'icon icon--xs')}</a>`;
    return;
  }
  results.innerHTML = `${cs.length ? `<p class="search__label">Kategoriler</p>${cs.map((c) => `<a class="scat" href="${c.u}" data-r><span>${highlight(c.n, terms)}</span><small>${esc(c.g || 'Ana grup')}</small></a>`).join('')}` : ''}
    ${ps.length ? `<p class="search__label">Ürünler</p>${ps.map((p) => `<div class="sres" data-r><img src="${p.t || ''}" alt="" width="56" height="56" loading="lazy"><a href="${p.u}" target="_blank" rel="noopener"><span class="sres__t">${highlight(p.n, terms)}</span><span class="sres__m" style="display:block">${esc(p.m)} · ${p.p ? `₺${esc(p.p)} + KDV` : 'Fiyat için sorunuz'}</span></a><div class="sres__a"><button type="button" class="hbtn" data-sadd="${esc(p.u)}" aria-label="${esc(p.n)} ürününü teklif listesine ekle">${icon('plus', 'icon icon--xs')}Ekle</button></div></div>`).join('')}` : ''}
    <a class="search__all" href="${all}" target="_blank" rel="noopener">nurajanda.com’da tüm sonuçları gör ${icon('arrow-ne', 'icon icon--xs')}</a>`;
  active = -1;
}
let searchTimer = 0;
q.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 90); });
$('[data-search-form]').addEventListener('submit', (e) => {
  e.preventDefault();
  const first = $$('[data-r]', results)[Math.max(active, 0)];
  const link = first && (first.matches('a') ? first : $('a', first));
  if (link) link.click();
});
q.addEventListener('keydown', (e) => {
  const rows = $$('[data-r]', results); if (!rows.length) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    active = (active + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
    rows.forEach((r, i) => r.classList.toggle('is-active', i === active));
    rows[active].scrollIntoView({ block: 'nearest' });
  }
});
results.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-q]');
  if (chip) { q.value = chip.dataset.q; runSearch(); q.focus(); return; }
  const add = e.target.closest('[data-sadd]');
  if (add) {
    const p = catalog.find((x) => x.u === add.dataset.sadd);
    const featured = $$('.card').find((c) => c.dataset.url === p.u);
    const item = featured ? fromCard(featured) : { id: p.u, name: p.n, model: p.m, price: p.p ? Number(p.p.replace(/\./g, '').replace(',', '.')) : null, url: p.u, thumb: p.t };
    addItem(item);
    add.innerHTML = `${icon('check', 'icon icon--xs')}Eklendi`;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.target.closest('input,textarea,select,[contenteditable]') && !openDialogs.size) { e.preventDefault(); openSearch(); }
});

/* init */
syncBadges(); syncCards();
