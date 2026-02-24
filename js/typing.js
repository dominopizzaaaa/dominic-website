/* ==============================================
   TYPING — Typewriter animation in hero
   ============================================== */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const lines = [
    'NUS Global Merit Scholar',
    'AI/ML Engineer @ DSO National Laboratories',
    'Singapore National Table Tennis Athlete',
    'NUS Table Tennis Captain',
    'Computer Vision & NLP Researcher',
    'Full-Stack Engineer'
  ];

  let li = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 58, SPEED_DEL = 32, PAUSE = 2200;

  function type() {
    const line = lines[li];
    if (!deleting) {
      el.textContent = line.slice(0, ++ci);
      if (ci === line.length) { deleting = true; return setTimeout(type, PAUSE); }
      setTimeout(type, SPEED_TYPE);
    } else {
      el.textContent = line.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
      setTimeout(type, SPEED_DEL);
    }
  }
  setTimeout(type, 1400);
})();
