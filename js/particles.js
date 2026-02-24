/* ==============================================
   PARTICLES — Canvas neural-network animation
               + mouse repulsion (cursor parts the network)
   ============================================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = ['rgba(56,189,248,', 'rgba(129,140,248,', 'rgba(167,139,250,'];
  const N      = 88;
  const CONNECT_DIST  = 148;
  const REPEL_RADIUS  = 115;
  const REPEL_RADIUS2 = REPEL_RADIUS * REPEL_RADIUS;
  const MAX_SPEED     = 2.8;

  /* ---- Mouse tracking ---- */
  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x   = Math.random() * W;
    this.y   = Math.random() * H;
    this.r   = Math.random() * 1.8 + 0.5;
    this.vx  = (Math.random() - 0.5) * 0.45;
    this.vy  = (Math.random() - 0.5) * 0.45;
    this.bvx = this.vx;   // base (resting) velocity
    this.bvy = this.vy;
    this.a   = Math.random() * 0.5 + 0.1;
    this.c   = COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  function connect(p1, p2) {
    const dx = p1.x - p2.x, dy = p1.y - p2.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < CONNECT_DIST) {
      const alpha = (1 - d / CONNECT_DIST) * 0.18;
      ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Draw connections first (behind particles) */
    for (let i = 0; i < particles.length; i++)
      for (let j = i + 1; j < particles.length; j++)
        connect(particles[i], particles[j]);

    particles.forEach(p => {
      /* ---- Mouse repulsion ---- */
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const d2 = dx * dx + dy * dy;

      if (d2 < REPEL_RADIUS2 && d2 > 0) {
        const d     = Math.sqrt(d2);
        const force = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 0.55;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }

      /* Drift velocity back toward resting state (spring) */
      p.vx += (p.bvx - p.vx) * 0.04;
      p.vy += (p.bvy - p.vy) * 0.04;

      /* Speed cap */
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > MAX_SPEED) { p.vx = p.vx / spd * MAX_SPEED; p.vy = p.vy / spd * MAX_SPEED; }

      /* Move & bounce */
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20 || p.x > W + 20) p.vx *= -1;
      if (p.y < -20 || p.y > H + 20) p.vy *= -1;

      /* Draw particle */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > W) p.x = Math.random() * W;
      if (p.y > H) p.y = Math.random() * H;
    });
  }, { passive: true });

  /* Pause when hero not visible (performance) */
  const hero = document.getElementById('hero');
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!animId) draw(); }
    else { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0 }).observe(hero);

  resize();
  particles = Array.from({ length: N }, () => new Particle());
  draw();
})();
