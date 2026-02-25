/* ==============================================
   REVEAL — Scroll-triggered reveal animations
   ============================================== */
(function initReveal() {
  const ELS = document.querySelectorAll('.reveal-up, .reveal-left');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      // Stagger siblings within same parent
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal-up, .reveal-left')];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('visible'), idx * 40);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  ELS.forEach(el => obs.observe(el));
})();
