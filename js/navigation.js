/* Navigation drawer + site search */
(function () {
  'use strict';
  var root = document.documentElement.getAttribute('data-root') || '';
  var html = document.documentElement;

  /* ---------- Drawer ---------- */
  var drawer = document.getElementById('drawer');
  var openers = document.querySelectorAll('.js-menu-open');
  var lastFocus = null;

  function drawerFocusables() {
    return drawer.querySelectorAll('a[href], button:not([disabled])');
  }
  function visible(el) { return el.offsetWidth > 0 || el.offsetHeight > 0; }

  function openDrawer() {
    if (!drawer || drawer.classList.contains('is-open')) return;
    closeSearch();
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    html.style.overflow = 'hidden';
    var close = drawer.querySelector('.js-menu-close');
    if (close) close.focus();
  }
  function closeDrawer(restore) {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    html.style.overflow = '';
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (drawer) {
    drawer.setAttribute('aria-hidden', 'true');
    openers.forEach(function (b) { b.addEventListener('click', openDrawer); });
    drawer.querySelectorAll('.js-menu-close, .drawer__backdrop').forEach(function (el) {
      el.addEventListener('click', function () { closeDrawer(); });
    });
    drawer.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () { closeDrawer(false); });
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(drawerFocusables(), visible);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function () { closeDrawer(false); });
  }

  /* ---------- Search ---------- */
  var panel = document.getElementById('search-panel');
  var searchBtn = document.querySelector('.js-search-open');
  var field = panel && panel.querySelector('.search-panel__field');
  var results = panel && panel.querySelector('.search-panel__results');

  var INDEX = [
    { t: 'Home', u: 'index.html', k: 'hero selected work capabilities statistics', c: 'Page' },
    { t: 'About', u: 'pages/about.html', k: 'story timeline education experience uday geoanalytics consultancy certifications interests nsut survey of india drdo', c: 'Page' },
    { t: 'Projects', u: 'pages/projects.html', k: 'work portfolio filter gis gnss web data research', c: 'Page' },
    { t: 'Research & Consultancy', u: 'pages/research.html', k: 'consulting geospatial analysis remote sensing geodesy spatial data infrastructure publications', c: 'Page' },
    { t: 'Skills', u: 'pages/skills.html', k: 'tools python qgis arcgis gamit globk pride ppp-ar postgis geoserver gdal numpy pandas', c: 'Page' },
    { t: 'Contact', u: 'pages/contact.html', k: 'email linkedin github location message hire', c: 'Page' },
    { t: 'SolarSight', u: 'pages/project/solarsight.html', k: 'uday geoanalytics consultancy urban geo dynamics solar rooftop urban geo dynamics', c: 'Project' },
    { t: 'Baadh Mitra', u: 'pages/project/baadh-mitra.html', k: 'uday geoanalytics consultancy urban geo dynamics flood early warning whatsapp village', c: 'Project' },
    { t: 'UGD LULC Engine', u: 'pages/project/ugd-lulc.html', k: 'uday geoanalytics consultancy urban geo dynamics land use land cover deep learning eurosat', c: 'Project' },
    { t: 'Kuaan Mitra', u: 'pages/project/kuaan-mitra.html', k: 'uday geoanalytics consultancy urban geo dynamics borewell groundwater', c: 'Project' },
    { t: 'Jameen Mitra', u: 'pages/project/jameen-mitra.html', k: 'uday geoanalytics consultancy urban geo dynamics land record bhulekh whatsapp', c: 'Project' },
    { t: 'GNSS CORS Network Processing', u: 'pages/project/gnss-cors.html', k: 'gamit globk pride ppp-ar rinex survey of india nsrf', c: 'Project' },
    { t: 'High Precision Levelling', u: 'pages/project/hpl.html', k: 'hpl geodesy height datum loop closure survey of india', c: 'Project' },
    { t: 'Flood Risk Mapping', u: 'pages/project/flood-risk.html', k: 'qgis dem drdo sea level rise', c: 'Project' },
    { t: 'LiDAR & Hyperspectral Analysis', u: 'pages/project/lidar.html', k: 'point cloud laspy spectral python drdo', c: 'Project' }
  ];

  function render(q) {
    if (!results) return;
    q = (q || '').trim().toLowerCase();
    var hits = INDEX.filter(function (i) {
      return !q || (i.t + ' ' + i.k + ' ' + i.c).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    results.textContent = '';
    if (!hits.length) {
      var p = document.createElement('p');
      p.className = 'search-panel__empty';
      p.textContent = 'No results for "' + q + '".';
      results.appendChild(p);
      return;
    }
    hits.forEach(function (i) {
      var a = document.createElement('a');
      a.className = 'search-panel__hit';
      a.href = root + i.u;
      var s1 = document.createElement('span'); s1.textContent = i.t;
      var s2 = document.createElement('span'); s2.className = 'mono mono--secondary'; s2.textContent = i.c;
      a.appendChild(s1); a.appendChild(s2);
      results.appendChild(a);
    });
  }
  function openSearch() {
    if (!panel) return;
    closeDrawer(false);
    panel.hidden = false;
    searchBtn.setAttribute('aria-expanded', 'true');
    render(field.value);
    field.focus();
  }
  function closeSearch(restore) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    searchBtn.setAttribute('aria-expanded', 'false');
    if (restore) searchBtn.focus();
  }

  if (panel && searchBtn && field) {
    searchBtn.addEventListener('click', function () { panel.hidden ? openSearch() : closeSearch(true); });
    field.addEventListener('input', function () { render(field.value); });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeSearch(true); }
      if (e.key === 'ArrowDown') {
        var first = results.querySelector('a');
        if (first) { e.preventDefault(); first.focus(); }
      }
    });
    panel.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = results.querySelector('a');
      if (first) window.location.href = first.href;
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !searchBtn.contains(e.target)) closeSearch(false);
    });
  }
})();
