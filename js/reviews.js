/**
 * Villa Caterina — Reviews
 * Renders guest reviews grouped by platform (Booking.com, Airbnb, Google Maps).
 *
 * Each review carries:
 *   originalLang — the language the guest actually wrote in ('en', 'de', …)
 *   translations — { <lang>: { title, text } } human translations into other
 *                  site languages. `title`/`text` always hold the ORIGINAL text.
 *
 * Display rules (per page language, from <html lang> via js/i18n.js):
 *   - review written in the page language        → show original, no button
 *   - translation available for the page language → show translation plus a
 *     "Show original" toggle that reveals the original text in place
 *   - otherwise                                   → show original (fallback)
 */

(function () {
  'use strict';

  // ── Booking.com reviews (scores out of 10) ──
  const bookingReviews = [
    {
      reviewer: 'Heidi, AU',
      date: 'July 2026',
      score: 10,
      originalLang: 'en',
      title: 'We thoroughly enjoyed staying as a family group at this elegant Villa.',
      text: 'Villa Caterina is an elegant and beautiful home. The Villa was so well appointed with everything you needed, especially the kitchen. The thoughtful little extras such as coffee, tea, biscuits and laundry and toiletries were much appreciated. The front path down to the mini markt, buses and coffee and pizza was very handy.'
    },
    {
      reviewer: 'John, US',
      date: 'September 2025',
      score: 10,
      originalLang: 'en',
      title: 'A happy return to a magnificent villa on beautiful Lake Como in Cadenabbia.',
      text: 'This was a stand alone property — not a hotel, so no breakfast provided, but the owner did provide a nice snack and a huge bottle of champagne which was quite a nice thing to do. There is a nice market just a few minutes walk away, nice bar and restaurants also easily walkable from the Villa, and also very close to the Ferry to Bellagio and every other port on the lake. This property is a neighbor to the famous Villa former German Chancellor Konrad Adenauer summered in numerous times during his term and after and gives you an inkling as to what a fine neighborhood and property this Villa is — world class.'
    },
    {
      reviewer: 'Larisa, RU',
      date: 'August 2025',
      score: 10,
      originalLang: 'en',
      title: 'We had a really great experience to explore all sightseeing places of Como, staying at nice Villa Caterina Griante',
      text: 'Location is great! Just 80 m to the lake. Local supermarket is in 50 m. Very nice design of villa — smart integration of different styles. Very clean and cosy. Lovely hostess!'
    },
    {
      reviewer: 'Rashpal, GB',
      date: 'July 2025',
      score: 10,
      originalLang: 'en',
      title: '',
      text: 'Villa is very good — very clean but also with all the details taken care of. Eg abundance of towels, toiletries, very well equipped kitchen, etc etc etc. Location is excellent for anyone visiting Lake Como. Simona is an excellent host, and stayed in contact by WhatsApp before and after the visit.'
    },
    {
      reviewer: 'Heinz, CH',
      date: 'July 2025',
      score: 10,
      originalLang: 'de',
      title: 'Es hat alles gepasst und war wunderschön',
      text: 'Sehr gute Lage, sehr sauber und schöne Villa.',
      translations: {
        en: {
          title: 'Everything was just right and absolutely wonderful',
          text: 'Very good location, very clean and a beautiful villa.'
        }
      }
    },
    {
      reviewer: 'Hervé, FR',
      date: 'June 2025',
      score: 9,
      originalLang: 'fr',
      title: '',
      text: 'Villa spacieuse, confortable et très bien équipée (cuisine, salle de bains). Qualité d\'accueil des hôtes. La vue est très belle sur le Lac. Accès à pieds à une superette très complète et à plusieurs solutions de restauration à emporter, très pratique. Le ferry de Cadenabbia est à 5 mins à pieds, idéal ! Une solution pour séjourner en famille ou entre amis pour explorer la région que je recommande sans hésitation.',
      translations: {
        en: {
          title: '',
          text: 'Spacious, comfortable and very well equipped villa (kitchen, bathroom). The welcome from the hosts was excellent. The view of the lake is beautiful. Within walking distance there is a very well-stocked mini market and several takeaway options, which is really convenient. The Cadenabbia ferry is a 5-minute walk away — ideal! A great base for a stay with family or friends to explore the region, which I recommend without hesitation.'
        }
      }
    },
    {
      reviewer: 'Sultan, SA',
      date: 'June 2025',
      score: 10,
      originalLang: 'en',
      title: 'Big Villa with great location',
      text: 'Lovely Villa with great location. The villa is large and suitable for a big family with three bedrooms and three bathrooms. There is a garden with a path leading down to the lake and the main road, and it is very close to the ferry station — five minutes walk. Special thanks to Simona for her great support all the time, and thank you Lina for welcoming us and explaining the Villa facilities.'
    },
    {
      reviewer: 'Beata, PL',
      date: 'June 2025',
      score: 8,
      originalLang: 'pl',
      title: '',
      text: 'Osoby przekazujące i odbierające klucze nie mówią ani słowa po angielsku. Komunikacja jest utrudniona. Dodatkowo osoba odbierająca klucze była bardzo niemiła i zmuszała nas do zabrania śmieci z zewnętrznego pojemnika, który stał obok willi i zawiezienia ich do pobliskich kontenerów.',
      translations: {
        en: {
          title: '',
          text: 'The people handing over and collecting the keys do not speak a word of English. Communication is difficult. On top of that, the person collecting the keys was very unfriendly and pressured us to take the rubbish from the outdoor bin standing next to the villa and carry it to the nearby containers.'
        }
      }
    },
    {
      reviewer: 'Wioleta, PL',
      date: 'May 2025',
      score: 10,
      originalLang: 'pl',
      title: 'Cudowne miejsce',
      text: 'Wszystko było cudowne. Wspaniały dom, widoki, udogodnienia.',
      translations: {
        en: {
          title: 'A wonderful place',
          text: 'Everything was wonderful. A marvellous house, views and amenities.'
        }
      }
    },
    {
      reviewer: 'Christina, DK',
      date: 'April 2025',
      score: 10,
      originalLang: 'da',
      title: 'Skønt ophold',
      text: 'Beliggenheden er helt fantastisk. En lille sti og man står hurtigt ved søen. En helt fantastisk udsigt fra huset både inde og ude.',
      translations: {
        en: {
          title: 'Lovely stay',
          text: 'The location is absolutely fantastic. A small path and you are quickly at the lake. A truly fantastic view from the house, both inside and out.'
        }
      }
    },
    {
      reviewer: 'Orlin Radev, BG',
      date: 'October 2024',
      score: 10,
      originalLang: 'en',
      title: 'Simply amazing, highly recommend it!',
      text: 'Starting with the location, the villa is located near the Cadenabbia ferry station (5–7 min walk), which has direct connection to Bellagio and Varenna. This meant we can get around without using the car. That said, the villa has parking space for 2 cars. The villa itself is amazing — classic style, newly renovated, clean and well equipped, cosy and comfortable. Two of the 3 bedrooms have their own bathrooms. There is also an office with an extendable sofa, if you need another bed. The kitchen is equipped for everything you need if you decide to stay in and cook.'
    },
    {
      reviewer: 'Ulrich, DE',
      date: 'October 2024',
      score: 10,
      originalLang: 'de',
      title: '',
      text: 'Alles war perfekt. Nichts zu bemängeln.',
      translations: {
        en: {
          title: '',
          text: 'Everything was perfect. Nothing to complain about.'
        }
      }
    },
    {
      reviewer: 'Regina, GB',
      date: 'September 2024',
      score: 10,
      originalLang: 'en',
      title: 'Lovely place to stay in Lake Como',
      text: 'We booked Villa to stay with family and friends for our big day celebration in Lake Como. Lady Lina met us at the time of our arrival to show around villa all facilities. She was so helpful, also Simona who was a main contact was very helpful with any questions we had. A big thank you for a lovely flower bouquet on our wedding day that Simona and Lina organised. Definitely would recommend this place if you need a lovely place to stay in Lake Como.'
    },
    {
      reviewer: 'Oleksandr, UA',
      date: 'August 2024',
      score: 10,
      originalLang: 'uk',
      title: 'Отдыхали на вилле семьёй, три поколения, все в восторге!',
      text: 'Великолепный вид, комфортная вилла, хозяева продумали всё до мелочей! Большое им спасибо!',
      translations: {
        en: {
          title: 'We holidayed at the villa as a family — three generations, and we are all delighted!',
          text: 'Magnificent view, comfortable villa — the owners have thought of everything down to the smallest detail. A big thank you to them!'
        }
      }
    },
    {
      reviewer: 'James, US',
      date: 'August 2024',
      score: 10,
      originalLang: 'en',
      title: 'Old world villa with modern amenities awaits you to settle in, relax and find peace in a slice of paradise.',
      text: 'Such a graceful home with amazing views and a complete sense of comfort and tranquility. Great kitchen, AC was great, laundry, great showers, and a beautiful terrace. Villa is in a great location. Not too busy to relax and be on vacation but within walking distance to restaurants, the ferry, Villa Carlotta, and even Tremezzo was not too far for a morning walk. Take the secret path to the gate by the little chapel to save time getting down to the waterfront. There were so many great local restaurants especially Restaurante Belli Ille. Take the 10 minute ferry to Bellagio running every half hour or so for a few dollars per person.'
    },
    {
      reviewer: 'Bruno, SC',
      date: 'July 2023',
      score: 9,
      originalLang: 'fr',
      title: 'Excellent séjour, quelque peu terni par un chantier à côté, heureusement temporaire. Merci à Simona.',
      text: 'Villa très spacieuse, très bien équipée et très propre, avec une très belle vue sur le lac.',
      translations: {
        en: {
          title: 'Excellent stay, somewhat overshadowed by construction work next door — fortunately temporary. Thanks to Simona.',
          text: 'Very spacious, very well equipped and very clean villa, with a beautiful view of the lake.'
        }
      }
    }
  ];

  // ── Google Maps reviews (scores out of 5) ──
  const googleReviews = [
    {
      reviewer: 'Valerio Bellini',
      date: 'July 2025',
      score: 5,
      originalLang: 'en',
      text: 'Our stay at this stunning villa on Lake Como was simply perfect! The elegance of the property was evident in every detail, from the beautifully designed interiors to the meticulously maintained garden. The breathtaking view of the lake from the terrace was absolutely unforgettable — waking up to such a serene and picturesque scene was a dream come true.\n\nThe villa was fully equipped with everything we needed, and we were especially impressed by the thoughtful inclusion of all the essentials for our daughter. It truly made traveling with a little one so much easier and stress-free.\n\nThis vacation was nothing short of fantastic, and we would highly recommend this extraordinary villa to anyone looking for a luxurious and relaxing getaway. We can\u2019t wait to return!'
    },
    {
      reviewer: 'Jim Richards',
      date: 'July 2025',
      score: 5,
      originalLang: 'en',
      text: 'This villa is a gloriously peaceful home on the banks of Lake Como, situated in prime location for walking to Tremezzo or hoping the ferry for a 10 minute ride to Bellagio. The house is a classic Italian lake villa with modern amenities and a gracious host. We were so pleased to have chosen this spot for our stay in this area.\n\nCadenabbia is less hectic than most of the other lake villages and perfect for strolls on the lake shore, or a visit to the gardens at Villa Carlotta. We found plenty of places to sit and eat while enjoying the lovely lake views. The house had ample space for our party of 7. Highly recommended.'
    },
    {
      reviewer: 'Elena K.',
      date: 'July 2025',
      score: 5,
      originalLang: 'de',
      text: 'Unser Urlaubsgef\u00fchl begann mit den bunten Blumen und der angenehm duftenden Morgenluft. Vom Balkon aus erhielten wir einen fantastischen Blick auf den Comer See. Die liebevoll restaurierten R\u00e4umlichkeiten der Villa \u00fcbertrafen unsere hohen Erwartungen.\nDer direkte Zugang \u00fcber den Garten zur Promenade rundete unseren positiven Eindruck ab. Wir kommen auf jeden Fall wieder!',
      translations: {
        en: {
          title: '',
          text: 'Our holiday feeling began with the colourful flowers and the pleasantly fragrant morning air. From the balcony we had a fantastic view of Lake Como. The lovingly restored rooms of the villa exceeded our high expectations.\nDirect access through the garden to the promenade rounded off our positive impression. We will definitely be back!'
        }
      }
    },
    {
      reviewer: 'Thorben Wulff',
      date: 'January 2026',
      score: 5,
      originalLang: 'de',
      text: 'Wundersch\u00f6ne Villa mit fantastischem Blick auf den Comer See! Wundervoll eingerichtet und sehr freundliche Gastgeber!',
      translations: {
        en: {
          title: '',
          text: 'Beautiful villa with a fantastic view of Lake Como! Wonderfully furnished and very friendly hosts!'
        }
      }
    }
  ];

  // ── Airbnb reviews (scores out of 5) ──
  const airbnbReviews = [
    {
      reviewer: 'Mebrat And Assefa',
      date: 'June 2026',
      score: 5,
      originalLang: 'en',
      text: 'Villa Caterina, is very beautiful with a stunning view of the mountains and the lake! Highly recommend it and if I come back to Lake Como it will be my first choice! Great for families, all will be very comfortable, lots of space. The place exceeded my expectations! Thank you!'
    },
    {
      reviewer: 'Julie',
      date: 'April 2026',
      score: 4,
      originalLang: 'fr',
      text: 'La maison est magnifique et très spacieuse. Les équipements (électroménager et literies) sont de grande qualité, la décoration soignée et le ménage parfait. Se réveiller le matin avec la vue du lac est un vrai plaisir. Nous avons passé un très agréable séjour. Pour les enfants il y a une superbe aire de jeux à 2 min à pieds et les propriétaires nous ont mis à disposition chaise haute et lit bébé. Il y a également une pizzeria et une supérette à 2min de la maison, c\'est très pratique.\nPetite déception, il est mis en avant dans l\'annonce que l\'embarcadère du ferry se trouve à 200 mètres ce qui a contribué à notre choix de location, malheureusement le port est fermé depuis un moment car de gros travaux sont en cours, nous aurions aimé être prévenus.',
      translations: {
        en: {
          title: '',
          text: 'The house is magnificent and very spacious. The equipment (appliances and bedding) is of excellent quality, the decoration is tasteful and the cleaning impeccable. Waking up in the morning to the lake view is a real pleasure. We had a very enjoyable stay. For the children there is a great playground a 2-minute walk away, and the owners provided a high chair and a baby cot. There is also a pizzeria and a mini market 2 minutes from the house, which is very convenient.\nOne small disappointment: the listing highlights that the ferry dock is 200 metres away, which influenced our choice of rental, but unfortunately the port has been closed for a while because major works are under way — we would have liked to be informed in advance.'
        }
      }
    },
    {
      reviewer: 'Parul',
      date: 'April 2026',
      score: 5,
      originalLang: 'en',
      text: 'Beautiful home, we enjoyed our stay. Hosts attended to all our requests.'
    }
  ];

  // ── i18n ──
  // Dictionaries provided by js/i18n.js (must load first).
  // Falls back to English labels if i18n.js is missing.
  var I18N = window.VC_I18N || null;
  var PAGE_LANG = I18N ? I18N.lang : 'en';

  var FALLBACK_LANG_NAMES = {
    en: 'English', de: 'German', fr: 'French', pl: 'Polish', da: 'Danish', uk: 'Ukrainian'
  };

  function langName(code) {
    if (I18N && I18N.langNames && I18N.langNames[code]) return I18N.langNames[code];
    return FALLBACK_LANG_NAMES[code] || code;
  }

  function toggleLabel(key, langCode) {
    if (I18N) return I18N.t(key, { lang: langName(langCode) });
    var base = key === 'showOriginal' ? 'Show original' : 'Show translation';
    return base + ' (' + langName(langCode) + ')';
  }

  // ── Helpers ──

  var STAR_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';

  function starsHTML(count) {
    var html = '';
    for (var i = 0; i < count; i++) html += '<span>' + STAR_SVG + '</span>';
    return html;
  }

  function scoreToStars(score) {
    // Booking.com score is out of 10 → convert to 5-star scale
    return Math.round(score / 2);
  }

  /** Combine title + text the way the card displays them. */
  function combinedText(title, body) {
    var out = '';
    if (title) out += '"' + title + '" ';
    if (body) out += body;
    return out;
  }

  /**
   * Pick what to display for this review on the current page language.
   * Returns { title, text, showToggle, originalLang }.
   */
  function displayFor(review) {
    var original = { title: review.title || '', text: review.text || '' };

    // Written in the page language → original, no toggle.
    if (!review.originalLang || review.originalLang === PAGE_LANG) {
      return { title: original.title, text: original.text, showToggle: false };
    }

    // Translation available for the page language → show it with a toggle.
    var trans = review.translations && review.translations[PAGE_LANG];
    if (trans) {
      return {
        title: trans.title || '',
        text: trans.text || '',
        showToggle: true,
        originalLang: review.originalLang,
        original: original
      };
    }

    // No translation for this page language yet → original, no toggle
    // (same behaviour as before translations were introduced).
    return { title: original.title, text: original.text, showToggle: false };
  }

  function createCard(review, isBooking) {
    var card = document.createElement('article');
    card.className = 'review-card';

    var stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.innerHTML = starsHTML(isBooking ? scoreToStars(review.score) : review.score);

    var view = displayFor(review);

    var text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = combinedText(view.title, view.text);

    card.appendChild(stars);
    card.appendChild(text);

    // "Show original" / "Show translation" toggle for translated reviews.
    if (view.showToggle) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'review-toggle';
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = toggleLabel('showOriginal', view.originalLang);

      var showingOriginal = false;
      btn.addEventListener('click', function () {
        showingOriginal = !showingOriginal;
        if (showingOriginal) {
          text.textContent = combinedText(view.original.title, view.original.text);
          btn.textContent = toggleLabel('showTranslation', PAGE_LANG);
        } else {
          text.textContent = combinedText(view.title, view.text);
          btn.textContent = toggleLabel('showOriginal', view.originalLang);
        }
        btn.setAttribute('aria-pressed', String(showingOriginal));
      });

      card.appendChild(btn);
    }

    var footer = document.createElement('footer');
    footer.className = 'review-footer';

    var name = document.createElement('strong');
    name.textContent = review.reviewer;

    var date = document.createElement('span');
    date.textContent = review.date;

    footer.appendChild(name);
    footer.appendChild(date);

    card.appendChild(footer);

    return card;
  }

  function renderReviews(gridEl, reviews, isBooking) {
    reviews.forEach(function (r) {
      gridEl.appendChild(createCard(r, isBooking));
    });
  }

  // ── Mount ──

  var bookingGrid  = document.getElementById('reviews-booking');
  var airbnbGrid   = document.getElementById('reviews-airbnb');
  var googleGrid   = document.getElementById('reviews-google');

  if (bookingGrid) {
    renderReviews(bookingGrid, bookingReviews, true);
    // Show Booking.com average
    var bookingScore = document.getElementById('booking-score');
    if (bookingScore) bookingScore.textContent = '9.8';
  }

  if (googleGrid) {
    renderReviews(googleGrid, googleReviews, false);
    // Show Google average
    var googleScore = document.getElementById('google-score');
    if (googleScore) googleScore.textContent = '5.0';
  }

  if (airbnbGrid) {
    renderReviews(airbnbGrid, airbnbReviews, false);
    var airbnbScore = document.getElementById('airbnb-score');
    if (airbnbScore) airbnbScore.textContent = '4.67';
  }

})();
