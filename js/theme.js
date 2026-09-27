/* MONO / COLOR switch — default Monochrome, choice persisted in localStorage. */
(function () {
  'use strict';
  var KEY = 'portfolio-color-mode';
  var root = document.documentElement;
  var timer;

  function stored() {
    try { return localStorage.getItem(KEY) === 'color' ? 'color' : 'mono'; } catch (e) { return 'mono'; }
  }

  function apply(mode, animate) {
    if (animate) {
      root.classList.add('is-mode-changing');
      clearTimeout(timer);
      timer = setTimeout(function () { root.classList.remove('is-mode-changing'); }, 650);
    }
    root.setAttribute('data-mode', mode);
    document.querySelectorAll('.mode-switch__btn').forEach(function (btn) {
      btn.setAttribute('aria-checked', mode === 'color' ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'color' ? '#F7F9FC' : '#F5F5F2');
  }

  function set(mode) {
    try { localStorage.setItem(KEY, mode); } catch (e) { /* storage unavailable */ }
    apply(mode, true);
  }

  apply(stored(), false);

  document.querySelectorAll('.mode-switch').forEach(function (sw) {
    var btn = sw.querySelector('.mode-switch__btn');
    if (btn) btn.addEventListener('click', function () {
      set(root.getAttribute('data-mode') === 'color' ? 'mono' : 'color');
    });
    sw.querySelectorAll('.mode-switch__label').forEach(function (label) {
      label.addEventListener('click', function () { set(label.getAttribute('data-side') === 'color' ? 'color' : 'mono'); });
    });
  });

  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(stored(), true);
  });
})();
