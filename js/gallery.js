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
  const totalImages = thumbs.length;

  /**
   * Update the main image with fade transition
   */
  function updateImage(index) {
    if (index === currentIndex) return;
    
    // Fade out
    mainImg.classList.add('fade');
    
    // Update after fade completes
    setTimeout(() => {
      const thumb = thumbs[index];
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.alt;
      mainImg.classList.remove('fade');
      
      // Update active thumb
      thumbs[currentIndex].classList.remove('active');
      thumbs[index].classList.add('active');
      
      // Scroll thumb into view
      thumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      
      currentIndex = index;
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

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  });
})();
