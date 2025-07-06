# Other ways to test components in the browser

- [Vitest + `happy-dom` / `jsdom`](#vitest--happy-dom--jsdom)
- [Vitest browser mode (experimental)](#vitest-browser-mode-experimental)
- [Storybook 9 interaction tests](#storybook-9-interaction-tests)
- [Playwright component testing (experimental)](#playwright-component-testing-experimental)

In almost all scenarios testing library is used:

- [Testing library React](https://testing-library.com/docs/react-testing-library/intro)
- [Testing library User event](https://testing-library.com/docs/user-event/intro)

## Vitest + `happy-dom` / `jsdom`

- [Vitest](https://vitest.dev/guide/)
- [happy-dom](https://github.com/capricorn86/happy-dom)

`vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
});
```

`vitest-setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`Counter.test.tsx`:

```tsx
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Counter } from './Counter';

afterEach(cleanup);

it('increments', async () => {
  const screen = render(<Counter start={0} />);

  const increment = screen.getByText('Inc');
  await userEvent.click(increment);

  const count = screen.getByText('Count: 1');
  expect(count).toBeInTheDocument();
});
```

## Vitest browser mode (experimental)

- [Vitest browser mode](https://vitest.dev/guide/browser/)

`vite.config.ts`:

```ts
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
```

`Counter.test.tsx`:

```tsx
import { expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Counter } from './Counter';

it('increments', async () => {
  const screen = render(<Counter start={0} />);

  const increment = screen.getByRole('button', { name: /Inc/ });
  await increment.click();

  const count = screen.getByText('Count: 1');
  await expect.element(count).toBeInTheDocument();
});
```

## Storybook 9 interaction tests

- [Here](https://storybook.js.org/docs/writing-tests/interaction-testing)

## Playwright component testing (experimental)

- [Here](https://playwright.dev/docs/test-components)
