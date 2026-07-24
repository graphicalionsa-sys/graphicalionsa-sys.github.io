/* ============================================================
   PARTICLE BRAIN — "How I Think"
   Samples the brain artwork into a red/orange/yellow point
   cloud, gives it depth, spins it slowly in 3D. The cursor
   scatters particles; springs always pull them home.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.querySelector('[data-brain]');
  if (!canvas) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
  var rotation = 0;
  var pointer = { x: -9999, y: -9999, vx: 0 };
  var running = false;
  var built = false;

  var img = new Image();
  img.src = 'assets/img/brain-map.webp';
  img.onload = function () { build(); };

  function size() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function build() {
    size();
    var off = document.createElement('canvas');
    var ow = 260;
    var oh = Math.round(ow * img.height / img.width);
    off.width = ow; off.height = oh;
    var octx = off.getContext('2d', { willReadFrequently: true });
    octx.drawImage(img, 0, 0, ow, oh);
    var data = octx.getImageData(0, 0, ow, oh).data;

    // column heights let us give the flat artwork believable depth:
    // z is sampled inside an ellipse whose thickness follows the silhouette
    var target = window.innerWidth < 760 ? 3800 : 9000;
    var pts = [];
    for (var y = 0; y < oh; y++) {
      for (var x = 0; x < ow; x++) {
        var i = (y * ow + x) * 4;
        var r = data[i], g = data[i + 1], b = data[i + 2];
        var heat = r * 1.15 + g * 0.55 - b * 1.2; // favors the red/orange strands
        // keep warm strands (red/orange/yellow), drop white/grey glass
        // highlights: warm pixels have blue well below red
        if (heat > 60 && b < r * 0.72 && r > 60) pts.push([x, y, heat]);
      }
    }
    if (!pts.length) return;
    particles.length = 0;
    var step = Math.max(1, pts.length / target);
    for (var k = 0; k < pts.length; k += step) {
      var p = pts[Math.floor(k)];
      var nx = (p[0] / ow - 0.5);
      var ny = (p[1] / oh - 0.5);
      // silhouette-driven depth
      var depth = Math.sqrt(Math.max(0.05, 1 - Math.pow(Math.abs(nx) * 2.1, 2)));
      var nz = (Math.random() * 2 - 1) * depth * 0.28;
      var heat2 = Math.min(1, p[2] / 300);
      particles.push({
        hx: nx, hy: ny, hz: nz,     // home (unit space)
        x: 0, y: 0,                 // projected screen pos (filled per frame)
        ox: 0, oy: 0, vx: 0, vy: 0, // scatter offset + velocity
        size: 0.8 + Math.random() * 1.4,
        heat: heat2,
        tw: Math.random() * Math.PI * 2
      });
    }
    built = true;
  }

  function color(heat, alpha) {
    // deep red -> orange -> yellow
    var r = 200 + Math.round(55 * heat);
    var g = Math.round(40 + 150 * heat);
    var b = Math.round(18 * (1 - heat));
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  var last = 0;
  var raf = (window.KT && window.KT.raf) || requestAnimationFrame;
  function frame(now) {
    if (!running) return;
    raf(frame);
    var dt = Math.min(50, now - last) / 16.7;
    last = now;

    ctx.clearRect(0, 0, W, H);
    if (!built) return;

    // gentle 3D turn (oscillates left↔right) so the brain never goes fully
    // edge-on and always reads as a brain while still feeling dimensional
    rotation += 0.014 * dt;
    var yaw = Math.sin(rotation) * 0.62;           // ~±36°
    var cosR = Math.cos(yaw), sinR = Math.sin(yaw);
    var scale = Math.min(W, H) * 0.78;
    var cx = W * 0.46, cy = H / 2 - H * 0.04;
    var perspective = 3.4;

    // soft ember glow behind the cloud
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.62);
    glow.addColorStop(0, 'rgba(150, 40, 8, 0.34)');
    glow.addColorStop(1, 'rgba(150, 40, 8, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - scale, cy - scale, scale * 2, scale * 2);

    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      // spin home position around Y axis
      var rx = p.hx * cosR + p.hz * sinR;
      var rz = -p.hx * sinR + p.hz * cosR;
      var pf = perspective / (perspective - rz);
      var sx = cx + rx * scale * pf;
      var sy = cy + p.hy * scale * 0.92 * pf;

      // cursor repulsion on the scatter offset
      var dx = (sx + p.ox) - pointer.x;
      var dy = (sy + p.oy) - pointer.y;
      var d2 = dx * dx + dy * dy;
      var R = 130;
      if (d2 < R * R && d2 > 0.01) {
        var d = Math.sqrt(d2);
        var force = (1 - d / R) * 16 * (0.5 + Math.min(1.5, Math.abs(pointer.vx) * 0.06));
        p.vx += (dx / d) * force * dt;
        p.vy += (dy / d) * force * dt;
      }
      // spring home
      p.vx += -p.ox * 0.045 * dt;
      p.vy += -p.oy * 0.045 * dt;
      p.vx *= Math.pow(0.9, dt);
      p.vy *= Math.pow(0.9, dt);
      p.ox += p.vx * dt;
      p.oy += p.vy * dt;

      var tw = 0.86 + 0.14 * Math.sin(now * 0.002 + p.tw);
      var depthShade = 0.55 + 0.45 * ((rz + 0.5) / 1);
      ctx.fillStyle = color(p.heat, Math.max(0.3, Math.min(1, tw * depthShade)));
      var s = p.size * pf * tw;
      ctx.fillRect(sx + p.ox - s / 2, sy + p.oy - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // QA/debug hook: draw one frame synchronously
  window.KT = window.KT || {};
  window.KT.brainFrame = function (n) {
    var was = running;
    running = true;
    frame(n || performance.now());
    running = was;
  };
  window.KT.brainInfo = function () { return { built: built, particles: particles.length, running: running, W: W, H: H }; };

  // only run while on screen
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) {
        running = true;
        last = performance.now();
        raf(frame);
      } else if (!vis) {
        running = false;
      }
    }, { threshold: 0.05 });
    io.observe(canvas);
  } else if (!reduceMotion) {
    running = true;
    requestAnimationFrame(frame);
  } else {
    // static render for reduced motion
    img.onload = function () { build(); running = true; requestAnimationFrame(function (n) { frame(n); running = false; }); };
  }

  var lastPX = 0;
  window.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    pointer.vx = e.clientX - lastPX;
    lastPX = e.clientX;
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  }, { passive: true });
  window.addEventListener('pointerleave', function () { pointer.x = pointer.y = -9999; });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (img.complete) build(); }, 200);
  });
})();
