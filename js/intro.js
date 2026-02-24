/* ==============================================
   INTRO — Cinematic split-screen page reveal
   ============================================== */
(function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // Lock scroll while panels cover everything
  document.documentElement.classList.add('intro-lock');

  function exit() {
    // Fade centre text 100ms before panels move
    overlay.classList.add('exit');
    document.documentElement.classList.remove('intro-lock');

    // Once panels have slid fully off, nuke the overlay (saves layers)
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 950);
  }

  // Hold for ~2.1 s so the user can read the name, then reveal
  setTimeout(exit, 2100);
})();
