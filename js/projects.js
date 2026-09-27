/* Filtering for the projects grid and the research topic list.
   Markup: [data-filter-scope] > buttons[data-filter] + items[data-cats]. */
(function () {
  'use strict';

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
    var items = Array.prototype.slice.call(scope.querySelectorAll('[data-cats]'));
    var status = scope.querySelector('[data-filter-status]');
    var noun = scope.getAttribute('data-noun') || 'items';
    var toggleOff = scope.hasAttribute('data-toggle-off');
    var useHash = scope.hasAttribute('data-hash');
    var current = 'all';

    function cats(el) { return (el.getAttribute('data-cats') || '').split(/\s+/); }

    buttons.forEach(function (btn) {
      var count = btn.querySelector('.chip__count');
      if (!count) return;
      var f = btn.getAttribute('data-filter');
      count.textContent = f === 'all' ? items.length : items.filter(function (i) { return cats(i).indexOf(f) !== -1; }).length;
    });

    function apply(filter, fromUser) {
      current = filter;
      var shown = 0;
      items.forEach(function (item) {
        var match = filter === 'all' || cats(item).indexOf(filter) !== -1;
        var wasHidden = item.hidden;
        item.hidden = !match;
        if (match) {
          shown++;
          if (wasHidden && fromUser) {
            item.classList.remove('is-entering');
            void item.offsetWidth;
            item.classList.add('is-entering');
          }
        }
      });
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === filter ? 'true' : 'false');
      });
      if (status) {
        status.textContent = filter === 'all'
          ? 'Showing all ' + shown + ' ' + noun + '.'
          : 'Showing ' + shown + ' of ' + items.length + ' ' + noun + '.';
      }
      if (useHash && fromUser && window.history && history.replaceState) {
        history.replaceState(null, '', filter === 'all' ? location.pathname + location.search : '#' + filter);
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        apply(toggleOff && f === current && f !== 'all' ? 'all' : f, true);
      });
    });

    var initial = 'all';
    if (useHash && location.hash) {
      var h = location.hash.slice(1).toLowerCase();
      if (buttons.some(function (b) { return b.getAttribute('data-filter') === h; })) initial = h;
    }
    apply(initial, false);
  });

  /* Accordion rows (research topics) */
  document.querySelectorAll('.topic__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.closest('.topic');
      var open = !row.classList.contains('is-open');
      row.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
