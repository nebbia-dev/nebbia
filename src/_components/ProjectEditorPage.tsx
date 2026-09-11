import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workPath, type Language } from '../language';
import type { ProjectMedia } from '../projectMedia';
import type { ProjectSection, ProjectSectionBlock, Work } from '../projectTypes';
import { localizedProjectsQueryOptions, saveProject, syncProjectMediaToOtherLanguage, uploadProjectMedia, type ProjectWriteInput } from '../supabaseProjects';
import { usePageMeta } from '../usePageMeta';

type EditorMedia = {
  src: string;
  type: 'image' | 'video';
  name?: string;
  file?: File;
};

type TwoMediaBlock = {
  id: string;
  sectionId?: string;
  type: 'two-media';
  left?: EditorMedia;
  right?: EditorMedia;
};

type FullMediaBlock = {
  id: string;
  sectionId?: string;
  type: 'full-media';
  media?: EditorMedia;
};

type MediaTextBlock = {
  id: string;
  sectionId?: string;
  type: 'media-text';
  media?: EditorMedia;
  mediaSide: 'left' | 'right';
  title: string;
  text: string;
};

type EditorBlock = TwoMediaBlock | FullMediaBlock | MediaTextBlock;

type EditorProject = {
  id: string;
  sourceSlug?: string;
  isNew: boolean;
  title: string;
  slug: string;
  image?: EditorMedia;
  hero?: EditorMedia;
  challenge: string;
  client: string;
  year: string;
  services: string[];
  blocks: EditorBlock[];
};

const surface = 'border border-white/12 bg-[#232323]';
const field = 'w-full rounded-none border border-white/15 bg-[#181818] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#ff3700]';
const eyebrow = 'text-[10px] font-medium uppercase text-white/45';

function makeId(prefix = 'item') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cloneMedia(media: EditorMedia): EditorMedia {
  return { ...media };
}

function mediaFromFile(file: File): EditorMedia {
  return {
    src: URL.createObjectURL(file),
    type: file.type.startsWith('video/') ? 'video' : 'image',
    name: file.name,
    file,
  };
}

function convertLayoutBlock(block: ProjectSectionBlock, sectionTitle: string, sectionText: string): { blocks: EditorBlock[]; usesText: boolean } {
  if (block.kind === 'full') {
    return {
      blocks: [{ id: makeId('block'), type: 'full-media', media: cloneMedia(block.media) }],
      usesText: false,
    };
  }

  if (block.kind === 'grid') {
    const blocks: EditorBlock[] = [];
    for (let index = 0; index < block.items.length; index += 2) {
      const left = block.items[index];
      const right = block.items[index + 1];
      blocks.push(
        right
          ? { id: makeId('block'), type: 'two-media', left: cloneMedia(left), right: cloneMedia(right) }
          : { id: makeId('block'), type: 'full-media', media: cloneMedia(left) },
      );
    }
    return { blocks, usesText: false };
  }

  const leftMedia = block.left.kind === 'media' ? block.left.media : undefined;
  const rightMedia = block.right.kind === 'media' ? block.right.media : undefined;
  const hasText = block.left.kind === 'text' || block.right.kind === 'text';

  if (hasText) {
    const media = leftMedia ?? rightMedia;
    return {
      blocks: [{
        id: makeId('block'),
        type: 'media-text',
        media: media ? cloneMedia(media) : undefined,
        mediaSide: leftMedia ? 'left' : 'right',
        title: sectionTitle,
        text: sectionText,
      }],
      usesText: true,
    };
  }

  if (leftMedia && rightMedia) {
    return {
      blocks: [{ id: makeId('block'), type: 'two-media', left: cloneMedia(leftMedia), right: cloneMedia(rightMedia) }],
      usesText: false,
    };
  }

  const media = leftMedia ?? rightMedia;
  return {
    blocks: media ? [{ id: makeId('block'), type: 'full-media', media: cloneMedia(media) }] : [],
    usesText: false,
  };
}

function projectFromWork(work: Work): EditorProject {
  const blocks: EditorBlock[] = [];

  work.sections.forEach((section) => {
    const sectionId = makeId('section');
    const sectionBlocks: EditorBlock[] = [];
    const sectionText = section.paragraphs.join('\n\n');
    let textWasPlaced = false;

    section.blocks.forEach((block) => {
      const converted = convertLayoutBlock(block, section.title, sectionText);
      sectionBlocks.push(...converted.blocks.map((editorBlock) => ({ ...editorBlock, sectionId })));
      textWasPlaced ||= converted.usesText;
    });

    if (!textWasPlaced && (section.title || sectionText)) {
      sectionBlocks.unshift({
        id: makeId('block'),
        sectionId,
        type: 'media-text',
        mediaSide: 'right',
        title: section.title,
        text: sectionText,
      });
    }

    blocks.push(...sectionBlocks);
  });

  return {
    id: `work-${work.slug}`,
    sourceSlug: work.slug,
    isNew: false,
    title: work.title,
    slug: work.slug,
    image: { src: work.image, type: 'image' },
    hero: { src: work.hero, type: work.heroType },
    challenge: work.challenge,
    client: work.client,
    year: work.year,
    services: work.services.split(/\s+\/\s+/).map((service) => service.trim()).filter(Boolean),
    blocks,
  };
}

function createEmptyProject(language: Language): EditorProject {
  return {
    id: makeId('project'),
    isNew: true,
    title: language === 'en' ? 'Untitled project' : 'Progetto senza titolo',
    slug: '',
    challenge: '',
    client: '',
    year: new Date().getFullYear().toString(),
    services: [],
    blocks: [],
  };
}

function validateProject(project: EditorProject) {
  if (!project.title.trim()) return 'Inserisci il titolo del progetto.';
  if (!project.slug.trim()) return 'Inserisci lo slug del progetto.';
  if (!project.image) return 'Seleziona l’immagine di anteprima.';
  if (project.image.type !== 'image') return 'L’anteprima del progetto deve essere un’immagine.';
  if (!project.hero) return 'Seleziona la hero del progetto.';
  if (!project.challenge.trim()) return 'Inserisci la challenge.';
  if (!project.client.trim()) return 'Inserisci il client.';
  if (!project.year.trim()) return 'Inserisci l’anno.';
  if (project.services.length === 0) return 'Inserisci almeno un servizio.';
  if (project.blocks.length === 0) return 'Inserisci almeno un blocco nella pagina.';

  for (const [index, block] of project.blocks.entries()) {
    if (block.type === 'two-media' && (!block.left || !block.right)) {
      return `Completa entrambi i media del blocco ${index + 1}.`;
    }
    if (block.type === 'full-media' && !block.media) {
      return `Seleziona il media del blocco ${index + 1}.`;
    }
    if (block.type === 'media-text' && (!block.media || !block.text.trim())) {
      return `Completa media e testo del blocco ${index + 1}.`;
    }
  }

  return '';
}

function toProjectMedia(media: EditorMedia): ProjectMedia {
  return { src: media.src, type: media.type };
}

async function persistMedia(media: EditorMedia, slug: string): Promise<EditorMedia> {
  if (!media.file) return media;
  const src = await uploadProjectMedia(media.file, slug);
  URL.revokeObjectURL(media.src);
  return { src, type: media.type, name: media.name };
}

async function persistBlockMedia(block: EditorBlock, slug: string): Promise<EditorBlock> {
  if (block.type === 'two-media') {
    const [left, right] = await Promise.all([
      block.left ? persistMedia(block.left, slug) : undefined,
      block.right ? persistMedia(block.right, slug) : undefined,
    ]);
    return { ...block, left, right };
  }

  if (block.type === 'full-media') {
    return { ...block, media: block.media ? await persistMedia(block.media, slug) : undefined };
  }

  return { ...block, media: block.media ? await persistMedia(block.media, slug) : undefined };
}

function sectionsFromBlocks(blocks: EditorBlock[]): ProjectSection[] {
  const sections: ProjectSection[] = [];
  const sectionsById = new Map<string, ProjectSection>();

  for (const block of blocks) {
    const sectionId = block.sectionId ?? block.id;
    let section = sectionsById.get(sectionId);
    if (!section) {
      section = { title: '', paragraphs: [], blocks: [] };
      sectionsById.set(sectionId, section);
      sections.push(section);
    }

    if (block.type === 'two-media' && block.left && block.right) {
      section.blocks.push({
        kind: 'columns',
        left: { kind: 'media', media: toProjectMedia(block.left) },
        right: { kind: 'media', media: toProjectMedia(block.right) },
      });
    } else if (block.type === 'full-media' && block.media) {
      section.blocks.push({ kind: 'full', media: toProjectMedia(block.media) });
    } else if (block.type === 'media-text') {
      section.title = block.title.trim();
      section.paragraphs = block.text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      if (block.media) {
        const mediaColumn = { kind: 'media' as const, media: toProjectMedia(block.media) };
        const textColumn = { kind: 'text' as const };
        section.blocks.push({
          kind: 'columns',
          left: block.mediaSide === 'left' ? mediaColumn : textColumn,
          right: block.mediaSide === 'right' ? mediaColumn : textColumn,
        });
      }
    }
  }

  return sections;
}

async function persistProject(project: EditorProject, language: Language) {
  if (!project.image || !project.hero) throw new Error('Media obbligatori mancanti.');

  const [image, hero, blocks] = await Promise.all([
    persistMedia(project.image, project.slug),
    persistMedia(project.hero, project.slug),
    Promise.all(project.blocks.map((block) => persistBlockMedia(block, project.slug))),
  ]);
  const persistedProject = { ...project, image, hero, blocks };
  const payload: ProjectWriteInput = {
    slug: project.slug,
    title: project.title.trim(),
    image: image.src,
    hero: hero.src,
    services: project.services,
    year: project.year.trim(),
    client: project.client.trim(),
    challenge: project.challenge.trim(),
    sections: sectionsFromBlocks(blocks),
  };
  const work = await saveProject(payload, project.sourceSlug, language);
  await syncProjectMediaToOtherLanguage(payload, project.sourceSlug, language);
  const savedProject: EditorProject = {
    ...persistedProject,
    id: `work-${work.slug}`,
    sourceSlug: work.slug,
    isNew: false,
    title: work.title,
    slug: work.slug,
  };

  return { work, savedProject };
}

function IconLabel({ children }: { children: ReactNode }) {
  return <span className={eyebrow}>{children}</span>;
}

function MediaPreview({ media, className = '' }: { media?: EditorMedia; className?: string }) {
  if (!media) {
    return (
      <div className={`grid min-h-32 place-items-center bg-white/[0.035] text-center text-xs text-white/30 ${className}`}>
        Nessun media selezionato
      </div>
    );
  }

  return media.type === 'video' ? (
    <video className={`h-full w-full object-cover ${className}`} src={media.src} autoPlay muted loop playsInline />
  ) : (
    <img className={`h-full w-full object-cover ${className}`} src={media.src} alt={media.name ?? ''} />
  );
}

function MediaPicker({
  media,
  label,
  accept = 'image/*,video/*',
  onChange,
}: {
  media?: EditorMedia;
  label: string;
  accept?: string;
  onChange: (media?: EditorMedia) => void;
}) {
  const [error, setError] = useState('');

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');
    if (file && file.size > 50 * 1024 * 1024) {
      setError('Il file supera il limite di 50 MB.');
    } else if (file && accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Seleziona un file immagine.');
    } else if (file) {
      onChange(mediaFromFile(file));
    }
    event.target.value = '';
  };

  return (
    <div className="border border-white/10 bg-[#1b1b1b]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MediaPreview media={media} className="absolute inset-0" />
        <span className="absolute left-2.5 top-2.5 bg-[#1a1a1a]/70 px-2 py-1 text-[9px] uppercase text-white/70">{label}</span>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 p-2.5">
        <label className="min-w-0 flex-1 cursor-pointer truncate text-xs text-white/60 transition hover:text-white">
          <input className="sr-only" type="file" accept={accept} onChange={handleFile} />
          {media?.name ?? (media ? media.src.split('/').pop() : 'Carica immagine o video')}
        </label>
        {media && (
          <button className="px-1 text-lg leading-none text-white/35 hover:text-[#ff3700]" type="button" onClick={() => onChange(undefined)} aria-label={`Rimuovi ${label.toLowerCase()}`}>
            ×
          </button>
        )}
      </div>
      {error && <p className="m-0 border-t border-[#ff3700]/30 px-2.5 py-2 text-[10px] text-[#ff7250]" role="alert">{error}</p>}
    </div>
  );
}

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  block: EditorBlock;
  index: number;
  total: number;
  onChange: (block: EditorBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const names = {
    'two-media': 'Due media',
    'full-media': 'Media 100vw',
    'media-text': 'Media + testo',
  } as const;

  return (
    <article className={`${surface} overflow-hidden`}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-6 place-items-center rounded-full bg-white/8 text-[10px] text-white/50">{index + 1}</span>
          <h3 className="text-sm font-medium">{names[block.type]}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="size-8 text-white/45 hover:bg-white/5 hover:text-white disabled:opacity-20" type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Sposta il blocco in alto">↑</button>
          <button className="size-8 text-white/45 hover:bg-white/5 hover:text-white disabled:opacity-20" type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Sposta il blocco in basso">↓</button>
          <button className="size-8 text-lg text-white/45 hover:bg-[#ff3700]/10 hover:text-[#ff3700]" type="button" onClick={onRemove} aria-label="Elimina il blocco">×</button>
        </div>
      </header>

      <div className="p-4">
        {block.type === 'two-media' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <MediaPicker media={block.left} label="Sinistra" onChange={(left) => onChange({ ...block, left })} />
            <MediaPicker media={block.right} label="Destra" onChange={(right) => onChange({ ...block, right })} />
          </div>
        )}

        {block.type === 'full-media' && (
          <MediaPicker media={block.media} label="Larghezza piena" onChange={(media) => onChange({ ...block, media })} />
        )}

        {block.type === 'media-text' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={eyebrow}>Posizione media</p>
              <div className="flex border border-white/12 p-0.5">
                {(['left', 'right'] as const).map((side) => (
                  <button
                    className={`px-3 py-1.5 text-[10px] uppercase transition ${block.mediaSide === side ? 'bg-[#ff3700] text-white' : 'text-white/40 hover:text-white'}`}
                    type="button"
                    key={side}
                    onClick={() => onChange({ ...block, mediaSide: side })}
                  >
                    {side === 'left' ? 'Sinistra' : 'Destra'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <MediaPicker media={block.media} label={block.mediaSide === 'left' ? 'Media a sinistra' : 'Media a destra'} onChange={(media) => onChange({ ...block, media })} />
              <div className="space-y-3">
                <label className="block space-y-2">
                  <span className={eyebrow}>Titolo del blocco</span>
                  <input className={field} value={block.title} placeholder="Titolo facoltativo" onChange={(event) => onChange({ ...block, title: event.target.value })} />
                </label>
                <label className="block space-y-2">
                  <span className={eyebrow}>Testo</span>
                  <textarea className={`${field} min-h-36 resize-y`} value={block.text} placeholder="Inserisci il contenuto del blocco" onChange={(event) => onChange({ ...block, text: event.target.value })} />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectPreview({ project, mobile }: { project: EditorProject; mobile: boolean }) {
  return (
    <div className={`mx-auto overflow-hidden bg-[#1a1a1a] shadow-2xl shadow-[#1a1a1a]/30 transition-[width] ${mobile ? 'w-[360px] max-w-full' : 'w-full'}`}>
      <div className={`relative overflow-hidden bg-[#1a1a1a] ${mobile ? 'aspect-[4/5]' : 'aspect-[16/8]'}`}>
        <MediaPreview media={project.hero} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-[#1a1a1a]/15" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="mb-2 text-[9px] uppercase text-white/60">{project.year || 'Anno'} · {project.client || 'Cliente'}</p>
          <h2 className={`${mobile ? 'text-4xl' : 'text-5xl xl:text-6xl'} max-w-3xl font-extralight leading-[0.92]`}>{project.title || 'Progetto senza titolo'}</h2>
        </div>
      </div>

      <div className={`${mobile ? 'grid-cols-1' : 'grid-cols-3'} grid bg-[#ff3700] text-white`}>
        <div className="min-h-32 border-b border-white/20 p-5 sm:border-b-0 sm:border-r">
          <p className="mb-5 text-[9px] uppercase text-white/55">Challenge</p>
          <p className="text-sm leading-relaxed">{project.challenge || 'La challenge del progetto apparirà qui.'}</p>
        </div>
        <div className="min-h-32 border-b border-white/20 p-5 sm:border-b-0 sm:border-r">
          <p className="mb-5 text-[9px] uppercase text-white/55">Client</p>
          <p className="text-sm">{project.client || '—'}</p>
        </div>
        <div className="min-h-32 p-5">
          <p className="mb-5 text-[9px] uppercase text-white/55">Services</p>
          <p className="text-sm leading-relaxed">{project.services.join(' / ') || '—'}</p>
        </div>
      </div>

      <div>
        {project.blocks.length === 0 && (
          <div className="grid min-h-60 place-items-center border-x border-b border-white/8 p-8 text-center text-xs text-white/30">
            Aggiungi il primo blocco per comporre il progetto.
          </div>
        )}

        {project.blocks.map((block) => {
          if (block.type === 'full-media') {
            return <MediaPreview key={block.id} media={block.media} className="aspect-video" />;
          }

          if (block.type === 'two-media') {
            return (
              <div className={`${mobile ? 'grid-cols-1' : 'grid-cols-2'} grid`} key={block.id}>
                <MediaPreview media={block.left} className="aspect-[4/3]" />
                <MediaPreview media={block.right} className="aspect-[4/3]" />
              </div>
            );
          }

          const mediaPanel = <MediaPreview media={block.media} className="min-h-56" />;
          const copyPanel = (
            <div className="flex min-h-56 flex-col justify-center bg-[#efeee9] p-6 text-[#1a1a1a]">
              {block.title && <h3 className="mb-5 text-[10px] font-semibold uppercase">{block.title}</h3>}
              <p className="whitespace-pre-line text-sm leading-relaxed">{block.text || 'Il testo del blocco apparirà qui.'}</p>
            </div>
          );

          return (
            <div className={`${mobile ? 'grid-cols-1' : 'grid-cols-2'} grid`} key={block.id}>
              {block.mediaSide === 'left' ? <>{mediaPanel}{copyPanel}</> : <>{copyPanel}{mediaPanel}</>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditorLoadState({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#151515] px-6 text-center text-sm text-white/55">
      {children}
    </main>
  );
}

function ProjectEditorWorkspace({
  authEmail,
  isSigningOut,
  onSignOut,
  language,
  onLanguageChange,
}: {
  authEmail: string;
  isSigningOut: boolean;
  onSignOut: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  usePageMeta('Project editor — Nebbia', 'Editor locale per creare e modificare i progetti Nebbia.');

  const queryOptions = localizedProjectsQueryOptions(language);
  const projectsQuery = useQuery(queryOptions);
  const queryClient = useQueryClient();
  const hydratedFromSupabase = useRef(false);
  const [projects, setProjects] = useState<EditorProject[]>([]);
  const [activeId, setActiveId] = useState('');
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set());
  const [search, setSearch] = useState('');
  const [serviceDraft, setServiceDraft] = useState('');
  const [mobilePreview, setMobilePreview] = useState(false);
  const [notice, setNotice] = useState('');
  const saveProjectMutation = useMutation({
    mutationFn: (project: EditorProject) => persistProject(project, language),
    onSuccess: async ({ work, savedProject }, sourceProject) => {
      setProjects((current) => current.map((project) => project.id === sourceProject.id ? savedProject : project));
      setActiveId(savedProject.id);
      setDirtyIds((current) => {
        const next = new Set(current);
        next.delete(sourceProject.id);
        next.delete(savedProject.id);
        return next;
      });
      queryClient.setQueryData<Work[]>(queryOptions.queryKey, (current = []) => {
        const sourceIndex = current.findIndex((project) => project.slug === sourceProject.sourceSlug);
        if (sourceIndex < 0) return [...current, work];
        const next = [...current];
        next[sourceIndex] = work;
        return next;
      });
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setNotice(sourceProject.isNew
        ? `Progetto creato in ${language === 'en' ? 'Projects_EN' : 'Projects'}.`
        : `Progetto aggiornato in ${language === 'en' ? 'Projects_EN' : 'Projects'}.`);
    },
    onError: (error) => {
      setNotice(error instanceof Error ? error.message : 'Salvataggio non riuscito.');
    },
  });

  useEffect(() => {
    if (!projectsQuery.data || hydratedFromSupabase.current) return;

    const loadedProjects = projectsQuery.data.map(projectFromWork);
    setProjects(loadedProjects);
    setActiveId(loadedProjects[0]?.id ?? '');
    hydratedFromSupabase.current = true;
  }, [projectsQuery.data]);

  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0];
  const visibleProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? projects.filter((project) => `${project.title} ${project.client} ${project.slug}`.toLowerCase().includes(term))
      : projects;
  }, [projects, search]);

  if (projectsQuery.isPending || (!hydratedFromSupabase.current && projectsQuery.data)) {
    return <EditorLoadState>Caricamento progetti…</EditorLoadState>;
  }

  if (projectsQuery.isError) {
    return (
      <EditorLoadState>
        <div>
          <p className="m-0">Non è stato possibile caricare i progetti.</p>
          <button className="mt-4 border border-white/20 px-4 py-2 text-xs uppercase transition hover:border-[#ff3700] hover:text-[#ff3700]" type="button" onClick={() => projectsQuery.refetch()}>Riprova</button>
        </div>
      </EditorLoadState>
    );
  }

  if (!activeProject) return <EditorLoadState>Nessun progetto disponibile.</EditorLoadState>;

  const markDirty = (projectId: string) => {
    setDirtyIds((current) => new Set(current).add(projectId));
    setNotice('');
  };

  const updateProject = (update: (project: EditorProject) => EditorProject) => {
    setProjects((current) => current.map((project) => project.id === activeProject.id ? update(project) : project));
    markDirty(activeProject.id);
  };

  const addProject = () => {
    const project = createEmptyProject(language);
    setProjects((current) => [project, ...current]);
    setActiveId(project.id);
    setServiceDraft('');
    markDirty(project.id);
  };

  const addService = () => {
    const service = serviceDraft.trim();
    if (!service || activeProject.services.includes(service)) return;
    updateProject((project) => ({ ...project, services: [...project.services, service] }));
    setServiceDraft('');
  };

  const addBlock = (type: EditorBlock['type']) => {
    const sectionId = makeId('section');
    const block: EditorBlock = type === 'two-media'
      ? { id: makeId('block'), sectionId, type: 'two-media' }
      : type === 'full-media'
        ? { id: makeId('block'), sectionId, type: 'full-media' }
        : { id: makeId('block'), sectionId, type: 'media-text', mediaSide: 'left', title: '', text: '' };
    updateProject((project) => ({ ...project, blocks: [...project.blocks, block] }));
  };

  const updateBlock = (blockId: string, nextBlock: EditorBlock) => {
    updateProject((project) => ({
      ...project,
      blocks: project.blocks.map((block) => block.id === blockId ? nextBlock : block),
    }));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    updateProject((project) => {
      const next = [...project.blocks];
      const target = index + direction;
      if (target < 0 || target >= next.length) return project;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...project, blocks: next };
    });
  };

  const saveDraft = () => {
    const validationError = validateProject(activeProject);
    if (validationError) {
      setNotice(validationError);
      return;
    }
    if (projects.some((project) => project.id !== activeProject.id && project.slug === activeProject.slug)) {
      setNotice('Esiste già un progetto con questo slug.');
      return;
    }

    setNotice('Salvataggio in corso…');
    saveProjectMutation.mutate(activeProject);
  };

  return (
    <main className="min-h-screen bg-[#151515] text-white">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#151515]/95 px-4 backdrop-blur-xl lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <a className="text-lg font-semibold" href="/" aria-label="Torna al sito Nebbia">nebbia.</a>
          <span className="h-5 w-px bg-white/15" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Project editor</p>
            <p className="hidden text-[10px] uppercase text-white/35 sm:block">Dati caricati da Supabase</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-white/15 p-0.5" aria-label="Lingua dei contenuti">
            {(['it', 'en'] as const).map((option) => (
              <button
                className={`px-2.5 py-1.5 text-[10px] font-medium uppercase transition ${language === option ? 'bg-[#ff3700] text-white' : 'text-white/40 hover:text-white'}`}
                type="button"
                key={option}
                onClick={() => onLanguageChange(option)}
                aria-pressed={language === option}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="hidden max-w-44 truncate text-[10px] text-white/35 xl:block">{authEmail}</span>
          {activeProject.sourceSlug && (
            <a className="hidden border border-white/15 px-3.5 py-2 text-xs text-white/60 transition hover:border-white/35 hover:text-white sm:block" href={workPath(language, activeProject.sourceSlug)} target="_blank" rel="noreferrer">Vedi pagina ↗</a>
          )}
          <button
            className="border border-white/15 px-3.5 py-2 text-xs text-white/60 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Uscita…' : 'Esci'}
          </button>
          <button
            className="bg-[#ff3700] px-4 py-2 text-xs font-medium transition hover:bg-[#ff4d1a] disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-white/25"
            type="button"
            onClick={saveDraft}
            disabled={!dirtyIds.has(activeProject.id) || saveProjectMutation.isPending}
          >
            {saveProjectMutation.isPending ? 'Salvataggio…' : 'Salva progetto'}
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[250px_minmax(480px,1fr)_minmax(380px,0.85fr)]">
        <aside className="border-b border-white/10 bg-[#191919] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-4">
            <button className="w-full bg-white px-4 py-3 text-sm font-medium text-[#181818] transition hover:bg-[#ff3700] hover:text-white" type="button" onClick={addProject}>＋ Nuovo progetto</button>
            <label className="mt-3 block">
              <span className="sr-only">Cerca progetti</span>
              <input className={`${field} py-2.5`} value={search} placeholder="Cerca progetti…" onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>
          <div className="max-h-64 overflow-y-auto p-2 lg:max-h-[calc(100vh-10.7rem)]">
            {visibleProjects.map((project) => {
              const selected = project.id === activeProject.id;
              const dirty = dirtyIds.has(project.id);
              return (
                <button
                  className={`mb-1 flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition ${selected ? 'bg-[#ff3700] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  type="button"
                  key={project.id}
                  onClick={() => { setActiveId(project.id); setServiceDraft(''); setNotice(''); }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">{project.title}</span>
                    <span className={`mt-1 block truncate text-[10px] ${selected ? 'text-white/60' : 'text-white/30'}`}>{project.client || 'Nessun cliente'}</span>
                  </span>
                  {(project.isNew || dirty) && <span className={`mt-0.5 size-1.5 shrink-0 rounded-full ${selected ? 'bg-white' : 'bg-[#ff3700]'}`} aria-label={project.isNew ? 'Nuovo progetto' : 'Modificato'} />}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0 border-white/10 lg:border-r">
          <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
            <div>
              <p className={eyebrow}>Contenuti del progetto</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <h1 className="text-3xl font-extralight">{activeProject.title}</h1>
                <span className="text-[10px] uppercase text-white/35">{activeProject.blocks.length} blocchi</span>
              </div>
              {notice && <p className="mt-4 border-l-2 border-[#ff3700] pl-3 text-xs leading-relaxed text-white/55">{notice}</p>}
            </div>

            <section className={`${surface} p-4 sm:p-5`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-medium">Informazioni</h2>
                <span className={eyebrow}>01</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className={eyebrow}>Titolo progetto</span>
                  <input className={field} value={activeProject.title} onChange={(event) => updateProject((project) => ({ ...project, title: event.target.value }))} />
                </label>
                <label className="block space-y-2">
                  <span className={eyebrow}>Slug</span>
                  <div className="flex">
                    <input className={`${field} min-w-0 border-r-0`} value={activeProject.slug} placeholder="nome-progetto" onChange={(event) => updateProject((project) => ({ ...project, slug: slugify(event.target.value) }))} />
                    <button className="border border-white/15 px-3 text-[10px] uppercase text-white/45 hover:border-[#ff3700] hover:text-white" type="button" onClick={() => updateProject((project) => ({ ...project, slug: slugify(project.title) }))}>Genera</button>
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className={eyebrow}>Anno</span>
                  <input className={field} value={activeProject.year} placeholder="2025 oppure 2023 – in corso" onChange={(event) => updateProject((project) => ({ ...project, year: event.target.value }))} />
                </label>
                <label className="block space-y-2 sm:col-span-2">
                  <span className={eyebrow}>Client</span>
                  <input className={field} value={activeProject.client} placeholder="Nome del cliente" onChange={(event) => updateProject((project) => ({ ...project, client: event.target.value }))} />
                </label>
                <label className="block space-y-2 sm:col-span-2">
                  <span className={eyebrow}>Challenge</span>
                  <textarea className={`${field} min-h-32 resize-y`} value={activeProject.challenge} placeholder="Descrivi l’obiettivo e la sfida del progetto" onChange={(event) => updateProject((project) => ({ ...project, challenge: event.target.value }))} />
                </label>
              </div>
            </section>

            <section className={`${surface} p-4 sm:p-5`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-medium">Anteprima e hero</h2>
                <span className={eyebrow}>02</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <MediaPicker media={activeProject.image} label="Immagine di anteprima" accept="image/*" onChange={(image) => updateProject((project) => ({ ...project, image }))} />
                <MediaPicker media={activeProject.hero} label="Hero image / video" onChange={(hero) => updateProject((project) => ({ ...project, hero }))} />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-white/35">Ogni nuovo file viene caricato nella cartella del progetto su Supabase al momento del salvataggio. Dimensione massima: 50 MB.</p>
            </section>

            <section className={`${surface} p-4 sm:p-5`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-medium">Services</h2>
                <span className={eyebrow}>03</span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {activeProject.services.map((service) => (
                  <span className="flex items-center gap-2 border border-white/15 px-3 py-2 text-xs" key={service}>
                    {service}
                    <button className="text-base leading-none text-white/35 hover:text-[#ff3700]" type="button" onClick={() => updateProject((project) => ({ ...project, services: project.services.filter((item) => item !== service) }))} aria-label={`Rimuovi ${service}`}>×</button>
                  </span>
                ))}
                {activeProject.services.length === 0 && <span className="text-xs text-white/30">Nessun servizio inserito.</span>}
              </div>
              <div className="flex">
                <input
                  className={`${field} min-w-0 border-r-0`}
                  value={serviceDraft}
                  placeholder="Aggiungi un servizio"
                  onChange={(event) => setServiceDraft(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addService(); } }}
                />
                <button className="border border-white/15 px-4 text-xs text-white/60 hover:border-[#ff3700] hover:text-white" type="button" onClick={addService}>Aggiungi</button>
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className={eyebrow}>04</p>
                  <h2 className="mt-2 text-xl font-extralight">Composizione pagina</h2>
                </div>
                <span className="text-[10px] uppercase text-white/35">Ordine dall’alto</span>
              </div>

              <div className="space-y-4">
                {activeProject.blocks.map((block, index) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    index={index}
                    total={activeProject.blocks.length}
                    onChange={(nextBlock) => updateBlock(block.id, nextBlock)}
                    onMove={(direction) => moveBlock(index, direction)}
                    onRemove={() => updateProject((project) => ({ ...project, blocks: project.blocks.filter((item) => item.id !== block.id) }))}
                  />
                ))}

                {activeProject.blocks.length === 0 && (
                  <div className="border border-dashed border-white/15 px-6 py-12 text-center">
                    <p className="text-sm text-white/55">La pagina non contiene ancora blocchi.</p>
                    <p className="mt-2 text-xs text-white/30">Scegli una struttura qui sotto per iniziare.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button className="border border-white/15 bg-white/[0.025] px-3 py-4 text-left transition hover:border-[#ff3700] hover:bg-[#ff3700]/5" type="button" onClick={() => addBlock('two-media')}>
                  <span className="mb-4 grid grid-cols-2 gap-1"><i className="h-7 bg-white/12" /><i className="h-7 bg-white/12" /></span>
                  <span className="block text-xs font-medium">Due media</span>
                  <span className="mt-1 block text-[10px] text-white/35">Sinistra + destra</span>
                </button>
                <button className="border border-white/15 bg-white/[0.025] px-3 py-4 text-left transition hover:border-[#ff3700] hover:bg-[#ff3700]/5" type="button" onClick={() => addBlock('full-media')}>
                  <span className="mb-4 block h-7 bg-white/12" />
                  <span className="block text-xs font-medium">Media 100vw</span>
                  <span className="mt-1 block text-[10px] text-white/35">Larghezza piena</span>
                </button>
                <button className="border border-white/15 bg-white/[0.025] px-3 py-4 text-left transition hover:border-[#ff3700] hover:bg-[#ff3700]/5" type="button" onClick={() => addBlock('media-text')}>
                  <span className="mb-4 grid grid-cols-2 gap-1"><i className="h-7 bg-white/12" /><i className="flex h-7 flex-col justify-center gap-1"><b className="h-1 bg-white/12" /><b className="h-1 bg-white/12" /></i></span>
                  <span className="block text-xs font-medium">Media + testo</span>
                  <span className="mt-1 block text-[10px] text-white/35">Lato configurabile</span>
                </button>
              </div>
            </section>
          </div>
        </section>

        <aside className="min-w-0 bg-[#202020] p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className={eyebrow}>Anteprima live</p>
              <p className="mt-1 text-xs text-white/35">Aggiornata mentre scrivi</p>
            </div>
            <div className="flex border border-white/12 p-0.5">
              <button className={`px-2.5 py-1.5 text-[10px] uppercase ${!mobilePreview ? 'bg-white text-[#1a1a1a]' : 'text-white/40'}`} type="button" onClick={() => setMobilePreview(false)} aria-label="Anteprima desktop">Desktop</button>
              <button className={`px-2.5 py-1.5 text-[10px] uppercase ${mobilePreview ? 'bg-white text-[#1a1a1a]' : 'text-white/40'}`} type="button" onClick={() => setMobilePreview(true)} aria-label="Anteprima mobile">Mobile</button>
            </div>
          </div>
          <ProjectPreview project={activeProject} mobile={mobilePreview} />
        </aside>
      </div>
    </main>
  );
}

export function ProjectEditorPage(props: {
  authEmail: string;
  isSigningOut: boolean;
  onSignOut: () => void;
}) {
  const [language, setLanguage] = useState<Language>('it');

  return (
    <ProjectEditorWorkspace
      key={language}
      {...props}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}
