export type ProjectSection = { title: string; paragraphs: string[]; media?: string[] };
export type Credit = { role: string; names: string[] };
export type Work = {
  slug: string;
  title: string;
  services: string;
  image: string;
  hero: string;
  year: string;
  client: string;
  statement: string;
  challenge: string;
  sections: ProjectSection[];
  credits?: Credit[];
};

const home = ['/assets/work-cremonese.png', '/assets/work-martinorossi.webp', '/assets/work-univet.webp'];
const section = (title: string, paragraphs: string[], media?: string[]): ProjectSection => ({ title, paragraphs, media });
const credit = (role: string, ...names: string[]): Credit => ({ role, names });

export const works: Work[] = [
  {
    slug: 'cremonese-120', title: '120° U.S. Cremonese', services: 'Art direction / Event / Video / Web', image: home[0], hero: '/projects/cremonese-120/hero.png', year: '2023', client: 'US Cremonese',
    statement: 'Un’identità celebrativa che unisce memoria sportiva, città e nuove esperienze digitali.',
    challenge: 'Celebrare i 120 anni dalla fondazione della US Cremonese unendo il passato al presente, la tradizione alla tecnologia',
    sections: [
      section('Il progetto', [
        'L’approccio phygital di Nebbia si è dimostrato in perfetta sintonia con le esigenze della Società. La mostra ha ripercorso la storia della Cremonese attraverso maglie iconiche, trofei e documenti storici, snodandosi tra i diversi ambienti della casa della Cremonese: lo stadio.',
        'Nebbia ha gestito l’art direction di tutti gli aspetti delle celebrazioni, incluse la comunicazione e la creazione di merchandising. L’evento ha portato allo stadio più di 7.000 visitatori in tre giorni.',
      ], ['/projects/cremonese-120/project.png']),
      section('Le teche', [
        'Le teche sono il cuore della mostra. Progettate interamente da Nebbia, uniscono gli elementi di una partita di calcio: le luci dello stadio, il verde del prato e l’acciaio delle porte.',
        'Sono state realizzate due tipologie, una per le maglie e una per i trofei. Le luci impreziosiscono e donano un velo di mistero ai cimeli storici.',
      ], ['/projects/cremonese-120/detail-1.png', '/projects/cremonese-120/detail-2.png']),
      section('Il cortometraggio', ['Il breve documentario è stato tra i lavori selezionati al concorso internazionale “SPORT MOVIES & TV 2023”, dedicato ai valori dello sport e dell’Olimpismo attraverso le immagini.'], ['/projects/cremonese-120/detail-3.png']),
      section('Merch', ['A Nebbia è stata affidata la creazione del merchandising celebrativo: t-shirt, felpa, cappellino e sciarpe.', 'Le grafiche combinano tradizione, pulizia e modernità. Il progetto comprende anche uno shop online basato su Shopify, creando una soluzione interamente phygital.']),
    ],
    credits: [credit('Creative Director', 'Filippo Mondini'), credit('Art Director', 'Davide Uberti'), credit('Project Manager', 'Paolo Bodini'), credit('Graphic Designer', 'Filippo Antonioli'), credit('3D Artist', 'Luigi Rubens Crispino', 'Yuri Dalla Noce'), credit('Motion Graphic', 'Stefano Muchetti', 'Davide Uberti'), credit('Regia cortometraggio', 'Stefano Muchetti'), credit('Camera', 'Fabrizio Venosa', 'Andrea Politi'), credit('Web Development', 'Andrea Girelli')],
  },
  {
    slug: 'martinorossi-vr', title: 'MartinoRossi VR Experience', services: 'Branding / Creative / Video', image: home[1], hero: '/projects/martinorossi-vr/hero.webp', year: '2024', client: 'MartinoRossi SpA',
    statement: 'Una narrazione immersiva che porta processi, persone e materia dentro una nuova dimensione.',
    challenge: 'Utilizzare la realtà virtuale per aumentare la brand awareness e presentare l’eccellenza degli spazi e dei processi aziendali in contesti fieristici',
    sections: [
      section('Il progetto', ['MartinoRossi ha scelto Nebbia per sviluppare un’applicazione in realtà virtuale che presenta azienda, processi e attrezzature durante gli eventi fieristici.', 'L’esperienza è semplice, intuitiva e bilingue, capace di comunicare le informazioni essenziali in tempi brevi a una clientela internazionale.'], ['/projects/martinorossi-vr/detail.webp']),
      section('Asset', ['L’esperienza si apre in una serra futuristica 3D, progettata con il cliente per evocare un futuro sostenibile e tecnologico.', 'Un modellino dell’azienda funge da hub: da qui l’utente accede a sette spazi immersivi a 360°, arricchiti da video e infografiche.']),
      section('UI / UX', ['I joystick sono stati sostituiti da un sistema di controllo basato sui movimenti delle mani, rendendo l’interazione immediata e immersiva.', 'L’interfaccia è minimale ed essenziale, in linea con l’identità corporate e curata per bilanciare semplicità e professionalità.']),
    ],
    credits: [credit('3D Artist', 'Luigi Rubens Crispino'), credit('UI/UX Designer', 'Yuri Dalla Noce', 'Federico Uberti'), credit('Product Manager', 'Davide Uberti'), credit('Developer', 'Teodor Dan Pislariu'), credit('Foto e video', 'Stefano Muchetti', 'Fabrizio Venosa'), credit('Supervisor', 'Filippo Mondini')],
  },
  {
    slug: 'univet-casco-laser', title: 'Univet Casco Laser', services: 'Video', image: home[2], hero: '/projects/univet-casco-laser/hero.png', year: '2024', client: 'Univet',
    statement: 'Tecnologia e design si incontrano in un racconto visivo essenziale, preciso e materico.', challenge: 'Creare contenuti visivi per il casco laser Univet',
    sections: [
      section('Il progetto', ['Univet si è affidata a Nebbia per una serie di video dedicati alla gamma di caschi laser: tutorial, presentazione prodotto, specifiche tecniche e confronto con i concorrenti.', 'Una regia semplificata direttamente in loco ha massimizzato l’efficienza e garantito tutti i contenuti in un unico ciclo produttivo.'], ['/projects/univet-casco-laser/project.webp']),
      section('Produzione', ['Un linguaggio pulito, fondali tecnici e una fotografia precisa mettono al centro la tecnologia senza perdere il carattere umano del prodotto.'], ['/projects/univet-casco-laser/detail-1.webp', '/projects/univet-casco-laser/detail-2.webp', '/projects/univet-casco-laser/detail-3.png']),
    ],
    credits: [credit('Project Manager', 'Paolo Bodini'), credit('Video Director', 'Fabrizio Venosa'), credit('Camera', 'Stefano Muchetti', 'Simone Maglia'), credit('Editing e postproduzione', 'Stefano Muchetti')],
  },
  {
    slug: 'eventi-aic', title: 'Eventi Associazione Industriali Cremona', services: 'Communication / Event / Graphic Design / Video', image: home[1], hero: '/projects/eventi-aic/hero.webp', year: '2025', client: 'Associazione Industriali Cremona',
    statement: 'Un sistema di comunicazione coordinato per trasformare ogni evento in un’esperienza riconoscibile.', challenge: 'Gestione dei contenuti multimediali',
    sections: [
      section('Il progetto', ['L’Associazione Industriali si è rivolta a Nebbia per supportarla nella creazione dei contenuti visivi destinati ai propri eventi istituzionali.', 'Video, grafiche e materiali definiscono un linguaggio coerente; la regia live coordina contenuti, tempi e flussi narrativi tra palco e schermo.', 'Gestione degli ospiti, riprese live e contenuti social in tempo reale amplificano la visibilità degli eventi anche al di fuori della sala.'], ['/projects/eventi-aic/detail-1.webp', '/projects/eventi-aic/detail-2.webp']),
      section('Piattaforma', ['La piattaforma proprietaria ELS trasmette le dirette in modo strutturato e professionale, rendendo gli eventi accessibili anche da remoto.', 'ELS gestisce inviti e registrazioni prima e durante l’evento, garantendo controllo dei flussi e un’esperienza semplice e integrata.'], ['/projects/eventi-aic/detail-3.webp', '/projects/eventi-aic/detail-4.webp']),
    ],
  },
  {
    slug: 'idee-mani-tempo', title: 'Le idee, le mani, il tempo', services: 'Art direction / Event / Graphic Design / Video', image: home[0], hero: '/projects/idee-mani-tempo/hero.webp', year: '2025', client: 'Associazione Industriali Cremona',
    statement: 'Un progetto culturale che rende visibili le relazioni tra creatività, saper fare e territorio.', challenge: 'Realizzare un’esposizione per gli 80 anni dell’Associazione Industriali di Cremona',
    sections: [
      section('Il progetto', ['Per gli 80 anni dell’Associazione, Nebbia ha ideato la creatività e progettato l’allestimento di una mostra fotografica celebrativa.', 'Non una semplice raccolta di immagini, ma un percorso museale ed esperienziale attraverso le principali categorie industriali del territorio.'], ['/projects/idee-mani-tempo/detail-1.webp']),
      section('Le installazioni', ['Un video immersivo introduce il racconto. Un coil d’acciaio diventa superficie viva per parole e concetti, dialogando con un pavimento LED e corner tematici.', 'Installazioni materiche, fotografia storica, economia circolare e contenuti video alternano racconto, interazione ed emozione.'], ['/projects/idee-mani-tempo/detail-2.webp', '/projects/idee-mani-tempo/detail-3.webp']),
      section('La storia', ['Materiali d’archivio e ritratti raccontano le persone che hanno guidato l’Associazione e contribuito alla crescita del territorio.'], ['/projects/idee-mani-tempo/detail-4.webp']),
      section('Coordinamento', ['Nebbia ha coordinato creatività, produzione, aziende e fornitori, trasformando immagini, contributi e competenze in un racconto coerente.']),
    ],
    credits: [credit('Creative Director', 'Filippo Mondini'), credit('Art Director', 'Davide Uberti'), credit('Graphic Designer', 'Yuri Dalla Noce'), credit('Motion Designer', 'Luigi Rubens Crispino', 'Federico Uberti', 'Fabrizio Venosa'), credit('Editor', 'Stefano Muchetti'), credit('Partner tecnici', 'Giochi di Luce', 'Seriart')],
  },
  {
    slug: 'sellago', title: 'SellaGO', services: 'App Mobile / Branding', image: home[2], hero: '/projects/sellago/hero.jpg', year: '2023 – in corso', client: 'Confcommercio Cremona',
    statement: 'Brand e prodotto digitale costruiti insieme per rendere semplice una nuova esperienza di mobilità.', challenge: 'Realizzare una mobile app per promuovere il cicloturismo nel territorio cremonese',
    sections: [
      section('Il progetto', ['Confcommercio Cremona ha incaricato Nebbia di sviluppare un’app per valorizzare paesaggio, cultura e gastronomia della provincia attraverso il cicloturismo.', 'L’app racconta percorsi, attrazioni, luoghi storico-culturali e punti di ristoro: una guida pratica e uno strumento d’ispirazione.'], ['/projects/sellago/detail-1.webp']),
      section('Approccio metodologico', ['Un approccio product oriented parte dall’analisi del target e dalla definizione della value proposition.', 'Le north star metric guidano le scelte progettuali e misurano il successo del prodotto nel tempo.'], ['/projects/sellago/detail-2.webp']),
      section('Fast prototyping', ['Prototipi funzionali e iterativi permettono di testare idee, raccogliere feedback e individuare criticità fin dalle prime fasi.']),
      section('Branding', ['Dal moodboard al naming, dal logo al merchandising, il brand è sviluppato insieme al prodotto per garantire coerenza visiva e strategica.']),
    ],
    credits: [credit('Product Manager', 'Davide Uberti'), credit('UI/UX Designer', 'Yuri Dalla Noce', 'Federico Uberti'), credit('Developer', 'Andrea Girelli', 'Diego Valorsi')],
  },
  {
    slug: 'cremonese-maglie', title: 'Cremonese Maglie', services: 'Art direction / Branding / Communication / Creative / Photo / Video', image: home[0], hero: '/projects/cremonese-maglie/hero.webp', year: '2022 – 2025', client: 'US Cremonese',
    statement: 'Le maglie diventano un dispositivo narrativo tra storia del club e cultura contemporanea.', challenge: 'Creare e comunicare i kit gara',
    sections: [
      section('Il progetto', ['Per il triennio 2022–2025 la US Cremonese si è affidata a Nebbia, in sinergia con lo sponsor tecnico, per creare i kit gara.', 'Il progetto esplora il punto d’incontro tra calcio, tradizione e streetwear.'], ['/projects/cremonese-maglie/project.png']),
      section('Stagione 2024 / 2025', ['La stagione punta sulla nostalgia, ispirandosi ai design iconici degli anni Novanta per i kit away e third.', 'La prima maglia mantiene il legame con l’identità storica attraverso tre bande rosse su fondo grigio.'], ['/projects/cremonese-maglie/detail-1.webp']),
      section('La campagna', ['Volti di persone comuni provenienti dalla provincia raccontano autenticità e orgoglio locale, indossando la maglia nelle proprie attività quotidiane.'], ['/projects/cremonese-maglie/detail-2.webp']),
      section('Stagioni 2022 / 2024', ['Le collezioni precedenti reinterpretano divise storiche degli anni Ottanta e Novanta, portando la maglia fuori dallo stadio e nella vita quotidiana.', 'Foto, reel e video uniscono il ritorno in Serie A, il 120° anniversario e l’identità della comunità.'], ['/projects/cremonese-maglie/detail-3.webp']),
    ],
    credits: [credit('Creative Director', 'Filippo Mondini'), credit('Art Director', 'Filippo Antonioli'), credit('Project Manager', 'Paolo Bodini', 'Davide Uberti'), credit('Graphic Designer', 'Yuri Dalla Noce'), credit('Fotografo', 'Filippo Maffei', 'Marco Mantovani'), credit('Videomaker', 'Stefano Muchetti', 'Fabrizio Venosa'), credit('Stylist', 'Filippo Antonioli')],
  },
  {
    slug: 'spinagallo', title: 'Spinagallo Website', services: 'Creative / Graphic Design / Web', image: home[1], hero: '/projects/spinagallo/hero.webp', year: '2022', client: 'Polenghi Group',
    statement: 'Un’esperienza editoriale digitale capace di raccontare un prodotto attraverso ritmo, immagini e tradizione.', challenge: 'Sviluppare il sito web di Spinagallo, succo di limone di alta qualità ispirato alla filosofia dei pregiati oli extra vergine',
    sections: [
      section('Il progetto', ['Il percorso creativo parte dall’antica arte delle maioliche siciliane: un look and feel che cattura l’essenza del prodotto e delle sue origini.', 'Colori e motivi costruiscono un connubio tra artigianato tradizionale e gusto moderno, celebrando cultura e natura siciliana.'], ['/projects/spinagallo/detail.webp']),
      section('Le animazioni', ['L’animazione è un pilastro del sito. Lo scroll verticale accompagna l’utente nella scoperta dei contenuti mantenendo costanti movimento e interazione.', 'Diverse direttrici di movimento mantengono alto il coinvolgimento senza distogliere l’attenzione dal contenuto.']),
    ],
    credits: [credit('UI/UX Designer', 'Yuri Dalla Noce'), credit('Developer', 'Teodor Dan Pislariu'), credit('Project Manager', 'Filippo Mondini'), credit('Copywriter', 'Paolo Bodini')],
  },
  {
    slug: 'jmg-ar', title: 'JMG – Configuratore A/R', services: '3D / A/R / Web', image: home[2], hero: '/projects/jmg-ar/hero.webp', year: '2021 – in corso', client: 'JMG Cranes',
    statement: 'Un configuratore aumentato che rende ogni scelta tangibile prima ancora della produzione.', challenge: 'Ottimizzare il processo di vendita dei crane attraverso la realtà aumentata e sottolineare la proiezione di JMG verso l’innovazione',
    sections: [
      section('Il progetto', ['JMG ha contattato Nebbia per creare una soluzione che aiutasse la forza commerciale a raccontare benefici e personalizzazione delle gru elettriche.', 'È nata un’applicazione AR per iPad. A un anno dall’adozione, l’azienda ha eliminato le brochure e aumentato considerevolmente le vendite.'], ['/projects/jmg-ar/project.png']),
      section('Approccio metodologico', ['Il fast prototyping di UX e UI, svolto insieme al team vendite, ha dato forma a una soluzione intuitiva e user-friendly.', 'I 3D specialist hanno definito un flusso agile per perfezionare e integrare modelli, varianti e schede tecniche.'], ['/projects/jmg-ar/wireframe.gif', '/projects/jmg-ar/icons.png']),
      section('Programmazione', ['Gli sviluppatori sono stati coinvolti fin dall’inizio per garantire coerenza tra le scelte progettuali e l’applicazione finale realizzata in Unity.']),
    ],
    credits: [credit('3D Artist', 'Yuri Dalla Noce', 'Luigi Rubens Crispino'), credit('UI/UX Designer', 'Yuri Dalla Noce'), credit('Product Manager', 'Davide Uberti'), credit('Developer', 'Teodor Dan Pislariu')],
  },
  {
    slug: 'pro-cremona', title: 'Pro Cremona', services: 'A/R / Branding / Communication / Creative / Graphic Design / Merch / Photo / Social / Video / VR / Web', image: home[0], hero: '/projects/pro-cremona/hero.png', year: '2015 – in corso', client: 'Nebbia — progetto interno',
    statement: 'Un ecosistema di identità e contenuti per attivare comunità, luoghi e nuove possibilità.', challenge: 'Creare un city brand per Cremona che comunichi in modo moderno e innovativo la storia e la cultura della città',
    sections: [
      section('Il progetto', ['Pro Cremona nasce come city brand e laboratorio permanente per raccontare la città con un linguaggio contemporaneo.', 'Identità, contenuti, prodotti ed esperienze connettono cultura locale, turismo e comunità in un unico ecosistema.'], ['/projects/pro-cremona/detail-1.webp']),
      section('Merch', ['Il merchandising traduce simboli, parole e immaginario cremonese in oggetti contemporanei, portando l’identità della città nella vita quotidiana.'], ['/projects/pro-cremona/detail-2.jpg']),
      section('El Gióoch', ['Un gioco da tavolo dedicato a Cremona ha trasformato luoghi e riferimenti locali in un racconto partecipato, superando le 1.000 copie vendute nei primi due mesi.'], ['/projects/pro-cremona/detail-3.webp']),
      section('Esperienze e social', ['Tour e iniziative culturali promossi attraverso l’e-commerce rendono Pro Cremona una vetrina per l’incoming turistico.', 'Una strategia social attiva dal 2015 racconta il territorio con video, rubriche e nuovi formati, costruendo una community organica di oltre 23.000 persone.'], ['/projects/pro-cremona/detail-4.jpg']),
      section('Domus e Audizione', ['Una esperienza VR permette di esplorare la domus romana conservata al Museo Archeologico di San Lorenzo; il progetto ha vinto il premio Zeus per Innovazione e Tecnologia.', 'Durante la pandemia la serie “Audizione a Cremona” ha portato la violinista Lena Yokoyama nei luoghi simbolo della città. Il concerto sul tetto dell’Ospedale Maggiore ha superato un milione di visualizzazioni.']),
    ],
  },
  {
    slug: 'festival-monteverdi', title: 'Festival Monteverdi', services: 'Art direction / Branding / Communication / Motion Graphic', image: home[1], hero: '/projects/festival-monteverdi/hero.webp', year: '2023', client: 'Teatro Amilcare Ponchielli',
    statement: 'Un linguaggio visivo dinamico che porta la musica fuori dal tempo e dentro la città.', challenge: 'Portare il Festival Monteverdi dal Teatro Ponchielli alla città, creando uno scambio culturale bidirezionale con i cittadini',
    sections: [
      section('Il progetto', ['L’esigenza del Teatro Ponchielli era allargare il raggio d’azione del festival, valicando i confini del teatro. La campagna adotta un approccio provocatorio rispetto ai canoni dell’opera.', 'Grafiche semplici e di impatto sottolineano quanto il Divin Claudio sia stato fondamentale per l’opera lirica e quanto possa esserlo per il turismo cremonese.'], ['/projects/festival-monteverdi/detail-1.webp', '/projects/festival-monteverdi/detail-2.png']),
      section('Social', ['Caroselli dal linguaggio memetico raccontano Monteverdi come padre dell’opera in modo contemporaneo.']),
      section('Mapping', ['Per quindici serate un contenuto audiovisivo ha ripercorso nel cuore di Cremona le fasi salienti della vita di Monteverdi.', 'Opere, documenti e stampe recuperati dalla biblioteca e dall’Archivio di Stato sono stati digitalizzati e animati.'], ['/projects/festival-monteverdi/detail-3.webp', '/projects/festival-monteverdi/detail-4.webp']),
    ],
    credits: [credit('Creative Director', 'Andrea Cigni'), credit('Campaign Art Director', 'Filippo Antonioli'), credit('Project Manager', 'Davide Uberti'), credit('Copywriter', 'Paolo Bodini'), credit('Visual Art Direction', 'Davide Viola', 'Davide Uberti'), credit('Motion Graphic', 'Davide Viola'), credit('Graphic Designer', 'Luigi Rubens Crispino', 'Fabrizio Venosa'), credit('Content Creation', 'Viola Samarini')],
  },
  {
    slug: 'mina-virtual-traveler', title: 'Mina – Virtual Traveler', services: '3D / Social', image: home[2], hero: '/projects/mina-virtual-traveler/hero.webp', year: '2023 – in corso', client: 'Ricerca e Sviluppo',
    statement: 'Un viaggio virtuale costruito attraverso ambienti 3D, immaginazione e presenza digitale.', challenge: 'Creare una virtual influencer',
    sections: [
      section('Il progetto', ['Mina nasce dall’interesse di Nebbia per i virtual influencer: creator generati in CGI, personalizzabili e capaci di muoversi tra mondo reale e metaversi.', 'Il progetto esplora possibilità creative e branded content attraverso un personaggio dotato di identità, interessi e una storia riconoscibile.']),
      section('Sperimentazione', ['Mina è una travel blogger a 360 gradi, libera di spostarsi nel mondo conosciuto e in quello inesplorato. Il suo profilo permette di affinare asset 3D, animazione e compositing.', 'La ricerca ha aperto nuovi motori di rendering e metodologie come Metahuman, attirando collaborazioni con brand internazionali.']),
      section('Info generali', ['Mina Pixelheart — nata il 21.10.1997 a Cremona. Capelli argento, occhi castani. Interessi: viaggi, natura, tecnologia e tennis.']),
    ],
    credits: [credit('Art Director', 'Davide Uberti'), credit('Graphic Designer', 'Yuri Dalla Noce'), credit('Project Manager', 'Paolo Bodini'), credit('3D Artist', 'Luigi Rubens Crispino', 'Luca Cattaneo', 'Filippo Ghisleri'), credit('Content Creator', 'Viola Samarini')],
  },
  {
    slug: 'c2-corporate', title: 'C2 Corporate', services: 'Branding / Creative / Video', image: home[1], hero: '/projects/c2-corporate/hero.webp', year: '2022', client: 'C2 Corporate',
    statement: 'Posizionamento, identità e racconto audiovisivo per dare forma a una visione aziendale.', challenge: 'Corporate identity',
    sections: [
      section('Il progetto', ['C2 Corporate si è rivolta a Nebbia per un brandbook completo, capace di regolare la comunicazione offline e costruire da zero quella online.', 'L’identità ha uno stile moderno e hi-tech, pensato per trasmettere il valore di un brand solido e trasparente.', 'Ispirandosi agli annunci automobilistici, il percorso racconta il cliente guidato verso la soluzione migliore attraverso immagini e rendering 3D astratti.'], ['/projects/c2-corporate/detail.gif']),
      section('Il video', ['Il racconto presenta l’azienda sia dal punto di vista corporate sia da quello umano, bilanciando sicurezza dell’hardware e competenze del team.', 'Partendo dal payoff “informatica a valore”, il video alterna uffici e persone con fotografia chiara e fredda e sequenze tecniche più scure e ravvicinate.']),
    ],
    credits: [credit('Graphic Designer', 'Yuri Dalla Noce'), credit('Project Manager', 'Davide Uberti'), credit('Art Director', 'Davide Uberti', 'Luigi Rubens Crispino'), credit('Copywriter', 'Tommaso Angiolini'), credit('Storyboard', 'Francesca Follini'), credit('Video Director', 'Fabrizio Venosa'), credit('D.O.P.', 'Marco Mantovani'), credit('Editing e postproduction', 'Fabrizio Venosa')],
  },
];

export const featuredWorks = works.slice(0, 3);
export const team = [
  ['Filippo Mondini', 'Founder', '/assets/team-filippo.jpg'],
  ['Paolo Bodini', 'Project Manager', '/assets/team-paolo.jpg'],
  ['Davide Uberti', 'Phygital Product Manager', '/assets/team-davide.jpg'],
  ['Fabrizio Venosa', 'Multimedia Executive Producer', '/assets/team-fabrizio.jpg'],
  ['Andrea Girelli', 'Software Engineer', '/assets/team-andrea.png'],
  ['Stefano Muchetti', 'Videomaker / Director', '/assets/team-stefano.jpg'],
  ['Yuri Dalla Noce', 'UI/UX Designer', '/assets/team-yuri.jpg'],
  ['Luigi Rubens Crispino', '3D Artist', '/assets/team-luigi.jpg'],
] as const;
