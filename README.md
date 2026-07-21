# Villa Caterina

The website for **Villa Caterina** — a luxury vacation rental on Lake Como, Italy.

Live: [villacaterina.casa](https://villacaterina.casa)

## Tech stack

Zero-dependency static site. No frameworks, no build tools, no bundlers.

- Vanilla HTML, CSS, and JavaScript
- Hosted on **GitHub Pages** with a custom domain (`villacaterina.casa`) proxied via Zone.eu
- Translated into Italian, French, and German (generated pages)

### Integrations

| Service | Purpose |
|---------|---------|
| Formspree | Contact form submissions → `villacaterina2020@gmail.com` |
| Booking.com iCal | Availability feed for the calendar (blocked dates) |
| GitHub Actions | Syncs availability every 6 hours |

## Repository layout

```
├── index.html          # Home (English, source of truth)
├── info.html           # Villa details
├── reviews.html        # Guest reviews
├── contact.html        # Contact form
├── it/  fr/  de/       # Translated pages (generated)
├── css/styles.css      # All styles
├── js/                 # Site scripts
├── assets/             # Images
├── scripts/
│   ├── build_i18n.py   # Generates the translated pages
│   └── sync_availability.py  # FetchesBooking.com iCal → availability.json
├── .github/workflows/availability.yml  # Cron job for availability sync
├── CNAME               # Custom domain for GitHub Pages
├── _headers            # Cloudflare/Page security headers
└── availability.json   # Generated blocked-dates list
```

## Development

No install step. Serve the repo root with any static file server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` directly (note: `connect-src 'self'` in the CSP means the contact form and availability fetch will fail from `file://` — use a local server to test those).

## Scripts

### Regenerate translated pages

After editing any root HTML page, regenerate the `it/`, `fr/`, `de/` versions:

```bash
python3 scripts/build_i18n.py
```

The English root pages are the single source of truth. Review texts (in `js/reviews.js`) are intentionally **not** translated.

### Sync availability (manual)

The GitHub Action runs this automatically every 6 hours. To run it locally:

```bash
python3 scripts/sync_availability.py
```

Fetches the Booking.com iCal feed and writes `availability.json` with blocked dates. The action commits back to `main` if the file changed.

## Deployment

Pushes to `main` deploy automatically via GitHub Pages. The custom domain is configured in `CNAME` with security headers in `_headers`.

## Internationalization

- English pages at the repo root are the source of truth
- `scripts/build_i18n.py` generates language subdirectories (`it/`, `fr/`, `de/`)
- Client-side UI strings are handled by `js/i18n.js` (keyed off `<html lang>`)
- `hreflang` alternate links are injected into translated pages for SEO

## Content Security Policy

The site uses a strict CSP (`script-src 'self'`, no inline scripts). Any new JavaScript must live in an external file under `js/`.

## License

Private — all rights reserved. © 2020 Villa Caterina.
