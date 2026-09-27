/* Kosi region low-lying land explorer (Leaflet + public Terrarium elevation tiles) */
(function () {
  'use strict';
  var el = document.getElementById('kosi-map');
  if (!el || !window.L) return;

  var slider = document.getElementById('kosi-threshold');
  var sliderOut = document.getElementById('kosi-threshold-value');
  var shareOut = document.getElementById('kosi-share');
  var readout = document.getElementById('kosi-readout');

  var bounds = L.latLngBounds([25.2, 85.2], [27.0, 87.9]);
  var map = L.map(el, {
    center: [26.1, 86.55], zoom: 9, minZoom: 8, maxZoom: 12,
    maxBounds: bounds.pad(0.25), scrollWheelZoom: false, attributionControl: true
  });
  map.attributionControl.setPrefix(false);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  /* Terrarium encoding: elevation = R*256 + G + B/256 - 32768 (metres) */
  var threshold = Number(slider.value);
  var tiles = {}; // key -> { canvas, elev }

  function paint(t) {
    var ctx = t.canvas.getContext('2d');
    var img = ctx.createImageData(256, 256);
    var d = img.data, e = t.elev;
    for (var i = 0; i < e.length; i++) {
      if (e[i] <= threshold) {
        var depth = Math.min(1, (threshold - e[i]) / 8);
        d[i * 4] = 23; d[i * 4 + 1] = 105; d[i * 4 + 2] = 255;
        d[i * 4 + 3] = 90 + Math.round(110 * depth);
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  var Elevation = L.GridLayer.extend({
    createTile: function (coords, done) {
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      var key = coords.z + '/' + coords.x + '/' + coords.y;
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = c.height = 256;
        var cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        var px = cx.getImageData(0, 0, 256, 256).data;
        var elev = new Float32Array(256 * 256);
        for (var i = 0; i < elev.length; i++) elev[i] = px[i * 4] * 256 + px[i * 4 + 1] + px[i * 4 + 2] / 256 - 32768;
        tiles[key] = { canvas: canvas, elev: elev, coords: coords };
        paint(tiles[key]);
        updateShare();
        done(null, canvas);
      };
      img.onerror = function () { done(new Error('tile'), canvas); };
      img.src = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + key + '.png';
      return canvas;
    }
  });
  var layer = new Elevation({
    opacity: 0.75, minZoom: 8, maxZoom: 12, maxNativeZoom: 12, bounds: bounds,
    attribution: 'Elevation: <a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> (SRTM and others)'
  }).addTo(map);
  layer.on('tileunload', function (e) {
    var c = e.coords; delete tiles[c.z + '/' + c.x + '/' + c.y];
  });

  /* Share of visible land at or below the threshold */
  var shareTimer = null;
  function updateShare() {
    clearTimeout(shareTimer);
    shareTimer = setTimeout(function () {
      var z = map.getZoom(), low = 0, all = 0;
      Object.keys(tiles).forEach(function (k) {
        var t = tiles[k];
        if (t.coords.z !== z) return;
        var e = t.elev;
        for (var i = 0; i < e.length; i += 7) { all++; if (e[i] <= threshold) low++; }
      });
      if (all) shareOut.textContent = Math.round((low / all) * 100) + '%';
    }, 120);
  }
  map.on('moveend zoomend', updateShare);

  slider.addEventListener('input', function () {
    threshold = Number(slider.value);
    sliderOut.textContent = threshold + ' m';
    Object.keys(tiles).forEach(function (k) { paint(tiles[k]); });
    updateShare();
  });

  /* Elevation under the pointer */
  map.on('mousemove', function (ev) {
    var z = map.getZoom();
    var p = map.project(ev.latlng, z);
    var key = z + '/' + Math.floor(p.x / 256) + '/' + Math.floor(p.y / 256);
    var t = tiles[key];
    if (!t) return;
    var v = t.elev[Math.floor(p.y % 256) * 256 + Math.floor(p.x % 256)];
    readout.textContent = Math.round(v) + ' m';
  });
  map.on('mouseout', function () { readout.textContent = '–'; });

  /* District headquarters */
  var towns = [
    ['Darbhanga', 26.152, 85.897], ['Madhubani', 26.353, 86.071], ['Saharsa', 25.880, 86.600],
    ['Supaul', 26.123, 86.605], ['Madhepura', 25.921, 86.792], ['Forbesganj', 26.302, 87.265]
  ];
  towns.forEach(function (t) {
    L.circleMarker([t[1], t[2]], { radius: 5, color: '#111', weight: 2, fillColor: '#fff', fillOpacity: 1 })
      .bindTooltip(t[0], { permanent: true, direction: 'right', offset: [6, 0], className: 'kosi-label' })
      .addTo(map);
  });

  /* Fit the six towns; refit when the container resizes until the user moves the map */
  var townBounds = L.latLngBounds(towns.map(function (t) { return [t[1], t[2]]; }));
  var userMoved = false;
  function fit() {
    map.invalidateSize();
    map.fitBounds(townBounds, { paddingTopLeft: [24, 24], paddingBottomRight: [110, 24] });
  }
  fit();
  map.on('dragstart', function () { userMoved = true; });
  map.getContainer().addEventListener('wheel', function () { userMoved = true; }, { passive: true });
  if (window.ResizeObserver) {
    new ResizeObserver(function () { if (userMoved) map.invalidateSize(); else fit(); }).observe(el);
  }

  el.addEventListener('click', function () { map.scrollWheelZoom.enable(); }, { once: true });
})();
