import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    testTimeout: 500,
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
