import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useDocumentLanguage, type Language } from '../language';
import { usePageMeta } from '../usePageMeta';
import { LanguageSwitch } from './LanguageSwitch';
import { SiteFooter } from './SiteFooter';

const fieldClass = 'min-h-[58px] w-full border border-white/30 bg-transparent px-4 text-base text-white outline-none transition placeholder:text-white/40 focus:relative focus:z-10 focus:border-[#ff3700]';

export function CareersPage({ language = 'it' }: { language?: Language }) {
  const isEnglish = language === 'en';
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useDocumentLanguage(language);
  usePageMeta(
    `${isEnglish ? 'Apply now' : 'Candidati ora'} — Nebbia`,
    isEnglish ? 'Send your application and résumé to Nebbia Phygital Lab.' : 'Invia la tua candidatura e il tuo curriculum a Nebbia Phygital Lab.',
  );

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSubmitted(false);
    setFileError('');
    setFileName(file?.name ?? '');

    if (file && file.size > 10 * 1024 * 1024) {
      event.target.value = '';
      setFileName('');
      setFileError(isEnglish ? 'The file exceeds the 10 MB limit.' : 'Il file supera il limite di 10 MB.');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fileError) return;
    setSubmitted(true);
    event.currentTarget.reset();
    setFileName('');
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#ff3700] selection:text-[#1a1a1a] max-sm:pb-[42px]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/20 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <Link className="inline-flex items-center" to={language === 'en' ? '/en' : '/'} aria-label={isEnglish ? 'Nebbia, back to home' : 'Nebbia, torna alla home'}>
          <img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" />
        </Link>
        <div className="flex items-center gap-4 max-sm:gap-2.5">
          <LanguageSwitch language={language} italianHref="/candidati-ora" englishHref="/en/apply-now" />
          <Link className="text-sm uppercase max-sm:text-[10px]" to={language === 'en' ? '/en' : '/'}>
            <span className="max-sm:hidden">← {isEnglish ? 'Back home' : 'Torna alla home'}</span>
            <span className="sm:hidden">← Home</span>
          </Link>
        </div>
      </header>

      <section className="mt-[50px]">
        {/*<header className="flex h-[51px] items-center justify-between border-b border-white/30 px-[30px] uppercase max-sm:px-[18px]">*/}
        {/*  <h1 className="m-0 text-[clamp(20px,2vw,26px)] font-extralight text-[#ff3700]">Lavora con noi</h1>*/}
        {/*</header>*/}

        <div className="grid min-h-[calc(100vh-151px)] grid-cols-2 border-b border-white/30 max-lg:grid-cols-1">
          <aside className="relative flex min-h-[690px] overflow-hidden border-r border-white/30 p-[48px_30px] max-lg:min-h-[520px] max-lg:border-b max-lg:border-r-0 max-sm:min-h-[470px] max-sm:px-[18px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(72%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(48%,350px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff3700]/60" aria-hidden="true" />
            <div className="relative z-10 flex w-full flex-col">
              <p className="m-0 text-base uppercase opacity-55">{isEnglish ? 'Open positions' : 'Posizioni aperte'}</p>
              <p className="my-auto max-w-[560px] text-[clamp(34px,5vw,72px)] font-extralight uppercase leading-[.92]">{isEnglish ? 'Fill in the form and attach your résumé!' : 'Compila il form ed allega il tuo CV!'}</p>
              <p className="m-0 max-w-md text-sm leading-relaxed opacity-65">{isEnglish ? 'We are looking for curious people who can move between creativity, technology and communication.' : 'Cerchiamo persone curiose, capaci di muoversi tra creatività, tecnologia e comunicazione.'}</p>
            </div>
          </aside>

          <div className="p-[46px_30px_64px] max-sm:px-[18px]">
            <div className="mb-12 flex items-start justify-between gap-8">
              <div>
                <p className="mb-3 mt-0 text-base uppercase opacity-55">{isEnglish ? 'Open application' : 'Candidatura spontanea'}</p>
                <h2 className="m-0 max-w-xl text-[clamp(27px,3vw,44px)] font-extralight leading-[1.02]">{isEnglish ? 'Tell us what you can do and where you want to go.' : 'Raccontaci cosa sai fare e dove vuoi arrivare.'}</h2>
              </div>
              <span className="shrink-0 text-base uppercase opacity-45">* {isEnglish ? 'Required' : 'Obbligatorio'}</span>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-2 max-sm:grid-cols-1">
                <input className={fieldClass} name="nome" autoComplete="given-name" placeholder={`${isEnglish ? 'First name' : 'Nome'} *`} aria-label={isEnglish ? 'First name' : 'Nome'} required />
                <input className={`${fieldClass} border-l-0 max-sm:-mt-px max-sm:border-l`} name="cognome" autoComplete="family-name" placeholder={`${isEnglish ? 'Last name' : 'Cognome'} *`} aria-label={isEnglish ? 'Last name' : 'Cognome'} required />
              </div>
              <div className="-mt-px grid grid-cols-2 max-sm:grid-cols-1">
                <input className={fieldClass} name="email" type="email" autoComplete="email" placeholder="Email *" aria-label="Email" required />
                <input className={`${fieldClass} border-l-0 max-sm:-mt-px max-sm:border-l`} name="telefono" type="tel" autoComplete="tel" placeholder={isEnglish ? 'Phone' : 'Telefono'} aria-label={isEnglish ? 'Phone' : 'Telefono'} />
              </div>
              <select className={`${fieldClass} -mt-px appearance-none`} name="area" aria-label={isEnglish ? 'Professional area of interest' : 'Area professionale di interesse'} defaultValue="" required>
                <option className="text-[#1a1a1a]" value="" disabled>{isEnglish ? 'Professional area of interest' : 'Area professionale di interesse'} *</option>
                <option className="text-[#1a1a1a]">Art direction {isEnglish ? 'and' : 'e'} graphic design</option>
                <option className="text-[#1a1a1a]">3D {isEnglish ? 'and' : 'e'} motion design</option>
                <option className="text-[#1a1a1a]">{isEnglish ? 'Photo and video' : 'Foto e video'}</option>
                <option className="text-[#1a1a1a]">UI/UX {isEnglish ? 'and development' : 'e sviluppo'}</option>
                <option className="text-[#1a1a1a]">Project management</option>
                <option className="text-[#1a1a1a]">{isEnglish ? 'Other' : 'Altro'}</option>
              </select>
              <input className={`${fieldClass} -mt-px`} name="portfolio" type="url" inputMode="url" placeholder={isEnglish ? 'Portfolio or LinkedIn profile' : 'Portfolio o profilo LinkedIn'} aria-label={isEnglish ? 'Portfolio or LinkedIn profile' : 'Portfolio o profilo LinkedIn'} />
              <textarea className={`${fieldClass} -mt-px min-h-[180px] resize-y py-4`} name="presentazione" placeholder={`${isEnglish ? 'Tell us about yourself' : 'Parlaci di te'} *`} aria-label={isEnglish ? 'Introduction' : 'Presentazione'} required />

              <label className="-mt-px flex min-h-[78px] cursor-pointer items-center justify-between gap-5 border border-white/30 px-4 transition hover:border-white focus-within:border-[#ff3700]">
                <span>
                  <span className="block text-sm">{fileName || `${isEnglish ? 'Attach your résumé' : 'Allega il tuo CV'} *`}</span>
                  <span className="mt-1 block text-[10px] uppercase opacity-45">PDF, DOC {isEnglish ? 'or' : 'o'} DOCX · {isEnglish ? 'maximum' : 'massimo'} 10 MB</span>
                </span>
                <span className="shrink-0 text-2xl font-extralight" aria-hidden="true">＋</span>
                <input className="sr-only" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} required />
              </label>
              {fileError && <p className="mb-0 mt-2 text-sm text-[#ff5b38]" role="alert">{fileError}</p>}

              <label className="flex cursor-pointer items-start gap-3 py-6 text-xs leading-relaxed text-white/65">
                <input className="mt-0.5 size-4 shrink-0 accent-[#ff3700]" name="privacy" type="checkbox" required />
                <span>{isEnglish ? 'I have read the' : 'Ho letto la'} <a className="text-white underline underline-offset-4" href="https://www.iubenda.com/privacy-policy/36366271" target="_blank" rel="noreferrer">Privacy Policy</a> {isEnglish ? 'and consent to the processing of my data for managing this application.' : 'e acconsento al trattamento dei dati per la gestione della candidatura.'} *</span>
              </label>

              <button className="flex h-[58px] w-full cursor-pointer items-center justify-between border border-white bg-white px-4 uppercase text-[#1a1a1a] transition hover:border-[#ff3700] hover:bg-[#ff3700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3700]" type="submit">
                {isEnglish ? 'Send application' : 'Invia candidatura'} <span className="text-xl" aria-hidden="true">↗</span>
              </button>
              {submitted && <p className="mb-0 mt-4 text-sm text-[#ff3700]" role="status">{isEnglish ? 'Application recorded in the demo. Connect an email or storage service to enable real submissions.' : 'Candidatura acquisita nella demo. Collega un servizio email o di archiviazione per attivare l’invio reale.'}</p>}
            </form>
          </div>
        </div>
      </section>

      <div className="grid min-h-[150px] grid-cols-3 border-b border-white/30 text-xs max-md:grid-cols-1">
        <div className="border-r border-white/30 p-[28px_30px] max-md:border-b max-md:border-r-0 max-sm:px-[18px]"><img className="w-full max-w-[255px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></div>
        <div className="flex flex-col border-r border-white/30 p-[28px_30px] max-md:border-b max-md:border-r-0 max-sm:px-[18px]"><p className="mb-6 mt-0 uppercase opacity-45">Studio</p><span>Via dell&apos;Innovazione digitale, 3<br />26100 Cremona, {isEnglish ? 'Italy' : 'Italia'}</span></div>
        <div className="flex flex-col p-[28px_30px] max-sm:px-[18px]"><p className="mb-6 mt-0 uppercase opacity-45">{isEnglish ? 'Contacts' : 'Contatti'}</p><a href="mailto:info@nebbialab.it">info@nebbialab.it</a><a className="mt-2" href="https://www.linkedin.com/company/nebbia-phygital-lab/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
      </div>

      <SiteFooter language={language} />
    </main>
  );
}
