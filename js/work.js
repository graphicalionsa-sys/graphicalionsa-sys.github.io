/* ============================================================
   WORK PAGE — fullscreen, INFINITELY looping project carousel.
   Wheel, drag, arrows and keys move a continuous position;
   cards ease toward it and wrap around (…16 → 1 → 2 …).
   ============================================================ */
(function () {
  'use strict';

  var page = document.querySelector('[data-workpage]');
  if (!page) return;
  var track = page.querySelector('[data-track]');
  var ghostPrev = page.querySelector('[data-ghost-prev]');
  var ghostNext = page.querySelector('[data-ghost-next]');
  var count = page.querySelector('[data-count]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = (window.KT && window.KT.raf) || function (cb) { return requestAnimationFrame(cb); };

  var order = window.CASE_ORDER;
  var cases = window.CASES;
  var N = order.length;

  /* build cards */
  var cards = order.map(function (slug, i) {
    var d = cases[slug];
    var a = document.createElement('a');
    a.className = 'wp-card';
    a.href = 'case.html?p=' + slug;
    a.setAttribute('data-page-link', '');
    var media = d.heroImg
      ? '<img src="' + d.heroImg + '" alt="" loading="' + (i < 3 ? 'eager' : 'lazy') + '">'
      : '';
    a.innerHTML =
      '<span class="wp-card-media">' + media + '</span>' +
      '<span class="wp-card-title">' + d.title + '</span>' +
      '<span class="wp-card-cat">' + (d.tags || '') + '</span>';
    track.appendChild(a);
    return a;
  });

  var pos = 0;          // continuous position, UNBOUNDED (wraps via modulo)
  var target = 0;
  var dragging = false;
  var dragStartX = 0, dragStartPos = 0, dragMoved = 0;
  var last = performance.now();

  function mod(n) { return ((n % N) + N) % N; }
  // nearest signed distance from pos to card index i, across the loop seam
  function wrapOffset(i) {
    var d = mod(i - pos);
    if (d > N / 2) d -= N;
    return d;
  }

  function layout() {
    var spacing = Math.min(window.innerWidth * 0.78, 1300);
    for (var i = 0; i < cards.length; i++) {
      var off = wrapOffset(i);
      var abs = Math.abs(off);
      if (abs > 1.7) {
        if (cards[i].style.visibility !== 'hidden') cards[i].style.visibility = 'hidden';
        continue;
      }
      cards[i].style.visibility = 'visible';
      var scale = 1 - Math.min(0.22, abs * 0.18);
      var op = 1 - Math.min(0.78, abs * 0.6);
      cards[i].style.transform =
        'translate(calc(-50% + ' + (off * spacing).toFixed(1) + 'px), -50%) scale(' + scale.toFixed(3) + ')';
      cards[i].style.opacity = op.toFixed(3);
      cards[i].style.zIndex = abs < 0.5 ? 3 : 2;
    }
    var cur = mod(Math.round(pos));
    ghostPrev.textContent = cases[order[mod(cur - 1)]].title;
    ghostNext.textContent = cases[order[mod(cur + 1)]].title;
    count.textContent = (cur + 1 < 10 ? '0' : '') + (cur + 1) + ' / ' + N;
  }

  function tick(now) {
    var dt = Math.min(50, now - last) / 16.7;
    last = now;
    var ease = dragging ? 0.5 : 0.09;
    pos += (target - pos) * Math.min(1, ease * dt);
    if (Math.abs(target - pos) < 0.0005) pos = target;
    layout();
    raf(tick);
  }
  raf(tick);

  /* wheel — no clamping, loops forever */
  page.addEventListener('wheel', function (e) {
    e.preventDefault();
    var d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    target += d * 0.0018;
    clearTimeout(page._snapT);
    page._snapT = setTimeout(function () { target = Math.round(target); }, 140);
  }, { passive: false });

  /* drag — pointer capture only engages after real movement, so a clean
     click still opens the card link */
  page.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.wp-arrow, .nav, .menu')) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartPos = target;
    dragMoved = 0;
  });
  page.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - dragStartX;
    dragMoved = Math.max(dragMoved, Math.abs(dx));
    if (dragMoved > 6 && !page.hasPointerCapture(e.pointerId)) {
      try { page.setPointerCapture(e.pointerId); } catch (err) {}
    }
    target = dragStartPos - dx / Math.min(window.innerWidth * 0.78, 1300);
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    target = Math.round(target + (target - pos) * 2.2); // momentum, no clamp
  }
  page.addEventListener('pointerup', endDrag);
  page.addEventListener('pointercancel', endDrag);

  /* suppress click after a real drag; a click on a side card slides to it */
  page.addEventListener('click', function (e) {
    if (dragMoved > 8) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = 0;
      return;
    }
    var card = e.target.closest('.wp-card');
    if (card) {
      var i = cards.indexOf(card);
      var off = wrapOffset(i);
      if (i !== -1 && Math.abs(off) >= 0.5) {
        e.preventDefault();
        target = Math.round(pos) + off; // slide to the nearest instance
      }
    }
  }, true);

  /* arrows + keys — unbounded, wrap forever */
  page.querySelector('[data-prev]').addEventListener('click', function () { target = Math.round(target) - 1; });
  page.querySelector('[data-next]').addEventListener('click', function () { target = Math.round(target) + 1; });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') target = Math.round(target) - 1;
    if (e.key === 'ArrowRight') target = Math.round(target) + 1;
  });

  if (reduceMotion) { pos = target; layout(); }
})();
