# Changelog

## [Unreleased]

### Added
- Complete static site rework (VillaCaterina-web)
- Seasonal pricing engine with per-night rate calculation
- Booking.com iCal availability sync with turn-over rule
- Minimum 3-night stay enforcement
- URL parameter-based state transfer (index → contact)
- Auto-filled inquiry form with booking summary
- Formspree integration for email delivery
- Responsive design with mobile-first approach
- Zero-dependency architecture (no frameworks, no build tools)

### Changed
- Migrated from Next.js/React to pure vanilla HTML/CSS/JS
- Replaced database-backed booking system with direct email inquiries
- Simplified architecture: single-page flow with contact redirect

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
