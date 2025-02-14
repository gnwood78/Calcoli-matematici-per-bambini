import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  build: { // Questa sezione è IMPORTANTE per Vercel
    outDir: 'dist', // Specifica la cartella di output
  },
});