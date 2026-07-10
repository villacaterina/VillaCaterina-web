/**
 * Villa Caterina — Reviews
 * Renders guest reviews from the static data array.
 */

(function () {
  'use strict';

  // Sample reviews — replace with real data or fetch from an API
  const reviews = [
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'Absolutely stunning villa! The views of Lake Como from the balcony were breathtaking. The interior is beautifully preserved with modern amenities. We felt like we were living in a piece of Italian history.',
      date: 'August 2025'
    },
    {
      name: 'Marco R.',
      rating: 5,
      text: 'Perfect location, just steps from the ferry. The kitchen was fully equipped and we loved cooking with fresh local ingredients. The private parking was a huge bonus.',
      date: 'July 2025'
    },
    {
      name: 'Emma & James T.',
      rating: 5,
      text: 'We celebrated our anniversary here and it exceeded all expectations. The fireplace in the living room created such a cozy atmosphere. Will definitely return!',
      date: 'June 2025'
    },
    {
      name: 'Hans W.',
      rating: 4,
      text: 'Beautiful historic villa with character. The bedrooms are spacious and the bathrooms are modern. Only minor issue was the WiFi signal in the upstairs bedroom, but honestly we didn\'t mind disconnecting.',
      date: 'September 2025'
    },
    {
      name: 'Sophie L.',
      rating: 5,
      text: 'The outdoor dining area was magical — we had dinner under the stars every night. The laundry facilities made our two-week stay so convenient. Highly recommended!',
      date: 'May 2025'
    },
    {
      name: 'David & Lisa K.',
      rating: 5,
      text: 'Villa Caterina is a gem. The attention to detail in the restoration is remarkable. We especially loved the original staircase and the view from the kitchen window. A truly memorable experience.',
      date: 'April 2025'
    }
  ];

  const grid = document.getElementById('reviews-grid');
  const empty = document.getElementById('reviews-empty');

  if (!grid || !empty) return;

  if (reviews.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  // Render each review
  reviews.forEach(function (review) {
    const card = document.createElement('article');
    card.className = 'review-card';

    // Stars
    const stars = document.createElement('div');
    stars.className = 'review-stars';
    for (let i = 0; i < review.rating; i++) {
      const star = document.createElement('span');
      star.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
      stars.appendChild(star);
    }

    // Text
    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = '"' + review.text + '"';

    // Footer
    const footer = document.createElement('footer');
    footer.className = 'review-footer';

    const name = document.createElement('strong');
    name.textContent = review.name;

    const date = document.createElement('span');
    date.textContent = review.date;

    footer.appendChild(name);
    footer.appendChild(date);

    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(footer);

    grid.appendChild(card);
  });
})();
