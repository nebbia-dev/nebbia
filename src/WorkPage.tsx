import { Link, useParams } from '@tanstack/react-router';
import { works } from './data';
import { usePageMeta } from './usePageMeta';

export function WorkPage() {
  const { workSlug } = useParams({ from: '/works/$workSlug' });
  const index = works.findIndex((item) => item.slug === workSlug);
  const work = works[index >= 0 ? index : 0];
  const next = works[(index >= 0 ? index + 1 : 1) % works.length];

  usePageMeta(`${work.title} — Nebbia`, work.statement, work.image);

  return (
    <main className="min-h-screen bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#d9ff36] selection:text-[#1a1a1a]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-[50px] items-center justify-between border-b border-white/20 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <Link to="/" aria-label="Torna alla home"><img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></Link>
        <Link className="text-xs uppercase" to="/">← Tutti i lavori</Link>
      </header>

      <section className="relative mt-[50px] h-[72vh] min-h-[520px] overflow-hidden">
        <img className="h-full w-full object-cover brightness-[.78]" src={work.image} alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-6 p-[30px] max-sm:grid-cols-1 max-sm:p-[18px]">
          <div><p className="mb-3 text-xs uppercase tracking-[.08em] opacity-65">Case study / {work.year}</p><h1 className="m-0 max-w-5xl text-[clamp(42px,7.2vw,112px)] font-extralight leading-[.86] tracking-[-.075em]">{work.title}</h1></div>
          <p className="mb-0 max-w-sm text-right text-xs max-sm:text-left">{work.services}</p>
        </div>
      </section>

      <section className="grid min-h-[520px] grid-cols-2 border-b border-white/30 max-md:grid-cols-1">
        <div className="border-r border-white/30 p-[55px_30px] max-md:border-b max-md:border-r-0 max-sm:px-[18px]"><p className="mb-10 mt-0 text-[11px] uppercase tracking-[.08em] opacity-55">{work.client}</p><p className="m-0 text-[clamp(28px,4vw,58px)] leading-[1.02] tracking-[-.055em]">{work.statement}</p></div>
        <div className="grid place-items-center bg-[#f0eee8] p-8 text-[#1a1a1a]"><div className="aspect-square w-[min(68%,330px)] rounded-full border border-[#1a1a1a] p-8"><p className="m-0 text-[10px] uppercase tracking-widest">Approccio</p><p className="mt-12 text-[clamp(20px,2.4vw,34px)] leading-[1.05] tracking-[-.04em]">Strategia, linguaggio e tecnologia lavorano come un unico sistema.</p></div></div>
      </section>

      <Link className="group grid min-h-[280px] grid-cols-[1fr_auto] items-end bg-[#d9ff36] p-[30px] text-[#1a1a1a] max-sm:p-[18px]" to="/works/$workSlug" params={{ workSlug: next.slug }}>
        <div><span className="text-xs uppercase">Prossimo progetto</span><h2 className="mb-0 mt-12 text-[clamp(36px,6vw,88px)] font-extralight leading-[.9] tracking-[-.065em]">{next.title}</h2></div><b className="text-5xl font-extralight transition group-hover:rotate-45" aria-hidden="true">↗</b>
      </Link>

      <footer className="fixed inset-x-0 bottom-0 z-20 flex h-[50px] items-center justify-between border-t border-white/30 bg-[#1a1a1a] px-[30px] text-xs max-sm:px-[18px]"><span>Cremona (IT)</span><Link to="/">Nebbia Phygital Lab</Link></footer>
    </main>
  );
}
