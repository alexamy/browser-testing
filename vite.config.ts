import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

function reloadPageOnHMR(): Plugin {
  return {
    name: 'full-reload',
    handleHotUpdate({ server }) {
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reloadPageOnHMR()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
});
