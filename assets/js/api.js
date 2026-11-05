// Shared helpers + API client (loaded on every page after i18n.js)
(function () {
  const CF = (window.CF = window.CF || {});
  const t = (k, v) => i18n.t(k, v);

  CF.$ = (s, r = document) => r.querySelector(s);
  CF.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  CF.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  CF.pick = (o, f) => { const l = i18n.lang(), o2 = l === 'ar' ? 'en' : 'ar'; return (o && (o[f + '_' + l] || o[f + '_' + o2])) || ''; };
  CF.fmtDate = (iso) => { const d = new Date(iso); return iso && !isNaN(d) ? d.toLocaleDateString(i18n.lang() === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : ''; };
  CF.safeUrl = (u) => (/^https:\/\//i.test(u || '') || /^\/(?!\/)/.test(u || '') ? u : '');

  const TK = 'cf_admin_token';
  CF.token = () => { try { return sessionStorage.getItem(TK); } catch { return null; } };
  CF.setToken = (v) => { try { sessionStorage.setItem(TK, v); } catch { /* ignore */ } };
  CF.clearToken = () => { try { sessionStorage.removeItem(TK); } catch { /* ignore */ } };

  CF.api = async (path, o = {}) => {
    let res, j = null;
    try {
      res = await fetch(CF_CONFIG.API_BASE + path, {
        method: o.method || 'GET',
        credentials: o.admin ? 'include' : 'omit',
        headers: Object.assign({}, o.body ? { 'Content-Type': 'application/json' } : {}, o.admin && CF.token() ? { Authorization: 'Bearer ' + CF.token() } : {}),
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
    } catch { const e = new Error('Network error'); e.code = 'NETWORK'; e.status = 0; throw e; }
    try { j = await res.json(); } catch { /* non-JSON */ }
    if (!res.ok || !j || !j.ok) {
      const e = new Error((j && j.error && j.error.message) || 'Request failed');
      e.status = res.status; e.code = (j && j.error && j.error.code) || 'HTTP_' + res.status; e.fields = j && j.error && j.error.fields;
      throw e;
    }
    return j; // { ok, data, meta? }
  };

  const ERR = { NETWORK: 'err_network', RATE_LIMITED: 'err_rate', VALIDATION_ERROR: 'err_validation', DUPLICATE: 'err_duplicate',
    ACCESS_NOT_CONFIGURED: 'a_err_access', ADMIN_AUTH_NOT_CONFIGURED: 'a_err_access', BAD_CREDENTIALS: 'a_bad_pw', ALLOWLIST_EMPTY: 'a_err_access', UNAUTHENTICATED: 'a_err_auth', FORBIDDEN: 'a_err_forbidden' };
  CF.errText = (e) => t(ERR[e.code] || 'err_generic');

  CF.pager = (el, m, go) => {
    if (!m || m.pages <= 1) { el.innerHTML = ''; return; }
    el.innerHTML = `<button class="btn alt sm" data-p="${m.page - 1}" ${m.page <= 1 ? 'disabled' : ''}>${CF.esc(t('prev'))}</button>
      <span>${CF.esc(t('page_of', { page: m.page, pages: m.pages }))}</span>
      <button class="btn alt sm" data-p="${m.page + 1}" ${m.page >= m.pages ? 'disabled' : ''}>${CF.esc(t('next'))}</button>`;
    el.querySelectorAll('button[data-p]').forEach((b) => (b.onclick = () => go(+b.dataset.p)));
  };

  CF.state = (kind, retry) => kind === 'loading'
    ? `<p class="state"><span class="spin"></span> ${CF.esc(t('loading'))}</p>`
    : kind === 'error'
      ? `<div class="state err"><p>${CF.esc(t('load_error'))}</p>${retry ? `<button class="btn alt sm" data-retry>${CF.esc(t('retry'))}</button>` : ''}</div>`
      : `<p class="state">${CF.esc(t('no_posts'))}</p>`;
})();
