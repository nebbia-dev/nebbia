import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const projectRoot = resolve(import.meta.dirname, '..');
const envPath = join(projectRoot, '.env.local');
const mediaRoot = join(projectRoot, 'public', 'projects');
const maxFileSize = 50 * 1024 * 1024;
const dataOnly = process.argv.includes('--data-only');

const contentTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

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

function encodePath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

function publicObjectUrl(supabaseUrl, bucketId, objectPath) {
  return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketId)}/${encodePath(objectPath)}`;
}

function localMediaPathToObjectPath(src) {
  if (!src.startsWith('/projects/')) {
    throw new Error(`Percorso media inatteso: ${src}`);
  }
  return src.slice('/projects/'.length);
}

function replaceMediaUrls(value, toPublicUrl) {
  if (Array.isArray(value)) return value.map((item) => replaceMediaUrls(item, toPublicUrl));
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === 'src' && typeof item === 'string'
        ? toPublicUrl(localMediaPathToObjectPath(item))
        : replaceMediaUrls(item, toPublicUrl),
    ]),
  );
}

async function walkMediaFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkMediaFiles(entryPath));
    else if (contentTypes[extname(entry.name).toLowerCase()]) files.push(entryPath);
  }
  return files;
}

async function loadWorks() {
  const outputDirectory = await mkdtemp(join(tmpdir(), 'nebbia-data-'));
  try {
    await execFileAsync(join(projectRoot, 'node_modules', '.bin', 'tsc'), [
      'src/data.ts',
      'src/projectMedia.ts',
      'src/projectLayouts.ts',
      '--outDir', outputDirectory,
      '--module', 'commonjs',
      '--moduleResolution', 'node',
      '--target', 'ES2022',
      '--skipLibCheck',
      '--esModuleInterop',
    ], { cwd: projectRoot });

    const require = createRequire(import.meta.url);
    return require(join(outputDirectory, 'data.js')).works;
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}

async function uploadMedia({ filePath, supabaseUrl, secretKey, bucketId }) {
  const objectPath = relative(mediaRoot, filePath).split(sep).join('/');
  const fileStats = await stat(filePath);
  if (fileStats.size > maxFileSize) {
    throw new Error(`${objectPath} supera il limite di 50 MiB`);
  }

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucketId)}/${encodePath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        apikey: secretKey,
        'Content-Type': contentTypes[extname(filePath).toLowerCase()],
        'x-upsert': 'true',
      },
      body: await readFile(filePath),
    },
  );

  if (!response.ok) {
    throw new Error(`Upload fallito per ${objectPath}: ${response.status} ${await response.text()}`);
  }
}

async function runPool(items, concurrency, task) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      await task(items[index], index);
    }
  });
  await Promise.all(workers);
}

await loadEnv(await readFile(envPath, 'utf8'));

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const secretKey = process.env.SUPABASE_SECRET_KEY;
const bucketId = process.env.SUPABASE_BUCKET_ID;
const tableName = process.env.SUPABASE_PROJECTS_TABLE;

if (!supabaseUrl || !secretKey || !bucketId || !tableName) {
  throw new Error('Configurazione Supabase incompleta in .env.local');
}

const [works, mediaFiles] = await Promise.all([loadWorks(), walkMediaFiles(mediaRoot)]);
const referencedMedia = new Set();
const collectMedia = (value) => {
  if (Array.isArray(value)) return value.forEach(collectMedia);
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (key === 'src' && typeof item === 'string') referencedMedia.add(localMediaPathToObjectPath(item));
    else collectMedia(item);
  }
};

for (const work of works) {
  collectMedia({ image: { src: work.image }, hero: { src: work.hero }, sections: work.sections });
}

for (const objectPath of referencedMedia) {
  await stat(join(mediaRoot, objectPath));
}

let uploaded = 0;
if (!dataOnly) {
  console.log(`Caricamento di ${mediaFiles.length} media in ${works.length} cartelle progetto…`);
  await runPool(mediaFiles, 4, async (filePath) => {
    await uploadMedia({ filePath, supabaseUrl, secretKey, bucketId });
    uploaded += 1;
    if (uploaded % 10 === 0 || uploaded === mediaFiles.length) {
      console.log(`Media caricati: ${uploaded}/${mediaFiles.length}`);
    }
  });
} else {
  console.log('Aggiornamento dei soli dati; caricamento media ignorato.');
}

const toPublicUrl = (objectPath) => publicObjectUrl(supabaseUrl, bucketId, objectPath);
const rows = works.map((work) => {
  return {
    slug: work.slug,
    title: work.title,
    image: toPublicUrl(localMediaPathToObjectPath(work.image)),
    hero: toPublicUrl(localMediaPathToObjectPath(work.hero)),
    services: work.services.split(/\s+\/\s+/).map((service) => service.trim()).filter(Boolean),
    year: work.year,
    client: work.client,
    challenge: work.challenge,
    sections: replaceMediaUrls(work.sections, toPublicUrl),
  };
});

const tableResponse = await fetch(
  `${supabaseUrl}/rest/v1/${encodeURIComponent(tableName)}?on_conflict=slug`,
  {
    method: 'POST',
    headers: {
      apikey: secretKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  },
);

if (!tableResponse.ok) {
  throw new Error(`Import tabella fallito: ${tableResponse.status} ${await tableResponse.text()}`);
}

const importedRows = await tableResponse.json();
console.log(
  dataOnly
    ? `Aggiornamento completato: ${importedRows.length} progetti.`
    : `Import completato: ${importedRows.length} progetti e ${uploaded} media.`,
);
