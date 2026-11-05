// Join + Contact forms: client validation (mirrors server), real API submit, success/error states
(function () {
  const form = document.querySelector('form[data-form]');
  if (!form) return;
  const { api, errText, $ } = CF, t = i18n.t, kind = form.dataset.form;
  const rules = { join: { full_name: [2, 100], country: [2, 80], introduction: [10, 1000] }, contact: { name: [2, 100], subject: [3, 150], message: [10, 3000] } }[kind];
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const btn = form.querySelector('button[type=submit]'), msg = $('#formMsg');
  let lastErrs = {}, touchedLang = false;

  function collect() {
    const f = new FormData(form), d = { email: (f.get('email') || '').trim(), website: f.get('website') || '', consent: form.elements.consent.checked };
    for (const k of Object.keys(rules)) d[k] = (f.get(k) || '').trim();
    if (kind === 'join') { d.preferred_language = f.get('preferred_language'); d.interests = f.getAll('interests'); }
    return d;
  }
  function check(d) {
    const e = {};
    for (const [k, [mn, mx]] of Object.entries(rules)) e[k] = !d[k] ? 'required' : d[k].length < mn ? 'too_short' : d[k].length > mx ? 'too_long' : undefined;
    e.email = !d.email ? 'required' : !EMAIL.test(d.email) ? 'invalid' : undefined;
    if (!d.consent) e.consent = 'required';
    if (kind === 'join' && !d.interests.length) e.interests = 'required';
    Object.keys(e).forEach((k) => e[k] || delete e[k]);
    return e;
  }
  function show(errs) {
    lastErrs = errs || {};
    form.querySelectorAll('[data-err]').forEach((s) => {
      const c = lastErrs[s.dataset.err];
      s.textContent = c ? t('err_' + c) : '';
      s.closest('.field')?.classList.toggle('invalid', !!c);
    });
  }
  function say(text, bad) { msg.className = 'msg ' + (bad ? 'bad' : 'good'); msg.textContent = text || ''; }

  if (kind === 'join') {
    const sel = form.elements.preferred_language;
    sel.value = i18n.lang(); sel.onchange = () => (touchedLang = true);
    i18n.onChange((l) => { if (!touchedLang) sel.value = l; });
  }
  i18n.onChange(() => { show(lastErrs); say(''); });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault(); say('');
    const d = collect(), errs = check(d); show(errs);
    if (Object.keys(errs).length) { say(t('err_validation'), true); form.querySelector('.invalid input, .invalid textarea, .invalid select')?.focus(); return; }
    btn.disabled = true; btn.textContent = t('sending');
    try {
      await api(kind === 'join' ? '/api/volunteer' : '/api/contact', { method: 'POST', body: d });
      form.hidden = true; $('#success').hidden = false; $('#success').focus();
    } catch (e) {
      if (e.fields) show(e.fields);
      say(errText(e), true);
    } finally { btn.disabled = false; btn.textContent = t(btn.dataset.i18n); }
  });
})();
