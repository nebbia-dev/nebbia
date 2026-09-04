export type Work = {
  slug: string;
  title: string;
  services: string;
  image: string;
  year: string;
  client: string;
  statement: string;
};

const images = ['/assets/work-cremonese.png', '/assets/work-martinorossi.webp', '/assets/work-univet.webp'];

export const works: Work[] = [
  { slug: 'cremonese-120', title: '120° U.S. Cremonese', services: 'Art direction / Event / Video / Web', image: images[0], year: '2023', client: 'U.S. Cremonese', statement: 'Un’identità celebrativa che unisce memoria sportiva, città e nuove esperienze digitali.' },
  { slug: 'martinorossi-vr', title: 'MartinoRossi VR Experience', services: 'Branding / Creative / Video', image: images[1], year: '2025', client: 'MartinoRossi', statement: 'Una narrazione immersiva che porta processi, persone e materia dentro una nuova dimensione.' },
  { slug: 'univet-casco-laser', title: 'Univet Casco Laser', services: 'Video', image: images[2], year: '2025', client: 'Univet', statement: 'Tecnologia e design si incontrano in un racconto visivo essenziale, preciso e materico.' },
  { slug: 'eventi-aic', title: 'Eventi Associazione Industriali Cremona', services: 'Communication / Event / Graphic Design / Video', image: images[1], year: '2024', client: 'AIC', statement: 'Un sistema di comunicazione coordinato per trasformare ogni evento in un’esperienza riconoscibile.' },
  { slug: 'idee-mani-tempo', title: 'Le idee, le mani, il tempo', services: 'Art direction / Event / Graphic Design / Video', image: images[0], year: '2024', client: 'Cremona', statement: 'Un progetto culturale che rende visibili le relazioni tra creatività, saper fare e territorio.' },
  { slug: 'sellago', title: 'SellaGO', services: 'App Mobile / Branding', image: images[2], year: '2024', client: 'SellaGO', statement: 'Brand e prodotto digitale costruiti insieme per rendere semplice una nuova esperienza di mobilità.' },
  { slug: 'cremonese-maglie', title: 'Cremonese Maglie', services: 'Art direction / Branding / Communication / Creative / Photo / Video', image: images[0], year: '2023', client: 'U.S. Cremonese', statement: 'Le maglie diventano un dispositivo narrativo tra storia del club e cultura contemporanea.' },
  { slug: 'spinagallo', title: 'Spinagallo Website', services: 'Creative / Graphic Design / Web', image: images[1], year: '2023', client: 'Spinagallo', statement: 'Un’esperienza editoriale digitale capace di raccontare un luogo attraverso ritmo e immagini.' },
  { slug: 'jmg-ar', title: 'JMG – Configuratore A/R', services: '3D / A/R / Web', image: images[2], year: '2024', client: 'JMG', statement: 'Un configuratore aumentato che rende ogni scelta tangibile prima ancora della produzione.' },
  { slug: 'pro-cremona', title: 'Pro Cremona', services: 'A/R / Branding / Communication / Creative / Graphic Design / Merch / Photo / Social / Video / VR / Web', image: images[0], year: '2023', client: 'Pro Cremona', statement: 'Un ecosistema di identità e contenuti per attivare comunità, luoghi e nuove possibilità.' },
  { slug: 'festival-monteverdi', title: 'Festival Monteverdi', services: 'Art direction / Branding / Communication / Motion Graphic', image: images[1], year: '2023', client: 'Monteverdi Festival', statement: 'Un linguaggio visivo dinamico che porta la musica fuori dal tempo e dentro la città.' },
  { slug: 'mina-virtual-traveler', title: 'Mina – Virtual Traveler', services: '3D / Social', image: images[2], year: '2022', client: 'Mina', statement: 'Un viaggio virtuale costruito attraverso ambienti 3D, immaginazione e presenza digitale.' },
  { slug: 'c2-corporate', title: 'C2 Corporate', services: 'Branding / Creative / Video', image: images[1], year: '2022', client: 'C2', statement: 'Posizionamento, identità e racconto audiovisivo per dare forma a una visione aziendale.' },
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
