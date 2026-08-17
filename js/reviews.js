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
        },
        fr: {
          title: 'Nous avons pleinement apprécié notre séjour en famille dans cette élégante Villa.',
          text: 'Villa Caterina est une maison élégante et magnifique. La Villa était parfaitement équipée avec tout ce dont on a besoin, en particulier la cuisine. Les petites attentions telles que le café, le thé, les biscuits ainsi que le linge et les articles de toilette ont été très appréciées. Le sentier devant la maison qui descend vers le mini marché, les bus, le café et la pizzeria était très pratique.'
        },
        de: {
          title: 'Wir haben den Aufenthalt als Familie in dieser eleganten Villa sehr genossen.',
          text: 'Villa Caterina ist ein elegantes und wunderschönes Zuhause. Die Villa war mit allem ausgestattet, was man braucht, besonders die Küche. Die liebevollen kleinen Extras wie Kaffee, Tee, Kekse sowie Wäsche und Pflegeprodukte wurden sehr geschätzt. Der vordere Weg hinunter zum Minimarkt, zu den Bussen sowie zu Kaffee und Pizza war sehr praktisch.'
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
        },
        fr: {
          title: 'Un heureux retour dans une magnifique villa sur le beau lac de Côme à Cadenabbia.',
          text: 'Il s\'agit d\'une propriété indépendante — pas d\'un hôtel, donc pas de petit-déjeuner, mais le propriétaire nous a offert une collation et une grande bouteille de champagne, ce qui était une très belle attention. Il y a un joli marché à quelques minutes à pied, ainsi que des bars et restaurants facilement accessibles depuis la Villa, et nous sommes aussi très proches du ferry pour Bellagio et tous les autres ports du lac. Cette propriété est voisine de la célèbre villa où l\'ancien chancelier allemand Konrad Adenauer a passé ses étés à de nombreuses reprises pendant son mandat et après, et cela vous donne une idée de la qualité du quartier et de cette Villa — de classe mondiale.'
        },
        de: {
          title: 'Eine glückliche Rückkehr in eine prächtige Villa am wunderschönen Comer See in Cadenabbia.',
          text: 'Es handelte sich um ein eigenständiges Anwesen — kein Hotel, daher kein Frühstück, aber der Eigentümer hat uns einen schönen Snack und eine große Flasche Champagner bereitgestellt, was eine wirklich nette Geste war. Es gibt einen schönen Markt nur wenige Gehminuten entfernt, auch nette Bars und Restaurants sind von der Villa aus gut zu Fuß erreichbar, und wir sind auch ganz nah an der Fähre nach Bellagio und zu allen anderen Orten am See. Dieses Anwesen liegt neben der berühmten Villa, in der der ehemalige deutsche Bundeskanzler Konrad Adenauer während und nach seiner Amtszeit viele Male den Sommer verbrachte, und es vermittelt einen Eindruck davon, was für eine feine Nachbarschaft und was für ein Anwesen diese Villa ist — Weltklasse.'
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
        },
        fr: {
          title: 'Nous avons vécu une très belle expérience en explorant tous les sites touristiques de Côme, en séjournant à la charmante Villa Caterina Griante',
          text: 'L\'emplacement est excellent ! À seulement 80 m du lac. Le supermarché local est à 50 m. Très beau design de la villa — une intégration intelligente de différents styles. Très propre et chaleureuse. Une hôtesse adorable !'
        },
        de: {
          title: 'Wir hatten eine wirklich tolle Erfahrung, alle Sehenswürdigkeiten von Como zu erkunden, während wir in der schönen Villa Caterina Griante wohnten',
          text: 'Die Lage ist großartig! Nur 80 m zum See. Der lokale Supermarkt ist 50 m entfernt. Sehr schönes Design der Villa — clevere Integration verschiedener Stile. Sehr sauber und gemütlich. Liebenswerte Gastgeberin!'
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
        },
        fr: {
          title: '',
          text: 'La Villa est très bien — très propre et tous les détails sont soignés. Par exemple l\'abondance de serviettes, d\'articles de toilette, la cuisine très bien équipée, etc. etc. etc. L\'emplacement est excellent pour quiconque visite le lac de Côme. Simona est une excellente hôtesse et est restée en contact via WhatsApp avant et après le séjour.'
        },
        de: {
          title: '',
          text: 'Die Villa ist sehr gut — sehr sauber, aber auch mit viel Liebe zum Detail. Zum Beispiel reichlich Handtücher, Pflegeprodukte, eine sehr gut ausgestattete Küche usw. usw. Die Lage ist ausgezeichnet für jeden, der den Comer See besucht. Simona ist eine hervorragende Gastgeberin und blieb per WhatsApp vor und nach dem Besuch in Kontakt.'
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
        },
        fr: {
          title: 'Tout était parfait et absolument magnifique',
          text: 'Très bon emplacement, très propre et une belle villa.'
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
        },
        de: {
          title: '',
          text: 'Geräumige, komfortable und sehr gut ausgestattete Villa (Küche, Badezimmer). Die Gastfreundschaft der Gastgeber ist von hoher Qualität. Der Blick auf den See ist wunderschön. Zu Fuß erreicht man einen sehr gut sortierten Minimarkt und mehrere Möglichkeiten zum Mitnehmen von Speisen, sehr praktisch. Die Fähre von Cadenabbia ist 5 Gehminuten entfernt, ideal! Eine Lösung, um mit der Familie oder Freunden die Region zu erkunden, die ich ohne Zögern empfehle.'
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
        },
        fr: {
          title: 'Grande Villa avec un excellent emplacement',
          text: 'Belle Villa très bien située. La villa est grande et adaptée à une grande famille avec trois chambres et trois salles de bains. Il y a un jardin avec un sentier qui descend vers le lac et la route principale, et elle est très proche de la gare des ferries — cinq minutes à pied. Un grand merci à Simona pour son soutien constant, et merci à Lina de nous avoir accueillis et expliqué les équipements de la Villa.'
        },
        de: {
          title: 'Große Villa mit toller Lage',
          text: 'Wunderschöne Villa mit großartiger Lage. Die Villa ist groß und geeignet für eine große Familie mit drei Schlafzimmern und drei Badezimmern. Es gibt einen Garten mit einem Weg, der zum See und zur Hauptstraße hinunterführt, und sie liegt ganz nah an der Fährstation — fünf Minuten zu Fuß. Besonderer Dank an Simona für ihre großartige Unterstützung zu jeder Zeit, und danke an Lina, dass sie uns willkommen geheißen und die Ausstattung der Villa erklärt hat.'
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
        },
        fr: {
          title: '',
          text: 'Les personnes qui remettent et récupèrent les clés ne parlent pas un mot d\'anglais. La communication est difficile. De plus, la personne qui récupérait les clés était très désagréable et nous a forcés à emporter les déchets de la poubelle extérieure située à côté de la villa et à les amener jusqu\'aux conteneurs voisins.'
        },
        de: {
          title: '',
          text: 'Die Personen, die die Schlüssel übergeben und abholen, sprechen kein Wort Englisch. Die Kommunikation ist erschwert. Außerdem war die Person, die die Schlüssel abholte, sehr unfreundlich und zwang uns, den Müll aus dem Außenbehälter neben der Villa zu nehmen und ihn zu den nahegelegenen Containern zu bringen.'
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
        },
        fr: {
          title: 'Un endroit merveilleux',
          text: 'Tout était merveilleux. Une maison splendide, des vues et des équipements.'
        },
        de: {
          title: 'Ein wunderbarer Ort',
          text: 'Alles war wunderbar. Ein herrliches Haus, Ausblicke und Annehmlichkeiten.'
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
        },
        fr: {
          title: 'Un séjour charmant',
          text: 'L\'emplacement est absolument fantastique. Un petit sentier et on est vite au bord du lac. Une vue vraiment fantastique depuis la maison, à l\'intérieur comme à l\'extérieur.'
        },
        de: {
          title: 'Herrlicher Aufenthalt',
          text: 'Die Lage ist absolut fantastisch. Ein kleiner Pfad und man steht schnell am See. Ein ganz fantastischer Ausblick vom Haus, sowohl drinnen als auch draußen.'
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
        },
        fr: {
          title: 'Simplement incroyable, je la recommande vivement !',
          text: 'En commençant par l\'emplacement, la villa est située près de la gare des ferries de Cadenabbia (5–7 min à pied), qui offre une liaison directe vers Bellagio et Varenna. Nous pouvions donc nous déplacer sans utiliser la voiture. Cela dit, la villa dispose d\'un parking pour 2 voitures. La villa elle-même est incroyable — style classique, récemment rénovée, propre et bien équipée, chaleureuse et confortable. Deux des 3 chambres ont leur propre salle de bains. Il y a aussi un bureau avec un canapé extensible, si vous avez besoin d\'un lit supplémentaire. La cuisine est équipée de tout ce dont vous avez besoin si vous décidez de rester et de cuisiner.'
        },
        de: {
          title: 'Einfach erstaunlich, sehr zu empfehlen!',
          text: 'Beginnend mit der Lage: Die Villa befindet sich in der Nähe der Fährstation Cadenabbia (5–7 Min. Fußweg), die eine direkte Verbindung nach Bellagio und Varenna hat. Das bedeutete, dass wir ohne Auto unterwegs sein konnten. Allerdings hat die Villa auch Parkplätze für 2 Autos. Die Villa selbst ist erstaunlich — klassischer Stil, neu renoviert, sauber und gut ausgestattet, gemütlich und komfortabel. Zwei der 3 Schlafzimmer haben ein eigenes Badezimmer. Es gibt auch ein Büro mit einem ausziehbaren Sofa, falls man ein weiteres Bett braucht. Die Küche ist mit allem ausgestattet, was man braucht, wenn man beschließt, zu Hause zu bleiben und zu kochen.'
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
        },
        fr: {
          title: '',
          text: 'Tout était parfait. Rien à redire.'
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
        },
        fr: {
          title: 'Un endroit charmant où séjourner sur le lac de Côme',
          text: 'Nous avons réservé la Villa pour séjourner en famille et entre amis pour la célébration de notre grand jour sur le lac de Côme. Madame Lina nous a accueillis à notre arrivée pour nous montrer la villa et toutes ses installations. Elle a été très serviable, tout comme Simona, qui était notre contact principal et s\'est montrée très utile pour toutes nos questions. Un grand merci pour le ravissant bouquet de fleurs que Simona et Lina ont organisé pour notre jour de mariage. Je recommande sans hésiter cet endroit si vous cherchez un lieu charmant où séjourner sur le lac de Côme.'
        },
        de: {
          title: 'Ein wunderschöner Ort für einen Aufenthalt am Comer See',
          text: 'Wir haben die Villa gebucht, um mit Familie und Freunden unsere große Feier am Comer See zu verbringen. Lady Lina empfing uns bei unserer Ankunft, um uns die Villa und alle Einrichtungen zu zeigen. Sie war so hilfsbereit, ebenso Simona, die unsere Hauptansprechpartnerin war und bei allen Fragen sehr hilfreich war. Ein großes Dankeschön für den wunderschönen Blumenstrauß an unserem Hochzeitstag, den Simona und Lina organisiert haben. Ich würde diesen Ort auf jeden Fall empfehlen, wenn man einen wunderschönen Ort für einen Aufenthalt am Comer See sucht.'
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
        },
        fr: {
          title: 'Nous avons passé des vacances en famille à la villa, trois générations, tous ravis !',
          text: 'Une vue magnifique, une villa confortable — les propriétaires ont pensé à tout, jusqu\'au moindre détail ! Un grand merci à eux !'
        },
        de: {
          title: 'Wir haben als Familie in der Villa Urlaub gemacht, drei Generationen, alle begeistert!',
          text: 'Herrlicher Ausblick, komfortable Villa — die Gastgeber haben an alles bis ins kleinste Detail gedacht! Ein großes Dankeschön an sie!'
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
        },
        fr: {
          title: 'Une villa d\'époque avec des équipements modernes vous attend pour vous installer, vous détendre et trouver la paix dans un coin de paradis.',
          text: 'Une maison si élégante avec des vues incroyables et un sentiment complet de confort et de tranquillité. Excellente cuisine, la climatisation était parfaite, la buanderie, de belles douches et une magnifique terrasse. La Villa est très bien située. Pas trop fréquentée pour se détendre et être en vacances, mais à distance de marche des restaurants, du ferry, de la Villa Carlotta, et même Tremezzo n\'était pas trop loin pour une promenade matinale. Prenez le sentier secret jusqu\'au portail près de la petite chapelle pour gagner du temps pour descendre au bord du lac. Il y avait tant d\'excellents restaurants locaux, en particulier le Restaurante Belli Ille. Prenez le ferry de 10 minutes pour Bellagio, qui part environ toutes les demi-heures, pour quelques dollars par personne.'
        },
        de: {
          title: 'Eine Villa aus alter Zeit mit modernen Annehmlichkeiten erwartet Sie, damit Sie sich niederlassen, entspannen und Frieden finden in einem Stück Paradies.',
          text: 'Ein so elegantes Zuhause mit erstaunlichen Ausblicken und einem vollkommenen Gefühl von Komfort und Ruhe. Tolle Küche, die Klimaanlage war großartig, Wäscherei, tolle Duschen und eine wunderschöne Terrasse. Die Villa liegt in großartiger Lage. Nicht zu belebt, um sich zu entspannen und im Urlaub zu sein, aber in Gehweite von Restaurants, der Fähre, Villa Carlotta, und selbst Tremezzo war nicht zu weit für einen Morgenspaziergang. Nehmen Sie den geheimen Pfad zum Tor bei der kleinen Kapelle, um Zeit zu sparen, wenn Sie zum Seeufer hinuntergehen. Es gab so viele tolle lokale Restaurants, besonders das Restaurante Belli Ille. Nehmen Sie die 10-minütige Fähre nach Bellagio, die etwa alle halbe Stunde fährt, für ein paar Dollar pro Person.'
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
        },
        de: {
          title: 'Ausgezeichneter Aufenthalt, etwas getrübt durch eine Baustelle nebenan, glücklicherweise vorübergehend. Dank an Simona.',
          text: 'Sehr geräumige, sehr gut ausgestattete und sehr saubere Villa, mit einer wunderschönen Aussicht auf den See.'
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
        },
        fr: {
          title: '',
          text: 'Notre séjour dans cette superbe villa sur le lac de Côme était tout simplement parfait ! L\'élégance de la propriété était évidente dans chaque détail, des intérieurs magnifiquement conçus au jardin méticuleusement entretenu. La vue à couper le souffle sur le lac depuis la terrasse était absolument inoubliable — se réveiller devant un paysage aussi serein et pittoresque était un rêve devenu réalité.\n\nLa villa était entièrement équipée avec tout ce dont nous avions besoin, et nous avons été particulièrement impressionnés par la présence attentionnée de tous les essentiels pour notre fille. Cela a vraiment rendu le voyage avec un enfant en bas âge beaucoup plus facile et sans stress.\n\nCes vacances étaient tout simplement fantastiques, et nous recommandons vivement cette villa extraordinaire à quiconque cherche une escapade luxueuse et relaxante. Nous avons hâte de revenir !'
        },
        de: {
          title: '',
          text: 'Unser Aufenthalt in dieser atemberaubenden Villa am Comer See war einfach perfekt! Die Eleganz des Anwesens zeigte sich in jedem Detail, von den wunderschön gestalteten Innenräumen bis zum sorgfältig gepflegten Garten. Der atemberaubende Blick auf den See von der Terrasse war absolut unvergesslich — zu einer so ruhigen und malerischen Szenerie aufzuwachen war ein wahr gewordener Traum.\n\nDie Villa war vollständig mit allem ausgestattet, was wir brauchten, und wir waren besonders beeindruckt von der durchdachten Bereitstellung aller wichtigen Dinge für unsere Tochter. Das hat das Reisen mit einem kleinen Kind wirklich viel einfacher und stressfreier gemacht.\n\nDieser Urlaub war schlichtweg fantastisch, und wir würden diese außergewöhnliche Villa jedem empfehlen, der einen luxuriösen und erholsamen Kurzurlaub sucht. Wir können es kaum erwarten wiederzukommen!'
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
        },
        fr: {
          title: '',
          text: 'Cette villa est une maison merveilleusement paisible sur les rives du lac de Côme, idéalement située pour se rendre à pied à Tremezzo ou prendre le ferry pour une traversée de 10 minutes vers Bellagio. La maison est une villa italienne classique au bord du lac, avec des équipements modernes et un hôte charmant. Nous étions ravis d\'avoir choisi cet endroit pour notre séjour dans la région.\n\nCadenabbia est moins agitée que la plupart des autres villages du lac et parfaite pour des promenades au bord du lac, ou une visite des jardins de la Villa Carlotta. Nous avons trouvé de nombreux endroits où s\'asseoir et manger tout en profitant des belles vues sur le lac. La maison offrait suffisamment d\'espace pour notre groupe de 7 personnes. Vivement recommandé.'
        },
        de: {
          title: '',
          text: 'Diese Villa ist ein herrlich friedliches Zuhause am Ufer des Comer Sees, in bester Lage, um nach Tremezzo zu laufen oder die Fähre für eine 10-minütige Fahrt nach Bellagio zu nehmen. Das Haus ist eine klassische italienische Seevilla mit modernen Annehmlichkeiten und einem liebenswürdigen Gastgeber. Wir waren so froh, diesen Ort für unseren Aufenthalt in dieser Gegend gewählt zu haben.\n\nCadenabbia ist weniger hektisch als die meisten anderen Dörfer am See und perfekt für Spaziergänge am Seeufer oder einen Besuch der Gärten der Villa Carlotta. Wir fanden viele Plätze zum Sitzen und Essen, während wir die herrliche Aussicht auf den See genossen. Das Haus hatte reichlich Platz für unsere Gruppe von 7 Personen. Sehr zu empfehlen.'
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
        },
        fr: {
          title: '',
          text: 'Notre sentiment de vacances a commencé avec les fleurs colorées et l\'air du matin agréablement parfumé. Depuis le balcon, nous avions une vue fantastique sur le lac de Côme. Les pièces de la villa, restaurées avec amour, ont dépassé nos grandes attentes.\nL\'accès direct par le jardin à la promenade a complété notre impression positive. Nous reviendrons à coup sûr !'
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
        },
        fr: {
          title: '',
          text: 'Magnifique villa avec une vue fantastique sur le lac de Côme ! Merveilleusement meublée et des hôtes très chaleureux !'
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
        },
        fr: {
          title: '',
          text: 'Villa Caterina est très belle avec une vue imprenable sur les montagnes et le lac ! Je la recommande vivement et si je reviens sur le lac de Côme, ce sera mon premier choix ! Parfaite pour les familles, tout le monde sera très à l\'aise, beaucoup d\'espace. L\'endroit a dépassé mes attentes ! Merci !'
        },
        de: {
          title: '',
          text: 'Villa Caterina ist sehr schön mit einem atemberaubenden Blick auf die Berge und den See! Sehr zu empfehlen, und wenn ich an den Comer See zurückkehre, wird es meine erste Wahl sein! Toll für Familien, alle werden sich sehr wohlfühlen, viel Platz. Die Unterkunft hat meine Erwartungen übertroffen! Danke!'
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
        },
        de: {
          title: '',
          text: 'Das Haus ist herrlich und sehr geräumig. Die Ausstattung (Haushaltsgeräte und Bettwäsche) ist von hoher Qualität, die Dekoration sorgfältig und die Reinigung einwandfrei. Morgens mit dem Blick auf den See aufzuwachen ist eine wahre Freude. Wir haben einen sehr angenehmen Aufenthalt verbracht. Für die Kinder gibt es einen tollen Spielplatz 2 Minuten zu Fuß, und die Eigentümer haben uns Hochstuhl und Babybett zur Verfügung gestellt. Es gibt auch eine Pizzeria und einen Minimarkt 2 Minuten vom Haus, das ist sehr praktisch.\nKleine Enttäuschung: In der Anzeige wird hervorgehoben, dass sich der Fähranleger 200 Meter entfernt befindet, was zu unserer Wahl der Unterkunft beigetragen hat, leider ist der Hafen seit einiger Zeit geschlossen, da größere Bauarbeiten im Gange sind — wir hätten gerne vorher davon erfahren.'
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
        },
        fr: {
          title: '',
          text: 'Belle maison, nous avons apprécié notre séjour. Les hôtes ont répondu à toutes nos demandes.'
        },
        de: {
          title: '',
          text: 'Wunderschönes Haus, wir haben unseren Aufenthalt genossen. Die Gastgeber haben sich um alle unsere Anliegen gekümmert.'
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
