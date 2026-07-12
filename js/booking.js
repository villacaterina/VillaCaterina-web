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
     * Booking.com iCal feed URL.
     * Exports all booked periods so we can block those dates client-side.
     */
    ICAL_URL: 'https://ical.booking.com/v1/export?t=ed273647-2356-409c-a5c4-109b75e750b6',
    /**
     * CORS proxies (tried in order). Booking.com doesn't set
     * Access-Control-Allow-Origin, so we need a relay.
     */
    CORS_PROXIES: [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
    ],
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

  let blockedDates = new Set();
   // availabilityLoaded = fetch finished (success OR failure)
   // availabilityHasData = fetch succeeded AND we parsed at least some blocked dates
   window.blockedDates = blockedDates;
   window.availabilityLoaded = false;
   window.availabilityHasData = false;

   // Grab iCal from Booking.com via CORS proxy, try each until one works.
   async function fetchAvailability() {
     if (!CONFIG.ICAL_URL) {
       console.warn('[VillaCaterina] No iCal URL configured — all dates treated as available.');
     window.availabilityLoaded = true;
     finishAvailability();
     return;
   }

   for (const proxy of CONFIG.CORS_PROXIES) {
     try {
       const proxyUrl = proxy + encodeURIComponent(CONFIG.ICAL_URL);
       const response = await fetch(proxyUrl);
       if (!response.ok) continue;
       parseICal(await response.text());
       window.availabilityHasData = true;
       window.availabilityLoaded = true;
       finishAvailability();
       return;
     } catch (_) { continue; }
   }

   // All proxies failed — flag that fetch completed but no booking data available.
   console.error('[VillaCaterina] All CORS proxies failed.');
   window.availabilityLoaded = true;
   finishAvailability();
  }

  function finishAvailability() {
   if (window.calendarRefresh) window.calendarRefresh();
   if (window.revalidateBooking) window.revalidateBooking();
  }
    availabilityLoaded = true;
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
    console.log(`[VillaCaterina] Availability synced: ${blocked.size} blocked days from Booking.com calendar`);
    
    // Update global reference and refresh calendar
    window.blockedDates = blockedDates;
    window.availabilityLoaded = true;
    if (window.calendarRefresh) {
      window.calendarRefresh();
    }
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

    // ── Guest count ──
    if (totalGuests < 1) {
      showMessage('Please enter at least 1 guest.', 'error');
      $btn.disabled = true;
      $btn.textContent = 'Invalid';
      $priceDisplay.style.display = 'none';
      return;
    }

    if (totalGuests > 8) {
      showMessage('Maximum 8 guests total (adults + children).', 'error');
      $btn.disabled = true;
      $btn.textContent = 'Too Many Guests';
      $priceDisplay.style.display = 'none';
      return;
    }

    if (adults < 1) {
      showMessage('At least 1 adult is required.', 'error');
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

    // ── Show price & enable button ──
    // Only animate price if the value actually changed (prevents flicker on guest count change)
    const newPrice = pricing.total;
    if (newPrice !== prevPrice) {
      animatePrice(newPrice);
      prevPrice = newPrice;
    }
    $priceDisplay.style.display = 'block';
    $priceBreakdown.textContent = `${pricing.nights} nights · ${formatDateHuman(checkIn)} → ${formatDateHuman(checkOut)}`;

    // ── Warn if availability data hasn't loaded yet ──
    if (!availabilityLoaded) {
      showMessage(
        '⚠ Availability data is still loading. Your selected dates may already be booked on Booking.com.',
        'warning'
      );
    }

    $btn.disabled = false;
    $btn.textContent = 'Request This Stay';

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
          $hint.textContent = 'Click a check-in date.';
        } else if (!selectedCheckout) {
          $hint.textContent = `Check-in: ${formatDateHuman(parseDate(selectedCheckin))}. Now click check-out.`;
        } else {
          const nights = nightCount(parseDate(selectedCheckin), parseDate(selectedCheckout));
          $hint.textContent = `${formatDateHuman(parseDate(selectedCheckin))} → ${formatDateHuman(parseDate(selectedCheckout))} (${nights} nights)`;
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

  // ──────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────

  setMinDates();
  fetchAvailability(); // fire-and-forget

})();
