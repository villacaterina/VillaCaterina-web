/**
 * Villa Caterina — Custom Calendar Widget
 * Renders months with availability from the iCal feed.
 * Dispatches a CustomEvent when selection changes.
 *
 * Usage: container div must have id="availability-calendar".
 * Fires: 'dateselected' on the container with detail: { checkin, checkout }
 * Reads: window.blockedDates, window.availabilityLoaded (set by booking.js)
 */

(function () {
  'use strict';

  const $container = document.getElementById('availability-calendar');
  if (!$container) return;

  // ──────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────

  let viewMonth = new Date();         // first month displayed
  viewMonth.setDate(1);

  const MODE_CHECKIN  = 'checkin';
  const MODE_CHECKOUT = 'checkout';

  let selectionState = MODE_CHECKIN;  // what the next click selects
  let checkinDate  = null;            // Date objects (local midnight)
  let checkoutDate = null;

  // i18n: dictionaries provided by js/i18n.js (must load first).
  // Falls back to English if i18n.js is missing.
  const I18N = window.VC_I18N || null;
  const T = I18N ? I18N.t : function (key) { return key; };

  const MONTHS = I18N ? I18N.months :
                 ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS   = I18N ? I18N.days : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const OPEN_MONTHS = [4, 5, 6, 7, 8, 9, 10]; // Apr–Oct

  // ──────────────────────────────────────────────
  // DATE HELPERS
  // ──────────────────────────────────────────────

  const today = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

  function dateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function isPast(d) { return d < today; }

  function isClosedSeason(d) {
    return !OPEN_MONTHS.includes(d.getMonth() + 1);
  }

  function isBlocked(d) {
    // window.blockedDates is a Set maintained by booking.js
    return window.blockedDates !== undefined && window.blockedDates.has(dateKey(d));
  }

  function isAvailable(d) {
    return !isPast(d) && !isClosedSeason(d) && !isBlocked(d);
  }

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function daysBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  /** Returns Date for the Monday-based month grid start. */
  function monthGridStart(year, month) {
    const first = new Date(year, month, 1);
    const dow = (first.getDay() + 6) % 7; // Monday = 0
    const start = new Date(first);
    start.setDate(first.getDate() - dow);
    return start;
  }

  // ──────────────────────────────────────────────
  // RENDERING
  // ──────────────────────────────────────────────

  function render() {
    $container.innerHTML = '';

    // Header with navigation
    const header = document.createElement('div');
    header.className = 'cal-header';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'cal-nav-btn';
    prevBtn.innerHTML = '&lsaquo;';
    prevBtn.setAttribute('aria-label', T('prevMonth'));

    const title = document.createElement('div');
    title.className = 'cal-title';
    const m2Month = (viewMonth.getMonth() + 1) % 12;
    const m2Year  = viewMonth.getMonth() === 11 ? viewMonth.getFullYear() + 1 : viewMonth.getFullYear();
    title.textContent = `${MONTHS[viewMonth.getMonth()]} ${viewMonth.getFullYear()} — ${MONTHS[m2Month]} ${m2Year}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'cal-nav-btn';
    nextBtn.innerHTML = '&rsaquo;';
    nextBtn.setAttribute('aria-label', T('nextMonth'));

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    $container.appendChild(header);

    prevBtn.onclick = () => { viewMonth.setMonth(viewMonth.getMonth() - 1); render(); };
    nextBtn.onclick = () => { viewMonth.setMonth(viewMonth.getMonth() + 1); render(); };

    // Two-month grid
    const monthsWrap = document.createElement('div');
    monthsWrap.className = 'cal-months';

    for (let offset = 0; offset < 2; offset++) {
      const ym = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1);
      monthsWrap.appendChild(renderMonth(ym.getFullYear(), ym.getMonth()));
    }

    $container.appendChild(monthsWrap);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'cal-legend';
    legend.innerHTML = `
      <span><i class="dot dot-available"></i> ${T('legendAvailable')}</span>
      <span><i class="dot dot-selected"></i> ${T('legendSelected')}</span>
      <span><i class="dot dot-range"></i> ${T('legendInRange')}</span>
      <span><i class="dot dot-blocked"></i> ${T('legendBooked')}</span>
      <span><i class="dot dot-closed"></i> ${T('legendClosed')}</span>
    `;
    $container.appendChild(legend);

    if (!window.availabilityLoaded) {
      const note = document.createElement('div');
      note.className = 'cal-loading';
      note.textContent = T('loading');
      $container.appendChild(note);
    } else if (!window.availabilityHasData) {
      const warn = document.createElement('div');
      warn.className = 'cal-warning';
      warn.setAttribute('role', 'alert');
      warn.textContent = T('calLoadFailed');
      $container.appendChild(warn);
    }
  }

  function renderMonth(year, month) {
    const wrap = document.createElement('div');
    wrap.className = 'cal-month';

    const label = document.createElement('div');
    label.className = 'cal-month-label';
    label.textContent = `${MONTHS[month]} ${year}`;
    wrap.appendChild(label);

    // Day names
    const dayNames = document.createElement('div');
    dayNames.className = 'cal-week';
    DAYS.forEach(d => {
      const dn = document.createElement('div');
      dn.className = 'cal-dayname';
      dn.textContent = d;
      dayNames.appendChild(dn);
    });
    wrap.appendChild(dayNames);

    // Cell grid (6 weeks × 7 days covers any month)
    const days = document.createElement('div');
    days.className = 'cal-days';

    const start = monthGridStart(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(start);
      cellDate.setDate(start.getDate() + i);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      if (cellDate.getMonth() !== month) {
        cell.classList.add('out-of-month');
      } else {
        cell.innerHTML = `<span class="cal-daynum">${cellDate.getDate()}</span>`;
        const avail = isAvailable(cellDate);

        if (isPast(cellDate)) {
          cell.classList.add('past');
        } else if (isBlocked(cellDate)) {
          cell.classList.add('blocked');
          cell.title = T('alreadyBooked');
        } else if (isClosedSeason(cellDate)) {
          cell.classList.add('closed');
          cell.title = T('closedTooltip');
        } else {
          cell.classList.add('available');

          // Highlight selected range
          if (sameDay(cellDate, checkinDate) || sameDay(cellDate, checkoutDate)) {
            cell.classList.add('selected');
          } else if (checkinDate && checkoutDate
            && cellDate > checkinDate && cellDate < checkoutDate) {
            cell.classList.add('in-range');
          } else if (checkinDate && !checkoutDate && cellDate > checkinDate) {
            // Preview hover: not implemented (would need mouseenter)
          }

          cell.addEventListener('click', () => handleDateClick(new Date(cellDate)));
        }
      }

      days.appendChild(cell);
    }

    wrap.appendChild(days);
    return wrap;
  }

  // ──────────────────────────────────────────────
  // INTERACTION
  // ──────────────────────────────────────────────

  function handleDateClick(d) {
    if (selectionState === MODE_CHECKIN) {
      checkinDate = d;
      checkoutDate = null;
      selectionState = MODE_CHECKOUT;
    } else {
      // User clicked checkout date
      if (d <= checkinDate) {
        // Clicked before check-in: treat as new check-in
        checkinDate = d;
        checkoutDate = null;
        selectionState = MODE_CHECKOUT;
      } else {
        checkoutDate = d;
        selectionState = MODE_CHECKIN; // ready for new selection if they re-click
      }
    }
    render();
    emitSelection();
  }

  function emitSelection() {
    const detail = {
      checkin:  checkinDate  ? dateKey(checkinDate)  : null,
      checkout: checkoutDate ? dateKey(checkoutDate) : null,
    };
    $container.dispatchEvent(new CustomEvent('dateselected', { detail, bubbles: true }));
  }

  // ──────────────────────────────────────────────
  // REFRESH HOOK: re-render when booking.js updates blockedDates
  // ──────────────────────────────────────────────

  window.calendarRefresh = function () { render(); };

  // Initial render
  render();
})();
