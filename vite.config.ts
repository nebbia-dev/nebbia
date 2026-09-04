import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), sites()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    watch: process.env.CODEX_SANDBOX === 'seatbelt'
      ? { useFsEvents: false, usePolling: true }
      : undefined,
  },
});
