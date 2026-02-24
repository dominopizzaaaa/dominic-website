/* ==============================================
   NAV — Navbar scroll, active links, hamburger, back-to-top
   ============================================== */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const backTop  = document.getElementById('backToTop');
  const hamburger= document.getElementById('hamburger');
  const navMenu  = document.getElementById('navLinks');

  /* Scroll handler */
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', sy > 60);

    // Back-to-top button
    if (backTop) backTop.classList.toggle('visible', sy > 400);

    // Active nav link
    let current = '';
    sections.forEach(s => { if (sy >= s.offsetTop - 110) current = s.id; });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* Back-to-top click */
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Hamburger */
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }
})();
