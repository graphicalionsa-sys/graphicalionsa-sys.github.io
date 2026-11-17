/* ============================================================
   KEABETSOE TAU — shared engine
   liquid glass · smooth scroll · nav/menu · loader · reveals
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* rAF that keeps ticking (30fps) when the tab is occluded — embedded
     preview panes report hidden while still being painted */
  function raf(cb) {
    if (document.visibilityState === 'hidden') {
      return setTimeout(function () { cb(performance.now()); }, 33);
    }
    return requestAnimationFrame(cb);
  }
  window.KT = window.KT || {};
  window.KT.raf = raf;

  /* ------------------------------------------------------------
     LIQUID GLASS · displacement maps + SVG filters
     The map encodes a refraction vector field: R = x-shift,
     G = y-shift, 128 = neutral. Chromium applies it through
     backdrop-filter: url(#…); everyone else keeps the layered
     blur/sheen fallback.
  ------------------------------------------------------------ */
  function makeMap(w, h, fn) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(w, h);
    var d = img.data;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = (x / (w - 1)) * 2 - 1;   // -1..1
        var v = (y / (h - 1)) * 2 - 1;
        var off = fn(u, v);              // [-1..1, -1..1]
        var i = (y * w + x) * 4;
        d[i] = Math.max(0, Math.min(255, 128 + off[0] * 127));
        d[i + 1] = Math.max(0, Math.min(255, 128 + off[1] * 127));
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  function injectGlassDefs() {
    // pill: displacement rises steeply toward the edges only
    var pill = makeMap(96, 40, function (u, v) {
      return [Math.pow(u, 7) * 0.92, Math.pow(v, 7) * 0.92];
    });
    // lens: radial refraction ring for round blobs
    var lens = makeMap(72, 72, function (u, v) {
      var r = Math.sqrt(u * u + v * v);
      if (r > 1 || r === 0) return [0, 0];
      var edge = Math.pow(Math.max(0, (r - 0.42) / 0.58), 2.4);
      return [(u / r) * edge, (v / r) * edge];
    });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    svg.innerHTML =
      '<defs>' +
      '<filter id="lg-warp" x="0" y="0" width="100%" height="100%">' +
      '<feImage href="' + pill + '" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" result="m"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="m" scale="46" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +
      '<filter id="lg-lens" x="0" y="0" width="100%" height="100%">' +
      '<feImage href="' + lens + '" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" result="m"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="m" scale="72" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +
      '</defs>';
    document.body.appendChild(svg);
    try {
      if (CSS.supports('backdrop-filter', 'url(#lg-warp)') ||
          CSS.supports('-webkit-backdrop-filter', 'url(#lg-warp)')) {
        document.documentElement.classList.add('warp');
      }
    } catch (e) { /* fallback stays */ }
  }

  /* moving specular highlight follows the pointer over glass pills */
  function initSheen() {
    if (!finePointer) return;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.lg');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     LIQUID GLASS · free-roaming blob field
     Blobs drift in and out of the page like independent droplets,
     warping whatever passes beneath them. Pages can subscribe to
     their positions (the hero uses this to reveal STREET KEA).
  ------------------------------------------------------------ */
  function BlobField(opts) {
    opts = opts || {};
    this.max = opts.max || (window.innerWidth < 760 ? 2 : 4);
    this.container = opts.container || document.body;
    this.linger = opts.linger || null;   // element the blobs slow down over
    this.listeners = [];
    this.blobs = [];
    this.layer = document.createElement('div');
    this.layer.setAttribute('aria-hidden', 'true');
    this.layer.style.cssText = (opts.container
      ? 'position:absolute;inset:0;z-index:6;'
      : 'position:fixed;inset:0;z-index:60;') + 'pointer-events:none;overflow:hidden;';
    this.container.appendChild(this.layer);
    this.running = false;
    if (!reduceMotion) this.start();
  }
  BlobField.prototype.bounds = function () {
    var el = this.container === document.body ? null : this.container;
    return {
      w: el ? el.clientWidth : window.innerWidth,
      h: el ? el.clientHeight : window.innerHeight
    };
  };
  BlobField.prototype.spawn = function (now) {
    var bb = this.bounds();
    var size = 150 + Math.random() * Math.min(280, bb.w * 0.22);
    var el = document.createElement('div');
    el.className = 'lg-blob';
    el.style.width = size + 'px';
    el.style.height = size * (0.82 + Math.random() * 0.36) + 'px';
    this.layer.appendChild(el);
    var b = {
      el: el, w: size, h: parseFloat(el.style.height),
      x: Math.random() * (bb.w - size),
      y: Math.random() * (bb.h - size),
      seed: Math.random() * 1000,
      born: now || performance.now(),
      life: 14000 + Math.random() * 10000,
      speed: 0.012 + Math.random() * 0.016,
      dying: false
    };
    this.morph(b);
    b.morphTimer = setInterval(this.morph.bind(this, b), 2600);
    this.blobs.push(b);
  };
  BlobField.prototype.morph = function (b) {
    function r() { return 38 + Math.random() * 26; }
    b.el.style.transition = 'border-radius 2.6s ease';
    b.el.style.borderRadius = r() + '% ' + r() + '% ' + r() + '% ' + r() + '% / ' + r() + '% ' + r() + '% ' + r() + '% ' + r() + '%';
  };
  BlobField.prototype.start = function () {
    var self = this;
    this.running = true;
    var last = performance.now();
    function frame(now) {
      if (!self.running) return;
      self.step(now, Math.min(50, now - last));
      last = now;
      raf(frame);
    }
    raf(frame);
  };
  BlobField.prototype.step = function (now, dt) {
    var self = this;
    {
      var bb = self.bounds();
      var vw = bb.w, vh = bb.h;
      var lingerRect = null;
      if (self.linger) {
        var lr = self.linger.getBoundingClientRect();
        var cr = self.container.getBoundingClientRect();
        lingerRect = { l: lr.left - cr.left, t: lr.top - cr.top, r: lr.right - cr.left, b: lr.bottom - cr.top };
      }
      if (self.blobs.length < self.max && Math.random() < 0.012) self.spawn(now);
      for (var i = self.blobs.length - 1; i >= 0; i--) {
        var b = self.blobs[i];
        var age = now - b.born;
        var t = now * 0.001 * b.speed * 18 + b.seed;
        // droplets drift slowly, and dwell (~4s) while over the linger target
        var drag = 1;
        if (lingerRect) {
          var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
          if (cx > lingerRect.l && cx < lingerRect.r && cy > lingerRect.t && cy < lingerRect.b) drag = 0.28;
        }
        b.x += (Math.sin(t) + Math.sin(t * 0.37 + 2) * 0.6) * dt * b.speed * 3.2 * drag;
        b.y += (Math.cos(t * 0.83 + 1) + Math.sin(t * 0.21) * 0.6) * dt * b.speed * 2.6 * drag;
        // soft wrap
        if (b.x < -b.w * 1.5) b.x = vw + b.w * 0.4;
        if (b.x > vw + b.w * 1.5) b.x = -b.w * 0.4;
        if (b.y < -b.h * 1.5) b.y = vh + b.h * 0.4;
        if (b.y > vh + b.h * 1.5) b.y = -b.h * 0.4;
        var fadeIn = Math.min(1, age / 1600);
        var fadeOut = Math.max(0, Math.min(1, (b.life - age) / 1600));
        var op = Math.min(fadeIn, fadeOut);
        b.el.style.opacity = op.toFixed(3);
        b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0) scale(' + (0.6 + 0.4 * op).toFixed(3) + ')';
        if (age > b.life) {
          clearInterval(b.morphTimer);
          b.el.remove();
          self.blobs.splice(i, 1);
        }
      }
      for (var l = 0; l < self.listeners.length; l++) self.listeners[l](self.blobs);
    }
  };
  BlobField.prototype.onFrame = function (fn) { this.listeners.push(fn); };

  /* ------------------------------------------------------------
     SMOOTH SCROLL — compact lenis-style wheel lerp (desktop only)
  ------------------------------------------------------------ */
  function initSmoothScroll() {
    if (reduceMotion || !finePointer || document.body.dataset.noscroll === '1') return;
    var target = window.scrollY;
    var current = target;
    var raf = null;
    function clamp() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, target));
    }
    function loop() {
      current += (target - current) * 0.105;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        raf = null;
      } else {
        raf = requestAnimationFrame(loop);
      }
      window.scrollTo(0, current);
    }
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;
      e.preventDefault();
      target += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      clamp();
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: false });
    // keep in sync when scroll happens by other means (keys, hash, drag)
    window.addEventListener('scroll', function () {
      if (!raf) { target = current = window.scrollY; }
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     LOADER + page transition curtain
  ------------------------------------------------------------ */
  function initLoader() {
    var loader = document.querySelector('[data-loader]');
    if (!loader) return;
    var visited = false;
    try { visited = sessionStorage.getItem('kt-visited') === '1'; } catch (err) {}

    if (visited) {
      /* returning within the session: quick swipe reveal instead of the full loader */
      loader.classList.add('loader--swipe');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          loader.classList.add('is-swiped-out');
          setTimeout(function () { loader.classList.add('is-hidden'); }, reduceMotion ? 0 : 560);
        });
      });
    } else {
      /* first open: the full loading animation, once per session */
      var MIN = reduceMotion ? 0 : 1400;
      var start = Date.now();
      var hide = function () {
        setTimeout(function () { loader.classList.add('is-hidden'); },
          Math.max(0, MIN - (Date.now() - start)));
      };
      if (document.readyState === 'complete') hide();
      else window.addEventListener('load', hide);
      try { sessionStorage.setItem('kt-visited', '1'); } catch (err) {}
    }
    // safety: never trap the user behind the curtain
    setTimeout(function () { loader.classList.add('is-hidden'); }, 4000);

    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('[data-page-link]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (!href || href[0] === '#' || link.target === '_blank' || href.indexOf('mailto:') === 0) return;
      e.preventDefault();
      /* quick swipe out: curtain sweeps in from the right, then navigate */
      loader.classList.add('loader--swipe');
      loader.classList.remove('is-hidden', 'is-swiped-out');
      loader.classList.add('is-swiping-in');
      setTimeout(function () { window.location.href = href; }, reduceMotion ? 0 : 340);
    });
  }

  /* ------------------------------------------------------------
     NAV + full-screen menu
  ------------------------------------------------------------ */
  function initMenu() {
    var burger = document.querySelector('[data-burger]');
    var menu = document.querySelector('[data-menu]');
    if (!burger || !menu) return;
    function set(open) {
      document.body.classList.toggle('menu-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (window.innerWidth > 400) document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      set(!document.body.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
  }

  /* ------------------------------------------------------------
     Reveals: [data-reveal] fade-ups and word/letter splits
  ------------------------------------------------------------ */
  function splitWords() {
    document.querySelectorAll('[data-word-wrap]').forEach(function (word, wi) {
      if (word.dataset.split) return;
      word.dataset.split = '1';
      var text = word.textContent;
      word.textContent = '';
      text.split('').forEach(function (ch, i) {
        var s = document.createElement('span');
        s.className = 'letter';
        s.style.setProperty('--i', i);
        s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
        word.appendChild(s);
      });
    });
  }
  function reveal(el) {
    el.classList.add('in-view');
    el.querySelectorAll('.letter').forEach(function (l) { l.classList.add('is-in'); });
  }
  function initReveals() {
    splitWords();
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        reveal(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 }) : null;
    var vh = window.innerHeight;
    document.querySelectorAll('[data-reveal], [data-reveal-section]').forEach(function (el) {
      if (!io || reduceMotion) { reveal(el); return; }
      // anything already within the first viewport reveals immediately, so
      // above-the-fold content never depends on a scroll/IO race
      if (el.getBoundingClientRect().top < vh * 0.92) reveal(el);
      else io.observe(el);
    });
  }

  /* ------------------------------------------------------------
     CINEMATIC MOTION LAYER
     A single rAF loop drives depth, scroll progress and image drift.
     CSS transforms remain composable via custom properties so this
     enhances every page without fighting its existing transitions.
  ------------------------------------------------------------ */
  function initCinematicMotion() {
    if (reduceMotion) return;

    document.documentElement.classList.add('has-cinematic-motion');

    var glow = null;

    var specs = [
      ['.hero-media', -0.085, 72],
      ['.hero-content', 0.035, 34],
      ['.cred-heading', -0.055, 50],
      ['.work-heading', -0.06, 44],
      ['.think-brain', -0.09, 70],
      ['.think-intro', 0.035, 34],
      ['.process-heading', -0.045, 42],
      ['.featured-media', -0.065, 58],
      ['.featured-content', 0.035, 34],
      ['.snapshot-photo', -0.07, 58],
      ['.snapshot-content', 0.035, 34],
      ['.footer-arrow', -0.075, 54],
      ['.about-hero-photo', -0.065, 58],
      ['.about-hero-content', 0.04, 36],
      ['.case-hero-media', -0.065, 58],
      ['.case-hero-copy', 0.035, 34]
    ];
    var depth = [];
    specs.forEach(function (spec) {
      document.querySelectorAll(spec[0]).forEach(function (el) {
        el.classList.add('depth-plane');
        depth.push({ el: el, speed: spec[1], limit: spec[2] });
      });
    });

    var ticking = false;
    function update() {
      ticking = false;
      var sy = window.scrollY || window.pageYOffset;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var vh = window.innerHeight;
      depth.forEach(function (item) {
        var rect = item.el.getBoundingClientRect();
        if (rect.bottom < -180 || rect.top > vh + 180) return;
        var center = rect.top + rect.height * 0.5;
        var offset = (center - vh * 0.5) * item.speed;
        offset = Math.max(-item.limit, Math.min(item.limit, offset));
        item.el.style.setProperty('--depth-y', offset.toFixed(2) + 'px');
        var visible = Math.max(0, Math.min(1, 1 - Math.abs(center - vh * 0.5) / (vh * 0.95)));
        item.el.style.setProperty('--depth-focus', visible.toFixed(3));
      });
    }
    function queueUpdate() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    queueUpdate();

    if (!finePointer) return;

    var pointerX = window.innerWidth * 0.5;
    var pointerY = window.innerHeight * 0.5;
    var glowX = pointerX, glowY = pointerY;
    document.addEventListener('pointermove', function (e) {
      pointerX = e.clientX; pointerY = e.clientY;
      if (glow) glow.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', function () {
      if (glow) glow.classList.remove('is-visible');
    });
    function follow() {
      glowX += (pointerX - glowX) * 0.12;
      glowY += (pointerY - glowY) * 0.12;
      if (glow) glow.style.transform = 'translate3d(' + glowX.toFixed(1) + 'px,' + glowY.toFixed(1) + 'px,0)';
      raf(follow);
    }
    raf(follow);

    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var nx = e.clientX / window.innerWidth - 0.5;
        var ny = e.clientY / window.innerHeight - 0.5;
        hero.style.setProperty('--hero-rx', (-ny * 3.5).toFixed(2) + 'deg');
        hero.style.setProperty('--hero-ry', (nx * 5).toFixed(2) + 'deg');
        hero.style.setProperty('--hero-copy-x', (nx * -14).toFixed(1) + 'px');
      });
      hero.addEventListener('pointerleave', function () {
        hero.style.setProperty('--hero-rx', '0deg');
        hero.style.setProperty('--hero-ry', '0deg');
        hero.style.setProperty('--hero-copy-x', '0px');
      });
    }

    document.querySelectorAll('.lg, .featured-cta, .snapshot-cta').forEach(function (el) {
      el.classList.add('is-magnetic');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mag-x', ((e.clientX - r.left - r.width / 2) * 0.14).toFixed(1) + 'px');
        el.style.setProperty('--mag-y', ((e.clientY - r.top - r.height / 2) * 0.18).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ------------------------------------------------------------
     Ambient sound toggle (synthesized — no audio file needed)
  ------------------------------------------------------------ */
  function initSound() {
    var btn = document.querySelector('[data-sound]');
    if (!btn) return;
    var ctx = null, master = null, nodes = [];
    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      master.connect(filter).connect(ctx.destination);
      [110, 164.8, 220, 329.6].forEach(function (f, i) {
        var o = ctx.createOscillator();
        o.type = i % 2 ? 'sine' : 'triangle';
        o.frequency.value = f;
        var g = ctx.createGain();
        g.gain.value = i % 2 ? 0.05 : 0.085;
        var lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.033;
        var lg = ctx.createGain();
        lg.gain.value = i % 2 ? 0.03 : 0.05;
        lfo.connect(lg).connect(g.gain);
        o.connect(g).connect(master);
        o.start(); lfo.start();
        nodes.push(o, lfo);
      });
    }
    var on = false;
    btn.addEventListener('click', function () {
      if (!ctx) build();
      if (ctx.state === 'suspended') ctx.resume();
      on = !on;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx.currentTime + 1.2);
      btn.classList.toggle('is-on', on);
      btn.querySelector('b').textContent = on ? 'Sound on' : 'Sound off';
    });
  }

  /* ------------------------------------------------------------
     boot
  ------------------------------------------------------------ */
  function boot() {
    injectGlassDefs();
    initSheen();
    initLoader();
    initMenu();
    initReveals();
    initCinematicMotion();
    initSound();
    window.KT = window.KT || {};
    window.KT.BlobField = BlobField;   // pages opt in (hero only)
    window.KT.reduceMotion = reduceMotion;
    window.KT.splitWords = splitWords;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
