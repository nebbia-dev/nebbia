import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { careersPath, homePath, useDocumentLanguage, type Language } from './language';
import { getFeaturedProjects, localizedProjectsQueryOptions } from './supabaseProjects';
import { usePageMeta } from './usePageMeta';
import {Arrow} from "./_components/icons/Arrow";
import { LanguageSwitch } from './_components/LanguageSwitch';
import { SiteFooter } from './_components/SiteFooter';

const line = 'border-white/30';
const field = `h-[54px] w-full border border-white/30 bg-transparent px-[14px] outline-none placeholder:text-white/65 focus:relative focus:z-10 focus:border-[#ff3700]`;
export function HomePage({ language = 'it' }: { language?: Language }) {
  const isEnglish = language === 'en';
  const [worksView, setWorksView] = useState<'selected' | 'all'>('selected');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const projectsQuery = useQuery(localizedProjectsQueryOptions(language));
  const works = projectsQuery.data ?? [];
  const featuredWorks = getFeaturedProjects(works);

  useDocumentLanguage(language);
  usePageMeta(
    'Nebbia — Phygital Lab',
    isEnglish
      ? 'Creativity, innovation and communication bridging the physical and digital worlds.'
      : 'Creatività, innovazione e comunicazione tra analogico e digitale.',
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#ff3700] selection:text-[#1a1a1a] max-sm:pb-[42px]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <a className="inline-flex items-center" href={`${homePath(language)}#top`} aria-label={isEnglish ? 'Nebbia, back to the top' : "Nebbia, torna all'inizio"}>
          <img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" />
        </a>
        <div className="flex items-center gap-5 max-sm:gap-3">
          <nav className="flex items-center gap-6 text-[13px] max-md:hidden" aria-label={isEnglish ? 'Main navigation' : 'Navigazione principale'}>
            <a className="nav-link text-sm" href="#lavori">{isEnglish ? 'Works' : 'Lavori'}</a>
            <a className="nav-link text-sm" href="#contatti">{isEnglish ? 'Contacts' : 'Contatti'}</a>
            <a className="nav-link text-sm" href="#lavora-con-noi">{isEnglish ? 'Join us' : 'Lavora con noi'}</a>
          </nav>
          <LanguageSwitch language={language} italianHref="/" englishHref="/en" />
          <button className="relative hidden h-8 w-8 cursor-pointer border-0 bg-transparent md:hidden max-md:block" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? (isEnglish ? 'Close menu' : 'Chiudi menu') : (isEnglish ? 'Open menu' : 'Apri menu')}>
            <span className={`absolute right-0 top-[10px] h-px w-[22px] bg-white transition ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />
            <span className={`absolute right-0 top-[18px] h-px w-[22px] bg-white transition ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`fixed inset-x-0 bottom-0 top-[50px] z-40 flex flex-col justify-between bg-[#1a1a1a] p-[35px_24px] transition duration-300 md:hidden ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}>
        <nav className="flex flex-col text-right" aria-label={isEnglish ? 'Mobile navigation' : 'Navigazione mobile'}>
          {[
            [isEnglish ? 'Works' : 'Lavori', 'lavori'],
            [isEnglish ? 'Contacts' : 'Contatti', 'contatti'],
            [isEnglish ? 'Join us' : 'Lavora con noi', 'lavora-con-noi'],
          ].map(([label, id]) => <a className="py-3 text-4xl font-extralight leading-[1.05]" href={`#${id}`} onClick={() => setMenuOpen(false)} key={id}>{label}</a>)}
        </nav>
        {/*<p className="m-0 text-xs">IT / EN</p>*/}
      </div>

      <section className="relative mt-[50px] h-[620px] overflow-hidden max-sm:h-[660px]" id="top">
        <img className="absolute inset-0 h-full w-full object-cover" src="/assets/hero.jpg" alt="" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/15 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between px-[30px] font-extralight py-12 text-[clamp(18px,1.58vw,24px)] leading-[1.38] max-sm:px-[18px] max-sm:py-9 max-sm:text-[17px]">
          <p className="m-0 max-w-[92%]">
            <span className="bg-[#ff3700] p-1 text-[#1a1a1a]">NEBBIA Phygital Lab,</span>
            <br className="max-sm:hidden" />{' '}{isEnglish ? 'connections and ideas that break down' : 'connessioni e idee che abbattono'}<br className="max-sm:hidden" />{' '}
            {isEnglish ? 'the barriers between physical and digital.' : 'le barriere tra l’analogico e il digitale.'}
          </p>
          <p className="m-0 max-w-[92%] self-end text-right max-sm:max-w-[84%]">
            <span className="bg-[#ff3700] p-1 text-[#1a1a1a]">{isEnglish ? 'NEBBIA® is a phygital lab,' : 'NEBBIA® è un laboratorio phygital,'}</span>
            <br className="max-sm:hidden" />{' '}{isEnglish ? 'where creativity, innovation and communication' : 'dove creatività, innovazione e comunicazione'}<br className="max-sm:hidden" />{' '}
            {isEnglish ? 'come together to support companies and people.' : 'convergono per supportare aziende e persone.'}
          </p>
          <p className="m-0 max-w-[92%]">
            {isEnglish ? 'Our mission is to make digital culture accessible,' : 'La nostra missione è creare una cultura digitale accessibile,'}
            <br className="max-sm:hidden" />{' '}{isEnglish ? 'simplifying complexity, introducing new perspectives' : 'semplificando le complessità, introducendo nuove prospettive'}<br className="max-sm:hidden" />{' '}
            {isEnglish ? 'and encouraging talent to explore.' : 'e spingendo i talenti a esplorare.'}</p>
        </div>
      </section>

      <section className="scroll-mt-[49px]" id="lavori">
        <div className={`grid h-[50px] grid-cols-2 border-y ${line} uppercase`}>
          {(['selected', 'all'] as const).map((view) => (
            <button key={view} type="button" style={{fontWeight: 200}} onClick={() => setWorksView(view)} className={`works-view-tab grid h-full min-w-0 cursor-pointer place-items-center whitespace-nowrap px-[30px] text-center leading-none uppercase transition max-sm:px-2 ${view === 'all' ? 'border-l border-white/30' : ''} ${worksView === view ? 'bg-[#ff3700] text-[#1a1a1a]' : 'bg-[#1a1a1a] text-white'}`}>{view === 'selected' ? 'Selected Works' : 'All Works'}</button>
          ))}
        </div>
        {projectsQuery.isPending ? (
          <div className="grid min-h-[240px] place-items-center border-b border-white/30 px-[30px] text-sm text-white/50">
            {isEnglish ? 'Loading projects…' : 'Caricamento progetti…'}
          </div>
        ) : projectsQuery.isError ? (
          <div className="grid min-h-[240px] place-items-center border-b border-white/30 px-[30px] text-center">
            <div>
              <p className="m-0 text-sm text-white/60">{isEnglish ? 'Projects could not be loaded.' : 'Non è stato possibile caricare i progetti.'}</p>
              <button className="mt-4 border border-white/30 px-4 py-2 text-xs uppercase transition hover:border-[#ff3700] hover:text-[#ff3700]" type="button" onClick={() => projectsQuery.refetch()}>{isEnglish ? 'Try again' : 'Riprova'}</button>
            </div>
          </div>
        ) : worksView === 'selected' ? (
          <div className="grid h-[572px] grid-cols-3 max-sm:h-auto max-sm:grid-cols-1">
            {featuredWorks.map((work) => (
              <Link className="group relative min-w-0 overflow-hidden border-r border-white/30 last:border-r-0 max-sm:h-[68vh] max-sm:min-h-[420px] max-sm:border-r-0 max-sm:border-b" to={language === 'en' ? '/en/works/$workSlug' : '/works/$workSlug'} params={{ workSlug: work.slug }} key={work.slug}>
                <img className="h-full w-full object-cover brightness-[.8] saturate-[.78] transition duration-700 group-hover:scale-[1.04] group-hover:brightness-[.92]" src={work.image} alt="" />
                <div className="absolute inset-0 flex flex-col justify-between bg-[#1a1a1a]/50 p-[25px_30px_23px] transition duration-700 group-hover:bg-[#ff3700]/50 max-sm:p-[21px_18px]">
                  <h2 className="m-0 max-w-[90%] text-[clamp(21px,1.95vw,28px)] font-extralight leading-[1.08]">{work.title}</h2>
                  <p className="m-auto mb-0 mr-10 text-[13px]">{work.services}</p>
                  <span className="absolute bottom-5 right-6 grid size-[34px] -rotate-12 place-items-center rounded-full border border-white opacity-0 transition group-hover:rotate-0 group-hover:opacity-100 max-sm:right-[18px] max-sm:opacity-100" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-b border-white/30">
            {works.map((work, index) => (
              <Link className="group grid min-h-[56px] grid-cols-[56px_minmax(250px,1.1fr)_minmax(300px,1fr)_34px] items-center border-b border-white/30 px-[30px] transition last:border-b-0 hover:bg-[#ff3700] hover:text-[#1a1a1a] max-sm:min-h-[84px] max-sm:grid-cols-[34px_1fr_24px] max-sm:px-[18px]" to={language === 'en' ? '/en/works/$workSlug' : '/works/$workSlug'} params={{ workSlug: work.slug }} key={work.slug}>
                <span className="text-[10px] opacity-50">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="m-0 text-[clamp(19px,1.9vw,26px)] font-extralight leading-[1.05]">{work.title}</h2>
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
        <SectionTitle title={isEnglish ? 'Contacts' : 'Contatti'} detail={isEnglish ? 'Let’s talk' : 'Parliamone'} />
        <div className="grid min-h-[760px] grid-cols-2 max-lg:grid-cols-1">
          <aside className="flex min-w-0 flex-col border-r border-white/30 p-[48px_30px_38px] max-lg:min-h-[420px] max-lg:border-b max-lg:border-r-0 max-sm:min-h-[390px] max-sm:px-[18px]">
            <p className="mb-[34px] mt-0 text-base font-light uppercase">{isEnglish ? 'General information' : 'Informazioni generali'}</p>
            <address className="text-[clamp(20px,2.1vw,29px)] font-extralight not-italic leading-[1.26]">Via dell&apos;Innovazione digitale, 3<br />26100 Cremona, {isEnglish ? 'Italy' : 'Italia'}<br />{isEnglish ? 'VAT no.' : 'P.I.'} 01618080194</address>
            <a className="mt-auto break-words text-[clamp(24px,4.3vw,62px)] font-extralight leading-[.95]" href="mailto:info@nebbialab.it">info@nebbialab.it <sup className="text-[.4em]">↗</sup></a>
          </aside>
          <div className="p-[46px_30px_38px] max-sm:px-[18px]">
            <h3 className="mb-[70px] mt-0 text-[clamp(20px,2vw,27px)] font-extralight uppercase leading-[1.12] max-lg:mb-[42px]">{isEnglish ? <>Need more information?<br />Get in touch!</> : <>Hai bisogno di maggiori info?<br />Scrivici!</>}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 text-[#1a1a1a] max-sm:grid-cols-1">
                <input className={field} name="nome" placeholder={isEnglish ? 'First name' : 'Nome'} aria-label={isEnglish ? 'First name' : 'Nome'} required />
                <input className={`${field} border-l-0 max-sm:-mt-px max-sm:border-l`} name="cognome" placeholder={isEnglish ? 'Last name' : 'Cognome'} aria-label={isEnglish ? 'Last name' : 'Cognome'} required />
              </div>
              <div className="-mt-px grid grid-cols-2 max-sm:grid-cols-1">
                <input className={field} name="azienda" placeholder="Company" aria-label={isEnglish ? 'Company' : 'Azienda'} />
                <input className={`${field} border-l-0 max-sm:-mt-px max-sm:border-l`} name="email" type="email" placeholder="Email" aria-label="Email" required />
              </div>
              <select className={`${field} -mt-px appearance-none`} name="oggetto" aria-label={isEnglish ? 'Choose a subject' : "Scegli l'oggetto"}>
                <option className="text-[#1a1a1a]">{isEnglish ? 'General information' : 'Info Generali'}</option>
                <option className="text-[#1a1a1a]">{isEnglish ? 'Quotes' : 'Preventivi'}</option><option className="text-[#1a1a1a]">Partnership</option>
              </select>
              <textarea className={`${field} -mt-px h-[190px] resize-y py-[15px]`} name="messaggio" placeholder="Message" aria-label={isEnglish ? 'Message' : 'Messaggio'} required />
              <button className="mt-[7px] flex h-[54px] w-full cursor-pointer items-center justify-between border border-white bg-white px-[15px] uppercase text-[#1a1a1a] transition hover:border-[#ff3700] hover:bg-[#ff3700]" type="submit">{isEnglish ? 'Send' : 'Invia'} <span className="text-xl" aria-hidden="true">↗</span></button>
              {sent && <p className="mt-3 text-[11px] text-[#ff3700]" role="status">{isEnglish ? 'Message recorded in the demo. Connect your email service here to send it.' : 'Messaggio acquisito nella demo. Collega qui il tuo servizio email per l’invio reale.'}</p>}
            </form>
          </div>
        </div>
      </section>

      <section className="scroll-mt-[49px]" id="lavora-con-noi">
        <SectionTitle title={isEnglish ? 'Join us' : 'Lavora con noi'} detail="Join the fog" />
        <div className="grid min-h-[540px] grid-cols-2 max-lg:grid-cols-1">
          <div className="p-[48px_30px] max-lg:min-h-[430px] max-sm:px-[18px]">
            <p className="mb-[34px] mt-0 text-base font-light uppercase">{isEnglish ? 'Open positions' : 'Posizioni aperte'}</p>
            <p className="m-0 text-4xl font-extralight leading-[1.08]">{isEnglish ? <>Would you like to join our team?<br />
              Explore our open positions<br />and apply for the opportunity<br />
              to interview with us.</> : <>Vuoi far parte del nostro team?<br />
              Consulta le posizioni aperte<br />e candidati per avere l’opportunità<br />
              di partecipare a un colloquio con noi.</>}</p></div>
          <Link className="career-cta relative grid min-h-[540px] place-items-center overflow-hidden bg-[#f0eee8] text-center uppercase text-[#1a1a1a] max-sm:min-h-[100vw]" to={careersPath(language)}>
            {(['career-ribbon-down', 'career-ribbon-up'] as const).map((ribbonClass) => (
              <span className={`career-ribbon ${ribbonClass}`} aria-hidden="true" key={ribbonClass}>
                <span className="career-ribbon-track">
                  {Array.from({ length: 9 }, (_, index) => <i className="career-wordmark" key={index} />)}
                </span>
              </span>
            ))}
            <span className="career-circle" aria-hidden="true" />
            <span className="career-label">{isEnglish ? <>Apply<br />now</> : <>Candidati<br />ora</>}</span>
          </Link>
        </div>
        <div className="grid min-h-[190px] grid-cols-[2fr_1fr_1.3fr_1.35fr] border-t border-white/30 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div className="border-r border-white/30 p-[28px_30px] max-lg:border-b max-sm:min-h-[125px] max-sm:border-r-0 max-sm:px-[18px]"><img className="w-full max-w-[255px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></div>
          <FooterCol title="Social"><a href="https://www.instagram.com/nebbia_phygital_lab/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/company/nebbia-phygital-lab/" target="_blank" rel="noreferrer">LinkedIn ↗</a></FooterCol>
          <FooterCol title="Studio"><span>Via dell&apos;Innovazione digitale, 3<br />26100 Cremona, {isEnglish ? 'Italy' : 'Italia'}</span></FooterCol>
          <FooterCol title="Commercial enquiries"><a href="mailto:info@nebbialab.it">info@nebbialab.it</a><a href="https://www.iubenda.com/privacy-policy/36366271" target="_blank" rel="noreferrer">Privacy Policy ↗</a></FooterCol>
        </div>
      </section>

      <SiteFooter hiddenOnMobile={menuOpen} language={language} />
    </main>
  );
}

function SectionTitle({ title, detail }: { title: string; detail: string }) {
  return <header className="flex h-[51px] items-center justify-between border-y border-white/30 px-[30px] uppercase max-sm:px-[18px]">
    <h2 className="m-0 text-[clamp(20px,2vw,26px)] text-[#ff3700] font-extralight">
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
