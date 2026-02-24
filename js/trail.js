/* ==============================================
   TRAIL — Firefly / glowing particle cursor trail
   ============================================== */
(function initTrail() {
  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  /* ---- Canvas setup ---- */
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '99990',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ---- Colour palette (theme-matched) ---- */
  const PALETTE = [
    [56,  189, 248],  // blue
    [129, 140, 248],  // indigo
    [167, 139, 250],  // purple
    [6,   182, 212],  // cyan
    [52,  211, 153],  // green (rare)
  ];

  const fireflies = [];
  let lastX = -999, lastY = -999;

  /* ---- Spawn fireflies on mouse movement ---- */
  document.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist < 4) return; // ignore tiny jitter

    // Spawn 1–3 fireflies proportional to cursor speed
    const count = Math.min(Math.ceil(dist / 9), 3);

    for (let i = 0; i < count; i++) {
      // Green shows up roughly 1 in 6 times
      const colorIdx = Math.random() < 0.17
        ? 4
        : Math.floor(Math.random() * 4);

      fireflies.push({
        x:     x + (Math.random() - 0.5) * 12,
        y:     y + (Math.random() - 0.5) * 12,
        vx:    (Math.random() - 0.5) * 1.5,
        vy:    -(Math.random() * 2.0 + 0.5),   // upward drift
        r:     Math.random() * 2.6 + 0.7,
        alpha: 0.85 + Math.random() * 0.15,
        decay: 0.014 + Math.random() * 0.016,   // lifespan
        color: PALETTE[colorIdx],
      });
    }

    lastX = x; lastY = y;
  });

  /* ---- Animation loop ---- */
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = fireflies.length - 1; i >= 0; i--) {
      const f = fireflies[i];

      // Physics
      f.x  += f.vx;
      f.y  += f.vy;
      f.vy += 0.038;   // gentle gravity pulling back down
      f.vx *= 0.975;   // horizontal friction
      f.alpha -= f.decay;
      f.r    *= 0.984;

      if (f.alpha <= 0 || f.r < 0.1) { fireflies.splice(i, 1); continue; }

      const [r, g, b] = f.color;

      /* Soft outer glow */
      ctx.save();
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5.5);
      grd.addColorStop(0, `rgba(${r},${g},${b},${f.alpha * 0.32})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* Bright core */
      ctx.save();
      ctx.globalAlpha  = f.alpha;
      ctx.shadowColor  = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur   = f.r * 4;
      ctx.fillStyle    = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(loop);
  })();
})();
