import { readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const mediaRoot = path.resolve('public/projects');
const minimumSize = 5 * 1024 * 1024;

async function findVideos(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return findVideos(absolute);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.mp4') ? [absolute] : [];
  }));
  return nested.flat();
}

function runFfmpeg(input, output) {
  const args = [
    '-y', '-hide_banner', '-loglevel', 'error', '-stats', '-i', input,
    '-vf', "scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '29',
    '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', output,
  ];

  return new Promise((resolve, reject) => {
    const process = spawn('ffmpeg', args, { stdio: 'inherit' });
    process.once('error', reject);
    process.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)));
  });
}

const videos = await findVideos(mediaRoot);

for (const video of videos) {
  const before = await stat(video);
  if (before.size < minimumSize) continue;

  const temporary = video.replace(/\.mp4$/i, '.optimized.mp4');
  console.log(`Optimizing ${path.relative(mediaRoot, video)} (${(before.size / 1024 / 1024).toFixed(1)} MiB)`);
  await runFfmpeg(video, temporary);

  const after = await stat(temporary);
  if (after.size < before.size) {
    await rename(temporary, video);
    console.log(`  -> ${(after.size / 1024 / 1024).toFixed(1)} MiB`);
  } else {
    await rm(temporary);
    console.log('  -> kept original');
  }
}
