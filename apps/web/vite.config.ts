import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// `BASE` lets us deploy under a subpath on GitHub Pages (e.g. /savr/) while
// keeping `/` for local dev. Set with `BASE=/savr/ pnpm web:build`.
const base = process.env.BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@app/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@app/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@app/config': path.resolve(__dirname, '../../packages/config/src'),
      '@app/data': path.resolve(__dirname, '../../packages/data/src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
