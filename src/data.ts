import { projectMedia, type ProjectMedia } from './projectMedia';
import { projectSectionLayouts } from './projectLayouts';
import type { Credit, ProjectSection, ProjectSectionBlock, Work } from './projectTypes';

export type { Credit, ProjectSection, ProjectSectionBlock, ProjectSectionColumn, Work } from './projectTypes';

const home = ['/assets/work-cremonese.png', '/assets/work-martinorossi.webp', '/assets/work-univet.webp'];
const section = (title: string, paragraphs: string[], blocks: ProjectSectionBlock[] = []): ProjectSection => ({ title, paragraphs, blocks });
const credit = (role: string, ...names: string[]): Credit => ({ role, names });

type ProjectText = Pick<Work, 'services' | 'year' | 'client' | 'challenge' | 'sections'> & { credits?: Credit[] };
type ProjectBase = Pick<Work, 'slug' | 'title' | 'image' | 'hero'>;

const baseWorks: ProjectBase[] = [
  { slug: 'cremonese-120', title: '120° U.S. Cremonese', image: home[0], hero: '/projects/cremonese-120/hero.png' },
  { slug: 'martinorossi-vr', title: 'MartinoRossi VR Experience', image: home[1], hero: '/projects/martinorossi-vr/hero.webp' },
  { slug: 'univet-casco-laser', title: 'Univet Casco Laser', image: home[2], hero: '/projects/univet-casco-laser/hero.png' },
  { slug: 'eventi-aic', title: 'Eventi Associazione Industriali Cremona', image: home[1], hero: '/projects/eventi-aic/hero.webp' },
  { slug: 'idee-mani-tempo', title: 'Le idee, le mani, il tempo', image: home[0], hero: '/projects/idee-mani-tempo/hero.webp' },
  { slug: 'sellago', title: 'SellaGO', image: home[2], hero: '/projects/sellago/hero.jpg' },
  { slug: 'cremonese-maglie', title: 'Cremonese Maglie', image: home[0], hero: '/projects/cremonese-maglie/hero.webp' },
  { slug: 'spinagallo', title: 'Spinagallo Website', image: home[1], hero: '/projects/spinagallo/hero.webp' },
  { slug: 'jmg-ar', title: 'JMG – Configuratore A/R', image: home[2], hero: '/projects/jmg-ar/hero.webp' },
  { slug: 'pro-cremona', title: 'Pro Cremona', image: home[0], hero: '/projects/pro-cremona/hero.png' },
  { slug: 'festival-monteverdi', title: 'Festival Monteverdi', image: home[1], hero: '/projects/festival-monteverdi/hero.webp' },
  { slug: 'mina-virtual-traveler', title: 'Mina – Virtual Traveler', image: home[2], hero: '/projects/mina-virtual-traveler/hero.webp' },
  { slug: 'c2-corporate', title: 'C2 Corporate', image: home[1], hero: '/projects/c2-corporate/hero.webp' },
];

// Testi trascritti integralmente dalle pagine progetto originali di nebbialab.it.
const originalTextBySlug: Record<string, ProjectText> = {
  "cremonese-120": {
    services: "Art direction / Event / Video / Web",
    year: "2023",
    client: "US Cremonese",
    challenge: "Celebrare i 120 anni dalla fondazione della US Cremonese unendo il passato al presente, la tradizione alla tecnologia",
    sections: [
      section("IL PROGETTO", [
        "L’approccio phygital di Nebbia si è dimostrato in perfetta sintonia con le esigenze della Società. Abbiamo optato per la creazione di una mostra che ha ripercorso la storia della Cremonese attraverso l’esposizione di alcune tra le maglie più iconiche, i trofei, e documenti storici significativi.\nIl percorso della mostra si è snodato tra i diversi ambienti della “casa” della Cremonese: lo stadio.",
        "A corredo della mostra, Nebbia ha gestito l’art direction di tutti gli aspetti delle celebrazioni, incluse la comunicazione e la creazione di merchandising.",
        "L’evento ha portato allo stadio più di 7.000 visitatori in tre giorni.",
      ]),
      section("LE TECHE", [
        "Le teche sono il cuore della mostra.\nProgettate interamente da Nebbia, partono da un concept che unisce gli elementi di una partita di calcio: le luci dello stadio, il verde del prato e l’acciaio delle porte.\nSono state realizzate due tipologie di teche, una per le maglie e una per i trofei.\nLe luci all’interno degli ambienti sono state progettate per impreziosire e donare un velo di mistero ai cimeli storici.",
      ]),
      section("IL CORTOMETRAGGIO", [
        "Il breve documentario, che ha commosso molti spettatori, è stato tra i lavori selezionati al concorso internazionale “SPORT MOVIES & TV 2023” organizzato dalla Federation International Cinema Television Sportifs, riconosciuta dal Comitato Internazionale Olimpico nelle 130 Nazioni affiliate come promotore dei valori dello sport e dell’Olimpismo attraverso le immagini.",
      ]),
      section("MERCH", [
        "A Nebbia è stata affidata anche la creazione del merchandising celebrativo. Per l’occasione sono state realizzate due t-shirt, una felpa, un cappellino e due modelli di sciarpe.",
        "Grazie a competenze interne che hanno maturato una decennale esperienza nel mercato dello streetwear, Nebbia ha realizzato grafiche che hanno combinato tradizione, pulizia grafica e modernità, in linea con i trend attuali.",
        "Ci siamo inoltre occupati della progettazione e della realizzazione dello shop online – basato su Shopify – per creare, anche in questo caso, una soluzione phygital.",
      ]),
    ],
    credits: [
      credit("Creative Director", "FILIPPO MONDINI"),
      credit("Art Director", "DAVIDE UBERTI"),
      credit("Project Manager", "PAOLO BODINI"),
      credit("Graphic Designer", "FILIPPO ANTONIOLI"),
      credit("3D Artist", "LUIGI RUBENS CRISPINO", "YURI DALLA NOCE"),
      credit("Motion Graphic", "STEFANO MUCHETTI", "DAVIDE UBERTI"),
      credit("Regia Cortometraggio", "STEFANO MUCHETTI"),
      credit("Camera Cortometraggio", "FABRIZIO VENOSA", "ANDREA POLITI"),
      credit("Fonico Cortometraggio", "LUCA MICCOLI"),
      credit("Editing e Post Produzione", "STEFANO MUCHETTI"),
      credit("Foto Evento", "MARCO MANTOVANI", "VIOLA SAMARINI"),
      credit("Video Report Evento", "STEFANO MUCHETTI"),
      credit("Web Development", "ANDREA GIRELLI"),
      credit("Allestimento video", "GIOCHI DI LUCE"),
      credit("Allestimento", "OFFICINA ZAGNI", "COLORI GADGET", "PARMA ALLESTIMENTI", "TONGHINI", "TOPOLITOGRAFIA PERSEGANI", "FANTI GRAFICA"),
      credit("Modellistica", "ONEOFF"),
    ],
  },
  "martinorossi-vr": {
    services: "Branding / Creative / Video",
    year: "2024",
    client: "MartinoRossi SpA",
    challenge: "Utilizzare la realtà virtuale per aumentare la brand awareness e presentare l’eccellenza degli spazi e dei processi aziendali in contesti fieristici",
    sections: [
      section("IL PROGETTO", [
        "MartinoRossi ha scelto Nebbia per sviluppare un’applicazione in realtà virtuale, progettata per presentare l’azienda, i suoi processi e le attrezzature durante eventi fieristici.",
        "L’obiettivo era creare un’esperienza semplice e intuitiva, capace di trasmettere le informazioni essenziali in tempi brevi, in linea con le esigenze dinamiche di una fiera.",
        "L’integrazione della doppia lingua, italiano e inglese, rende l’esperienza accessibile e fruibile anche per una clientela internazionale, ampliando il raggio d’azione e valorizzando l’azienda in un contesto globale.",
      ]),
      section("ASSET", [
        "L’esperienza è strutturata in più ambienti, ciascuno pensato per coinvolgere e informare l’utente. Si inizia in una home 3D, rappresentante una serra futuristica, progettata a quattro mani con il cliente per evocare l’immagine di un futuro sostenibile e caratterizzato da un progresso tecnologico avanzato.",
        "Al centro della home si trova un modellino in scala dell’azienda, che funge da hub interattivo.\nDa qui, l’utente può accedere a sette spazi distinti, visualizzati attraverso fotografie immersive a 360°. All’interno di ciascun ambiente, punti di interesse interattivi forniscono informazioni dettagliate sui processi di lavorazione e sulle eccellenze aziendali, attraverso una combinazione di video esplicativi e infografiche testuali.",
      ]),
      section("UI/UX", [
        "La user experience è stata progettata con l’obiettivo di offrire un’interazione intuitiva e immediata. Per garantire una fruizione naturale e accessibile a tutti, i joystick sono stati sostituiti da un sistema di controllo basato sui movimenti delle mani, semplificando l’interazione e rendendola più immersiva.",
        "L’impianto grafico è stato sviluppato seguendo un design minimale ed essenziale, in linea con l’identità visiva della corporate aziendale. Particolare attenzione è stata dedicata alla cura dei dettagli per mantenere un equilibrio tra semplicità e professionalità, assicurando che ogni elemento grafico contribuisca a valorizzare l’immagine dell’azienda",
      ]),
    ],
    credits: [
      credit("3D Artist", "LUIGI RUBENS CRISPINO"),
      credit("UI/UX Designer", "YURI DALLA NOCE", "FEDERICO UBERTI"),
      credit("Product Manager", "DAVIDE UBERTI"),
      credit("Developer", "TEODOR DAN PISLARIU"),
      credit("Footage foto/video", "STEFANO MUCHETTI", "FABRIZIO VENOSA"),
      credit("Supervisor", "FILIPPO MONDINI"),
    ],
  },
  "univet-casco-laser": {
    services: "Video",
    year: "2024",
    client: "Univet",
    challenge: "Creare contenuti visivi per il casco laser Univet",
    sections: [
      section("IL PROGETTO", [
        "Univet si è affidata a Nebbia per la realizzazione di una serie di contenuti video dedicati alla promozione e spiegazione della loro gamma di caschi laser. L’esigenza principale comprendeva la creazione di video tutorial, un video di presentazione prodotto, contenuti dedicati alle specifiche tecniche e un video comparativo con i prodotti concorrenti.",
        "Per rispondere a questa richiesta, Nebbia ha proposto un approccio ottimizzato alla produzione, prevedendo una regia semplificata direttamente in loco. Questo ha consentito di massimizzare l’efficienza, ottimizzare tempi e risorse, e garantire la realizzazione di tutti i contenuti necessari in un unico ciclo produttivo.",
      ]),
    ],
    credits: [
      credit("Project Manager", "PAOLO BODINI"),
      credit("Video Director", "FABRIZIO VENOSA"),
      credit("Camera", "STEFANO MUCHETTI", "SIMONE MAGLIA"),
      credit("Editing e Postproduzione", "STEFANO MUCHETTI"),
    ],
  },
  "eventi-aic": {
    services: "Communication / Event / Graphic Design / Video",
    year: "2025",
    client: "Associazione Industriali Cremona",
    challenge: "Gestione dei contenuti multimediali",
    sections: [
      section("IL PROGETTO", [
        "L’Associazione Industriali si è rivolta a Nebbia per supportarla nella creazione dei contenuti visivi destinati ai propri eventi istituzionali.",
        "Nebbia ha affiancato il cliente nello sviluppo di video, grafiche e materiali di comunicazione, contribuendo a definire un linguaggio visivo coerente e riconoscibile nel tempo. Parallelamente, il team ha seguito anche la regia live degli eventi, coordinando contenuti, tempi e flussi narrativi per garantire un’esperienza coinvolgente e perfettamente integrata tra palco e schermo.",
      ]),
      section("", [
        "Il nostro team ha affiancato il cliente nella gestione degli ospiti e nella regia complessiva dell’evento, curando le riprese live e garantendo un coordinamento puntuale di tutte le fasi operative. Parallelamente, abbiamo sviluppato e gestito i contenuti in tempo reale per i canali social, contribuendo ad amplificare la visibilità dell’evento e a renderlo fruibile anche al di fuori della sala.",
      ]),
      section("PIATTAFORMA", [
        "Il cliente si è affidato a Nebbia anche per la gestione digitale dell’evento, attraverso la piattaforma proprietaria ELS.",
        "La soluzione ha permesso di trasmettere la diretta live in modo strutturato e professionale, offrendo al pubblico la possibilità di seguire l’evento anche da remoto.",
        "Parallelamente, ELS ha supportato la gestione degli inviti e delle registrazioni, sia nella fase pre-evento sia durante lo svolgimento, garantendo un controllo completo dei flussi di partecipazione e un’esperienza utente semplice e integrata.",
      ]),
    ],
  },
  "idee-mani-tempo": {
    services: "Art direction / Event / Graphic Design / Video",
    year: "2025",
    client: "Associazione Industriali Cremona",
    challenge: "Realizzare un’esposizione per gli 80 anni dell’associazione Industriali di Cremona",
    sections: [
      section("IL PROGETTO", [
        "In occasione degli 80 anni dalla sua fondazione, l’Associazione si è rivolta a Nebbia per ideare la creatività e progettare l’allestimento di una mostra fotografica celebrativa.",
        "Il team creativo di Nebbia ha scelto di superare l’impostazione tradizionale, ripensando completamente il progetto espositivo: non una semplice raccolta di immagini, ma un vero e proprio percorso museale ed esperienziale.",
        "La mostra è stata così strutturata come un viaggio attraverso le principali categorie industriali del territorio, in cui fotografia, installazioni e contenuti interattivi dialogano tra loro per raccontare non solo la storia delle imprese, ma anche i valori, le trasformazioni e l’identità di un intero sistema produttivo.",
      ]),
      section("LE INSTALLAZIONI", [
        "Fin dall’ingresso, il visitatore è accolto da un video immersivo che,introduce al racconto e ne definisce il tono.\nAl centro della prima sala, un coil d acciaio diventa superficie viva su cui scorrono parole e concetti legati all’industria, dialogando con un pavimento LED che ne amplifica l’impatto visivo.\nUna serie di corner tematici invita il visitatore a interagire direttamente con i contenuti: dallo spazio dedicato alla cosmesi, dove il pubblico è coinvolto in un gesto personale e collettivo davanti allo specchio, fino al corner vintage che raccoglie spot iconici e cartelloni pubblicitari degli anni ’50 e ’60, restituendo l’immaginario e l’evoluzione della comunicazione industriale.",
        "Completano il percorso installazioni più materiche e narrative, come il terrario dedicato alla terra rossa – simbolo di economia circolare – un corner ispirato alla trasformazione della plastica, fotografie storiche e una stanza dedicata alla visione dei contenuti video prodotti dall’Associazione nel corso degli ultimi anni.",
        "Un insieme di elementi pensati per alternare racconto, interazione ed emozione, rendendo la visita coinvolgente e memorabile.",
      ]),
      section("LA STORIA", [
        "L’ultima parte del percorso è dedicata al racconto delle persone che, attraverso la presidenza, hanno contribuito in modo determinante alla crescita e allo sviluppo dell’Associazione e del territorio.",
        "Attraverso una selezione di materiali d’archivio, ritratti e contenuti istituzionali, questa sezione restituisce il valore delle figure che hanno guidato l’Associazione nel corso degli anni, offrendo uno sguardo più umano e storico sul sistema industriale locale.",
        "Per accompagnare questo racconto, sono stati progettati pannelli espositivi ad hoc, pensati per costruire un percorso chiaro e coerente, capace di guidare il visitatore lungo una narrazione ordinata e al tempo stesso coinvolgente.",
      ]),
      section("COORDINAMENTO", [
        "Il progetto è stato sviluppato attraverso un lavoro di coordinamento continuo tra creatività, produzione e contenuti. Nebbia ha affiancato il cliente nella raccolta dei materiali dalle aziende, nella definizione del percorso e nella messa a terra delle installazioni, coordinando al tempo stesso le diverse realtà coinvolte nella realizzazione della mostra.",
        "Un’attività complessa, che ha richiesto la gestione di interlocutori differenti – dalle aziende ai fornitori tecnici – trasformando un patrimonio eterogeneo di immagini, contributi e competenze in un racconto coerente e strutturato.",
      ]),
    ],
    credits: [
      credit("Creative Director", "FILIPPO MONDINI"),
      credit("Art Director", "DAVIDE UBERTI"),
      credit("Graphic Designer", "YURI DALLA NOCE"),
      credit("Motion Designer", "LUIGI RUBENS CRISPINO", "FEDERICO UBERTI", "FABRIZIO VENOSA"),
      credit("Editor", "STEFANO MUCHETTI"),
      credit("Video Report Evento", "STEFANO MUCHETTI"),
      credit("Partner Allestimento", "MASCARINI ANTICHITÀ"),
      credit("Partner Tecnici", "GIOCHI DI LUCE", "SERIART"),
    ],
  },
  "sellago": {
    services: "App Mobile / Branding",
    year: "2023 – in corso",
    client: "Confcommercio Cremona",
    challenge: "Realizzare una mobile app per promuovere il cicloturismo nel territorio cremonese",
    sections: [
      section("IL PROGETTO", [
        "Confcommercio Cremona ha incaricato Nebbia di sviluppare un’applicazione mobile dedicata alla promozione del territorio, con un focus specifico sul cicloturismo. L’obiettivo principale del progetto è stato quello di valorizzare le eccellenze paesaggistiche, culturali e gastronomiche della provincia, presentandola come una destinazione ideale per gli amanti delle due ruote.",
        "L’app permette agli utenti di scoprire percorsi ciclabili unici, accompagnati da informazioni utili e approfondimenti sulle tappe principali, incluse attrazioni turistiche, luoghi di interesse storico-culturale e punti di ristoro.\nL’app si propone non solo come una guida pratica per chi già pratica il cicloturismo, ma anche come uno strumento per ispirare nuovi visitatori a esplorare il territorio in modo sostenibile e attivo.",
      ]),
      section("APPROCCIO METODOLOGICO", [
        "Nebbia ha scelto un approccio “product oriented” per questo progetto, collaborando con il cliente per sviluppare il miglior prodotto possibile a partire dalle caratteristiche inizialmente definite e desiderate.",
        "Il lavoro è iniziato con un’analisi approfondita del target di riferimento, indispensabile per costruire una value proposition chiara e coerente. Questo ha permesso di delineare una strategia solida e di identificare le north star metric più adeguate, ovvero quegli indicatori chiave che avrebbero guidato le scelte progettuali e misurato il successo del prodotto nel tempo.",
      ]),
      section("FAST PROTOTYPING", [
        "Nebbia adotta un approccio fast prototyping creando rapidamente prototipi funzionali e iterativi per testare idee, raccogliere feedback e apportare miglioramenti in tempi ridotti.\nQuesto metodo permette di individuare criticità e opportunità fin dalle prime fasi di sviluppo, ottimizzando il processo progettuale e garantendo un prodotto finale più efficace e in linea con le esigenze del cliente e degli utenti.",
      ]),
      section("BRANDING", [
        "Nebbia si è occupata anche della creazione del brand per l’applicazione, curando ogni dettaglio: dal moodboard al naming, dalla progettazione del logo alle declinazioni su merchandising e altri materiali. Questo approccio completo ci ha permesso di immergerci pienamente nel progetto, garantendo una coerenza visiva e strategica che riflette l’essenza del prodotto",
      ]),
    ],
    credits: [
      credit("Product Manager", "DAVIDE UBERTI"),
      credit("UI/UX Designer", "YURI DALLA NOCE", "FEDERICO UBERTI"),
      credit("Developer", "ANDREA GIRELLI", "DIEGO VALORSI"),
    ],
  },
  "cremonese-maglie": {
    services: "Art direction / Branding / Communication / Creative / Photo / Video",
    year: "2022 – 2025",
    client: "US Cremonese",
    challenge: "Creare e comunicare i kit gara",
    sections: [
      section("IL PROGETTO", [
        "In estate c’è un momento atteso con trepidazione da tutti gli appassionati di calcio: la presentazione delle nuove maglie per stagione sportiva in arrivo.\nPer il triennio 2022 – 2025 la US Cremonese si è affidata a Nebbia – in sinergia con lo sponsor tecnico – per creare i kit gara.",
        "Affrontare un progetto di questo tipo ci ha dato l’opportunità di esplorare un ambito che desideravamo approfondire da tempo: il punto d’incontro tra il calcio, la tradizione e lo streetwear.",
      ]),
      section("STAGIONE 2024/ 2025", [
        "Durante l’ultima stagione abbiamo deciso di puntare sulla nostalgia, ispirandoci ai design iconici degli anni ’90 per i kit away e third.",
        "La divisa da trasferta presenta un pattern che richiama le storiche maglie di quel periodo, in particolare una away realizzata da Uhlsport per la Cremonese nella stagione 1992/93.",
        "Per la terza divisa, invece, abbiamo rivisitato un altro design away degli anni ’90, realizzandola in chiave più scura e creando un effetto “gessato”.",
        "La prima maglia si distingue per tre bande rosse su uno sfondo grigio, mantenendo un forte legame con l’identità storica del club. L’aggiunta di una seconda tonalità di grigio crea un effetto di profondità, donando alla divisa un aspetto moderno e dinamico.",
      ]),
      section("LA CAMPAGNA", [
        "Per la campagna online abbiamo scelto volti di persone “comuni” provenienti da tutta la provincia cremonese, rappresentando l’autenticità e l’orgoglio locale. Ogni protagonista è stato ritratto nelle sue attività quotidiane con indossando la maglia della squadra, per sottolineare il legame profondo tra il club e il territorio.",
        "Abbiamo realizzato tre reel e un servizio fotografico per la comunicazione social.",
      ]),
      section("STAGIONE 2023/ 2024", [
        "Per la prima maglia si è scelto un look che strizza l’occhio al baseball americano, cavalcando la tendenza delle maglie da gioco come streetwear.",
        "Il kit da trasferta trae ispirazione da alcune divise storiche della Cremonese degli Anni Ottanta. L’inserimento della mappa di Cremona in tonalità di grigio su bianco conferisce un tocco distintivo e un legame forte con il territorio.",
        "Per la terza divisa, abbiamo optato per un’elegante tonalità di nero. Le maniche e il colletto a polo sono evidenziati con raffinatezza da sottili linee grigiorosse. In questa maglia, il logo della squadra è stato reinterpretato, richiamando il design utilizzato negli Anni Novanta.",
      ]),
      section("LA CAMPAGNA", [
        "Per la campagna di lancio abbiamo adottato un moodboard contemporaneo, portando la maglia da calcio fuori dallo stadio per farla entrare nella vita e nei luoghi quotidiani dei cremonesi.",
        "Sono stati coinvolti sei modelli: tre modelle professioniste, un calciatore della prima squadra, un calciatore della Primavera e una calciatrice Under 19. Le sessioni fotografiche si sono svolte in luoghi emblematici della città, ma con una scelta di location non convenzionale.",
        "Il risultato finale è stato di 30 scatti post-prodotti e tre reel destinati ai social media, uno per ogni maglia.",
      ]),
      section("STAGIONE 2022/ 2023", [
        "La stagione 22/23 è stata un anno memorabile per la Cremonese, segnando il ritorno nella massima serie e celebrando i 120 anni di storia del club. Nebbia ha affiancato la società nella creazione della prima e della seconda maglia, portando un equilibrio tra tradizione e innovazione.",
        "Il kit gara home è stato ispirato alla maglia utilizzata nell’ultima apparizione in Serie A, caratterizzata da una banda rossa orizzontale al centro del petto che integra elegantemente lo sponsor tecnico, conferendo un tocco nostalgico e distintivo. Abbiamo inoltre curato il restyling del logo, utilizzato durante la gara celebrativa del 30° anniversario della storica vittoria a Wembley.",
        "La maglia away è stata concepita come un tributo alle origini della US Cremonese, riproponendo i colori bianco e lilla, simbolo delle prime partite disputate dal club. Un omaggio alla storia, per ricordare da dove tutto ha avuto inizio.",
      ]),
      section("LA CAMPAGNA", [
        "La campagna di presentazione della prima maglia è stata strettamente connessa a quella per il lancio degli abbonamenti. È proprio in questo contesto che la nuova divisa home è stata mostrata per la prima volta, svelata nel finale del video indossata con orgoglio da alcuni tifosi.\nLo slogan scelto per la campagna è stato “Sola mai”, un coro emblematico intonato dalla curva durante l’intera cavalcata verso la storica promozione.",
        "Nebbia ha curato ogni aspetto creativo, realizzando gli scatti fotografici, il video promozionale oltre che il font utilizzato per il claim, catturando l’essenza della passione e dell’identità che legano la squadra alla sua comunità.",
      ]),
    ],
    credits: [
      credit("Creative Director", "FILIPPO MONDINI"),
      credit("Art Director", "FILIPPO ANTONIOLI"),
      credit("Project Manager", "PAOLO BODINI", "DAVIDE UBERTI"),
      credit("Graphic Designer", "YURI DALLA NOCE"),
      credit("Fotografo", "FILIPPO MAFFEI", "MARCO MANTOVANI"),
      credit("Motion Designer", "DAVIDE UBERTI", "LUIGI RUBENS CRISPINO"),
      credit("Videomaker", "STEFANO MUCHETTI", "FABRIZIO VENOSA"),
      credit("Make Up Artist", "VERONICA CIPELLETTI"),
      credit("Stylist", "FILIPPO ANTONIOLI"),
    ],
  },
  "spinagallo": {
    services: "Creative / Graphic Design / Web",
    year: "2022",
    client: "Polenghi Group",
    challenge: "Polenghi Group ha scelto Nebbia per sviluppare il sito web per il loro nuovo marchio Spinagallo. Spinagallo è posizionato come un succo di limone di alta qualità, seguendo la stessa filosofia dei pregiati oli extra vergine",
    sections: [
      section("IL PROGETTO", [
        "Abbiamo intrapreso un percorso creativo partendo dall’antica arte delle maioliche siciliane. Questa tradizione ci ha ispirato nella creazione di un look and feel che va oltre la superficie visiva, ma che cattura anche l’essenza del prodotto e delle sue origini.",
        "Nel contesto della produzione di succo di limone premium di Spinagallo, questo legame con la tradizione artigianale siciliana si traduce in un’estetica che riflette la qualità e l’attenzione artigianale dedicate al prodotto.",
        "L’uso di colori e motivi ispirati alla maiolica contribuisce a creare un connubio tra l’artigianato tradizionale e il gusto moderno, rendendo il prodotto Spinagallo non solo un succo di limone di alta gamma, ma un’autentica esperienza che celebra la cultura e la natura siciliana.",
      ]),
      section("LE ANIMAZIONI", [
        "Un pilastro centrale del sito è l’animazione. Attraverso il semplice scroll verticale, l’utente viene accompagnato nella scoperta dei contenuti, mantenendo costante il movimento e l’interazione.",
        "Abbiamo esplorato diverse direttrici di animazione al fine di mantenere un alto livello di coinvolgimento, senza però distogliere l’attenzione dal contenuto.",
      ]),
    ],
    credits: [
      credit("UI/UX Designer", "YURI DALLA NOCE"),
      credit("Developer", "TEODOR DAN PISLARIU"),
      credit("Project Manager", "FILIPPO MONDINI"),
      credit("Copywriter", "PAOLO BODINI"),
    ],
  },
  "jmg-ar": {
    services: "3D / A/R / Web",
    year: "2021 – in corso",
    client: "JMG Cranes",
    challenge: "Ottimizzare il processo di vendita dei crane attraverso la realtà aumentata per fare percepire più chiaramente ai potenziali clienti i vantaggi legati al prodotto e, al contempo, sottolineare la proiezione di JMG verso l’innovazione",
    sections: [
      section("IL PROGETTO", [
        "JMG ha contattato Nebbia per creare insieme una soluzione che aiutasse le figure commerciali dell’azienda nel processo di vendita.",
        "Serviva una soluzione che facesse in prima battuta comprendere tutti i benefici delle gru elettriche – soprattutto all’interno degli spazi di lavoro – e in secondo luogo a sottolineare il livello di customizzazione; per raggiungere questi obiettivi le brochure non bastavano più.",
        "Abbiamo quindi studiato e realizzato un’applicazione in realtà aumentata per iPad da mettere a disposizione della forza commerciale di JMG.\nA un anno dall’adozione, l’azienda ha ridotto del 100% le brochure e aumentato considerevolmente le vendite.",
      ]),
      section("APPROCCIO METODOLOGICO", [
        "In questo progetto sono stati coinvolti attivamente vari settori di Nebbia. Il reparto grafico ha adottato un approccio di fast-prototyping per la progettazione dell’esperienza utente (UX) e dell’interfaccia utente (UI), lavorando in stretta collaborazione con il team vendite di JMG.",
        "Il focus era su una soluzione intuitiva e user-friendly, adatta sia per i rappresentanti commerciali di JMG che per i loro clienti finali.",
        "L’identità aziendale doveva essere evidente, ma era anche necessario evidenziare attraverso l’UI l’impegno dell’azienda verso l’innovazione. Con queste premesse sono state create nuove icone per riflettere questa tendenza.",
        "I nostri 3D specialist hanno collaborato strettamente con il reparto tecnico di JMG, analizzando e approfondendo la comprensione delle gru elettriche. Dopo una serie di test iniziali, è stato messo a punto un flusso di lavoro per il perfezionamento dei modelli 3D: un processo agile e collaudato che ha consentito di integrare rapidamente una varietà di gru e le relative varianti.",
      ]),
      section("PROGRAMMAZIONE", [
        "In questo processo sono stati da subito coinvolti anche gli sviluppatori, per garantire che le scelte progettuali non fossero in conflitto con la messa in pratica dell’applicazione.\nUna volta esportati i modelli con relative texture e schede tecniche, gli sviluppatori li hanno inseriti nell’applicativo creato da Nebbia attraverso Unity.",
      ]),
    ],
    credits: [
      credit("3D Artist", "YURI DALLA NOCE", "LUIGI RUBENS CRISPINO"),
      credit("UI/UX Designer", "YURI DALLA NOCE"),
      credit("Product Manager", "DAVIDE UBERTI"),
      credit("Developer", "TEODOR DAN PISLARIIU"),
    ],
  },
  "pro-cremona": {
    services: "A/R / Branding / Communication / Creative / Graphic Design / Merch / Photo / Social / Video / VR / Web",
    year: "2015 – in corso",
    client: "Nebbia – interno",
    challenge: "Creare un city brand per Cremona, che comunichi in modo moderno ed innovativo la storia e la cultura della città",
    sections: [
      section("IL PROGETTO", [
        "Pro Cremona è un’entità multifaceted: un profilo social, una linea di merchandising dedicata a Cremona, esperienze culturali immersive, un drone che narra le storie del territorio, e un’incursione nella realtà virtuale che trasporta gli utenti nell’antica Roma.",
        "È il laboratorio phygital di Nebbia, dove si danno vita a idee innovative sia nel mondo digitale che al di fuori, con l’obiettivo di valorizzare il nostro straordinario territorio.",
        "Pro Cremona rappresenta il cuore pulsante di Nebbia, con una missione inequivocabile: diventare il city brand che identifica la città di Cremona e il suo territorio in modo unico e coinvolgente.",
      ]),
      section("MERCH", [
        "A partire dal 2022, Pro Cremona ha inaugurato il suo negozio online, offrendo una vasta gamma di prodotti tra cui t-shirt, tazze, poster di design, giochi da tavolo, e persino teli per il mare.",
        "Ogni articolo è stato creato internamente da Nebbia, riflettendo il nostro design unico e distintivo.",
        "Scegliendo i nostri prodotti non stai solo comprando un oggetto, ma ci stai aiutando a raccontare il nostro territorio, le nostre tradizioni, la nostra storia e il linguaggio che i nostri nonni ci hanno trasmesso.",
      ]),
      section("EL GIÓOCH", [
        "Alla fine del 2022, un momento di grande risonanza è stato il debutto di “El Gióoch”, un gioco da tavolo ispirato alla città di Cremona, ideato e realizzato da Nebbia.",
        "Il lancio è stato orchestrato attraverso una strategia di guerrilla marketing, che ha suscitato interesse non solo nei media locali, ma anche in quelli delle aree circostanti.",
        "Grazie anche alla produzione di contenuti ad hoc sui social media, “El Gióoch” ha registrato la vendita di oltre 1.000 copie nel periodo compreso tra novembre e dicembre.",
      ]),
      section("ESPERIENZE", [
        "Un pilastro cruciale della missione di Pro Cremona è la promozione del turismo. All’interno del nostro e-commerce offriamo anche la possibilità di acquistare esperienze culturali.",
        "Collaboriamo con enti locali e associazioni per creare tour ed esperienze autentiche, che promuoviamo attraverso i nostri canali social e tramite contenuti multimediali coinvolgenti. Grazie all’e-commerce gestiamo quindi parte dell’incoming turistico della nostra città, attraverso una vetrina che permette di esplorare, prenotare e comprare biglietti di ingresso a musei e tour personalizzati.",
      ]),
      section("SOCIAL", [
        "L’importanza della comunicazione attraverso i social media è ormai scontata.",
        "Sin dall’inizio, Pro Cremona ha compreso il potenziale di queste piattaforme per promuovere le proprie attività e l’incantevole territorio di Cremona. Fin dal 2015, con la pubblicazione su piattaforme come YouTube e Facebook dei primi video realizzati con un drone, abbiamo anticipato l’importanza di una presenza online dinamica ed efficace.",
        "Nel corso degli anni abbiamo continuato a evolvere la nostra strategia, abbracciando nuovi formati come le rubriche settimanali su Instagram, che ci hanno permesso di mantenere un contatto costante con la nostra audience.\nAd oggi i nostri social vantano più di 23.000 follower, tutti ottenuti organicamente.",
      ]),
      section("DOMUS", [
        "Nel Museo Archeologico di San Lorenzo a Cremona, sono esposti i resti eccezionalmente ben conservati del sito di scavo di piazza Marconi, in centro città.\nNel 2017 è stato lanciato un progetto per rendere maggiormente fruibili questi reperti attraverso strumenti multimediali. Nebbia ha sviluppato un’applicazione di Realtà Virtuale che consente di esplorare le stanze chiave di una domus romana e di muoversi attraverso gli ambienti semplicemente dirigendo lo sguardo nella direzione desiderata.",
        "Questa esperienza trasporta virtualmente gli utenti nell’antica età romana, consentendo di immergersi in oggetti, ambienti e illuminazioni progettate da artisti 3D con la supervisione costante degli archeologi che hanno lavorato agli scavi.",
        "Nel 2019 l’applicazione ha vinto il prestigioso premio “Zeus” nella categoria “Innovazione e Tecnologia”.",
      ]),
      section("AUDIZIONE A CREMONA", [
        "Nella fase iniziale della pandemia di Covid-19, il nostro territorio è stato duramente colpito.",
        "Con un sincero desiderio di donare un po’ di conforto alla comunità, Pro Cremona ha orchestrato una serie di concerti unici, immortalati in una collezione di video intitolata “Audizione a Cremona”.",
        "La violinista Lena Yokoyama ha trascinato gli spettatori in un viaggio musicale attraverso brani celebri, spaziando da Morricone a Vivaldi, mentre le maestose ambientazioni cremonesi facevano da sfondo.",
        "Il video dell’audizione sul tetto dell’Ospedale Maggiore di Cremona, organizzato per tutto il personale sanitario, ha ottenuto più di 1 milione di views ed è stato riportato dai maggiori media nazionali.",
      ]),
    ],
  },
  "festival-monteverdi": {
    services: "Art direction / Branding / Communication / Motion Graphic",
    year: "2023",
    client: "Teatro Amilcare Ponchielli",
    challenge: "Portare il Festival Monteverdi dal Teatro Ponchielli alla città, per creare uno scambio culturale bidirezionale tra il teatro e i cittadini",
    sections: [
      section("IL PROGETTO", [
        "L’esigenza della sovrintendenza del Teatro Ponchielli era quella di allargare il raggio d’azione del festival per rendere l’intera città parte dell’evento, valicando i confini del teatro.Siamo partiti dall’ideazione della campagna di comunicazione.",
        "Insieme al teatro si è scelto un approccio provocatorio rispetto ai canoni della comunicazione operistica. Abbiamo realizzato grafiche semplici e di impatto per le affissioni a Cremona e nelle città vicine, con particolare attenzione a città “musicali”.",
        "Il concept mirava a sottolineare quanto il “Divin Claudio” sia stato fondamentale per tutta l’opera lirica e gli autori successivi, e quando dovrebbe esserlo per il turismo cremonese.",
      ]),
      section("SOCIAL", [
        "Per la strategia sui social, abbiamo adottato un linguaggio “memetico”. Attraverso caroselli grafici abbiamo utilizzato immagini di Monteverdi e di altri importanti autori d’opera successivi, accompagnandole con frasi tratte da meme legate alla paternità.\nQuesto approccio mirava a sottolineare l’importante ruolo che Monteverdi ha svolto come “padre” nella musica, in particolare nel mondo dell’opera.",
      ]),
      section("MAPPING", [
        "Nel cuore di Cremona, accanto alla suggestiva Piazza del Comune, è stato proiettato per 15 serate consecutive un contenuto audiovisivo che ripercorreva le fasi salienti della vita di Monteverdi.",
        "Ispirato dal concetto del viaggio, questo visual ha dato vita – animandole – a opere d’arte connesse alla vita e alle creazioni di Monteverdi, alcune delle quali risalenti agli anni in cui il compositore era in vita. Nebbia ha condotto un’attenta ricerca presso la biblioteca pubblica e l’Archivio di Stato, al fine di recuperare, digitalizzare e animare documenti e stampe legati alla carriera e alla vita del musicista.",
        "Attraverso questa proiezione, come desiderato dalla sovrintendenza, Monteverdi è stato portato dentro la città, creando un coinvolgimento unico.",
      ]),
    ],
    credits: [
      credit("Creative Director", "ANDREA CIGNI"),
      credit("Campaign Art Director", "FILIPPO ANTONIOLI"),
      credit("Campaign Graphic Designer", "FILIPPO ANTONIOLI"),
      credit("Project Manager", "DAVIDE UBERTI"),
      credit("Copywriter", "PAOLO BODINI"),
      credit("Visual Art Direction", "DAVIDE VIOLA", "DAVIDE UBERTI"),
      credit("Motion Graphic", "DAVIDE VIOLA"),
      credit("Ricerca Fonti Visive", "DAVIDE VIOLA", "DAVIDE UBERTI"),
      credit("Graphic Designer", "LUIGI RUBENS CRISPINO", "FABRIZIO VENOSA"),
      credit("Ricerca Fonti Audio", "LORENZO DEL PECCHIA", "ANDREA NOCERINO"),
      credit("Testi", "GERARDO PALOSCHI"),
      credit("Montaggio Audio", "FABIO GUARNERI", "LORENZO DEL PECCHIA"),
      credit("Partner Tecnico", "GIOCHI DI LUCE"),
      credit("Content Creation", "VIOLA SAMARINI"),
    ],
  },
  "mina-virtual-traveler": {
    services: "3D / Social",
    year: "2023 – in corso",
    client: "Ricerca e Sviluppo",
    challenge: "Creare una virtual influencer",
    sections: [
      section("IL PROGETTO", [
        "Nel corso del 2022 si è sviluppato un trend social che a Nebbia abbiamo trovato interessante: quello dei virtual influencer.",
        "Influencer interamente creati in CGI, che permettono una forte personalizzazione e offrono possibilità creative illimitate, con evidenti risvolti positivi anche rispetto a branded content.",
        "Inoltre, la “capacità” di questi creator di potersi muovere tra il modo reale e i metaversi ha stuzzicato l’interesse del reparto creativo di Nebbia.",
      ]),
      section("SPERIMENTAZIONE", [
        "Mina, il profilo virtuale creato da Nebbia, è una travel blogger a 360 gradi: si sposta infatti in tutto il mondo conosciuto, ma anche in quello ancora inesplorato.",
        "Mina è infatti in grado di entrare nel metaverso, un mondo che ancora stiamo cercando di capire, ma che offre possibilità intriganti.Abbiamo innanzitutto studiato un background del personaggio: caratteristiche fisiche, caratteriali, interessi, amori; tutto quello che serviva al team grafico per poter plasmare l’aspetto di Mina.",
        "Mina ci permette di sperimentare e affinare costantemente le nostre skill nella creazione di asset 3D, la loro animazione e il compositing.\nIl profilo di Mina ci ha dato modo di scoprire nuovi motori di render e di approcciarci a metodologie di animazione come Metahuman.",
        "L’attività e le pubblicazioni sul profilo Instagram di Mina hanno attirato l’attenzione anche di brand come Volkwagen, con cui abbiamo avviato progetti di collaborazione, trattando Mina come una vera e propria creator per contenuti brandizzati.",
      ]),
      section("INFO GENERALI", [
        "Nome: Mina\nCognome: Pixelheart\nLuogo e data di nascita: 21.10.1997, Cremona (CR)\nSesso: F\nStatura: 1,64\nCapelli: argento\nOcchi: castani\nTatuaggi: si\nEtnia: mista\nStato: single\nInteressi: viaggi, natura, tech, tennis",
      ]),
    ],
    credits: [
      credit("Art Director", "DAVIDE UBERTI"),
      credit("Graphic Designer", "YURI DALLA NOCE"),
      credit("Project Manager", "PAOLO BODINI"),
      credit("3D Artist", "LUIGI RUBENS CRISPINO", "LUCA CATTANEO", "FILIPPO GHISLERI"),
      credit("Content Creator", "VIOLA SAMARINI"),
    ],
  },
  "c2-corporate": {
    services: "Branding / Creative / Video",
    year: "2022",
    client: "C2 Corporate",
    challenge: "Corporate identity",
    sections: [
      section("IL PROGETTO", [
        "C2 Corporate si è rivolta a Nebbia per la creazione di un brandbook completo, per regolare la comunicazione interna offline e crearne una ex novo per le attività online.",
        "Nebbia ha sviluppato un’identità visiva per la comunicazione online con uno stile moderno e hi-tech, con l’obiettivo di trasmettere il valore di un brand solido e trasparente verso i suoi clienti.",
        "Come punto di partenza ci siamo ispirati agli annunci pubblicitari dell’industria automobilistica.\nL’automobile che viene guidata lungo un percorso idealmente semplice rappresenta il cliente indirizzato verso la soluzione migliore.",
        "Dopo un’attenta ricerca, abbiamo selezionato immagini e creato rendering 3D astratti che richiamano i riflessi di componenti metallici di un’auto di un server, simili a chip di un monitor.",
      ]),
      section("IL VIDEO", [
        "L’obiettivo era presentare l’azienda sia dal punto di vista corporate, sia sotto l’aspetto umano e sociale, evidenziando la sicurezza e la stabilità dell’hardware e incorporando competenze soft e hard dello staff.",
        "Partendo dal payoff “informatica a valore” di C2 Corporate, abbiamo sviluppato il testo per il voice over.\nIl video alterna frammenti degli uffici e dei membri del team C2, in cui le sequenze negli uffici sono caratterizzate da toni chiari e freddi, con un’illuminazione intensa. Al contrario, le sequenze con il tecnico sono più scure, con illuminazione a taglio e close up.",
      ]),
    ],
    credits: [
      credit("Graphic Designer", "YURI DALLA NOCE"),
      credit("Project Manager", "DAVIDE UBERTI"),
      credit("Art Director", "DAVIDE UBERTI", "LUIGI RUBENS CRISPINO"),
      credit("Copywriter", "TOMMASO ANGIOLINI"),
      credit("Storyboard", "FRANCESCA FOLLINI"),
      credit("Video Director", "FABRIZIO VENOSA"),
      credit("Camera", "FABRIZIO VENOSA"),
      credit("Camera Assistant", "ANDREA POLITI"),
      credit("D.O.P.", "MARCO MANTOVANI"),
      credit("Editing e Postproduction", "FABRIZIO VENOSA"),
    ],
  },
};

export const works: Work[] = baseWorks.map((work) => {
  const copy = originalTextBySlug[work.slug];
  const sectionLayouts = projectSectionLayouts[work.slug] ?? [];
  const media = projectMedia[work.slug] ?? [];
  const hero = media[0];
  const preview = media.find((item) => item.type === 'image');

  return {
    ...work,
    ...copy,
    statement: copy.challenge,
    image: preview?.src ?? work.image,
    hero: hero?.src ?? work.hero,
    heroType: hero?.type ?? 'image',
    media: media.slice(1),
    sections: copy.sections.map(({ title, paragraphs }, sectionIndex) => ({
      title,
      paragraphs,
      blocks: sectionLayouts[sectionIndex] ?? [],
    })),
  };
});

export const featuredWorks = works.slice(0, 3);
