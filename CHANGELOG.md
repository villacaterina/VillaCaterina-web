# Changelog

## [Unreleased]

### Added
- Light/dark theme toggle with localStorage persistence and OS preference detection
- Theme toggle buttons in desktop header and mobile navigation
- FOUC prevention via inline script in `<head>` of all HTML pages
- Complete static site rework (VillaCaterina-web)
- Seasonal pricing engine with per-night rate calculation
- Booking.com iCal availability sync with turn-over rule
- Minimum 3-night stay enforcement
- URL parameter-based state transfer (index → contact)
- Auto-filled inquiry form with booking summary
- Formspree integration for email delivery
- Responsive design with mobile-first approach
- Zero-dependency architecture (no frameworks, no build tools)
- Security hardening: CSP, CORS, XSS, HTTPS (`.htaccess` + `_headers`)
- Honeypot anti-spam field on contact form
- Input validation on URL parameters (regex-based, rejects malformed/malicious values)
- Custom two-month calendar widget with color-coded availability
- Interior photo gallery slideshow with keyboard navigation
- Reviews page with 3 platforms: Booking.com (9.8/10), Airbnb (4.67/5), Google Maps (5.0/5)

### Changed
- Migrated from Next.js/React to pure vanilla HTML/CSS/JS
- Replaced database-backed booking system with direct email inquiries
- Simplified architecture: single-page flow with contact redirect
- Updated line number references in README to match current code (2026-07-10)
- Fixed outdated iCal URL documentation (was line 18, now line 22)

### Removed
- Admin panel and authentication system
- Database schema and Prisma ORM
- Server-side API routes
- React framework dependencies
- Build process and npm toolchain
- i18n multi-language support (English-only for now)

### Fixed
- Performance overhead from React hydration
- Complex deployment requirements
- Dependency management complexity

### Left to do
- [ ] Add a favicon (no `<link rel="icon">` declared on any page)
- [ ] Replace Formspree `YOUR_FORM_ID` placeholder with a real form endpoint before going live
