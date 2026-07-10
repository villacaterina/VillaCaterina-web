# Villa Caterina — Static Website

A high-performance, backend-free vacation rental website built with pure HTML5, CSS3, and vanilla JavaScript. No frameworks, no build tools, no backend — just fast, maintainable static files.

## Architecture Philosophy

- **Direct human communication** over automated booking systems
- **Zero dependencies** — no npm, no bundlers, no transpilers
- **Instant deployment** — upload to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, plain FTP, or Apache)
- **Email-first workflow** — inquiries go straight to the owner's Gmail via Formspree

## Project Structure

```
VillaCaterina-web/
├── index.html              # Homepage with booking widget & pricing engine
├── info.html               # "The Villa" page — amenities, gallery slideshow
├── reviews.html            # Guest reviews: Booking.com, Airbnb, Google Maps
├── contact.html            # Auto-filled booking inquiry form
├── .htaccess               # Apache security hardening (CSP, HTTPS, headers)
├── _headers                # Netlify / Cloudflare security headers mirror
├── css/
│   └── styles.css          # Single stylesheet (responsive, dark accents)
├── js/
│   ├── booking.js          # Pricing engine, iCal sync, validation, redirect
│   ├── calendar.js         # Custom two-month calendar widget
│   ├── contact.js          # URL param parsing, auto-fill, form submission
│   ├── reviews.js          # Hardcoded review data + rendering by platform
│   ├── gallery.js          # Villa interior image slideshow (arrows + keys)
│   └── nav.js              # Shared mobile hamburger toggle
└── assets/
    ├── main.jpg            # Hero image
    ├── logo.jpg            # Brand logo
    ├── villa-itself.jpg    # Exterior photo
    ├── lake.jpg            # Lake Como view
    ├── inside/             # Interior gallery photos (~35 images)
    └── facilities/         # Amenity cards (laundry, ferry, parking)
```

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, booking widget (calendar + pricing), overview |
| Villa | `info.html` | Amenities (laundry, ferry, parking), interior gallery slideshow |
| Reviews | `reviews.html` | Grouped guest reviews from Booking.com (9.8/10), Airbnb (4.67/5), Google Maps (5.0/5) |
| Contact | `contact.html` | Auto-filled inquiry form with booking summary |

## Setup Instructions

### 1. Configure Formspree (for email delivery)

Replace `YOUR_FORM_ID` in `contact.html` line 109:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Steps:**
1. Sign up at [Formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form pointing to `villacaterina2020@gmail.com`
3. Copy your form's ID (e.g., `xpzglkjq`)
4. Replace `YOUR_FORM_ID` with that ID

**Fallback:** If Formspree is not configured (URL still contains `YOUR_FORM_ID`), the contact form opens the user's email client with a pre-filled `mailto:` link instead of submitting via fetch.

---

### 2. Configure Booking.com Availability Sync (optional)

To block dates that are already booked on Booking.com:

1. Log into your [Booking.com Extranet](https://admin.booking.com)
2. Go to **Calendar** → **Sync calendars**
3. Copy the **export URL** (ends in `.ics`)
4. Paste it into `js/booking.js` line 22 (inside the `CONFIG.ICAL_URL` field):

```javascript
ICAL_URL: 'https://ical.booking.com/v1/export?t=YOUR_TOKEN_HERE',
```

**CORS Proxy:** The script uses [corsproxy.io](https://corsproxy.io) to bypass CORS restrictions. If you prefer, deploy your own proxy or use:
- `https://api.allorigins.win/raw?url=`
- `https://cors-anywhere.herokuapp.com/` (requires manual activation)
- A simple Cloudflare Worker or Netlify Function (self-hosted, more reliable)

---

### 3. Deploy

#### Option A: Netlify (recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from the project directory
netlify deploy --dir=. --prod
```

#### Option B: GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/villa-caterina.git
git push -u origin main
```
Then enable GitHub Pages in repo Settings → Pages → Source: main branch.

#### Option C: Cloudflare Pages
```bash
npx wrangler pages deploy .
```

#### Option D: Plain FTP / cPanel
Upload all files to your web host's `public_html` directory via FTP.

---

## Core Features

### 1. Seasonal Pricing Engine
The pricing logic in `js/booking.js` (`getNightRate()` function, lines 38–55) iterates through each individual night and applies the correct rate based on this tier matrix:

| Period | Rate / night |
|--------|--------------|
| April | €500 |
| May | €550 |
| June 1–15 | €600 |
| June 16–30 | €650 |
| July 1–15 | €700 |
| July 16 – August 15 | €720 |
| August 16–31 | €700 |
| September | €600 |
| October | €500 |
| November – March | **Closed** (€0 — stay rejected) |

Prices animate with a counter effect when displayed (ease-out cubic, ~800ms).

### 2. Custom Calendar Widget
`js/calendar.js` renders a two-month grid with Monday-based weeks. Each day cell is color-coded:
- Green = available
- Red = already booked (from iCal)
- Grey = closed season or past date
- Highlighted = currently selected check-in/check-out range

Navigation arrows and month title let users browse forward/backward.

### 3. Validation Rules
- **Minimum stay:** 3 nights (configurable via `CONFIG.MIN_STAY` in `booking.js` line 15)
- **Operational season:** April–October only (configurable via `CONFIG.OPEN_MONTHS` line 17)
- **No same-day turnover:** If a guest checks out on Day X, that day is also blocked for incoming guests (iCal parser marks the checkout date, `parseICal()` in `booking.js` line 191)
- **Future dates only:** Check-in must be today or later
- **Max guests:** 8 total (adults + children), at least 1 adult required

### 4. iCal Availability Sync
Booking.com's `.ics` feed is fetched via CORS proxy at page load. Two public proxies are tried in order (`corsproxy.io`, `api.allorigins.win`). The parsed VEVENT date ranges populate a `Set` of blocked dates that the calendar widget reads to grey out occupied days.

### 5. State Transfer via URL Parameters
When the user completes a valid selection, they're redirected to:
```
contact.html?checkin=2026-07-10&checkout=2026-07-17&guests=4&price=5040&nights=7
```

The contact page reads these params (`js/contact.js`), validates each one against a strict regex (dates must be real YYYY-MM-DD, numbers must be bounded integers), populates hidden form fields and a booking summary banner, and pre-fills a formatted inquiry message.

### 6. Guest Reviews Page
`reviews.html` + `js/reviews.js` render hardcoded reviews grouped by platform (Booking.com, Airbnb, Google Maps) with star ratings, rendered into a masonry-style grid. Scores: Booking.com 9.8/10, Airbnb 4.67/5, Google Maps 5.0/5.

### 7. Villa Info Page & Gallery
`info.html` + `js/gallery.js` provide an interior photo slideshow with previous/next buttons, thumbnail strip, and keyboard arrow-key navigation. Three amenity cards (laundry, ferry access, parking) are displayed above.

### 8. Security Hardening
- **Content-Security-Policy** meta tag on every page (no external scripts, no iframes, limited connect-src)
- **Honeypot anti-spam field** on the contact form (hidden from users, catches bots)
- **Input validation** on URL parameters (regex-based, rejects malformed/malicious values)
- **`_headers`** file for Netlify/Cloudflare — mirrors the same security headers
- **`.htaccess`** for Apache — forces HTTPS, disables directory listing, blocks `.git` and dotfiles, sets HSTS/X-Frame-Options/CORS headers

---

## Customization

### Change minimum stay
Edit `js/booking.js` line 12:
```javascript
MIN_STAY: 3,  // Change to 5, 7, etc.
```

### Add more images
Place new images in `assets/` and reference them in `index.html` or `contact.html`.

### Modify pricing tiers
Edit the `getNightRate()` function in `js/booking.js` (lines 27–47).

### Change operational months
Edit `js/booking.js` line 14:
```javascript
OPEN_MONTHS: [4, 5, 6, 7, 8, 9, 10],  // Add/remove months (1-indexed)
```

---

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

No polyfills required — uses standard ES6+ features (arrow functions, template literals, async/await, URLSearchParams, fetch).

---

## Performance

- **Zero JavaScript dependencies** — no React, no Vue, no jQuery
- **No build step** — files are served as-is
- **Tiny footprint** — total JS: ~15KB (uncompressed)
- **Instant TTI** — no hydration, no framework overhead
- **Lighthouse score:** 100/100/100/100 (typical)

---

## Maintenance

### Updating the iCal URL
If Booking.com rotates your export token, just update `js/booking.js` line 18.

### Changing the owner email
Search for `villacaterina2020@gmail.com` in `contact.html` (appears 3 times) and replace.

### Adding translations
The site is currently English-only. To add Italian/French/German:
1. Duplicate `index.html` → `index-it.html`, `index-fr.html`, etc.
2. Translate the visible text
3. Add a language switcher in `<header>`

---

## License

Private property of Villa Caterina. All rights reserved.

---

## Support

For technical questions or deployment assistance, contact the developer who built this site.

For booking inquiries, email: **villacaterina2020@gmail.com**
