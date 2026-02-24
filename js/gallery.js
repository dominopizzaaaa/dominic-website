/* ==============================================
   GALLERY — Lightbox for sports photo gallery
   ============================================== */
(function initGallery() {
  const items    = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || items.length === 0) return;

  const lbImg     = lightbox.querySelector('.lb-img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbClose   = lightbox.querySelector('.lb-close');
  const lbPrev    = lightbox.querySelector('.lb-prev');
  const lbNext    = lightbox.querySelector('.lb-next');

  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = ((idx % items.length) + items.length) % items.length;
    const item = items[currentIdx];
    lbImg.src = item.querySelector('img').src;
    lbCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Unset src after fade-out
    setTimeout(() => { if (!lightbox.classList.contains('open')) lbImg.src = ''; }, 320);
  }

  // Open on click
  items.forEach((item, idx) => item.addEventListener('click', () => openLightbox(idx)));

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => openLightbox(currentIdx - 1));
  lbNext.addEventListener('click',  () => openLightbox(currentIdx + 1));

  // Click backdrop to close
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox(currentIdx - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIdx + 1);
  });
})();
