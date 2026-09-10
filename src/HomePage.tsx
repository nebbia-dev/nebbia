import { FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { featuredWorks, works } from './data';
import { usePageMeta } from './usePageMeta';
import {Arrow} from "./_components/icons/Arrow";
import { FooterBlur } from './_components/FooterBlur';

const line = 'border-white/30';
const field = `h-[54px] w-full border border-white/30 bg-transparent px-[14px] outline-none placeholder:text-white/65 focus:relative focus:z-10 focus:border-[#ff3700]`;
const footerBackdropBlur = '64px';

type WeatherResponse = {
  condition: string;
  temperature: number;
};

async function getCremonaWeather(): Promise<WeatherResponse> {
  const response = await fetch('/api/weather');
  if (!response.ok) throw new Error('Meteo non disponibile');
  return response.json() as Promise<WeatherResponse>;
}

export function HomePage() {
  const [worksView, setWorksView] = useState<'selected' | 'all'>('selected');
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [sent, setSent] = useState(false);
  const weather = useQuery({
    queryKey: ['weather', 'cremona'],
    queryFn: getCremonaWeather,
    staleTime: 10 * 60 * 1_000,
    refetchInterval: 10 * 60 * 1_000,
  });

  usePageMeta('Nebbia — Phygital Lab', 'Creatività, innovazione e comunicazione tra analogico e digitale.');

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#d9ff36] selection:text-[#1a1a1a] max-sm:pb-[42px]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-[50px] items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <a className="inline-flex items-center" href="#top" aria-label="Nebbia, torna all'inizio">
          <img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" />
        </a>
        <nav className="flex items-center gap-6 text-[13px] max-md:hidden" aria-label="Navigazione principale">
          {['Lavori', 'Contatti'].map((label) => <a className="nav-link" href={`#${label.toLowerCase()}`} key={label}>{label}</a>)}
          <a className="nav-link" href="#lavora-con-noi">Lavora con noi</a>
        </nav>
        <button className="relative hidden h-8 w-[62px] cursor-pointer border-0 bg-transparent md:hidden max-md:block" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu">
          <em className="absolute left-0 top-[8px] text-[9px] not-italic">{menuOpen ? 'CHIUDI' : 'MENU'}</em>
          <span className={`absolute right-0 top-[10px] h-px w-[22px] bg-white transition ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />
          <span className={`absolute right-0 top-[18px] h-px w-[22px] bg-white transition ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
        </button>
      </header>

      <div id="mobile-menu" className={`fixed inset-x-0 bottom-[42px] top-[50px] z-40 flex flex-col justify-between bg-[#1a1a1a] p-[35px_24px] transition duration-300 md:hidden ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}>
        <nav className="flex flex-col" aria-label="Navigazione mobile">
          {[['Lavori', 'lavori'], ['Contatti', 'contatti'], ['Lavora con noi', 'lavora-con-noi']].map(([label, id]) => <a className="text-[clamp(45px,12vw,74px)] leading-[1.05]" href={`#${id}`} onClick={() => setMenuOpen(false)} key={id}>{label}</a>)}
        </nav>
        {/*<p className="m-0 text-xs">IT / EN</p>*/}
      </div>

      <section className="relative mt-[50px] h-[620px] overflow-hidden max-sm:h-[660px]" id="top">
        <img className="absolute inset-0 h-full w-full object-cover" src="/assets/hero.jpg" alt="" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between px-[30px] py-12 text-[clamp(18px,1.58vw,24px)] leading-[1.38] max-sm:px-[18px] max-sm:py-9 max-sm:text-[17px]">
          <p className="m-0 max-w-[92%]"><span className="text-black bg-[#ff3700] p-1">NEBBIA Phygital Lab,</span><br className="max-sm:hidden" /> connessioni e idee che abbattono<br className="max-sm:hidden" /> le barriere tra l’analogico e il digitale.</p>
          <p className="m-0 max-w-[92%] self-end text-right max-sm:max-w-[84%]"><span className="text-black bg-[#ff3700] p-1">NEBBIA® è un laboratorio phygital,</span><br className="max-sm:hidden" /> dove creatività, innovazione e comunicazione<br className="max-sm:hidden" /> convergono per supportare aziende e persone.</p>
          <p className="m-0 max-w-[92%]">La nostra missione è creare una cultura digitale accessibile,<br className="max-sm:hidden" /> semplificando le complessità, introducendo nuove prospettive<br className="max-sm:hidden" /> e spingendo i talenti a esplorare.</p>
        </div>
      </section>

      <section className="scroll-mt-[49px]" id="lavori">
        <div className={`grid h-[50px] grid-cols-2 border-y ${line} uppercase`}>
          {(['selected', 'all'] as const).map((view) => (
            <button key={view} type="button" onClick={() => setWorksView(view)} className={`uppercase cursor-pointer px-[30px] text-left text-[clamp(18px,1.95vw,25px)] font-light transition max-sm:px-[18px] ${view === 'all' ? 'border-l border-white/30' : ''} ${worksView === view ? 'bg-[#ff3700] text-[#1a1a1a]' : 'bg-[#1a1a1a] text-white'}`}>{view === 'selected' ? 'Selected Work' : 'All Works'}</button>
          ))}
        </div>
        {worksView === 'selected' ? (
          <div className="grid h-[572px] grid-cols-3 max-sm:h-auto max-sm:grid-cols-1">
            {featuredWorks.map((work) => (
              <Link className="group relative min-w-0 overflow-hidden border-r border-white/30 last:border-r-0 max-sm:h-[68vh] max-sm:min-h-[420px] max-sm:border-r-0 max-sm:border-b" to="/works/$workSlug" params={{ workSlug: work.slug }} key={work.slug}>
                <img className="h-full w-full object-cover brightness-[.8] saturate-[.78] transition duration-700 group-hover:scale-[1.04] group-hover:brightness-[.92]" src={work.image} alt="" />
                <div className="absolute inset-0 flex flex-col justify-between bg-black/50 transition duration-700 group-hover:bg-[#ff3700]/50 p-[25px_30px_23px] max-sm:p-[21px_18px]">
                  <h2 className="m-0 max-w-[90%] text-[clamp(21px,1.95vw,28px)] font-light leading-[1.08]">{work.title}</h2>
                  <p className="m-auto mb-0 mr-10 text-[13px]">{work.services}</p>
                  <span className="absolute bottom-5 right-6 grid size-[34px] -rotate-12 place-items-center rounded-full border border-white opacity-0 transition group-hover:rotate-0 group-hover:opacity-100 max-sm:right-[18px] max-sm:opacity-100" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-b border-white/30">
            {works.map((work, index) => (
              <Link className="group grid min-h-[56px] grid-cols-[56px_minmax(250px,1.1fr)_minmax(300px,1fr)_34px] items-center border-b border-white/30 px-[30px] transition last:border-b-0 hover:bg-[#ff3700] hover:text-[#1a1a1a] max-sm:min-h-[84px] max-sm:grid-cols-[34px_1fr_24px] max-sm:px-[18px]" to="/works/$workSlug" params={{ workSlug: work.slug }} key={work.slug}>
                <span className="text-[10px] opacity-50">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="m-0 text-[clamp(19px,1.9vw,26px)] font-light leading-[1.05]">{work.title}</h2>
                <p className="m-0 text-xs opacity-70 max-sm:hidden">{work.services}</p>
                <div className="text-2xl transition" aria-hidden="true">
                  <Arrow/>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="scroll-mt-[49px]" id="contatti">
        <SectionTitle title="Contatti" detail="Parliamone" />
        <div className="grid min-h-[760px] grid-cols-2 max-lg:grid-cols-1">
          <aside className="flex min-w-0 flex-col border-r border-white/30 p-[48px_30px_38px] max-lg:min-h-[420px] max-lg:border-b max-lg:border-r-0 max-sm:min-h-[390px] max-sm:px-[18px]">
            <p className="mb-[34px] mt-0 text-[11px] uppercase">Informazioni generali</p>
            <address className="text-[clamp(20px,2.1vw,29px)] font-light not-italic leading-[1.26]">Via dell&apos;Innovazione digitale, 3<br />26100 Cremona, Italia<br />P.I. 01618080194</address>
            <a className="mt-auto break-words text-[clamp(24px,4.3vw,62px)] leading-[.95]" href="mailto:info@nebbialab.it">info@nebbialab.it <sup className="text-[.4em]">↗</sup></a>
          </aside>
          <div className="p-[46px_30px_38px] max-sm:px-[18px]">
            <h3 className="mb-[70px] mt-0 text-[clamp(20px,2vw,27px)] font-light uppercase leading-[1.12] max-lg:mb-[42px]">Hai bisogno di maggiori info?<br />Scrivici!</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 text-black">
                <input className={field} name="nome" placeholder="Nome" aria-label="Nome" required />
                <input className={`${field} border-l-0 max-sm:-mt-px max-sm:border-l`} name="cognome" placeholder="Cognome" aria-label="Cognome" required />
              </div>
              <div className="-mt-px grid grid-cols-2 max-sm:grid-cols-1">
                <input className={field} name="azienda" placeholder="Company" aria-label="Azienda" />
                <input className={`${field} border-l-0 max-sm:-mt-px max-sm:border-l`} name="email" type="email" placeholder="Email" aria-label="Email" required />
              </div>
              <select className={`${field} -mt-px appearance-none`} name="oggetto" aria-label="Scegli l'oggetto">
                <option className="text-[#1a1a1a]">Info Generali</option>
                <option className="text-[#1a1a1a]">Preventivi</option><option className="text-[#1a1a1a]">Partnership</option>
              </select>
              <textarea className={`${field} -mt-px h-[190px] resize-y py-[15px]`} name="messaggio" placeholder="Message" aria-label="Messaggio" required />
              <button className="mt-[7px] flex h-[54px] w-full cursor-pointer items-center justify-between border border-white bg-white px-[15px] uppercase text-[#1a1a1a] transition hover:border-[#ff3700] hover:bg-[#ff3700]" type="submit">Invia <span className="text-xl" aria-hidden="true">↗</span></button>
              {sent && <p className="mt-3 text-[11px] text-[#d9ff36]" role="status">Messaggio acquisito nella demo. Collega qui il tuo servizio email per l’invio reale.</p>}
            </form>
          </div>
        </div>
      </section>

      <section className="scroll-mt-[49px]" id="lavora-con-noi">
        <SectionTitle title="Lavora con noi" detail="Join the fog" />
        <div className="grid min-h-[540px] grid-cols-2 max-lg:grid-cols-1">
          <div className="p-[48px_30px] max-lg:min-h-[430px] max-sm:px-[18px]"><p className="mb-[34px] mt-0 text-[11px] uppercase">Posizioni aperte</p><p className="m-0 text-[clamp(25px,3vw,44px)] leading-[1.08] tracking-[-.045em]">Vuoi far parte del nostro team?<br />Consulta le posizioni aperte<br />e candidati per avere l’opportunità<br />di partecipare a un colloquio con noi.</p></div>
          <Link className="career-cta group relative grid min-h-[540px] place-items-center overflow-hidden bg-[#f0eee8] text-center uppercase text-[#1a1a1a] transition hover:bg-[#ff3700] max-sm:min-h-[100vw]" to="/candidati-ora">
            <i className="absolute aspect-square w-[min(75%,390px)] rounded-full border border-[#1a1a1a] transition duration-500 group-hover:scale-80 bg-[#1a1a1a]" />
            <span className="relative z-10 text-[clamp(36px,5.3vw,74px)] leading-[.87] transition group-hover:text-white">Candidati<br />ora</span><b className="absolute right-[30px] top-6 z-10 text-[32px] font-light transition group-hover:text-white" aria-hidden="true">↗</b>
          </Link>
        </div>
        <div className="grid min-h-[190px] grid-cols-[2fr_1fr_1.3fr_1.35fr] border-t border-white/30 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div className="border-r border-white/30 p-[28px_30px] max-lg:border-b max-sm:min-h-[125px] max-sm:border-r-0 max-sm:px-[18px]"><img className="w-full max-w-[255px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></div>
          <FooterCol title="Social"><a href="https://www.instagram.com/nebbia_phygital_lab/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/company/nebbia-phygital-lab/" target="_blank" rel="noreferrer">LinkedIn ↗</a></FooterCol>
          <FooterCol title="Studio"><span>Via dell&apos;Innovazione digitale, 3<br />26100 Cremona, Italia</span></FooterCol>
          <FooterCol title="Commercial enquiries"><a href="mailto:info@nebbialab.it">info@nebbialab.it</a><a href="https://www.iubenda.com/privacy-policy/36366271" target="_blank" rel="noreferrer">Privacy Policy ↗</a></FooterCol>
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-[60] text-xs max-sm:text-[10px]">
        {/*<FooterBlur />*/}
        <div className="flex h-[50px] items-center gap-3 bg-[#1a1a1a] px-[30px] max-sm:h-[42px] max-sm:gap-2 max-sm:px-[18px]">
          <span>Cremona (IT)</span><i className="h-3 w-px bg-white/45" />
          <span>Time: <time>{time || '--:--'}</time></span><i className="h-3 w-px bg-white/45" />
          <span id="weather" className="flex items-center gap-1.5" aria-live="polite">
            {weather.isPending
              ? 'Meteo: --'
              : weather.isError
                ? 'Meteo non disponibile'
                : `${weather.data.condition}, ${weather.data.temperature}°C`}
          </span>
          <small className="ml-auto text-[10px] opacity-50 max-sm:hidden">© {new Date().getFullYear()} Nebbia Phygital Lab</small>
        </div>
      </footer>
    </main>
  );
}

function SectionTitle({ title, detail }: { title: string; detail: string }) {
  return <header className="flex h-[51px] items-center justify-between border-y border-white/30 px-[30px] uppercase max-sm:px-[18px]">
    <h2 className="m-0 text-[clamp(20px,2vw,26px)] text-[#ff3700] font-light">
      {title}
    </h2>
    <span className="text-[10px] opacity-55">
      {/*{detail}*/}
    </span>
  </header>;
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-col border-r border-white/30 p-[28px_30px] text-lg last:border-r-0 max-lg:border-b max-sm:min-h-[125px] max-sm:border-r-0 max-sm:px-[18px]"><p className="mb-6 mt-0 uppercase opacity-45">{title}</p>{children}</div>;
}
