import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { projectTranslationsEn } from './project-translations-en.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const dryRun = process.argv.includes('--dry-run');

function loadEnv(contents) {
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 1) continue;
    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

await loadEnv(await readFile(resolve(projectRoot, '.env.local'), 'utf8'));

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error('Configurazione Supabase incompleta in .env.local');
}

const headers = {
  apikey: secretKey,
  Authorization: `Bearer ${secretKey}`,
  'Content-Type': 'application/json',
};

const sourceResponse = await fetch(
  `${supabaseUrl}/rest/v1/${encodeURIComponent('Projects')}?select=slug,title,image,hero,services,year,client,challenge,sections,credits`,
  { headers },
);

if (!sourceResponse.ok) {
  throw new Error(`Lettura Projects fallita: ${sourceResponse.status} ${await sourceResponse.text()}`);
}

const sourceRows = await sourceResponse.json();
const rowsBySlug = new Map(sourceRows.map((row) => [row.slug, row]));

const englishRows = projectTranslationsEn.map((translation) => {
  const source = rowsBySlug.get(translation.slug);
  if (!source) throw new Error(`Progetto italiano non trovato: ${translation.slug}`);
  if (!Array.isArray(source.sections) || source.sections.length !== translation.sections.length) {
    throw new Error(`Numero di sezioni non corrispondente per ${translation.slug}`);
  }

  return {
    slug: translation.slug,
    title: translation.title,
    image: source.image,
    hero: source.hero,
    services: translation.services,
    year: translation.year,
    client: translation.client,
    challenge: translation.challenge,
    sections: source.sections.map((section, index) => ({
      ...section,
      title: translation.sections[index].title,
      paragraphs: translation.sections[index].paragraphs,
    })),
    credits: translation.credits ?? source.credits ?? null,
  };
});

if (englishRows.length !== sourceRows.length) {
  const translatedSlugs = new Set(englishRows.map((row) => row.slug));
  const missing = sourceRows.filter((row) => !translatedSlugs.has(row.slug)).map((row) => row.slug);
  throw new Error(`Traduzioni mancanti per: ${missing.join(', ')}`);
}

if (dryRun) {
  console.log(`Verifica completata: ${englishRows.length} progetti pronti per Projects_EN.`);
  process.exit(0);
}

const importResponse = await fetch(
  `${supabaseUrl}/rest/v1/${encodeURIComponent('Projects_EN')}?on_conflict=slug`,
  {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(englishRows),
  },
);

if (!importResponse.ok) {
  throw new Error(`Import Projects_EN fallito: ${importResponse.status} ${await importResponse.text()}`);
}

const importedRows = await importResponse.json();

const importedBySlug = new Map(importedRows.map((row) => [row.slug, row]));
for (const source of sourceRows) {
  const imported = importedBySlug.get(source.slug);
  if (!imported) throw new Error(`Verifica fallita: ${source.slug} non è presente in Projects_EN`);
  if (imported.image !== source.image || imported.hero !== source.hero) {
    throw new Error(`Verifica fallita: i media principali non coincidono per ${source.slug}`);
  }

  const sourceBlocks = source.sections.map((section) => section.blocks ?? []);
  const importedBlocks = imported.sections.map((section) => section.blocks ?? []);
  if (JSON.stringify(importedBlocks) !== JSON.stringify(sourceBlocks)) {
    throw new Error(`Verifica fallita: il layout o i media delle sezioni non coincidono per ${source.slug}`);
  }
}

console.log(`Import e verifica completati: ${importedRows.length} progetti tradotti, media e layout condivisi.`);
