# Villa Caterina — Static Website

A high-performance, backend-free vacation rental website built with pure HTML5, CSS3, and vanilla JavaScript. No frameworks, no build tools, no backend — just fast, maintainable static files.

## Architecture Philosophy

- **Direct human communication** over automated booking systems
- **Zero dependencies** — no npm, no bundlers, no transpilers
- **Instant deployment** — upload to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or plain FTP)
- **Email-first workflow** — inquiries go straight to the owner's Gmail via Formspree

## Project Structure

```
VillaCaterina-web/
├── index.html              # Homepage with date picker & pricing engine
├── contact.html            # Auto-filled inquiry form
├── css/
│   └── styles.css          # Complete stylesheet (responsive)
├── js/
│   ├── booking.js          # Pricing logic, validation, iCal sync, redirect
│   └── contact.js          # URL param parsing, form autofill, submission
└── assets/                 # Images (copied from legacy codebase)
    ├── main.jpg
    ├── villa-itself.jpg
    ├── lake.jpg
    └── inside/
    └── facilities/
```

## Setup Instructions

### 1. Configure Formspree (for email delivery)

Replace `YOUR_FORM_ID` in `contact.html` line 47:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Steps:**
1. Sign up at [Formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form pointing to `villacaterina2020@gmail.com`
3. Copy your form's ID (e.g., `xpzglkjq`)
4. Replace `YOUR_FORM_ID` with that ID

**Fallback:** If Formspree is not configured, the form opens the user's email client with a pre-filled `mailto:` link.

---

### 2. Configure Booking.com Availability Sync (optional)

To block dates that are already booked on Booking.com:

1. Log into your [Booking.com Extranet](https://admin.booking.com)
2. Go to **Calendar** → **Sync calendars**
3. Copy the **export URL** (ends in `.ics`)
4. Paste it into `js/booking.js` line 18:

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
The pricing logic in `js/booking.js` iterates through each individual night and applies the correct rate based on this tier matrix:

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
| November – March | **Closed** |

### 2. Validation Rules
- **Minimum stay:** 3 nights (enforced in `booking.js` line 162)
- **Operational season:** April–October only (configurable line 14)
- **No same-day turnover:** If a guest checks out on Day X, that day is blocked for incoming guests (iCal parser applies this rule, line 88)
- **Future dates only:** Check-in must be today or later

### 3. State Transfer via URL Parameters
When the user completes a valid selection, they're redirected to:
```
contact.html?checkin=2026-07-10&checkout=2026-07-17&guests=4&price=5040&nights=7
```

The contact page reads these params (`js/contact.js` line 11) and auto-fills a beautifully formatted inquiry message.

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
