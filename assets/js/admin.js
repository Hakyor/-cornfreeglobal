// Admin dashboard. Every call goes to /api/admin/* which is verified server-side by Cloudflare Access.
// Hiding UI here is cosmetic only; the Worker enforces authentication and the email allowlist.
(function () {
  const { esc, pick, fmtDate, api, errText, $, $$ } = CF, t = i18n.t;
  const page = document.body.dataset.page;
  const A = (p, o = {}) => api('/api/admin' + p, Object.assign({ admin: true }, o));
  const GATE = [401, 403, 503];

  // ---------- shared helpers ----------
  function toast(msg, bad) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.className = 'toast show' + (bad ? ' bad' : '');
    clearTimeout(toast.h); toast.h = setTimeout(() => (el.className = 'toast'), 4000);
  }
  const fieldsText = (e) => (e.fields ? Object.entries(e.fields).map(([k, c]) => k + ': ' + t('err_' + c)).join(' · ') : '');
  function gate(e) {
    const k = { ACCESS_NOT_CONFIGURED: 'a_err_access', ADMIN_AUTH_NOT_CONFIGURED: 'a_err_access', ALLOWLIST_EMPTY: 'a_err_access', FORBIDDEN: 'a_err_forbidden' }[e.code];
    const needLogin = e.code === 'UNAUTHENTICATED';
    $('#main').innerHTML = `<div class="panel ${k === 'a_err_access' ? 'danger' : ''}"><h1 data-i18n="a_signin_title"></h1>` + (needLogin
      ? `<form id="pwForm"><div class="field"><label><span data-i18n="a_password"></span><input type="password" name="password" autocomplete="current-password" maxlength="200" required autofocus></label></div>
         <p class="msg bad" id="pwMsg" role="alert"></p><button class="btn" type="submit" data-i18n="a_login"></button></form>
         <p class="meta" style="margin-top:18px"><a href="${esc(CF_CONFIG.API_BASE + '/api/admin/dashboard')}" target="_blank" rel="noopener" data-i18n="a_open_signin"></a></p>`
      : `<p class="msg bad" ${k ? `data-i18n="${k}"` : ''}>${k ? '' : esc(errText(e))}</p><button class="btn alt" id="retry" data-i18n="a_retry"></button>`) + '</div>';
    i18n.apply($('#main'));
    if (!needLogin) { $('#retry').onclick = () => location.reload(); return; }
    $('#pwForm').onsubmit = async (ev) => {
      ev.preventDefault();
      const msg = $('#pwMsg'), btn = ev.target.querySelector('button'); msg.textContent = ''; btn.disabled = true;
      try {
        const r = await api('/api/login', { method: 'POST', body: { password: ev.target.password.value } });
        CF.setToken(r.data.token);
        page === 'login' ? location.replace('dashboard.html') : location.reload();
      } catch (err) {
        btn.disabled = false;
        msg.textContent = err.code === 'PASSWORD_LOGIN_NOT_CONFIGURED' ? t('a_err_access') : errText(err);
      }
    };
  }
  function fail(e) { if (GATE.includes(e.status)) return gate(e); toast([errText(e), fieldsText(e)].filter(Boolean).join(' — '), true); }
  async function run(fn) { try { return await fn(); } catch (e) { fail(e); } }

  const pad = (n) => String(n).padStart(2, '0');
  const toLocal = (iso) => { const d = new Date(iso); return iso && !isNaN(d) ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}` : ''; };
  function readForm(f) {
    const o = {};
    for (const el of f.elements) {
      if (!el.name) continue;
      o[el.name] = el.type === 'checkbox' ? el.checked : el.type === 'datetime-local' ? (el.value ? new Date(el.value).toISOString() : '') : el.value;
    }
    return o;
  }
  function fillForm(f, o) {
    for (const el of f.elements) {
      if (!el.name) continue;
      const v = o[el.name];
      if (el.type === 'checkbox') el.checked = !!v; else if (el.type === 'datetime-local') el.value = toLocal(v); else el.value = v ?? '';
    }
  }
  function showErrors(f, fields = {}) {
    $$('[data-err]', f).forEach((s) => { const c = fields[s.dataset.err]; s.textContent = c ? t('err_' + c) : ''; s.closest('.field')?.classList.toggle('invalid', !!c); });
  }
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
  const chip = (st, label) => `<span class="chip ${esc(st)}">${esc(label)}</span>`;

  // ---------- shell ----------
  const NAV = [['dashboard.html', 'a_dashboard'], ['blog.html', 'a_blog'], ['announcements.html', 'a_announcements'], ['forms.html', 'a_forms'], ['settings.html', 'a_settings']];
  function shell() {
    const nav = $('#admin-nav'); if (!nav) return;
    const cur = location.pathname.split('/').pop();
    nav.innerHTML = `<a class="brand" href="dashboard.html"><img src="../assets/img/logo.png" alt="" width="36" height="36"><span><span class="o">CORN</span> <span class="b">FREE</span> <small data-i18n="a_title"></small></span></a>`
      + NAV.map(([h, k]) => `<a href="${h}" ${h === cur || (h === 'blog.html' && cur === 'posts-editor.html') ? 'aria-current="page"' : ''} data-i18n="${k}"></a>`).join('')
      + `<a href="../index.html" data-i18n="a_site"></a>`
      + (CF_CONFIG.ACCESS_LOGOUT_URL ? `<a href="${esc(CF_CONFIG.ACCESS_LOGOUT_URL)}">Logout</a>` : '')
      + `<button class="lang" id="langBtn" type="button" data-i18n="lang_switch"></button>`
      + (CF.token() ? `<button class="lang" id="logoutBtn" type="button" data-i18n="a_logout"></button>` : '');
    const lo = $('#logoutBtn'); if (lo) lo.onclick = () => { CF.clearToken(); location.href = 'index.html'; };
    $('#langBtn').onclick = () => i18n.set(i18n.lang() === 'en' ? 'ar' : 'en');
  }

  const P = {};

  P.login = async () => {
    $('#langBtn')?.remove();
    try { await A('/dashboard'); location.replace('dashboard.html'); } catch (e) { gate(e); }
  };

  P.dashboard = () => {
    let d = null;
    const draw = () => {
      if (!d) return;
      $('#stats').innerHTML = [['s_published', d.published_posts], ['s_drafts', d.draft_posts], ['s_volunteers', d.volunteer_applications, d.new_volunteers], ['s_messages', d.contact_messages, d.new_messages], ['s_announcements', d.active_announcements]]
        .map(([k, n, nw]) => `<div class="stat card"><div class="num">${n}</div><div>${esc(t(k))}</div>${nw ? `<span class="chip hot">${esc(t('s_new', { n: nw }))}</span>` : ''}</div>`).join('');
    };
    i18n.onChange(draw);
    run(async () => { d = (await A('/dashboard')).data; draw(); });
  };

  P.blog = () => {
    const st = { page: 1, q: '', status: '' }; let cats = [];
    async function loadPosts() {
      await run(async () => {
        const qs = new URLSearchParams({ page: st.page, limit: 15 });
        if (st.q) qs.set('q', st.q); if (st.status) qs.set('status', st.status);
        const r = await A('/posts?' + qs), rows = r.data;
        $('#rows').innerHTML = rows.length ? rows.map((p) => `<tr><td><strong>${esc(pick(p, 'title') || p.slug)}</strong><br><small>${esc(p.slug)}</small>${p.featured ? ' <span class="chip hot">★</span>' : ''}</td>
          <td>${chip(p.status, t('st_' + p.status))}</td><td>${esc(pick({ name_en: p.category_name_en, name_ar: p.category_name_ar }, 'name'))}</td><td>${esc(fmtDate(p.updated_at))}</td>
          <td class="acts"><a class="btn sm alt" href="posts-editor.html?id=${p.id}">${esc(t('a_edit'))}</a>
          <button class="btn sm alt" data-a="pub" data-id="${p.id}">${esc(t(p.status === 'published' ? 'a_unpublish' : 'a_publish'))}</button>
          <button class="btn sm alt" data-a="feat" data-id="${p.id}" title="${esc(t('a_feature'))}">★</button>
          <button class="btn sm danger" data-a="del" data-id="${p.id}">${esc(t('a_delete'))}</button></td></tr>`).join('') : `<tr><td colspan="5">${esc(t('a_none'))}</td></tr>`;
        CF.pager($('#pager'), r.meta, (n) => { st.page = n; loadPosts(); });
      });
    }
    $('#rows').onclick = (e) => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      const { a, id } = b.dataset;
      run(async () => {
        if (a === 'del') { if (!confirm(t('a_confirm'))) return; await A('/posts/' + id, { method: 'DELETE' }); toast(t('a_deleted')); }
        else { // PUT replaces the full record, so load it, flip one field, send it back
          const p = (await A('/posts/' + id)).data;
          if (a === 'pub') p.status = p.status === 'published' ? 'draft' : 'published'; else p.featured = p.featured ? 0 : 1;
          await A('/posts/' + id, { method: 'PUT', body: p }); toast(t('a_saved'));
        }
        loadPosts(); loadCats();
      });
    };
    $('#filters').onsubmit = (e) => { e.preventDefault(); st.q = $('#q').value.trim(); st.status = $('#status').value; st.page = 1; loadPosts(); };

    async function loadCats() {
      await run(async () => {
        cats = (await A('/categories')).data;
        $('#cats').innerHTML = cats.length ? cats.map((c) => `<tr><td>${esc(c.slug)}</td><td>${esc(c.name_en)}</td><td dir="rtl">${esc(c.name_ar)}</td><td class="acts"><button class="btn sm alt" data-a="edit" data-id="${c.id}">${esc(t('a_edit'))}</button> <button class="btn sm danger" data-a="del" data-id="${c.id}">${esc(t('a_delete'))}</button></td></tr>`).join('') : `<tr><td colspan="4">${esc(t('a_none'))}</td></tr>`;
      });
    }
    const cf = $('#catForm');
    cf.onsubmit = (e) => {
      e.preventDefault(); showErrors(cf);
      const o = readForm(cf), id = o.id;
      run(async () => {
        try { await A('/categories' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body: o }); }
        catch (err) { showErrors(cf, err.fields); throw err; }
        toast(t('a_saved')); cf.reset(); loadCats(); loadPosts();
      });
    };
    cf.onreset = () => { showErrors(cf); setTimeout(() => (cf.elements.id.value = ''), 0); };
    $('#cats').onclick = (e) => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      if (b.dataset.a === 'edit') return fillForm(cf, cats.find((c) => c.id == b.dataset.id));
      run(async () => { if (!confirm(t('a_confirm'))) return; await A('/categories/' + b.dataset.id, { method: 'DELETE' }); toast(t('a_deleted')); loadCats(); loadPosts(); });
    };
    i18n.onChange(() => { loadPosts(); loadCats(); });
    loadPosts(); loadCats();
  };

  P.editor = () => {
    const f = $('#postForm'); let id = new URLSearchParams(location.search).get('id'), pending = 'draft', cats = [];
    const drawCats = () => {
      const sel = f.elements.category_id, v = sel.value;
      sel.innerHTML = `<option value="">${esc(t('a_no_cat'))}</option>` + cats.map((c) => `<option value="${c.id}">${esc(pick(c, 'name'))}</option>`).join('');
      sel.value = v;
    };
    run(async () => {
      cats = (await A('/categories')).data; drawCats();
      if (id) fillForm(f, (await A('/posts/' + id)).data);
    });
    i18n.onChange(drawCats);
    f.elements.title_en.addEventListener('blur', () => { if (!f.elements.slug.value) f.elements.slug.value = slugify(f.elements.title_en.value); });
    $$('button[data-status]', f).forEach((b) => (b.onclick = () => (pending = b.dataset.status)));
    f.onsubmit = (e) => {
      e.preventDefault(); showErrors(f);
      const o = readForm(f); o.status = pending;
      run(async () => {
        try {
          if (id) await A('/posts/' + id, { method: 'PUT', body: o });
          else { id = String((await A('/posts', { method: 'POST', body: o })).data.id); history.replaceState(null, '', '?id=' + id); }
        } catch (err) { showErrors(f, err.fields); throw err; }
        toast(t('a_saved'));
      });
    };
  };

  P.announcements = () => {
    const f = $('#annForm'); let rows = [];
    async function load() {
      await run(async () => {
        rows = (await A('/announcements')).data;
        $('#rows').innerHTML = rows.length ? rows.map((a) => `<tr><td><strong>${esc(pick(a, 'title'))}</strong><br><small>${esc(pick(a, 'message'))}</small></td><td>${esc(t('ty_' + a.type))}</td>
          <td>${chip(a.is_active ? 'published' : 'draft', t(a.is_active ? 'f_active' : 'st_draft'))}</td><td><small>${esc(fmtDate(a.starts_at) || '—')} → ${esc(fmtDate(a.expires_at) || '—')}</small></td><td>${a.priority}</td>
          <td class="acts"><button class="btn sm alt" data-a="edit" data-id="${a.id}">${esc(t('a_edit'))}</button> <button class="btn sm alt" data-a="tog" data-id="${a.id}">${esc(t(a.is_active ? 'a_unpublish' : 'a_publish'))}</button> <button class="btn sm danger" data-a="del" data-id="${a.id}">${esc(t('a_delete'))}</button></td></tr>`).join('') : `<tr><td colspan="6">${esc(t('a_none'))}</td></tr>`;
      });
    }
    f.onsubmit = (e) => {
      e.preventDefault(); showErrors(f);
      const o = readForm(f), id = o.id;
      run(async () => {
        try { await A('/announcements' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body: o }); }
        catch (err) { showErrors(f, err.fields); throw err; }
        toast(t('a_saved')); f.reset(); load();
      });
    };
    f.onreset = () => { showErrors(f); setTimeout(() => (f.elements.id.value = ''), 0); };
    $('#rows').onclick = (e) => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      const a = rows.find((r) => r.id == b.dataset.id);
      if (b.dataset.a === 'edit') { fillForm(f, a); return f.scrollIntoView({ behavior: 'smooth' }); }
      run(async () => {
        if (b.dataset.a === 'del') { if (!confirm(t('a_confirm'))) return; await A('/announcements/' + a.id, { method: 'DELETE' }); toast(t('a_deleted')); }
        else { await A('/announcements/' + a.id, { method: 'PUT', body: Object.assign({}, a, { is_active: a.is_active ? 0 : 1 }) }); toast(t('a_saved')); }
        load();
      });
    };
    i18n.onChange(load); load();
  };

  P.forms = () => {
    const VS = ['new', 'reviewing', 'accepted', 'rejected', 'archived'], MS = ['new', 'read', 'replied', 'archived'];
    const st = { tab: 'volunteers', page: 1, status: '' };
    const S = () => (st.tab === 'volunteers' ? VS : MS);
    const drawFilter = () => { $('#status').innerHTML = `<option value="">${esc(t('a_all'))}</option>` + S().map((s) => `<option value="${s}">${esc(t('st_' + s))}</option>`).join(''); $('#status').value = st.status; };
    const item = (r) => {
      const head = st.tab === 'volunteers'
        ? `<h3>${esc(r.full_name)}</h3><p><a href="mailto:${esc(r.email)}">${esc(r.email)}</a> · ${esc(r.country)} · ${esc(t(r.preferred_language === 'ar' ? 'lang_ar' : 'lang_en'))}</p>
           <p>${(() => { try { return JSON.parse(r.interests); } catch { return []; } })().map((k) => `<span class="chip">${esc(t('int_' + k))}</span>`).join(' ')}</p><p class="pre">${esc(r.introduction)}</p>`
        : `<h3>${esc(r.subject)}</h3><p>${esc(r.name)} — <a href="mailto:${esc(r.email)}">${esc(r.email)}</a></p><p class="pre">${esc(r.message)}</p>`;
      return `<article class="card sub" data-id="${r.id}">${head}<p class="meta">${esc(t('a_received'))}: ${esc(fmtDate(r.created_at))}</p>
        <div class="row"><select data-f="status">${S().map((s) => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${esc(t('st_' + s))}</option>`).join('')}</select>
        <textarea data-f="admin_notes" rows="2" maxlength="2000" placeholder="${esc(t('a_notes'))}">${esc(r.admin_notes)}</textarea><button class="btn sm" data-save>${esc(t('a_save'))}</button></div></article>`;
    };
    async function load() {
      $$('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === st.tab));
      await run(async () => {
        const qs = new URLSearchParams({ page: st.page, limit: 10 }); if (st.status) qs.set('status', st.status);
        const r = await A('/' + st.tab + '?' + qs);
        $('#items').innerHTML = r.data.length ? r.data.map(item).join('') : `<p class="state">${esc(t('a_none'))}</p>`;
        CF.pager($('#pager'), r.meta, (n) => { st.page = n; load(); });
      });
    }
    $$('[data-tab]').forEach((b) => (b.onclick = () => { st.tab = b.dataset.tab; st.page = 1; st.status = ''; drawFilter(); load(); }));
    $('#status').onchange = () => { st.status = $('#status').value; st.page = 1; load(); };
    $('#items').onclick = (e) => {
      const b = e.target.closest('[data-save]'); if (!b) return;
      const el = b.closest('article');
      run(async () => {
        await A('/' + st.tab + '/' + el.dataset.id, { method: 'PUT', body: { status: el.querySelector('[data-f=status]').value, admin_notes: el.querySelector('[data-f=admin_notes]').value } });
        toast(t('a_saved'));
      });
    };
    i18n.onChange(() => { drawFilter(); load(); });
    drawFilter(); load();
  };

  P.settings = () => {
    const f = $('#setForm');
    run(async () => fillForm(f, (await A('/settings')).data));
    f.onsubmit = (e) => {
      e.preventDefault(); showErrors(f);
      run(async () => {
        try { await A('/settings', { method: 'PUT', body: readForm(f) }); }
        catch (err) { showErrors(f, err.fields); throw err; }
        toast(t('a_saved'));
      });
    };
  };

  shell(); i18n.apply();
  if (P[page]) P[page]();
})();
