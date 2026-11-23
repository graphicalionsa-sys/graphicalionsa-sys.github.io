/* ============================================================
   KEATAU CREATIVE  -  hero columns, work grid, showreel, filters
   Data comes from js/case-data.js (window.CASES / window.CASE_ORDER)
   ============================================================ */
(function () {
  'use strict';
  var order = window.CASE_ORDER || [];
  var cases = window.CASES || {};

  /* service filter buckets (slug -> list) */
  var CAT = {
    keatau: ['Brand identity', 'Campaigns'],
    grimace: ['Campaigns', 'Social & content'],
    appiness: ['Campaigns', 'Digital'],
    afrique360: ['Brand identity'],
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
    'sci-bono': ['Campaigns', 'Social & content'],
    codigo: ['Campaigns', 'Social & content'],
    'pernod-code': ['Campaigns'],
    'mym-birthday': ['Campaigns', 'Digital'],
    'mym-deal-drop': ['Campaigns', 'Digital'],
    'mym-fifa': ['Campaigns', 'Digital'],
    supabets: ['Campaigns', 'Social & content']
  };
  /* hover previews (short clips already on the site) */
  var VID = {
    istories: 'assets/video/istories/vid-reggie-hero.mp4',
    shopx: 'assets/video/shopx/store.mp4',
    glenlivet: 'assets/video/glenlivet-preview.mp4',
    liveeasy: 'assets/video/liveeasy/website-revamp.mp4'
  };
  /* hero tiles: [slug, image] in three columns */
  var C = 'assets/img/case/';
  var TILES = [
    [['istories', C + 'istories-editorial/banner-victoria.webp'], ['glenlivet', C + 'glenlivet-live/card-hero.webp'], ['mobsie', C + 'mobsie-editorial/key-visual-princess.webp'], ['codigo', C + 'codigo/02.webp'], ['grimace', C + 'grimace/01.webp'], ['sanbi', C + 'sanbi/01.webp'], ['nsp', C + 'nsp-editorial/hero-billboard.avif'], ['sci-bono', C + 'sci-bono/01.webp']],
    [['keatau', C + 'keatau/03.webp'], ['shopx', C + 'shopx/hero-banner.webp'], ['liveeasy', C + 'liveeasy-editorial/kv-hustle.webp'], ['istories', C + 'istories-editorial/still-reggie.webp'], ['supabets', C + 'supabets/04.webp'], ['appiness', C + 'appiness/01.webp'], ['mym-birthday', C + 'mym-birthday/03.webp'], ['ifas', C + 'ifas/01.webp'], ['gwf', C + 'gwf/01.webp'], ['glenlivet', C + 'glenlivet-live/export-founders.webp']],
    [['pnp-school-club', C + 'pnp-school-club/card-hero.webp'], ['wpo', C + 'wpo-editorial/reaching-farther.webp'], ['keatau', C + 'keatau/14.webp'], ['pernod-code', C + 'pernod-code/11.webp'], ['mym-deal-drop', C + 'mym-deal-drop/03.webp'], ['mobsie', C + 'mobsie-editorial/car-branding.webp'], ['liveeasy', C + 'liveeasy-editorial/hero.webp'], ['shopx', C + 'shopx/kv-b2b.webp']]
  ];

  function shortClient(c) { return (c || '').split('·')[0].trim(); }
  function tagList(t) { return (t || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 2).join(', '); }

  /* hero columns */
  document.querySelectorAll('[data-k-cols]').forEach(function (el) {
    el.innerHTML = TILES.map(function (col, ci) {
      var tiles = col.map(function (t, i) {
        var d = cases[t[0]] || {};
        return '<a class="k-tile" href="case.html?p=' + t[0] + '" data-page-link><img src="' + t[1] + '" alt="' + (d.title || '') + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '"><span>' + shortClient(d.client) + '</span></a>';
      }).join('');
      var dur = [64, 76, 58][ci] + 's';
      return '<div class="k-col' + (ci === 1 ? ' k-col--down' : '') + '" style="--dur:' + dur + '">' + tiles + tiles + '</div>';
    }).join('');
  });

  function card(slug, i, wideFirst) {
    var d = cases[slug]; if (!d) return '';
    var wide = wideFirst && i === 0;
    var vid = VID[slug] ? '<video muted loop playsinline preload="none" src="' + VID[slug] + '"></video>' : '';
    return '<a class="k-card' + (wide ? ' k-card--wide' : '') + '" href="case.html?p=' + slug + '" data-page-link data-slug="' + slug + '" data-cats="' + (CAT[slug] || []).join('|') + '" data-reveal>' +
      '<span class="k-card-media"><img src="' + d.heroImg + '" alt="' + d.title.replace(/"/g, '&quot;') + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '">' + vid +
      '<span class="k-card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>' +
      '<span class="k-card-body"><span class="k-card-title">' + shortClient(d.client) + '</span><span class="k-card-tags">' + tagList(d.tags) + '</span></span></a>';
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

  /* showreel: plays muted when it scrolls into view, sound on tap */
  var reel = document.querySelector('[data-k-reel]');
  if (reel) {
    var v = reel.querySelector('video');
    var sound = reel.querySelector('[data-k-sound]');
    function setSound(on) {
      v.muted = !on;
      if (sound) { sound.classList.toggle('is-on', on); sound.querySelector('span').textContent = on ? 'Sound on' : 'Sound off'; }
    }
    function play() { v.play().then(function () { reel.classList.add('is-playing'); }).catch(function () {}); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) play(); else v.pause(); });
      }, { threshold: 0.35 }).observe(reel);
    } else { play(); }
    reel.addEventListener('click', function (e) {
      if (e.target.closest('[data-k-sound]')) return;
      if (v.paused) play(); else setSound(v.muted);
    });
    if (sound) sound.addEventListener('click', function () { setSound(v.muted); if (v.paused) play(); });
  }

  /* reveal injected nodes (main.js only observes what existed at boot) */
  var nodes = document.querySelectorAll('[data-k-grid] [data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    nodes.forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight * 0.95) n.classList.add('in-view'); else io.observe(n); });
  } else { nodes.forEach(function (n) { n.classList.add('in-view'); }); }
})();
