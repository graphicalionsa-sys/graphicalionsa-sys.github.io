/* ============================================================
   KEATAU CREATIVE  -  work grid, hero marquee, showreel, filters
   Data comes from js/case-data.js (window.CASES / window.CASE_ORDER)
   ============================================================ */
(function () {
  'use strict';
  var order = window.CASE_ORDER || [];
  var cases = window.CASES || {};

  /* service filter buckets (slug -> list) */
  var CAT = {
    istories: ['Campaigns', 'Social & content'],
    glenlivet: ['Campaigns', 'Social & content'],
    shopx: ['Brand identity', 'Digital'],
    mobsie: ['Brand identity', 'Digital', 'Social & content'],
    ultramel: ['Campaigns'],
    liveeasy: ['Campaigns', 'Digital'],
    ifas: ['Brand identity', 'Social & content'],
    wpo: ['Brand identity', 'Social & content'],
    sanbi: ['Campaigns', 'Social & content'],
    'pnp-school-club': ['Social & content'],
    gwf: ['Social & content'],
    nsp: ['Brand identity', 'Campaigns'],
    'sci-bono': ['Campaigns', 'Social & content']
  };
  /* hover previews (short clips already on the site) */
  var VID = {
    istories: 'assets/video/istories/vid-reggie-hero.mp4',
    shopx: 'assets/video/shopx/store.mp4',
    glenlivet: 'assets/video/glenlivet-preview.m4v',
    liveeasy: 'assets/video/liveeasy/website-revamp.mp4'
  };

  function shortClient(c) { return (c || '').split('·')[0].trim(); }
  function tagList(t) { return (t || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3).join('  ·  '); }

  function card(slug, i, wideFirst) {
    var d = cases[slug]; if (!d) return '';
    var wide = wideFirst && i === 0;
    var vid = VID[slug] ? '<video muted loop playsinline preload="none" src="' + VID[slug] + '"></video>' : '';
    return '<a class="k-card' + (wide ? ' k-card--wide' : '') + '" href="case.html?p=' + slug + '" data-page-link data-slug="' + slug + '" data-cats="' + (CAT[slug] || []).join('|') + '" data-reveal>' +
      '<span class="k-card-media"><img src="' + d.heroImg + '" alt="' + d.title.replace(/"/g, '&quot;') + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '">' + vid +
      '<span class="k-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>' +
      '<span class="k-card-body"><span class="k-card-client">' + shortClient(d.client) + '</span><span class="k-card-title">' + d.title + '</span><span class="k-card-tags">' + tagList(d.tags) + '</span></span></a>';
  }

  /* grids: [data-k-grid="all|home"] */
  document.querySelectorAll('[data-k-grid]').forEach(function (el) {
    var mode = el.getAttribute('data-k-grid');
    var list = mode === 'home' ? order.slice(0, 6) : order;
    el.innerHTML = list.map(function (s, i) { return card(s, i, mode === 'home'); }).join('');
    el.querySelectorAll('.k-card').forEach(function (c) {
      var v = c.querySelector('video'); if (!v) return;
      c.addEventListener('mouseenter', function () { v.play().catch(function () {}); });
      c.addEventListener('mouseleave', function () { v.pause(); });
    });
  });

  /* hero marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function (el) {
    var tiles = order.map(function (s) {
      var d = cases[s]; return '<a class="k-marquee-tile" href="case.html?p=' + s + '" data-page-link><img src="' + d.heroImg + '" alt="" loading="lazy"><span>' + shortClient(d.client) + '</span></a>';
    }).join('');
    el.innerHTML = '<div class="k-marquee-track">' + tiles + tiles + '</div>';
  });

  /* filters */
  var filters = document.querySelector('[data-k-filters]');
  if (filters) {
    var cats = ['All', 'Campaigns', 'Brand identity', 'Social & content', 'Digital'];
    filters.innerHTML = cats.map(function (c, i) { return '<button class="k-chip' + (i === 0 ? ' is-on' : '') + '" type="button" data-cat="' + c + '">' + c + '</button>'; }).join('');
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('.k-chip'); if (!b) return;
      filters.querySelectorAll('.k-chip').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      var cat = b.getAttribute('data-cat');
      document.querySelectorAll('[data-k-grid] .k-card').forEach(function (c) {
        var on = cat === 'All' || (c.getAttribute('data-cats') || '').split('|').indexOf(cat) !== -1;
        c.classList.toggle('is-hidden', !on);
      });
    });
  }

  /* showreel */
  var reel = document.querySelector('[data-k-reel]');
  if (reel) {
    var v = reel.querySelector('video');
    var mute = document.querySelector('[data-k-mute]');
    reel.addEventListener('click', function () {
      if (v.paused) { v.play(); reel.classList.add('is-playing'); } else { v.pause(); reel.classList.remove('is-playing'); }
    });
    v.addEventListener('ended', function () { reel.classList.remove('is-playing'); v.currentTime = 0; });
    if (mute) mute.addEventListener('click', function () { v.muted = !v.muted; mute.textContent = v.muted ? 'Sound off' : 'Sound on'; });
  }

  /* reveal injected nodes (main.js only observes what existed at boot) */
  var nodes = document.querySelectorAll('[data-k-grid] [data-reveal], [data-k-marquee] [data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    nodes.forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight * 0.95) n.classList.add('in-view'); else io.observe(n); });
  } else { nodes.forEach(function (n) { n.classList.add('in-view'); }); }
})();
