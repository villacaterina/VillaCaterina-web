/**
 * Villa Caterina — Scroll reveal
 *
 * Fades sections in as they scroll into view.
 *
 * Elements opt in with [data-reveal]; a container marked [data-reveal-group]
 * staggers its direct children instead of animating as one block.
 *
 * Nothing is hidden until this script has confirmed it can reveal it again:
 * the hiding CSS is scoped to .reveal-enabled on <html>, which is only added
 * below. If the script never runs, IntersectionObserver is missing, or the
 * visitor asked for reduced motion, the page simply renders fully visible.
 */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var targets = [];

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    targets.push(el);
  });

  document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    var i = 0;
    Array.prototype.forEach.call(group.children, function (child) {
      child.style.setProperty('--reveal-delay', (i * 90) + 'ms');
      targets.push(child);
      i++;
    });
  });

  if (!targets.length) return;

  // Safe to hide things now that the observer below will bring them back.
  document.documentElement.classList.add('reveal-enabled');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target); // reveal once, never re-hide
    });
  }, {
    // Trigger a little before the element is fully on screen.
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.05
  });

  targets.forEach(function (el) {
    el.classList.add('reveal-pending');
    observer.observe(el);
  });
})();
