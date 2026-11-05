// Public site chrome: header, mobile menu, language switcher, footer, announcement banner
(function () {
  const { esc, pick, $, api, safeUrl } = CF, t = i18n.t;
  const here = location.pathname.split('/').pop() || 'index.html';
  const NAV = [['index.html', 'nav_home'], ['about.html', 'nav_about'], ['demands.html', 'nav_demands'], ['blog.html', 'nav_blog'], ['join.html', 'nav_join'], ['contact.html', 'nav_contact']];
  const cur = (h) => (h === here || (h === 'blog.html' && here === 'article.html') ? 'aria-current="page"' : '');
  const brand = '<img src="assets/img/logo.png" alt="" width="36" height="36"><span><span class="o">CORN</span> <span class="b">FREE</span></span>';

  $('#site-header').innerHTML = `<div class="wrap bar">
    <a class="brand" href="index.html" aria-label="CORN FREE">${brand}</a>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" data-i18n-aria="menu"><span></span><span></span><span></span></button>
    <nav id="menu" class="menu">${NAV.map(([h, k]) => `<a href="${h}" ${h === 'join.html' ? 'class="btn sm"' : ''} ${cur(h)} data-i18n="${k}"></a>`).join('')}
      <button class="lang" id="langBtn" type="button" data-i18n="lang_switch"></button></nav></div>`;

  const menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  $('#langBtn').onclick = () => i18n.set(i18n.lang() === 'en' ? 'ar' : 'en');

  // Footer (settings from API override defaults)
  let S = {};
  $('#site-footer').innerHTML = `<div class="wrap foot">
    <div><div class="brand">${brand}</div><p id="footTag"></p><p id="footText"></p></div>
    <div><ul>${NAV.slice(0, 4).map(([h, k]) => `<li><a href="${h}" data-i18n="${k}"></a></li>`).join('')}<li><a href="privacy.html" data-i18n="nav_privacy"></a></li></ul></div>
    <div><ul><li><a href="join.html" data-i18n="nav_join"></a></li><li><a href="contact.html" data-i18n="nav_contact"></a></li></ul><ul id="footSocial"></ul></div>
  </div><div class="wrap copy">© ${new Date().getFullYear()} CORN FREE. <span data-i18n="footer_rights"></span></div>`;
  function footer() {
    $('#footTag').textContent = pick(S, 'tagline') || t('brand_tag');
    $('#footText').textContent = pick(S, 'footer_text') || t('footer_default');
    const soc = [['social_twitter', 'X'], ['social_facebook', 'Facebook'], ['social_instagram', 'Instagram'], ['social_youtube', 'YouTube']]
      .filter(([k]) => S[k] && /^https:\/\//.test(S[k])).map(([k, n]) => `<li><a href="${esc(S[k])}" target="_blank" rel="noopener noreferrer">${n}</a></li>`);
    if (S.contact_email) soc.push(`<li><a href="mailto:${esc(S.contact_email)}">${esc(S.contact_email)}</a></li>`);
    $('#footSocial').innerHTML = soc.join('');
  }
  api('/api/settings').then((r) => { S = r.data || {}; footer(); }).catch((e) => console.warn('settings', e));

  // Announcement banner (highest-priority active, dismissal remembered in localStorage)
  const KEY = 'cf_dismissed';
  const dismissed = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  let ann = null;
  function banner() {
    const box = $('#announcement');
    if (!ann) { box.innerHTML = ''; return; }
    const url = safeUrl(ann.cta_url), cta = url && pick(ann, 'cta_text') ? `<a class="btn sm" href="${esc(url)}">${esc(pick(ann, 'cta_text'))}</a>` : '';
    box.innerHTML = `<div class="announce ${esc(ann.type)}" role="status"><div class="wrap"><p><strong>${esc(pick(ann, 'title'))}</strong> ${esc(pick(ann, 'message'))}</p>${cta}<button type="button" class="x" aria-label="${esc(t('dismiss'))}">×</button></div></div>`;
    box.querySelector('.x').onclick = () => {
      try { localStorage.setItem(KEY, JSON.stringify([...dismissed(), ann.id + ':' + ann.updated_at].slice(-50))); } catch { /* storage unavailable */ }
      ann = null; banner();
    };
  }
  api('/api/announcements').then((r) => { const d = dismissed(); ann = r.data.find((a) => !d.includes(a.id + ':' + a.updated_at)) || null; banner(); }).catch((e) => console.warn('announcements', e));


  // Supporter counter: real number from GET /api/stats (D1). Hidden if the API is unreachable.
  const box = $('#counter');
  if (box) {
    let st = null;
    const fmt = (n) => Number(n).toLocaleString(i18n.lang() === 'ar' ? 'ar-EG' : 'en-US');
    const countUp = (el, to) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || to < 2) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 1200;
      (function f(now) { const p = Math.min(1, (now - t0) / dur); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f); })(t0);
    };
    const draw = (anim) => {
      if (!st) { box.innerHTML = ''; return; }
      const pct = Math.min(100, Math.round((st.supporters / st.goal) * 100));
      box.innerHTML = `<div class="counter"><div class="c-top"><span class="live"></span><span>${esc(t('cnt_label'))}</span></div>
        ${st.supporters > 0 ? `<div class="c-num" id="cNum">${fmt(anim ? 0 : st.supporters)}</div>` : `<div class="c-zero">${esc(t('cnt_zero'))}</div>`}
        <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${anim ? 0 : pct}%"></i></div>
        <div class="c-foot"><span>${esc(t('cnt_goal', { goal: fmt(st.goal) }))} · ${esc(t('cnt_pct', { pct }))}</span>${box.dataset.nojoin ? '' : `<a class="btn sm" href="join.html">${esc(t('cnt_join'))}</a>`}</div></div>`;
      if (anim) { requestAnimationFrame(() => { box.querySelector('.prog i').style.width = pct + '%'; }); const n = $('#cNum'); if (n) countUp(n, st.supporters); }
    };
    i18n.onChange(() => draw(false));
    api('/api/stats').then((r) => { st = r.data; draw(true); }).catch((e) => { console.warn('stats', e); box.innerHTML = ''; });
  }

  i18n.onChange(() => { footer(); banner(); });
  footer();
  i18n.apply();
})();
