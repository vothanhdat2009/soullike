import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // để deploy GitHub Pages dưới /<repo>/
  build: { chunkSizeWarningLimit: 1500 },
});
