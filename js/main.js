/* ==============================================
   MAIN — Smooth scroll & misc utilities
   ============================================== */

/* Smooth scroll for all anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

/* Lazy-load images with IntersectionObserver fallback */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported — nothing extra needed
} else {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObs   = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src || e.target.src;
        imgObs.unobserve(e.target);
      }
    });
  });
  lazyImgs.forEach(img => imgObs.observe(img));
}
