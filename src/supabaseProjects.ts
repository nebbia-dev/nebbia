import { queryOptions } from '@tanstack/react-query';
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

async function fetchProjects(signal?: AbortSignal): Promise<Work[]> {
  const { url, publishableKey } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${encodeURIComponent('Projects')}`, url);
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
      return leftPosition - rightPosition || left.title.localeCompare(right.title, 'it');
    });
}

export const projectsQueryOptions = queryOptions({
  queryKey: ['supabase', 'projects'],
  queryFn: ({ signal }) => fetchProjects(signal),
  staleTime: 5 * 60 * 1_000,
});

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
): Promise<Work> {
  const { url } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${encodeURIComponent('Projects')}`, url);
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
