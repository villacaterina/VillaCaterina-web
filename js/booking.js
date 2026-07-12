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
     * Availability data — a same-origin JSON file generated from the
     * Booking.com iCal feed by GitHub Actions every 6 hours.
     * See scripts/sync_availability.py.
     */
    AVAILABILITY_URL: '/availability.json',
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

  // i18n: dictionaries provided by js/i18n.js (must load first).
  // Falls back to English if i18n.js is missing.
  const I18N = window.VC_I18N || null;
  const T = I18N ? I18N.t : function (key) { return key; };
  const LOCALE = I18N ? I18N.locale : 'en-US';
  const nightsWord = n => I18N ? I18N.plural(n, 'night', 'nights') : (String(n) === '1' ? 'night' : 'nights');

  function formatDateHuman(d) {
    return d.toLocaleDateString(LOCALE, { month: 'long', day: 'numeric', year: 'numeric' });
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
  // AVAILABILITY DATA
  // Reads availability.json — a same-origin static file kept in sync with the
  // Booking.com iCal feed by a GitHub Action (.github/workflows/availability.yml,
  // runs scripts/sync_availability.py every 6 hours). No CORS proxies needed.
  // ──────────────────────────────────────────────

  let blockedDates = new Set();
  // availabilityLoaded = fetch finished (success OR failure)
  // availabilityHasData = fetch succeeded (file parsed, even if 0 bookings)
  window.blockedDates = blockedDates;
  window.availabilityLoaded = false;
  window.availabilityHasData = false;

  async function fetchAvailability() {
    try {
      const resp = await fetch(CONFIG.AVAILABILITY_URL, { cache: 'no-cache' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      if (!data || !Array.isArray(data.dates)) throw new Error('Malformed availability.json');
      applyBlockedDates(new Set(data.dates));
      console.log(`[VillaCaterina] Availability loaded: ${blockedDates.size} blocked days (generated ${data.generated})`);
    } catch (err) {
      console.error('[VillaCaterina] Failed to load availability data:', err);
    }
    window.availabilityLoaded = true;
    finishAvailability();
  }

  function finishAvailability() {
    if (window.calendarRefresh) window.calendarRefresh();
    if (window.revalidateBooking) window.revalidateBooking();
  }

  /** Central place to swap the blocked-dates set and sync globals. */
  function applyBlockedDates(set) {
    blockedDates = set;
    window.blockedDates = blockedDates;
    window.availabilityHasData = true;
  }

  /** Check if a date is blocked (booked via Booking.com) */
  function isBlocked(date) {
    return blockedDates.has(formatDateISO(date));
  }

  // ──────────────────────────────────────────────
  // UI CONTROLLER
  // ──────────────────────────────────────────────

  const $calendar = document.getElementById('availability-calendar');
  const $hint = document.getElementById('calendar-hint');
  const $adults = document.getElementById('adults');
  const $children = document.getElementById('children');
  const $priceDisplay = document.getElementById('price-display');
  const $priceAmount = document.getElementById('price-amount');
  const $priceBreakdown = document.getElementById('price-breakdown');
  const $btn = document.getElementById('check-availability-btn');
  const $message = document.getElementById('booking-message');

  // Date selection state (managed by calendar.js)
  let selectedCheckin = null;
  let selectedCheckout = null;

  // Track previous price to avoid re-animating on guest count change
  let prevPrice = 0;

  function showMessage(text, type) {
    $message.textContent = text;
    $message.className = `booking-message visible ${type}`;
  }

  function clearMessage() {
    $message.className = 'booking-message';
    $message.textContent = '';
  }

  /** Animate price counter from previous value to target value */
  function animatePrice(targetValue, duration = 600) {
    const start = performance.now();
    const startValue = prevPrice;
    
    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic: decelerating to zero velocity
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
      
      $priceAmount.textContent = `€${currentValue.toLocaleString('en-US')}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  /**
   * Core validation & pricing logic.
   * Called when calendar selection changes or guest count changes.
   */
  function validate() {
    clearMessage();

    const checkInStr = selectedCheckin;
    const checkOutStr = selectedCheckout;
    const adults = parseInt($adults.value, 10) || 0;
    const children = parseInt($children.value, 10) || 0;
    const totalGuests = adults + children;

    if (!checkInStr || !checkOutStr) {
      $btn.disabled = true;
      $btn.textContent = T('btnSelectDates');
      $priceDisplay.style.display = 'none';
      return;
    }

    const checkIn = parseDate(checkInStr);
    const checkOut = parseDate(checkOutStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ── Validation checks ──

    if (checkIn < today) {
      showMessage(T('msgFutureDate'), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnInvalidDates');
      $priceDisplay.style.display = 'none';
      return;
    }

    if (checkOut <= checkIn) {
      showMessage(T('msgOrder'), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnInvalidDates');
      $priceDisplay.style.display = 'none';
      return;
    }

    const nights = nightCount(checkIn, checkOut);

    if (nights < CONFIG.MIN_STAY) {
      showMessage(T('msgMinStay', { min: CONFIG.MIN_STAY, n: nights, nightsWord: nightsWord(nights) }), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnTooShort');
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Season check: every night must fall in operational months ──
    if (!isOperationalDate(checkIn)) {
      showMessage(T('msgOpenSeason'), 'warning');
      $btn.disabled = true;
      $btn.textContent = T('btnClosedSeason');
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
      showMessage(T('msgCrossSeason'), 'warning');
      $btn.disabled = true;
      $btn.textContent = T('btnClosedSeason');
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Guest count ──
    if (totalGuests < 1) {
      showMessage(T('msgMinGuest'), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnInvalid');
      $priceDisplay.style.display = 'none';
      return;
    }

    if (totalGuests > 8) {
      showMessage(T('msgMaxGuests'), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnTooManyGuests');
      $priceDisplay.style.display = 'none';
      return;
    }

    if (adults < 1) {
      showMessage(T('msgAdultRequired'), 'error');
      $btn.disabled = true;
      $btn.textContent = T('btnInvalid');
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Calculate price ──
    const pricing = calculatePrice(checkIn, checkOut);

    if (pricing.closedSeason) {
      showMessage(T('msgClosedNights'), 'warning');
      $btn.disabled = true;
      $btn.textContent = T('btnClosedSeason');
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
        T('msgConflict', { date: formatDateHuman(conflictDate) }),
        'error'
      );
      $btn.disabled = true;
      $btn.textContent = T('btnUnavailable');
      $priceDisplay.style.display = 'none';
      return;
    }

    // ── Show price & enable button ──
    // Only animate price if the value actually changed (prevents flicker on guest count change)
    const newPrice = pricing.total;
    if (newPrice !== prevPrice) {
      animatePrice(newPrice);
      prevPrice = newPrice;
    }
    $priceDisplay.style.display = 'block';
    $priceBreakdown.textContent = T('breakdown', { nights: pricing.nights, from: formatDateHuman(checkIn), to: formatDateHuman(checkOut) });

    // ── Warn if availability data is missing ──
    if (!window.availabilityLoaded) {
      showMessage(
        T('msgStillLoading'),
        'warning'
      );
    } else if (!window.availabilityHasData) {
      showMessage(
        T('msgLoadFailed'),
        'warning'
      );
    }

    $btn.disabled = false;
    $btn.textContent = T('btnRequestStay');

    // Store for redirect
    $btn.dataset.checkin = checkInStr;
    $btn.dataset.checkout = checkOutStr;
    $btn.dataset.guests = String(totalGuests);
    $btn.dataset.price = String(pricing.total);
    $btn.dataset.nights = String(pricing.nights);
  }

  // ──────────────────────────────────────────────
  // SET MIN DATE ON CALENDAR (handled by calendar.js)
  // ──────────────────────────────────────────────

  function setMinDates() {
    // Calendar.js handles this internally
  }

  // ──────────────────────────────────────────────
  // CALENDAR EVENT LISTENER
  // ──────────────────────────────────────────────

  if ($calendar) {
    $calendar.addEventListener('dateselected', function (e) {
      selectedCheckin = e.detail.checkin;
      selectedCheckout = e.detail.checkout;
      
      // Update hint text
      if ($hint) {
        if (!selectedCheckin) {
          $hint.textContent = T('hintCheckin');
        } else if (!selectedCheckout) {
          $hint.textContent = T('hintCheckout', { date: formatDateHuman(parseDate(selectedCheckin)) });
        } else {
          const nights = nightCount(parseDate(selectedCheckin), parseDate(selectedCheckout));
          $hint.textContent = T('hintRange', { from: formatDateHuman(parseDate(selectedCheckin)), to: formatDateHuman(parseDate(selectedCheckout)), nights: nights });
        }
      }
      
      validate();
    });
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

  $adults.addEventListener('input', validate);
  $children.addEventListener('input', validate);
  $btn.addEventListener('click', redirectToContact);

  // Allow booking.js availability updates to re-run validation
  window.revalidateBooking = validate;

  // ──────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────

  setMinDates();
  fetchAvailability(); // fire-and-forget

})();
