/**
 * Villa Caterina — Contact Page
 * Reads URL parameters from the booking flow and auto-fills the inquiry form.
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // PARSE URL PARAMETERS
  // ──────────────────────────────────────────────

  const params = new URLSearchParams(window.location.search);

  const checkin    = params.get('checkin');
  const checkout   = params.get('checkout');
  const guests     = params.get('guests');
  const price      = params.get('price');
  const nights     = params.get('nights');

  // ──────────────────────────────────────────────
  // DATE FORMATTING
  // ──────────────────────────────────────────────

  function formatHumanDate(isoStr) {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // ──────────────────────────────────────────────
  // AUTO-FILL FORM
  // ──────────────────────────────────────────────

  const $form     = document.getElementById('contact-form');
  const $email    = document.getElementById('form-email');
  const $name     = document.getElementById('form-name');
  const $message  = document.getElementById('form-message');
  const $feedback = document.getElementById('form-feedback');
  const $formWrapper = document.querySelector('.contact-form-wrapper');

  // If we have booking params, build the pre-filled message
  if (checkin && checkout && guests && price) {
    const checkinFormatted  = formatHumanDate(checkin);
    const checkoutFormatted = formatHumanDate(checkout);
    const priceFormatted    = Number(price).toLocaleString('en-US');

    const messageText = [
      `Hello,`,
      ``,
      `I would like to request a booking at Villa Caterina:`,
      ``,
      `  Check-in:  ${checkinFormatted}`,
      `  Check-out: ${checkoutFormatted}`,
      `  Guests:    ${guests}`,
      `  Duration:  ${nights} night${nights === '1' ? '' : 's'}`,
      ``,
      `  Estimated Total Price: €${priceFormatted}`,
      ``,
      `Please confirm availability and let me know the next steps.`,
      ``,
      `Thank you,`,
    ].join('\n');

    $message.value = messageText;

    // Add a visual booking summary above the form
    const summary = document.createElement('div');
    summary.className = 'booking-summary';
    summary.innerHTML = `
      <strong>Booking Summary</strong><br>
      ${checkinFormatted} &rarr; ${checkoutFormatted}<br>
      ${guests} guest${guests === '1' ? '' : 's'} &middot; ${nights} night${nights === '1' ? '' : 's'} &middot; <strong>&euro;${priceFormatted}</strong>
    `;
    $formWrapper.insertBefore(summary, $form);
  }

  // ──────────────────────────────────────────────
  // FORM SUBMISSION (Formspree / Web3Forms)
  // ──────────────────────────────────────────────

  function showFeedback(text, type) {
    $feedback.textContent = text;
    $feedback.className = `form-feedback visible ${type}`;
  }

  $form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData($form);

    // ── Basic validation ──
    const email = formData.get('email');
    const message = formData.get('message');

    if (!email || !email.includes('@')) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    if (!message || message.trim().length < 10) {
      showFeedback('Please include a message with your inquiry.', 'error');
      return;
    }

    // ── Submit to Formspree ──
    const action = $form.getAttribute('action');

    // Check if Formspree is configured
    if (!action || action.includes('YOUR_FORM_ID')) {
      // Fallback: open mailto link
      const subject = encodeURIComponent('Booking Inquiry - Villa Caterina');
      const body = encodeURIComponent(
        `From: ${formData.get('name') || 'Anonymous'} (${email})\n\n${message}`
      );
      window.location.href = `mailto:villacaterina2020@gmail.com?subject=${subject}&body=${body}`;
      showFeedback('Opening your email client...', 'success');
      return;
    }

    // Real Formspree submission
    const submitBtn = $form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    })
      .then(function (response) {
        if (response.ok) {
          showFeedback(
            'Thank you! Your inquiry has been sent. We will reply to your email shortly.',
            'success'
          );
          $form.reset();
        } else {
          return response.json().then(function (data) {
            showFeedback(
              data.errors ? data.errors.map(function (e) { return e.message; }).join(', ') : 'Something went wrong. Please try again.',
              'error'
            );
          });
        }
      })
      .catch(function () {
        showFeedback('Network error. Please check your connection and try again.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      });
  });

})();
