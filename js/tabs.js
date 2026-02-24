/* ==============================================
   TABS — Awards tab switching
   ============================================== */
(function initTabs() {
  const tabs   = document.querySelectorAll('.atab');
  const panels = document.querySelectorAll('.award-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = 'panel-' + tab.dataset.panel;

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(id);
      if (!panel) return;
      panel.classList.add('active');

      // Re-trigger reveals for newly visible items
      panel.querySelectorAll('.reveal-up, .reveal-left').forEach((el, i) => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), i * 55);
      });
    });
  });
})();
