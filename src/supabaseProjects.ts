import { queryOptions } from '@tanstack/react-query';
import type { Language } from './language';
import type { Credit, ProjectSection, Work } from './projectTypes';
import { getSupabaseConfig } from './supabaseConfig';

type ProjectRow = {
  slug: string;
  title: string;
  image: string;
  hero: string;
  services: string[] | null;
  year: string;
  client: string;
  challenge: string;
  sections: ProjectSection[] | null;
  credits: Credit[] | null;
};

export type ProjectWriteInput = {
  slug: string;
  title: string;
  image: string;
  hero: string;
  services: string[];
  year: string;
  client: string;
  challenge: string;
  sections: ProjectSection[];
};

const projectOrder = [
  'cremonese-120',
  'martinorossi-vr',
  'univet-casco-laser',
  'eventi-aic',
  'idee-mani-tempo',
  'sellago',
  'cremonese-maglie',
  'spinagallo',
  'jmg-ar',
  'pro-cremona',
  'festival-monteverdi',
  'mina-virtual-traveler',
  'c2-corporate',
] as const;

const featuredProjectSlugs = projectOrder.slice(0, 3);
const projectPosition = new Map<string, number>(projectOrder.map((slug, index) => [slug, index]));

function requestHeaders(publishableKey: string, additionalHeaders?: HeadersInit) {
  return {
    apikey: publishableKey,
    ...Object.fromEntries(new Headers(additionalHeaders).entries()),
  };
}

async function authenticatedRequestHeaders(additionalHeaders?: HeadersInit) {
  const { publishableKey } = getSupabaseConfig();
  const { supabase } = await import('./supabaseClient');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Sessione scaduta. Accedi nuovamente all’editor.');

  return requestHeaders(publishableKey, {
    Authorization: `Bearer ${data.session.access_token}`,
    ...Object.fromEntries(new Headers(additionalHeaders).entries()),
  });
}

function inferMediaType(src: string): Work['heroType'] {
  return /\.(?:mp4|webm|mov)(?:\?|$)/i.test(src) ? 'video' : 'image';
}

function projectFromRow(row: ProjectRow): Work {
  return {
    slug: row.slug,
    title: row.title,
    image: row.image,
    hero: row.hero,
    heroType: inferMediaType(row.hero),
    services: (row.services ?? []).join(' / '),
    year: row.year,
    client: row.client,
    challenge: row.challenge,
    statement: row.challenge,
    sections: row.sections ?? [],
    media: [],
    credits: row.credits?.length ? row.credits : undefined,
  };
}

export function projectTableName(language: Language) {
  return language === 'en' ? 'Projects_EN' : 'Projects';
}

async function fetchProjects(language: Language, signal?: AbortSignal): Promise<Work[]> {
  const { url, publishableKey } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${encodeURIComponent(projectTableName(language))}`, url);
  endpoint.searchParams.set(
    'select',
    'slug,title,image,hero,services,year,client,challenge,sections,credits',
  );

  const response = await fetch(endpoint, {
    headers: { apikey: publishableKey },
    signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Caricamento progetti fallito (${response.status}): ${message}`);
  }

  const rows = await response.json() as ProjectRow[];
  return rows
    .map(projectFromRow)
    .sort((left, right) => {
      const leftPosition = projectPosition.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
      const rightPosition = projectPosition.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
      return leftPosition - rightPosition || left.title.localeCompare(right.title, language);
    });
}

export function localizedProjectsQueryOptions(language: Language) {
  return queryOptions({
    queryKey: ['supabase', 'projects', language],
    queryFn: ({ signal }) => fetchProjects(language, signal),
    staleTime: 5 * 60 * 1_000,
  });
}

export const projectsQueryOptions = localizedProjectsQueryOptions('it');

export function getFeaturedProjects(projects: Work[]) {
  return featuredProjectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Work => Boolean(project));
}

export async function uploadProjectMedia(file: File, slug: string): Promise<string> {
  if (file.size > 50 * 1024 * 1024) {
    throw new Error(`${file.name} supera il limite di 50 MB.`);
  }

  const { url } = getSupabaseConfig();
  const safeName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const objectPath = `${slug}/${crypto.randomUUID()}-${safeName || 'media'}`;
  const endpoint = `${url}/storage/v1/object/${encodeURIComponent('Projects Media')}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: await authenticatedRequestHeaders({
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    }),
    body: file,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Caricamento di ${file.name} fallito (${response.status}): ${message}`);
  }

  return `${url}/storage/v1/object/public/${encodeURIComponent('Projects Media')}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
}

export async function saveProject(
  project: ProjectWriteInput,
  sourceSlug?: string,
  language: Language = 'it',
): Promise<Work> {
  const { url } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${encodeURIComponent(projectTableName(language))}`, url);
  const isUpdate = Boolean(sourceSlug);
  if (sourceSlug) endpoint.searchParams.set('slug', `eq.${sourceSlug}`);

  const response = await fetch(endpoint, {
    method: isUpdate ? 'PATCH' : 'POST',
    headers: await authenticatedRequestHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${isUpdate ? 'Aggiornamento' : 'Creazione'} progetto fallito (${response.status}): ${message}`);
  }

  const rows = await response.json() as ProjectRow[];
  if (!rows[0]) throw new Error('Supabase non ha restituito il progetto salvato.');
  return projectFromRow(rows[0]);
}

export async function syncProjectMediaToOtherLanguage(
  project: Pick<ProjectWriteInput, 'slug' | 'image' | 'hero' | 'sections'>,
  sourceSlug: string | undefined,
  language: Language,
): Promise<boolean> {
  const { url } = getSupabaseConfig();
  const targetLanguage: Language = language === 'en' ? 'it' : 'en';
  const targetTable = projectTableName(targetLanguage);
  const lookupSlug = sourceSlug ?? project.slug;
  const lookupEndpoint = new URL(`/rest/v1/${encodeURIComponent(targetTable)}`, url);
  lookupEndpoint.searchParams.set('slug', `eq.${lookupSlug}`);
  lookupEndpoint.searchParams.set('select', 'slug,sections');

  const lookupResponse = await fetch(lookupEndpoint, {
    headers: await authenticatedRequestHeaders(),
  });

  if (lookupResponse.status === 404) return false;
  if (!lookupResponse.ok) {
    throw new Error(`Sincronizzazione media fallita (${lookupResponse.status}): ${await lookupResponse.text()}`);
  }

  const [targetProject] = await lookupResponse.json() as Pick<ProjectRow, 'slug' | 'sections'>[];
  if (!targetProject) return false;

  const targetSections = targetProject.sections ?? [];
  const syncedSections = project.sections.map((section, index) => ({
    ...section,
    title: targetSections[index]?.title ?? '',
    paragraphs: targetSections[index]?.paragraphs ?? [],
  }));
  const updateEndpoint = new URL(`/rest/v1/${encodeURIComponent(targetTable)}`, url);
  updateEndpoint.searchParams.set('slug', `eq.${lookupSlug}`);

  const updateResponse = await fetch(updateEndpoint, {
    method: 'PATCH',
    headers: await authenticatedRequestHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    }),
    body: JSON.stringify({
      slug: project.slug,
      image: project.image,
      hero: project.hero,
      sections: syncedSections,
    }),
  });

  if (!updateResponse.ok) {
    throw new Error(`Sincronizzazione media fallita (${updateResponse.status}): ${await updateResponse.text()}`);
  }

  return true;
}
