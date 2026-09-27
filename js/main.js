/* Contact form, visitor counter */
(function () {
  'use strict';

  /* Clean up any legacy language preference */
  try { localStorage.removeItem('portfolio-lang'); } catch (e) { /* ignore */ }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    var submit = form.querySelector('[type="submit"]');
    var submitLabel = (submit && submit.querySelector('span')) || submit;
    var labelText = submitLabel ? submitLabel.textContent : 'Send Message';
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, message) {
      var err = document.getElementById(input.id + '-error');
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (err) err.textContent = message || '';
    }
    function validate() {
      var ok = true, firstBad = null;
      form.querySelectorAll('[data-required]').forEach(function (input) {
        var v = input.value.trim(), msg = '';
        if (!v) msg = 'This field is required.';
        else if (input.type === 'email' && !EMAIL.test(v)) msg = 'Enter a valid email address.';
        setError(input, msg);
        if (msg) { ok = false; if (!firstBad) firstBad = input; }
      });
      if (firstBad) firstBad.focus();
      return ok;
    }
    function showNote(kind, text) {
      note.hidden = false;
      note.className = 'form-note form-note--' + kind;
      note.textContent = text;
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('[data-required]') && e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.hidden = true;
      if (!validate()) return;
      submit.disabled = true;
      submitLabel.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) { form.reset(); showNote('success', 'Thank you — your message has been sent. I will get back to you soon.'); }
          else showNote('error', 'Something went wrong while sending. Please try again, or email me directly.');
        })
        .catch(function () { showNote('error', 'Network error. Please try again, or email me directly.'); })
        .then(function () { submit.disabled = false; submitLabel.textContent = labelText; });
    });
  }

  /* ---------- Visitor counter (GoatCounter public counter; hidden if unavailable) ---------- */
  var visitors = document.getElementById('visitors');
  if (visitors && window.fetch) {
    var value = visitors.querySelector('[data-visitors-count]');
    var base = 'https://adityagis.goatcounter.com/counter/';
    var load = function (path) {
      return fetch(base + path + '.json', { mode: 'cors' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) {
          var n = parseInt(String(d.count).replace(/[\s,]/g, ''), 10);
          if (!n) throw new Error('empty');
          return n;
        });
    };
    load('TOTAL').catch(function () { return load(encodeURIComponent('/')); })
      .then(function (n) { value.textContent = n.toLocaleString('en-IN'); visitors.hidden = false; })
      .catch(function () { /* leave hidden */ });
  }
})();
