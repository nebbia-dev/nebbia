import { useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { works } from './data';
import { usePageMeta } from './usePageMeta';

export function WorkPage() {
  const { workSlug } = useParams({ from: '/works/$workSlug' });
  const index = works.findIndex((item) => item.slug === workSlug);
  const work = works[index >= 0 ? index : 0];
  const previous = works[(index > 0 ? index : works.length) - 1];
  const next = works[(index >= 0 ? index + 1 : 1) % works.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [workSlug]);

  usePageMeta(`${work.title} — Nebbia`, work.statement, work.image);

  return (
    <main className="min-h-screen bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#d9ff36] selection:text-[#1a1a1a]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-[50px] items-center justify-between border-b border-white/20 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <Link to="/" aria-label="Torna alla home"><img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></Link>
        <Link className="text-xs uppercase" to="/">← Tutti i lavori</Link>
      </header>

      <section className="relative mt-[50px] h-[72vh] min-h-[520px] max-h-[820px] overflow-hidden bg-[#d9ff36]">
        <img className="h-full min-h-[520px] w-full object-cover" src={work.hero ?? work.image} alt={work.title} />
        <h1 className="sr-only">{work.title}</h1>
      </section>

      <section className="grid grid-cols-12 border-b border-white/30 max-md:grid-cols-1">
        <article className="col-span-7 border-r border-white/30 p-[56px_30px_80px] max-md:border-b max-md:border-r-0 max-sm:p-[40px_18px_56px]">
          <p className="mb-10 mt-0 text-[11px] uppercase tracking-[.08em] opacity-55">Challenge</p>
          <p className="m-0 max-w-4xl text-[clamp(28px,4vw,58px)] leading-[1.02] tracking-[-.055em]">{work.challenge ?? work.statement}</p>
        </article>
        <div className="col-span-5 grid grid-cols-2 max-sm:grid-cols-1">
          <div className="border-r border-white/30 p-[56px_30px] max-sm:border-b max-sm:border-r-0 max-sm:p-[36px_18px]"><p className="mb-7 mt-0 text-[11px] uppercase tracking-[.08em] opacity-55">Client</p><p className="m-0 text-lg leading-tight">{work.client}<br />{work.year}</p></div>
          <div className="p-[56px_30px] max-sm:p-[36px_18px]"><p className="mb-7 mt-0 text-[11px] uppercase tracking-[.08em] opacity-55">Services</p><p className="m-0 text-lg leading-tight">{work.services}</p></div>
        </div>
      </section>

      {(work.sections ?? [{ title: 'Il progetto', paragraphs: [work.statement] }]).map((section) => (
        <section key={section.title} className="border-b border-white/30">
          <div className="grid grid-cols-12 p-[86px_30px_110px] max-md:block max-sm:p-[58px_18px_72px]">
            <h2 className="col-span-3 m-0 text-xs font-normal uppercase tracking-[.08em] opacity-60">{section.title}</h2>
            <div className="col-span-8 col-start-5 max-md:mt-10">
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)} className="my-0 mb-8 text-[clamp(25px,3.3vw,50px)] leading-[1.06] tracking-[-.045em] last:mb-0">{paragraph}</p>)}
            </div>
          </div>
          {section.media && <div className={`grid ${section.media.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {section.media.map((src, mediaIndex) => <img key={src} className={`aspect-[16/10] h-full w-full object-cover ${section.media?.length === 3 && mediaIndex === 0 ? 'md:col-span-2 md:aspect-[16/8]' : ''}`} src={src} alt="" loading="lazy" />)}
          </div>}
        </section>
      ))}

      {work.credits && <section className="border-b border-white/30 p-[76px_30px_96px] max-sm:p-[54px_18px_70px]">
        <h2 className="mb-14 mt-0 text-xs font-normal uppercase tracking-[.08em] opacity-60">Team</h2>
        <div className="grid grid-cols-4 border-l border-t border-white/30 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {work.credits.map((credit) => <div key={credit.role} className="min-h-36 border-b border-r border-white/30 p-5"><p className="m-0 text-[10px] uppercase tracking-[.08em] opacity-50">{credit.role}</p><p className="mb-0 mt-9 text-base leading-snug">{credit.names.join(', ')}</p></div>)}
        </div>
      </section>}

      <nav className="grid grid-cols-2 max-md:grid-cols-1">
        <Link className="group min-h-[280px] border-r border-white/30 p-[30px] max-md:border-b max-md:border-r-0 max-sm:p-[18px]" to="/works/$workSlug" params={{ workSlug: previous.slug }}><span className="text-xs uppercase opacity-55">Previous project</span><h2 className="mb-0 mt-20 text-[clamp(32px,4.7vw,68px)] font-extralight leading-[.9] tracking-[-.06em] transition group-hover:translate-x-2">← {previous.title}</h2></Link>
        <Link className="group min-h-[280px] bg-[#d9ff36] p-[30px] text-[#1a1a1a] max-sm:p-[18px]" to="/works/$workSlug" params={{ workSlug: next.slug }}><span className="text-xs uppercase">Next project</span><h2 className="mb-0 mt-20 text-[clamp(32px,4.7vw,68px)] font-extralight leading-[.9] tracking-[-.06em] transition group-hover:translate-x-2">{next.title} →</h2></Link>
      </nav>

      <footer className="fixed inset-x-0 bottom-0 z-20 flex h-[50px] items-center justify-between border-t border-white/30 bg-[#1a1a1a] px-[30px] text-xs max-sm:px-[18px]"><span>Cremona (IT)</span><Link to="/">Nebbia Phygital Lab</Link></footer>
    </main>
  );
}
