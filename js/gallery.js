/**
 * Villa Caterina Gallery Slideshow
 * Handles image navigation with fade transition and thumbnail scrolling
 */
(function() {
  'use strict';

  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');
  
  if (!mainImg || !thumbs.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let pendingSwap = null;
  const totalImages = thumbs.length;

  /**
   * Update the main image with fade transition.
   *
   * currentIndex moves up front rather than inside the timeout: clicking faster
   * than the 400ms fade used to queue several callbacks that each read a stale
   * currentIndex, so the wrong thumbnail got un-highlighted and 'active' stuck
   * on more than one at a time.
   */
  function updateImage(index) {
    if (index === currentIndex) return;

    clearTimeout(pendingSwap);

    thumbs[currentIndex].classList.remove('active');
    thumbs[index].classList.add('active');
    currentIndex = index;

    // Fade out
    mainImg.classList.add('fade');

    // Swap the source once the fade has played
    pendingSwap = setTimeout(() => {
      pendingSwap = null;
      const thumb = thumbs[index];
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.alt;
      mainImg.classList.remove('fade');

      thumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }, 400);
  }

  /**
   * Navigate to next image
   */
  function nextImage() {
    const nextIndex = (currentIndex + 1) % totalImages;
    updateImage(nextIndex);
  }

  /**
   * Navigate to previous image
   */
  function prevImage() {
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateImage(prevIndex);
  }

  // Thumbnail click handlers
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateImage(index));
  });

  // Navigation button handlers
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Keyboard navigation. The listener is on the document because the thumbnails
  // are plain divs and never take focus, so scope it by hand instead: ignore
  // keys meant for a field, and only steal the arrows while the gallery is
  // actually on screen.
  const gallery = mainImg.closest('.info-gallery-section') || mainImg.parentElement;

  function isTyping() {
    const el = document.activeElement;
    if (!el) return false;
    return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  }

  function galleryOnScreen() {
    const r = gallery.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
  }

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (isTyping() || !galleryOnScreen()) return;

    e.preventDefault();
    if (e.key === 'ArrowLeft') prevImage();
    else nextImage();
  });
})();
