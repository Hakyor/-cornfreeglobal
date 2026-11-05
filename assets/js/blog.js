// Home latest posts, blog listing (search/category/pagination/featured), single article
(function () {
  const { esc, pick, fmtDate, api, $ } = CF, t = i18n.t;
  const page = document.body.dataset.page;
  const catName = (p) => pick({ name_en: p.category_name_en, name_ar: p.category_name_ar }, 'name');

  function card(p) {
    const href = 'article.html?slug=' + encodeURIComponent(p.slug), cat = catName(p);
    const img = /^https:\/\//.test(p.cover_image_url || '') ? `<img src="${esc(p.cover_image_url)}" alt="" loading="lazy">` : '';
    return `<article class="card post">${img}<div class="pb"><div>${p.featured ? `<span class="chip hot">${esc(t('featured'))}</span> ` : ''}${cat ? `<span class="chip">${esc(cat)}</span>` : ''}</div>
      <h3><a href="${href}">${esc(pick(p, 'title'))}</a></h3><p>${esc(pick(p, 'excerpt'))}</p>
      <div class="meta">${esc(fmtDate(p.published_at))}</div><a class="more" href="${href}">${esc(t('read_more'))}</a></div></article>`;
  }
  // Plain text -> safe HTML: blank line = paragraph, "## " = heading, "- " lines = list. Everything is escaped.
  function renderContent(txt) {
    return String(txt || '').split(/\n{2,}/).map((b) => {
      b = b.trim(); if (!b) return '';
      if (b.startsWith('## ')) return `<h2>${esc(b.slice(3))}</h2>`;
      const lines = b.split('\n');
      if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${esc(l.slice(2))}</li>`).join('')}</ul>`;
      return `<p>${esc(b).replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }
  function retryHook(el, fn) { const b = el.querySelector('[data-retry]'); if (b) b.onclick = fn; }

  function home() {
    const el = $('#latest'); let rows = null;
    const draw = () => { el.innerHTML = rows === null ? '' : rows.length ? rows.map(card).join('') : CF.state('empty'); };
    const load = async () => {
      el.innerHTML = CF.state('loading');
      try { rows = (await api('/api/posts?limit=3')).data; draw(); }
      catch (e) { console.warn(e); rows = null; el.innerHTML = CF.state('error', true); retryHook(el, load); }
    };
    i18n.onChange(draw); load();
  }

  function blog() {
    const grid = $('#grid'), st = $('#state'), pg = $('#pager'), feat = $('#featured');
    const qs = new URLSearchParams(location.search);
    const s = { page: Math.max(1, +qs.get('page') || 1), q: qs.get('q') || '', cat: qs.get('cat') || '' };
    let cats = [], rows = null, meta = null, fRows = [];
    $('#q').value = s.q;

    const drawCats = () => {
      $('#cat').innerHTML = `<option value="">${esc(t('all_cats'))}</option>` + cats.map((c) => `<option value="${esc(c.slug)}">${esc(pick(c, 'name'))} (${c.post_count})</option>`).join('');
      $('#cat').value = s.cat;
    };
    const draw = () => {
      drawCats();
      feat.innerHTML = fRows.length ? `<h2>${esc(t('featured_title'))}</h2><div class="cards">${fRows.map(card).join('')}</div><hr style="border-color:var(--line);margin:32px 0">` : '';
      grid.innerHTML = rows === null ? '' : rows.map(card).join('');
      st.innerHTML = rows !== null && !rows.length ? CF.state('empty') : '';
      CF.pager(pg, meta, (p) => { s.page = p; load(); window.scrollTo({ top: 0 }); });
    };
    async function load() {
      st.innerHTML = CF.state('loading'); grid.innerHTML = ''; pg.innerHTML = '';
      const p = new URLSearchParams({ page: s.page, limit: 9 });
      if (s.q) p.set('q', s.q); if (s.cat) p.set('category', s.cat);
      const u = new URLSearchParams(); if (s.q) u.set('q', s.q); if (s.cat) u.set('cat', s.cat); if (s.page > 1) u.set('page', s.page);
      history.replaceState(null, '', u.toString() ? '?' + u : location.pathname);
      try {
        const r = await api('/api/posts?' + p); rows = r.data; meta = r.meta;
        fRows = !s.q && !s.cat && s.page === 1 ? (await api('/api/posts?featured=1&limit=3').catch(() => ({ data: [] }))).data : [];
        draw();
      } catch (e) { console.warn(e); rows = null; meta = null; st.innerHTML = CF.state('error', true); retryHook(st, load); }
    }
    $('#filters').onsubmit = (e) => { e.preventDefault(); s.q = $('#q').value.trim(); s.cat = $('#cat').value; s.page = 1; load(); };
    $('#cat').onchange = () => $('#filters').requestSubmit();
    i18n.onChange(draw);
    api('/api/categories').then((r) => { cats = r.data; drawCats(); }).catch((e) => console.warn(e));
    load();
  }

  function article() {
    const el = $('#article'), slug = new URLSearchParams(location.search).get('slug');
    let p = null, missing = false;
    const draw = () => {
      if (missing) { el.innerHTML = `<a href="blog.html">${esc(t('back_blog'))}</a><p class="state">${esc(t('article_missing'))}</p>`; document.title = t('blog_title') + ' — CORN FREE'; return; }
      if (!p) return;
      const title = pick(p, 'title'), cat = catName(p);
      document.title = title + ' — CORN FREE';
      const img = /^https:\/\//.test(p.cover_image_url || '') ? `<img class="cover" src="${esc(p.cover_image_url)}" alt="">` : '';
      el.innerHTML = `<article class="article"><a href="blog.html">${esc(t('back_blog'))}</a><h1>${esc(title)}</h1>
        <p class="meta">${cat ? `<span class="chip">${esc(cat)}</span> ` : ''}${p.author ? esc(t('by')) + ' ' + esc(p.author) + ' · ' : ''}${esc(fmtDate(p.published_at))}</p>${img}
        <div class="prose">${renderContent(pick(p, 'content'))}</div></article>`;
    };
    async function load() {
      if (!slug) { missing = true; return draw(); }
      el.innerHTML = CF.state('loading');
      try { p = (await api('/api/posts/' + encodeURIComponent(slug))).data; draw(); }
      catch (e) { if (e.status === 404) { missing = true; draw(); } else { console.warn(e); el.innerHTML = CF.state('error', true); retryHook(el, load); } }
    }
    i18n.onChange(draw); load();
  }

  ({ home, blog, article })[page]?.();
})();
