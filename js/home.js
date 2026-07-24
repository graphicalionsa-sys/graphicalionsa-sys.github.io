/* ============================================================
   LANDING PAGE
   hero word rotator · street-kea liquid reveal · credibility
   logo cycle + settle · work previews · think statements ·
   featured case rotation
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero rotating word (per-letter reveal) ---------- */
  (function rotator() {
    var rot = document.querySelector('[data-rotator]');
    if (!rot) return;
    var items = Array.prototype.slice.call(rot.querySelectorAll('.hero-rotator-item'));
    var HOLD = 2100, LETTER = 450, STAGGER = 28;
    var itemLetters = items.map(function (item, ii) {
      var word = item.getAttribute('data-word') || item.textContent;
      item.textContent = '';
      return word.split('').map(function (ch, i) {
        var s = document.createElement('span');
        s.className = 'letter';
        s.style.setProperty('--i', i);
        s.textContent = ch;
        if (ii === 0) s.classList.add('is-in');
        item.appendChild(s);
        return s;
      });
    });
    function sizeRot() {
      var widest = 0;
      items.forEach(function (it) { widest = Math.max(widest, it.scrollWidth); });
      if (widest) rot.style.width = widest + 'px';
    }
    sizeRot();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeRot);
    window.addEventListener('resize', sizeRot);
    if (reduceMotion || items.length < 2) return;
    var cur = 0;
    function dur(l) { return LETTER + (l.length - 1) * STAGGER; }
    function next() {
      var out = itemLetters[cur];
      var inIdx = (cur + 1) % items.length;
      var inn = itemLetters[inIdx];
      out.forEach(function (l) { l.classList.remove('is-in'); l.classList.add('is-out'); });
      setTimeout(function () {
        inn.forEach(function (l) { l.classList.add('is-in'); });
      }, dur(out) / 2);
      setTimeout(function () {
        out.forEach(function (l) { l.classList.remove('is-out'); });
        cur = inIdx;
        setTimeout(next, HOLD);
      }, Math.max(dur(out), dur(out) / 2 + dur(inn)));
    }
    setTimeout(next, HOLD);
  })();

  /* reveal the complete street portrait beneath a soft pointer-following lens */
  (function heroHoverIntent() {
    var media = document.querySelector('[data-hero-media]');
    if (!media) return;
    media.classList.remove('is-auto-revealing', 'has-hover-intent');
    media.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      var bounds = media.getBoundingClientRect();
      var x = ((event.clientX - bounds.left) / bounds.width) * 100;
      var y = ((event.clientY - bounds.top) / bounds.height) * 100;
      media.style.setProperty('--hero-reveal-x', Math.max(0, Math.min(100, x)) + '%');
      media.style.setProperty('--hero-reveal-y', Math.max(0, Math.min(100, y)) + '%');
      media.classList.add('has-hover-intent');
    });
    media.addEventListener('pointerleave', function () {
      media.classList.remove('has-hover-intent');
    });
  })();

  /* ---------- credibility: colour-in, hold, fade — replays on every re-entry ---------- */
  (function credibility() {
    var section = document.querySelector('[data-cred]');
    if (!section) return;
    var heading = section.querySelector('[data-cred-heading]');

    // The sequence REPLAYS every time the section re-enters the viewport:
    // full colour in → hold 4s → fade to the "invisible" state. Leaving the
    // section resets it so the next scroll-in starts fresh in full colour.
    var settleTimer = null;
    var playing = false;
    function playIn() {
      if (playing) return;
      playing = true;
      section.classList.add('in-view');
      section.classList.remove('is-settled');
      clearTimeout(settleTimer);
      if (!reduceMotion) {
        settleTimer = setTimeout(function () { section.classList.add('is-settled'); }, 4000);
      }
    }
    function reset() {
      if (!playing) return;
      playing = false;
      clearTimeout(settleTimer);
      section.classList.remove('in-view', 'is-settled');
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var r = entries[0].intersectionRatio;
        if (r >= 0.55) playIn();
        else if (r <= 0.12) reset();
      }, { threshold: [0, 0.12, 0.55, 1] }).observe(section);
    } else playIn();

    // A denser halo of logos, never showing the same brand twice on screen
    var box = section.querySelector('[data-cred-logos]');
    if (!box || reduceMotion) return;
    var LOGOS = [
      'McDonalds Logo.webp', 'Glenlivet_White.webp', 'MyM logo.webp', 'Pernod Ricard Logo.webp',
      'Plasccon logo.webp', 'shopX logo_web.webp', 'Educonnect logo.webp', 'Leptin Health logo.webp',
      'utruckie logo.webp', 'Together Mzansi logo.webp', 'Feed the nation.webp', 'Hollard.avif',
      'pnp.avif', 'sci bono.avif', 'GWF log.avif', 'best med.avif', 'Mandela.avif', 'tempo.avif'
    ];
    var SLOTS = window.innerWidth < 700 ? 4 : 8;
    var VISIBLE_MS = 3200, FADE_MS = 700;
    var active = {}; // slot -> {x,y,w,h,name}

    function pick() {
      var used = Object.keys(active).map(function (k) { return active[k].name; });
      var free = LOGOS.filter(function (n) { return used.indexOf(n) === -1; });
      return free[Math.floor(Math.random() * free.length)];
    }
    function findSpot(lw, lh, self) {
      var w = box.clientWidth, h = box.clientHeight;
      var hr = heading.getBoundingClientRect();
      var br = box.getBoundingClientRect();
      var hx = hr.left - br.left - 8, hy = hr.top - br.top - 8;
      var hx2 = hx + hr.width + 16, hy2 = hy + hr.height + 16;
      for (var a = 0; a < 30; a++) {
        var x = 16 + Math.random() * (w - lw - 32);
        var topSafe = 96, bottomSafe = 24;
        var y = topSafe + Math.random() * Math.max(1, h - lh - topSafe - bottomSafe);
        if (x < hx2 && x + lw > hx && y < hy2 && y + lh > hy) continue;
        var hit = false;
        for (var k in active) {
          if (k === self) continue;
          var o = active[k];
          if (x < o.x + o.w + 6 && x + lw + 6 > o.x && y < o.y + o.h + 6 && y + lh + 6 > o.y) { hit = true; break; }
        }
        if (!hit) return { x: x, y: y };
      }
      return null;
    }
    function cycle(img, slot) {
      var name = pick();
      if (!name) { setTimeout(function () { cycle(img, slot); }, 900); return; }
      // the logo box is CSS-sized, so reserve name + spot synchronously —
      // no load race can duplicate a logo or overlap another slot
      var lw = img.offsetWidth || 120, lh = img.offsetHeight || 66;
      var p = findSpot(lw, lh, slot);
      if (!p) { setTimeout(function () { cycle(img, slot); }, 700 + Math.random() * 900); return; }
      active[slot] = { x: p.x, y: p.y, w: lw, h: lh, name: name };
      img.src = 'assets/img/logos/' + encodeURIComponent(name);
      img.style.left = p.x + 'px';
      img.style.top = p.y + 'px';
      var raf = (window.KT && window.KT.raf) || requestAnimationFrame;
      raf(function () { img.classList.add('is-visible'); });
      setTimeout(function () {
        img.classList.remove('is-visible');
        setTimeout(function () {
          delete active[slot];
          cycle(img, slot);
        }, FADE_MS + 400 + Math.random() * 1800);
      }, VISIBLE_MS + Math.random() * 1400);
      img.onerror = function () {
        img.onerror = null;
        delete active[slot];
      };
    }
    for (var i = 0; i < SLOTS; i++) {
      (function (slot) {
        var img = document.createElement('img');
        img.className = 'cred-logo';
        img.alt = '';
        box.appendChild(img);
        setTimeout(function () { cycle(img, slot); }, Number(slot) * 650 + Math.random() * 400);
      })(String(i));
    }
  })();

  /* ---------- selected work: hover reveals each project's creative ---------- */
  (function workRows() {
    var section = document.querySelector('[data-work]');
    if (!section) return;
    var video = section.querySelector('[data-work-preview]');
    var imgEl = section.querySelector('[data-work-img]');
    var rows = section.querySelectorAll('.work-row');
    var currentSrc = '';

    function clearPreview() {
      if (video) { video.classList.remove('is-active'); video.pause(); }
      if (imgEl) imgEl.classList.remove('is-active');
    }
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        rows.forEach(function (r) { if (r !== row) r.classList.add('is-dimmed'); });
        var vsrc = row.getAttribute('data-video-src');
        var isrc = row.getAttribute('data-img');
        if (vsrc && video) {
          if (imgEl) imgEl.classList.remove('is-active');
          if (vsrc !== currentSrc) { video.src = vsrc; currentSrc = vsrc; }
          video.classList.add('is-active');
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else if (isrc && imgEl) {
          if (video) { video.classList.remove('is-active'); video.pause(); }
          imgEl.src = isrc;
          imgEl.classList.add('is-active');
        }
      });
      row.addEventListener('mouseleave', function () {
        rows.forEach(function (r) { r.classList.remove('is-dimmed'); });
        clearPreview();
      });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { section.classList.add('in-view'); io.disconnect(); }
      }, { threshold: 0.2 });
      io.observe(section);
    } else section.classList.add('in-view');
  })();

  /* How I Think is now static cards + a self-spinning brain — no scroll JS. */

  /* ---------- featured case study rotation ---------- */
  (function featured() {
    var wrap = document.querySelector('[data-featured]');
    if (!wrap) return;
    var media = wrap.querySelector('[data-featured-media]');
    var title = wrap.querySelector('[data-featured-title]');
    var desc = wrap.querySelector('[data-featured-desc]');
    var cta = wrap.querySelector('[data-featured-cta]');
    var FEATURES = [
      { slug: 'mobsie', title: 'Mobsie Connect', img: 'assets/img/case/mobsie-editorial/key-visual-princess.webp',
        desc: 'Turning a school app into a connected world for children, parents and educators through one warm, scalable identity.' },
      { slug: 'glenlivet', title: 'The Glenlivet: Live Original', img: 'assets/img/case/glenlivet/01.webp',
        desc: 'Turning a global whisky platform into a culturally relevant South African movement built on authenticity.' },
      { slug: 'shopx', title: 'ShopX: Find Your X', img: 'assets/img/case/shopx/01.webp',
        desc: 'A 360° launch platform that turned an e-commerce app into a culture-first brand for South African youth.' }
    ];
    var imgs = FEATURES.map(function (f) {
      var im = document.createElement('img');
      im.src = f.img;
      im.alt = '';
      im.loading = 'lazy';
      media.appendChild(im);
      return im;
    });
    var idx = 0;
    imgs[0].classList.add('is-active');
    if (reduceMotion) return;
    setInterval(function () {
      idx = (idx + 1) % FEATURES.length;
      var f = FEATURES[idx];
      imgs.forEach(function (im, i) { im.classList.toggle('is-active', i === idx); });
      title.textContent = f.title;
      desc.textContent = f.desc;
      cta.href = 'case.html?p=' + f.slug;
    }, 5200);
  })();
})();
