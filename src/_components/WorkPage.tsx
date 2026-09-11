import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import type { ProjectMedia } from '../projectMedia';
import type { ProjectSection, ProjectSectionBlock, ProjectSectionColumn } from '../projectTypes';
import { projectsQueryOptions } from '../supabaseProjects';
import { usePageMeta } from '../usePageMeta';
import { SiteFooter } from './SiteFooter';

function ProjectMedium({ item, className, label }: { item: ProjectMedia; className: string; label: string }) {
  return item.type === 'video' ? (
    <video className={className} src={item.src} autoPlay muted loop playsInline preload="metadata" aria-label={label} />
  ) : (
    <img className={className} src={item.src} alt="" loading="lazy" />
  );
}

function SectionCopy({ section }: { section: ProjectSection }) {
  return (
    <div className="flex h-auto min-h-[50dvh] flex-col justify-between gap-12 overflow-visible bg-[#d9d9d9] p-[clamp(24px,4vw,70px)] text-[#1a1a1a] md:h-full md:min-h-0 md:overflow-y-auto">
      {section.title ? <h2 className="m-0 text-[clamp(24px,3.4vw,48px)] font-extralight uppercase leading-none">{section.title}</h2> : <span aria-hidden="true" />}
      <div>
        {section.paragraphs.map((paragraph, paragraphIndex) => (
          <p key={`${paragraph.slice(0, 48)}-${paragraphIndex}`} className="mb-5 mt-0 whitespace-pre-line text-base leading-[1.35] last:mb-0">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function SectionCell({ cell, section, workTitle, label }: { cell: ProjectSectionColumn; section: ProjectSection; workTitle: string; label: string }) {
  if (cell.kind === 'text') return <SectionCopy section={section} />;
  if (cell.kind === 'empty') return <div className="h-full bg-[#d9d9d9]" aria-hidden="true" />;
  return <ProjectMedium item={cell.media} className="h-full w-full bg-white object-cover" label={`${workTitle}, ${label}`} />;
}

function SectionLayoutBlock({ block, section, workTitle, blockIndex }: { block: ProjectSectionBlock; section: ProjectSection; workTitle: string; blockIndex: number }) {
  if (block.kind === 'columns') {
    const leftSize = block.left.kind === 'text' ? 'md:aspect-square' : 'aspect-square';
    const rightSize = block.right.kind === 'text' ? 'md:aspect-square' : 'aspect-square';

    return (
      <div className="grid border-b border-[#1a1a1a]/30 md:grid-cols-2">
        <div className={`${leftSize} border-b border-white/30 md:border-b-0 md:border-r`}>
          <SectionCell cell={block.left} section={section} workTitle={workTitle} label={`sezione ${section.title || 'senza titolo'}, colonna sinistra`} />
        </div>
        <div className={rightSize}>
          <SectionCell cell={block.right} section={section} workTitle={workTitle} label={`sezione ${section.title || 'senza titolo'}, colonna destra`} />
        </div>
      </div>
    );
  }

  if (block.kind === 'grid') {
    const columnsClass = block.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
    return (
      <div className={`grid border-b border-white/30 ${columnsClass}`}>
        {block.items.map((item, itemIndex) => (
          <ProjectMedium key={item.src} item={item} className="aspect-square h-full w-full border-b border-r border-white/30 bg-[#1a1a1a] object-cover" label={`${workTitle}, griglia ${blockIndex + 1}, elemento ${itemIndex + 1}`} />
        ))}
      </div>
    );
  }

  return <ProjectMedium item={block.media} className="aspect-video w-full border-b border-white/30 bg-[#1a1a1a] object-cover" label={`${workTitle}, media a tutta larghezza ${blockIndex + 1}`} />;
}

function creditCellBorders(index: number, total: number) {
  const isRowEnd = (columns: number) => (index + 1) % columns === 0 || index === total - 1;
  const isLastRow = (columns: number) => index >= Math.floor((total - 1) / columns) * columns;

  return [
    'border-l-0',
    isRowEnd(1) ? 'border-r-0' : 'border-r',
    isLastRow(1) ? 'border-b-0' : 'border-b',
    isRowEnd(2) ? 'sm:border-r-0' : 'sm:border-r',
    isLastRow(2) ? 'sm:border-b-0' : 'sm:border-b',
    isRowEnd(3) ? 'md:border-r-0' : 'md:border-r',
    isLastRow(3) ? 'md:border-b-0' : 'md:border-b',
    isRowEnd(6) ? 'lg:border-r-0' : 'lg:border-r',
    isLastRow(6) ? 'lg:border-b-0' : 'lg:border-b',
  ].join(' ');
}

function WorkPageState({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#1a1a1a] px-[30px] text-center text-sm text-white/60">
      {children}
    </main>
  );
}

export function WorkPage() {
  const { workSlug } = useParams({ from: '/works/$workSlug' });
  const projectsQuery = useQuery(projectsQueryOptions);
  const works = projectsQuery.data ?? [];
  const index = works.findIndex((item) => item.slug === workSlug);
  const work = index >= 0 ? works[index] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [workSlug]);

  usePageMeta(
    work ? `${work.title} — Nebbia` : 'Progetto — Nebbia',
    work?.statement ?? 'Progetto Nebbia Phygital Lab.',
    work?.image ?? '/og.png',
  );

  if (projectsQuery.isPending) {
    return <WorkPageState>Caricamento progetto…</WorkPageState>;
  }

  if (projectsQuery.isError) {
    return (
      <WorkPageState>
        <div>
          <p className="m-0">Non è stato possibile caricare il progetto.</p>
          <button className="mt-4 border border-white/30 px-4 py-2 text-xs uppercase transition hover:border-[#ff3700] hover:text-[#ff3700]" type="button" onClick={() => projectsQuery.refetch()}>Riprova</button>
        </div>
      </WorkPageState>
    );
  }

  if (!work) {
    return <WorkPageState>Progetto non trovato.</WorkPageState>;
  }

  const previous = works[(index > 0 ? index : works.length) - 1];
  const next = works[(index + 1) % works.length];

  return (
    <main className="min-h-screen bg-[#1a1a1a] pb-[50px] text-white selection:bg-[#ff3700] selection:text-[#1a1a1a] max-sm:pb-[42px]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-[60px] items-center justify-between border-b border-white/20 bg-[#1a1a1a] px-[30px] max-sm:px-[18px]">
        <Link to="/" aria-label="Torna alla home"><img className="w-[222px] max-sm:w-[174px]" src="/assets/nebbia-logo.svg" alt="Nebbia Phygital Lab" /></Link>
        <Link className="text-sm uppercase" to="/">← Tutti i lavori</Link>
      </header>

      <section className="relative mt-[50px] h-[72vh] min-h-[520px] max-h-[820px] overflow-hidden bg-[#ff3700]">
        {work.heroType === 'video' ? (
          <video className="h-full min-h-[520px] w-full object-cover" src={work.hero} autoPlay muted loop playsInline preload="metadata" aria-label={work.title} />
        ) : (
          <img className="h-full min-h-[520px] w-full object-cover" src={work.hero ?? work.image} alt={work.title} />
        )}
        <h1 className="sr-only">{work.title}</h1>
      </section>

      <section className="grid grid-cols-3 border-b border-t border-[#1a1a1a]/30 bg-[#ff3700] text-[#1a1a1a] max-md:grid-cols-1">
        <div className="border-r border-[#1a1a1a]/30 p-[56px_30px] max-md:border-b max-md:border-r-0 max-sm:p-[36px_18px]">
          <p className="mb-7 mt-0 text-md uppercase opacity-55">Challenge</p>
          <p className="m-0 text-lg leading-tight">{work.challenge ?? work.statement}</p>
        </div>
          <div className="border-r border-[#1a1a1a]/30 p-[56px_30px] max-sm:border-b max-sm:border-r-0 max-sm:p-[36px_18px]">
              <p className="mb-7 mt-0 text-md uppercase opacity-55">Client</p>
              <p className="m-0 text-lg leading-tight">{work.client}, {work.year}</p></div>
          <div className="p-[56px_30px] max-sm:p-[36px_18px]">
              <p className="mb-7 mt-0 text-md uppercase opacity-55">Services</p>
              <p className="m-0 text-lg leading-tight">{work.services}</p
              ></div>
      </section>

      {work.sections.map((section, sectionIndex) => (
        <section key={`${section.title}-${sectionIndex}`} aria-label={section.title || `Sezione ${sectionIndex + 1}`}>
          {section.blocks.length > 0 ? section.blocks.map((block, blockIndex) => (
            <SectionLayoutBlock key={`${block.kind}-${blockIndex}`} block={block} section={section} workTitle={work.title} blockIndex={blockIndex} />
          )) : (
            <div className="border-b border-[#1a1a1a]/30"><SectionCopy section={section} /></div>
          )}
        </section>
      ))}

      {work.credits && <section className="border-b border-white/30 p-[76px_0px_96px] max-sm:p-[54px_0px_70px]">
        <h2 className="mb-14 mt-0 text-xs font-normal uppercase opacity-60 pl-[30px] max-sm:pl-[18px]">Team</h2>
        <div className="grid grid-cols-1 border-b border-t border-white/30 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {work.credits.map((credit, creditIndex) => <div key={credit.role} className={`min-h-12 border-white/30 p-5 ${creditCellBorders(creditIndex, work.credits!.length)}`}>
              <p className="m-0 text-xs uppercase opacity-50">{credit.role}</p>
              <p className="mb-0 mt-3 text-sm leading-snug">{credit.names.join(', ')}</p></div>)}
        </div>
      </section>}

      <nav className="grid grid-cols-2 max-md:grid-cols-1">
        <Link className="group h-[124px] border-r border-white/30 p-[30px] max-md:border-b max-md:border-r-0 max-sm:p-[18px]" to="/works/$workSlug" params={{ workSlug: previous.slug }}>
            <span className="text-xs uppercase opacity-55">Previous project</span>
            <h2 className="mb-0 mt-4 text-2xl font-extralight leading-[.9] transition group-hover:translate-x-2">← {previous.title}</h2>
        </Link>
        <Link className="group h-[124px] bg-[#ff3700] p-[30px] text-[#1a1a1a] max-sm:p-[18px]" to="/works/$workSlug" params={{ workSlug: next.slug }}>
            <span className="text-xs uppercase">Next project</span>
            <h2 className="mb-0 mt-4 text-2xl font-extralight leading-[.9] transition group-hover:translate-x-2">{next.title} →</h2>
        </Link>
      </nav>

      <SiteFooter />
    </main>
  );
}
