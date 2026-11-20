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

  function media(it, eager) {
    var style = 'flex:' + it.ar + ' 1 0;aspect-ratio:' + it.ar;
    if (it.video) {
      return '<figure class="cs-fig" style="' + style + '"><video muted loop playsinline preload="none"' +
        (it.poster ? ' poster="' + esc(it.poster) + '"' : '') + ' data-src="' + esc(it.src) + '"></video></figure>';
    }
    return '<figure class="cs-fig" style="' + style + '"><img src="' + esc(it.src) + '" alt="' + esc(d.name) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"></figure>';
  }

  var body = d.blocks.map(function (b, i) {
    if (b.row) return '<div class="cs-row cs-in">' + b.row.map(function (it) { return media(it, i < 1); }).join('') + '</div>';
    if (b.t) return '<section class="cs-note cs-in"><h2>' + esc(b.t) + '</h2><p>' + esc(b.b) + '</p></section>';
    if (b.q) return '<blockquote class="cs-quote cs-in"><p>' + esc(b.q) + '</p></blockquote>';
    if (b.s) return '<div class="cs-stats cs-in">' + b.s.map(function (x) { return '<div><strong>' + esc(x[0]) + '</strong><span>' + esc(x[1]) + '</span></div>'; }).join('') + '</div>';
    return '';
  }).join('');

  var idx = order.indexOf(slug);
  var nextSlug = order[(idx + 1) % order.length];
  var nx = S[nextSlug];

  root.innerHTML =
    '<article class="cs" style="--acc:' + esc(d.accent) + '">' +
      '<figure class="cs-hero" style="height:min(calc(100vw / ' + d.heroAr + '), calc(100svh - var(--nav-h)))"><img src="' + esc(d.hero) + '" alt="' + esc(d.name) + '" fetchpriority="high"></figure>' +
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
})();
