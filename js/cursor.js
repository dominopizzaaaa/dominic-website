/* ==============================================
   CURSOR — Custom cursor dot + lagging ring
              + magnetic button pull
   ============================================== */
(function initCursor() {
  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Start at centre so there's no initial jump
  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  /* ---- Mouse tracking ---- */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly (transform in rAF below keeps it perfectly synced)
  });

  /* ---- Animation loop: lerp ring toward cursor ---- */
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  /* ---- Hover states ---- */
  const HOVER_SEL = [
    'a', 'button', 'label', 'input', 'select', 'textarea',
    '.btn-primary', '.btn-outline', '.social-icon', '.atab',
    '.gallery-item', '.stl-photo', '.aw-cert-thumb',
    '.skill-cat', '.proj-card', '.tl-card', '[role="button"]'
  ].join(',');

  document.querySelectorAll(HOVER_SEL).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  /* ---- Click feedback ---- */
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('click'));

  /* ---- Hide when cursor leaves the window ---- */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  /* ---- Magnetic pull on key interactive elements ---- */
  const MAGNETIC_SEL = '.btn-primary, .btn-outline, .social-icon';
  document.querySelectorAll(MAGNETIC_SEL).forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Pull strength: 28% of distance, clamped implicitly by element bounds
      btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 560);
    });
  });
})();
