/* ==============================================
   FX — Scroll progress bar, 3-D card tilt,
        hero stat counters, hero name shimmer
   ============================================== */

/* -----------------------------------------------
   Scroll Progress Bar
   ----------------------------------------------- */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // set on load
})();


/* -----------------------------------------------
   3-D Card Tilt
   ----------------------------------------------- */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const SEL = '.tl-card, .proj-card, .skill-cat, .aw-item, .ss-card, .edu-card';
  document.querySelectorAll(SEL).forEach(card => {
    let animating = false;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
      animating = true;
    });

    card.addEventListener('mousemove', e => {
      if (!animating) return;
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2); // –1 … +1
      const dy = (e.clientY - cy) / (r.height / 2); // –1 … +1
      // Max tilt ±5deg
      card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      animating = false;
      card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1), box-shadow 0.6s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; animating = false; }, 620);
    });
  });
})();


/* -----------------------------------------------
   Hero Stat Counters (animate on first view)
   ----------------------------------------------- */
(function initCounters() {
  // Map each .hstat-val to its target
  const statEls = document.querySelectorAll('.hstat-val');
  if (statEls.length === 0) return;

  // Definitions in DOM order: GPA, Dean's, Nat'l, Internships
  const defs = [
    { target: 4.83,  decimals: 2, suffix: ''  },
    { target: 3,     decimals: 0, suffix: '×' },
    { target: null,  text: "Nat'l"             }, // static text
    { target: 4,     decimals: 0, suffix: '×' }
  ];

  let fired = false;

  const container = statEls[0].closest('.hero-stats') || statEls[0].parentElement;
  const obs = new IntersectionObserver(entries => {
    if (fired || !entries[0].isIntersecting) return;
    fired = true;
    obs.disconnect();

    statEls.forEach((el, i) => {
      const def = defs[i];
      if (!def || def.text !== undefined) return; // skip static

      const DURATION = 1400;
      const start    = performance.now();
      el.textContent = '0' + def.suffix;

      function tick(now) {
        const t    = Math.min((now - start) / DURATION, 1);
        const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = (ease * def.target).toFixed(def.decimals) + def.suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  obs.observe(container);
})();


/* -----------------------------------------------
   Hero Name Shimmer (periodic light sweep)
   ----------------------------------------------- */
(function initShimmer() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function sweep() {
    name.classList.add('shimmer-active');
    setTimeout(() => name.classList.remove('shimmer-active'), 1300);
  }

  // First sweep 2s after load, then every 5s
  setTimeout(() => {
    sweep();
    setInterval(sweep, 5000);
  }, 2000);
})();


/* -----------------------------------------------
   Hero Name Glitch (sporadic RGB-shift flash)
   ----------------------------------------------- */
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function glitch() {
    name.classList.add('glitching');
    setTimeout(() => name.classList.remove('glitching'), 420);
  }

  // First glitch ~4 s after load (after intro finishes), then random intervals
  setTimeout(() => {
    glitch();
    function scheduleNext() {
      const delay = 4500 + Math.random() * 6000; // 4.5–10.5 s
      setTimeout(() => { glitch(); scheduleNext(); }, delay);
    }
    scheduleNext();
  }, 4000);
})();
