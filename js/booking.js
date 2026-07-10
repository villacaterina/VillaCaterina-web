/**
 * Villa Caterina — Booking Engine
 * Handles: seasonal pricing, date validation, iCal availability, redirect flow.
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────────────

  const CONFIG = {
    /** Minimum stay in nights */
    MIN_STAY: 3,
    /** Operational months (1-indexed). All others are closed. */
    OPEN_MONTHS: [4, 5, 6, 7, 8, 9, 10],
    /**
     * Booking.com iCal feed.
     * Replace this URL with the real one from the Booking.com extranet.
     */
    ICAL_URL: '',
    /**
     * CORS proxy to fetch the iCal (needed because Booking.com doesn't set
     * Access-Control-Allow-Origin).  Use a public proxy or deploy your own.
     */
    CORS_PROXY: 'https://corsproxy.io/?',
  };

  // ──────────────────────────────────────────────
  // SEASONAL PRICING
  // Returns the per-night rate (€) for a given Date.
  // ──────────────────────────────────────────────

  function getNightRate(date) {
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    if (month === 4) return 500;
    if (month === 5) return 550;
    if (month === 6 && day <= 15) return 600;
    if (month === 6 && day >= 16) return 650;
    if (month === 7 && day <= 15) return 700;
    if (month === 7 && day >= 16) return 720;
    if (month === 8 && day <= 15) return 720;
    if (month === 8 && day >= 16) return 700;
    if (month === 9) return 600;
    if (month === 10) return 500;

    // Closed season (Nov–Mar)
    return 0;
  }

  /**
   * Calculate total price by iterating each individual night.
   * A "night" is from check-in date D to D+1; the rate is based on D's month/day.
   * Returns { total, nights, rateBreakdown[] }
   */
  function calculatePrice(checkIn, checkOut) {
    let total = 0;
    let nights = 0;
    const breakdown = [];

    const cursor = new Date(checkIn);
    while (cursor < checkOut) {
      const rate = getNightRate(cursor);
      if (rate === 0) {
        // Night falls in closed season — invalidate
        return { total: 0, nights: 0, breakdown: [], closedSeason: true };
      }
      total += rate;
      breakdown.push({
        date: formatDateISO(cursor),
        rate: rate,
      });
      nights++;
      cursor.setDate(cursor.getDate() + 1);
    }

    return { total, nights, breakdown, closedSeason: false };
  }

  // ──────────────────────────────────────────────
  // DATE UTILITIES
  // ──────────────────────────────────────────────

  function formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDateHuman(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function parseDate(str) {
    if (!str) return null;
    const parts = str.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  /** True if the date falls within operational months (Apr–Oct) */
  function isOperationalDate(date) {
    return CONFIG.OPEN_MONTHS.includes(date.getMonth() + 1);
  }

  /** Count nights between two dates */
  function nightCount(from, to) {
    return Math.round((to - from) / (1000 * 60 * 60 * 24));
  }

  // ──────────────────────────────────────────────
  // iCAL AVAILABILITY PARSING
  // Fetches Booking.com .ics feed via CORS proxy and extracts blocked dates.
  // ──────────────────────────────────────────────

  let blockedDates = new Set(); // Set of "YYYY-MM-DD" strings

  async function fetchAvailability() {
    if (!CONFIG.ICAL_URL) {
      // No iCal URL configured — skip, treat all dates as available
      return;
    }

    try {
      const proxyUrl = CONFIG.CORS_PROXY + encodeURIComponent(CONFIG.ICAL_URL);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        console.warn('iCal fetch failed:', response.status);
        return;
      }
      const text = await response.text();
      parseICal(text);
    } catch (err) {
      console.warn('iCal fetch error:', err);
    }
  }

  /**
   * Minimal iCal parser — extracts VEVENT DTSTART/DTEND pairs
   * and marks every day in each range as blocked.
   */
  function parseICal(raw) {
    const lines = raw.replace(/\r\n[ \t]/g, '').split(/\r?\n/); // unfold + split
    const blocked = new Set();

    let inEvent = false;
    let dtStart = null;
    let dtEnd = null;

    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        dtStart = null;
        dtEnd = null;
      } else if (line === 'END:VEVENT') {
        inEvent = false;
        if (dtStart && dtEnd) {
          // Mark every day in [dtStart, dtEnd) as blocked
          // Also apply turn-over rule: block checkout day too
          const cursor = new Date(dtStart);
          while (cursor < dtEnd) {
            blocked.add(formatDateISO(cursor));
            cursor.setDate(cursor.getDate() + 1);
          }
          // Turn-over rule: block the checkout day itself
          blocked.add(formatDateISO(dtEnd));
        }
      } else if (inEvent) {
        if (line.startsWith('DTSTART')) {
          dtStart = parseICalDate(line);
        } else if (line.startsWith('DTEND')) {
          dtEnd = parseICalDate(line);
        }
      }
    }

    blockedDates = blocked;
    console.log(`Availability loaded: ${blocked.size} blocked days`);
  }

  /**
   * Parse an iCal date from a property line like:
   *   DTSTART;VALUE=DATE:20260815
   *   DTSTART:20260815T140000Z
   */
  function parseICalDate(line) {
    const value = line.split(':')[1];
    if (!value) return null;
    const str = value.replace(/[^0-9]/g, '').slice(0, 8); // YYYYMMDD
    if (str.length < 8) return null;
    return new Date(+str.slice(0, 4), +str.slice(4, 6) - 1, +str.slice(6, 8));
  }

  /** Check if a date is blocked (booked via Booking.com) */
  function isBlocked(date) {
    return blockedDates.has(formatDateISO(date));
  }

  // ──────────────────────────────────────────────
  // UI CONTROLLER
  // ──────────────────────────────────────────────

  const $checkin = document.getElementById('checkin');
  const $checkout = document.getElementById('checkout');
  const $guests = document.getElementById('guests');
  const $priceDisplay = document.getElementById('price-display');
  const $priceAmount = document.getElementById('price-amount');
  const $priceBreakdown = document.getElementById('price-breakdown');
  const $btn = document.getElementById('check-availability-btn');
  const $message = document.getElementById('booking-message');

  function showMessage(text, type) {
    $message.textContent = text;
    $message.className = `booking-message visible ${type}`;
  }

  function clearMessage() {
    $message.className = 'booking-message';
    $message.textContent = '';
  }

  /**
   * Core validation & pricing logic.
   * Called on every input change.
   */
  function validate() {
    clearMessage();

    const checkInStr = $checkin.value;
    const checkOutStr = $checkout.value;
    const guests = parseInt($guests.value, 10) || 0;

    if (!checkInStr || !checkOutStr) {
      $btn.disabled = true;
      $btn.textContent = 'Select Dates';
      $priceDisplay.style.display = 'none';
      return;
    }

    const checkIn = parseDate(checkInStr);
    const checkOut = parseDate(checkOutStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ── Validation checks ──

    if (checkIn < today) {
      showMessage('Check-in date must be in the future.', 'error');
      $btn.disabled = true;
      $btn.textContent = 'Invalid Dates';
      $priceDisplay.style.display = 'none';
      return;
    }

    if (checkOut <= checkIn) {
      showMessage('Check-out must be after check-in.', 'error');
      $btn.disabled = true;
      $btn.textContent = 'Invalid Dates';
      $priceDisplay.style.display = 'none';
      return;
    }

    const nights = nightCount(checkIn, checkOut);

    if (nights < CONFIG.MIN_STAY) {
      showMessage(`Minimum stay is ${CONFIG.MIN_STAY} nights. Your selection: ${nights} night${nights === 1 ? '' : 's'}.`, 'error');
      $btn.disabled = true;
      $btn.textContent = 'Too Short';
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Season check: every night must fall in operational months ──
    if (!isOperationalDate(checkIn)) {
      showMessage('The property is only open from April to October.', 'warning');
      $btn.disabled = true;
      $btn.textContent = 'Closed Season';
      $priceDisplay.style.display = 'none';
      return;
    }

    // Check each night's date for closed season
    const cursor = new Date(checkIn);
    let inClosedSeason = false;
    while (cursor < checkOut) {
      if (!isOperationalDate(cursor)) {
        inClosedSeason = true;
        break;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (inClosedSeason) {
      showMessage('Your stay crosses into the closed season (Nov–Mar). Please adjust dates.', 'warning');
      $btn.disabled = true;
      $btn.textContent = 'Closed Season';
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Availability check (iCal blocked dates) ──
    const availCursor = new Date(checkIn);
    let conflictDate = null;
    while (availCursor < checkOut) {
      if (isBlocked(availCursor)) {
        conflictDate = new Date(availCursor);
        break;
      }
      availCursor.setDate(availCursor.getDate() + 1);
    }
    // Also check checkout day (turn-over rule: it's blocked for incoming,
    // meaning the current booking's checkout day is fine for THIS booking
    // but the day itself is blocked for incoming guests — which is us checking in)
    if (isBlocked(checkIn)) {
      conflictDate = new Date(checkIn);
    }

    if (conflictDate) {
      showMessage(
        `These dates conflict with an existing booking (${formatDateHuman(conflictDate)}). Please choose different dates.`,
        'error'
      );
      $btn.disabled = true;
      $btn.textContent = 'Unavailable';
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Guest count ──
    if (guests < 1) {
      showMessage('Please enter at least 1 guest.', 'error');
      $btn.disabled = true;
      $btn.textContent = 'Invalid';
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Calculate price ──
    const pricing = calculatePrice(checkIn, checkOut);

    if (pricing.closedSeason) {
      showMessage('Your stay includes nights in the closed season.', 'warning');
      $btn.disabled = true;
      $btn.textContent = 'Closed Season';
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Show price & enable button ──
    $priceDisplay.style.display = 'block';
    $priceAmount.textContent = `€${pricing.total.toLocaleString('en-US')}`;
    $priceBreakdown.textContent = `${pricing.nights} nights · ${formatDateHuman(checkIn)} → ${formatDateHuman(checkOut)}`;

    $btn.disabled = false;
    $btn.textContent = 'Request This Stay';

    // Store for redirect
    $btn.dataset.checkin = checkInStr;
    $btn.dataset.checkout = checkOutStr;
    $btn.dataset.guests = String(guests);
    $btn.dataset.price = String(pricing.total);
    $btn.dataset.nights = String(pricing.nights);
  }

  // ──────────────────────────────────────────────
  // SET MIN DATE ON DATE INPUTS
  // ──────────────────────────────────────────────

  function setMinDates() {
    const today = formatDateISO(new Date());
    $checkin.min = today;
    $checkout.min = today;
  }

  // ──────────────────────────────────────────────
  // REDIRECT TO CONTACT PAGE
  // ──────────────────────────────────────────────

  function redirectToContact() {
    const params = new URLSearchParams({
      checkin: $btn.dataset.checkin,
      checkout: $btn.dataset.checkout,
      guests: $btn.dataset.guests,
      price: $btn.dataset.price,
      nights: $btn.dataset.nights,
    });
    window.location.href = `contact.html?${params.toString()}`;
  }

  // ──────────────────────────────────────────────
  // EVENT LISTENERS
  // ──────────────────────────────────────────────

  $checkin.addEventListener('change', validate);
  $checkout.addEventListener('change', validate);
  $guests.addEventListener('input', validate);
  $btn.addEventListener('click', redirectToContact);

  // ──────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────

  setMinDates();
  fetchAvailability(); // fire-and-forget

})();
