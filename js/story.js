/* ============================================================
   KEATAU CREATIVE  -  case study renderer (Behance-style)
   Hero image, short overview, then big image rows broken up by
   a few notes. Data: js/story-data.js (window.STORIES), built by
   _tools/build_stories.py. Order and card data: js/case-data.js.
   ============================================================ */
(function () {
  'use strict';
  var S = window.STORIES || {};
  var order = (window.CASE_ORDER || []).filter(function (k) { return S[k]; });
  var slug = new URLSearchParams(location.search).get('p');
  if (!S[slug]) slug = order[0];
  var d = S[slug];
  var meta = (window.CASES || {})[slug] || {};
  var root = document.getElementById('case-root');
  if (!d || !root) return;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  document.title = d.name + ' | KEATAU Creative';
  document.body.classList.add('cs-page');
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', meta.metaDescription || d.line);

  function media(it, eager, solo) {
    /* a lone portrait piece is capped to the screen height and centred */
    var style = solo ? 'flex:0 1 auto;width:min(100%, calc(86svh * ' + it.ar + '));aspect-ratio:' + it.ar
                     : 'flex:' + it.ar + ' 1 0;aspect-ratio:' + it.ar;
    if (it.video && it.play) {
      /* click to play, with sound and controls, one at a time (the original site's behaviour) */
      return '<figure class="cs-fig cs-play" style="' + style + '"><video playsinline preload="none"' +
        (it.poster ? ' poster="' + esc(it.poster) + '"' : '') + ' src="' + esc(it.src) + '"></video>' +
        (it.poster ? '<img class="cs-play-poster" src="' + esc(it.poster) + '" alt="" loading="lazy">' : '') +
        '<button class="cs-play-btn" type="button" aria-label="Play video"><i></i></button></figure>';
    }
    if (it.video) {
      return '<figure class="cs-fig" style="' + style + '"><video muted loop playsinline preload="none"' +
        (it.poster ? ' poster="' + esc(it.poster) + '"' : '') + ' data-src="' + esc(it.src) + '"></video></figure>';
    }
    return '<figure class="cs-fig" style="' + style + '"><img src="' + esc(it.src) + '" alt="' + esc(d.name) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"></figure>';
  }

  var body = d.blocks.map(function (b, i) {
    if (b.row) {
      var solo = b.row.length === 1 && b.row[0].ar < 1.3;
      return '<div class="cs-row cs-in"' + (solo ? ' style="justify-content:center"' : '') + '>' + b.row.map(function (it) { return media(it, i < 1, solo); }).join('') + '</div>';
    }
    if (b.orig) {
      return '<div class="cs-orig cs-in">' + b.orig.map(function (o, k) {
        return '<button class="cs-orig-card" type="button" data-orig="' + k + '" style="--rd:' + (k * 0.08) + 's">' +
          '<span class="cs-orig-img" style="aspect-ratio:' + o.ar + '"><img src="' + esc(o.img) + '" alt="' + esc(o.name) + '" loading="lazy"></span>' +
          '<span class="cs-orig-meta"><b>' + esc(o.name) + '</b><i>' + esc(o.role) + '</i>' +
          '<span class="cs-orig-cta">' + o.videos.length + ' posts <em>&rarr;</em></span></span></button>';
      }).join('') + '</div>';
    }
    if (b.t) return '<section class="cs-note cs-in"><h2>' + esc(b.t) + '</h2><p>' + esc(b.b) + '</p></section>';
    if (b.q) return '<blockquote class="cs-quote cs-in"><p>' + esc(b.q) + '</p></blockquote>';
    if (b.s) return '<div class="cs-stats cs-in">' + b.s.map(function (x) { return '<div><strong>' + esc(x[0]) + '</strong><span>' + esc(x[1]) + '</span></div>'; }).join('') + '</div>';
    return '';
  }).join('');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = order.indexOf(slug);
  var nextSlug = order[(idx + 1) % order.length];
  var nx = S[nextSlug];

  root.innerHTML =
    '<article class="cs" style="--acc:' + esc(d.accent) + '">' +
      '<figure class="cs-hero" style="height:min(calc(100vw / ' + d.heroAr + '), calc(100svh - var(--nav-h)))">' +
        (d.heroVideo
          ? '<video class="cs-hero-video" src="' + esc(d.heroVideo) + '" poster="' + esc(d.heroPoster || d.hero) + '" muted loop playsinline preload="auto"' + (reduce ? '' : ' autoplay') + '></video>'
          : '<img src="' + esc(d.hero) + '" alt="' + esc(d.name) + '" fetchpriority="high">') +
        (d.film ? '<button class="cs-film-btn" type="button" data-film><span><i></i></span>Watch the film</button>' : '') +
      '</figure>' +
      '<header class="cs-intro">' +
        '<h1 class="cs-title">' + esc(d.name) + '</h1>' +
        '<p class="cs-line">' + esc(d.line) + '</p>' +
        '<dl class="cs-facts">' + d.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '</header>' +
      '<div class="cs-body">' + body + '</div>' +
      (nx ? '<a class="cs-next" href="case.html?p=' + nextSlug + '" data-page-link>' +
        '<span class="cs-next-copy"><span>Next project</span><strong>' + esc(nx.name) + '</strong></span>' +
        '<span class="cs-next-img"><img src="' + esc(nx.hero) + '" alt="" loading="lazy"></span></a>' : '') +
    '</article>';

  /* fade rows in, start videos only when on screen */
  var ins = root.querySelectorAll('.cs-in');
  var vids = root.querySelectorAll('video[data-src]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    ins.forEach(function (n) { io.observe(n); });
    var vo = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (!v.src) v.src = v.getAttribute('data-src'); v.play().catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vo.observe(v); });
  } else {
    ins.forEach(function (n) { n.classList.add('is-in'); });
    vids.forEach(function (v) { v.src = v.getAttribute('data-src'); v.autoplay = true; });
  }
  /* ---------- click to play videos: sound on, one at a time ---------- */
  var playing = null;
  function stopPlaying() {
    if (!playing) return;
    playing.querySelector('video').pause();
    playing.classList.remove('is-playing');
    playing = null;
  }
  root.querySelectorAll('.cs-play').forEach(function (fig) {
    var v = fig.querySelector('video');
    fig.addEventListener('click', function (ev) {
      if (fig.classList.contains('is-playing')) {
        if (ev.target === v) return;          /* let the native controls work */
        stopPlaying(); return;
      }
      stopPlaying();
      v.controls = true;
      fig.classList.add('is-playing');
      playing = fig;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
    v.addEventListener('ended', function () { fig.classList.remove('is-playing'); v.controls = false; if (playing === fig) playing = null; });
  });

  /* ---------- the Originals: constellation of posts + fullscreen viewer ---------- */
  var origData = [];
  d.blocks.forEach(function (b) { if (b.orig) origData = origData.concat(b.orig); });
  var overlay = null, viewer = null, list = [], vIdx = 0, vName = '', wide = false;

  function closeViewer() {
    if (!viewer) return;
    var v = viewer.querySelector('video'); if (v) v.pause();
    viewer.remove(); viewer = null;
    if (overlay) {
      overlay.classList.remove('is-viewing');
      if (overlay.classList.contains('is-film')) closeOverlay();
    }
  }
  function closeOverlay() {
    if (viewer) { var v = viewer.querySelector('video'); if (v) v.pause(); viewer.remove(); viewer = null; }
    if (!overlay) return;
    overlay.classList.remove('is-open');
    var node = overlay; setTimeout(function () { node.remove(); }, 420);
    overlay = null;
    document.documentElement.style.overflow = '';
    var hv = root.querySelector('.cs-hero-video'); if (hv && !reduce) hv.play().catch(function () {});
  }
  function makeOverlay(cls) {
    stopPlaying();
    overlay = document.createElement('div');
    overlay.className = 'gl-constellation cs-const ' + (cls || '');
    overlay.style.setProperty('--acc', d.accent);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay || ev.target.classList.contains('gl-const-inner')) closeOverlay(); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (overlay) overlay.classList.add('is-open'); }); });
  }
  function openViewer(i) {
    vIdx = (i + list.length) % list.length;
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.className = 'gl-viewer' + (wide ? ' cs-viewer--wide' : '');
      viewer.innerHTML =
        '<button class="gl-viewer-close" type="button" aria-label="Close video">&#10005;</button>' +
        (list.length > 1 ? '<button class="gl-viewer-nav gl-viewer-prev" type="button" aria-label="Previous video">&larr;</button>' : '') +
        '<div class="gl-viewer-stage"></div>' +
        (list.length > 1 ? '<button class="gl-viewer-nav gl-viewer-next" type="button" aria-label="Next video">&rarr;</button>' : '') +
        '<span class="gl-viewer-count"></span>';
      overlay.appendChild(viewer);
      viewer.querySelector('.gl-viewer-close').addEventListener('click', closeViewer);
      if (list.length > 1) {
        viewer.querySelector('.gl-viewer-prev').addEventListener('click', function () { openViewer(vIdx - 1); });
        viewer.querySelector('.gl-viewer-next').addEventListener('click', function () { openViewer(vIdx + 1); });
      }
    }
    overlay.classList.add('is-viewing');
    var it = list[vIdx];
    viewer.querySelector('.gl-viewer-stage').innerHTML = '<video src="' + esc(it.src) + '" poster="' + esc(it.poster) + '" controls autoplay playsinline></video>';
    viewer.querySelector('.gl-viewer-count').textContent = vName + (list.length > 1 ? '  ' + (vIdx + 1) + ' / ' + list.length : '');
    var p = viewer.querySelector('video').play(); if (p && p.catch) p.catch(function () {});
  }
  function openOriginal(o) {
    list = o.videos.map(function (f) { return { src: f + '.mp4', poster: f + '-poster.webp' }; });
    vName = o.name; wide = false;
    makeOverlay('');
    var orbit = list.map(function (it, i) {
      return '<button class="gl-sat gl-sat--' + (i + 1) + '" type="button" data-i="' + i + '" aria-label="Play ' + esc(o.name) + ' video ' + (i + 1) + '" style="--sd:' + (0.12 + i * 0.07).toFixed(2) + 's">' +
        '<img src="' + esc(it.poster) + '" alt=""><span><i></i></span></button>';
    }).join('');
    overlay.innerHTML =
      '<button class="gl-const-close" type="button" aria-label="Close">&#10005;</button>' +
      '<div class="gl-const-inner">' +
        '<figure class="gl-const-portrait"><img src="' + esc(o.img) + '" alt=""></figure>' +
        '<div class="gl-const-name"><b>' + esc(o.name) + '</b><span>' + list.length + ' posts. Tap any video</span></div>' +
        orbit +
      '</div>';
    overlay.querySelector('.gl-const-close').addEventListener('click', closeOverlay);
    overlay.querySelectorAll('.gl-sat').forEach(function (b) {
      b.addEventListener('click', function () { openViewer(parseInt(b.getAttribute('data-i'), 10)); });
    });
  }
  root.querySelectorAll('[data-orig]').forEach(function (btn) {
    btn.addEventListener('click', function () { openOriginal(origData[+btn.getAttribute('data-orig')]); });
  });

  /* hero: watch the full film with sound */
  var filmBtn = root.querySelector('[data-film]');
  if (filmBtn) filmBtn.addEventListener('click', function () {
    var hv = root.querySelector('.cs-hero-video'); if (hv) hv.pause();
    list = [{ src: d.film, poster: d.filmPoster || d.hero }];
    vName = d.name; wide = true;
    makeOverlay('is-film');
    openViewer(0);
  });

  document.addEventListener('keydown', function (ev) {
    if (!overlay) return;
    if (ev.key === 'Escape') { viewer && !overlay.classList.contains('is-film') ? closeViewer() : closeOverlay(); }
    if (viewer && list.length > 1 && ev.key === 'ArrowRight') openViewer(vIdx + 1);
    if (viewer && list.length > 1 && ev.key === 'ArrowLeft') openViewer(vIdx - 1);
  });
})();
