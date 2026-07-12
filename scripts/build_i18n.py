#!/usr/bin/env python3
"""
Villa Caterina — i18n page generator.

Generates it/, fr/, de/ versions of the four root pages by transforming the
English HTML:
  1. sets <html lang="…">
  2. rewrites asset paths (assets/, css/, js/) to ../
  3. injects hreflang alternate links
  4. replaces visible English strings with translations

Review texts (injected by js/reviews.js) are intentionally NOT translated.

Run after editing any root page:  python3 scripts/build_i18n.py
The root pages themselves are the single source of truth for structure.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'info.html', 'reviews.html', 'contact.html']
LANGS = ['it', 'fr', 'de']
BASE_URL = 'https://villacaterina.casa'

# ────────────────────────────────────────────────
# Shared strings (header, footer) — every page
# ────────────────────────────────────────────────

COMMON = {
    'it': [
        ('>Home<', '>Home<'),
        ('>Villa</a></li>', '>La Villa</a></li>'),
        ('>Reviews<', '>Recensioni<'),
        ('>Contact<', '>Contatti<'),
        ('aria-label="Toggle theme"', 'aria-label="Cambia tema"'),
        ('aria-label="Menu"', 'aria-label="Menu"'),
        ('<h3>Navigate</h3>', '<h3>Naviga</h3>'),
        ('<h3>Connect</h3>', '<h3>Contatti</h3>'),
        ('A timeless private retreat on the shores of Lake Como, where historic elegance meets modern comfort.',
         'Un rifugio privato senza tempo sulle rive del Lago di Como, dove l\u2019eleganza storica incontra il comfort moderno.'),
        ('© 2026 Villa Caterina. All rights reserved.', '© 2026 Villa Caterina. Tutti i diritti riservati.'),
    ],
    'fr': [
        ('>Home<', '>Accueil<'),
        ('>Villa</a></li>', '>La Villa</a></li>'),
        ('>Reviews<', '>Avis<'),
        ('>Contact<', '>Contact<'),
        ('aria-label="Toggle theme"', 'aria-label="Changer de thème"'),
        ('<h3>Navigate</h3>', '<h3>Navigation</h3>'),
        ('<h3>Connect</h3>', '<h3>Contact</h3>'),
        ('A timeless private retreat on the shores of Lake Como, where historic elegance meets modern comfort.',
         'Une retraite privée intemporelle sur les rives du lac de Côme, où l\u2019élégance historique rencontre le confort moderne.'),
        ('© 2026 Villa Caterina. All rights reserved.', '© 2026 Villa Caterina. Tous droits réservés.'),
    ],
    'de': [
        ('>Home<', '>Start<'),
        ('>Villa</a></li>', '>Die Villa</a></li>'),
        ('>Reviews<', '>Bewertungen<'),
        ('>Contact<', '>Kontakt<'),
        ('aria-label="Toggle theme"', 'aria-label="Design wechseln"'),
        ('aria-label="Menu"', 'aria-label="Menü"'),
        ('<h3>Navigate</h3>', '<h3>Navigation</h3>'),
        ('<h3>Connect</h3>', '<h3>Kontakt</h3>'),
        ('A timeless private retreat on the shores of Lake Como, where historic elegance meets modern comfort.',
         'Ein zeitloser privater Rückzugsort am Ufer des Comer Sees, wo historische Eleganz auf modernen Komfort trifft.'),
        ('© 2026 Villa Caterina. All rights reserved.', '© 2026 Villa Caterina. Alle Rechte vorbehalten.'),
    ],
}

# ────────────────────────────────────────────────
# Per-page strings
# ────────────────────────────────────────────────

PAGE_STRINGS = {
    'index.html': {
        'it': [
            ('<title>Villa Caterina - Lake Como Luxury Retreat</title>',
             '<title>Villa Caterina - Rifugio di lusso sul Lago di Como</title>'),
            ('content="Villa Caterina - Luxury vacation rental on Lake Como. Book your stay in our historic villa with stunning lake views."',
             'content="Villa Caterina - Casa vacanze di lusso sul Lago di Como. Prenota il tuo soggiorno nella nostra villa storica con splendida vista lago."'),
            ('<h1>Your Private Retreat on Lake Como</h1>', '<h1>Il tuo rifugio privato sul Lago di Como</h1>'),
            ('<p>A historic villa where timeless elegance meets modern comfort</p>',
             '<p>Una villa storica dove l\u2019eleganza senza tempo incontra il comfort moderno</p>'),
            ('<h2>Check Availability</h2>', '<h2>Verifica disponibilità</h2>'),
            ('<label>Available Dates</label>', '<label>Date disponibili</label>'),
            ('Click a check-in date, then a check-out date (min. 3 nights).',
             'Clicca una data di check-in, poi una di check-out (min. 3 notti).'),
            ('<label for="adults">Adults</label>', '<label for="adults">Adulti</label>'),
            ('<label for="children">Children</label>', '<label for="children">Bambini</label>'),
            ('<div class="price-label">Total Price</div>', '<div class="price-label">Prezzo totale</div>'),
            ('>\n            Select Dates\n          <', '>\n            Seleziona le date\n          <'),
            ('<h2>A Timeless Escape</h2>', '<h2>Una fuga senza tempo</h2>'),
            ('Nestled on the shores of Lake Como, Villa Caterina offers an unparalleled \n          experience of Italian luxury. Our historic villa combines centuries of heritage \n          with contemporary amenities, providing the perfect sanctuary for discerning travelers \n          seeking privacy, beauty, and authentic Italian charm.',
             'Adagiata sulle rive del Lago di Como, Villa Caterina offre un\u2019esperienza impareggiabile di lusso italiano. La nostra villa storica unisce secoli di storia a comfort contemporanei, offrendo il rifugio perfetto per viaggiatori esigenti in cerca di privacy, bellezza e autentico fascino italiano.'),
        ],
        'fr': [
            ('<title>Villa Caterina - Lake Como Luxury Retreat</title>',
             '<title>Villa Caterina - Retraite de luxe au lac de Côme</title>'),
            ('content="Villa Caterina - Luxury vacation rental on Lake Como. Book your stay in our historic villa with stunning lake views."',
             'content="Villa Caterina - Location de vacances de luxe au lac de Côme. Réservez votre séjour dans notre villa historique avec vue imprenable sur le lac."'),
            ('<h1>Your Private Retreat on Lake Como</h1>', '<h1>Votre retraite privée au lac de Côme</h1>'),
            ('<p>A historic villa where timeless elegance meets modern comfort</p>',
             '<p>Une villa historique où l\u2019élégance intemporelle rencontre le confort moderne</p>'),
            ('<h2>Check Availability</h2>', '<h2>Vérifier les disponibilités</h2>'),
            ('<label>Available Dates</label>', '<label>Dates disponibles</label>'),
            ('Click a check-in date, then a check-out date (min. 3 nights).',
             'Cliquez sur une date d\u2019arrivée, puis sur une date de départ (min. 3 nuits).'),
            ('<label for="adults">Adults</label>', '<label for="adults">Adultes</label>'),
            ('<label for="children">Children</label>', '<label for="children">Enfants</label>'),
            ('<div class="price-label">Total Price</div>', '<div class="price-label">Prix total</div>'),
            ('>\n            Select Dates\n          <', '>\n            Sélectionnez les dates\n          <'),
            ('<h2>A Timeless Escape</h2>', '<h2>Une évasion intemporelle</h2>'),
            ('Nestled on the shores of Lake Como, Villa Caterina offers an unparalleled \n          experience of Italian luxury. Our historic villa combines centuries of heritage \n          with contemporary amenities, providing the perfect sanctuary for discerning travelers \n          seeking privacy, beauty, and authentic Italian charm.',
             'Nichée sur les rives du lac de Côme, la Villa Caterina offre une expérience inégalée du luxe italien. Notre villa historique allie des siècles de patrimoine à des équipements contemporains, offrant le refuge idéal aux voyageurs exigeants en quête d\u2019intimité, de beauté et de charme italien authentique.'),
        ],
        'de': [
            ('<title>Villa Caterina - Lake Como Luxury Retreat</title>',
             '<title>Villa Caterina - Luxus-Refugium am Comer See</title>'),
            ('content="Villa Caterina - Luxury vacation rental on Lake Como. Book your stay in our historic villa with stunning lake views."',
             'content="Villa Caterina - Luxuriöses Ferienhaus am Comer See. Buchen Sie Ihren Aufenthalt in unserer historischen Villa mit herrlichem Seeblick."'),
            ('<h1>Your Private Retreat on Lake Como</h1>', '<h1>Ihr privates Refugium am Comer See</h1>'),
            ('<p>A historic villa where timeless elegance meets modern comfort</p>',
             '<p>Eine historische Villa, in der zeitlose Eleganz auf modernen Komfort trifft</p>'),
            ('<h2>Check Availability</h2>', '<h2>Verfügbarkeit prüfen</h2>'),
            ('<label>Available Dates</label>', '<label>Verfügbare Daten</label>'),
            ('Click a check-in date, then a check-out date (min. 3 nights).',
             'Klicken Sie auf ein Anreisedatum, dann auf ein Abreisedatum (mind. 3 Nächte).'),
            ('<label for="adults">Adults</label>', '<label for="adults">Erwachsene</label>'),
            ('<label for="children">Children</label>', '<label for="children">Kinder</label>'),
            ('<div class="price-label">Total Price</div>', '<div class="price-label">Gesamtpreis</div>'),
            ('>\n            Select Dates\n          <', '>\n            Daten auswählen\n          <'),
            ('<h2>A Timeless Escape</h2>', '<h2>Eine zeitlose Auszeit</h2>'),
            ('Nestled on the shores of Lake Como, Villa Caterina offers an unparalleled \n          experience of Italian luxury. Our historic villa combines centuries of heritage \n          with contemporary amenities, providing the perfect sanctuary for discerning travelers \n          seeking privacy, beauty, and authentic Italian charm.',
             'Eingebettet am Ufer des Comer Sees bietet die Villa Caterina ein unvergleichliches Erlebnis italienischen Luxus. Unsere historische Villa verbindet jahrhundertealtes Erbe mit zeitgemäßer Ausstattung und ist das perfekte Refugium für anspruchsvolle Reisende, die Privatsphäre, Schönheit und authentischen italienischen Charme suchen.'),
        ],
    },

    'info.html': {
        'it': [
            ('<title>The Villa - Villa Caterina</title>', '<title>La Villa - Villa Caterina</title>'),
            ('content="Discover Villa Caterina — a historic luxury retreat on Lake Como with private parking, ferry access, and full laundry facilities."',
             'content="Scopri Villa Caterina — un rifugio storico di lusso sul Lago di Como con parcheggio privato, accesso al traghetto e lavanderia."'),
            ('<h1>The Villa</h1>', '<h1>La Villa</h1>'),
            ('A centuries-old Italian residence reimagined as a private sanctuary for the modern traveler. Every room tells a story, every window frames the lake.',
             'Una residenza italiana secolare reinventata come santuario privato per il viaggiatore moderno. Ogni stanza racconta una storia, ogni finestra incornicia il lago.'),
            ('<h2>Amenities &amp; Facilities</h2>', '<h2>Servizi e comfort</h2>'),
            ('<h3>Laundry</h3>', '<h3>Lavanderia</h3>'),
            ('In-unit washing machine, so you can pack light and stay as long as the lake calls you.',
             'Lavatrice in casa: viaggia leggero e resta quanto il lago ti chiama.'),
            ('<h3>Ferry Access</h3>', '<h3>Accesso al traghetto</h3>'),
            ('Steps from a ferry — reach Bellagio, Varenna, and Menaggio in minutes with or without a car.',
             'A pochi passi dal traghetto: raggiungi Bellagio, Varenna e Menaggio in pochi minuti, con o senza auto.'),
            ('<h3>Parking</h3>', '<h3>Parcheggio</h3>'),
            ('Secure parking included — a rare luxury on the Lake Como waterfront.',
             'Parcheggio custodito incluso: un lusso raro sul lungolago di Como.'),
            ('<h2>Inside the Villa</h2>', '<h2>Dentro la Villa</h2>'),
            ('aria-label="Previous image"', 'aria-label="Immagine precedente"'),
            ('aria-label="Next image"', 'aria-label="Immagine successiva"'),
        ],
        'fr': [
            ('<title>The Villa - Villa Caterina</title>', '<title>La Villa - Villa Caterina</title>'),
            ('content="Discover Villa Caterina — a historic luxury retreat on Lake Como with private parking, ferry access, and full laundry facilities."',
             'content="Découvrez la Villa Caterina — une retraite de luxe historique au lac de Côme avec parking privé, accès au ferry et buanderie."'),
            ('<h1>The Villa</h1>', '<h1>La Villa</h1>'),
            ('A centuries-old Italian residence reimagined as a private sanctuary for the modern traveler. Every room tells a story, every window frames the lake.',
             'Une résidence italienne séculaire réinventée en sanctuaire privé pour le voyageur moderne. Chaque pièce raconte une histoire, chaque fenêtre encadre le lac.'),
            ('<h2>Amenities &amp; Facilities</h2>', '<h2>Équipements et services</h2>'),
            ('<h3>Laundry</h3>', '<h3>Buanderie</h3>'),
            ('In-unit washing machine, so you can pack light and stay as long as the lake calls you.',
             'Lave-linge sur place : voyagez léger et restez aussi longtemps que le lac vous appelle.'),
            ('<h3>Ferry Access</h3>', '<h3>Accès au ferry</h3>'),
            ('Steps from a ferry — reach Bellagio, Varenna, and Menaggio in minutes with or without a car.',
             'À quelques pas du ferry : rejoignez Bellagio, Varenna et Menaggio en quelques minutes, avec ou sans voiture.'),
            ('<h3>Parking</h3>', '<h3>Parking</h3>'),
            ('Secure parking included — a rare luxury on the Lake Como waterfront.',
             'Parking sécurisé inclus : un luxe rare sur les rives du lac de Côme.'),
            ('<h2>Inside the Villa</h2>', '<h2>À l\u2019intérieur de la Villa</h2>'),
            ('aria-label="Previous image"', 'aria-label="Image précédente"'),
            ('aria-label="Next image"', 'aria-label="Image suivante"'),
        ],
        'de': [
            ('<title>The Villa - Villa Caterina</title>', '<title>Die Villa - Villa Caterina</title>'),
            ('content="Discover Villa Caterina — a historic luxury retreat on Lake Como with private parking, ferry access, and full laundry facilities."',
             'content="Entdecken Sie die Villa Caterina — ein historisches Luxus-Refugium am Comer See mit privatem Parkplatz, Fährzugang und Waschküche."'),
            ('<h1>The Villa</h1>', '<h1>Die Villa</h1>'),
            ('A centuries-old Italian residence reimagined as a private sanctuary for the modern traveler. Every room tells a story, every window frames the lake.',
             'Eine jahrhundertealte italienische Residenz, neu gedacht als privates Refugium für den modernen Reisenden. Jeder Raum erzählt eine Geschichte, jedes Fenster rahmt den See.'),
            ('<h2>Amenities &amp; Facilities</h2>', '<h2>Ausstattung &amp; Annehmlichkeiten</h2>'),
            ('<h3>Laundry</h3>', '<h3>Waschküche</h3>'),
            ('In-unit washing machine, so you can pack light and stay as long as the lake calls you.',
             'Waschmaschine im Haus — reisen Sie mit leichtem Gepäck und bleiben Sie, solange der See ruft.'),
            ('<h3>Ferry Access</h3>', '<h3>Fährzugang</h3>'),
            ('Steps from a ferry — reach Bellagio, Varenna, and Menaggio in minutes with or without a car.',
             'Wenige Schritte zur Fähre — erreichen Sie Bellagio, Varenna und Menaggio in Minuten, mit oder ohne Auto.'),
            ('<h3>Parking</h3>', '<h3>Parkplatz</h3>'),
            ('Secure parking included — a rare luxury on the Lake Como waterfront.',
             'Sicherer Parkplatz inklusive — ein seltener Luxus am Ufer des Comer Sees.'),
            ('<h2>Inside the Villa</h2>', '<h2>Innenansichten der Villa</h2>'),
            ('aria-label="Previous image"', 'aria-label="Vorheriges Bild"'),
            ('aria-label="Next image"', 'aria-label="Nächstes Bild"'),
        ],
    },

    'reviews.html': {
        # NOTE: review texts themselves are injected by js/reviews.js and stay in English.
        'it': [
            ('<title>Reviews - Villa Caterina</title>', '<title>Recensioni - Villa Caterina</title>'),
            ('content="Guest reviews for Villa Caterina on Lake Como. What our visitors say about their stay."',
             'content="Recensioni degli ospiti di Villa Caterina sul Lago di Como. Cosa dicono i nostri visitatori del loro soggiorno."'),
            ('<h1>Guest Reviews</h1>', '<h1>Recensioni degli ospiti</h1>'),
            ('<p>What our guests say about their stay at Villa Caterina.</p>',
             '<p>Cosa dicono i nostri ospiti del loro soggiorno a Villa Caterina.</p>'),
        ],
        'fr': [
            ('<title>Reviews - Villa Caterina</title>', '<title>Avis - Villa Caterina</title>'),
            ('content="Guest reviews for Villa Caterina on Lake Como. What our visitors say about their stay."',
             'content="Avis des clients de la Villa Caterina au lac de Côme. Ce que nos visiteurs disent de leur séjour."'),
            ('<h1>Guest Reviews</h1>', '<h1>Avis de nos hôtes</h1>'),
            ('<p>What our guests say about their stay at Villa Caterina.</p>',
             '<p>Ce que nos hôtes disent de leur séjour à la Villa Caterina.</p>'),
        ],
        'de': [
            ('<title>Reviews - Villa Caterina</title>', '<title>Bewertungen - Villa Caterina</title>'),
            ('content="Guest reviews for Villa Caterina on Lake Como. What our visitors say about their stay."',
             'content="Gästebewertungen der Villa Caterina am Comer See. Was unsere Besucher über ihren Aufenthalt sagen."'),
            ('<h1>Guest Reviews</h1>', '<h1>Gästebewertungen</h1>'),
            ('<p>What our guests say about their stay at Villa Caterina.</p>',
             '<p>Was unsere Gäste über ihren Aufenthalt in der Villa Caterina sagen.</p>'),
        ],
    },

    'contact.html': {
        'it': [
            ('<title>Contact - Villa Caterina</title>', '<title>Contatti - Villa Caterina</title>'),
            ('content="Contact Villa Caterina to book your Lake Como vacation. Send us a direct inquiry."',
             'content="Contatta Villa Caterina per prenotare la tua vacanza sul Lago di Como. Inviaci una richiesta diretta."'),
            ('<h1>Get in Touch</h1>', '<h1>Contattaci</h1>'),
            ("<h2>We'd Love to Hear From You</h2>", '<h2>Saremo felici di sentirti</h2>'),
            ("Send us a direct inquiry and we'll respond personally with availability \n            confirmation and any special requests you may have. No automated systems — \n            just human-to-human communication.",
             'Inviaci una richiesta diretta e ti risponderemo personalmente con la conferma della disponibilità e per eventuali richieste speciali. Nessun sistema automatico — solo comunicazione da persona a persona.'),
            ('<h3>Address</h3>', '<h3>Indirizzo</h3>'),
            ('<h3>Email</h3>', '<h3>Email</h3>'),
            ('<h2>Send Inquiry</h2>', '<h2>Invia richiesta</h2>'),
            ('<strong>Your Booking Request</strong>', '<strong>La tua richiesta di prenotazione</strong>'),
            ('<label for="form-name">Your Name</label>', '<label for="form-name">Il tuo nome</label>'),
            ('<label for="form-email">Your Email Address</label>', '<label for="form-email">Il tuo indirizzo email</label>'),
            ('<label for="form-message">Your Message</label>', '<label for="form-message">Il tuo messaggio</label>'),
            ('<label for="form-company">Company (leave this field empty)</label>',
             '<label for="form-company">Azienda (lascia vuoto questo campo)</label>'),
            ('<button type="submit" class="btn-primary btn-full">Send Inquiry</button>',
             '<button type="submit" class="btn-primary btn-full">Invia richiesta</button>'),
        ],
        'fr': [
            ('<title>Contact - Villa Caterina</title>', '<title>Contact - Villa Caterina</title>'),
            ('content="Contact Villa Caterina to book your Lake Como vacation. Send us a direct inquiry."',
             'content="Contactez la Villa Caterina pour réserver vos vacances au lac de Côme. Envoyez-nous une demande directe."'),
            ('<h1>Get in Touch</h1>', '<h1>Contactez-nous</h1>'),
            ("<h2>We'd Love to Hear From You</h2>", '<h2>Nous serions ravis de vous lire</h2>'),
            ("Send us a direct inquiry and we'll respond personally with availability \n            confirmation and any special requests you may have. No automated systems — \n            just human-to-human communication.",
             'Envoyez-nous une demande directe et nous vous répondrons personnellement avec la confirmation de disponibilité et pour toute demande particulière. Aucun système automatisé — uniquement une communication d\u2019humain à humain.'),
            ('<h3>Address</h3>', '<h3>Adresse</h3>'),
            ('<h3>Email</h3>', '<h3>Email</h3>'),
            ('<h2>Send Inquiry</h2>', '<h2>Envoyer une demande</h2>'),
            ('<strong>Your Booking Request</strong>', '<strong>Votre demande de réservation</strong>'),
            ('<label for="form-name">Your Name</label>', '<label for="form-name">Votre nom</label>'),
            ('<label for="form-email">Your Email Address</label>', '<label for="form-email">Votre adresse email</label>'),
            ('<label for="form-message">Your Message</label>', '<label for="form-message">Votre message</label>'),
            ('<label for="form-company">Company (leave this field empty)</label>',
             '<label for="form-company">Société (laissez ce champ vide)</label>'),
            ('<button type="submit" class="btn-primary btn-full">Send Inquiry</button>',
             '<button type="submit" class="btn-primary btn-full">Envoyer la demande</button>'),
        ],
        'de': [
            ('<title>Contact - Villa Caterina</title>', '<title>Kontakt - Villa Caterina</title>'),
            ('content="Contact Villa Caterina to book your Lake Como vacation. Send us a direct inquiry."',
             'content="Kontaktieren Sie die Villa Caterina, um Ihren Urlaub am Comer See zu buchen. Senden Sie uns eine direkte Anfrage."'),
            ('<h1>Get in Touch</h1>', '<h1>Kontakt aufnehmen</h1>'),
            ("<h2>We'd Love to Hear From You</h2>", '<h2>Wir freuen uns auf Ihre Nachricht</h2>'),
            ("Send us a direct inquiry and we'll respond personally with availability \n            confirmation and any special requests you may have. No automated systems — \n            just human-to-human communication.",
             'Senden Sie uns eine direkte Anfrage und wir antworten Ihnen persönlich mit einer Verfügbarkeitsbestätigung und zu allen Sonderwünschen. Keine automatisierten Systeme — nur Kommunikation von Mensch zu Mensch.'),
            ('<h3>Address</h3>', '<h3>Adresse</h3>'),
            ('<h3>Email</h3>', '<h3>E-Mail</h3>'),
            ('<h2>Send Inquiry</h2>', '<h2>Anfrage senden</h2>'),
            ('<strong>Your Booking Request</strong>', '<strong>Ihre Buchungsanfrage</strong>'),
            ('<label for="form-name">Your Name</label>', '<label for="form-name">Ihr Name</label>'),
            ('<label for="form-email">Your Email Address</label>', '<label for="form-email">Ihre E-Mail-Adresse</label>'),
            ('<label for="form-message">Your Message</label>', '<label for="form-message">Ihre Nachricht</label>'),
            ('<label for="form-company">Company (leave this field empty)</label>',
             '<label for="form-company">Firma (dieses Feld leer lassen)</label>'),
            ('<button type="submit" class="btn-primary btn-full">Send Inquiry</button>',
             '<button type="submit" class="btn-primary btn-full">Anfrage senden</button>'),
        ],
    },
}

# ────────────────────────────────────────────────
# Transformations
# ────────────────────────────────────────────────

def hreflang_block(page: str) -> str:
    """<link rel=alternate hreflang> for all languages + x-default."""
    lines = [f'  <link rel="alternate" hreflang="en" href="{BASE_URL}/{page}">']
    for lg in LANGS:
        lines.append(f'  <link rel="alternate" hreflang="{lg}" href="{BASE_URL}/{lg}/{page}">')
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/{page}">')
    return '\n'.join(lines)


def lang_switch_block(page: str, active: str) -> str:
    """Language switcher markup. Uses root-absolute URLs so it works from any depth."""
    parts = []
    for lg, href in [('en', f'/{page}')] + [(l, f'/{l}/{page}') for l in LANGS]:
        cls = ' class="active"' if lg == active else ''
        label = lg.upper()
        parts.append(f'<a href="{href}"{cls} lang="{lg}" hreflang="{lg}">{label}</a>')
    return '<div class="lang-switch">' + ''.join(parts) + '</div>'


def rewrite_paths(html: str) -> str:
    """Point assets/css/js references one directory up for language subfolders."""
    html = html.replace('src="js/', 'src="../js/')
    html = html.replace('href="css/', 'href="../css/')
    html = html.replace('src="assets/', 'src="../assets/')
    html = html.replace('href="assets/', 'href="../assets/')
    html = html.replace('data-src="assets/', 'data-src="../assets/')
    return html


def inject_lang_switch(html: str, page: str, lang: str) -> str:
    switch = lang_switch_block(page, lang)
    # Desktop: after the theme-toggle button inside .header-actions
    html = html.replace(
        '        </button>\n      </div>\n\n      <button class="mobile-toggle"',
        f'        </button>\n        {switch}\n      </div>\n\n      <button class="mobile-toggle"',
        1,
    )
    # Mobile: inside .mobile-nav-actions, after the social links block
    html = html.replace(
        '          </div>\n        </div>\n      </div>\n    </div>\n    <div class="header-glow"></div>',
        f'          </div>\n          {switch}\n        </div>\n      </div>\n    </div>\n    <div class="header-glow"></div>',
        1,
    )
    return html


def inject_i18n_script(html: str, prefix: str) -> str:
    """Load js/i18n.js before the page scripts (booking/calendar/contact read it)."""
    marker = f'<script src="{prefix}js/theme.js"></script>'
    return html.replace(marker, f'<script src="{prefix}js/i18n.js"></script>\n  {marker}', 1)


def inject_hreflang(html: str, page: str) -> str:
    marker = '  <link rel="icon"'
    return html.replace(marker, hreflang_block(page) + '\n' + marker, 1)


def build_translation(src: str, page: str, lang: str) -> str:
    html = src
    html = html.replace('<html lang="en">', f'<html lang="{lang}">', 1)
    html = inject_hreflang(html, page)
    for old, new in COMMON[lang] + PAGE_STRINGS[page][lang]:
        if old not in html:
            print(f'  WARNING [{lang}/{page}]: source string not found: {old[:70]!r}', file=sys.stderr)
            continue
        html = html.replace(old, new)
    html = rewrite_paths(html)
    html = inject_lang_switch(html, page, lang)
    html = inject_i18n_script(html, '../')
    return html


def update_root_page(src: str, page: str) -> str:
    """Root (English) pages get hreflang links, the switcher, and i18n.js."""
    html = src
    if 'hreflang="x-default"' not in html:
        html = inject_hreflang(html, page)
    if 'lang-switch' not in html:
        html = inject_lang_switch(html, page, 'en')
    if 'js/i18n.js' not in html:
        html = inject_i18n_script(html, '')
    return html


def main() -> int:
    for lg in LANGS:
        (ROOT / lg).mkdir(exist_ok=True)

    for page in PAGES:
        src_path = ROOT / page
        src = src_path.read_text(encoding='utf-8')

        # 1. Update the root page in place (idempotent)
        updated_root = update_root_page(src, page)
        if updated_root != src:
            src_path.write_text(updated_root, encoding='utf-8')
            print(f'updated root {page}')

        # 2. Generate language versions from the *updated* root, minus
        #    the English-specific bits that build_translation re-adds.
        base = updated_root
        # Strip the previously-injected EN artifacts so translation starts clean
        base = re.sub(r'  <link rel="alternate" hreflang=[^\n]*\n', '', base)
        base = re.sub(r'\s*<div class="lang-switch">.*?</div>', '', base)
        base = base.replace('<script src="js/i18n.js"></script>\n  ', '')

        for lg in LANGS:
            out = build_translation(base, page, lg)
            out_path = ROOT / lg / page
            out_path.write_text(out, encoding='utf-8')
            print(f'wrote {lg}/{page}')

    return 0


if __name__ == '__main__':
    sys.exit(main())
