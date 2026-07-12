/**
 * Villa Caterina — UI string dictionaries (EN / IT / FR / DE).
 * Language is selected from the page's <html lang="…"> attribute.
 * Loaded BEFORE booking.js / calendar.js / contact.js, which read window.VC_I18N.
 *
 * Note: review texts on reviews pages are intentionally NOT translated.
 */

(function () {
  'use strict';

  const DICTS = {

    en: {
      locale: 'en-US',
      months: ['January','February','March','April','May','June',
               'July','August','September','October','November','December'],
      days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      night: 'night', nights: 'nights',
      guest: 'guest', guests: 'guests',

      // Calendar widget
      legendAvailable: 'Available',
      legendSelected: 'Selected',
      legendInRange: 'In Range',
      legendBooked: 'Booked',
      legendClosed: 'Closed Season',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      loading: 'Loading availability...',
      calLoadFailed: '⚠ Live availability could not be loaded. Some dates shown as available may already be booked.',
      alreadyBooked: 'Already booked',
      closedTooltip: 'Closed season (November–March)',

      // Booking engine
      btnSelectDates: 'Select Dates',
      btnInvalidDates: 'Invalid Dates',
      btnTooShort: 'Too Short',
      btnClosedSeason: 'Closed Season',
      btnInvalid: 'Invalid',
      btnTooManyGuests: 'Too Many Guests',
      btnUnavailable: 'Unavailable',
      btnRequestStay: 'Request This Stay',
      msgFutureDate: 'Check-in date must be in the future.',
      msgOrder: 'Check-out must be after check-in.',
      msgMinStay: 'Minimum stay is {min} nights. Your selection: {n} {nightsWord}.',
      msgOpenSeason: 'The property is only open from April to October.',
      msgCrossSeason: 'Your stay crosses into the closed season (Nov–Mar). Please adjust dates.',
      msgClosedNights: 'Your stay includes nights in the closed season.',
      msgMinGuest: 'Please enter at least 1 guest.',
      msgMaxGuests: 'Maximum 8 guests total (adults + children).',
      msgAdultRequired: 'At least 1 adult is required.',
      msgConflict: 'These dates conflict with an existing booking ({date}). Please choose different dates.',
      msgStillLoading: '⚠ Availability data is still loading. Your selected dates may already be booked on Booking.com.',
      msgLoadFailed: '⚠ Live availability could not be loaded. Your selected dates may already be booked — we will confirm by email.',
      breakdown: '{nights} nights · {from} → {to}',
      hintCheckin: 'Click a check-in date.',
      hintCheckout: 'Check-in: {date}. Now click check-out.',
      hintRange: '{from} → {to} ({nights} nights)',

      // Contact form
      errName: 'Please enter your name.',
      errEmail: 'Please enter a valid email address.',
      errMessage: 'Please include a message with your inquiry.',
      errTooLong: 'Your message is too long. Please shorten it.',
      sent: 'Thank you! Your inquiry has been sent.',
      sentFull: 'Thank you! Your inquiry has been sent. We will reply to your email shortly.',
      sending: 'Sending...',
      sendInquiry: 'Send Inquiry',
      openingMail: 'Opening your email client...',
      genericError: 'Something went wrong. Please try again.',
      networkError: 'Network error. Please check your connection and try again.',
      mailSubject: 'Booking Inquiry - Villa Caterina',
      msgTemplate: 'Hello,\n\nI would like to request a booking at Villa Caterina:\n\n  Check-in:  {checkin}\n  Check-out: {checkout}\n  Guests:    {guests}\n  Duration:  {nights} {nightsWord}\n\n  Estimated Total Price: €{price}\n\nPlease confirm availability and let me know the next steps.\n\nThank you,',
    },

    it: {
      locale: 'it-IT',
      months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
               'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      days: ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'],
      night: 'notte', nights: 'notti',
      guest: 'ospite', guests: 'ospiti',

      legendAvailable: 'Disponibile',
      legendSelected: 'Selezionato',
      legendInRange: 'Nel periodo',
      legendBooked: 'Occupato',
      legendClosed: 'Stagione chiusa',
      prevMonth: 'Mese precedente',
      nextMonth: 'Mese successivo',
      loading: 'Caricamento disponibilità...',
      calLoadFailed: '⚠ Impossibile caricare la disponibilità in tempo reale. Alcune date mostrate come libere potrebbero essere già prenotate.',
      alreadyBooked: 'Già prenotato',
      closedTooltip: 'Stagione chiusa (novembre–marzo)',

      btnSelectDates: 'Seleziona le date',
      btnInvalidDates: 'Date non valide',
      btnTooShort: 'Soggiorno troppo breve',
      btnClosedSeason: 'Stagione chiusa',
      btnInvalid: 'Non valido',
      btnTooManyGuests: 'Troppi ospiti',
      btnUnavailable: 'Non disponibile',
      btnRequestStay: 'Richiedi il soggiorno',
      msgFutureDate: 'La data di check-in deve essere futura.',
      msgOrder: 'Il check-out deve essere successivo al check-in.',
      msgMinStay: 'Il soggiorno minimo è di {min} notti. La tua selezione: {n} {nightsWord}.',
      msgOpenSeason: 'La struttura è aperta solo da aprile a ottobre.',
      msgCrossSeason: 'Il tuo soggiorno rientra nella stagione chiusa (nov–mar). Modifica le date.',
      msgClosedNights: 'Il tuo soggiorno include notti nella stagione chiusa.',
      msgMinGuest: 'Inserisci almeno 1 ospite.',
      msgMaxGuests: 'Massimo 8 ospiti in totale (adulti + bambini).',
      msgAdultRequired: 'È richiesto almeno 1 adulto.',
      msgConflict: 'Queste date sono in conflitto con una prenotazione esistente ({date}). Scegli altre date.',
      msgStillLoading: '⚠ I dati di disponibilità sono ancora in caricamento. Le date selezionate potrebbero essere già prenotate su Booking.com.',
      msgLoadFailed: '⚠ Impossibile caricare la disponibilità in tempo reale. Le date selezionate potrebbero essere già prenotate — confermeremo via email.',
      breakdown: '{nights} notti · {from} → {to}',
      hintCheckin: 'Clicca una data di check-in.',
      hintCheckout: 'Check-in: {date}. Ora clicca il check-out.',
      hintRange: '{from} → {to} ({nights} notti)',

      errName: 'Inserisci il tuo nome.',
      errEmail: 'Inserisci un indirizzo email valido.',
      errMessage: 'Includi un messaggio nella tua richiesta.',
      errTooLong: 'Il messaggio è troppo lungo. Accorcialo.',
      sent: 'Grazie! La tua richiesta è stata inviata.',
      sentFull: 'Grazie! La tua richiesta è stata inviata. Ti risponderemo via email a breve.',
      sending: 'Invio in corso...',
      sendInquiry: 'Invia richiesta',
      openingMail: 'Apertura del client di posta...',
      genericError: 'Qualcosa è andato storto. Riprova.',
      networkError: 'Errore di rete. Controlla la connessione e riprova.',
      mailSubject: 'Richiesta di prenotazione - Villa Caterina',
      msgTemplate: 'Buongiorno,\n\nvorrei richiedere una prenotazione presso Villa Caterina:\n\n  Check-in:  {checkin}\n  Check-out: {checkout}\n  Ospiti:    {guests}\n  Durata:    {nights} {nightsWord}\n\n  Prezzo totale stimato: €{price}\n\nVi prego di confermare la disponibilità e indicarmi i prossimi passi.\n\nGrazie,',
    },

    fr: {
      locale: 'fr-FR',
      months: ['Janvier','Février','Mars','Avril','Mai','Juin',
               'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      days: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
      night: 'nuit', nights: 'nuits',
      guest: 'voyageur', guests: 'voyageurs',

      legendAvailable: 'Disponible',
      legendSelected: 'Sélectionné',
      legendInRange: 'Dans la période',
      legendBooked: 'Réservé',
      legendClosed: 'Saison fermée',
      prevMonth: 'Mois précédent',
      nextMonth: 'Mois suivant',
      loading: 'Chargement des disponibilités...',
      calLoadFailed: '⚠ Impossible de charger les disponibilités en temps réel. Certaines dates affichées comme libres peuvent déjà être réservées.',
      alreadyBooked: 'Déjà réservé',
      closedTooltip: 'Saison fermée (novembre–mars)',

      btnSelectDates: 'Sélectionnez les dates',
      btnInvalidDates: 'Dates non valides',
      btnTooShort: 'Séjour trop court',
      btnClosedSeason: 'Saison fermée',
      btnInvalid: 'Non valide',
      btnTooManyGuests: 'Trop de voyageurs',
      btnUnavailable: 'Indisponible',
      btnRequestStay: 'Demander ce séjour',
      msgFutureDate: 'La date d\u2019arrivée doit être dans le futur.',
      msgOrder: 'Le départ doit être postérieur à l\u2019arrivée.',
      msgMinStay: 'Le séjour minimum est de {min} nuits. Votre sélection : {n} {nightsWord}.',
      msgOpenSeason: 'La propriété n\u2019est ouverte que d\u2019avril à octobre.',
      msgCrossSeason: 'Votre séjour empiète sur la saison fermée (nov–mars). Veuillez ajuster les dates.',
      msgClosedNights: 'Votre séjour comprend des nuits pendant la saison fermée.',
      msgMinGuest: 'Veuillez indiquer au moins 1 voyageur.',
      msgMaxGuests: 'Maximum 8 voyageurs au total (adultes + enfants).',
      msgAdultRequired: 'Au moins 1 adulte est requis.',
      msgConflict: 'Ces dates sont en conflit avec une réservation existante ({date}). Veuillez choisir d\u2019autres dates.',
      msgStillLoading: '⚠ Les données de disponibilité sont encore en cours de chargement. Vos dates peuvent déjà être réservées sur Booking.com.',
      msgLoadFailed: '⚠ Impossible de charger les disponibilités en temps réel. Vos dates peuvent déjà être réservées — nous confirmerons par email.',
      breakdown: '{nights} nuits · {from} → {to}',
      hintCheckin: 'Cliquez sur une date d\u2019arrivée.',
      hintCheckout: 'Arrivée : {date}. Cliquez maintenant sur la date de départ.',
      hintRange: '{from} → {to} ({nights} nuits)',

      errName: 'Veuillez saisir votre nom.',
      errEmail: 'Veuillez saisir une adresse email valide.',
      errMessage: 'Veuillez inclure un message dans votre demande.',
      errTooLong: 'Votre message est trop long. Veuillez le raccourcir.',
      sent: 'Merci ! Votre demande a été envoyée.',
      sentFull: 'Merci ! Votre demande a été envoyée. Nous vous répondrons par email rapidement.',
      sending: 'Envoi en cours...',
      sendInquiry: 'Envoyer la demande',
      openingMail: 'Ouverture de votre client de messagerie...',
      genericError: 'Une erreur est survenue. Veuillez réessayer.',
      networkError: 'Erreur réseau. Vérifiez votre connexion et réessayez.',
      mailSubject: 'Demande de réservation - Villa Caterina',
      msgTemplate: 'Bonjour,\n\nje souhaite demander une réservation à la Villa Caterina :\n\n  Arrivée :  {checkin}\n  Départ :   {checkout}\n  Voyageurs : {guests}\n  Durée :    {nights} {nightsWord}\n\n  Prix total estimé : {price} €\n\nMerci de confirmer la disponibilité et de m\u2019indiquer les prochaines étapes.\n\nCordialement,',
    },

    de: {
      locale: 'de-DE',
      months: ['Januar','Februar','März','April','Mai','Juni',
               'Juli','August','September','Oktober','November','Dezember'],
      days: ['Mo','Di','Mi','Do','Fr','Sa','So'],
      night: 'Nacht', nights: 'Nächte',
      guest: 'Gast', guests: 'Gäste',

      legendAvailable: 'Verfügbar',
      legendSelected: 'Ausgewählt',
      legendInRange: 'Im Zeitraum',
      legendBooked: 'Belegt',
      legendClosed: 'Geschlossene Saison',
      prevMonth: 'Vorheriger Monat',
      nextMonth: 'Nächster Monat',
      loading: 'Verfügbarkeit wird geladen...',
      calLoadFailed: '⚠ Live-Verfügbarkeit konnte nicht geladen werden. Als frei angezeigte Daten könnten bereits gebucht sein.',
      alreadyBooked: 'Bereits gebucht',
      closedTooltip: 'Geschlossene Saison (November–März)',

      btnSelectDates: 'Daten auswählen',
      btnInvalidDates: 'Ungültige Daten',
      btnTooShort: 'Aufenthalt zu kurz',
      btnClosedSeason: 'Geschlossene Saison',
      btnInvalid: 'Ungültig',
      btnTooManyGuests: 'Zu viele Gäste',
      btnUnavailable: 'Nicht verfügbar',
      btnRequestStay: 'Aufenthalt anfragen',
      msgFutureDate: 'Das Anreisedatum muss in der Zukunft liegen.',
      msgOrder: 'Die Abreise muss nach der Anreise liegen.',
      msgMinStay: 'Der Mindestaufenthalt beträgt {min} Nächte. Ihre Auswahl: {n} {nightsWord}.',
      msgOpenSeason: 'Das Haus ist nur von April bis Oktober geöffnet.',
      msgCrossSeason: 'Ihr Aufenthalt fällt in die geschlossene Saison (Nov–März). Bitte passen Sie die Daten an.',
      msgClosedNights: 'Ihr Aufenthalt umfasst Nächte in der geschlossenen Saison.',
      msgMinGuest: 'Bitte geben Sie mindestens 1 Gast an.',
      msgMaxGuests: 'Maximal 8 Gäste insgesamt (Erwachsene + Kinder).',
      msgAdultRequired: 'Mindestens 1 Erwachsener ist erforderlich.',
      msgConflict: 'Diese Daten kollidieren mit einer bestehenden Buchung ({date}). Bitte wählen Sie andere Daten.',
      msgStillLoading: '⚠ Verfügbarkeitsdaten werden noch geladen. Ihre gewählten Daten könnten auf Booking.com bereits gebucht sein.',
      msgLoadFailed: '⚠ Live-Verfügbarkeit konnte nicht geladen werden. Ihre gewählten Daten könnten bereits gebucht sein — wir bestätigen per E-Mail.',
      breakdown: '{nights} Nächte · {from} → {to}',
      hintCheckin: 'Klicken Sie auf ein Anreisedatum.',
      hintCheckout: 'Anreise: {date}. Klicken Sie nun auf die Abreise.',
      hintRange: '{from} → {to} ({nights} Nächte)',

      errName: 'Bitte geben Sie Ihren Namen ein.',
      errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      errMessage: 'Bitte fügen Sie Ihrer Anfrage eine Nachricht bei.',
      errTooLong: 'Ihre Nachricht ist zu lang. Bitte kürzen Sie sie.',
      sent: 'Vielen Dank! Ihre Anfrage wurde gesendet.',
      sentFull: 'Vielen Dank! Ihre Anfrage wurde gesendet. Wir antworten Ihnen in Kürze per E-Mail.',
      sending: 'Wird gesendet...',
      sendInquiry: 'Anfrage senden',
      openingMail: 'Ihr E-Mail-Programm wird geöffnet...',
      genericError: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
      networkError: 'Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
      mailSubject: 'Buchungsanfrage - Villa Caterina',
      msgTemplate: 'Guten Tag,\n\nich möchte eine Buchung in der Villa Caterina anfragen:\n\n  Anreise:  {checkin}\n  Abreise:  {checkout}\n  Gäste:    {guests}\n  Dauer:    {nights} {nightsWord}\n\n  Geschätzter Gesamtpreis: {price} €\n\nBitte bestätigen Sie die Verfügbarkeit und teilen Sie mir die nächsten Schritte mit.\n\nVielen Dank,',
    },
  };

  const lang = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  const dict = DICTS[lang] || DICTS.en;

  /** Translate: t('msgMinStay', { min: 3, n: 2, nightsWord: '…' }) */
  function t(key, vars) {
    let str = dict[key] !== undefined ? dict[key] : (DICTS.en[key] !== undefined ? DICTS.en[key] : key);
    if (vars) {
      for (const k in vars) {
        str = str.split('{' + k + '}').join(String(vars[k]));
      }
    }
    return str;
  }

  window.VC_I18N = {
    lang: lang,
    locale: dict.locale,
    months: dict.months,
    days: dict.days,
    t: t,
    /** Pluralized word for nights/guests */
    plural: function (n, singularKey, pluralKey) {
      return String(n) === '1' || n === 1 ? dict[singularKey] : dict[pluralKey];
    },
  };
})();
