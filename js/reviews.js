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
      text: 'Villa Caterina is an elegant and beautiful home. The Villa was so well appointed with everything you needed, especially the kitchen. The thoughtful little extras such as coffee, tea, biscuits and laundry and toiletries were much appreciated. The front path down to the mini markt, buses and coffee and pizza was very handy.',
      translations: {
        it: {
          title: 'Abbiamo apprezzato moltissimo il nostro soggiorno in famiglia in questa elegante Villa.',
          text: 'Villa Caterina è una casa elegante e bellissima. La Villa era arredata con grande cura e dotata di tutto il necessario, soprattutto la cucina. Le piccole attenzioni in più, come caffè, tè, biscotti, biancheria e prodotti da bagno, sono state molto gradite. Il sentiero sul davanti che scende al minimarket, alle fermate degli autobus, al bar e alla pizzeria era davvero comodo.'
        }
      }
    },
    {
      reviewer: 'John, US',
      date: 'September 2025',
      score: 10,
      originalLang: 'en',
      title: 'A happy return to a magnificent villa on beautiful Lake Como in Cadenabbia.',
      text: 'This was a stand alone property — not a hotel, so no breakfast provided, but the owner did provide a nice snack and a huge bottle of champagne which was quite a nice thing to do. There is a nice market just a few minutes walk away, nice bar and restaurants also easily walkable from the Villa, and also very close to the Ferry to Bellagio and every other port on the lake. This property is a neighbor to the famous Villa former German Chancellor Konrad Adenauer summered in numerous times during his term and after and gives you an inkling as to what a fine neighborhood and property this Villa is — world class.',
      translations: {
        it: {
          title: 'Un felice ritorno in una magnifica villa sul bellissimo Lago di Como a Cadenabbia.',
          text: 'Si tratta di una struttura indipendente, non di un hotel, quindi niente colazione, ma il proprietario ci ha offerto uno spuntino e una grande bottiglia di champagne, un gesto davvero gentile. C’è un bel mercato a pochi minuti a piedi, così come bar e ristoranti facilmente raggiungibili dalla Villa, e siamo anche molto vicini al traghetto per Bellagio e per tutte le altre località del lago. Questa proprietà è vicina alla famosa villa dove l’ex cancelliere tedesco Konrad Adenauer trascorreva le estati molte volte durante il suo mandato e anche dopo, e vi dà un’idea di quanto siano pregiati il quartiere e questa Villa: di classe mondiale.'
        }
      }
    },
    {
      reviewer: 'Larisa, RU',
      date: 'August 2025',
      score: 10,
      originalLang: 'en',
      title: 'We had a really great experience to explore all sightseeing places of Como, staying at nice Villa Caterina Griante',
      text: 'Location is great! Just 80 m to the lake. Local supermarket is in 50 m. Very nice design of villa — smart integration of different styles. Very clean and cosy. Lovely hostess!',
      translations: {
        it: {
          title: 'Abbiamo vissuto un’esperienza bellissima esplorando tutti i luoghi di interesse di Como, soggiornando nella graziosa Villa Caterina Griante',
          text: 'La posizione è fantastica! Solo 80 m dal lago. Il supermercato locale è a 50 m. Il design della villa è molto bello, un’intelligente integrazione di stili diversi. Molto pulita e accogliente. Padrona di casa adorabile!'
        }
      }
    },
    {
      reviewer: 'Rashpal, GB',
      date: 'July 2025',
      score: 10,
      originalLang: 'en',
      title: '',
      text: 'Villa is very good — very clean but also with all the details taken care of. Eg abundance of towels, toiletries, very well equipped kitchen, etc etc etc. Location is excellent for anyone visiting Lake Como. Simona is an excellent host, and stayed in contact by WhatsApp before and after the visit.',
      translations: {
        it: {
          title: '',
          text: 'La Villa è molto buona, molto pulita ma anche con tutti i dettagli curati. Ad esempio abbondanza di asciugamani, prodotti da bagno, cucina molto ben attrezzata, ecc. ecc. ecc. La posizione è eccellente per chiunque visiti il Lago di Como. Simona è un’ottima host ed è rimasta in contatto tramite WhatsApp prima e dopo la visita.'
        }
      }
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
        },
        it: {
          title: 'Tutto era al posto giusto ed è stato meraviglioso',
          text: 'Ottima posizione, molto pulita e una bella villa.'
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
        },
        it: {
          title: '',
          text: 'Villa spaziosa, confortevole e molto ben attrezzata (cucina, bagno). L’accoglienza dei padroni di casa è stata di grande qualità. La vista sul lago è bellissima. A piedi si raggiungono un minimarket molto fornito e diverse soluzioni di ristorazione da asporto, davvero comodo. Il traghetto di Cadenabbia è a 5 minuti a piedi, ideale! Una soluzione per soggiornare in famiglia o tra amici per esplorare la regione, che consiglio senza esitazione.'
        }
      }
    },
    {
      reviewer: 'Sultan, SA',
      date: 'June 2025',
      score: 10,
      originalLang: 'en',
      title: 'Big Villa with great location',
      text: 'Lovely Villa with great location. The villa is large and suitable for a big family with three bedrooms and three bathrooms. There is a garden with a path leading down to the lake and the main road, and it is very close to the ferry station — five minutes walk. Special thanks to Simona for her great support all the time, and thank you Lina for welcoming us and explaining the Villa facilities.',
      translations: {
        it: {
          title: 'Grande Villa con ottima posizione',
          text: 'Bella Villa con ottima posizione. La villa è grande e adatta a una famiglia numerosa, con tre camere da letto e tre bagni. C’è un giardino con un sentiero che scende al lago e alla strada principale, ed è molto vicina alla stazione dei traghetti, a cinque minuti a piedi. Un ringraziamento speciale a Simona per il suo grande supporto in ogni momento, e grazie a Lina per averci accolto e spiegato le dotazioni della Villa.'
        }
      }
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
        },
        it: {
          title: '',
          text: 'Le persone che consegnano e ritirano le chiavi non parlano una parola di inglese. La comunicazione è difficile. Inoltre, la persona che ritirava le chiavi era molto scortese e ci ha costretto a prendere la spazzatura dal bidone esterno accanto alla villa e a portarla nei contenitori vicini.'
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
        },
        it: {
          title: 'Un posto meraviglioso',
          text: 'Tutto era meraviglioso. Una casa splendida, viste e comfort.'
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
        },
        it: {
          title: 'Soggiorno incantevole',
          text: 'La posizione è assolutamente fantastica. Un piccolo sentiero e si è subito al lago. Una vista davvero fantastica dalla casa, sia dentro che fuori.'
        }
      }
    },
    {
      reviewer: 'Orlin Radev, BG',
      date: 'October 2024',
      score: 10,
      originalLang: 'en',
      title: 'Simply amazing, highly recommend it!',
      text: 'Starting with the location, the villa is located near the Cadenabbia ferry station (5–7 min walk), which has direct connection to Bellagio and Varenna. This meant we can get around without using the car. That said, the villa has parking space for 2 cars. The villa itself is amazing — classic style, newly renovated, clean and well equipped, cosy and comfortable. Two of the 3 bedrooms have their own bathrooms. There is also an office with an extendable sofa, if you need another bed. The kitchen is equipped for everything you need if you decide to stay in and cook.',
      translations: {
        it: {
          title: 'Semplicemente fantastica, la consiglio vivamente!',
          text: 'A partire dalla posizione, la villa si trova vicino alla stazione dei traghetti di Cadenabbia (5–7 minuti a piedi), che ha un collegamento diretto con Bellagio e Varenna. Questo significava che potevamo spostarci senza usare l’auto. Detto ciò, la villa ha un parcheggio per 2 auto. La villa in sé è fantastica: stile classico, appena ristrutturata, pulita e ben attrezzata, accogliente e confortevole. Due delle 3 camere da letto hanno il proprio bagno. C’è anche un ufficio con un divano allungabile, se vi serve un altro letto. La cucina è attrezzata con tutto il necessario se decidete di restare a casa e cucinare.'
        }
      }
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
        },
        it: {
          title: '',
          text: 'Tutto era perfetto. Niente di cui lamentarsi.'
        }
      }
    },
    {
      reviewer: 'Regina, GB',
      date: 'September 2024',
      score: 10,
      originalLang: 'en',
      title: 'Lovely place to stay in Lake Como',
      text: 'We booked Villa to stay with family and friends for our big day celebration in Lake Como. Lady Lina met us at the time of our arrival to show around villa all facilities. She was so helpful, also Simona who was a main contact was very helpful with any questions we had. A big thank you for a lovely flower bouquet on our wedding day that Simona and Lina organised. Definitely would recommend this place if you need a lovely place to stay in Lake Como.',
      translations: {
        it: {
          title: 'Un posto incantevole dove soggiornare sul Lago di Como',
          text: 'Abbiamo prenotato la Villa per soggiornare con famiglia e amici per la celebrazione del nostro grande giorno sul Lago di Como. La signora Lina ci ha accolto al nostro arrivo per mostrarci la villa e tutte le sue dotazioni. È stata molto disponibile, così come Simona, che era il contatto principale ed è stata molto utile per qualsiasi domanda avessimo. Un grande grazie per il delizioso bouquet di fiori che Simona e Lina hanno organizzato per il giorno del nostro matrimonio. Consiglierei sicuramente questo posto se cercate un luogo incantevole dove soggiornare sul Lago di Como.'
        }
      }
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
        },
        it: {
          title: 'Siamo stati in vacanza nella villa con la famiglia, tre generazioni, tutti entusiasti!',
          text: 'Vista magnifica, villa confortevole: i proprietari hanno pensato a tutto, fino ai minimi dettagli! Un grande grazie a loro!'
        }
      }
    },
    {
      reviewer: 'James, US',
      date: 'August 2024',
      score: 10,
      originalLang: 'en',
      title: 'Old world villa with modern amenities awaits you to settle in, relax and find peace in a slice of paradise.',
      text: 'Such a graceful home with amazing views and a complete sense of comfort and tranquility. Great kitchen, AC was great, laundry, great showers, and a beautiful terrace. Villa is in a great location. Not too busy to relax and be on vacation but within walking distance to restaurants, the ferry, Villa Carlotta, and even Tremezzo was not too far for a morning walk. Take the secret path to the gate by the little chapel to save time getting down to the waterfront. There were so many great local restaurants especially Restaurante Belli Ille. Take the 10 minute ferry to Bellagio running every half hour or so for a few dollars per person.',
      translations: {
        it: {
          title: 'Una villa d’altri tempi con comfort moderni vi aspetta per sistemarvi, rilassarvi e trovare la pace in un angolo di paradiso.',
          text: 'Una casa così graziosa, con viste incredibili e un completo senso di comfort e tranquillità. Ottima cucina, aria condizionata eccellente, lavanderia, docce fantastiche e una splendida terrazza. La Villa è in un’ottima posizione. Non troppo affollata per rilassarsi e godersi la vacanza, ma a pochi passi da ristoranti, dal traghetto, da Villa Carlotta, e persino Tremezzo non era troppo lontana per una passeggiata mattutina. Prendete il sentiero segreto fino al cancello accanto alla piccola cappella per risparmiare tempo nel raggiungere il lungolago. C’erano tanti ottimi ristoranti locali, soprattutto il Restaurante Belli Ille. Prendete il traghetto di 10 minuti per Bellagio, che parte circa ogni mezz’ora, per pochi dollari a persona.'
        }
      }
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
        },
        it: {
          title: 'Soggiorno eccellente, in parte offuscato da un cantiere accanto, per fortuna temporaneo. Grazie a Simona.',
          text: 'Villa molto spaziosa, molto ben attrezzata e molto pulita, con una bellissima vista sul lago.'
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
      text: 'Our stay at this stunning villa on Lake Como was simply perfect! The elegance of the property was evident in every detail, from the beautifully designed interiors to the meticulously maintained garden. The breathtaking view of the lake from the terrace was absolutely unforgettable — waking up to such a serene and picturesque scene was a dream come true.\n\nThe villa was fully equipped with everything we needed, and we were especially impressed by the thoughtful inclusion of all the essentials for our daughter. It truly made traveling with a little one so much easier and stress-free.\n\nThis vacation was nothing short of fantastic, and we would highly recommend this extraordinary villa to anyone looking for a luxurious and relaxing getaway. We can\u2019t wait to return!',
      translations: {
        it: {
          title: '',
          text: 'Il nostro soggiorno in questa splendida villa sul Lago di Como è stato semplicemente perfetto! L’eleganza della proprietà era evidente in ogni dettaglio, dagli interni splendidamente progettati al giardino meticolosamente curato. La vista mozzafiato del lago dalla terrazza era assolutamente indimenticabile: svegliarsi davanti a un paesaggio così sereno e pittoresco era un sogno che diventava realtà.\n\nLa villa era completamente attrezzata con tutto ciò di cui avevamo bisogno, e siamo rimasti particolarmente colpiti dalla premurosa presenza di tutto l’essenziale per nostra figlia. Ha reso davvero molto più facile e senza stress viaggiare con una bambina.\n\nQuesta vacanza è stata a dir poco fantastica e consiglieremmo vivamente questa straordinaria villa a chiunque cerchi una fuga lussuosa e rilassante. Non vediamo l’ora di tornare!'
        }
      }
    },
    {
      reviewer: 'Jim Richards',
      date: 'July 2025',
      score: 5,
      originalLang: 'en',
      text: 'This villa is a gloriously peaceful home on the banks of Lake Como, situated in prime location for walking to Tremezzo or hoping the ferry for a 10 minute ride to Bellagio. The house is a classic Italian lake villa with modern amenities and a gracious host. We were so pleased to have chosen this spot for our stay in this area.\n\nCadenabbia is less hectic than most of the other lake villages and perfect for strolls on the lake shore, or a visit to the gardens at Villa Carlotta. We found plenty of places to sit and eat while enjoying the lovely lake views. The house had ample space for our party of 7. Highly recommended.',
      translations: {
        it: {
          title: '',
          text: 'Questa villa è una casa gloriosamente tranquilla sulle rive del Lago di Como, situata in una posizione ideale per raggiungere Tremezzo a piedi o prendere il traghetto per una traversata di 10 minuti verso Bellagio. La casa è una classica villa italiana sul lago, con comfort moderni e un ospite gentile. Siamo stati molto contenti di aver scelto questo posto per il nostro soggiorno in questa zona.\n\nCadenabbia è meno caotica della maggior parte degli altri paesi del lago e perfetta per passeggiate lungo la riva del lago, o per una visita ai giardini di Villa Carlotta. Abbiamo trovato molti posti dove sederci e mangiare godendoci le belle viste del lago. La casa aveva ampio spazio per il nostro gruppo di 7 persone. Altamente raccomandata.'
        }
      }
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
        },
        it: {
          title: '',
          text: 'La nostra sensazione di vacanza è iniziata con i fiori colorati e l’aria del mattino piacevolmente profumata. Dal balcone abbiamo goduto di una vista fantastica sul Lago di Como. Le stanze della villa, restaurate con amore, hanno superato le nostre alte aspettative.\nL’accesso diretto attraverso il giardino alla passeggiata ha completato la nostra impressione positiva. Torneremo sicuramente!'
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
        },
        it: {
          title: '',
          text: 'Villa bellissima con una vista fantastica sul Lago di Como! Meravigliosamente arredata e padroni di casa molto gentili!'
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
      text: 'Villa Caterina, is very beautiful with a stunning view of the mountains and the lake! Highly recommend it and if I come back to Lake Como it will be my first choice! Great for families, all will be very comfortable, lots of space. The place exceeded my expectations! Thank you!',
      translations: {
        it: {
          title: '',
          text: 'Villa Caterina è molto bella, con una vista mozzafiato sulle montagne e sul lago! La consiglio vivamente e, se tornerò sul Lago di Como, sarà la mia prima scelta! Perfetta per le famiglie, tutti si troveranno molto a proprio agio, c’è molto spazio. Il posto ha superato le mie aspettative! Grazie!'
        }
      }
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
        },
        it: {
          title: '',
          text: 'La casa è magnifica e molto spaziosa. Le dotazioni (elettrodomestici e biancheria da letto) sono di grande qualità, l’arredamento curato e le pulizie impeccabili. Svegliarsi la mattina con la vista del lago è un vero piacere. Abbiamo trascorso un soggiorno molto piacevole. Per i bambini c’è una splendida area giochi a 2 minuti a piedi e i proprietari ci hanno messo a disposizione seggiolone e lettino. C’è anche una pizzeria e un minimarket a 2 minuti dalla casa, è molto comodo.\nUna piccola delusione: nell’annuncio viene evidenziato che l’imbarcadero del traghetto si trova a 200 metri, il che ha contribuito alla nostra scelta di affitto, ma purtroppo il porto è chiuso da un po’ perché sono in corso grandi lavori: avremmo gradito essere avvisati in anticipo.'
        }
      }
    },
    {
      reviewer: 'Parul',
      date: 'April 2026',
      score: 5,
      originalLang: 'en',
      text: 'Beautiful home, we enjoyed our stay. Hosts attended to all our requests.',
      translations: {
        it: {
          title: '',
          text: 'Bella casa, abbiamo apprezzato il nostro soggiorno. I padroni di casa hanno soddisfatto tutte le nostre richieste.'
        }
      }
    }
  ];

  // ── i18n ──
  // Dictionaries provided by js/i18n.js (must load first).
  // Falls back to English labels if i18n.js is missing.
  var I18N = window.VC_I18N || null;
  var PAGE_LANG = I18N ? I18N.lang : 'en';

  var FALLBACK_LANG_NAMES = {
    en: 'English', it: 'Italian', de: 'German', fr: 'French', pl: 'Polish', da: 'Danish', uk: 'Ukrainian'
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
