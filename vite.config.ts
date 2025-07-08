import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { browserTestsPlugin } from './src/Framework/vite-bt-plugin/viteBrowserTestsPlugin';

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
  plugins: [tsconfigPaths(), react(), reloadPageOnHMR(), browserTestsPlugin()],
  build: {
    minify: false,
    rollupOptions: {
      external: [/node_modules/],
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
});
