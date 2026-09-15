# Villa Caterina

The website for **Villa Caterina** — a luxury vacation rental on Lake Como, Italy.

Live: [villacaterina.casa](https://villacaterina.casa)

## Tech stack

Zero-dependency static site. No frameworks, no build tools, no bundlers.

- Vanilla HTML, CSS, and JavaScript
- Photos served as AVIF/WebP with a JPEG fallback (see "Regenerate image formats")
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
│   ├── build_i18n.py   # Generates the translated pages, sitemap.xml, robots.txt
│   ├── build_images.py # Generates the AVIF and WebP variants
│   ├── avif_encode.swift     # AVIF encoder used by build_images.py
│   └── sync_availability.py  # Fetches Booking.com iCal → availability.json
├── .github/workflows/availability.yml  # Cron job for availability sync
├── CNAME               # Custom domain for GitHub Pages
├── _headers            # Cloudflare/Netlify security headers (inert on GitHub Pages)
├── sitemap.xml         # Generated
├── robots.txt          # Generated
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

The root pages are the source of truth. Also writes `sitemap.xml` and `robots.txt`.

### Adding a review

Reviews live in `js/reviews.js`, in `bookingReviews`, `googleReviews` or
`airbnbReviews`:

```js
{
  reviewer: 'Name, CC',
  date: '2026-07',          // YYYY-MM; rendered in the page language
  score: 10,                // Booking.com is out of 10, Airbnb/Google out of 5
  originalLang: 'de',       // what the guest actually wrote in
  title: '…',               // ALWAYS the original text
  text: '…',
  translations: {           // one entry per other site language
    en: { title: '…', text: '…' },
    it: { … }, fr: { … },
  }
}
```

The page shows the translation for its own language with a "Show original"
toggle, or the original if there's no translation for it. Order doesn't matter —
cards are sorted newest-first.

Add `featured: true` to put a review on the home page. Platform averages and the
`aggregateRating` in the structured data are computed from the scores.

### Regenerate image formats

After adding or replacing a photo in `assets/`:

```bash
python3 scripts/build_images.py
```

Writes `photo.avif` and `photo.webp` next to each `photo.jpg`, skipping anything
already up to date. Pages serve them through `<picture>` — AVIF, then WebP, then
the JPEG — so older browsers still get a working image. `js/gallery.js` relies on
the three files sharing one path when it swaps the main photo.

Needs `cwebp` (`brew install webp`) and `swiftc` for the AVIF encoder, which uses
the system ImageIO via `scripts/avif_encode.swift`.

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
- Review texts carry their own translations in `js/reviews.js` (see "Adding a review")
- `hreflang`, `canonical` and the social tags are injected per language;
  `og:title` / `og:description` come from each page's translated `<title>` and
  description, so there's nothing extra to keep in sync

## Content Security Policy

The site uses a strict CSP (`script-src 'self'`, no inline scripts). Any new JavaScript must live in an external file under `js/`.

The `<meta http-equiv>` tag in each page is what actually applies. `_headers`
(Cloudflare/Netlify) and `.htaccess` (Apache) do nothing on GitHub Pages — they're
kept in case the site moves hosts, so keep them in step with the meta tag.

`ld+json` is a data block, not executable script, so `script-src` doesn't block
the structured data.

## License

Private — all rights reserved. © 2020 Villa Caterina.
